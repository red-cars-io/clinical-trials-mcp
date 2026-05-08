import { handleTool } from './tool-handlers.js';
import { ClinicalTrialsAPI } from './clinicaltrials-api.js';

const api = new ClinicalTrialsAPI();

export const TOOLS = [
  {
    name: 'analyze_site_feasibility',
    description: 'Given an indication or therapeutic area, return a ranked feasibility brief with top sites, enrollment benchmarks, and risk flags.',
    inputJsonSchema: {
      type: 'object',
      properties: {
        indication: { type: 'string', description: "e.g., 'non-small cell lung cancer', 'Type 2 diabetes'" },
        phase: { type: 'string', description: "'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Any'" },
        sponsorType: { type: 'string', description: "'Industry', 'NIH', 'Other', 'Any'" },
        maxSites: { type: 'integer', default: 10 },
        geoRegion: { type: 'string', description: "e.g., 'United States', 'Europe'" },
      },
      required: ['indication'],
    },
    handler: async (args: Record<string, unknown>) => handleTool('analyze_site_feasibility', args as Record<string, unknown>, api),
    priceUsd: 0.15,
  },
  {
    name: 'get_trial_enrollment_trends',
    description: 'Analyze enrollment velocity trends for a specific trial NCT ID over time.',
    inputJsonSchema: {
      type: 'object',
      properties: {
        nctId: { type: 'string', description: "e.g., 'NCT05123482'" },
        quarters: { type: 'integer', default: 8 },
      },
      required: ['nctId'],
    },
    handler: async (args: Record<string, unknown>) => handleTool('get_trial_enrollment_trends', args as Record<string, unknown>, api),
    priceUsd: 0.08,
  },
  {
    name: 'compare_enrollment_benchmarks',
    description: 'Compare enrollment performance of a trial or site against indication-level benchmarks.',
    inputJsonSchema: {
      type: 'object',
      properties: {
        indication: { type: 'string' },
        phase: { type: 'string' },
        compareType: { type: 'string', enum: ['site', 'trial'] },
        target: { type: 'string' },
        dateFrom: { type: 'string' },
        dateTo: { type: 'string' },
      },
      required: ['indication', 'compareType', 'target'],
    },
    handler: async (args: Record<string, unknown>) => handleTool('compare_enrollment_benchmarks', args as Record<string, unknown>, api),
    priceUsd: 0.08,
  },
  {
    name: 'screen_eligibility_criteria',
    description: "Screen a patient profile against a trial's eligibility criteria to assess match likelihood.",
    inputJsonSchema: {
      type: 'object',
      properties: {
        nctId: { type: 'string' },
        patientProfile: {
          type: 'object',
          properties: {
            age: { type: 'integer' },
            sex: { type: 'string', enum: ['Male', 'Female', 'Any'] },
            diagnosis: { type: 'string' },
            priorTreatments: { type: 'string' },
            ecogStatus: { type: 'string' },
          },
          required: ['age', 'sex', 'diagnosis'],
        },
      },
      required: ['nctId', 'patientProfile'],
    },
    handler: async (args: Record<string, unknown>) => handleTool('screen_eligibility_criteria', args as Record<string, unknown>, api),
    priceUsd: 0.05,
  },
  {
    name: 'search_trials',
    description: 'Search ClinicalTrials.gov for trials matching criteria.',
    inputJsonSchema: {
      type: 'object',
      properties: {
        indication: { type: 'string' },
        phase: { type: 'string' },
        sponsorType: { type: 'string' },
        status: { type: 'string', enum: ['RECRUITING', 'COMPLETED', 'ACTIVE', 'ANY'] },
        geoLocation: { type: 'string' },
        maxResults: { type: 'integer', default: 25 },
      },
    },
    handler: async (args: Record<string, unknown>) => handleTool('search_trials', args as Record<string, unknown>, api),
    priceUsd: 0.05,
  },
];