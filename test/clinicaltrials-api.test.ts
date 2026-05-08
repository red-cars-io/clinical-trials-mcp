import { describe, it, expect } from 'vitest';
import { ClinicalTrialsAPI } from '../src/clinicaltrials-api';

describe('ClinicalTrialsAPI', () => {
  it('searchStudies returns studies array', async () => {
    const api = new ClinicalTrialsAPI();
    const result = await api.searchStudies({ indication: 'lung cancer', maxResults: 3 });
    expect(result.studies).toBeDefined();
    expect(Array.isArray(result.studies)).toBe(true);
  });

  it('getStudy returns study with nctId', async () => {
    const api = new ClinicalTrialsAPI();
    const result = await api.getStudy('NCT05123482');
    expect(result.nctId).toBe('NCT05123482');
  });
});