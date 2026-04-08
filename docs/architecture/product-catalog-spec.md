# Product Catalog Spec

This document defines standard product parameters, suggested defaults, and validation constraints for savings and loan products. All values are configurable per cooperative.

## Savings Product Parameters

| Parameter | Description | Default (Suggested) | Validation / Constraints |
| --- | --- | --- | --- |
| product_code | Unique product identifier | SAV-STD | Required, unique, uppercase, 3-10 chars |
| product_name | Marketing name | Regular Savings | Required, 3-100 chars |
| currency | ISO currency code | PHP | Required, 3 chars |
| minimum_opening_amount | Minimum to open account | 100.00 | >= 0 |
| maintaining_balance | Minimum balance to avoid fees | 500.00 | >= 0 |
| withdrawal_rules | Limits and frequency | 3/month | Integer per period or rule reference |
| dormancy_days | Days of inactivity to mark dormant | 365 | >= 0 |
| interest_accrual_basis | Daily or monthly | daily | enum: daily, monthly |
| interest_rate_rule_id | Interest rule reference | IR-STD | Required, points to rules table |
| fees_rule_id | Fees rule reference | FEES-STD | Required, points to rules table |
| posting_frequency | Interest posting frequency | monthly | enum: monthly, quarterly, annually |
| passbook_format | Passbook or statement | statement | enum: passbook, statement |
| eligibility_rules | Member eligibility rules | default | Rule expression or rule set id |
| hold_policy | Holds for uncleared funds | 1 day | >= 0 days |
| closeout_policy | Closure rules | fee_on_close | enum: no_fee, fee_on_close, fixed_fee |
| is_active | Available for new accounts | true | boolean |

### Savings Validation Notes
- Opening deposit must be >= minimum_opening_amount.
- Available balance = current_balance - holds - required maintaining_balance.
- Dormant accounts restrict withdrawals unless reactivated.

## Loan Product Parameters

| Parameter | Description | Default (Suggested) | Validation / Constraints |
| --- | --- | --- | --- |
| product_code | Unique product identifier | LN-STD | Required, unique, uppercase, 3-10 chars |
| product_name | Marketing name | Standard Loan | Required, 3-100 chars |
| currency | ISO currency code | PHP | Required, 3 chars |
| min_membership_tenure_months | Tenure to qualify | 6 | >= 0 |
| principal_min | Minimum loan amount | 1000.00 | >= 0 |
| principal_max | Maximum loan amount | 100000.00 | >= principal_min |
| loan_amount_formula | Formula or rule reference | exposure_based | Rule expression or rule set id |
| term_min_months | Minimum term | 3 | >= 1 |
| term_max_months | Maximum term | 36 | >= term_min_months |
| repayment_frequency | Repayment schedule | monthly | enum: weekly, semi_monthly, monthly |
| interest_method | Interest computation | diminishing | enum: diminishing, straight_line, add_on |
| interest_rate_rule_id | Interest rule reference | IR-LN-STD | Required, points to rules table |
| service_fee_rule_id | Service fee rule | FEES-LN | Required, points to rules table |
| penalty_rule_id | Penalty rule | PEN-STD | Required, points to rules table |
| grace_period_days | Grace period for penalties | 5 | >= 0 |
| collateral_policy | Collateral or co-maker rule | comaker_required | Rule expression or policy id |
| required_documents | Document checklist | standard_loan_docs | Required, checklist id |
| approval_matrix | Approver route | matrix_default | Required, matrix id |
| insurance_flag | Insurance required | false | boolean |
| allow_restructuring | Restructuring allowed | true | boolean |
| is_active | Available for new loans | true | boolean |

### Loan Validation Notes
- Eligibility requires member status active and KYC complete.
- Loan amount must fit tenure, exposure, and policy rules.
- Amortization must balance total principal and interest.
- Disbursement is blocked until required documents are complete.

## Rules and Defaults

Suggested rule defaults are placeholders and must be confirmed by cooperative policy. All rule references point to a rules table or configuration layer:
- Interest rules: base rate, tiering, and accrual method.
- Fee rules: fixed fee, percentage, and minimum or maximum.
- Penalty rules: flat, percentage of overdue, or escalating.
- Eligibility rules: tenure, share capital balance, delinquency history.

## GL Code Guidance for Product Setup
Sample GL code series (illustrative only, map to CDA-aligned chart):
- 1-1xxx: Cash and cash equivalents
- 1-2xxx: Loans and receivables
- 2-1xxx: Member deposits and liabilities
- 2-13xx to 2-14xx: Cash short/over and clearing accounts
- 3-2xxx: Share capital accounts
- 4-4xxx: Income accounts (interest, penalties, fees, recoveries)
- 5-5xxx: Expense accounts (interest expense, loan loss, adjustments)

## GL Mapping Consistency Checks
- All product transaction types must map to a valid GL code and template.
- Cash-related transactions must map to a 1-1xxx cash account.
- Income postings must map to 4-4xxx series.
- Expense postings must map to 5-5xxx series.
- Liability postings (deposits, payables) must map to 2-1xxx series.
- Share capital postings must map to 3-2xxx series.

## Activation Checklist
- Mapping approval must be recorded before product activation.
