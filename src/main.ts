import http from 'http';
import { Actor } from 'apify';
import { TOOLS } from './tools.js';
import { handleTool } from './tool-handlers.js';
import { ClinicalTrialsAPI } from './clinicaltrials-api.js';

const api = new ClinicalTrialsAPI();

// handleRequest must be exported for MCP standby mode
export const handleRequest = async (req: { toolName: string; arguments: Record<string, unknown> }) => {
    const { toolName, arguments: args } = req;
    const tool = TOOLS.find((t) => t.name === toolName);
    if (!tool) {
        return {
            content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${toolName}` }) }],
            isError: true,
        };
    }
    try {
        await Actor.charge({ eventName: tool.name });
        const result = await handleTool(toolName, args, api);
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

async function main() {
    await Actor.init();

    const server = http.createServer((req, res) => {
        // Readiness probe
        if (req.headers['x-apify-container-server-readiness-probe']) {
            res.writeHead(200);
            res.end('ok');
            return;
        }

        // MCP JSON-RPC endpoint
        if (req.method === 'POST' && req.url === '/mcp') {
            let body = '';
            req.on('data', (chunk: string) => { body += chunk; });
            req.on('end', async () => {
                try {
                    const jsonBody = JSON.parse(body);
                    const id = jsonBody.id ?? null;

                    const reply = (result: unknown) => {
                        const resp = id !== null
                            ? { jsonrpc: '2.0', id, result }
                            : result;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(resp));
                    };

                    const replyError = (code: number, message: string) => {
                        const resp = id !== null
                            ? { jsonrpc: '2.0', id, error: { code, message } }
                            : { status: 'error', error: message };
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(resp));
                    };

                    const method = jsonBody.method;
                    const params = jsonBody.params || {};

                    if (method === 'initialize') {
                        return reply({
                            protocolVersion: '2024-11-05',
                            capabilities: { tools: {} },
                            serverInfo: { name: 'clinical-trials-mcp', version: '0.0.1' }
                        });
                    }

                    if (method === 'tools/list' || (!method && jsonBody.tool === 'list')) {
                        return reply({ tools: TOOLS });
                    }

                    if (method === 'tools/call') {
                        const toolName = params.name;
                        const toolArgs = (params.arguments || {}) as Record<string, unknown>;
                        if (!toolName) return replyError(-32602, 'Missing params.name');

                        // Support flat params: top-level fields from Apify input schema
                        const resolvedArgs: Record<string, unknown> = {
                            ...toolArgs,
                            indication: toolArgs.indication ?? jsonBody.indication,
                            nctId: toolArgs.nctId ?? jsonBody.nctId,
                            phase: toolArgs.phase ?? jsonBody.phase,
                            status: toolArgs.status ?? jsonBody.status,
                            geoLocation: toolArgs.geoLocation ?? jsonBody.geoLocation,
                            maxResults: toolArgs.maxResults ?? jsonBody.maxResults,
                            dateFrom: toolArgs.dateFrom ?? jsonBody.dateFrom,
                            dateTo: toolArgs.dateTo ?? jsonBody.dateTo,
                            compareType: toolArgs.compareType ?? jsonBody.compareType,
                            target: toolArgs.target ?? jsonBody.target,
                            patientProfile: toolArgs.patientProfile ?? jsonBody.patientProfile,
                        };

                        const result = await handleTool(toolName, resolvedArgs, api);
                        return reply({ content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] });
                    }

                    if (method && method.startsWith('tools/')) {
                        const toolName = method.slice(6);
                        const toolArgs = params as Record<string, unknown>;
                        const result = await handleTool(toolName, toolArgs, api);
                        return reply({ content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] });
                    }

                    // Apify input schema mode: flat params at top level
                    if (jsonBody.tool) {
                        const flatParams: Record<string, unknown> = {
                            ...(jsonBody.params || {}),
                            indication: jsonBody.indication,
                            nctId: jsonBody.nctId,
                            phase: jsonBody.phase,
                            status: jsonBody.status,
                            geoLocation: jsonBody.geoLocation,
                            maxResults: jsonBody.maxResults,
                            dateFrom: jsonBody.dateFrom,
                            dateTo: jsonBody.dateTo,
                            compareType: jsonBody.compareType,
                            target: jsonBody.target,
                            patientProfile: jsonBody.patientProfile,
                        };
                        const result = await handleTool(jsonBody.tool, flatParams, api);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'success', result }));
                        return;
                    }

                    replyError(-32601, `Method not found: ${method}`);
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : String(error);
                    console.error('MCP error:', message);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error', error: message }));
                }
            });
            return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    });

    const PORT = Actor.config.get('standbyPort') || 3000;
    server.listen(PORT, () => {
        console.log(`ClinicalTrials Intelligence MCP listening on port ${PORT}`);
    });

    process.on('SIGTERM', () => { server.close(() => process.exit(0)); });

    // Batch mode (Apify input schema: tool + params)
    // Only process batch input if a tool is explicitly provided.
    // In standby MCP mode, tool calls come via HTTP — not through Actor.getInput()
    const input = await Actor.getInput() as { tool?: string; params?: Record<string, unknown> } | null;
    if (input?.tool) {
        console.log(`Running tool: ${input.tool}`);
        const result = await handleTool(input.tool, input.params || {}, api);
        await Actor.setValue('OUTPUT', result);
        await Actor.exit();
    }
}

main().catch(console.error);