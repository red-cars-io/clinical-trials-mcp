const BASE_URL = 'https://clinicaltrials.gov/api/v2';

interface StudySearchParams {
  indication?: string;
  phase?: string;
  sponsorType?: string;
  status?: string;
  geoLocation?: string;
  maxResults?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface Study {
  nctId: string;
  briefTitle: string;
  phase?: string;
  enrollment?: number;
  enrollmentType?: string;
  startDate?: string;
  primaryCompletionDate?: string;
  status?: string;
  sponsor?: string;
  contacts?: Array<{ name?: string; email?: string; role?: string }>;
  locations?: Array<{
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    facility?: string;
  }>;
  eligibility?: {
    criteria?: string;
    sex?: string;
    minimumAge?: string;
    maximumAge?: string;
  };
}

interface SearchResult {
  studies: Study[];
  total: number;
}

interface ProtocolSection {
  identificationModule: {
    nctId: string;
    briefTitle: string;
    startDateStruct?: { date?: string };
    primaryCompletionDateStruct?: { date?: string };
    overallStatus?: string;
    leadSponsor?: { name?: string };
  };
  designModule?: {
    phases?: string[];
    enrollmentInfo?: { count?: number; type?: string };
  };
  contactsLocationsModule?: {
    centralContacts?: Array<{ name?: string; email?: string; role?: string }>;
    locations?: Array<{
      city?: string;
      state?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
      facility?: string;
    }>;
  };
  eligibilityModule?: {
    eligibilityCriteria?: string;
    sex?: string;
    minimumAge?: string;
    maximumAge?: string;
  };
}

interface RawStudy {
  protocolSection?: ProtocolSection;
}

export class ClinicalTrialsAPI {
  private baseUrl = BASE_URL;

  async searchStudies(params: StudySearchParams): Promise<SearchResult> {
    const query = new URLSearchParams();
    if (params.indication) query.set('query.cond', params.indication);
    if (params.maxResults) query.set('pageSize', String(params.maxResults));
    if (params.phase) query.set('filter.phase', params.phase);
    // Forward geoLocation via query.locn
    if (params.geoLocation) query.set('query.locn', params.geoLocation);

    // Build advanced filters array
    const advancedFilters: string[] = [];
    if (params.status) advancedFilters.push(`AREA[Status]${params.status}`);
    if (params.dateFrom || params.dateTo) {
      const from = params.dateFrom || '1900-01-01';
      const to = params.dateTo || '2100-12-31';
      advancedFilters.push(`AREA[StartDate]RANGE[${from},${to}]`);
    }
    if (advancedFilters.length > 0) {
      // Join multiple advanced filters with comma separator
      query.set('filter.advanced', advancedFilters.join(','));
    }

    query.set('format', 'json');

    const url = `${this.baseUrl}/studies?${query.toString()}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`ClinicalTrials API error: ${res.status} ${url}`);
    const data = await res.json();
    const rawStudies: RawStudy[] = data.studies || [];
    return {
      studies: rawStudies.map((s) => this.mapStudy(s)).filter((s) => s.nctId),
      total: rawStudies.length,
    };
  }

  async getStudy(nctId: string): Promise<Study | null> {
    const url = `${this.baseUrl}/studies/${nctId}?format=json`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`ClinicalTrials API error: ${res.status}`);
    const data: RawStudy = await res.json();
    if (!data.protocolSection) return null;
    return this.mapStudy(data);
  }

  private mapStudy(s: RawStudy): Study {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ps = (s.protocolSection || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (ps.identificationModule || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const des = (ps.designModule || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cl = (ps.contactsLocationsModule || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = (ps.eligibilityModule || {}) as any;

    return {
      nctId: id.nctId || '',
      briefTitle: id.briefTitle || '',
      phase: des.phases?.[0] || '',
      enrollment: des.enrollmentInfo?.count,
      enrollmentType: des.enrollmentInfo?.type || '',
      startDate: id.startDateStruct?.date || '',
      primaryCompletionDate: id.primaryCompletionDateStruct?.date || '',
      status: id.overallStatus || '',
      sponsor: id.leadSponsor?.name || '',
      contacts: (cl.centralContacts || []).map((c: any) => ({
        name: c.name || '',
        email: c.email || '',
        role: c.role || '',
      })),
      locations: (cl.locations || []).map((l: any) => ({
        city: l.city || '',
        state: l.state || '',
        country: l.country || '',
        latitude: l.latitude,
        longitude: l.longitude,
        facility: l.facility || '',
      })),
      eligibility: {
        criteria: el.eligibilityCriteria || '',
        sex: el.sex || '',
        minimumAge: el.minimumAge || '',
        maximumAge: el.maximumAge || '',
      },
    };
  }
}