import Link from "next/link";
import { Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <Users className="h-16 w-16 text-[#DB2777]" />
        <h1 className="text-4xl font-bold tracking-tight text-[#DB2777]">
          DClaw HR
        </h1>
        <p className="text-lg text-gray-600">
          Resume screening, interview prep &amp; onboarding
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-lg bg-[#DB2777] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}
