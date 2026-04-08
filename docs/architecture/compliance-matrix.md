# Compliance Matrix Stub (CDA and BIR)

This is a drafting stub. Final compliance requirements must be validated with Philippine counsel and CPA.

## CDA Compliance Data and Evidence

| Area | Data Fields | Evidence / Output | Owner | Notes |
| --- | --- | --- | --- | --- |
| Cooperative registration | registration_no, legal_name, coop_type | Registration profile snapshot | Board Secretary | Required for CDA reporting |
| Governance records | board_resolutions, committee_decisions | Resolution pack and decision log | Board Secretary | Link to approvals |
| CAPR annual data | member_counts, financial_stats, loan_portfolio | CAPR dataset export | Compliance Officer | CAPR via CAPRIS; all fields required |
| CDA report forms | report_period, branch, totals | Structured report output | Compliance Officer | Must match CDA templates |
| Chart of accounts | coa_code, coa_version | COA mapping export | Accounting Officer | Versioned mappings |
| GL mapping approval evidence | approval_id, approver_id, approved_at, mapping_version, rationale, affected_templates | Mapping approval record | Accounting Officer | Required before product activation |
| Accountable officer | approver_id, certification_date | Digital sign-off | Compliance Officer | Immutable audit log |

## BIR Tax-Exemption Support

| Area | Data Fields | Evidence / Output | Owner | Notes |
| --- | --- | --- | --- | --- |
| Member TIN tracking | member.tin, tin_status | TIN completeness report | Membership Officer | Follow-up queue |
| Tax exemption evidence | exemptions, certifications | CTE evidence pack | Compliance Officer | Store document linkage |
| Withholding or tax flags | tax_status_profile | Tax status report | Accounting Officer | Policy-driven |

## SSS Employer Compliance

| Area | Data Fields | Evidence / Output | Owner | Notes |
| --- | --- | --- | --- | --- |
| Employer registration | sss_employer_id, registration_date | Employer registration reference | HR/Payroll | Employer must register and secure ER ID |
| Employee reporting | employee_sss_no, hire_date, reported_at | Employee coverage report | HR/Payroll | Report employees within 30 days of hiring |
| Contribution remittance | prn, remittance_date, period | PRN remittance receipt | Accounting | Remit within prescribed schedule |
| Records retention | payroll_records, contributions_log | Audit trail | HR/Payroll | Maintain true and accurate records |

## Pag-IBIG Employer Compliance

| Area | Data Fields | Evidence / Output | Owner | Notes |
| --- | --- | --- | --- | --- |
| Employer registration | pagibig_employer_id, hqp_pff_002_ref | Employer registration reference | HR/Payroll | HQP-PFF-002 required |
| Employee data | pagibig_mid, hire_date | Member reporting log | HR/Payroll | Track member IDs |
| Remittance | remittance_ref, period | Remittance receipt | Accounting | Remit within prescribed schedule |

## PhilHealth Employer Compliance

| Area | Data Fields | Evidence / Output | Owner | Notes |
| --- | --- | --- | --- | --- |
| Employer registration | philhealth_pen, eprs_account | Employer registration reference | HR/Payroll | EPRS required for reporting |
| Employee reporting | er2_ref, rf1_ref, dates | Reporting logs | HR/Payroll | ER2 for new hires, RF-1 for separated employees within 30 days |
| Remittance | eprs_report_id, payment_ref | Remittance report and payment proof | Accounting | PEN-based due dates |

## Compliance Evidence Controls
- Capture evidence at transaction time.
- Store report extracts with version, parameters, generator, and timestamp.
- Preserve document linkages from onboarding through financial lifecycle.
- Preserve historical template mappings used for past postings to maintain auditability.
