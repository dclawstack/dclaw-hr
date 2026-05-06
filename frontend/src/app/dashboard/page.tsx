"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";

export default function DashboardPage() {
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("");
  const [results, setResults] = useState<{
    matchScore: number;
    strengths: string[];
    gaps: string[];
    interviewQuestions: string[];
  } | null>(null);

  const handleScreenResume = () => {
    const matchScore = Math.floor(Math.random() * 100) + 1;
    const strengths = ["Strong communication", "Relevant experience", "Team player"];
    const gaps = ["Limited leadership exp", "No cloud certification"];
    const interviewQuestions = [
      "Tell me about a time you led a project.",
      "How do you handle conflict in a team?",
      "What is your experience with cloud platforms?",
      "Describe a challenging bug you fixed.",
      "Where do you see yourself in 5 years?",
    ];

    setResults({
      matchScore,
      strengths,
      gaps,
      interviewQuestions,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <Users className="h-8 w-8 text-[#DB2777]" />
          <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Candidate Screening
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#DB2777] focus:outline-none focus:ring-1 focus:ring-[#DB2777]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Engineer"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#DB2777] focus:outline-none focus:ring-1 focus:ring-[#DB2777]"
                />
              </div>
              <button
                onClick={handleScreenResume}
                className="inline-flex w-full justify-center rounded-lg bg-[#DB2777] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Screen Resume
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Screening Results
            </h2>
            {results ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Match Score</p>
                  <p className="text-2xl font-bold text-[#DB2777]">
                    {results.matchScore}/100
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Strengths</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                    {results.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Gaps</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                    {results.gaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Interview Questions</p>
                  <ul className="mt-1 list-inside list-decimal text-sm text-gray-700">
                    {results.interviewQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Enter candidate details and click Screen Resume to see results.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
