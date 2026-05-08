# ClinicalTrials.gov Intelligence MCP

Site feasibility intelligence for AI agents. Analyze clinical trial site feasibility, enrollment velocity, eligibility criteria, and benchmark performance across ClinicalTrials.gov's registry of 500,000+ clinical studies — via a structured MCP interface designed for AI agent consumption.

**MCP Endpoint:** https://clinical-trials-mcp.apify.actor/mcp
**GitHub:** [red-cars-io/clinical-trials-mcp](https://github.com/red-cars-io/clinical-trials-mcp)
**API:** ClinicalTrials.gov API v2 — no API key required.

---

## 1. Quick Start

Add this MCP server to Claude Desktop, Cursor, or Windsurf:

```json
{
  "mcpServers": {
    "clinical-trials": {
      "command": "npx",
      "args": ["-y", "@apify/clinical-trials-mcp"]
    }
  }
}
```

Or connect via the remote MCP endpoint for zero-setup connectivity:

```json
{
  "mcpServers": {
    "clinical-trials": {
      "url": "https://clinical-trials-mcp.apify.actor/mcp"
    }
  }
}
```

Verify connectivity with a test call to `search_trials`:

```bash
curl -X POST https://clinical-trials-mcp.apify.actor/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"search_trials","arguments":{"indication":"non-small cell lung cancer","maxResults":5}},"id":1}'
```

---

## 2. What Data Can You Access?

| Data Source | Endpoint | Covers |
|-------------|----------|--------|
| ClinicalTrials.gov API v2 | `clinicaltrials.gov/api/v2/studies` | Trial registry: eligibility, enrollment, locations, status, phase, sponsor |
| Trial metadata | Derived from API | Feasibility scores, enrollment velocity, eligibility match rates |

The ClinicalTrials.gov API v2 returns structured study objects with enrollment counts, site locations, eligibility criteria, phase, and sponsor type. The actor enriches this raw data with computed feasibility scores, enrollment velocity trends, and eligibility match grades — structured for AI agent consumption, not raw API dumps.

---

## 3. Why Use ClinicalTrials Intelligence MCP?

- **Site feasibility intelligence** — rank clinical trial sites by enrollment velocity, eligibility score, and geographic diversity in a single call. No manual API navigation.
- **Patient eligibility screening** — pass a patient profile (age, sex, diagnosis, ECOG status) and get an eligibility match rate against a trial's criteria.
- **Enrollment trend analysis** — track quarterly enrollment velocity for any NCT ID to project completion timelines.
- **Benchmark comparison** — compare a site or trial against indication-level enrollment benchmarks with percentile rankings.
- **No API key required** — ClinicalTrials.gov API v2 is open. Zero credentials to manage.
- **LLM-optimized JSON output** — every tool returns structured data with verdicts, risk flags, and confidence signals.
- **Pay-per-event pricing** — $0.05 to $0.15 per tool call. No subscription, no minimum spend.
- **Deployed on Apify with standby mode** — responds in milliseconds, scales automatically.

---

## 4. Features

- Analyze site feasibility for any indication with ranked site list, enrollment velocity, and eligibility scores
- Track quarterly enrollment trends for any NCT ID with trend direction and projected completion date
- Compare enrollment performance against indication-level benchmarks with percentile rankings
- Screen a patient profile against a trial's eligibility criteria with a match grade and critical flags
- Search the ClinicalTrials.gov registry with filters for indication, phase, sponsor type, status, and location
- LLM agent-ready output format — structured JSON with verdicts, risk flags, and confidence signals
- No authentication — ClinicalTrials.gov API v2 handled server-side
- Standalone MCP server — connects to any MCP-compatible AI agent client
- Deployed on Apify with standby mode — responds in milliseconds

---

## 5. Use Cases

### Pharma Business Development — Site Feasibility

Identify the best sites for an oncology trial before initiating a feasibility survey.

```json
{
  "tool": "analyze_site_feasibility",
  "parameters": {
    "indication": "non-small cell lung cancer",
    "phase": "Phase 3",
    "sponsorType": "Industry",
    "maxSites": 10,
    "geoRegion": "United States"
  }
}
```

### Clinical Operations — Enrollment Tracking

Monitor enrollment velocity for an active trial and project completion date.

```json
{
  "tool": "get_trial_enrollment_trends",
  "parameters": {
    "nctId": "NCT05123482",
    "quarters": 8
  }
}
```

### Clinical Operations — Benchmark Analysis

Compare a site's enrollment against the indication-level benchmark to assess competitiveness.

```json
{
  "tool": "compare_enrollment_benchmarks",
  "parameters": {
    "indication": "Type 2 diabetes",
    "phase": "Phase 2",
    "compareType": "site",
    "target": "Mayo Clinic"
  }
}
```

### Clinical Operations — Eligibility Screening

Assess whether a patient profile meets a trial's eligibility criteria before screen failure.

```json
{
  "tool": "screen_eligibility_criteria",
  "parameters": {
    "nctId": "NCT05123482",
    "patientProfile": {
      "age": 58,
      "sex": "Male",
      "diagnosis": "non-small cell lung cancer",
      "priorTreatments": "pemetrexed + carboplatin",
      "ecogStatus": "1"
    }
  }
}
```

### Investment Analysis — Trial Search

Map the competitive landscape for an indication: count active trials, enrollment, and geographic spread.

```json
{
  "tool": "search_trials",
  "parameters": {
    "indication": "Alzheimer's disease",
    "phase": "Phase 2",
    "status": "RECRUITING",
    "maxResults": 25
  }
}
```

---

## 6. How to Connect

**Step 1:** Add the MCP server configuration to your AI agent client (Claude Desktop, Cursor, or Windsurf).

**Step 2:** Use the remote endpoint `https://clinical-trials-mcp.apify.actor/mcp` for zero-setup connectivity, or install via `npx @apify/clinical-trials-mcp`.

**Step 3:** Verify connectivity by calling `search_trials` with a test indication.

**Step 4:** Call any of the 5 tools to access ClinicalTrials.gov data. No API key needed.

---

## 7. MCP Tools Reference

| Tool | Price | Best for |
|------|-------|----------|
| `analyze_site_feasibility` | $0.15 | Ranking sites by enrollment velocity, eligibility score, and geographic diversity |
| `get_trial_enrollment_trends` | $0.08 | Tracking quarterly enrollment velocity and projecting completion date |
| `compare_enrollment_benchmarks` | $0.08 | Comparing site or trial enrollment against indication-level benchmarks |
| `screen_eligibility_criteria` | $0.05 | Matching a patient profile against a trial's eligibility criteria |
| `search_trials` | $0.05 | Searching the ClinicalTrials.gov registry with multi-filter support |

---

## 8. Tool Parameters

### analyze_site_feasibility

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `indication` | string | Yes | Therapeutic area or disease (e.g., `non-small cell lung cancer`, `Type 2 diabetes`) |
| `phase` | string | No | `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, or `Any` |
| `sponsorType` | string | No | `Industry`, `NIH`, `Other`, or `Any` |
| `maxSites` | integer | No | Maximum number of sites to return (default: 10) |
| `geoRegion` | string | No | Geographic filter (e.g., `United States`, `Europe`) |

### get_trial_enrollment_trends

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nctId` | string | Yes | NCT ID of the trial (e.g., `NCT05123482`) |
| `quarters` | integer | No | Number of quarters to analyze (default: 8, max: 20) |

### compare_enrollment_benchmarks

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `indication` | string | Yes | Therapeutic area |
| `phase` | string | No | Phase filter |
| `compareType` | string | Yes | `site`, `trial`, or `indication` |
| `target` | string | No | Site name or trial NCT ID to compare |
| `dateFrom` | string | No | Start date filter (ISO format) |
| `dateTo` | string | No | End date filter (ISO format) |

### screen_eligibility_criteria

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nctId` | string | Yes | NCT ID of the trial |
| `patientProfile` | object | Yes | Patient profile (see below) |

**patientProfile object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `age` | integer | Yes | Patient age in years |
| `sex` | string | Yes | `Male`, `Female`, or `Any` |
| `diagnosis` | string | Yes | Patient diagnosis |
| `priorTreatments` | string | No | Prior treatment history |
| `ecogStatus` | string | No | ECOG performance status (0–5) |

### search_trials

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `indication` | string | No | Therapeutic area |
| `phase` | string | No | Phase filter |
| `sponsorType` | string | No | Sponsor type filter |
| `status` | string | No | `RECRUITING`, `COMPLETED`, `ACTIVE`, or `ANY` |
| `geoLocation` | string | No | Location filter |
| `maxResults` | integer | No | Maximum results (default: 25) |
| `dateFrom` | string | No | Start date filter |
| `dateTo` | string | No | End date filter |

---

## 9. Connection Examples

### Claude Desktop

```json
{
  "mcpServers": {
    "clinical-trials": {
      "url": "https://clinical-trials-mcp.apify.actor/mcp"
    }
  }
}
```

### cURL (MCP protocol)

```bash
curl -X POST https://clinical-trials-mcp.apify.actor/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"search_trials","arguments":{"indication":"non-small cell lung cancer","maxResults":5}},"id":1}'
```

### Cursor

Add to Cursor AI settings under MCP Servers using the remote endpoint URL.

### Windsurf

Add to Windsurf MCP settings using the same remote endpoint configuration.

---

## 10. Output Example — analyze_site_feasibility

```json
{
  "query": "non-small cell lung cancer",
  "studies_matched": 12,
  "feasibility_brief": {
    "executive_summary": "Found 12 trials with 8 site locations for 'non-small cell lung cancer'. Feasibility score: 68/100 (Medium).",
    "ranked_sites": [
      {
        "rank": 1,
        "site_name": "Boston, MA, United States",
        "location": "Boston, MA, United States",
        "nct_id": "NCT05123482",
        "enrollment": 248,
        "enrollment_rate": 2.07,
        "eligibility_score": 90,
        "contact_info": "Dr. Jane Smith | jsmith@hospital.edu"
      },
      {
        "rank": 2,
        "site_name": "Houston, TX, United States",
        "location": "Houston, TX, United States",
        "nct_id": "NCT05123482",
        "enrollment": 195,
        "enrollment_rate": 1.63,
        "eligibility_score": 85,
        "contact_info": "Dr. John Doe | jdoe@hospital.edu"
      }
    ],
    "geo_analysis": {
      "sites_analyzed": 8,
      "geo_diversity_score": 72,
      "latitude_range": { "min": 29.76, "max": 42.36 }
    },
    "risk_flags": [],
    "feasibility_score": 68,
    "feasibility_band": "Medium"
  }
}
```

---

## 11. Output Example — screen_eligibility_criteria

```json
{
  "nct_id": "NCT05123482",
  "brief_title": "A Study of Pemetrexed + Carboplatin in Non-Small Cell Lung Cancer",
  "eligibility_result": {
    "total_criteria": 10,
    "meets_criteria": 7,
    "fails_criteria": 0,
    "unknown_criteria": 3,
    "match_rate": 70,
    "match_grade": "Partial Match",
    "flagged_criteria": [],
    "meets_all_critical": true
  },
  "verdict": "Patient meets all critical eligibility criteria for NCT05123482.",
  "source": "ClinicalTrials.gov API"
}
```

---

## 12. Output Fields Explained

| Field | Description |
|-------|-------------|
| `feasibility_score` | Composite 0–100 score combining enrollment rate, eligibility score, and geographic diversity. Higher = more feasible. |
| `feasibility_band` | `High` (75+), `Medium` (50–74), or `Low` (below 50) |
| `enrollment_rate` | Monthly enrollment velocity: (enrollment count / trial duration in days) × 30 |
| `eligibility_score` | Percentage of eligibility criteria fields populated in the trial record |
| `geo_diversity_score` | 0–100 score based on latitude spread of site locations |
| `match_rate` | Percentage of eligibility criteria the patient profile satisfies |
| `match_grade` | `Strong Match` (80%+), `Partial Match` (50–79%), or `Low Match` (below 50%) |
| `trend_direction` | `increasing`, `decreasing`, `stable`, or `insufficient_data` |
| `percentile` | Target site's percentile rank against all sites for the indication |

---

## 13. Pricing

All tools use Apify Pay-Per-Event (PPE) pricing. No monthly fee, no subscription, no minimum spend.

| Tool | Price per call |
|------|---------------|
| `analyze_site_feasibility` | $0.15 |
| `get_trial_enrollment_trends` | $0.08 |
| `compare_enrollment_benchmarks` | $0.08 |
| `screen_eligibility_criteria` | $0.05 |
| `search_trials` | $0.05 |

View on Apify Store: [ClinicalTrials.gov Intelligence MCP](https://apify.com/store/mcp/clinical-trials-mcp)

---

## 14. How It Works

The ClinicalTrials.gov Intelligence MCP runs as an Apify Standby Actor with a full MCP protocol interface. When an AI agent calls a tool:

1. **Request received** — MCP JSON-RPC call hits the standby endpoint
2. **ClinicalTrials.gov API query** — actor queries the `clinicaltrials.gov/api/v2/studies` endpoint with the tool parameters
3. **Enrichment and scoring** — enrollment rates, feasibility scores, eligibility match rates, and trend deltas are computed server-side
4. **JSON response** — structured output with verdicts, risk flags, and percentile rankings returned to the AI agent via MCP protocol

Data flows directly from ClinicalTrials.gov API v2 through the actor to the AI agent. No data is stored. No API key required — the actor handles all API communication server-side.

---

## 15. Tips for Best Results

- **Use specific indications** — `indication` filters are the most precise way to isolate trial populations. Use disease names, not drug names.
- **Increase maxSites for site feasibility** — `maxSites: 20` gives a fuller picture of the site landscape before selecting a subset for outreach.
- **Check eligibility before screen** — run `screen_eligibility_criteria` before sending a patient for screening to avoid costly screen failures.
- **Use enrollment trends for projections** — `get_trial_enrollment_trends` with 8 quarters gives the most reliable completion date projection.
- **Combine with FDA MAUDE for due diligence** — pair `analyze_site_feasibility` with the FDA MAUDE Intelligence MCP to cross-reference site safety profiles before initiating contact.
- **Set status filter to RECRUITING** — when identifying active enrollment opportunities, filter `status: "RECRUITING"` to surface only actively enrolling trials.

---

## 16. Rate Limits

- **ClinicalTrials.gov API v2** allows up to 10 requests per second per IP address
- **Apify platform** handles retry logic and rate limiting automatically
- For high-volume use cases, consider batching requests rather than firing concurrent calls
- The actor is stateless — each tool call is independent

---

## 17. Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `Trial NCT_ID not found` | Invalid or retired NCT ID | Verify the NCT ID format (`NCT` + 8 digits) and try again |
| `No trials found for indication` | Indication string too specific | Try a broader term (e.g., `lung cancer` instead of `non-small cell lung cancer`) |
| `Patient profile missing required fields` | Age, sex, or diagnosis not provided | Ensure `patientProfile` includes all required fields |
| `Rate limit exceeded` | Too many concurrent requests | Wait 1–2 seconds and retry; the actor handles retries automatically |

---

## 18. FAQ

**Q: Do I need an API key?**
A: No. ClinicalTrials.gov API v2 is open and requires no authentication. The actor handles all API communication server-side.

**Q: What is the difference between `analyze_site_feasibility` and `compare_enrollment_benchmarks`?**
A: `analyze_site_feasibility` returns a ranked list of sites for a given indication with enrollment velocity scores. `compare_enrollment_benchmarks` returns statistical benchmarks (median, p25, p75 enrollment) for an indication and tells you how a specific site or trial compares to those benchmarks.

**Q: How accurate is the eligibility screening?**
A: The eligibility screening uses keyword matching on the trial's eligibility criteria text and structured field checks (age, sex). It is a preliminary screening aid, not a substitute for clinical review. Criteria involving lab values, specific biomarkers, or complex medical histories may not be fully captured by keyword matching.

**Q: Can I screen multiple patient profiles against the same trial in one call?**
A: Not currently — each call screens a single patient profile. For bulk screening, call `screen_eligibility_criteria` in a loop.

**Q: How are enrollment trends generated if the trial doesn't report quarterly data?**
A: The actor simulates quarterly enrollment distributions based on total enrollment and trial duration. This is a modeling approach — actual trial data may differ. For trials that report actual enrollment updates, the trend is computed from the modeled distribution.

**Q: What NCT ID formats are supported?**
A: The standard ClinicalTrials.gov format: `NCT` followed by 8 digits (e.g., `NCT05123482`).

**Q: Does this work for trials outside the United States?**
A: Yes. ClinicalTrials.gov includes trials from 220+ countries. Use the `geoRegion` filter or `geoLocation` parameter to scope results geographically.

---

## 19. Architecture

```
AI Agent
    │
    │ MCP JSON-RPC
    ▼
Apify Standby Actor (clinical-trials-mcp)
    │
    ├── src/main.ts          — MCP gateway, handles handleRequest
    ├── src/tools.ts         — Tool definitions with input schemas
    ├── src/tool-handlers.ts — Tool logic (5 handlers)
    ├── src/clinicaltrials-api.ts — ClinicalTrials.gov API v2 client
    └── src/scoring.ts      — Feasibility, enrollment, eligibility scoring
           │
           ▼
    ClinicalTrials.gov API v2
    (https://clinicaltrials.gov/api/v2/studies)
```

The actor is deployed as an Apify Standby Actor, which means it runs continuously and responds to MCP requests without cold-start latency. The MCP gateway (`main.ts`) handles protocol translation between the MCP JSON-RPC format and the actor's internal tool calls.

---

## 20. Deployment

The actor is deployed on Apify with standby mode enabled. The deployment process:

1. **GitHub push** — code pushed to `red-cars-io/clinical-trials-mcp`
2. **Apify auto-build** — Apify detects the push and builds the Docker image
3. **Standby mode** — actor is always-on, no cold starts
4. **MCP endpoint** — `https://clinical-trials-mcp.apify.actor/mcp`

To redeploy after code changes:
```bash
cd ~/Projects/apify-actors/clinical-trials-mcp
git add .
git commit -m "chore: update clinical-trials-mcp"
git push origin master
```

---

## 21. Configuration

The actor requires no environment variables or secrets. All configuration is passed via tool parameters at runtime.

**Apify Actor settings:**
- `APIFY_API_TOKEN` — only needed if you want to manage the actor via Apify API
- `INPUT_SCHEMA.json` — defines the MCP tool call interface

**Tool parameters** are passed at runtime per tool call (see Section 8 for full parameter reference for each tool).

---

## 22. Combine with Other Actors

ClinicalTrials.gov Intelligence MCP pairs with related actors for deeper clinical development intelligence:

**FDA MAUDE Intelligence MCP** — cross-reference site-level adverse event history before initiating site contact. MAUDE data surfaces device-related adverse events at specific facilities.

**Healthcare Compliance MCP** — expands clinical trial findings into full regulatory compliance context covering FDA 483 observations, warning letters, and import alerts for the sponsor organization.

**Drug Intelligence MCP** — links clinical trial results (recruitment, enrollment velocity) to drug label expansions and regulatory milestone timelines.

Run all three in a single agent session for a complete clinical development and site selection profile.

---

## 23. Related Actors

- [FDA MAUDE Intelligence MCP](https://apify.com/store/mcp/fda-maude-intelligence-mcp) — adverse event benchmarking for medtech and device companies
- [Healthcare Compliance MCP](https://apify.com/store/mcp/healthcare-compliance-mcp) — FDA regulatory compliance for device and pharma companies
- [Drug Intelligence MCP](https://apify.com/store/mcp/drug-intelligence-mcp) — drug label, NDC, and regulatory milestone intelligence

---

## 24. Troubleshooting

**MCP connection fails**
Verify the remote endpoint URL is correct: `https://clinical-trials-mcp.apify.actor/mcp`. Check that your AI agent client supports remote MCP servers.

**No data returned**
ClinicalTrials.gov API may return empty results for very specific indication strings. Try broadening the indication (e.g., `lung cancer` instead of `non-small cell lung cancer`).

**Eligibility screening returns 0 matches**
Check that the patient profile has all required fields (`age`, `sex`, `diagnosis`). The `diagnosis` field is matched against the trial's eligibility criteria text — if the wording differs from what is in the criteria text, it may register as a non-match.

**Enrollment trend seems inaccurate**
Enrollment trends are modeled based on total enrollment and trial duration when actual quarterly data is not available. For trials with explicit enrollment updates, the model may not reflect the most recent state.

---

## 25. SEO and LLM Optimization

**Meta description:** AI agent MCP server for clinical trial site feasibility analysis. Analyze enrollment velocity, eligibility criteria, and benchmark performance via ClinicalTrials.gov API v2. No API key required.

**Keywords:** AI agent, LLM, MCP server, clinical trials, site feasibility, enrollment analysis, eligibility screening, ClinicalTrials.gov, clinical operations, pharma BD, clinical research, patient recruitment, trial benchmarking, no API key needed, 临床试验, 临床试验网站可行性, 患者筛选, 医疗器械

**JSON-LD Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ClinicalTrials.gov Intelligence MCP",
  "description": "AI agent MCP server for clinical trial site feasibility analysis. Analyze enrollment velocity, eligibility criteria, and benchmark performance via ClinicalTrials.gov API v2.",
  "url": "https://apify.com/store/mcp/clinical-trials-mcp",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0.05",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "unitCode": "EACH"
    }
  },
  "provider": {
    "@type": "Organization",
    "name": "red-cars-io",
    "url": "https://github.com/red-cars-io"
  }
}
```

**GitHub topics:** `mcp-server` `clinical-trials` `clinical-operations` `pharma` `clinical-research` `site-feasibility` `enrollment-analysis` `eligibility-screening` `ai-agent` `llm-tools` `apify` `healthcare` `clinicaltrials-gov`

---

## 26. Contributing

Contributions are welcome. Please ensure all tool changes include updated input schemas and that existing tests pass before opening a PR.

```bash
# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

---

## 27. License

ISC

---

## 28. Contact

- **GitHub:** [red-cars-io/clinical-trials-mcp](https://github.com/red-cars-io/clinical-trials-mcp)
- **Apify Store:** [ClinicalTrials.gov Intelligence MCP](https://apify.com/store/mcp/clinical-trials-mcp)
- **Organization:** [red-cars-io](https://github.com/red-cars-io)

---

## Appendix A: Output Schema Summary

### analyze_site_feasibility

```json
{
  "query": "string",
  "studies_matched": "number",
  "feasibility_brief": {
    "executive_summary": "string",
    "ranked_sites": [
      {
        "rank": "number",
        "site_name": "string",
        "location": "string",
        "nct_id": "string",
        "enrollment": "number",
        "enrollment_rate": "number",
        "eligibility_score": "number",
        "contact_info": "string",
        "latitude": "number",
        "longitude": "number"
      }
    ],
    "geo_analysis": {
      "sites_analyzed": "number",
      "geo_diversity_score": "number",
      "latitude_range": { "min": "number", "max": "number" }
    },
    "risk_flags": ["string"],
    "feasibility_score": "number",
    "feasibility_band": "High|Medium|Low"
  }
}
```

### get_trial_enrollment_trends

```json
{
  "nct_id": "string",
  "brief_title": "string",
  "phase": "string",
  "enrollment_actual": "number",
  "enrollment_target": "number",
  "quarters_analyzed": "number",
  "trend": [{ "quarter": "string", "enrollment": "number", "delta_pct": "number|null" }],
  "trend_direction": "increasing|decreasing|stable|insufficient_data",
  "avg_monthly_enrollment": "number",
  "projected_completion": "string",
  "verdict": "string",
  "source": "ClinicalTrials.gov API"
}
```

### compare_enrollment_benchmarks

```json
{
  "query": "string",
  "benchmark": {
    "indication": "string",
    "phase": "string",
    "avg_enrollment": "number",
    "median_enrollment": "number",
    "p25_enrollment": "number",
    "p75_enrollment": "number",
    "avg_enrollment_rate": "number",
    "trial_count": "number"
  },
  "target_performance": {
    "name": "string",
    "enrollment": "number",
    "enrollment_rate": "number",
    "enrollment_vs_avg_pct": "number",
    "enrollment_vs_median_pct": "number",
    "rate_vs_avg_pct": "number",
    "percentile": "number"
  },
  "verdict": "string",
  "source": "ClinicalTrials.gov API"
}
```

### screen_eligibility_criteria

```json
{
  "nct_id": "string",
  "brief_title": "string",
  "eligibility_result": {
    "total_criteria": "number",
    "meets_criteria": "number",
    "fails_criteria": "number",
    "unknown_criteria": "number",
    "match_rate": "number",
    "match_grade": "Strong Match|Partial Match|Low Match",
    "flagged_criteria": [{ "criterion": "string", "patient_status": "string", "impact": "string" }],
    "meets_all_critical": "boolean"
  },
  "verdict": "string",
  "source": "ClinicalTrials.gov API"
}
```

### search_trials

```json
{
  "query": "string",
  "total_trials": "number",
  "trials": [
    {
      "nct_id": "string",
      "brief_title": "string",
      "phase": "string",
      "status": "string",
      "enrollment": "number",
      "enrollment_type": "string",
      "start_date": "string",
      "primary_completion_date": "string",
      "location": "string",
      "sponsor": "string",
      "eligibility_criteria_summary": "string"
    }
  ],
  "source": "ClinicalTrials.gov API"
}
```

---

## Appendix B: ClinicalTrials.gov API v2 Notes

- **Base URL:** `https://clinicaltrials.gov/api/v2/studies`
- **No authentication required** — public API
- **Rate limit:** 10 requests per second per IP
- **Response format:** JSON by default; XML available via `?format=xml`
- **Study fields available:** nctId, briefTitle, phase, status, enrollment, enrollmentType, startDate, primaryCompletionDate, sponsor, locations, eligibility, contacts

For full API documentation, visit: [ClinicalTrials.gov API v2 Documentation](https://clinicaltrials.gov/data-api/api)
