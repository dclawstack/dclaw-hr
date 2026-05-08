"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listEmployees, Employee } from "@/lib/api";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

const departments = ["all", "engineering", "sales", "marketing", "hr", "finance", "operations"];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [error, setError] = useState("");

  useEffect(() => {
    listEmployees(dept === "all" ? undefined : { department: dept })
      .then(setEmployees)
      .catch((e) => setError(e.message));
  }, [dept]);

  const filtered = employees.filter(
    (e) =>
      e.first_name.toLowerCase().includes(search.toLowerCase()) ||
      e.last_name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.job_title.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employees</h1>
        <div className="flex items-center gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === "table" ? "default" : "outline"} size="icon" onClick={() => setView("table")}>
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Select value={dept} onValueChange={(v) => setDept(v || "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d === "all" ? "All Departments" : d.charAt(0).toUpperCase() + d.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <Link key={e.id} href={`/employees/${e.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="text-lg font-semibold">
                    {e.first_name} {e.last_name}
                  </div>
                  <div className="text-sm text-slate-500">{e.job_title}</div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-sm text-slate-600">{e.email}</div>
                  <Badge variant="secondary" className="capitalize">
                    {e.department}
                  </Badge>
                  <Badge variant={e.status === "active" ? "default" : "destructive"} className="ml-2 capitalize">
                    {e.status}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
          {filtered.length === 0 && <div className="text-slate-500">No employees found</div>}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="cursor-pointer">
                  <TableCell>
                    <Link href={`/employees/${e.id}`} className="font-medium hover:underline">
                      {e.first_name} {e.last_name}
                    </Link>
                  </TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell className="capitalize">{e.department}</TableCell>
                  <TableCell>{e.job_title}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === "active" ? "default" : "destructive"} className="capitalize">
                      {e.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
