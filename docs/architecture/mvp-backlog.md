# MVP Backlog (Epics, Stories, Acceptance Criteria)

## Epic 1: Cooperative Setup and Access Control
### Story COOP-001
As a system administrator, I want to configure cooperative profile and branches so that transactions are tagged by branch and cooperative identity.

Acceptance Criteria:
- Cooperative profile includes registration number, legal name, coop type, and tax status.
- Branches can be created with unique codes and are active or inactive.
- Transactions are required to reference a branch.

### Story COOP-002
As a system administrator, I want to define roles and permissions so that segregation of duties is enforced.

Acceptance Criteria:
- Role definitions include maker and approver segregation.
- System administrator cannot approve business transactions.
- Internal auditor is read-only to financial history and logs.

## Epic 2: Member Onboarding and KYC
### Story MEM-001
As a membership officer, I want to encode and approve a member application through maker-checker flow so that only complete and approved members can transact.

Acceptance Criteria:
- Maker cannot approve own member onboarding decision.
- Approval records capture approver identity and timestamp.
- Approved member has a generated member number and default accounts.

### Story MEM-002
As a membership officer, I want to collect and track KYC documents so that member profiles are complete and auditable.

Acceptance Criteria:
- Document checklist is enforced by member type.
- Document status shows complete or incomplete.
- Document links are preserved for audit.

## Epic 3: Share Capital and Savings
### Story SAV-001
As a teller, I want to post savings deposits and withdrawals so that member balances update with receipts and accounting entries.

Acceptance Criteria:
- Teller session and cash limits are validated before posting.
- Savings ledger updates and a receipt is generated.
- A balanced journal entry is created and locked.

### Story SC-001
As a cashier, I want to post share capital build-up so that member capital balances and certificates update.

Acceptance Criteria:
- Contribution posts to member share capital ledger.
- Accounting entry template is applied.
- Updated balance is reflected in certificate view.

## Epic 4: Loan Origination and Servicing
### Story LN-001
As a loan encoder, I want to submit a loan application for review so that it routes to the approving body.

Acceptance Criteria:
- Eligibility rules validate tenure and product constraints.
- Required documents must be complete before submission.
- Application status transitions are recorded.

### Story LN-002
As a credit committee member, I want to approve or decline applications so that decisions are auditable and policy-compliant.

Acceptance Criteria:
- Decision captures approver identity, timestamp, and conditions.
- Approved application creates a loan account.
- Declined applications remain read-only.

### Story LN-003
As a teller, I want to post loan collections so that amortization and delinquency are updated.

Acceptance Criteria:
- Payment allocation waterfall is applied.
- Delinquency bucket updates after posting.
- Accounting entries reconcile to cash session.

## Epic 5: Accounting and Period Close
### Story ACC-001
As an accounting officer, I want all financial events to generate journal batches so that GL and subledgers reconcile.

Acceptance Criteria:
- Every posted transaction references a journal batch.
- Journal entries are balanced and immutable.
- Reconciliation report flags exceptions.

### Story ACC-002
As an accounting officer, I want to close the period so that postings are locked and reports are generated.

Acceptance Criteria:
- Open transaction windows are locked.
- Accrual and batch jobs complete successfully.
- Period close generates report packs.

## Epic 6: Compliance and Audit
### Story COM-001
As a compliance officer, I want report-ready datasets so that CDA and BIR reporting is consistent and auditable.

Acceptance Criteria:
- Dataset exports are versioned with parameters and timestamp.
- Extracts reference accountable officer identity.
- Evidence pack links required documents.

### Story AUD-001
As an internal auditor, I want immutable audit logs so that I can trace changes and approvals.

Acceptance Criteria:
- All balance-affecting changes produce audit events.
- Audit records include actor, role, timestamp, and source.
- Audit logs are read-only.
