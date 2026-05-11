import json
from uuid import UUID

import httpx
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.time_off_request import TimeOffRequest
from app.models.employee import Employee


async def _call_ai(prompt: str) -> str:
    if settings.openrouter_api_key:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.openrouter_api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.openrouter_model,
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": 300,
                    },
                )
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{settings.ollama_url}/api/chat",
                json={
                    "model": settings.ollama_model,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False,
                },
            )
            resp.raise_for_status()
            return resp.json()["message"]["content"]
    except Exception:
        return ""


def _parse_json_from_text(text: str) -> dict:
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        return {}
    try:
        return json.loads(text[start:end])
    except Exception:
        return {}


async def analyze_leave_trends(employee_id: UUID, db: AsyncSession) -> dict:
    result = await db.execute(
        select(TimeOffRequest).where(
            TimeOffRequest.employee_id == employee_id,
            TimeOffRequest.status == "approved",
        ).order_by(TimeOffRequest.start_date)
    )
    requests = result.scalars().all()

    if not requests:
        return {
            "risk_level": "low",
            "pattern_summary": "No approved time-off history found.",
            "recommendation": "Encourage the employee to take time off when needed.",
        }

    summary_lines = [
        f"{r.request_type}: {r.start_date.strftime('%Y-%m')} ({r.days}d)"
        for r in requests
    ]
    prompt = (
        "You are an HR analytics assistant. Analyze the following leave history and assess burnout risk.\n\n"
        f"Leave history: {', '.join(summary_lines)}\n\n"
        "Respond ONLY with valid JSON:\n"
        '{"risk_level": "low|medium|high", "pattern_summary": "...", "recommendation": "..."}'
    )

    raw = await _call_ai(prompt)
    parsed = _parse_json_from_text(raw)

    if parsed:
        risk_level = parsed.get("risk_level", "low")
        if risk_level not in ("low", "medium", "high"):
            risk_level = "low"
        return {
            "risk_level": risk_level,
            "pattern_summary": parsed.get("pattern_summary", "Analysis based on leave patterns."),
            "recommendation": parsed.get("recommendation", "Monitor employee wellbeing."),
        }

    total_days = sum(r.days for r in requests)
    risk = "high" if total_days > 30 else "medium" if total_days > 15 else "low"
    return {
        "risk_level": risk,
        "pattern_summary": f"Took {total_days} approved days across {len(requests)} requests.",
        "recommendation": "Review leave patterns during the next 1-on-1.",
    }


async def benchmark_salary(employee_id: UUID, db: AsyncSession) -> dict:
    emp_result = await db.execute(select(Employee).where(Employee.id == employee_id))
    employee = emp_result.scalar_one_or_none()

    if not employee or not employee.salary:
        return {
            "market_position": "at",
            "recommendation": "No salary data available for benchmarking.",
        }

    dept_result = await db.execute(
        select(func.min(Employee.salary), func.max(Employee.salary), func.avg(Employee.salary)).where(
            Employee.department == employee.department,
            Employee.salary.isnot(None),
        )
    )
    row = dept_result.one()
    dept_min, dept_max, dept_avg = row

    prompt = (
        f"You are an HR compensation analyst. An employee in '{employee.department}' earns "
        f"${employee.salary:,.0f}/year. Dept stats: min=${dept_min:,.0f}, max=${dept_max:,.0f}, avg=${dept_avg:,.0f}.\n\n"
        "Respond ONLY with valid JSON:\n"
        '{"market_position": "below|at|above", "recommendation": "..."}'
    )

    raw = await _call_ai(prompt)
    parsed = _parse_json_from_text(raw)

    if parsed:
        position = parsed.get("market_position", "at")
        if position not in ("below", "at", "above"):
            position = "at"
        return {
            "market_position": position,
            "recommendation": parsed.get("recommendation", "Salary appears competitive."),
        }

    position = "at"
    if dept_avg:
        if employee.salary < dept_avg * 0.9:
            position = "below"
        elif employee.salary > dept_avg * 1.1:
            position = "above"
    return {
        "market_position": position,
        "recommendation": f"Salary ${employee.salary:,.0f} vs dept avg ${dept_avg or 0:,.0f}.",
    }
