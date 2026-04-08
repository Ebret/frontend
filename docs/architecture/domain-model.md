# Domain Model

## Main Aggregates
- Cooperative
- Branch
- Member
- MembershipApplication
- KYCProfile
- MemberDocument
- ShareCapitalAccount
- SavingsAccount
- SavingsProduct
- LoanProduct
- LoanApplication
- CreditAssessment
- LoanAccount
- AmortizationSchedule
- CollectionReceipt
- DisbursementVoucher
- CashSession
- JournalBatch
- JournalEntry
- JournalLine
- GeneralLedgerAccount
- SubsidiaryLedgerAccount
- BoardResolution
- CommitteeDecision
- ComplianceRequirement
- FilingCalendarItem
- ReportSubmission
- AuditEvent
- ExceptionCase

## Entity Relationships
- One Cooperative has many Branches
- One Member may own many SavingsAccounts and LoanAccounts
- One LoanApplication belongs to one Member and one LoanProduct
- One approved LoanApplication becomes one LoanAccount
- One LoanAccount has many schedule lines, charges, receipts, and accounting events
- One financial event produces one or more JournalEntries
- One ComplianceRequirement may map to many system data fields, reports, and tasks

## Data Design Rules
- Every member-facing financial account must have a stable account identifier
- Every transaction must store effective date, posting date, source module, source document, actor, branch, and approval status
- Every balance-affecting mutation must produce an immutable audit event
- Soft delete is forbidden for posted financial records
- Sensitive PII must have field-level protection or equivalent control

## Canonical Data Model
```yaml
cooperative:
  cooperative_id: string
  legal_name: string
  registration_no: string
  tin: string
  coop_type: savings_and_credit
  reporting_calendar: string
  tax_status_profile: string
  branches: [branch_id]

member:
  member_id: string
  member_no: string
  status: active|inactive|withdrawn|deceased|delinquent|suspended
  full_name:
    last: string
    first: string
    middle: string
    suffix: string
  birth_date: date
  civil_status: string
  nationality: string
  addresses:
    residential: object
    business: object
  contacts:
    mobile: string
    email: string
  employment:
    employer_name: string
    employee_no: string
    payroll_group: string
  tax:
    tin: string
    tin_status: present|missing|for_followup|validated
  membership:
    membership_date: date
    member_type: regular|associate
    chapter_or_branch: string
    risk_class: low|medium|high

savings_account:
  savings_account_id: string
  member_id: string
  product_code: string
  status: pending|active|dormant|closed
  current_balance: decimal
  available_balance: decimal
  hold_balance: decimal
  interest_rule_id: string
  fees_rule_id: string

loan_application:
  loan_application_id: string
  member_id: string
  product_code: string
  principal_requested: decimal
  purpose_code: string
  term_months: integer
  repayment_frequency: monthly|semi_monthly|weekly
  collateral_summary: string
  co_makers: [member_id]
  application_status: draft|submitted|for_review|for_ci|for_committee|approved|declined|cancelled

loan_account:
  loan_account_id: string
  member_id: string
  product_code: string
  principal_granted: decimal
  disbursement_date: date
  maturity_date: date
  interest_method: diminishing|straight_line|add_on
  penalty_rule_id: string
  amortization_schedule_id: string
  delinquency_bucket: current|1_30|31_60|61_90|91_plus
  status: active|paid|restructured|written_off|legal

journal_entry:
  journal_entry_id: string
  source_module: string
  source_reference: string
  posting_date: date
  branch_id: string
  status: draft|posted|reversed
  lines:
    - gl_account_code: string
      sl_reference: string
      debit: decimal
      credit: decimal
```
