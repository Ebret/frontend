# API Boundaries and Events

## Module Boundaries
- Member Domain: member onboarding, profile, KYC, documents
- Savings Domain: savings products, accounts, deposits, withdrawals
- Share Capital Domain: share capital accounts and contributions
- Loans Domain: loan products, applications, servicing, collections
- Accounting Domain: journal batches, entries, reconciliation
- Governance and Compliance Domain: approvals, reports, submissions

## API Boundary Map (Internal)
### Member Service
- `POST /members/applications`
- `POST /members/{id}/approve`
- `GET /members/{id}`

### Savings Service
- `POST /savings/accounts`
- `POST /savings/transactions/deposit`
- `POST /savings/transactions/withdraw`
- `GET /savings/accounts/{id}/ledger`

### Share Capital Service
- `POST /share-capital/accounts`
- `POST /share-capital/contributions`
- `GET /share-capital/accounts/{id}/ledger`

### Loans Service
- `POST /loans/applications`
- `POST /loans/applications/{id}/submit`
- `POST /loans/applications/{id}/decision`
- `POST /loans/accounts/{id}/collect`
- `POST /loans/accounts/{id}/restructure`

### Accounting Service
- `POST /journals/post-batch`
- `GET /gl/trial-balance`
- `GET /reconciliation/exceptions`

### Compliance Service
- `GET /compliance/calendar`
- `POST /compliance/submissions`
- `GET /reports/capr-dataset`

## Event Naming Conventions
- Format: `domain.entity.action`
- Use past-tense for completed actions: `member.approved`, `loan.disbursed`.
- Include version suffix if schema evolves: `loan.disbursed.v1`.

## Event Catalog
- `member.approved`
- `member.kyc_completed`
- `share_capital.contribution_posted`
- `savings.deposit_posted`
- `savings.withdrawal_posted`
- `loan.application_submitted`
- `loan.application_approved`
- `loan.disbursed`
- `loan.payment_posted`
- `loan.restructured`
- `journal.batch_posted`
- `compliance.report_generated`
- `compliance.submission_recorded`

## Payload Skeletons
```yaml
event:
  id: uuid
  type: loan.disbursed.v1
  occurred_at: datetime
  actor_id: user_id
  branch_id: branch_id
  source:
    module: loans
    reference: loan_account_id
  data:
    member_id: string
    loan_account_id: string
    principal_granted: decimal
    disbursement_date: date
```

```yaml
event:
  id: uuid
  type: savings.deposit_posted.v1
  occurred_at: datetime
  actor_id: user_id
  branch_id: branch_id
  source:
    module: savings
    reference: savings_account_id
  data:
    member_id: string
    savings_account_id: string
    amount: decimal
    posting_date: date
```

## Idempotency Rules
- All write APIs require an `Idempotency-Key` header.
- Duplicate keys must return the original response for the same actor and payload hash.
- For batch posting, idempotency applies per batch and per source transaction reference.

## Mapping Approval Evidence (Fields)
- approval_id
- approver_id
- approved_at
- mapping_version
- rationale
- affected_templates

## GL Code Legend (Cross-Reference)
- 1-1xxx: Cash and cash equivalents
- 1-2xxx: Loans and receivables
- 2-1xxx: Member deposits and liabilities
- 2-13xx to 2-14xx: Cash short/over and clearing accounts
- 3-2xxx: Share capital accounts
- 4-4xxx: Income accounts (interest, penalties, fees, recoveries)
- 5-5xxx: Expense accounts (interest expense, loan loss, adjustments)
