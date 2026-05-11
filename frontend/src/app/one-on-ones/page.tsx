"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listEmployees, listOneOnOnes, createOneOnOne, updateOneOnOne, deleteOneOnOne, Employee, OneOnOne } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  scheduled: "secondary",
  completed: "default",
  cancelled: "destructive",
};

export default function OneOnOnesPage() {
  const [meetings, setMeetings] = useState<OneOnOne[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [managerId, setManagerId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [actionItems, setActionItems] = useState("");

  async function load() {
    try {
      const [ms, emps] = await Promise.all([listOneOnOnes(), listEmployees()]);
      setMeetings(ms);
      setEmployees(emps);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createOneOnOne({
        manager_id: managerId,
        employee_id: employeeId,
        scheduled_date: scheduledDate,
        notes: notes || undefined,
        action_items: actionItems || undefined,
      });
      setManagerId(""); setEmployeeId(""); setScheduledDate(""); setNotes(""); setActionItems("");
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateOneOnOne(id, { status });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteOneOnOne(id);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">1-on-1 Meetings</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Schedule Meeting"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New 1-on-1</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Manager</Label>
                  <Select value={managerId} onValueChange={setManagerId}>
                    <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={employeeId} onValueChange={setEmployeeId}>
                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agenda, topics to discuss..." />
              </div>
              <div className="space-y-2">
                <Label>Action Items</Label>
                <Input value={actionItems} onChange={(e) => setActionItems(e.target.value)} placeholder="Follow-up tasks..." />
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
              <Button type="submit" disabled={!managerId || !employeeId || !scheduledDate}>Schedule</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Meetings ({meetings.length})</CardTitle></CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <div className="text-sm text-muted-foreground">No meetings scheduled</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.manager.first_name} {m.manager.last_name}</TableCell>
                    <TableCell>{m.employee.first_name} {m.employee.last_name}</TableCell>
                    <TableCell>{m.scheduled_date}</TableCell>
                    <TableCell>
                      <Select value={m.status} onValueChange={(v) => handleStatusChange(m.id, v)}>
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["scheduled", "completed", "cancelled"].map((s) => (
                            <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{m.notes || "—"}</TableCell>
                    <TableCell>
                      <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
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
