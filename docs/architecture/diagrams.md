# Architecture Diagrams (Mermaid)

## Diagram Legend
- 1-1xxx: Cash and cash equivalents
- 1-2xxx: Loans and receivables
- 2-1xxx: Member deposits and liabilities
- 2-13xx to 2-14xx: Cash short/over and clearing accounts
- 3-2xxx: Share capital accounts
- 4-4xxx: Income accounts (interest, penalties, fees, recoveries)
- 5-5xxx: Expense accounts (interest expense, loan loss, adjustments)

## Context and Layering
```mermaid
flowchart TB
  subgraph Experience
    WebBackOffice[Web Back Office]
    MemberPortal[Member Portal]
    TellerUI[Teller/Cashier UI]
    APIConsumers[API Consumers]
  end

  subgraph Application
    Workflows[Workflows]
    Approvals[Approvals]
    Orchestration[Orchestration]
  end

  subgraph Domain
    MemberDomain[Member Domain]
    SavingsDomain[Savings Domain]
    LoansDomain[Loans Domain]
    AccountingDomain[Accounting Domain]
    GovernanceDomain[Governance Domain]
    ComplianceDomain[Compliance Domain]
  end

  subgraph Data
    RDBMS[Transactional Database]
    DocStore[Document Store]
    AuditStore[Audit/Event Store]
    ReportingMart[Reporting Mart]
  end

  subgraph Integration
    ExternalAPIs[External APIs]
    FileAdapters[File Import/Export]
    Notifications[Notification Channels]
  end

  Experience --> Application --> Domain --> Data
  Domain --> Integration
```

## Core Module Map
```mermaid
flowchart LR
  Core[Core Modules] --> CoopProfile[Coop Profile & Parameters]
  Core --> MemberMgmt[Member Management]
  Core --> KYC[KYC & Documents]
  Core --> ShareCapital[Share Capital & Build-Up]
  Core --> Savings[Savings Products & Accounts]
  Core --> Loans[Loan Products & Servicing]
  Core --> Collections[Collections & Disbursements]
  Core --> Cashiering[Cashiering & Treasury]
  Core --> GL[General Ledger & Financial Accounting]
  Core --> Governance[Governance & Resolutions]
  Core --> Compliance[Compliance & Report Prep]
  Core --> Audit[Audit Trail & Controls]
  Core --> Access[User/Role Access]
  Core --> Integration[Integration & Data Exchange]
```

## Loan Origination Workflow
```mermaid
flowchart TD
  A[Create Application] --> B[Validate Eligibility]
  B --> C[Collect Documents & Co-makers]
  C --> D[Credit Investigation & Scoring]
  D --> E[Route to Approving Body]
  E --> F[Record Decision & Conditions]
  F --> G[Generate Release Docs]
  G --> H[Disburse Loan]
  H --> I[Create Amortization Schedule]
  I --> J[Post Accounting Entries]
```

## Cash Session Workflow
```mermaid
flowchart TD
  A[Open Cash Session] --> B[Record Opening Balance]
  B --> C[Validate Teller Assignment]
  C --> D[Post Opening Entry]
  D --> E[Process Teller Transactions]
  E --> F[Count End-of-Day Cash]
  F --> G[Post Closing Entry and Variances]
  G --> H[Close Cash Session]
```

## Teller Transaction Workflow
```mermaid
flowchart TD
  A[Validate Active Cash Session] --> B[Identify Member and Account or Loan]
  B --> C[Accept Funds or Disburse Cash]
  C --> D[Capture Source Document Reference]
  D --> E[Post Transaction and Update Balances]
  E --> F[Generate Receipt and Accounting Entries]
  F --> G[Update Cash Session Totals]
```

## Swimlane: Member Onboarding
```mermaid
flowchart LR
  subgraph Applicant
    A1[Submit Application Data]
    A2[Provide Documents]
  end

  subgraph Membership_Officer
    M1[Encode Application]
    M2[Verify Identity and KYC]
    M3[Run Duplicate and Sanctions Checks]
    M4[Prepare Approval Packet]
    M5[Create Member Record]
  end

  subgraph Approver
    AP1[Review and Approve Membership]
  end

  A1 --> M1 --> M2
  A2 --> M2 --> M3 --> M4 --> AP1 --> M5
```

## Swimlane: Savings Deposit or Withdrawal
```mermaid
flowchart LR
  subgraph Member
    A1[Request Deposit or Withdrawal]
    A2[Present Source Document]
  end

  subgraph Teller
    T1[Validate Account Status]
    T2[Validate Teller Session and Cash Limits]
    T3[Accept Transaction]
    T4[Issue Receipt]
  end

  subgraph System
    S1[Apply Holds, Fees, Restrictions]
    S2[Post to Account Ledger]
    S3[Generate Accounting Entries]
    S4[Update Cash Drawer and Branch Position]
  end

  A1 --> T1 --> T2
  A2 --> T3 --> S1 --> S2 --> S3 --> T4 --> S4
```

## Swimlane: Loan Origination
```mermaid
flowchart LR
  subgraph Member
    A1[Submit Loan Application]
    A2[Provide Required Documents]
  end

  subgraph Loan_Encoder
    L1[Encode Application]
    L2[Validate Product Eligibility]
    L3[Assemble Credit File]
  end

  subgraph Credit_Investigator
    C1[Conduct Credit Investigation]
    C2[Prepare Credit Assessment]
  end

  subgraph Credit_Committee
    CC1[Review Assessment and Exposure]
    CC2[Approve or Decline]
  end

  subgraph System
    S1[Generate Release Documents]
    S2[Disburse Loan]
    S3[Create Amortization Schedule]
    S4[Post Accounting Entries]
  end

  A1 --> L1 --> L2
  A2 --> L3 --> C1 --> C2 --> CC1 --> CC2 --> S1 --> S2 --> S3 --> S4
```

## Swimlane: Cashiering
```mermaid
flowchart LR
  subgraph Member
    M1[Request Transaction]
    M2[Provide Source Document]
  end

  subgraph Teller
    T1[Validate Member and Account]
    T2[Validate Session and Cash Limits]
    T3[Accept Cash or Disburse Funds]
    T4[Issue Receipt]
  end

  subgraph Treasury
    TR1[Monitor Cash Position]
    TR2[Approve Cash Override if Needed]
  end

  subgraph System
    S1[Apply Holds, Fees, Restrictions]
    S2[Post Ledger Transaction]
    S3[Generate Accounting Entries]
    S4[Update Cash Drawer and Branch Position]
  end

  M1 --> T1 --> T2 --> T3
  M2 --> T3 --> S1 --> S2 --> S3 --> T4 --> S4 --> TR1
  T2 --> TR2
```

## Swimlane: Period Close
```mermaid
flowchart LR
  subgraph Accounting_Officer
    A1[Initiate Period Close]
    A2[Review Suspense and Exceptions]
    A3[Confirm Subledger to GL Reco]
    A4[Approve Period Close]
  end

  subgraph System
    S1[Lock Open Windows]
    S2[Run Accruals and Batch Jobs]
    S3[Generate Statements and Reports]
    S4[Archive Compliance Evidence]
  end

  subgraph Compliance_Officer
    C1[Validate Report Evidence]
    C2[Submit Required Reports]
  end

  A1 --> S1 --> S2 --> A2 --> A3 --> A4 --> S3 --> C1 --> C2 --> S4
```

## Accounting Posting Pattern
```mermaid
flowchart LR
  Event[Product Event] --> Template[Accounting Template]
  Template --> Batch[Journal Batch]
  Batch --> GL[General Ledger]
  Batch --> Subledgers[Subledger Updates]
  Subledgers --> Reco[Reconciliation Controls]
```

## Account Mapping Workflow
```mermaid
flowchart LR
  A[Product Setup] --> B[Assign Product Rule Set]
  B --> C[Map Transaction Types to Templates]
  C --> D[Assign GL Codes and SL References]
  D --> E[Validate Posting Rules]
  E --> F[Mapping Approval]
  F --> G[Activate Product]
```

## Product Activation Readiness Checklist
- Product parameters configured and saved.
- Rule set assigned and validated against eligibility constraints.
- All transaction types mapped to accounting templates.
- GL codes and SL references mapped for each template.
- Posting rules validated with a sample transaction.
- Mapping approval evidence captured (approver, timestamp, rationale, version).
- Required documents and approval matrices assigned.
