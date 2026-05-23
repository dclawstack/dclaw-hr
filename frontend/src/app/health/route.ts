import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${apiBase}/health`, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ status: "error", service: "health-check" }, { status: res.status });
    }

    return res;
  } catch (error) {
    return NextResponse.json(
      { status: "error", service: "health-check" },
      { status: 503 }
    );
  }
}
