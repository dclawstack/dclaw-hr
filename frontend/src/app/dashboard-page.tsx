"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plane, Clock, DollarSign, CheckCircle, XCircle, X } from "lucide-react";
import { getDashboard, updateTimeOff, DashboardData } from "@/lib/api";

const SURVEY_BANNER_KEY = "dclaw_hr_survey_banner_dismissed";

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>("");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [showSurveyBanner, setShowSurveyBanner] = useState(false);

  function refresh() {
    getDashboard().then(setData).catch((e) => setError(e.message));
  }

  useEffect(() => {
    refresh();
    const dismissed = localStorage.getItem(SURVEY_BANNER_KEY);
    if (!dismissed) setShowSurveyBanner(true);
  }, []);

  function dismissSurveyBanner() {
    localStorage.setItem(SURVEY_BANNER_KEY, "1");
    setShowSurveyBanner(false);
  }

  async function handleApproval(id: string, status: "approved" | "rejected") {
    setPendingActionId(id);
    try {
      await updateTimeOff(id, { status });
      refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPendingActionId(null);
    }
  }

  if (error) return <div className="text-destructive">{error}</div>;
  if (!data) return <div className="text-muted-foreground">Loading...</div>;

  const stats = [
    { label: "Total Employees", value: data.total_employees, icon: Users },
    { label: "On Leave Today", value: data.on_leave_today, icon: Plane },
    { label: "Pending Approvals", value: data.pending_time_off, icon: Clock },
    { label: "Monthly Payroll", value: `$${data.monthly_payroll.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {showSurveyBanner && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Share your feedback</p>
                <p className="text-xs text-muted-foreground mt-0.5">How likely are you to recommend this workplace? Take a 30-second pulse survey.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/surveys">
                  <Button size="sm" variant="default">Take Survey</Button>
                </Link>
                <button onClick={dismissSurveyBanner} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(data.department_breakdown).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{dept}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {Object.keys(data.department_breakdown).length === 0 && (
                <div className="text-sm text-muted-foreground">No employees yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Hires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recent_hires.map((e) => (
                <div key={e.id} className="flex items-center justify-between">
                  <span className="text-sm">{e.first_name} {e.last_name}</span>
                  <span className="text-xs text-muted-foreground">{e.hire_date}</span>
                </div>
              ))}
              {data.recent_hires.length === 0 && (
                <div className="text-sm text-muted-foreground">No recent hires</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {data.pending_approvals.length === 0 ? (
            <div className="text-sm text-muted-foreground">No pending requests</div>
          ) : (
            <div className="space-y-3">
              {data.pending_approvals.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{r.employee_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {r.request_type} · {r.start_date} → {r.end_date} · {r.days}d
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={pendingActionId === r.id}
                      onClick={() => handleApproval(r.id, "approved")}
                      className="text-primary hover:text-primary/80 disabled:opacity-50"
                      aria-label="Approve"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      disabled={pendingActionId === r.id}
                      onClick={() => handleApproval(r.id, "rejected")}
                      className="text-destructive hover:text-destructive/80 disabled:opacity-50"
                      aria-label="Reject"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
