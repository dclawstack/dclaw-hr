"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plane, Clock, DollarSign } from "lucide-react";
import { getDashboard, DashboardData } from "@/lib/api";

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div className="text-slate-500">Loading...</div>;

  const stats = [
    { label: "Total Employees", value: data.total_employees, icon: Users },
    { label: "On Leave Today", value: data.on_leave_today, icon: Plane },
    { label: "Pending Approvals", value: data.pending_time_off, icon: Clock },
    { label: "Monthly Payroll", value: `$${data.monthly_payroll.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-slate-400" />
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
                <div className="text-sm text-slate-500">No employees yet</div>
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
                  <span className="text-sm">
                    {e.first_name} {e.last_name}
                  </span>
                  <span className="text-xs text-slate-500">{e.hire_date}</span>
                </div>
              ))}
              {data.recent_hires.length === 0 && (
                <div className="text-sm text-slate-500">No recent hires</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
