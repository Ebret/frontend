# MVP Testing Matrix

| Epic | Unit Tests | Integration Tests | Reconciliation Tests |
| --- | --- | --- | --- |
| Cooperative setup and access | Roles, permissions, SoD rules | Login, role changes | N/A |
| Member onboarding and KYC | Validation, document rules | Maker-checker flow | N/A |
| Share capital and savings | Posting rules, fees, holds | Cash session + posting | Subledger vs GL |
| Loan origination and servicing | Eligibility, scoring rules | Approval routing | Loan trial balance vs GL |
| Accounting and period close | Template selection | Batch posting | Subledger vs GL, trial balance |
| Compliance and audit | Evidence capture | Report generation | Dataset vs submission |
