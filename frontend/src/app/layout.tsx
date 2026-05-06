import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DClaw HR",
  description: "Resume screening, interview prep & onboarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
