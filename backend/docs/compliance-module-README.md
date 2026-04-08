# Compliance Module (Backend-First)

## Scope
This module supports CDA CAPR filing and COC readiness with configurable rules, workflow, and auditability.

## Setup
1. Run Prisma migrations after updating `schema.prisma`.
2. Seed requirement profiles via `prisma/seed.js`.
3. Use endpoints under `/compliance`.

## Key Features
- Configurable requirement profiles and conditional modules
- Maker-checker workflow with status controls
- Deficiency notices with deadline recomputation
- Late penalty computation at 100 PHP/day

## Endpoints
- `POST /compliance/filings`
- `GET /compliance/filings/:id`
- `POST /compliance/requirements`
- `POST /compliance/filings/:id/modules/complete`
- `POST /compliance/filings/:id/status`
- `POST /compliance/filings/:id/deficiencies`
- `POST /compliance/filings/:id/penalties`

## Assumptions
- Asset size class thresholds are configurable and should be reviewed.
- CAPR submissions are filed via CAPRIS with signed copy submitted to Extension Office.
- All submissions require immutable audit logs.
