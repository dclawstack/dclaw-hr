# 📘 Everything We Built — DClaw HR

> **Written for everyone — from small kids to senior engineers.**
> Think of this as a story of how we built a full HR app from scratch, step by step.

---

## 🏠 What Is DClaw HR?

Imagine you run a company with lots of people working for you.
You need to:
- Keep track of all your employees (their names, jobs, salaries)
- Let people ask for days off (vacation, sick leave)
- Pay everyone at the end of the month
- Track who wants to join your company (job applicants)
- Know when people are burning out
- See how happy your employees are

DClaw HR is like a **super smart notebook** for all of that — but on a computer.
It has two parts:
- 🖥️ **The backend** — like the brain, stores all data in a database
- 🌐 **The frontend** — like the face, the website people see and click on

---

## 🗂️ How Work Was Organized — The Plan

All the features were listed in a file called `PLAN-v1.2.md`.
Think of it like a **to-do list** divided into three groups:

| Priority | Name | What it means |
|----------|------|---------------|
| **P0** | Must Have | The app breaks without these |
| **P1** | Should Have | Very important, makes the app useful |
| **P2** | Nice to Have | Makes the app awesome, like real products |

When a feature was done, we put a ✅ next to it.

---

## ✅ P0 Features — The Foundation (Already Done Before)

These were already implemented. Here's what each one does:

### P0-1 — Add New Employee Page
> **Simple version:** A form where you fill in someone's name, job, salary, and click Save.

- Built a page at `/employees/new`
- Has fields: First name, Last name, Email, Phone, Department, Job Title, Salary, Hire Date, Manager
- When you click Save → the employee is stored in the database
- An "Add Employee" button was added to the employees list page

### P0-2 — Approve or Reject Time Off
> **Simple version:** A manager can say YES or NO to someone's vacation request.

- Added two buttons (Approve ✅ and Reject ❌) on the Time Off page
- When clicked, the request status updates instantly
- The page refreshes to show the new status

### P0-3 — Edit Employee Page
> **Simple version:** Fix a typo in someone's job title or update their salary.

- Built a page at `/employees/[id]/edit`
- Pre-fills the form with current info
- On Save → redirects back to the employee's profile page

### P0-4 — Auto-Calculate Net Pay
> **Simple version:** The computer does the math so you don't have to.

- **Formula:** Net Pay = Base Salary + Bonus − Deductions
- You type in the numbers, the computer shows the result automatically
- The Net Pay box was removed from the form (no more manual entry)

### P0-5 — Fix CORS & Register HR Router
> **Simple version:** Made the website and the brain talk to each other properly.

- Added the correct website address to the allowed list
- Registered the recruitment module so it actually works

---

## ✅ P1 Features — The Core App (Already Done Before)

### P1-1 — Real Recruitment Module
> **Simple version:** Track job applicants — who applied, who got interviewed, who got hired.

- Built a full `Candidate` database table
- Each candidate has: Name, Role, Email, Status (Screening → Interviewed → Offered → Rejected), Notes
- Built a `/recruitment` page with a filter by status and a form to add candidates
- Added "Recruitment" to the sidebar navigation

### P1-2 — Terminate / Reinstate Employee
> **Simple version:** Mark someone as no longer working here, or bring them back.

- Added a red "Terminate" button on the employee profile page
- A popup asks "Are you sure?" before anything happens (safety check!)
- After termination, the button changes to "Reinstate"
- Calls the API to update the status in the database

### P1-3 — Auto-Calculate Days Off
> **Simple version:** Pick start and end date, days count itself.

- When you pick "March 1" to "March 5" → Days = 5 (automatic!)
- Formula: `(end date - start date) in days + 1`
- The Days box becomes read-only (grey) — computer fills it in

### P1-4 — Pending Approvals on Dashboard
> **Simple version:** The home screen shows who needs their vacation approved.

- The `/api/v1/dashboard` now returns a list of pending requests
- Dashboard shows each request: who asked, what type, dates, how many days
- Approve/Reject buttons right there on the dashboard

### P1-5 — Export Payroll to CSV
> **Simple version:** Download payroll data as a spreadsheet.

- A "Export CSV" button on the Payroll page
- Clicking it downloads a file with all payroll records
- The file has: employee name, department, pay period, base salary, bonus, deductions, net pay

---

## 🌟 P2 Features — The NEW Stuff We Built

**This is the main work.** All 8 features below were built from zero.

---

### P2-1 — Employee Self-Service Portal
> **Simple version:** Each employee can look at their own info without needing a manager.

**What it does:**
- Go to `/self-service`
- Pick your name from a dropdown
- See 3 tabs:
  - **My Profile** — your name, email, salary, manager, hire date
  - **My Time Off** — all your vacation/sick requests and their status
  - **My Payroll** — your pay history

**Files created:**
- `frontend/src/app/self-service/page.tsx` — the entire page
- Updated `sidebar.tsx` to add "Self Service" link

**No new backend needed** — it reuses existing APIs with a filter.

**Fun fact:** We used `Suspense` (a React trick) to make the page load smoothly without crashing.

---

### P2-2 — eNPS / Engagement Survey
> **Simple version:** "On a scale of 1 to 10, how happy are you at work?" — like a happiness meter.

**What eNPS means:** Employee Net Promoter Score — a number that tells how engaged employees are.

**What it does:**
- `/surveys` page shows the average score (big number at the top)
- Shows total number of responses
- A form lets any employee submit their score (1–10) plus a comment
- Dashboard has a little banner saying "Take our survey!" — you can dismiss it forever by clicking X

**Files created:**

*Backend (the brain):*
- `backend/app/models/survey.py` — the database table (id, employee_id, score, comment, submitted_at)
- `backend/app/schemas/survey.py` — data validation rules
- `backend/app/repositories/survey_repo.py` — how to read/write surveys from database
- `backend/app/api/v1/surveys.py` — the API routes:
  - `GET /api/v1/surveys` — list all surveys
  - `GET /api/v1/surveys/summary` — returns average score + total count
  - `POST /api/v1/surveys` — submit a new survey
  - `DELETE /api/v1/surveys/{id}` — delete a survey

*Frontend (the face):*
- `frontend/src/app/surveys/page.tsx` — the surveys page
- Updated `frontend/src/app/dashboard-page.tsx` — added dismissible banner

*Database migration:*
- `backend/alembic/versions/c3d4e5f6a7b8_add_p2_tables.py` — creates the `surveys` table in PostgreSQL

*Tests:*
- `backend/tests/test_surveys.py` — 6 tests: create, invalid score, list, summary average, delete, 404 on missing

---

### P2-3 — 1-on-1 Meeting Tracker
> **Simple version:** Managers write notes from their private meetings with employees.

**What it does:**
- `/one-on-ones` page shows all scheduled/completed meetings
- Create a meeting: pick the manager, pick the employee, choose a date, add notes
- Update status: Scheduled → Completed → Cancelled (a dropdown per row)
- Delete a meeting with the trash icon

**Files created:**

*Backend:*
- `backend/app/models/one_on_one.py` — table with: id, manager_id, employee_id, date, notes, action_items, status
- `backend/app/schemas/one_on_one.py`
- `backend/app/repositories/one_on_one_repo.py`
- `backend/app/api/v1/one_on_ones.py` — full CRUD (Create, Read, Update, Delete)

*Frontend:*
- `frontend/src/app/one-on-ones/page.tsx`

*Tests:*
- `backend/tests/test_one_on_ones.py` — 4 tests: create, list, update status, delete + 404

**Cool detail:** The model has TWO foreign keys to the employee table (one for manager, one for employee). We used `foreign_keys="[OneOnOne.manager_id]"` to tell SQLAlchemy which FK is which.

---

### P2-4 — OKR / Goals Tracking
> **Simple version:** Set goals like "Launch new website by December" and track progress as a progress bar.

**What OKR means:** Objectives and Key Results — a way companies track big goals.

**What it does:**
- `/goals` page shows all goals as cards with progress bars
- Drag a slider to update progress (0% → 100%)
- Create a goal: title, description, owner (optional), due date, progress
- Status dropdown: Active → Completed → Cancelled
- Filter goals by status

**Files created:**

*Backend:*
- `backend/app/models/goal.py` — table: id, owner_id (nullable!), title, description, progress (0-100), due_date, status
- `backend/app/schemas/goal.py` — validates progress is between 0 and 100
- `backend/app/repositories/goal_repo.py`
- `backend/app/api/v1/goals.py`

*Frontend:*
- `frontend/src/app/goals/page.tsx` — progress bars with `bg-primary h-2 rounded-full`

*Tests:*
- `backend/tests/test_goals.py` — 7 tests: create with owner, create without owner, list, filter by status, update progress, invalid progress (>100), delete

---

### P2-5 — Shoutouts / Recognition Feed
> **Simple version:** Like a "thank you wall" where employees give each other public praise.

**What it does:**
- `/recognition` page shows a feed of shoutout cards
- Each card shows: sender's avatar → receiver's name, message, date
- A form at the top: "From" (dropdown), "To" (dropdown), message
- Delete button to remove a shoutout

**Files created:**

*Backend:*
- `backend/app/models/shoutout.py` — table: id, from_employee_id, to_employee_id, message, created_at
- `backend/app/schemas/shoutout.py`
- `backend/app/repositories/shoutout_repo.py`
- `backend/app/api/v1/shoutouts.py`

*Frontend:*
- `frontend/src/app/recognition/page.tsx` — uses the `Avatar` component with initials

*Tests:*
- `backend/tests/test_shoutouts.py` — 4 tests: create, list, delete, 404 on missing

**Cool detail:** Like the 1-on-1 model, Shoutout has TWO foreign keys to the employee table. We solved it with `foreign_keys="[Shoutout.from_employee_id]"`.

---

### P2-6 — AI Leave Trend Analysis
> **Simple version:** A robot looks at how often someone takes time off and says "This person might be burning out!"

**What it does:**
- On any employee's profile page → "Leave Analysis" tab
- Click "Run Analysis" button
- The AI looks at all their approved time-off history
- Returns: Risk Level (🟢 Low / 🟡 Medium / 🔴 High), Pattern Summary, Recommendation

**How the AI works:**

```
Your code → asks OpenRouter (paid AI service)
           → if that fails, asks Ollama (free local AI)
           → if that fails too, calculates from the data itself
```

1. We collect all approved time-off records for the employee
2. We write a message like: *"Employee took: vacation: 2025-03 (5d), sick: 2025-06 (3d)..."*
3. We send this to the AI and ask for a JSON response
4. We show the result to the user

**Files created:**

*Backend:*
- `backend/app/services/ai_service.py` — the AI brain:
  - `_call_ai(prompt)` — tries OpenRouter first, then Ollama, returns text
  - `_parse_json_from_text(text)` — extracts JSON from AI's response
  - `analyze_leave_trends(employee_id, db)` — the main leave analysis function
- New route in `backend/app/api/v1/employees.py`:
  - `GET /api/v1/employees/{id}/leave-analysis`

*Frontend:*
- New "Leave Analysis" tab in `frontend/src/app/employees/[id]/page.tsx`
- "Run Analysis" button → shows risk badge + summary paragraphs

*Tests:*
- In `backend/tests/test_employees.py`:
  - `test_leave_analysis` — mocks the AI call, checks response structure
  - We use `unittest.mock.patch("app.services.ai_service._call_ai")` so tests don't need a real AI

---

### P2-7 — AI Salary Benchmarking
> **Simple version:** "Is my salary fair compared to others in my department?"

**What it does:**
- On an employee's profile → "Benchmark Salary" button
- AI compares their salary to department min/avg/max
- Returns: Market Position (Below / At / Above), Recommendation
- Shows in a popup dialog with a colored badge

**How it works:**

```
1. Look up employee's salary
2. Calculate department stats (min, max, avg) from database
3. Send to AI: "Employee earns $90,000. Dept avg is $85,000..."
4. AI returns: {"market_position": "above", "recommendation": "..."}
5. Show in a dialog popup
```

**Files created:**

*Backend:*
- Added `benchmark_salary(employee_id, db)` to `backend/app/services/ai_service.py`
- New route: `GET /api/v1/employees/{id}/salary-benchmark`

*Frontend:*
- "Benchmark Salary" button added to employee profile header
- Dialog popup to show result

*Tests:*
- `test_salary_benchmark` — mocks AI, verifies response keys

---

### P2-8 — Time-Off Balance Tracking
> **Simple version:** "I have 20 vacation days per year. I used 8. I have 12 left."

**What it does:**
- On employee's profile → "Balance" tab (new!)
- Shows two progress bars:
  - 🏖️ **Vacation:** used X out of 20 days — blue bar fills up
  - 🤒 **Sick:** used Y out of 10 days — blue bar fills up
- Also shows Personal days used
- Supports `?year=2026` filter to see any year's balance

**How the math works:**

```
SELECT request_type, SUM(days)
FROM time_off_requests
WHERE employee_id = ? AND status = 'approved' AND year = ?
GROUP BY request_type
```

Then:
- Vacation remaining = 20 − vacation_used
- Sick remaining = 10 − sick_used

**Files created:**

*Backend:*
- New route in `employees.py`: `GET /api/v1/employees/{id}/time-off-balance?year=YYYY`

*Frontend:*
- New "Balance" tab in `frontend/src/app/employees/[id]/page.tsx`
- Progress bars using `bg-muted rounded-full` (grey track) + `bg-primary h-2 rounded-full` (blue fill)

*Tests:*
- `test_time_off_balance` — creates approved request, calls balance endpoint, checks the count

---

## 🗄️ The Database — What Got Added

We created ONE big migration file (`c3d4e5f6a7b8_add_p2_tables.py`) that creates 4 new tables:

### `surveys` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| employee_id | UUID (FK) | Which employee submitted |
| score | Integer | 1 to 10 |
| comment | Text (optional) | Their feedback |
| submitted_at | DateTime | When they submitted |

### `one_on_ones` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| manager_id | UUID (FK) | The manager |
| employee_id | UUID (FK) | The employee |
| scheduled_date | Date | When the meeting is |
| notes | Text (optional) | Discussion notes |
| action_items | Text (optional) | Follow-up tasks |
| status | Enum | scheduled / completed / cancelled |
| created_at / updated_at | DateTime | Timestamps |

### `goals` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| owner_id | UUID (FK, optional) | Who owns it (null = company-wide) |
| title | String | Goal name |
| description | Text (optional) | More detail |
| progress | Integer | 0 to 100 |
| due_date | Date (optional) | Deadline |
| status | Enum | active / completed / cancelled |
| created_at / updated_at | DateTime | Timestamps |

### `shoutouts` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| from_employee_id | UUID (FK) | Who gave the shoutout |
| to_employee_id | UUID (FK) | Who received it |
| message | Text | The praise message |
| created_at | DateTime | When it was posted |

---

## 📡 All New API Endpoints

| Method | Path | What it does |
|--------|------|-------------|
| `GET` | `/api/v1/surveys` | List all survey responses |
| `GET` | `/api/v1/surveys/summary` | Get avg score + total count |
| `POST` | `/api/v1/surveys` | Submit a new survey |
| `DELETE` | `/api/v1/surveys/{id}` | Delete a survey |
| `GET` | `/api/v1/one-on-ones` | List all 1-on-1 meetings |
| `POST` | `/api/v1/one-on-ones` | Schedule a new meeting |
| `GET` | `/api/v1/one-on-ones/{id}` | Get one meeting |
| `PATCH` | `/api/v1/one-on-ones/{id}` | Update meeting (status/notes) |
| `DELETE` | `/api/v1/one-on-ones/{id}` | Cancel/delete a meeting |
| `GET` | `/api/v1/goals` | List all goals |
| `POST` | `/api/v1/goals` | Create a new goal |
| `GET` | `/api/v1/goals/{id}` | Get one goal |
| `PATCH` | `/api/v1/goals/{id}` | Update progress or status |
| `DELETE` | `/api/v1/goals/{id}` | Delete a goal |
| `GET` | `/api/v1/shoutouts` | List all shoutouts (newest first) |
| `POST` | `/api/v1/shoutouts` | Create a shoutout |
| `DELETE` | `/api/v1/shoutouts/{id}` | Delete a shoutout |
| `GET` | `/api/v1/employees/{id}/time-off-balance` | Get leave balance for a year |
| `GET` | `/api/v1/employees/{id}/leave-analysis` | Run AI burnout analysis |
| `GET` | `/api/v1/employees/{id}/salary-benchmark` | Run AI salary benchmark |

---

## 🧪 Tests — How We Made Sure It Works

We wrote **49 automated tests** total. Think of tests like a checklist:
> "Does the 'create survey' button actually save a survey? ✅"
> "Does typing a score of 11 (invalid) get rejected? ✅"

### How tests work (simple version)

```
1. Start a fake database (in memory — no files, super fast)
2. Start a fake version of the app
3. Send pretend HTTP requests ("click this button")
4. Check the response ("did we get what we expected?")
5. Wipe the database clean for the next test
```

### Test files and counts

| Test File | Tests | What's tested |
|-----------|-------|---------------|
| `test_candidates.py` | 7 | Create, duplicate email, list, filter, get, update, delete |
| `test_dashboard.py` | 2 | Empty dashboard, dashboard with real data |
| `test_employees.py` | 10 | CRUD + time-off balance + AI leave analysis + AI salary benchmark |
| `test_goals.py` | 7 | Create (with/without owner), list, filter, update, invalid progress, delete |
| `test_one_on_ones.py` | 4 | Create, list, update status, delete |
| `test_payroll.py` | 4 | Create, list by employee, update, delete |
| `test_shoutouts.py` | 4 | Create, list, delete, 404 on missing |
| `test_surveys.py` | 6 | Create, invalid score, list, summary average, delete, 404 |
| `test_time_off.py` | 5 | Create, list by employee, list by status, update, delete |
| **Total** | **49** | **All passed ✅** |

### How AI tests work (the clever part)

The AI tests don't actually call OpenAI or Ollama (that would cost money and be slow).
Instead, we **pretend** to be the AI:

```python
fake_ai_response = '{"risk_level": "low", "pattern_summary": "Normal usage", "recommendation": "Keep it up"}'
with patch("app.services.ai_service._call_ai", return_value=fake_ai_response):
    response = await client.get(f"/api/v1/employees/{emp_id}/leave-analysis")
```

It's like testing a calculator with a fake battery — we just make sure the math is right.

### Test results

```
============================= test session starts ==============================
49 passed in 1.99s
===============================================================
```

🎉 **All 49 tests passed!**

---

## 🌐 Frontend — New Pages Added

### Navigation Sidebar
Before, the sidebar had 5 links. Now it has **10 links**:

```
Before:          After:
─────────────    ────────────────
Dashboard        Dashboard
Employees        Employees
Time Off         Time Off
Payroll          Payroll
Recruitment      Recruitment
                 Recognition  ← NEW
                 Goals        ← NEW
                 1-on-1s      ← NEW
                 Surveys      ← NEW
                 Self Service ← NEW
```

### New Frontend Pages Summary

| Page | Path | What you see |
|------|------|-------------|
| Self Service | `/self-service` | Your profile, time off, payroll in tabs |
| Surveys | `/surveys` | Big avg score, submit survey form, list of responses |
| 1-on-1s | `/one-on-ones` | Table of meetings, schedule new meeting form |
| Goals | `/goals` | Goal cards with progress bars and status filters |
| Recognition | `/recognition` | Feed of shoutout cards with create form |

### Updated Pages

**Employee Profile (`/employees/[id]`)** — got 3 big upgrades:
1. **Balance tab** — progress bars for vacation/sick day usage
2. **Leave Analysis tab** — "Run Analysis" button → AI burnout report
3. **Benchmark Salary button** — popup dialog with market position badge

**Dashboard (`/`)** — got 1 upgrade:
- Survey banner card at the top (dismissible, saves to browser memory)

---

## 🔧 Bugs Fixed Along the Way

1. **Wrong proxy port** — `next.config.js` was pointing to port 8103 (wrong!). Fixed to port 8097 (the real backend port).

2. **Missing Suspense wrapper** — Next.js 14 requires `useSearchParams()` to be inside a `<Suspense>` tag. Fixed in `self-service/page.tsx`.

3. **Alembic missing new models** — `alembic/env.py` only knew about the old tables. Added imports for all 5 new models so future migrations detect changes automatically.

---

## 🚀 Git History — What We Committed

```
564ac32  fix: import all P2 models in alembic/env.py
3e6f5e4  fix: add Suspense wrapper + fix dev proxy port to 8097
c4aa8d3  feat: implement all P2 features
99dca93  docs(plan): mark P0 and P1 features as complete
61413cb  feat: implement P1 features
7a14128  feat: implement P0 features
```

---

## 📬 The Pull Request

A Pull Request (PR) is like saying:
> "Hey team, I made changes. Can you review them before we use them?"

**PR #4** was created at:
👉 `https://github.com/dclawstack/dclaw-hr/pull/4`

**Title:** `feat: implement all P2 features — eNPS, 1-on-1s, Goals, Recognition, Self-Service, AI, Balance`

**What the PR included:**
- 37 files changed
- 2,572 lines added
- 67 lines removed

**Status:** ✅ **MERGED** on 2026-05-11

---

## 📊 Complete Stats

| Category | Count |
|----------|-------|
| New backend models | 4 |
| New Pydantic schemas | 4 |
| New repository classes | 4 |
| New API route files | 4 |
| New AI service functions | 3 |
| New API endpoints | 20 |
| New frontend pages | 5 |
| Updated frontend pages | 2 |
| New test files | 4 |
| Updated test files | 1 |
| Total tests | 49 |
| Tests passing | 49 ✅ |
| Database migrations | 1 (4 tables) |
| Bugs fixed | 3 |
| PRs raised | 1 |
| PRs merged | 1 |

---

## 🗺️ File Map — Every New File Created

```
dclaw-hr/
│
├── backend/
│   ├── alembic/
│   │   └── versions/
│   │       └── c3d4e5f6a7b8_add_p2_tables.py   ← Creates 4 new DB tables
│   │
│   └── app/
│       ├── api/
│       │   ├── main.py                           ← Updated: registers 4 new routers
│       │   └── v1/
│       │       ├── employees.py                  ← Updated: 3 new sub-endpoints
│       │       ├── surveys.py                    ← NEW
│       │       ├── one_on_ones.py                ← NEW
│       │       ├── goals.py                      ← NEW
│       │       └── shoutouts.py                  ← NEW
│       │
│       ├── models/
│       │   ├── __init__.py                       ← Updated: exports new models
│       │   ├── survey.py                         ← NEW
│       │   ├── one_on_one.py                     ← NEW
│       │   ├── goal.py                           ← NEW
│       │   └── shoutout.py                       ← NEW
│       │
│       ├── repositories/
│       │   ├── survey_repo.py                    ← NEW
│       │   ├── one_on_one_repo.py                ← NEW
│       │   ├── goal_repo.py                      ← NEW
│       │   └── shoutout_repo.py                  ← NEW
│       │
│       ├── schemas/
│       │   ├── survey.py                         ← NEW
│       │   ├── one_on_one.py                     ← NEW
│       │   ├── goal.py                           ← NEW
│       │   └── shoutout.py                       ← NEW
│       │
│       └── services/
│           └── ai_service.py                     ← NEW (OpenRouter + Ollama)
│
│   └── tests/
│       ├── test_employees.py                     ← Updated: AI + balance tests
│       ├── test_surveys.py                       ← NEW
│       ├── test_one_on_ones.py                   ← NEW
│       ├── test_goals.py                         ← NEW
│       └── test_shoutouts.py                     ← NEW
│
└── frontend/
    └── src/
        ├── lib/
        │   └── api.ts                            ← Updated: all new interfaces + functions
        │
        ├── components/
        │   └── sidebar.tsx                       ← Updated: 5 new nav links
        │
        └── app/
            ├── dashboard-page.tsx                ← Updated: survey banner
            ├── employees/[id]/page.tsx           ← Updated: Balance, Analysis, Benchmark
            ├── self-service/
            │   └── page.tsx                      ← NEW
            ├── surveys/
            │   └── page.tsx                      ← NEW
            ├── one-on-ones/
            │   └── page.tsx                      ← NEW
            ├── goals/
            │   └── page.tsx                      ← NEW
            └── recognition/
                └── page.tsx                      ← NEW
```

---

## 🎓 Key Concepts Explained Simply

**API (Application Programming Interface)**
> Like a waiter at a restaurant. You (the website) tell the waiter (API) what you want, the waiter goes to the kitchen (database), and brings back your food (data).

**Database Migration**
> Like renovation blueprints. You write down "add a new room (table)" and the builder (Alembic) follows the plan to change the actual house (database).

**Repository Pattern**
> Like a librarian. Instead of everyone going to find books themselves, you ask the librarian to get/save books. The librarian knows where everything is.

**Pydantic Schema**
> Like a form with rules. "Score must be between 1 and 10." If you put 11, it says "NOPE!" before even touching the database.

**Foreign Key**
> Like a reference. A shoutout says "from_employee_id = 5". That's like saying "see employee #5 for details." The database links them together.

**`useSearchParams` + Suspense**
> Next.js is like a waiter who sometimes prepares food in advance (static rendering). If the food depends on what the customer orders (URL params), the waiter needs to wait at the table (Suspense) instead of pre-preparing.

**Mocking in Tests**
> Instead of calling the real AI (expensive, slow), we use a pretend AI that always returns the same answer. Like testing a smoke alarm with a hairdryer instead of a real fire.

---

*Built with Claude Code — Anthropic's AI coding assistant.*
*Total implementation time: ~1 session.*
*All 49 tests: ✅ Passing.*
*PR: ✅ Merged.*
