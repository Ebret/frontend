# Posting Rules Matrix (Draft)

This matrix maps transaction types to accounting templates and GL/SL posting targets. Account codes are placeholders and should be mapped to the cooperative's CDA-aligned chart of accounts.

| Transaction Type | Template Code | Debit (GL) | Debit GL Code | Credit (GL) | Credit GL Code | Debit SL Ref | Credit SL Ref | Subledger Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Member share capital contribution | SC_CONTRIB | ShareCapital_Receivable | 3-2100 | Cash_On_Hand/Bank | 1-1000 | member_id | cash_session_id | ShareCapitalLedger + |
| Share capital withdrawal | SC_WITHDRAW | Cash_On_Hand/Bank | 1-1000 | ShareCapital_Receivable | 3-2100 | cash_session_id | member_id | ShareCapitalLedger - |
| Savings deposit | SAV_DEP | Cash_On_Hand/Bank | 1-1000 | Savings_Deposits | 2-1100 | cash_session_id | savings_account_id | SavingsLedger + |
| Savings withdrawal | SAV_WD | Savings_Deposits | 2-1100 | Cash_On_Hand/Bank | 1-1000 | savings_account_id | cash_session_id | SavingsLedger - |
| Loan disbursement | LN_DISB | Loans_Receivable_Principal | 1-2000 | Cash_On_Hand/Bank | 1-1000 | loan_account_id | cash_session_id | LoanPrincipalLedger + |
| Loan payment - principal | LN_PAY_PRIN | Cash_On_Hand/Bank | 1-1000 | Loans_Receivable_Principal | 1-2000 | cash_session_id | loan_account_id | LoanPrincipalLedger - |
| Loan payment - interest | LN_PAY_INT | Cash_On_Hand/Bank | 1-1000 | Interest_Income | 4-4000 | cash_session_id | loan_account_id | InterestReceivableLedger - |
| Loan payment - penalty | LN_PAY_PEN | Cash_On_Hand/Bank | 1-1000 | Penalty_Income | 4-4100 | cash_session_id | loan_account_id | PenaltyLedger - |
| Interest accrual (savings) | SAV_ACCR | Interest_Expense | 5-5000 | Interest_Payable | 2-1200 | savings_account_id | savings_account_id | SavingsInterestLedger + |
| Interest posting (savings) | SAV_INT_POST | Interest_Payable | 2-1200 | Savings_Deposits | 2-1100 | savings_account_id | savings_account_id | SavingsLedger + |
| Loan interest accrual | LN_ACCR | Interest_Receivable | 1-2100 | Interest_Income | 4-4000 | loan_account_id | loan_account_id | InterestReceivableLedger + |
| Loan restructuring adjustment | LN_RESTR | Loans_Receivable_Principal | 1-2000 | Loan_Restructuring_Adj | 5-5200 | loan_account_id | loan_account_id | LoanPrincipalLedger +/- |
| Write-off | LN_WOFF | Loan_Loss_Expense | 5-5300 | Loans_Receivable_Principal | 1-2000 | loan_account_id | loan_account_id | LoanPrincipalLedger - |
| Recovery after write-off | LN_RECOV | Cash_On_Hand/Bank | 1-1000 | Loan_Loss_Recovery | 4-4200 | cash_session_id | loan_account_id | RecoveryLedger + |
| Fee charge (savings) | SAV_FEE | Savings_Deposits | 2-1100 | Fee_Income | 4-4300 | savings_account_id | fee_rule_id | SavingsLedger - |
| Fee charge (loan) | LN_FEE | Cash_On_Hand/Bank | 1-1000 | Fee_Income | 4-4300 | cash_session_id | fee_rule_id | FeeLedger + |
| Open cash session | CS_OPEN | Cash_On_Hand/Branch | 1-1010 | Cash_Short_Over | 2-1300 | cash_session_id | cash_session_id | CashSessionLedger + |
| Close cash session | CS_CLOSE | Cash_Short_Over | 2-1300 | Cash_On_Hand/Branch | 1-1010 | cash_session_id | cash_session_id | CashSessionLedger - |
| Teller transaction settlement | TT_SETTLE | Cash_On_Hand/Branch | 1-1010 | Teller_Clearing | 2-1400 | cash_session_id | teller_transaction_id | TellerTransactionLedger + |

## Notes
- All postings must be balanced and processed via journal batches.
- Subledger impacts should reconcile to GL on period close.
- Use reversal entries for corrections; no edits to posted transactions.
- Validation checks (consistency):
  - All transaction types must map to a valid GL code and template.
  - Cash-related transactions must map to a 1-1xxx cash account.
  - Income postings must map to 4-4xxx series.
  - Expense postings must map to 5-5xxx series.
  - Liability postings (deposits, payables) must map to 2-1xxx series.
  - Share capital postings must map to 3-2xxx series.
- Preserve historical template mappings used for past postings to maintain auditability.
- Sample GL code series (illustrative only, map to CDA-aligned chart):
  - 1-1xxx: Cash and cash equivalents
  - 1-2xxx: Loans and receivables
  - 2-1xxx: Member deposits and liabilities
  - 2-13xx to 2-14xx: Cash short/over and clearing accounts
  - 3-2xxx: Share capital accounts
  - 4-4xxx: Income accounts (interest, penalties, fees, recoveries)
  - 5-5xxx: Expense accounts (interest expense, loan loss, adjustments)
