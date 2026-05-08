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
