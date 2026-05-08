# ClinicalTrials.gov API v2 Exploration

## Base URL
```
https://clinicaltrials.gov/api/v2
```

## Endpoint 1: Search Studies

**Request:**
```
GET https://clinicaltrials.gov/api/v2/studies?query.cond=<condition>&pageSize=3
```

**Response shape:**
```json
{
  "studies": [
    {
      "protocolSection": {
        "identificationModule": {
          "nctId": "NCT06940401",
          "briefTitle": "...",
          "contacts": [],           // always empty here — see centralContacts below
          "locations": []           // always empty here — see locations below
        },
        "designModule": {
          "phase": ["PHASE1", "PHASE2"],  // array of phase strings
          "enrollmentInfo": {
            "count": 42,
            "type": "ESTIMATED"
          }
        }
      }
    }
  ]
}
```

**Important discovery:** `query.indication` is NOT a valid parameter. The correct parameter is `query.cond` for condition.

**The `fields` parameter is NOT supported** — requesting specific fields returns HTTP 400 with `Parameter 'fields' contains invalid field name`.

## Endpoint 2: Single Study

**Request:**
```
GET https://clinicaltrials.gov/api/v2/studies/NCT05123482
```

**Key field paths:**

| Data | Field Path |
|------|-----------|
| NCT ID | `protocolSection.identificationModule.nctId` |
| Title | `protocolSection.identificationModule.briefTitle` |
| Phase | `protocolSection.designModule.phases[]` |
| Enrollment | `protocolSection.designModule.enrollmentInfo.count` |
| Overall Status | `protocolSection.statusModule.overallStatus` |

## Endpoint 3: Contacts and Locations

Contacts and locations are NOT in `identificationModule` directly — they are in `contactsLocationsModule`:

**Contacts (`centralContacts` array):**
```json
{
  "protocolSection": {
    "contactsLocationsModule": {
      "centralContacts": [
        {
          "name": "AstraZeneca Clinical Study Information Center",
          "role": "CONTACT",
          "phone": "1-877-240-9479",
          "email": "information.center@astrazeneca.com"
        }
      ]
    }
  }
}
```

**Locations (`locations` array):**
```json
{
  "protocolSection": {
    "contactsLocationsModule": {
      "locations": [
        {
          "facility": "Research Site",
          "status": "RECRUITING",       // RECRUITING | COMPLETED | TERMINATED | etc.
          "city": "Houston",
          "state": "Texas",
          "zip": "77030",
          "country": "United States",
          "geoPoint": {
            "lat": 29.76328,
            "lon": -95.36327
          }
        }
      ]
    }
  }
}
```

## Endpoint 4: Eligibility

**Field path:** `protocolSection.eligibilityModule`

```json
{
  "protocolSection": {
    "eligibilityModule": {
      "eligibilityCriteria": "Key Inclusion Criteria:\n* Age ≥ 18 years\n* ...",  // plain text
      "sex": "ALL",              // ALL | MALE | FEMALE
      "minimumAge": "18 Years",
      "maximumAge": null,
      "healthyVolunteers": false,
      "stdAges": ["ADULT", "OLDER_ADULT"]
    }
  }
}
```

## Summary of Key Field Names

| Data Point | Field |
|-----------|-------|
| NCT ID | `nctId` |
| Brief Title | `briefTitle` |
| Phase | `phases[]` (array) |
| Enrollment Count | `enrollmentInfo.count` |
| Enrollment Type | `enrollmentInfo.type` |
| Study Status | `overallStatus` |
| Central Contacts | `contactsLocationsModule.centralContacts[]` |
| Contact Name | `centralContacts[].name` |
| Contact Phone | `centralContacts[].phone` |
| Contact Email | `centralContacts[].email` |
| Study Sites | `contactsLocationsModule.locations[]` |
| Site Facility | `locations[].facility` |
| Site Status | `locations[].status` |
| Site City | `locations[].city` |
| Site State | `locations[].state` |
| Site Zip | `locations[].zip` |
| Site Country | `locations[].country` |
| Site Lat/Lon | `locations[].geoPoint.lat/lon` |
| Eligibility Criteria | `eligibilityModule.eligibilityCriteria` (plain text) |
| Sex Restriction | `eligibilityModule.sex` |
| Min Age | `eligibilityModule.minimumAge` |
| Max Age | `eligibilityModule.maximumAge` |
| Healthy Volunteers | `eligibilityModule.healthyVolunteers` |

## Notes

- All study data is nested under `protocolSection` — there is no top-level flattening
- The `fields` query parameter is not supported in v2 (returns 400)
- `query.cond` is the correct search parameter (not `query.indication`)
- Contacts are in `contactsLocationsModule.centralContacts`, NOT in `identificationModule.contacts`
- Locations are in `contactsLocationsModule.locations`, NOT in `identificationModule.locations`
