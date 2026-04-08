# Event Catalog Versioning

## Policy
- Event names include a version suffix, for example `loan.disbursed.v1`.
- Version increments only for breaking changes.
- Additive fields are allowed within the same version.

## Compatibility Rules
- Producers must keep backward compatibility for at least one version.
- Consumers must ignore unknown fields.
- Deprecated versions have a defined sunset date.

## Example
```json
{
  "id": "uuid",
  "type": "loan.disbursed.v1",
  "occurred_at": "2025-01-15T10:00:00Z",
  "actor_id": "user_123",
  "branch_id": "br_01",
  "source": {
    "module": "loans",
    "reference": "loan_abc"
  },
  "data": {
    "member_id": "mem_01",
    "loan_account_id": "loan_abc",
    "principal_granted": 50000,
    "disbursement_date": "2025-01-15"
  }
}
```
