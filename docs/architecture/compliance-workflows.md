# Compliance Workflows (Maker-Checker + Audit)

## 1. CAPR Submission (CDA)
**Trigger**: Annual reporting window opens  
**Maker**: Compliance Officer  
**Checker**: Accountable Officer / Board Secretary  

**Steps**:
1. Generate CAPR dataset extract.
2. Validate required fields and totals.
3. Prepare submission package and signed copy.
4. Maker submits CAPR via CAPRIS.
5. Checker validates submission reference and signed copy.

**Audit Log Fields**:
- report_period
- dataset_version
- submitted_by, submitted_at
- approved_by, approved_at
- submission_reference
- signed_copy_reference

## 2. SSS PRN Remittance
**Trigger**: Payroll period close  
**Maker**: HR/Payroll  
**Checker**: Accounting Officer  

**Steps**:
1. Compute employee and employer contribution totals.
2. Generate PRN and remittance schedule.
3. Maker submits remittance.
4. Checker verifies payment and receipt.

**Audit Log Fields**:
- period
- prn
- amount
- submitted_by, submitted_at
- approved_by, approved_at
- payment_reference

## 3. PhilHealth ER2 / RF-1 Reporting
**Trigger**: New hire or separation event  
**Maker**: HR/Payroll  
**Checker**: Compliance Officer  

**Steps**:
1. Maker prepares ER2 (new hire) or RF-1 (separation).
2. Submit via EPRS within 30 days.
3. Checker validates submission confirmation.

**Audit Log Fields**:
- employee_id
- report_type (ER2/RF-1)
- submitted_by, submitted_at
- approved_by, approved_at
- submission_reference
