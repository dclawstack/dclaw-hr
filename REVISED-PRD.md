---
tags: [meta, prd, revised, swarm]
version: 2.3
date: 2026-05-16
app_id: hr
app_name: DClaw HR
category: HR
status: Future
---

# 📘 DClaw HR — Revised PRD v2.3

> **The single document every agent must read before writing code for this app.**
> Generated from DClaw Master PRD v2.2. Read the Master PRD first: https://raw.githubusercontent.com/dclawstack/dclaw-prd/main/DClaw-Master-PRD.md

---

## 1. Product Identity

| Field | Value |
|-------|-------|
| **App ID** | `hr` |
| **Name** | DClaw HR |
| **Category** | HR |
| **Tagline** | Resume screening, interviews |
| **Color** | #EC4899 |
| **Phase** | Future |
| **Port (Frontend Dev)** | 3020 (TBD — assign before build) |
| **Port (Backend Dev)** | 18090 (TBD — assign before build) |
| **Maturity Tier** | 🟢 Tier 1 — Mature |

---

## 2. Current State Assessment

### 2.1 Scaffold Status
| Component | Status | Notes |
|-----------|--------|-------|
| `frontend/` | ✅ | Next.js 14+ app |
| `backend/` | ✅ | FastAPI + SQLAlchemy 2.0 |
| `docs/` | ✅ | getting-started, guides, reference, releases |
| `helm/` | ✅ | K8s deployment manifests |
| `.github/workflows/` | ✅ | CI/CD + Claude integration |
| `AGENTS.md` | ✅ | Per-repo agent instructions |
| `PLAN-v1.2.md` | ✅ | Feature roadmap |
| `docker-compose.yml` | ✅ | Local dev stack |
| `tests/` | ✅ | pytest + pytest-asyncio |
| `alembic/` | ✅ | Database migrations |
| `dclaw-manifest.json` | ❌ | DPanel registration |

### 2.2 Code Maturity
| Metric | Value |
|--------|-------|
| Python source files (backend) | ~53 |
| TypeScript/TSX files (frontend) | ~31 |
| Total source files | ~84 |
| Tests | ✅ Present |
| Alembic migrations | ✅ Present |
| DPanel manifest | ❌ Missing |

### 2.3 Feature Maturity
- **P0 Foundation:** Partially implemented
- **P1 Platform:** Not yet started
- **P2 Vertical:** Not yet started

---

## 3. Gap Analysis

| # | Gap | Severity | Fix |
|---|-----|----------|-----|
| 1 | Missing `dclaw-manifest.json` | 🔴 | Create frontend/public/dclaw-manifest.json for DPanel |

---

## 4. Sacred Architecture & Tech Stack

> **NON-NEGOTIABLE. Every DClaw product MUST use this exact stack.**

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js 14+ | App Router, Tailwind CSS, shadcn/ui |
| **Backend** | FastAPI | Pydantic v2, SQLAlchemy 2.0, asyncpg |
| **Database** | PostgreSQL 16 | CloudNativePG operator in K8s |
| **Vector DB** | Qdrant / pgvector | Only if RAG / semantic search |
| **Cache / Bus** | Redis | 7.x |
| **Object Storage** | MinIO | Latest |
| **Workflow** | Temporal.io | Only if automation/orchestration |
| **Auth** | Logto | JWT validation on all protected routes |
| **Billing** | Stripe | Metered or per-seat |
| **K8s Operator** | Go + controller-runtime | 0.18 |
| **LLM Local** | Ollama | Apple Silicon |
| **LLM Cloud** | OpenRouter + Kimi K2.5 | Fallback |
| **Monitoring** | Prometheus + Grafana | Latest |

### 4.1 Python Rules
- `ruff` formatting enforced
- Type hints on ALL public APIs
- `pydantic` v2 for schemas
- `sqlalchemy` 2.0 style (`Mapped`, `mapped_column`)
- `pytest` + `pytest-asyncio` for tests
- Functions < 50 lines
- No `print()` — use `structlog`

### 4.2 TypeScript / Next.js Rules
- Strict TypeScript (`strict: true`)
- Tailwind for ALL styling
- `cn()` utility for conditional classes
- No `any` without `// @ts-ignore`

### 4.3 Docker Standards
- Port mappings MUST match container listen port
- Healthchecks MUST use binaries present in base image
- `docker compose config` must pass before shipping
- Service type MUST be `ClusterIP`
- TLS required on all ingress

---

## 5. P0 Foundation Features (Must Have — Demo Ready)

> **Every P0 MUST include an AI Copilot per YC S25/W26 RFS.**

| # | Feature | Description | AI Component | Acceptance Criteria |
|---|---------|-------------|--------------|---------------------|
| P0.1 | **AI HR Copilot** | Answer employee questions, draft policies, and suggest actions. | RAG over HR docs + LLM response generation | Answer 80% of questions without human; draft policy in <2min |
| P0.2 | **Employee Directory** | Org chart, profiles, and skills database with AI enrichment. | AI skill-extraction from profiles + project history | Auto-extract 20 skills per employee; generate org chart |
| P0.3 | **Time & Attendance** | Track time off, attendance, and overtime with AI anomaly detection. | AI anomaly detection + compliance checking | Track PTO, sick leave, overtime; flag patterns; ensure compliance |
| P0.4 | **Performance Reviews** | 360-degree feedback with AI-generated summaries and goals. | LLM feedback-synthesis + goal-generation | Synthesize 10 reviews into 1-page summary; suggest 3 goals |

---

## 6. P1 Platform Features (Should Have — v1.1–1.2)

| # | Feature | Description | AI Component | Acceptance Criteria |
|---|---------|-------------|--------------|---------------------|
| P1.1 | **Payroll Integration** | Sync with payroll providers for accurate compensation. | AI payroll-reconciliation + discrepancy detection | Sync to 5 providers; auto-reconcile; flag discrepancies |
| P1.2 | **Benefits Administration** | Manage benefits enrollment, changes, and compliance. | AI benefits-recommendation + cost-optimization | Open enrollment; life-event changes; ACA compliance |
| P1.3 | **Employee Engagement** | Pulse surveys, sentiment analysis, and action planning. | AI sentiment-trend analysis + intervention suggestion | Weekly pulse; track 5 engagement drivers; suggest actions |
| P1.4 | **Compliance Tracking** | Track labor law compliance across jurisdictions. | AI regulation-monitoring + compliance-gap detection | Monitor 50+ regulations; auto-update policies; audit trail |

---

## 7. P2 Vertical / Scale Features (Could Have — v1.3+)

| # | Feature | Description | AI Component | Acceptance Criteria |
|---|---------|-------------|--------------|---------------------|
| P2.1 | **Career Pathing** | AI-generated career paths based on skills and interests. | AI path-recommendation + skill-gap analysis | Suggest 3 paths per employee; identify skill gaps; recommend courses |
| P2.2 | **Diversity Analytics** | Track and improve DEI metrics across hiring and promotion. | AI bias-detection + representation-analysis | Track 10 DEI metrics; flag bias in processes; suggest improvements |
| P2.3 | **Workforce Planning** | Model headcount, skills, and budget scenarios. | AI workforce-modeling + scenario optimization | Plan 3 years ahead; model 5 scenarios; optimize cost |
| P2.4 | **Employee Offboarding** | Streamlined offboarding with checklist and access revocation. | AI offboarding-risk detection + knowledge-transfer suggestion | Auto-revoke access; schedule exit interview; capture knowledge |

---

## 8. Scaffold Checklist

Before marking this app "shipped", confirm:

- [ ] `frontend/` with Next.js 14+, Tailwind, shadcn/ui
- [ ] `backend/` with FastAPI, Pydantic v2, SQLAlchemy 2.0, asyncpg
- [ ] `docs/` with getting-started, guides, reference, releases, troubleshooting
- [ ] `helm/` with Chart.yaml, values.yaml, templates (deployment, service, ingress, cloudnativepg)
- [ ] `.github/workflows/` with build-backend.yml, build-frontend.yml, deploy.yml, claude.yml
- [ ] `frontend/public/dclaw-manifest.json` for DPanel registration
- [ ] `backend/tests/` with pytest + pytest-asyncio
- [ ] `backend/alembic/` with initial migration
- [ ] `Dockerfile` + `docker-compose.yml` with correct healthchecks
- [ ] Health endpoint at `/health` returning `{"status":"ok"}`
- [ ] `AGENTS.md` with per-repo instructions
- [ ] `PLAN-v1.2.md` with feature roadmap
- [ ] Port assigned from registry and documented
- [ ] No hardcoded secrets — use `.env.example` + K8s Secrets
- [ ] Non-root containers in Dockerfile

---

## 9. AI Copilot Mandate (YC S25/W26 Requirement)

Every DClaw app MUST have an AI Copilot as its first P0 feature. The copilot must:
1. Be contextually aware of the app's domain data
2. Use RAG over the app's knowledge base where applicable
3. Suggest next actions, not just answer questions
4. Be accessible from every page via floating chat or sidebar
5. Fall back to local Ollama when cloud is unavailable

---

## 10. Next Tasks for Vibe Coders

1. **Audit current state**: Verify all P0 features are complete and documented.
2. **Implement P1 features**: Build the 4 P1 features to reach v1.1 platform readiness.
3. **Add advanced features**: Begin P2 features for competitive differentiation.
4. **Optimize and scale**: Improve test coverage, add performance monitoring, and refine UX.

---

## 11. Domain Research Notes

Inspired by BambooHR, Gusto, Rippling, Workday. HR AI reduces admin time and improves employee experience.

---

## 12. Links & Resources

| Resource | URL |
|----------|-----|
| **Master PRD** | https://raw.githubusercontent.com/dclawstack/dclaw-prd/main/DClaw-Master-PRD.md |
| **GitHub Org** | https://github.com/dclawstack |
| **DPanel** | https://dpanel.dclawstack.io |
| **Port Registry** | See `dclaw-platform/PORT_REGISTRY.md` |
| **App PRD Template** | Obsidian Vault → `00-META/📐 App PRD Template.md` |
| **Scaffold Source** | `dclaw-scaffold/` in DClaw-Stack |

---

*Revised PRD version: 2.3*
*Generated: 2026-05-16 by DClaw Stack Generator*
*Next review: When P0 features are complete or architecture changes*
