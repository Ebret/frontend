# AI-Ready Architecture Package

This folder contains a reusable architecture and implementation blueprint for a Philippine savings and loan cooperative. It is intended for board and management, compliance and internal audit, product owners and business analysts, architects and developers, implementation partners, and AI coding agents.

## Contents
- `docs/architecture/AI-READY-ARCH.md`: Full architecture document with scope, design principles, modules, workflows, and compliance mapping.
- `docs/architecture/requirements.md`: Scope, assumptions, MVP requirements, and non-functional requirements.
- `docs/architecture/domain-model.md`: Domain aggregates, relationships, and canonical data model.
- `docs/architecture/workflows.md`: Key operational and financial workflows.
- `docs/architecture/executive-summary.md`: Executive summary and implementation checklist.
- `docs/architecture/diagrams.md`: Mermaid diagrams for quick visualization.
- `docs/architecture/quickstart.md`: Implementer quickstart for setup, sequencing, and entry points.
- `docs/architecture/bpmn/`: Mermaid workflow diagrams for BPMN-style views.
- `docs/architecture/artifacts.yaml`: Structured YAML artifacts for tooling.
- `docs/architecture/artifacts.json`: Structured JSON artifacts for tooling.
- `docs/architecture/ai-ready-artifacts.md`: AI workflows, machine-readable artifacts, and implementation notes.
- `docs/architecture/product-catalog-spec.md`: Savings and loan product parameters, defaults, and validations.
- `docs/architecture/posting-rules-matrix.md`: Draft mapping of transaction types to accounting templates.
- `docs/architecture/compliance-matrix.md`: CDA and BIR compliance data and evidence stub.
- `docs/architecture/erd-and-fields.md`: ERD and core field dictionary.
- `docs/architecture/mvp-backlog.md`: MVP epics, stories, and acceptance criteria.
- `docs/architecture/api-boundaries-events.md`: API boundary map, events, and idempotency rules.
- `docs/architecture/glossary.md`: Abbreviations and key terms.
- `docs/architecture/data-ownership.md`: Data ownership table per domain.

## Intended Use
- Use the full document for alignment with stakeholders.
- Use `requirements.md`, `domain-model.md`, and `workflows.md` for implementation breakdown.
- Use `artifacts.yaml` or `artifacts.json` for AI tools and downstream automation.
- Use `diagrams.md` for quick visual reviews and workshops.

## Notes
- This is configuration-first and designed for single-branch or multi-branch cooperatives.
- Final legal, tax, and regulatory interpretations must be validated with Philippine counsel and CPA before production rollout.
