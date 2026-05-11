"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listEmployees, listGoals, createGoal, updateGoal, deleteGoal, Employee, Goal } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  completed: "secondary",
  cancelled: "destructive",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [progress, setProgress] = useState("0");
  const [dueDate, setDueDate] = useState("");

  async function load() {
    try {
      const [gs, emps] = await Promise.all([
        listGoals(filterStatus !== "all" ? { status: filterStatus } : undefined),
        listEmployees(),
      ]);
      setGoals(gs);
      setEmployees(emps);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, [filterStatus]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createGoal({
        title,
        description: description || undefined,
        owner_id: ownerId || undefined,
        progress: parseInt(progress),
        due_date: dueDate || undefined,
      });
      setTitle(""); setDescription(""); setOwnerId(""); setProgress("0"); setDueDate("");
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleProgressChange(id: string, value: number) {
    try {
      await updateGoal(id, { progress: value });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateGoal(id, { status });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGoal(id);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">OKR / Goals</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Goal"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New Goal</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Goal title" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner (optional)</Label>
                  <Select value={ownerId} onValueChange={setOwnerId}>
                    <SelectTrigger><SelectValue placeholder="No owner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Company-wide</SelectItem>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Progress (%)</Label>
                  <Input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date (optional)</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
              <Button type="submit">Create Goal</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {goals.length === 0 && <div className="text-sm text-muted-foreground">No goals found</div>}
        {goals.map((g) => (
          <Card key={g.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{g.title}</span>
                    <Badge variant={statusVariant[g.status] || "secondary"} className="capitalize text-xs">{g.status}</Badge>
                  </div>
                  {g.description && <p className="text-xs text-muted-foreground">{g.description}</p>}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {g.owner && <span>Owner: {g.owner.first_name} {g.owner.last_name}</span>}
                    {g.due_date && <span>· Due: {g.due_date}</span>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{g.progress}%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2 w-full">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={g.progress}
                      onChange={(e) => handleProgressChange(g.id, parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={g.status} onValueChange={(v) => handleStatusChange(g.id, v)}>
                    <SelectTrigger className="w-32 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["active", "completed", "cancelled"].map((s) => (
                        <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button onClick={() => handleDelete(g.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
