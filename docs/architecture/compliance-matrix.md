# Compliance Matrix Stub (CDA and BIR)

This is a drafting stub. Final compliance requirements must be validated with Philippine counsel and CPA.

## CDA Compliance Data and Evidence

| Area | Data Fields | Evidence / Output | Owner | Notes |
| --- | --- | --- | --- | --- |
| Cooperative registration | registration_no, legal_name, coop_type | Registration profile snapshot | Board Secretary | Required for CDA reporting |
| Governance records | board_resolutions, committee_decisions | Resolution pack and decision log | Board Secretary | Link to approvals |
| CAPR annual data | member_counts, financial_stats, loan_portfolio | CAPR dataset export | Compliance Officer | Template mapping required |
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

## Compliance Evidence Controls
- Capture evidence at transaction time.
- Store report extracts with version, parameters, generator, and timestamp.
- Preserve document linkages from onboarding through financial lifecycle.
- Preserve historical template mappings used for past postings to maintain auditability.
