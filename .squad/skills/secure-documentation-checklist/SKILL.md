---
name: "secure-documentation-checklist"
description: "Reusable checklist for secure-by-default documentation across design, build, and release handoffs"
domain: "documentation-security"
confidence: "medium"
source: "manual"
---

## Context
Use this checklist when producing or updating developer docs, API docs, integration guides, runbooks, and release notes for any security-impacting deliverable. It helps Freya and Vespera align early, document risks clearly, and verify security guidance before merge.

## Patterns

### 1) Pre-Build: Secure Architecture Documentation Gate
- Scope and assets are explicit: protected data, actors, entry points, and critical dependencies.
- Trust boundaries are mapped in plain language (client/API, service/service, workload/platform, third-party).
- Threat model assumptions are documented and testable:
  - identity and token issuer assumptions
  - network/isolation assumptions
  - dependency and supply-chain assumptions
- Abuse cases are listed with planned preventive controls (not only detective controls).
- Authn/Authz design is documented before coding:
  - authentication mechanism and credential/token lifecycle
  - authorization model by resource/action/tenant
  - least-privilege defaults for users, services, and runtime identities

### 2) Build-Time: Secure Implementation Documentation Checks
- Authn/Authz behavior matches implementation:
  - endpoint/action authorization requirements are documented
  - unauthorized vs forbidden behavior is defined
  - privilege escalation paths are considered and denied by default
- Secrets management is actionable:
  - source of secrets, rotation owner, and revocation steps are documented
  - examples use placeholders only; no real secrets, tokens, or identifiers
  - approved secret stores and local-dev safe alternatives are specified
- Logging and PII handling are safe:
  - required security events are listed
  - secrets and unnecessary PII are excluded or masked
  - correlation/audit guidance supports incident investigation without over-collection
- Dependency and supply-chain awareness is present:
  - critical libraries/images are identified with ownership
  - update/vulnerability response expectations are documented
  - provenance/signing/SBOM expectations are referenced when applicable

### 3) Post-Build: Security Review and Remediation Documentation Gate
- Pre-merge review confirms architecture, trust boundaries, and assumptions still match delivered behavior.
- Security-impacting changes in release notes include operator actions and rollback considerations.
- Residual risks and accepted risk decisions are documented with owner and review date.
- Remediation tracking is explicit:
  - open findings have severity, owner, and due date
  - temporary mitigations include expiry/exit criteria
  - links between PRs, threat notes, runbooks, and tickets are valid

### 4) Freya + Vespera Practical Collaboration
- Planning handoff:
  - Freya drafts the doc skeleton with boundaries/assumptions.
  - Vespera adds threat and abuse-case coverage criteria.
- Implementation handoff:
  - Freya updates authn/authz, secrets, logging/PII, and dependency sections as code changes.
  - Vespera verifies security claims against implementation and least-privilege intent.
- Merge/release handoff:
  - Freya prepares release/runbook/security-change notes.
  - Vespera signs off on residual-risk language and remediation clarity.

## Examples

### Quick Review Prompt
"Validate these docs with the secure-documentation-checklist: threat assumptions, trust boundaries, authn/authz + least privilege, secrets handling, safe logging/PII, dependency/supply-chain notes, and post-build remediation tracking."

### Minimal Section Set for a Security-Impacting Feature
- Security context and trust boundaries
- Assumptions and abuse-case notes
- Authn/Authz behavior and least-privilege model
- Secrets and configuration handling
- Logging/audit, PII handling, and error behavior
- Dependency and supply-chain notes
- Pre-merge checks, post-build review, and remediation actions

## Anti-Patterns
- Treating security docs as a post-merge cleanup task.
- Documenting controls without mapping them to trust boundaries and threat assumptions.
- Including real credentials, tokens, or production identifiers in examples.
- Logging guidance that permits secrets/PII leakage.
- Runbooks that describe failures but omit safe operator actions and remediation ownership.