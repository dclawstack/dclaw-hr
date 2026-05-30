type Health = { status: string; service: string };

const BACKEND_URL = process.env.API_URL || "http://localhost:8097";

export const dynamic = "force-dynamic";

export default async function HealthPage() {
  let health: Health | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${BACKEND_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    health = await res.json();
  } catch (e) {
    error = e instanceof Error ? e.message : "unknown error";
  }

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">Service Health</h1>
      {error || !health ? (
        <p className="text-sm text-destructive">Health probe failed: {error ?? "no response"}</p>
      ) : (
        <>
          <p className="text-sm">
            Service: <span className="font-mono">{health.service}</span>
          </p>
          <p className="text-sm">
            Status: <span className="font-mono">{health.status}</span>
          </p>
        </>
      )}
    </div>
  );
}
