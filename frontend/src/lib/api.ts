export interface Candidate {
  id: string;
  name: string;
  role: string;
  match_score: number;
  status: string;
  created_at: string;
}

export interface InterviewQuestion {
  id: string;
  question_text: string;
  category: string;
  difficulty: string;
}

export async function api<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return (await res.json()) as T;
}
