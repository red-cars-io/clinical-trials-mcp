/**
 * Compute monthly enrollment rate.
 * @param enrollment - total enrolled subjects
 * @param durationDays - trial duration in days
 * @returns monthly enrollment rate (enrollment per 30 days)
 */
export function computeEnrollmentRate(enrollment: number, durationDays: number): number {
  if (durationDays <= 0) return 0;
  return (enrollment / durationDays) * 30;
}

/**
 * Compute percentile rank of a value within a cohort.
 * @param value - the value to rank
 * @param cohort - array of all values in the cohort
 * @returns percentile rank (0-100)
 */
export function percentileRank(value: number, cohort: number[]): number {
  if (cohort.length === 0) return 0;
  if (value >= cohort[cohort.length - 1]) return 100;
  if (cohort.length === 1) return value >= cohort[0] ? 100 : 0;

  const below = cohort.filter((v) => v < value).length;
  return Math.round((below / (cohort.length - 1)) * 100);
}

/**
 * Compute eligibility completeness score (0-100).
 * @param fieldsPopulated - number of eligibility fields with data
 * @param totalFields - total number of eligibility fields in protocol
 * @returns eligibility completeness score
 */
export function computeEligibilityScore(fieldsPopulated: number, totalFields: number): number {
  if (totalFields === 0) return 0;
  return Math.min(100, Math.round((fieldsPopulated / totalFields) * 100));
}

/**
 * Compute composite feasibility score (0-100).
 * enrollmentRatePctile, eligibilityScore, geoDiversity each contribute.
 * @param enrollmentRatePctile - percentile rank of enrollment rate
 * @param eligibilityScore - eligibility completeness score (0-100)
 * @param geoDiversity - geographic diversity score (0-100)
 * @returns composite feasibility score
 */
export function computeFeasibilityScore(
  enrollmentRatePctile: number,
  eligibilityScore: number,
  geoDiversity: number
): number {
  return Math.round(
    enrollmentRatePctile * 0.4 + eligibilityScore * 0.4 + geoDiversity * 0.2
  );
}

/**
 * Compute geographic diversity score for a list of sites.
 * @param locations - array of site locations with lat/lng
 * @returns diversity score (0-100)
 */
export function computeGeoDiversityScore(
  locations: Array<{ latitude?: number; longitude?: number }>
): number {
  if (locations.length <= 1) return 0;

  const lats = locations.map((l) => l.latitude || 0);
  const lons = locations.map((l) => l.longitude || 0);

  const latRange = Math.max(...lats) - Math.min(...lats);
  const lonRange = Math.max(...lons) - Math.min(...lons);

  const normalizedLatRange = Math.min(latRange / 180, 1);
  const normalizedLonRange = Math.min(lonRange / 360, 1);

  return Math.min(100, Math.round((normalizedLatRange * 50 + normalizedLonRange * 50)));
}