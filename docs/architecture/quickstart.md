# Implementer Quickstart

This guide helps teams move from architecture to execution with minimal friction.

## 1. Confirm Scope and Control Requirements
- Validate cooperative profile, branch setup, and CDA registration details.
- Confirm product catalog, policies, approval matrices, and governance roles.
- Identify compliance obligations and required reporting artifacts.

## 2. Establish Core Architecture Baselines
- Commit to modular monolith boundaries and a ledger-centric posting model.
- Define maker-checker rules and segregation of duties across roles.
- Agree on audit event logging and immutable posting rules.

## 3. Configure Products and Posting Rules
- Configure savings and loan product parameters in a rules layer.
- Define posting templates and chart-of-accounts mappings.
- Define reconciliation checks and period close controls.

## 4. Sequence Delivery by Capability
- Phase 1: Member, KYC, documents, COA, audit logging.
- Phase 2: Share capital, savings, cashiering, receipts.
- Phase 3: Loan origination, approval, release, and collections.
- Phase 4: Accounting close and compliance reporting.

## 5. Data Migration Prep
- Inventory legacy sources and define migration waves.
- Define tie-out and reconciliation for each product.
- Plan cutover window and run dual-reporting where needed.

## 6. Tooling and Artifacts
- Use `docs/architecture/artifacts.yaml` or `docs/architecture/artifacts.json` for automation and AI tooling.
- Use `docs/architecture/diagrams.md` for workshop visuals.
- Use `docs/architecture/workflows.md` to build BPMN or swimlane diagrams.
