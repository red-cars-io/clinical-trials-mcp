# Clinical Trials MCP Agent

**Type**: Apify MCP Actor (TypeScript)
**Purpose**: Search ClinicalTrials.gov for clinical trial data
**Stack**: Apify SDK, CheerioCrawler, MCP protocol, standby mode

## Quick Start

```bash
cd ~/Projects/apify-actors/clinical-trials-mcp
apify run          # Local development
apify push         # Deploy to Apify
```

## Key Files

- `src/main.ts` — MCP handler entry point with `handleRequest` export
- `.actor/actor.json` — Standby mode enabled (`usesStandbyMode: true`)
- `.actor/input_schema.json` — 8 tool definitions
- `README.md` — Auto-generated on build

## MCP Tools

1. `search_trials` — Search ClinicalTrials.gov
2. `get_study` — Get study details by NCT ID
3. `get_locations` — Get trial locations
4. `get_eligibility` — Get eligibility criteria
5. `get_contacts` — Get contact information
6. `get_results` — Get results if available
7. `get_interventions` — Get intervention details
8. `get_conditions` — Get conditions hierarchy

## Architecture

- Standby MCP via `handleRequest` export
- Readiness probe at GET / (checks `x-apify-container-server-readiness-probe` header)
- Uses Apify SDK log package (`apify/log`) — censors sensitive data
- PPE configured: $0.03-0.15 per tool

## Notes

- Read `.actor/input_schema.json` for full tool definitions
- Health check cron: `~/bin/fleet-health.sh`
- Deployed at: `red-cars--clinical-trials-mcp.apify.actor`