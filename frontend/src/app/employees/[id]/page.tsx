"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getEmployee, listTimeOff, listPayroll, updateEmployee,
  getTimeOffBalance, getLeaveAnalysis, getSalaryBenchmark,
  Employee, TimeOffRequest, PayrollRecord, TimeOffBalance, LeaveAnalysis, SalaryBenchmark,
} from "@/lib/api";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeOff, setTimeOff] = useState<TimeOffRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [balance, setBalance] = useState<TimeOffBalance | null>(null);
  const [analysis, setAnalysis] = useState<LeaveAnalysis | null>(null);
  const [benchmark, setBenchmark] = useState<SalaryBenchmark | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getEmployee(id),
      listTimeOff({ employee_id: id }),
      listPayroll({ employee_id: id }),
      getTimeOffBalance(id),
    ])
      .then(([e, to, pr, bal]) => {
        setEmployee(e);
        setTimeOff(to);
        setPayroll(pr);
        setBalance(bal);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleStatusToggle() {
    if (!employee) return;
    const newStatus = employee.status === "terminated" ? "active" : "terminated";
    setActionLoading(true);
    try {
      const updated = await updateEmployee(id, { status: newStatus });
      setEmployee(updated);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionLoading(false);
      setShowConfirm(false);
    }
  }

  async function handleRunAnalysis() {
    setAnalysisLoading(true);
    try {
      const result = await getLeaveAnalysis(id);
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function handleBenchmarkSalary() {
    setBenchmarkLoading(true);
    try {
      const result = await getSalaryBenchmark(id);
      setBenchmark(result);
      setShowBenchmarkDialog(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBenchmarkLoading(false);
    }
  }

  if (error) return <div className="text-destructive">{error}</div>;
  if (!employee) return <div className="text-muted-foreground">Loading...</div>;

  const riskColor = analysis
    ? analysis.risk_level === "high" ? "destructive" : analysis.risk_level === "medium" ? "secondary" : "default"
    : "secondary";

  const positionColor = benchmark
    ? benchmark.market_position === "above" ? "default" : benchmark.market_position === "below" ? "destructive" : "secondary"
    : "secondary";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {employee.first_name} {employee.last_name}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" disabled={benchmarkLoading} onClick={handleBenchmarkSalary}>
            {benchmarkLoading ? "Analyzing..." : "Benchmark Salary"}
          </Button>
          <Link href={`/employees/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          {employee.status !== "terminated" ? (
            <Button variant="destructive" onClick={() => setShowConfirm(true)}>Terminate</Button>
          ) : (
            <Button variant="outline" disabled={actionLoading} onClick={handleStatusToggle}>Reinstate</Button>
          )}
        </div>

        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader><DialogTitle>Terminate Employee</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to terminate{" "}
              <span className="font-semibold text-foreground">{employee.first_name} {employee.last_name}</span>?
              This can be reversed by reinstating them later.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant="destructive" disabled={actionLoading} onClick={handleStatusToggle}>
                {actionLoading ? "Processing..." : "Terminate"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showBenchmarkDialog} onOpenChange={setShowBenchmarkDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>Salary Benchmark</DialogTitle></DialogHeader>
            {benchmark && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Market Position:</span>
                  <Badge variant={positionColor} className="capitalize">{benchmark.market_position}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{benchmark.recommendation}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="capitalize">{employee.department}</Badge>
        <Badge variant={employee.status === "active" ? "default" : "destructive"} className="capitalize">{employee.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="analysis">Leave Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="timeoff">
          <Card>
            <CardHeader><CardTitle className="text-base">Time Off History</CardTitle></CardHeader>
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

        <TabsContent value="balance">
          <Card>
            <CardHeader><CardTitle className="text-base">Time Off Balance ({balance?.year})</CardTitle></CardHeader>
            <CardContent>
              {!balance ? (
                <div className="text-sm text-muted-foreground">Loading balance...</div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: "Vacation", used: balance.vacation_used, allocated: balance.vacation_allocated },
                    { label: "Sick", used: balance.sick_used, allocated: balance.sick_allocated },
                  ].map(({ label, used, allocated }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span className="text-muted-foreground">{used} / {allocated} days used</span>
                      </div>
                      <div className="bg-muted rounded-full h-2 w-full">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(100, (used / allocated) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{allocated - used} days remaining</div>
                    </div>
                  ))}
                  <div className="text-sm pt-2">
                    <span className="text-muted-foreground">Personal days used: </span>
                    <span>{balance.personal_used}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader><CardTitle className="text-base">Payroll Records</CardTitle></CardHeader>
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
                        <TableCell>${p.net_pay.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Leave Trend Analysis
                <Button size="sm" disabled={analysisLoading} onClick={handleRunAnalysis}>
                  {analysisLoading ? "Analyzing..." : "Run Analysis"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!analysis ? (
                <div className="text-sm text-muted-foreground">Click "Run Analysis" to analyze leave patterns using AI.</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Risk Level:</span>
                    <Badge variant={riskColor as any} className="capitalize">{analysis.risk_level}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Pattern Summary</p>
                    <p className="text-sm text-muted-foreground">{analysis.pattern_summary}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Recommendation</p>
                    <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
