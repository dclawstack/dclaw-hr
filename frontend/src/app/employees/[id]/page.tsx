"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEmployee, listTimeOff, listPayroll, Employee, TimeOffRequest, PayrollRecord } from "@/lib/api";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeOff, setTimeOff] = useState<TimeOffRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getEmployee(id),
      listTimeOff({ employee_id: id }),
      listPayroll({ employee_id: id }),
    ])
      .then(([e, to, pr]) => {
        setEmployee(e);
        setTimeOff(to);
        setPayroll(pr);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!employee) return <div className="text-slate-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {employee.first_name} {employee.last_name}
        </h1>
        <Link href={`/employees/${id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {employee.department}
        </Badge>
        <Badge variant={employee.status === "active" ? "default" : "destructive"} className="capitalize">
          {employee.status}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
        <div>Email: {employee.email}</div>
        <div>Phone: {employee.phone || "—"}</div>
        <div>Job Title: {employee.job_title}</div>
        <div>Salary: {employee.salary ? `$${employee.salary.toLocaleString()}` : "—"}</div>
        <div>Hire Date: {employee.hire_date}</div>
        <div>Manager: {employee.manager ? `${employee.manager.first_name} ${employee.manager.last_name}` : "—"}</div>
      </div>

      <Tabs defaultValue="timeoff" className="w-full">
        <TabsList>
          <TabsTrigger value="timeoff">Time Off</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        <TabsContent value="timeoff">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Time Off History</CardTitle>
            </CardHeader>
            <CardContent>
              {timeOff.length === 0 ? (
                <div className="text-sm text-slate-500">No time-off requests</div>
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
                          <Badge
                            variant={
                              t.status === "approved"
                                ? "default"
                                : t.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                            className="capitalize"
                          >
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
            <CardHeader>
              <CardTitle className="text-base">Payroll Records</CardTitle>
            </CardHeader>
            <CardContent>
              {payroll.length === 0 ? (
                <div className="text-sm text-slate-500">No payroll records</div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
