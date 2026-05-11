"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listEmployees, listShoutouts, createShoutout, deleteShoutout, Employee, Shoutout } from "@/lib/api";
import { Heart, Plus, Trash2 } from "lucide-react";

export default function RecognitionPage() {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [ss, emps] = await Promise.all([listShoutouts(), listEmployees()]);
      setShoutouts(ss);
      setEmployees(emps);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!fromId || !toId || !message) { setError("All fields required"); return; }
    try {
      await createShoutout({ from_employee_id: fromId, to_employee_id: toId, message });
      setFromId(""); setToId(""); setMessage(""); setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteShoutout(id);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function initials(name: { first_name: string; last_name: string }) {
    return `${name.first_name[0]}${name.last_name[0]}`.toUpperCase();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Recognition</h1>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Give Shoutout"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Give a Shoutout</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Select value={fromId} onValueChange={setFromId}>
                    <SelectTrigger><SelectValue placeholder="Select sender" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Select value={toId} onValueChange={setToId}>
                    <SelectTrigger><SelectValue placeholder="Select recipient" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share what they did that was awesome..." required />
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
              <Button type="submit">Send Shoutout</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {shoutouts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              No shoutouts yet — be the first to recognize a colleague!
            </CardContent>
          </Card>
        )}
        {shoutouts.map((s) => (
          <Card key={s.id}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">{initials(s.from_employee)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {s.from_employee.first_name} {s.from_employee.last_name}
                    <span className="text-muted-foreground font-normal mx-1">→</span>
                    {s.to_employee.first_name} {s.to_employee.last_name}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{s.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(s.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
