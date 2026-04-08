# HR/Payroll Compliance (SSS, Pag-IBIG, PhilHealth, BIR)

This document defines system requirements for employee compliance. Verify schedules with official portals.

## SSS
**Requirements**
- Register employer and secure Employer ID.
- Report employees for coverage within 30 days of hiring.
- Remit contributions using PRN within prescribed schedule.

**System Fields**
- sss_employer_id, registration_date
- employee_sss_no, hire_date, reported_at
- prn, remittance_date, period

## Pag-IBIG
**Requirements**
- Employer registration using HQP-PFF-002 and supporting documents.

**System Fields**
- pagibig_employer_id, hqp_pff_002_ref
- member_mid, hire_date
- remittance_ref, period

## PhilHealth
**Requirements**
- Submit ER2 for new hires and RF-1 for separated employees within 30 days.
- Remit and report contributions via EPRS, with PEN-based due dates.

**System Fields**
- philhealth_pen, eprs_account
- er2_ref, rf1_ref, dates
- eprs_report_id, payment_ref, period

## BIR (Employer Withholding)
**Requirements**
- Maintain employee compensation and withholding records.
- File and remit withholding per current BIR guidance and RDO rules.

**System Fields**
- employee_compensation, withholding_tax, period
- filing_ref, remittance_ref

## Audit and Evidence
- Employer registration references
- Employee reporting logs
- Remittance receipts and confirmation
- Payroll register and contribution summaries
