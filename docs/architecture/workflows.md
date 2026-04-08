# Key Workflows

## Workflow Diagrams
- Member onboarding: `docs/architecture/bpmn/member-onboarding.mmd`
- Share capital build-up: `docs/architecture/bpmn/share-capital-build-up.mmd`
- Savings deposit or withdrawal: `docs/architecture/bpmn/savings-deposit-withdrawal.mmd`
- Loan origination: `docs/architecture/bpmn/loan-origination.mmd`
- Loan collection: `docs/architecture/bpmn/loan-collection.mmd`
- Loan restructuring: `docs/architecture/bpmn/loan-restructuring.mmd`
- Period close: `docs/architecture/bpmn/period-close.mmd`
- All workflows overview: `docs/architecture/bpmn/all-workflows.mmd`

## Member Onboarding
1. Capture application
2. Capture identity, contact, beneficiary, employer, and tax data
3. Collect KYC documents
4. Screen for duplicates and sanctions or internal blacklist if configured
5. Route for membership approval
6. Create member master record
7. Open default share capital and optional savings accounts
8. Generate member number and document packet

## Share Capital Build-Up
1. Define capital build-up rule
2. Accept over-the-counter or payroll-linked contribution
3. Post member ledger transaction
4. Generate accounting entries
5. Update capital balance and certificate view

## Savings Deposit or Withdrawal
1. Select account and validate status
2. Validate teller session and cash limits
3. Accept transaction with source document reference
4. Apply holds, fees, or withdrawal restrictions
5. Post to account ledger
6. Generate receipt and accounting entries
7. Update cash drawer and branch cash position

## Cash Session (Open and Close)
1. Open cash session with beginning cash count
2. Validate teller assignment and branch cash limits
3. Record session opening balance and timestamp
4. Post cash session opening entry
5. Process teller transactions during session
6. Close session with end-of-day cash count
7. Post cash session closing entry and variances

## Teller Transaction (Deposit, Withdrawal, Collection, Disbursement)
1. Validate active cash session
2. Identify member and account or loan
3. Accept funds or disburse cash
4. Capture source document reference
5. Post transaction and update balances
6. Generate receipt and accounting entries
7. Update cash session totals

## Loan Origination
1. Create loan application
2. Validate product eligibility
3. Gather documents and co-maker data
4. Run credit investigation and scoring template
5. Route to committee or approving authority
6. Record decision and conditions
7. Generate promissory note and release documents
8. Release loan and create amortization schedule
9. Post accounting entries and disbursement record

## Loan Collection
1. Select loan account
2. Determine due amounts by component
3. Apply payment allocation waterfall
4. Produce official receipt
5. Update amortization status and delinquency bucket
6. Post accounting entries
7. Reconcile cash and collection channels

## Loan Restructuring
1. Raise restructuring request
2. Capture reason and evidence
3. Freeze old schedule version
4. Route approval
5. Generate new terms and revised schedule
6. Preserve linkage between original and restructured account history
7. Post adjustment entries

## Period Close
1. Lock open transaction windows
2. Complete accruals and batch jobs
3. Review suspense and exception queues
4. Validate subledger-to-GL reconciliation
5. Close accounting period
6. Generate statements and report packs
7. Archive compliance evidence snapshot
