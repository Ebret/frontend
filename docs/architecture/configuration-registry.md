# Configuration Registry

This document defines where configuration lives, how it is versioned, and how approvals are recorded.

## Registry Areas
- Product catalog: savings and loan product definitions, eligibility rules, fees, penalties.
- Accounting templates: transaction types to GL and SL mappings.
- Compliance calendar: filing dates, templates, required evidence.
- Access control: roles, permissions, segregation of duties.
- Workflow rules: approval matrices, routing thresholds.

## Versioning Rules
- Every configuration change produces a new immutable version record.
- Effective dates define when a version becomes active.
- Past transactions retain the version used at posting time.

## Approval Rules
- Product and accounting changes require maker-checker.
- Approvals capture approver, timestamp, rationale, and version id.
- Changes without approval remain in draft state.

## Audit Fields
- created_by, created_at, updated_by, updated_at
- approved_by, approved_at, approval_rationale
- version_id, effective_from, effective_to
