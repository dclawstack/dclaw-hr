"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listPayroll, createPayroll, listEmployees, exportPayrollCsv, PayrollRecord, Employee } from "@/lib/api";

export default function PayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [employeeId, setEmployeeId] = useState("");
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("0");
  const [deductions, setDeductions] = useState("0");

  const calculatedNetPay =
    (parseFloat(baseSalary) || 0) + (parseFloat(bonus) || 0) - (parseFloat(deductions) || 0);

  useEffect(() => {
    listPayroll()
      .then(setRecords)
      .catch((e) => setError(e.message));
    listEmployees()
      .then(setEmployees)
      .catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createPayroll({
        employee_id: employeeId,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        base_salary: parseFloat(baseSalary),
        bonus: parseFloat(bonus),
        deductions: parseFloat(deductions),
      });
      const updated = await listPayroll();
      setRecords(updated);
      setShowForm(false);
      setEmployeeId("");
      setPayPeriodStart("");
      setPayPeriodEnd("");
      setBaseSalary("");
      setBonus("0");
      setDeductions("0");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payroll</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => exportPayrollCsv().catch((e) => setError(e.message))}>
            Export CSV
          </Button>
          <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "Run Payroll"}</Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={employeeId} onValueChange={(v) => setEmployeeId(v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pay Period Start</Label>
                  <Input type="date" value={payPeriodStart} onChange={(e) => setPayPeriodStart(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Pay Period End</Label>
                  <Input type="date" value={payPeriodEnd} onChange={(e) => setPayPeriodEnd(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Salary</Label>
                  <Input type="number" step="0.01" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Bonus</Label>
                  <Input type="number" step="0.01" value={bonus} onChange={(e) => setBonus(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deductions</Label>
                  <Input type="number" step="0.01" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Calculated Net Pay</Label>
                  <div className="flex h-9 items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
                    ${calculatedNetPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit">Save Payroll Record</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-sm text-slate-500">No payroll records</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.employee.first_name} {p.employee.last_name}
                    </TableCell>
                    <TableCell>
                      {p.pay_period_start} → {p.pay_period_end}
                    </TableCell>
                    <TableCell>${p.base_salary.toLocaleString()}</TableCell>
                    <TableCell>${p.bonus.toLocaleString()}</TableCell>
                    <TableCell>${p.deductions.toLocaleString()}</TableCell>
                    <TableCell>${p.net_pay.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
