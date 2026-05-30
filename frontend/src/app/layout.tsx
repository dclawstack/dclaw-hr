import type { Metadata } from "next";
import "./globals.css";
import { ConditionalLayout } from "@/components/conditional-layout";

export const metadata: Metadata = {
  title: "DClaw HR — AI-Powered HR Platform for Modern Teams",
  description:
    "Streamline employee management, automate HR workflows, and unlock AI-powered insights. Everything your HR team needs in one intelligent platform.",
  keywords: [
    "HR software",
    "employee management",
    "AI HR platform",
    "payroll software",
    "time-off management",
    "workforce management",
  ],
  openGraph: {
    title: "DClaw HR — AI-Powered HR Platform",
    description:
      "Streamline employee management, automate HR workflows, and unlock AI-powered insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
