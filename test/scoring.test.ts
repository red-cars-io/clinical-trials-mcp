import { describe, it, expect } from 'vitest';
import {
  computeEnrollmentRate,
  computeEligibilityScore,
  computeFeasibilityScore,
  percentileRank,
} from '../src/scoring';

describe('Scoring', () => {
  describe('computeEnrollmentRate', () => {
    it('computes monthly rate from enrollment and days', () => {
      const rate = computeEnrollmentRate(120, 90);
      expect(rate).toBeCloseTo(40.0, 1);
    });

    it('returns 0 for zero enrollment', () => {
      const rate = computeEnrollmentRate(0, 90);
      expect(rate).toBe(0);
    });
  });

  describe('percentileRank', () => {
    it('returns 50th percentile for median value', () => {
      const cohort = [10, 20, 30, 40, 50];
      const p50 = percentileRank(30, cohort);
      expect(p50).toBe(50);
    });

    it('returns 100 for value >= max', () => {
      const cohort = [10, 20, 30, 40, 50];
      const p100 = percentileRank(50, cohort);
      expect(p100).toBe(100);
    });
  });

  describe('computeEligibilityScore', () => {
    it('returns high score for complete criteria', () => {
      const score = computeEligibilityScore(20, 24);
      expect(score).toBeGreaterThan(80);
    });

    it('returns lower score for sparse criteria', () => {
      const score = computeEligibilityScore(5, 24);
      expect(score).toBeLessThan(30);
    });
  });

  describe('computeFeasibilityScore', () => {
    it('computes weighted composite', () => {
      const score = computeFeasibilityScore(75, 90, 60);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});