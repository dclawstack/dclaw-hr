"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listEmployees, getEmployee, listTimeOff, listPayroll, Employee, TimeOffRequest, PayrollRecord } from "@/lib/api";

function SelfServiceContent() {
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState(searchParams.get("employee_id") || "");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeOff, setTimeOff] = useState<TimeOffRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listEmployees().then(setEmployees).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    Promise.all([getEmployee(selectedId), listTimeOff({ employee_id: selectedId }), listPayroll({ employee_id: selectedId })])
      .then(([e, to, pr]) => { setEmployee(e); setTimeOff(to); setPayroll(pr); })
      .catch((e) => setError(e.message));
  }, [selectedId]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Employee Self Service</h1>

      <div className="flex items-center gap-3">
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Select an employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.first_name} {e.last_name} — {e.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <div className="text-destructive text-sm">{error}</div>}

      {!selectedId && (
        <Card>
          <CardContent className="pt-6 text-muted-foreground text-sm">Select an employee above to view their self-service portal.</CardContent>
        </Card>
      )}

      {employee && (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="timeoff">My Time Off</TabsTrigger>
            <TabsTrigger value="payroll">My Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{employee.first_name} {employee.last_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary" className="capitalize">{employee.department}</Badge>
                  <Badge variant={employee.status === "active" ? "default" : "destructive"} className="capitalize">{employee.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Email: </span>{employee.email}</div>
                  <div><span className="text-muted-foreground">Phone: </span>{employee.phone || "—"}</div>
                  <div><span className="text-muted-foreground">Title: </span>{employee.job_title}</div>
                  <div><span className="text-muted-foreground">Salary: </span>{employee.salary ? `$${employee.salary.toLocaleString()}` : "—"}</div>
                  <div><span className="text-muted-foreground">Hire Date: </span>{employee.hire_date}</div>
                  <div><span className="text-muted-foreground">Manager: </span>{employee.manager ? `${employee.manager.first_name} ${employee.manager.last_name}` : "—"}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeoff">
            <Card>
              <CardHeader><CardTitle className="text-base">My Time Off ({timeOff.length})</CardTitle></CardHeader>
              <CardContent>
                {timeOff.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No time-off requests</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeOff.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="capitalize">{t.request_type}</TableCell>
                          <TableCell>{t.start_date}</TableCell>
                          <TableCell>{t.end_date}</TableCell>
                          <TableCell>{t.days}</TableCell>
                          <TableCell>
                            <Badge variant={t.status === "approved" ? "default" : t.status === "rejected" ? "destructive" : "secondary"} className="capitalize">
                              {t.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll">
            <Card>
              <CardHeader><CardTitle className="text-base">My Payroll Records ({payroll.length})</CardTitle></CardHeader>
              <CardContent>
                {payroll.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No payroll records</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Base Salary</TableHead>
                        <TableHead>Bonus</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead>Net Pay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payroll.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.pay_period_start} → {p.pay_period_end}</TableCell>
                          <TableCell>${p.base_salary.toLocaleString()}</TableCell>
                          <TableCell>${p.bonus.toLocaleString()}</TableCell>
                          <TableCell>${p.deductions.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">${p.net_pay.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default function SelfServicePage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
      <SelfServiceContent />
    </Suspense>
  );
}
