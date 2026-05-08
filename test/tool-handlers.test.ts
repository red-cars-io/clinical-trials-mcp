import { describe, it, expect, beforeEach } from 'vitest';
import { handleTool } from '../src/tool-handlers';
import { ClinicalTrialsAPI } from '../src/clinicaltrials-api';

describe('Tool Handlers', () => {
  let api: ClinicalTrialsAPI;

  beforeEach(() => {
    api = new ClinicalTrialsAPI();
  });

  describe('analyze_site_feasibility', () => {
    it('returns feasibility brief structure', async () => {
      const result = await handleTool('analyze_site_feasibility', {
        indication: 'non-small cell lung cancer',
        maxSites: 3,
      }, api);
      expect(result).toHaveProperty('query');
      expect(result).toHaveProperty('studies_matched');
      expect(result).toHaveProperty('feasibility_brief');
      expect(result.feasibility_brief).toHaveProperty('ranked_sites');
      expect(result.feasibility_brief).toHaveProperty('feasibility_score');
    });
  });

  describe('get_trial_enrollment_trends', () => {
    it('returns trend structure', async () => {
      const result = await handleTool('get_trial_enrollment_trends', {
        nctId: 'NCT05123482',
        quarters: 4,
      }, api);
      expect(result).toHaveProperty('nct_id');
      expect(result).toHaveProperty('trend');
      expect(result).toHaveProperty('trend_direction');
    });
  });

  describe('compare_enrollment_benchmarks', () => {
    it('returns benchmark comparison structure', async () => {
      const result = await handleTool('compare_enrollment_benchmarks', {
        indication: 'non-small cell lung cancer',
        compareType: 'site',
        target: 'MD Anderson Cancer Center',
      }, api);
      expect(result).toHaveProperty('benchmark');
      expect(result).toHaveProperty('target_performance');
    });
  });

  describe('screen_eligibility_criteria', () => {
    it('returns eligibility screening result', async () => {
      const result = await handleTool('screen_eligibility_criteria', {
        nctId: 'NCT05123482',
        patientProfile: { age: 55, sex: 'Male', diagnosis: 'NSCLC' },
      }, api);
      expect(result).toHaveProperty('eligibility_result');
      expect(result.eligibility_result).toHaveProperty('match_rate');
    });
  });

  describe('search_trials', () => {
    it('returns trial list structure', async () => {
      const result = await handleTool('search_trials', {
        indication: 'lung cancer',
        maxResults: 5,
      }, api);
      expect(result).toHaveProperty('trials');
      expect(result).toHaveProperty('total_trials');
    });
  });
});
