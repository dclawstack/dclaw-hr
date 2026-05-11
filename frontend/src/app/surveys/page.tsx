"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { listEmployees, getSurveySummary, listSurveys, createSurvey, deleteSurvey, Employee, Survey, SurveySummary } from "@/lib/api";
import { Trash2 } from "lucide-react";

export default function SurveysPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [summary, setSummary] = useState<SurveySummary | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [score, setScore] = useState("7");
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [emps, sums, survs] = await Promise.all([listEmployees(), getSurveySummary(), listSurveys()]);
      setEmployees(emps);
      setSummary(sums);
      setSurveys(survs);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId) { setError("Select an employee"); return; }
    try {
      await createSurvey({ employee_id: employeeId, score: parseInt(score), comment: comment || undefined });
      setEmployeeId(""); setScore("7"); setComment(""); setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSurvey(id);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const npsColor = summary
    ? summary.avg_score >= 8 ? "text-primary" : summary.avg_score >= 5 ? "text-secondary-foreground" : "text-destructive"
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">eNPS Surveys</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "Submit Survey"}
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Average eNPS Score</CardTitle></CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${npsColor}`}>
                {summary.avg_score.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 10</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.response_count}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Submit eNPS Response</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Score (1–10): How likely are you to recommend this workplace?</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Comment (optional)</Label>
                <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What can we improve?" />
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
              <Button type="submit">Submit Response</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">All Responses ({surveys.length})</CardTitle></CardHeader>
        <CardContent>
          {surveys.length === 0 ? (
            <div className="text-sm text-muted-foreground">No survey responses yet</div>
          ) : (
            <div className="space-y-3">
              {surveys.map((s) => (
                <div key={s.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={s.score >= 8 ? "default" : s.score >= 5 ? "secondary" : "destructive"}>
                        {s.score}/10
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(s.submitted_at).toLocaleDateString()}</span>
                    </div>
                    {s.comment && <p className="text-sm text-muted-foreground mt-1">{s.comment}</p>}
                  </div>
                  <button onClick={() => handleDelete(s.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
