# AI-Ready Artifacts for Philippine Savings and Loan Cooperative

This document contains machine-readable artifacts for AI coding agents and implementation teams. It includes user stories, acceptance criteria, workflow definitions, and architectural decision records (ADRs) aligned with the AI-Ready Architecture.

## Table of Contents
1. [User Stories](#user-stories)
2. [Acceptance Criteria](#acceptance-criteria)
3. [Workflow Definitions](#workflow-definitions)
4. [Architectural Decision Records (ADRs)](#architectural-decision-records)
5. [API Boundary Specifications](#api-boundary-specifications)
6. [Event Catalog](#event-catalog)
7. [Data Model Extensions](#data-model-extensions)

---

## User Stories

### Member Management Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| MEM-001 | Membership Officer | Encode and approve member applications through maker-checker flow | Only complete and approved members can transact |
| MEM-002 | Membership Officer | Capture member identity, contact, beneficiary, employer, and tax data | All required information is stored for compliance and operations |
| MEM-003 | Membership Officer | Upload and manage KYC documents (IDs, proof of address, etc.) | Regulatory KYC requirements are met with audit trail |
| MEM-004 | Membership Officer | Screen applications against duplicates and sanctions list | Prevent fraud and comply with AML regulations |
| MEM-005 | Membership Officer | Search and view member profiles with role-based access | Efficient service delivery while protecting sensitive data |
| MEM-006 | Membership Officer | Update member status (active, inactive, withdrawn, deceased, delinquent, suspended) | Accurate member lifecycle management |
| MEM-007 | Membership Officer | View member's complete transaction history and relationships | Comprehensive member view for decision-making |

### Share Capital Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| CAP-001 | Treasurer | Define share capital product with minimum opening amount and maintaining balance | Standardized capital build-up rules |
| CAP-002 | Treasurer | Accept over-the-counter share capital contributions | Members can build capital easily |
| CAP-003 | Treasurer | Process payroll-linked share capital deductions (if configured) | Automated capital build-up for participating employers |
| CAP-004 | Accounting Officer | View share capital ledger with transaction history | Accurate capital tracking and reporting |
| CAP-005 | Member | View my share capital balance and transaction history | Transparency into my ownership stake |
| CAP-006 | System | Automatically calculate and post interest/dividends on share capital | Members receive their share of earnings |

### Savings Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| SAV-001 | Teller | Open savings account for approved member with selected product | Member can start saving |
| SAV-002 | Teller | Process savings deposits with source document reference | Accurate and traceable savings transactions |
| SAV-003 | Teller | Process savings withdrawals with validation of holds, fees, and restrictions | Prevent unauthorized or non-compliant withdrawals |
| SAV-004 | Teller | View current and available balances in real-time | Provide accurate information to members |
| SAV-005 | Accounting Officer | Configure savings product parameters (interest rate, fees, dormancy rules) | Flexible product offerings |
| SAV-006 | System | Automatically accrue interest based on product rules | Accurate interest calculations |
| SAV-007 | Member | View savings account balance and transaction history via portal | Self-service access to account information |
| SAV-008 | System | Apply dormancy fees and escheatment rules per policy | Compliance with unclaimed property regulations |

### Loan Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| LN-001 | Member | Submit loan application with required documents | Request credit from the cooperative |
| LN-002 | Credit Investigator | Perform credit assessment and scoring | Evaluate member's creditworthiness |
| LN-003 | Credit Committee Member | Review credit assessment, collateral, and exposure | Approvals are policy-compliant and auditable |
| LN-004 | Credit Committee Member | Approve or decline loan applications with conditions | Transparent decision-making with audit trail |
| LN-005 | Loan Officer | Disburse approved loan to member | Member receives funds promptly |
| LN-006 | System | Generate amortization schedule upon loan release | Clear repayment terms for member |
| LN-007 | Teller | Record loan payments and apply allocation waterfall | Proper application of payments to principal, interest, penalties |
| LN-008 | Teller | View current loan balance and next due amount | Provide accurate information to members |
| LN-009 | Loan Officer | Restructure delinquent loans with new terms | Help members recover while protecting cooperative assets |
| LN-010 | System | Automatically update delinquency bucket daily | Accurate aging for risk management |
| LN-011 | Accounting Officer | Configure loan product parameters (interest method, fees, grace period) | Flexible loan offerings |
| LN-012 | Collection Officer | Generate collection list and contact delinquent members | Proactive collections management |

### Cashiering & Treasury Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| CSH-001 | Teller | Open cash session with beginning cash count | Start daily operations with controlled cash |
| CSH-002 | Teller | Process transactions only within active cash session | Prevent unauthorized out-of-session transactions |
| CSH-003 | Teller | Close cash session with end-of-day cash count | Reconcile cash drawer and identify variances |
| CSH-004 | Treasurer | View branch cash position across all tellers | Manage liquidity effectively |
| CSH-005 | Treasurer | Transfer funds between branches or to bank | Optimize cash distribution |
| CSH-006 | System | Enforce cash limits per teller and branch | Reduce robbery risk and prevent errors |
| CSH-007 | Auditor | Review cash session logs and variances | Detect and investigate discrepancies |

### Accounting Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| ACC-001 | Accounting Officer | Define chart of accounts aligned with CDA reporting | Standardized accounting structure |
| ACC-002 | Accounting Officer | Configure posting templates for each transaction type | Automatic generation of correct journal entries |
| ACC-003 | System | Generate balanced journal entries for all financial transactions | Maintain accounting equation integrity |
| ACC-004 | Accounting Officer | Post journal batches to general ledger | Update GL with period control |
| ACC-005 | Accounting Officer | Run trial balance and subledger reconciliations | Verify accuracy before period close |
| ACC-006 | System | Prevent edits to posted journal entries | Maintain immutable audit trail |
| ACC-007 | Accounting Officer | Close accounting period with proper controls | Lock historical data and ensure completeness |
| ACC-008 | Auditor | View complete audit trail with before/after values | Trace all changes for verification |
| ACC-009 | System | Reconcile subsidiary ledgers with general ledger automatically | Ensure subledger-GL agreement |

### Governance & Compliance Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| GOV-001 | Board Secretary | Record board resolutions with approval metadata | Formal governance decisions are documented |
| GOV-002 | Board Secretary | Track committee decisions and recommendations | Maintain committee oversight records |
| GOV-003 | Compliance Officer | Maintain compliance calendar with filing deadlines | Never miss regulatory deadlines |
| GOV-004 | Compliance Officer | Generate CDA and BIR report datasets | Accurate regulatory submissions |
| GOV-005 | System | Capture compliance evidence at transaction time | No need to reconstruct data later |
| GOV-006 | Auditor | Access signed export manifests for official reports | Verifiable report authenticity |
| GOV-007 | System Administrator | Define role-based access with segregation of duties | Enforce maker-checker and prevent conflicts |
| GOV-008 | Internal Auditor | Review exception logs and audit events | Identify control breakdowns and risks |

### Integration & API Module

| ID | As A | I Want | So That |
|----|------|--------|---------|
| INT-001 | Implementation Partner | Access well-documented API boundaries | Integrate external systems easily |
| INT-002 | System | Import payroll deduction files from employers | Automated share capital and loan repayments |
| INT-003 | System | Import bank statements for reconciliation | Automated bank recs |
| INT-004 | System | Send SMS/email notifications for transactions | Member communication |
| INT-005 | System | Export data to BI tools and data warehouse | Advanced analytics and reporting |
| INT-006 | System | Support government filing exports (CDA, BIR) | Regulatory compliance |

---

## Acceptance Criteria

### MEM-001: Encode and approve member applications through maker-checker flow

**Given** a membership officer is logged in with maker role  
**When** they create a new member application with complete data  
**Then** the application status is set to "draft"  
**And** the system records the creator as the maker  

**Given** a membership application is in "draft" status  
**When** a membership officer with checker role reviews and approves it  
**Then** the application status changes to "approved"  
**And** the system records the approver as the checker with timestamp  
**And** a member number is generated  
**And** default share capital account is created  
**And** the member master record is created  

**Given** a membership application is approved  
**When** the system creates the member record  
**Then** the member status is "active"  
**And** KYC status is "complete"  
**And** all required documents are linked  

### CAP-003: Process payroll-linked share capital contributions

**Given** a member has payroll deduction setup with an employer  
**When** the payroll import file is processed  
**Then** the member's share capital account is credited with the deduction amount  
**And** a transaction record is created with source "payroll"  
**And** an accounting entry is posted to the appropriate GL accounts  
**And** the transaction is immutable (cannot be edited)  

**Given** a payroll import file is processed  
**When** a member is not found or has errors  
**Then** the error is logged in the exception queue  
**And** the file processing continues for valid records  
**And** a report of errors is generated for follow-up  

### SAV-003: Process savings withdrawals with validation

**Given** a member requests a withdrawal from their savings account  
**When** the teller enters the withdrawal amount  
**Then** the system validates:  
- Account status is "active"  
- Available balance >= withdrawal amount  
- No holds or restrictions prevent withdrawal  
- Withdrawal amount meets minimum/maximum rules  
- Dormancy fees are applied if applicable  

**Given** validation passes  
**When** the withdrawal is confirmed  
**Then** the account balance is reduced  
**And** a receipt is generated with unique reference  
**And** an accounting entry is created (debit cash, credit savings)  
**And** an audit event is logged with actor, timestamp, and branch  
**And** the transaction is immutable  

### LN-007: Record loan payments and apply allocation waterfall

**Given** a member makes a loan payment  
**When** the teller records the payment against a loan account  
**Then** the system determines the due amount breakdown:  
- Penalty (if any)  
- Interest  
- Principal  

**Given** the payment amount is less than total due  
**When** the allocation waterfall is applied  
**Then** penalty is paid first, then interest, then principal  
**And** the payment is allocated to the oldest due items first  

**Given** the payment is recorded  
**Then** the loan balance is updated  
**And** the amortization schedule is updated  
**And** the delinquency bucket is recalculated  
**And** a collection receipt is generated  
**And** accounting entries are posted (debit cash, credit loan receivable, interest income, penalty income)  
**And** an audit event is logged  

### ACC-007: Close accounting period

**Given** the accounting period end date is reached  
**When** the accounting officer initiates period close  
**Then** the system:  
- Locks all transaction entry for the period  
- Runs accrual batch jobs (if configured)  
- Generates trial balance  
- Validates subledger-to-GL reconciliation  
- Flags any exceptions for review  

**Given** all reconciliations are successful  
**When** the period close is confirmed  
**Then** the period status changes to "closed"  
**And** no further transactions can be posted to that period  
**And** financial statements are generated  
**And** a compliance evidence snapshot is archived  

### GOV-003: Maintain compliance calendar

**Given** a compliance requirement is defined (e.g., CDA annual report due March 31)  
**When** the compliance officer sets up the filing calendar  
**Then** the system creates a calendar item with:  
- Due date  
- Responsible officer  
- Required documents/templates  
- Notification schedule  

**Given** the filing calendar is set up  
**When** the due date approaches  
**Then** the system sends notifications to the responsible officer  
**And** the requirement status is "pending"  

**Given** the report is submitted  
**When** the compliance officer records the submission  
**Then** the requirement status changes to "submitted"  
**And** the submission date and acknowledgement receipt are stored  
**And** the evidence is archived  

---

## Workflow Definitions

## AI Workflows

### AI-001: KYC Document Classification and Completeness
**Trigger**: Member document uploaded  
**Inputs**: document file, member_id, required_document_checklist  
**Steps**:
1. Classify document type and extract metadata (ID type, expiry, name).
2. Match extracted data to member profile fields.
3. Check completeness against required checklist.
4. Flag mismatches or missing documents for review.
5. Update KYC status to "complete" only after human approval.

**Outputs**:
- Document classification result
- Completeness status
- Review queue item (if discrepancies)
**AI Risk Controls**:
- Human-in-the-loop approval before KYC status changes to "complete".
- Full audit log of classification, reviewer, and decision timestamp.
**Links**:
- User stories: MEM-003, MEM-004
- Events: `member.kyc_completed`, `member.document.uploaded`

### AI-002: Loan Risk Scoring Assistant
**Trigger**: Loan application submitted  
**Inputs**: application data, member history, savings/loan exposure, delinquency history  
**Steps**:
1. Compute risk features (tenure, exposure ratio, repayment history).
2. Generate a risk score and recommended decision band.
3. Produce an explanation summary for the credit committee.
4. Route to committee with score and rationale.

**Outputs**:
- Risk score
- Recommendation band
- Explanation summary
**AI Risk Controls**:
- Human committee decision required; AI provides advisory only.
- Audit log of score inputs, model version, and decision basis.
**Links**:
- User stories: LN-002, LN-003
- Events: `loan.application_submitted`, `loan.application_approved`

### AI-003: Compliance Report Pre-Fill and Validation
**Trigger**: Compliance report period opens  
**Inputs**: reporting calendar item, relevant datasets, prior submissions  
**Steps**:
1. Pre-fill report templates with extracted data.
2. Validate required fields and totals against GL/subledger.
3. Flag inconsistencies or missing evidence.
4. Generate a draft submission pack for review.

**Outputs**:
- Draft report dataset
- Validation results and exceptions list
**AI Risk Controls**:
- Human compliance officer must review and sign-off prior to submission.
- Audit log of data sources, validation results, and approval.
**Links**:
- User stories: GOV-003, GOV-004
- Events: `compliance.report_generated`, `compliance.submission_recorded`

### AI-004: Member Support Chatbot Triage
**Trigger**: Member inquiry received via portal  
**Inputs**: inquiry text, member profile, recent transactions  
**Steps**:
1. Classify inquiry type (balance, loan status, documents, general).
2. Provide safe, read-only responses based on permitted data.
3. Create a ticket for unresolved or restricted requests.
4. Escalate sensitive cases to human staff.

**Outputs**:
- Response draft
- Ticket with classification and context
**AI Risk Controls**:
- Only read-only, non-sensitive data exposed in responses.
- Audit log of conversations, escalations, and staff actions.
**Links**:
- User stories: MEM-005, INT-004
- Events: `member.inquiry_received`, `member.inquiry_escalated`

### AI-005: Collections Prioritization Assistant
**Trigger**: Daily collections planning  
**Inputs**: delinquency buckets, payment history, member contact data  
**Steps**:
1. Score accounts by risk and recovery likelihood.
2. Generate prioritized call/visit list.
3. Suggest recommended outreach channel and timing.
4. Log decisions and allow human override.

**Outputs**:
- Prioritized collections list
- Outreach recommendations
**AI Risk Controls**:
- Human collections officer approves final outreach list.
- Audit log of scoring factors, ranking, and overrides.
**Links**:
- User stories: LN-012
- Events: `loan.delinquency_bucketed`, `loan.collection_list_generated`

### Member Onboarding Workflow

**Trigger**: New member application submitted  
**Preconditions**:  
- Member is not already in the system  
- Required KYC documents are available  

**Steps**:
1. **Capture Application** - Record basic member information (name, birth date, civil status, addresses, contacts)
2. **Capture Identity & Tax Data** - Record government IDs, TIN, nationality
3. **Capture Employment** - Record employer, employee number, payroll group (if applicable)
4. **Collect KYC Documents** - Upload IDs, proof of address, photos, etc.
5. **Screen Duplicates** - Check against existing members using name, ID numbers, etc.
6. **Screen Sanctions** - Check against sanctions list (if configured)
7. **Route for Approval** - Assign to membership officer for review
8. **Maker Review** - Verify completeness and accuracy
9. **Checker Approval** - Second officer approves or declines
10. **Create Member Master** - Generate member number and create record
11. **Open Default Share Capital** - Create share capital account with opening amount
12. **Open Optional Savings** - Create savings accounts if requested
13. **Generate Document Packet** - Compile member number, account numbers, terms

**Outputs**:
- Member record with member_no
- Share capital account
- Optional savings accounts
- KYC document archive
- Audit events for each step

**Postconditions**: Member status = "active", can transact

---

### Share Capital Build-Up Workflow

**Trigger**: Member contribution (cash or payroll)  
**Preconditions**:  
- Member is active  
- Share capital account exists and is open  

**Steps**:
1. **Define Contribution Rule** - Configure minimum, frequency, source (cash/payroll)
2. **Accept Contribution** - Teller receives cash or payroll file processes deduction
3. **Validate Amount** - Check minimum/maximum rules
4. **Post to Member Ledger** - Credit share capital account
5. **Generate Accounting Entry** - Debit cash/bank, credit share capital liability/equity
6. **Update Balance** - Recalculate current balance
7. **Generate Receipt** - Issue official receipt with reference

**Outputs**:
- Share capital transaction record
- Journal entry batch
- Updated account balance
- Receipt document

---

### Savings Deposit/Withdrawal Workflow

**Trigger**: Teller initiates transaction  
**Preconditions**:  
- Member has active savings account  
- Teller has active cash session  
- Cash limits are not exceeded  

**Steps**:
1. **Select Account** - Choose member's savings account
2. **Validate Account Status** - Must be active, not frozen
3. **Validate Transaction Type** - Deposit or withdrawal
4. **Check Holds/Restrictions** - Any blocks on account?
5. **Validate Amount** - Within limits, meets minimum/maximum
6. **Apply Fees** - If withdrawal, check for dormancy or transaction fees
7. **Calculate Available Balance** - Current - holds
8. **Accept Funds or Disburse Cash** - Physical cash handling
9. **Capture Source Document** - Reference number (e.g., deposit slip)
10. **Post to Account** - Update balance
11. **Generate Receipt** - Issue receipt with transaction reference
12. **Create Accounting Entry** - Debit/credit appropriate GL accounts
13. **Update Cash Session** - Adjust teller cash total
14. **Log Audit Event** - Record all details with actor, timestamp

**Outputs**:
- Savings transaction record (immutable)
- Journal entry
- Receipt
- Updated account balance
- Cash session update
- Audit event

---

### Cash Session Workflow

**Trigger**: Teller starts/ends workday  
**Preconditions**:  
- Teller is assigned to branch  
- Teller is authenticated  

**Steps (Open)**:
1. **Initiate Open** - Teller requests to open session
2. **Enter Beginning Cash Count** - Physical cash counted
3. **Validate Assignment** - System confirms teller-branch mapping
4. **Check Existing Sessions** - No other open session for this teller
5. **Create Session Record** - Status = "open", store beginning balance
6. **Post Opening Entry** - Debit Cash on Hand, credit Cash in Transit (or similar)
7. **Log Event** - Session opened with timestamp

**Steps (Close)**:
1. **Initiate Close** - Teller requests to close session
2. **Enter Ending Cash Count** - Physical cash counted
3. **Calculate Variance** - System computes expected vs actual
4. **Review Transactions** - List all transactions in session
5. **Confirm Reconciliation** - Teller confirms counts
6. **Create Closing Entry** - Adjust for variance if any
7. **Update Session Status** - Status = "closed"
8. **Generate Session Report** - Proof sheet with all details

**Outputs**:
- Cash session record (open/close)
- Opening/closing journal entries
- Variance report
- Session proof sheet

---

### Loan Origination Workflow

**Trigger**: Member submits loan application  
**Preconditions**:  
- Member is active and KYC-complete  
- Loan product is active  
- Member meets basic eligibility (membership tenure, share capital requirement)  

**Steps**:
1. **Create Application** - Record loan details (amount, term, purpose, product)
2. **Validate Eligibility** - Check member status, risk class, existing exposure
3. **Collect Documents** - Upload required documents (income proof, collateral, etc.)
4. **Record Co-makers** - Add co-maker members if required
5. **Assign Credit Investigator** - Route to CI officer
6. **Perform Credit Assessment** - CI conducts investigation, scores, recommends
7. **Prepare Recommendation** - CI submits findings and recommendation
8. **Route to Approving Body** - Based on amount/risk, route to committee or individual approver
9. **Committee Review** - If committee, members review and vote
10. **Record Decision** - Approve, decline, or return for more info
11. **Record Conditions** - If approved with conditions, track fulfillment
12. **Generate Loan Documents** - Promissory note, disclosure statements
13. **Disburse Loan** - Release funds to member (cash or transfer)
14. **Create Amortization Schedule** - Generate payment schedule based on terms
15. **Create Loan Account** - Convert application to active loan account
16. **Post Accounting Entries** - Debit Loans Receivable, credit Cash/Bank
17. **Log Audit Events** - All steps recorded

**Outputs**:
- Loan application record
- Credit assessment report
- Decision record with approver identity
- Loan account with amortization schedule
- Disbursement voucher
- Journal entry batch
- Document packet
- Audit trail

---

### Loan Collection Workflow

**Trigger**: Payment due date or early payment  
**Preconditions**:  
- Loan account is active  
- Payment amount > 0  

**Steps**:
1. **Select Loan Account** - Identify which loan is being paid
2. **Determine Due Amount** - Calculate principal, interest, penalties due
3. **Accept Payment** - Cash, check, or other channel
4. **Apply Allocation Waterfall**:
   - First to penalty/fees
   - Then to interest
   - Then to principal
   - Oldest items first if multiple periods due
5. **Update Amortization Schedule** - Mark payment as made, adjust outstanding
6. **Recalculate Delinquency** - Update bucket (current, 1-30, 31-60, 61-90, 91+)
7. **Generate Receipt** - Official receipt with breakdown
8. **Post Accounting Entries**:
   - Debit Cash
   - Credit Interest Income (if interest portion)
   - Credit Penalty Income (if penalty portion)
   - Credit Loans Receivable (principal portion)
9. **Update Loan Status** - If fully paid, change to "paid"
10. **Log Audit Event** - Full details recorded

**Outputs**:
- Collection receipt
- Updated loan balance and schedule
- Journal entry
- Delinquency bucket update
- Audit event

---

### Loan Restructuring Workflow

**Trigger**: Member requests restructuring due to hardship  
**Preconditions**:  
- Loan is delinquent or at risk of delinquency  
- Member has valid reason (job loss, emergency, etc.)  
- Cooperative policy allows restructuring  

**Steps**:
1. **Raise Restructuring Request** - Record reason and supporting evidence
2. **Freeze Old Schedule** - Mark current amortization as frozen
3. **Review Financials** - Assess member's ability to pay under new terms
4. **Propose New Terms** - Extended term, reduced payments, interest reduction, etc.
5. **Route for Approval** - Usually requires higher approval level than original loan
6. **Record Decision** - Approve with specific new terms
7. **Generate Revised Schedule** - New amortization with effective date
8. **Preserve History** - Link old and new loan accounts for audit trail
9. **Post Adjustment Entries** - If needed, adjust for interest accrual changes
10. **Update Loan Status** - "restructured"
11. **Notify Member** - Communicate new terms and payment schedule

**Outputs**:
- Restructuring request record
- Revised amortization schedule
- Adjustment journal entries (if any)
- Audit trail linking old and new schedules
- Decision record

---

### Period Close Workflow

**Trigger**: End of accounting period (monthly, quarterly, annually)  
**Preconditions**:  
- All transactions for period are posted  
- No open cash sessions (or exceptions noted)  

**Steps**:
1. **Lock Transaction Window** - Prevent new postings to period
2. **Run Accruals** - Auto-generate accrual entries for unpaid expenses, unearned income
3. **Run Batch Jobs** - Interest accruals, dividend calculations, fee postings
4. **Review Suspense Queue** - Clear any unposted items
5. **Validate Reconciliations**:
   - Subledger totals = GL control accounts
   - Bank reconciliations complete
   - Cash counts match GL
6. **Generate Trial Balance** - Verify debits = credits
7. **Review Exceptions** - Investigate any mismatches
8. **Close Period** - Change period status to "closed"
9. **Generate Financial Statements**:
   - Statement of Financial Position
   - Statement of Operations
   - Notes and supporting schedules
10. **Archive Evidence** - Snapshot of all data used for reporting
11. **Generate Report Pack** - Board-approved reports
12. **Log Completion** - Record who closed, when, and any issues

**Outputs**:
- Closed period flag
- Financial statements
- Audit archive
- Reconciliation reports
- Compliance evidence package

---

## Architectural Decision Records (ADRs)

### ADR-001: Use Modular Monolith for MVP

**Status**: Accepted  
**Context**: Need fast delivery with strong transactional consistency for financial operations. Team size is small to medium.  
**Decision**: Build as a modular monolith with strong domain boundaries and event-ready design.  
**Consequences**:
- **Positive**: Simpler deployment, ACID transactions across modules, faster MVP delivery, easier debugging
- **Negative**: Future scaling to microservices requires disciplined module boundaries and event contracts
- **Mitigations**: Define clear module interfaces, use domain events, avoid cross-module direct DB access

---

### ADR-002: Ledger-Centric Accounting Core

**Status**: Accepted  
**Context**: Financial integrity is paramount. Every balance must be traceable to source documents and posting batches.  
**Decision**: Implement a double-entry accounting core with immutable journal entries and subledger reconciliation.  
**Consequences**:
- **Positive**: Auditability, regulatory compliance, error detection, financial control
- **Negative**: Complexity in posting logic, need for skilled accounting knowledge
- **Mitigations**: Use posting templates, automate reconciliation, provide clear error messages

---

### ADR-003: Event-Ready Boundaries for Future Service Extraction

**Status**: Accepted  
**Context**: Need to support future evolution to microservices without rewriting business logic.  
**Decision**: Publish domain events for all significant business actions (member.approved, loan.disbursed, etc.) using an in-process event bus that can later be extracted to a message broker.  
**Consequences**:
- **Positive**: Loose coupling, extensibility, supports async processing (notifications, reporting)
- **Negative**: Added complexity in event handling, eventual consistency considerations
- **Mitigations**: Start simple with synchronous events, document event contracts, use idempotent handlers

---

### ADR-004: Configuration-Driven Product Engine

**Status**: Accepted  
**Context**: Cooperative needs flexibility to define savings and loan products without code changes.  
**Decision**: Store product parameters (interest rates, fees, rules) in database with JSON configuration.  
**Consequences**:
- **Positive**: Business can configure products, faster time-to-market for new offerings
- **Negative**: Complex validation logic, need for admin UI to manage products
- **Mitigations**: Provide product template wizard, validate configurations before activation

---

### ADR-005: Document-Backed Transactions

**Status**: Accepted  
**Context**: Regulatory requirement: every financial transaction must have supporting documentation.  
**Decision**: Every transaction must reference a source document (receipt, voucher, application) and store document metadata (number, date, upload).  
**Consequences**:
- **Positive**: Auditability, compliance, dispute resolution
- **Negative**: Document management overhead, storage costs
- **Mitigations**: Use document scanning service, implement document lifecycle management

---

### ADR-006: Maker-Checker for All Sensitive Actions

**Status**: Accepted  
**Context**: Internal control requirement to prevent fraud and errors.  
**Decision**: Implement two-person approval for: member approval, loan approval, period close, journal adjustments, user role changes.  
**Consequences**:
- **Positive**: Strong internal control, segregation of duties
- **Negative**: Slower processes, need for workflow management
- **Mitigations**: Configure approval matrices, support parallel approvals, provide delegation

---

### ADR-007: No Direct Edits to Posted Financial Transactions

**Status**: Accepted  
**Context**: Accounting principle: posted transactions are immutable. Corrections must be via reversals or adjustments.  
**Decision**: Disallow UPDATE on posted journal entries and financial transactions. Use reversal entries or adjustment entries in next period.  
**Consequences**:
- **Positive**: Immutable audit trail, compliance with accounting standards
- **Negative**: More complex correction process, user training needed
- **Mitigations**: Provide clear UI for reversals, auto-generate reversal entries

---

### ADR-008: Branch-Aware but Centrally Governed

**Status**: Accepted  
**Context**: Cooperative may have multiple branches but needs centralized control and reporting.  
**Decision**: All data is branch-scoped but centrally stored. Branch-specific configuration (cash limits, product availability) is allowed.  
**Consequences**:
- **Positive**: Local flexibility, centralized oversight, consistent data
- **Negative**: Need for branch-based access control, data partitioning
- **Mitigations**: Use branch_id in all queries, enforce row-level security

---

### ADR-009: Role-Based Access with Field-Level PII Protection

**Status**: Accepted  
**Context**: Sensitive member data (TIN, IDs) must be protected. Different roles need different access levels.  
**Decision**: Implement RBAC with permission matrix. For sensitive fields, use field-level encryption or masking in UI/API.  
**Consequences**:
- **Positive**: Data privacy, compliance with data protection laws
- **Negative**: Complex permission management, performance overhead for encryption
- **Mitigations**: Use database column encryption, cache decrypted values for authorized users

---

### ADR-010: API-First Integration Layer

**Status**: Accepted  
**Context**: Need to integrate with external systems (payroll, bank, SMS, BI).  
**Decision**: Define versioned REST APIs with OpenAPI spec. Use API keys and OAuth2 for authentication.  
**Consequences**:
- **Positive**: Standardized integration, easier for partners, testable
- **Negative**: API versioning overhead, need for API gateway
- **Mitigations**: Start with internal APIs, document thoroughly, use semantic versioning

---

## API Boundary Specifications

### Member Service API

**Base Path**: `/api/v1/members`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/applications` | Submit member application | Public (with CAPTCHA) |
| GET | `/applications/{id}` | View application status | Member (own), Officer |
| POST | `/applications/{id}/submit` | Submit for approval | Maker |
| POST | `/applications/{id}/approve` | Approve application | Checker |
| GET | `/` | List members (with filters) | Officer, Admin |
| GET | `/{id}` | Get member details | Officer, Admin, Member (own) |
| PUT | `/{id}` | Update member (limited fields) | Officer, Admin |
| GET | `/{id}/kyc` | Get KYC profile and documents | Officer, Admin |
| POST | `/{id}/documents` | Upload KYC document | Officer, Admin |
| GET | `/{id}/accounts` | List member's financial accounts | Officer, Admin, Member (own) |

### Savings Service API

**Base Path**: `/api/v1/savings`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/accounts` | Open savings account | Officer |
| GET | `/accounts/{id}` | Get account details | Officer, Admin, Member (own) |
| GET | `/accounts/{id}/ledger` | Get transaction ledger | Officer, Admin, Member (own) |
| POST | `/transactions/deposit` | Record deposit | Teller, Officer |
| POST | `/transactions/withdraw` | Record withdrawal | Teller, Officer |
| GET | `/products` | List savings products | Public (limited), Officer |
| POST | `/products` | Create savings product | Admin |
| PUT | `/products/{id}` | Update product | Admin |

### Loans Service API

**Base Path**: `/api/v1/loans`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/applications` | Submit loan application | Member, Officer |
| GET | `/applications` | List applications (with filters) | Officer, Admin |
| GET | `/applications/{id}` | Get application details | Officer, Admin, Member (own) |
| POST | `/applications/{id}/submit` | Submit for processing | Member (own), Officer |
| POST | `/applications/{id}/decision` | Record approval/decline | Credit Officer, Committee |
| POST | `/accounts/{id}/disburse` | Disburse loan | Officer, Admin |
| POST | `/accounts/{id}/collect` | Record payment | Teller, Officer |
| POST | `/accounts/{id}/restructure` | Request restructuring | Officer |
| GET | `/products` | List loan products | Public (limited), Officer |
| POST | `/products` | Create loan product | Admin |
| PUT | `/products/{id}` | Update product | Admin |

### Accounting Service API

**Base Path**: `/api/v1/accounting`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/journal-batches` | Create journal batch | Accounting Officer |
| POST | `/journal-batches/{id}/post` | Post batch to GL | Accounting Officer, Admin |
| GET | `/gl/trial-balance` | Get trial balance | Accounting Officer, Admin, Auditor |
| GET | `/gl/account/{code}` | Get GL account details | Accounting Officer, Admin, Auditor |
| GET | `/reconciliation/exceptions` | Get unreconciled items | Accounting Officer, Auditor |
| POST | `/reconciliation/run` | Run reconciliation batch | System/Admin |
| GET | `/periods` | List accounting periods | Accounting Officer, Admin |
| POST | `/periods/{id}/close` | Close period | Accounting Officer, Admin |

### Compliance Service API

**Base Path**: `/api/v1/compliance`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/calendar` | Get filing calendar | Compliance Officer, Admin |
| POST | `/calendar` | Create calendar item | Compliance Officer, Admin |
| GET | `/requirements` | List compliance requirements | Compliance Officer, Admin |
| POST | `/submissions` | Record report submission | Compliance Officer |
| GET | `/reports/capr-dataset` | Generate CDA report data | Compliance Officer, Admin |
| GET | `/reports/bir-dataset` | Generate BIR report data | Compliance Officer, Admin |
| GET | `/audit-log` | Get audit events (filtered) | Auditor, Admin |

---

## Event Catalog

All events follow the format: `{domain}.{aggregate}.{event}`

### Member Domain Events

| Event | When Published | Payload |
|-------|----------------|---------|
| `member.application.submitted` | Member application submitted | `{ applicationId, memberId, submittedAt, submittedBy }` |
| `member.application.approved` | Application approved | `{ applicationId, memberId, approvedAt, approvedBy, memberNo }` |
| `member.application.declined` | Application declined | `{ applicationId, memberId, declinedAt, declinedBy, reason }` |
| `member.created` | Member master record created | `{ memberId, memberNo, createdAt, createdBy }` |
| `member.updated` | Member data changed | `{ memberId, changedFields, changedAt, changedBy }` |
| `member.status.changed` | Member status changed | `{ memberId, oldStatus, newStatus, changedAt, changedBy }` |

### Share Capital Events

| Event | When Published | Payload |
|-------|----------------|---------|
| `share_capital.account.opened` | Share capital account created | `{ accountId, memberId, openingAmount, openedAt }` |
| `share_capital.contribution.posted` | Contribution posted | `{ transactionId, accountId, amount, source, postedAt }` |
| `share_capital.interest.posted` | Interest/dividend posted | `{ accountId, amount, period, postedAt }` |

### Savings Events

| Event | When Published | Payload |
|-------|----------------|---------|
| `savings.account.opened` | Savings account created | `{ accountId, memberId, productCode, openedAt }` |
| `savings.deposit.posted` | Deposit posted | `{ transactionId, accountId, amount, sourceDocument, postedAt }` |
| `savings.withdrawal.posted` | Withdrawal posted | `{ transactionId, accountId, amount, sourceDocument, postedAt }` |
| `savings.interest.accrued` | Interest accrued (not yet posted) | `{ accountId, amount, accrualDate }` |
| `savings.fee.applied` | Fee applied (dormancy, transaction) | `{ accountId, feeType, amount, appliedAt }` |
| `savings.account.closed` | Account closed | `{ accountId, closedAt, reason }` |

### Loan Events

| Event | When Published | Payload |
|-------|----------------|---------|
| `loan.application.submitted` | Loan application submitted | `{ applicationId, memberId, productCode, amount, submittedAt }` |
| `loan.application.approved` | Application approved | `{ applicationId, approvedAt, approvedBy, conditions }` |
| `loan.application.declined` | Application declined | `{ applicationId, declinedAt, declinedBy, reason }` |
| `loan.account.created` | Loan account created from approved application | `{ loanAccountId, applicationId, disbursementDate, amortizationScheduleId }` |
| `loan.disbursed` | Loan funds disbursed | `{ loanAccountId, amount, disbursementDate, method }` |
| `loan.payment.posted` | Payment received and posted | `{ receiptId, loanAccountId, amount, allocation, postedAt }` |
| `loan.restructured` | Loan restructured | `{ loanAccountId, oldScheduleId, newScheduleId, restructuredAt, reason }` |
| `loan.written_off` | Loan written off | `{ loanAccountId, writtenOffAt, reason, writeOffAmount }` |
| `loan.paid` | Loan fully paid | `{ loanAccountId, paidAt, totalPaid }` |

### Accounting Events

| Event | When Published | Payload |
|-------|----------------|---------|
| `journal.batch.created` | Journal batch created | `{ batchId, description, createdBy, createdAt, entryCount }` |
| `journal.batch.posted` | Batch posted to GL | `{ batchId, postingDate, postedBy, postedAt }` |
| `journal.entry.reversed` | Journal entry reversed | `{ entryId, reversalEntryId, reversedAt, reversedBy }` |
| `period.close.initiated` | Period close started | `{ periodId, initiatedBy, initiatedAt }` |
| `period.close.completed` | Period close finished | `{ periodId, closedBy, closedAt, statementsGenerated }` |

### Compliance Events

| Event | When Published | Payload |
|-------|----------------|---------|
| `compliance.requirement.created` | New compliance requirement added | `{ requirementId, name, dueDate, responsibleRole }` |
| `compliance.reminder.sent` | Reminder sent for upcoming deadline | `{ requirementId, reminderDate, recipients }` |
| `compliance.report.submitted` | Report submitted to regulator | `{ requirementId, submissionId, submittedAt, submittedBy, attachmentIds }` |
| `compliance.deficiency.identified` | Deficiency found | `{ requirementId, deficiencyId, identifiedAt, description }` |

### AI Workflow Events

| Event | When Published | Payload |
|-------|----------------|---------|
| `member.document.uploaded` | Document uploaded for member | `{ memberId, documentId, documentType, uploadedAt }` |
| `member.kyc_completed` | KYC checklist approved by human reviewer | `{ memberId, reviewedBy, reviewedAt }` |
| `member.inquiry_received` | Member inquiry received via portal | `{ memberId, inquiryId, receivedAt, channel }` |
| `member.inquiry_escalated` | Inquiry escalated to staff | `{ inquiryId, escalatedTo, escalatedAt, reason }` |
| `loan.delinquency_bucketed` | Delinquency bucket updated | `{ loanAccountId, bucket, updatedAt }` |
| `loan.collection_list_generated` | Collections list generated for the day | `{ listId, generatedAt, generatedBy }` |

---

## Data Model Extensions

### Additional Prisma Models Required

```prisma
model Cooperative {
  id                 String    @id @default(cuid())
  legalName          String
  registrationNo     String    @unique
  tin                String
  coopType           CooperativeType @default(SAVINGS_AND_CREDIT)
  reportingCalendar  String // e.g., "calendar_year", "fiscal_year"
  taxStatusProfile   String
  branches           Branch[]
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model Branch {
  id                 String    @id @default(cuid())
  code               String    @unique
  name               String
  address            String?
  contactPhone       String?
  managerId          String?
  manager            User?      @relation(fields: [managerId], references: [id])
  cooperativeId      String
  cooperative        Cooperative @relation(fields: [cooperativeId], references: [id])
  cashLimit          Decimal   @default(0)
  isActive           Boolean   @default(true)
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  users              User[]
  members            Member[]
  cashSessions       CashSession[]
}

model Member {
  id                 String    @id @default(cuid())
  memberNo           String    @unique
  status             MemberStatus @default(ACTIVE)
  fullName           String
  lastName           String
  firstName          String
  middleName         String?
  suffix             String?
  birthDate          DateTime
  civilStatus        String
  nationality        String
  addresses          Json?     // { residential: {}, business: {} }
  contacts           Json?     // { mobile: string, email: string, ... }
  employment         Json?     // { employerName, employeeNo, payrollGroup }
  tax                Json?     // { tin: string, tinStatus: enum }
  membership         Json?     // { membershipDate, memberType, chapterOrBranch, riskClass }
  kycProfile         KYCProfile?
  kycProfileId       String?
  documents          MemberDocument[]
  shareCapitalAccount ShareCapitalAccount?
  savingsAccounts    SavingsAccount[]
  loanAccounts       LoanAccount[]
  applications       MembershipApplication[]
  createdBy          String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model MembershipApplication {
  id                 String    @id @default(cuid())
  applicationNo      String    @unique
  memberId           String?   // linked after approval
  member             Member?   @relation(fields: [memberId], references: [id])
  status             ApplicationStatus @default(DRAFT)
  submittedAt        DateTime?
  submittedBy        String?
  approvedAt         DateTime?
  approvedBy         String?
  declinedAt         DateTime?
  declinedBy         String?
  declineReason      String?
  data               Json      // all application data
  documents          MemberDocument[]
  createdBy          String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model KYCProfile {
  id                 String    @id @default(cuid())
  memberId           String    @unique
  member             Member    @relation(fields: [memberId], references: [id])
  verificationStatus VerificationStatus @default(PENDING)
  verifiedAt         DateTime?
  verifiedBy         String?
  riskLevel          RiskLevel @default(LOW)
  notes              String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model MemberDocument {
  id                 String    @id @default(cuid())
  memberId           String
  member             Member    @relation(fields: [memberId], references: [id])
  applicationId      String?
  application        MembershipApplication? @relation(fields: [applicationId], references: [id])
  documentType       DocumentType
  fileName           String
  filePath           String
  fileSize           Int
  mimeType           String
  uploadedAt         DateTime  @default(now())
  uploadedBy         String
}

model ShareCapitalAccount {
  id                 String    @id @default(cuid())
  accountNo          String    @unique
  memberId           String    @unique
  member             Member    @relation(fields: [memberId], references: [id])
  productCode        String
  currentBalance     Decimal   @default(0)
  availableBalance   Decimal   @default(0)
  holdBalance        Decimal   @default(0)
  status             AccountStatus @default(ACTIVE)
  openedAt           DateTime  @default(now())
  closedAt           DateTime?
  transactions       ShareCapitalTransaction[]
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model ShareCapitalTransaction {
  id                 String    @id @default(cuid())
  transactionNo      String    @unique
  accountId          String
  account            ShareCapitalAccount @relation(fields: [accountId], references: [id])
  transactionType    TransactionType
  amount             Decimal
  source             TransactionSource
  sourceDocumentRef  String?
  effectiveDate      DateTime
  postingDate        DateTime
  status             TransactionStatus @default(POSTED)
  journalEntryId     String?
  journalEntry       JournalEntry? @relation(fields: [journalEntryId], references: [id])
  createdBy          String
  createdAt          DateTime  @default(now())
}

model SavingsAccount {
  id                 String    @id @default(cuid())
  accountNo          String    @unique
  memberId           String
  member             Member    @relation(fields: [memberId], references: [id])
  productCode        String
  status             AccountStatus @default(ACTIVE)
  currentBalance     Decimal   @default(0)
  availableBalance   Decimal   @default(0)
  holdBalance        Decimal   @default(0)
  interestRuleId     String?
  feesRuleId         String?
  openedAt           DateTime  @default(now())
  closedAt           DateTime?
  transactions       SavingsTransaction[]
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model SavingsTransaction {
  id                 String    @id @default(cuid())
  transactionNo      String    @unique
  accountId          String
  account            SavingsAccount @relation(fields: [accountId], references: [id])
  transactionType    TransactionType
  amount             Decimal
  source             TransactionSource
  sourceDocumentRef  String?
  effectiveDate      DateTime
  postingDate        DateTime
  status             TransactionStatus @default(POSTED)
  journalEntryId     String?
  journalEntry       JournalEntry? @relation(fields: [journalEntryId], references: [id])
  feeApplied         Decimal   @default(0)
  holdApplied        Decimal   @default(0)
  createdBy          String
  createdAt          DateTime  @default(now())
}

model CashSession {
  id                 String    @id @default(cuid())
  sessionNo          String    @unique
  tellerId           String
  teller             User      @relation(fields: [tellerId], references: [id])
  branchId           String
  branch             Branch    @relation(fields: [branchId], references: [id])
  status             CashSessionStatus @default(OPEN)
  openingBalance     Decimal
  closingBalance     Decimal?
  expectedBalance    Decimal?
  variance           Decimal?
  openedAt           DateTime  @default(now())
  closedAt           DateTime?
  transactions       Transaction[] // teller transactions during session
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model JournalBatch {
  id                 String    @id @default(cuid())
  batchNo            String    @unique
  description        String
  postingDate        DateTime
  status             BatchStatus @default(DRAFT)
  entryCount         Int       @default(0)
  totalDebit         Decimal   @default(0)
  totalCredit        Decimal   @default(0)
  postedBy           String?
  postedAt           DateTime?
  entries            JournalEntry[]
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model JournalEntry {
  id                 String    @id @default(cuid())
  entryNo            String    @unique
  batchId            String?
  batch              JournalBatch? @relation(fields: [batchId], references: [id])
  sourceModule       String    // e.g., "savings", "loan", "share_capital"
  sourceReference    String    // e.g., transaction ID, application ID
  postingDate        DateTime
  branchId           String
  branch             Branch    @relation(fields: [branchId], references: [id])
  status             JournalEntryStatus @default(DRAFT)
  description        String?
  lines              JournalLine[]
  reversalEntryId    String?
  reversalEntry      JournalEntry? @relation(name: "ReversalEntries", fields: [reversalEntryId], references: [id])
  reversedBy         String?
  reversedAt         DateTime?
  createdBy          String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model JournalLine {
  id                 String    @id @default(cuid())
  journalEntryId     String
  journalEntry       JournalEntry @relation(fields: [journalEntryId], references: [id])
  lineNo             Int
  glAccountCode      String
  glAccount          GeneralLedgerAccount @relation(fields: [glAccountCode], references: [code])
  slReference        String?   // subsidiary ledger reference (e.g., member ID, loan ID)
  debit              Decimal   @default(0)
  credit             Decimal   @default(0)
  description        String?
}

model GeneralLedgerAccount {
  code               String    @id
  name               String
  accountType        String    // asset, liability, equity, income, expense
  subType            String?
  isControlAccount   Boolean   @default(false)
  subsidiaryLedger   String?   // e.g., "member", "loan", "share_capital"
  isActive           Boolean   @default(true)
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model BoardResolution {
  id                 String    @id @default(cuid())
  resolutionNo       String    @unique
  meetingDate        DateTime
  subject           String
  content           String
  approvedBy        String // comma-separated member IDs or reference to approval
  attachments       String[] // file paths
  recordedBy        String
  recordedAt        DateTime  @default(now())
}

model CommitteeDecision {
  id                 String    @id @default(cuid())
  decisionNo         String    @unique
  committeeType      String    // e.g., "credit", "audit"
  meetingDate        DateTime
  agendaItem         String
  decision           String
  membersPresent     String[]
  attachments       String[]
  recordedBy        String
  recordedAt        DateTime  @default(now())
}

model ComplianceRequirement {
  id                 String    @id @default(cuid())
  code               String    @unique
  name               String
  description        String?
  regulatingBody     String    // e.g., "CDA", "BIR"
  frequency          String    // annual, quarterly, monthly, adhoc
  dueDateOffsetDays  Int       // days after period end
  responsibleRole    String
  requiredDocuments String[]
  templateFile       String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  filingCalendarItems FilingCalendarItem[]
}

model FilingCalendarItem {
  id                 String    @id @default(cuid())
  requirementId      String
  requirement        ComplianceRequirement @relation(fields: [requirementId], references: [id])
  periodYear         Int
  periodMonth        Int?
  dueDate            DateTime
  status             FilingStatus @default(PENDING)
  reminderDates      DateTime[]
  submissionDate     DateTime?
  submissionRef      String?
  attachments        String[]
  notes              String?
  createdBy          String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model ReportSubmission {
  id                 String    @id @default(cuid())
  reportCode         String
  reportName         String
  periodYear         Int
  periodMonth        Int?
  submittedAt        DateTime
  submittedBy       String
  submissionRef      String?
  attachmentPath     String?
  status             SubmissionStatus @default(SUBMITTED)
  acknowledgmentReceipt String?
  createdAt          DateTime  @default(now())
}

model AuditEvent {
  id                 String    @id @default(cuid())
  eventType          String    // e.g., "member.created", "loan.approved"
  aggregateId        String    // ID of the aggregate
  aggregateType      String    // e.g., "Member", "LoanAccount"
  actorId            String    // user ID
  actorRole          String
  branchId           String
  timestamp          DateTime  @default(now())
  beforeState        Json?     // JSON of entity before change
  afterState         Json?     // JSON of entity after change
  metadata           Json?     // additional context
  ipAddress          String?
  userAgent          String?
}

model ExceptionCase {
  id                 String    @id @default(cuid())
  type               ExceptionType
  description        String
  relatedEntityType  String
  relatedEntityId    String
  raisedBy           String
  raisedAt           DateTime  @default(now())
  assignedTo         String?
  status             ExceptionStatus @default(OPEN)
  resolution         String?
  resolvedAt         DateTime?
  resolvedBy         String?
}

enum CooperativeType {
  SAVINGS_AND_CREDIT
  MULTI_PURPOSE
}

enum MemberStatus {
  ACTIVE
  INACTIVE
  WITHDRAWN
  DECEASED
  DELINQUENT
  SUSPENDED
}

enum ApplicationStatus {
  DRAFT
  SUBMITTED
  FOR_REVIEW
  FOR_CI
  FOR_COMMITTEE
  APPROVED
  DECLINED
  CANCELLED
}

enum VerificationStatus {
  PENDING
  IN_PROGRESS
  VERIFIED
  REJECTED
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
}

enum DocumentType {
  ID
  PROOF_OF_ADDRESS
  PHOTO
  INCOME_PROOF
  COLLATERAL
  OTHER
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  CONTRIBUTION
  INTEREST
  DIVIDEND
  FEE
  LOAN_DISBURSEMENT
  LOAN_PAYMENT
  TRANSFER
  ADJUSTMENT
  REVERSAL
}

enum TransactionSource {
  CASH
  CHECK
  BANK_TRANSFER
  PAYROLL
  ONLINE
  MOBILE
  OTHER
}

enum TransactionStatus {
  PENDING
  POSTED
  REVERSED
  VOID
}

enum AccountStatus {
  PENDING
  ACTIVE
  DORMANT
  CLOSED
  FROZEN
}

enum CashSessionStatus {
  OPEN
  CLOSED
}

enum BatchStatus {
  DRAFT
  POSTED
  REVERSED
}

enum JournalEntryStatus {
  DRAFT
  POSTED
  REVERSED
}

enum FilingStatus {
  PENDING
  REMINDED
  SUBMITTED
  LATE
  WAIVED
}

enum SubmissionStatus {
  DRAFT
  SUBMITTED
  ACKNOWLEDGED
  REJECTED
}

enum ExceptionType {
  RECONCILIATION_MISMATCH
  DUPLICATE_PAYMENT
  INVALID_TRANSACTION
  SYSTEM_ERROR
  COMPLIANCE_BREACH
  ACCESS_VIOLATION
}

enum ExceptionStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}
```

---

## Implementation Notes for AI Agents

1. **Start with the data model**: Create the Prisma models above and generate migrations. Ensure foreign keys and indexes are properly defined for performance.

2. **Implement event publishing**: Create an `EventBus` service that allows publishing and subscribing to domain events. Start with synchronous in-process events, design for future extraction.

3. **Build workflow orchestration**: Use a state machine library (e.g., `xstate` or custom) to manage complex workflows like loan origination and period close. Each step should emit events.

4. **Enforce maker-checker**: For sensitive operations, require two distinct users: one creates (maker), another approves (checker). Store both in audit trail.

5. **Implement posting rules**: Create a configuration-driven engine that maps transaction types to journal entry templates. For example, a savings deposit always debits Cash and credits Savings Liability.

6. **Ensure immutability**: For posted financial records (transactions, journal entries), disallow UPDATE operations. Use DELETE only for unposted drafts. Corrections = reversal + new entry.

7. **Add field-level encryption**: For PII fields (TIN, IDs), use Prisma's `@db.VarChar` with encryption at rest, and decrypt only in authorized contexts.

8. **Build compliance evidence capture**: At the moment of each transaction, store all required compliance fields (TIN status, branch, officer, document reference). This avoids retroactive reconstruction.

9. **Create seed data**: Provide scripts to seed: chart of accounts, sample products, compliance requirements, roles and permissions, test users.

10. **Document APIs**: Generate OpenAPI spec from code annotations. Keep it updated as APIs evolve.

11. **Write tests**: For each user story, create unit and integration tests. Use the test framework already present (Jest, Cypress).

12. **Follow existing patterns**: The codebase has existing controllers, services, and routes. Follow the same structure for consistency.

---

## Next Deliverables

- Detailed module requirements specifications
- ERD draft with field dictionary
- Posting rules matrix by transaction type
- BPMN diagrams (already present in `docs/architecture/bpmn/`)
- CDA/BIR compliance matrix specific to this cooperative
- MVP backlog with story points
- Build vs. buy evaluation criteria

---

*This document is AI-ready: structured, machine-readable, and aligned with the architecture blueprint.*
