export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department: string;
  job_title: string;
  salary: number | null;
  hire_date: string;
  status: string;
  manager_id: string | null;
  manager: Employee | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  job_title: string;
  salary?: number;
  hire_date: string;
  status?: string;
  manager_id?: string;
}

export interface EmployeeUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  job_title?: string;
  salary?: number;
  hire_date?: string;
  status?: string;
  manager_id?: string;
}

export interface TimeOffRequest {
  id: string;
  employee_id: string;
  request_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string | null;
  status: string;
  employee: Employee;
  created_at: string;
  updated_at: string;
}

export interface TimeOffCreate {
  employee_id: string;
  request_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status?: string;
}

export interface TimeOffUpdate {
  request_type?: string;
  start_date?: string;
  end_date?: string;
  days?: number;
  reason?: string;
  status?: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_pay: number;
  employee: Employee;
  created_at: string;
  updated_at: string;
}

export interface PayrollCreate {
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  base_salary?: number;
  bonus?: number;
  deductions?: number;
  net_pay?: number;
}

export interface PayrollUpdate {
  pay_period_start?: string;
  pay_period_end?: string;
  base_salary?: number;
  bonus?: number;
  deductions?: number;
  net_pay?: number;
}

export interface DashboardData {
  total_employees: number;
  on_leave_today: number;
  pending_time_off: number;
  monthly_payroll: number;
  department_breakdown: Record<string, number>;
  recent_hires: Array<{
    id: string;
    first_name: string;
    last_name: string;
    department: string;
    hire_date: string;
  }>;
  pending_approvals: Array<{
    id: string;
    employee_name: string;
    request_type: string;
    start_date: string;
    end_date: string;
    days: number;
  }>;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateCreate {
  name: string;
  role: string;
  email: string;
  status?: string;
  notes?: string;
}

export interface CandidateUpdate {
  name?: string;
  role?: string;
  email?: string;
  status?: string;
  notes?: string;
}

export interface Survey {
  id: string;
  employee_id: string;
  score: number;
  comment: string | null;
  submitted_at: string;
}

export interface SurveyCreate {
  employee_id: string;
  score: number;
  comment?: string;
}

export interface SurveySummary {
  avg_score: number;
  response_count: number;
}

export interface EmployeeNested {
  id: string;
  first_name: string;
  last_name: string;
}

export interface OneOnOne {
  id: string;
  manager_id: string;
  employee_id: string;
  scheduled_date: string;
  notes: string | null;
  action_items: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  manager: EmployeeNested;
  employee: EmployeeNested;
}

export interface OneOnOneCreate {
  manager_id: string;
  employee_id: string;
  scheduled_date: string;
  notes?: string;
  action_items?: string;
  status?: string;
}

export interface OneOnOneUpdate {
  scheduled_date?: string;
  notes?: string;
  action_items?: string;
  status?: string;
}

export interface Goal {
  id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  progress: number;
  due_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  owner: EmployeeNested | null;
}

export interface GoalCreate {
  owner_id?: string;
  title: string;
  description?: string;
  progress?: number;
  due_date?: string;
  status?: string;
}

export interface GoalUpdate {
  title?: string;
  description?: string;
  progress?: number;
  due_date?: string;
  status?: string;
}

export interface Shoutout {
  id: string;
  from_employee_id: string;
  to_employee_id: string;
  message: string;
  created_at: string;
  from_employee: EmployeeNested;
  to_employee: EmployeeNested;
}

export interface ShoutoutCreate {
  from_employee_id: string;
  to_employee_id: string;
  message: string;
}

export interface TimeOffBalance {
  year: number;
  vacation_used: number;
  sick_used: number;
  personal_used: number;
  vacation_allocated: number;
  sick_allocated: number;
}

export interface LeaveAnalysis {
  risk_level: "low" | "medium" | "high";
  pattern_summary: string;
  recommendation: string;
}

export interface SalaryBenchmark {
  market_position: "below" | "at" | "above";
  recommendation: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

// Employees
export async function listEmployees(params?: { department?: string; status?: string }): Promise<Employee[]> {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString() : "";
  return api<Employee[]>(`/employees${qs}`);
}

export async function createEmployee(data: EmployeeCreate): Promise<Employee> {
  return api<Employee>("/employees", { method: "POST", body: JSON.stringify(data) });
}

export async function getEmployee(id: string): Promise<Employee> {
  return api<Employee>(`/employees/${id}`);
}

export async function updateEmployee(id: string, data: EmployeeUpdate): Promise<Employee> {
  return api<Employee>(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteEmployee(id: string): Promise<void> {
  return api<void>(`/employees/${id}`, { method: "DELETE" });
}

export async function getTimeOffBalance(id: string, year?: number): Promise<TimeOffBalance> {
  const qs = year ? `?year=${year}` : "";
  return api<TimeOffBalance>(`/employees/${id}/time-off-balance${qs}`);
}

export async function getLeaveAnalysis(id: string): Promise<LeaveAnalysis> {
  return api<LeaveAnalysis>(`/employees/${id}/leave-analysis`);
}

export async function getSalaryBenchmark(id: string): Promise<SalaryBenchmark> {
  return api<SalaryBenchmark>(`/employees/${id}/salary-benchmark`);
}

// Time Off
export async function listTimeOff(params?: { employee_id?: string; status?: string }): Promise<TimeOffRequest[]> {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString() : "";
  return api<TimeOffRequest[]>(`/time-off${qs}`);
}

export async function createTimeOff(data: TimeOffCreate): Promise<TimeOffRequest> {
  return api<TimeOffRequest>("/time-off", { method: "POST", body: JSON.stringify(data) });
}

export async function getTimeOff(id: string): Promise<TimeOffRequest> {
  return api<TimeOffRequest>(`/time-off/${id}`);
}

export async function updateTimeOff(id: string, data: TimeOffUpdate): Promise<TimeOffRequest> {
  return api<TimeOffRequest>(`/time-off/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteTimeOff(id: string): Promise<void> {
  return api<void>(`/time-off/${id}`, { method: "DELETE" });
}

// Payroll
export async function listPayroll(params?: { employee_id?: string }): Promise<PayrollRecord[]> {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString() : "";
  return api<PayrollRecord[]>(`/payroll${qs}`);
}

export async function createPayroll(data: PayrollCreate): Promise<PayrollRecord> {
  return api<PayrollRecord>("/payroll", { method: "POST", body: JSON.stringify(data) });
}

export async function getPayroll(id: string): Promise<PayrollRecord> {
  return api<PayrollRecord>(`/payroll/${id}`);
}

export async function updatePayroll(id: string, data: PayrollUpdate): Promise<PayrollRecord> {
  return api<PayrollRecord>(`/payroll/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deletePayroll(id: string): Promise<void> {
  return api<void>(`/payroll/${id}`, { method: "DELETE" });
}

// Dashboard
export async function getDashboard(): Promise<DashboardData> {
  return api<DashboardData>("/dashboard");
}

// Candidates
export async function listCandidates(params?: { status?: string }): Promise<Candidate[]> {
  const qs = params?.status ? `?status=${params.status}` : "";
  return api<Candidate[]>(`/candidates${qs}`);
}

export async function createCandidate(data: CandidateCreate): Promise<Candidate> {
  return api<Candidate>("/candidates", { method: "POST", body: JSON.stringify(data) });
}

export async function getCandidate(id: string): Promise<Candidate> {
  return api<Candidate>(`/candidates/${id}`);
}

export async function updateCandidate(id: string, data: CandidateUpdate): Promise<Candidate> {
  return api<Candidate>(`/candidates/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteCandidate(id: string): Promise<void> {
  return api<void>(`/candidates/${id}`, { method: "DELETE" });
}

// Surveys
export async function listSurveys(params?: { employee_id?: string }): Promise<Survey[]> {
  const qs = params?.employee_id ? `?employee_id=${params.employee_id}` : "";
  return api<Survey[]>(`/surveys${qs}`);
}

export async function getSurveySummary(): Promise<SurveySummary> {
  return api<SurveySummary>("/surveys/summary");
}

export async function createSurvey(data: SurveyCreate): Promise<Survey> {
  return api<Survey>("/surveys", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteSurvey(id: string): Promise<void> {
  return api<void>(`/surveys/${id}`, { method: "DELETE" });
}

// 1-on-1s
export async function listOneOnOnes(params?: { manager_id?: string; employee_id?: string }): Promise<OneOnOne[]> {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString() : "";
  return api<OneOnOne[]>(`/one-on-ones${qs}`);
}

export async function createOneOnOne(data: OneOnOneCreate): Promise<OneOnOne> {
  return api<OneOnOne>("/one-on-ones", { method: "POST", body: JSON.stringify(data) });
}

export async function updateOneOnOne(id: string, data: OneOnOneUpdate): Promise<OneOnOne> {
  return api<OneOnOne>(`/one-on-ones/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteOneOnOne(id: string): Promise<void> {
  return api<void>(`/one-on-ones/${id}`, { method: "DELETE" });
}

// Goals
export async function listGoals(params?: { owner_id?: string; status?: string }): Promise<Goal[]> {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString() : "";
  return api<Goal[]>(`/goals${qs}`);
}

export async function createGoal(data: GoalCreate): Promise<Goal> {
  return api<Goal>("/goals", { method: "POST", body: JSON.stringify(data) });
}

export async function updateGoal(id: string, data: GoalUpdate): Promise<Goal> {
  return api<Goal>(`/goals/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteGoal(id: string): Promise<void> {
  return api<void>(`/goals/${id}`, { method: "DELETE" });
}

// Shoutouts
export async function listShoutouts(): Promise<Shoutout[]> {
  return api<Shoutout[]>("/shoutouts");
}

export async function createShoutout(data: ShoutoutCreate): Promise<Shoutout> {
  return api<Shoutout>("/shoutouts", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteShoutout(id: string): Promise<void> {
  return api<void>(`/shoutouts/${id}`, { method: "DELETE" });
}

// Payroll CSV export
export async function exportPayrollCsv(employeeId?: string): Promise<void> {
  const qs = employeeId ? `?employee_id=${employeeId}` : "";
  const url = `${API_BASE}/api/v1/payroll/export/csv${qs}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "payroll.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
