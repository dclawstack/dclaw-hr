# DClaw HR — v1.2 Feature Roadmap

> **For coding agents:** Pick features from this list, implement them fully, and update this doc with a checkmark.
> **Do NOT change the basic stack.** See `AGENTS.md` for architecture lock.

---

## Design System — Strictly Enforce in All Frontend Work

All UI must use the CSS tokens from `frontend/src/app/globals.css` via Tailwind. No hardcoded hex/rgb values.

| Token | Tailwind Class | Use |
|-------|---------------|-----|
| `--background` | `bg-background` | Page / card surface |
| `--foreground` | `text-foreground` | Body text |
| `--primary` | `bg-primary text-primary-foreground` | CTA buttons, active nav |
| `--secondary` | `bg-secondary text-secondary-foreground` | Secondary actions |
| `--muted` | `bg-muted text-muted-foreground` | Disabled states, subtitles |
| `--accent` | `bg-accent text-accent-foreground` | Hover highlights |
| `--destructive` | `bg-destructive text-destructive-foreground` | Delete / terminate |
| `--border` | `border-border` | Dividers, card borders |
| `--radius 0.5rem` | `rounded-lg / rounded-md / rounded-sm` | Border radius |

Typography scale: `text-xs / text-sm / text-base / text-lg / text-xl / text-2xl` + `font-medium / font-semibold / font-bold`.
Badges: use existing shadcn variants only — `default`, `secondary`, `destructive`, `outline`.

---

## Pre-Flight Checklist — Do This First

- [ ] `frontend/package-lock.json` is committed after any `npm install`
- [ ] `frontend/next-env.d.ts` exists and is committed
- [ ] `frontend/.gitignore` excludes `node_modules/` and `.next/`
- [ ] `docker-compose.yml` healthchecks use `python urllib.request.urlopen()` (backend) and `wget -q --spider` (frontend)
- [ ] `frontend/Dockerfile` declares `ARG NEXT_PUBLIC_API_URL` before `RUN npm run build`
- [x] `backend/app/api/main.py` CORS `allow_origins` includes `http://localhost:3008`

---

## v1.0 Inventory (Current State)

- [x] Employee CRUD — backend repo + routes + Pydantic v2 schemas
- [x] TimeOffRequest CRUD — backend repo + routes + Pydantic v2 schemas
- [x] PayrollRecord CRUD — backend repo + routes + Pydantic v2 schemas
- [x] Dashboard endpoint — `GET /api/v1/dashboard` (totals, dept breakdown, recent hires)
- [x] Alembic migration — employees / time_off_requests / payroll_records
- [x] Frontend pages — `/` (dashboard), `/employees`, `/employees/[id]`, `/time-off`, `/time-off/new`, `/payroll`
- [x] shadcn/ui components — Button, Card, Badge, Input, Label, Select, Table, Tabs, Dialog, Avatar
- [x] Backend tests — `test_employees.py`, `test_time_off.py`, `test_payroll.py`, `test_dashboard.py`
- [x] `/employees/new` page — implemented in P0-1
- [x] Time-off approve/reject UI — implemented in P0-2
- [x] Employee edit page — implemented in P0-3
- [x] `net_pay` auto-calculation — implemented in P0-4
- [x] HR recruitment module — replaced with real DB-backed CRUD in P1-1
- [x] CORS port 3008 — fixed in P0-5

---

## v1.2 Roadmap

### P0 — Must Have ✅ Complete

#### P0-1. Add Employee Page `/employees/new` ✅
**Description:** HR managers cannot create employees from the UI. Backend endpoint and `createEmployee()` in `api.ts` already exist.
- **Frontend:** `frontend/src/app/employees/new/page.tsx` — form with all `EmployeeCreate` fields. Manager dropdown from `listEmployees()`. On submit → redirect `/employees`.
- Add "Add Employee" Button (`bg-primary text-primary-foreground rounded-md`) to `employees/page.tsx` header.
- **Files:** `frontend/src/app/employees/new/page.tsx` (new), `frontend/src/app/employees/page.tsx`

#### P0-2. Time-Off Approve / Reject UI ✅

**Description:** Pending requests table has no action buttons. `PATCH /api/v1/time-off/{id}` and `updateTimeOff()` in `api.ts` already exist.
- **Frontend:** Add "Approve" (default) and "Reject" (destructive) Buttons to each pending row. Use `useState<string>` for `pendingActionId` loading state. Re-fetch on action.
- **Files:** `frontend/src/app/time-off/page.tsx`

#### P0-3. Employee Edit Page `/employees/[id]/edit` ✅
**Description:** Employees can be viewed but not edited from the UI. `PATCH /api/v1/employees/{id}` and `updateEmployee()` already exist.
- **Frontend:** `frontend/src/app/employees/[id]/edit/page.tsx` — pre-populate from `getEmployee(id)`. Exclude self from manager dropdown. On submit → redirect `/employees/[id]`.
- Add "Edit" Button (secondary) to `employees/[id]/page.tsx` header.
- **Files:** `frontend/src/app/employees/[id]/edit/page.tsx` (new), `frontend/src/app/employees/[id]/page.tsx`

#### P0-4. Payroll `net_pay` Auto-Calculation ✅
**Description:** `net_pay` is manually entered — prone to error. Formula: `net_pay = base_salary + bonus - deductions`.
- **Backend:** Compute `net_pay` in create/update routes. Make `net_pay` optional (`float | None = None`) in `PayrollCreate` schema.
- **Frontend:** Remove net_pay Input. Add live read-only preview (`text-muted-foreground text-sm`) showing "Calculated Net Pay: $X,XXX".
- **Files:** `backend/app/api/v1/payroll.py`, `backend/app/schemas/payroll.py`, `frontend/src/app/payroll/page.tsx`, `frontend/src/lib/api.ts`

#### P0-5. Fix CORS + Register `hr.py` Router ✅
**Description:** CORS `allow_origins` lists wrong ports. `hr.py` is a stub never registered in `main.py`.
- **Backend:** Add `http://localhost:3008` to `allow_origins`. Import and register `hr.router` under `/api/v1`.
- **Files:** `backend/app/api/main.py`

---

### P1 — Should Have ✅ Complete

#### P1-1. Real Candidate / Recruitment Module ✅
**Description:** Replace `hr.py` random stub with a real DB-backed candidate pipeline.
- **Backend:** `Candidate` model (id UUID, name, role, email, status Enum: screening/interviewed/offered/rejected, notes Text, created_at, updated_at). Repo + schemas + CRUD routes `/api/v1/candidates`. Alembic migration. Tests in `test_candidates.py`.
- **Frontend:** `/recruitment` page — list with status filter + create form. Add "Recruitment" nav link to `sidebar.tsx`. Remove/replace orphaned `frontend/src/app/dashboard/page.tsx` stub.
- **Files:** `backend/app/models/candidate.py` (new), `backend/app/schemas/candidate.py` (new), `backend/app/repositories/candidate_repo.py` (new), `backend/app/api/v1/hr.py` (rewrite), `backend/app/models/__init__.py`, `backend/tests/test_candidates.py` (new), `frontend/src/app/recruitment/page.tsx` (new), `frontend/src/components/sidebar.tsx`, `frontend/src/lib/api.ts`

#### P1-2. Employee Termination Action ✅
**Description:** Profile page has no terminate/reinstate action.
- **Frontend:** "Terminate" Button (destructive) visible when `status !== "terminated"`. Confirmation Dialog before action. "Reinstate" Button (outline) when terminated. Calls `updateEmployee(id, { status: "terminated"|"active" })`.
- **Files:** `frontend/src/app/employees/[id]/page.tsx`

#### P1-3. Time-Off Days Auto-Calculation ✅
**Description:** Days field is manually entered but is derivable from start/end dates.
- **Frontend:** `useEffect` watching startDate + endDate. Formula: `Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000) + 1)`. Days field becomes read-only (`bg-muted text-muted-foreground`).
- **Files:** `frontend/src/app/time-off/new/page.tsx`

#### P1-4. Dashboard Pending Approvals Queue ✅
**Description:** Dashboard shows a count but no actionable list of pending time-off requests.
- **Backend:** Add `pending_approvals` array to `GET /api/v1/dashboard` response using existing `time_off_repo.list_pending()`. Fields: id, employee_name, request_type, start_date, end_date, days.
- **Frontend:** "Pending Approvals" Card in `dashboard-page.tsx` with approve/reject buttons. Update `DashboardData` interface in `api.ts`.
- **Files:** `backend/app/api/v1/dashboard.py`, `backend/tests/test_dashboard.py`, `frontend/src/app/dashboard-page.tsx`, `frontend/src/lib/api.ts`

#### P1-5. Payroll CSV Export ✅
**Description:** HR teams need to export payroll data for external processing.
- **Backend:** `GET /api/v1/payroll/export/csv` → `StreamingResponse` (`text/csv`). Columns: employee_name, department, pay_period_start, pay_period_end, base_salary, bonus, deductions, net_pay. Optional `employee_id` filter.
- **Frontend:** "Export CSV" Button (secondary) in `payroll/page.tsx`. `exportPayrollCsv()` in `api.ts` fetches Blob and triggers browser download.
- **Files:** `backend/app/api/v1/payroll.py`, `backend/tests/test_payroll.py`, `frontend/src/app/payroll/page.tsx`, `frontend/src/lib/api.ts`

---

### P2 — Competitor Feature Set

> Inspired by BambooHR, HiBob, Lattice, and Rippling. All UI strictly uses design tokens above.

#### P2-1. Employee Self-Service Portal *(BambooHR)* ✅
**Description:** Employees can view their own profile, submit time-off, and view payroll history without admin access.
- **Frontend:** `/self-service?employee_id=<id>` page with Tabs: My Profile, My Time Off, My Payroll. No new backend endpoints — uses existing filtered API calls.
- **Files:** `frontend/src/app/self-service/page.tsx` (new), `frontend/src/components/sidebar.tsx`

#### P2-2. eNPS / Engagement Survey *(BambooHR / HiBob)* ✅
**Description:** Pulse survey: NPS score (1–10) + open comment. Tracks employee engagement over time.
- **Backend:** `Survey` model (id, employee_id FK, score Int, comment Text, submitted_at). `GET /api/v1/surveys/summary` returns avg score + response count. Migration + tests.
- **Frontend:** Survey banner Card on dashboard (dismissible via `localStorage`). `/surveys` page shows avg eNPS as `text-2xl font-bold`, response trend.
- **Files:** `backend/app/models/survey.py` (new), schemas, repo, `backend/app/api/v1/surveys.py` (new), migration, tests, `frontend/src/app/surveys/page.tsx` (new), `frontend/src/app/dashboard-page.tsx`

#### P2-3. 1-on-1 Meeting Tracker *(Lattice)* ✅
**Description:** Managers log 1-on-1s with direct reports: date, notes, action items, status.
- **Backend:** `OneOnOne` model (id, manager_id FK Employee, employee_id FK Employee, scheduled_date Date, notes Text, action_items Text, status Enum: scheduled/completed/cancelled). CRUD `/api/v1/one-on-ones`. Migration + tests.
- **Frontend:** `/one-on-ones` page — list with status Badge, create form (manager + employee selects, date, notes).
- **Files:** `backend/app/models/one_on_one.py` (new), schemas, repo, routes, migration, tests, `frontend/src/app/one-on-ones/page.tsx` (new), `frontend/src/components/sidebar.tsx`, `frontend/src/lib/api.ts`

#### P2-4. OKR / Goals Tracking *(Lattice / Rippling)* ✅
**Description:** Track individual or company objectives with a 0–100 progress indicator.
- **Backend:** `Goal` model (id, owner_id FK Employee nullable, title String, description Text, progress Int 0–100 default 0, due_date Date, status Enum: active/completed/cancelled). CRUD `/api/v1/goals`. Migration + tests.
- **Frontend:** `/goals` page — progress bars (`bg-primary h-2 rounded-full` on `bg-muted rounded-full` track), create form, inline progress update.
- **Files:** `backend/app/models/goal.py` (new), schemas, repo, routes, migration, tests, `frontend/src/app/goals/page.tsx` (new), `frontend/src/components/sidebar.tsx`, `frontend/src/lib/api.ts`

#### P2-5. Shoutouts / Recognition Feed *(HiBob)* ✅
**Description:** Public peer recognition — employees give shoutouts to each other.
- **Backend:** `Shoutout` model (id, from_employee_id FK, to_employee_id FK, message Text, created_at). `GET/POST /api/v1/shoutouts`. Migration + tests.
- **Frontend:** `/recognition` page — feed of Cards (avatar, "from → to" in `text-sm font-semibold`, message in `text-muted-foreground`, timestamp). Create form: recipient select + text area.
- **Files:** `backend/app/models/shoutout.py` (new), schemas, repo, routes, migration, tests, `frontend/src/app/recognition/page.tsx` (new), `frontend/src/components/sidebar.tsx`, `frontend/src/lib/api.ts`

#### P2-6. AI: Leave Trend Analysis *(PRODUCT-SPEC)* ✅
**Description:** Predict burnout risk from 12-month leave history using OpenRouter/Ollama.
- **Backend:** `backend/app/services/ai_service.py` (new). `analyze_leave_trends(employee_id, db)` aggregates approved time-off by month+type, sends prompt to OpenRouter (falls back to Ollama). Returns `{ risk_level: low|medium|high, pattern_summary, recommendation }`. Route `GET /api/v1/employees/{id}/leave-analysis`. Tests mock the AI call.
- **Frontend:** "Leave Analysis" tab in `/employees/[id]/page.tsx`. "Run Analysis" Button → risk Badge + summary text.
- **Files:** `backend/app/services/ai_service.py` (new), `backend/app/api/v1/employees.py`, `backend/tests/test_employees.py`, `frontend/src/app/employees/[id]/page.tsx`, `frontend/src/lib/api.ts`

#### P2-7. AI: Salary Benchmarking *(PRODUCT-SPEC)* ✅
**Description:** Compare employee salary to department min/max/avg using AI analysis.
- **Backend:** `benchmark_salary(employee_id, db)` in `ai_service.py` — fetches salary + dept stats from DB, sends to OpenRouter. Returns `{ market_position: below|at|above, recommendation }`. Route `GET /api/v1/employees/{id}/salary-benchmark`.
- **Frontend:** "Benchmark Salary" Button on `/employees/[id]` profile → Dialog showing market_position Badge + recommendation text.
- **Files:** `backend/app/services/ai_service.py`, `backend/app/api/v1/employees.py`, `frontend/src/app/employees/[id]/page.tsx`, `frontend/src/lib/api.ts`

#### P2-8. Time-Off Balance Tracking *(BambooHR)* ✅
**Description:** Show used vs. allocated days per employee per year. Computed — no new model needed.
- **Backend:** `GET /api/v1/employees/{id}/time-off-balance?year=YYYY` — sums approved days by request_type. Returns `{ vacation_used, sick_used, personal_used, vacation_allocated: 20, sick_allocated: 10 }`.
- **Frontend:** Balance progress bars in the Time Off tab of `/employees/[id]/page.tsx`. `bg-primary` fill on `bg-muted` track, `text-sm text-muted-foreground` labels.
- **Files:** `backend/app/api/v1/employees.py`, `backend/tests/test_employees.py`, `frontend/src/app/employees/[id]/page.tsx`, `frontend/src/lib/api.ts`

---

## Implementation Priority

```
1.  P0-5   Fix CORS + register hr router           (1 file, 3 lines — do first)
2.  P0-4   net_pay auto-calculation                 (backend + frontend)
3.  P0-1   /employees/new                           (frontend only)
4.  P0-2   Time-off approve/reject buttons          (frontend only)
5.  P0-3   /employees/[id]/edit                     (frontend only)
6.  P1-3   Time-off days auto-calc                  (frontend only, trivial)
7.  P1-2   Employee termination action              (frontend only)
8.  P1-1   Real Candidate / Recruitment module      (full-stack + migration)
9.  P1-4   Dashboard pending approvals queue        (backend + frontend)
10. P1-5   Payroll CSV export                       (backend + frontend)
11. P2-8   Time-off balance tracking                (computed endpoint, no migration)
12. P2-1   Employee self-service portal             (frontend only)
13. P2-5   Shoutouts / Recognition                  (full-stack + migration)
14. P2-2   eNPS survey                              (full-stack + migration)
15. P2-3   1-on-1 tracker                           (full-stack + migration)
16. P2-4   OKR / Goals tracking                     (full-stack + migration)
17. P2-6   AI leave trend analysis                  (services/ layer — build first)
18. P2-7   AI salary benchmarking                   (extends ai_service.py)
```
