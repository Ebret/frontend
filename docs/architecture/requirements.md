# Requirements Overview

## Scope
### In Scope
- Member onboarding and KYC
- Member profile and household or employer references
- Share capital, subscriptions, capital build-up, and savings ledgers
- Loan origination, approval, release, amortization, collections, restructuring, and write-off workflows
- Treasury, cashiering, fund transfers, and disbursements
- General ledger, subsidiary ledgers, chart of accounts mapping, period close
- Governance records, committees, approvals, and document lifecycle
- Compliance data capture for CDA and BIR support
- Audit trails, maker-checker controls, exception logs, and reporting
- API boundaries for channels and integrations

### Out of Scope for MVP
- Mobile banking grade external payments orchestration
- Full HR or payroll unless cooperative payroll deduction is required
- Advanced IFRS-style consolidation across legal entities
- Collection agency management
- Advanced fraud scoring with machine learning

## Assumptions
- The cooperative is registered with the CDA and operates under the Philippine Cooperative Code.
- The cooperative is engaged in credit services and therefore needs configurable controls for credit operations.
- The cooperative maintains accounting records aligned to CDA-prescribed reporting structures.
- The cooperative may need to support BIR tax-exemption processing and related member TIN tracking.
- Final legal, tax, and regulatory interpretations will be validated with Philippine counsel, CPA, and cooperative compliance officers before production rollout.

## Requirement Classification
- Confirmed requirement: directly grounded in law, official circular, or official agency process
- Likely requirement: common implementation need inferred from official obligations
- Design assumption: architecture choice for adaptability and control

## MVP Must-Haves
- Cooperative setup and branches
- Member onboarding and documents
- Share capital ledger
- Savings account transactions
- Loan application, approval, release, and collection
- Cashiering and receipts
- Accounting postings and trial balance
- Core governance approvals
- Compliance calendar and report-ready data extracts
- Audit trail and role controls

## Non-Functional Requirements
### Security
- Encryption in transit and at rest
- Strong password or MFA for privileged users
- Session timeout and device logging
- Field masking for TIN and sensitive IDs
- Attachment malware scanning if available

### Auditability
- Immutable business event log
- Before and after values for master data changes
- Timestamp, actor, role, IP or device metadata where practical
- Signed export manifests for official reports

### Reliability
- ACID transactions for financial posting
- Idempotency keys for API-initiated transactions
- Retry-safe integration jobs
- Daily backups and restore drills

### Performance Targets
- Teller transactions under 2 seconds for standard operations
- Loan balance inquiry under 3 seconds
- Daily close batch within agreed operational window
- Report generation with extract timestamps and version labels
