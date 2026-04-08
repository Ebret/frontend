# Data Ownership by Domain

This table clarifies the primary domain responsible for data creation, validation, and lifecycle control.

| Domain | Primary Owner | Key Data Objects | Notes |
| --- | --- | --- | --- |
| Member | Membership Officer | Member, MembershipApplication, KYCProfile, MemberDocument | Ownership includes identity, status, and KYC completeness |
| Savings | Treasury or Teller | SavingsAccount, SavingsLedger, SavingsProduct | Transactions require active cash session |
| Loans | Credit Committee | LoanApplication, CreditAssessment, LoanAccount, AmortizationSchedule | Decisions and conditions are governed by approvals |
| Accounting | Accounting Officer | JournalBatch, JournalEntry, JournalLine, GL/SL mappings | Controls posting, reconciliation, and period close |
| Compliance | Compliance Officer | ComplianceRequirement, ReportSubmission, FilingCalendarItem | Owns reporting evidence and submission records |
