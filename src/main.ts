import http from 'http';
import { Actor } from 'apify';
import { TOOLS } from './tools.js';
import { handleTool } from './tool-handlers.js';
import { ClinicalTrialsAPI } from './clinicaltrials-api.js';

const api = new ClinicalTrialsAPI();

interface McpRequest {
  toolName: string;
  arguments: Record<string, unknown>;
}

async function main() {
  await Actor.init();

  // handleRequest must be exported for MCP standby mode
  const handleRequest = async (req: McpRequest) => {
    const { toolName, arguments: args } = req;
    const tool = TOOLS.find((t) => t.name === toolName);

    if (!tool) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${toolName}` }) }],
        isError: true,
      };
    }

    try {
      await Actor.charge({ eventName: tool.name, count: 1 });
      const result = await handleTool(toolName, args as Record<string, unknown>, api);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: String(err) }) }],
        isError: true,
      };
    }
  };

  // Export for MCP gateway
  module.exports = { handleRequest };

  // HTTP server for readiness probe
  const server = http.createServer((req, res) => {
    if (req.headers['x-apify-container-server-readiness-probe']) {
      res.writeHead(200);
      res.end('ok');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ClinicalTrials Intelligence MCP ready\n');
  });

  const port = Actor.config.get('standbyPort') || process.env.APIFY_CONTAINER_PORT || 3000;
  server.listen(port);

  console.log(`ClinicalTrials Intelligence MCP ready on port ${port}`);
}

main();