"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  Target,
  Brain,
  Heart,
  MessageSquare,
  UserCog,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  BarChart2,
  Clock,
  Award,
  Sparkles,
  Activity,
  Star,
  Video,
  ArrowUpRight,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Features", "Platform", "Benefits", "FAQ", "Contact"];

const features = [
  {
    icon: Users,
    title: "Employee Directory",
    description:
      "Centralize employee data with searchable profiles, org charts, and full department management at scale.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    tag: "Core HR",
  },
  {
    icon: Calendar,
    title: "Time-Off Management",
    description:
      "Automated leave requests, manager approvals, and real-time balance tracking with a full calendar view.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Workforce",
  },
  {
    icon: DollarSign,
    title: "Payroll Processing",
    description:
      "Auto-calculate net pay with zero errors, run CSV exports, and maintain complete payroll history.",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    tag: "Finance",
  },
  {
    icon: Briefcase,
    title: "Recruitment Pipeline",
    description:
      "Track candidates from screening to offer. Status management, notes, and hiring analytics built in.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "Talent",
  },
  {
    icon: Target,
    title: "Goals & OKRs",
    description:
      "Set, track, and visualize individual and team objectives with live progress indicators.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    tag: "Performance",
  },
  {
    icon: Brain,
    title: "AI Leave Analysis",
    description:
      "Machine learning analyzes 12-month patterns to predict burnout risk before it becomes a crisis.",
    color: "text-violet-300",
    bg: "bg-violet-400/10",
    tag: "AI",
  },
  {
    icon: Heart,
    title: "Recognition Feed",
    description:
      "Foster culture with public peer shoutouts, achievements, and team recognition across the org.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    tag: "Culture",
  },
  {
    icon: MessageSquare,
    title: "Engagement Surveys",
    description:
      "Measure satisfaction with eNPS pulse surveys, response trend tracking, and actionable insights.",
    color: "text-purple-300",
    bg: "bg-purple-400/10",
    tag: "Engagement",
  },
  {
    icon: UserCog,
    title: "Self-Service Portal",
    description:
      "Empower employees to view profiles, submit time-off, and review payroll — without admin access.",
    color: "text-fuchsia-300",
    bg: "bg-fuchsia-400/10",
    tag: "Employee",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Onboard Your Team",
    desc: "Import employees from CSV or add manually. Set up departments, roles, and reporting structures in minutes.",
    icon: Users,
    gradient: "from-violet-600 to-purple-600",
    glow: "shadow-violet-500/30",
  },
  {
    step: "02",
    title: "Automate Workflows",
    desc: "Configure leave policies, payroll schedules, and approval chains. Let DClaw HR handle the repetitive work.",
    icon: Zap,
    gradient: "from-purple-600 to-fuchsia-600",
    glow: "shadow-purple-500/30",
  },
  {
    step: "03",
    title: "Get AI Insights",
    desc: "Our AI engine analyzes workforce data and delivers proactive recommendations on burnout risk and salary equity.",
    icon: Brain,
    gradient: "from-fuchsia-600 to-pink-600",
    glow: "shadow-fuchsia-500/30",
  },
];

const aiCapabilities = [
  {
    icon: TrendingUp,
    title: "Leave Trend Analysis",
    desc: "AI analyzes 12-month leave patterns to predict burnout risk and surface recommendations before problems escalate.",
    badge: "Predictive",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    badgeBg: "bg-violet-500/15 text-violet-300",
  },
  {
    icon: BarChart2,
    title: "Salary Benchmarking",
    desc: "Compare compensation against department averages. Know instantly whether pay is below, at, or above market.",
    badge: "Real-time",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    badgeBg: "bg-purple-500/15 text-purple-300",
  },
  {
    icon: Activity,
    title: "Engagement Scoring",
    desc: "Track eNPS trends over time and receive AI-generated recommendations to improve morale and reduce attrition.",
    badge: "Automated",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    badgeBg: "bg-fuchsia-500/15 text-fuchsia-300",
  },
];

const benefits = [
  "Save 10+ hours per week on administrative HR tasks",
  "AI-powered insights for smarter workforce decisions",
  "Reduce time-to-hire with a structured recruitment pipeline",
  "Improve employee retention with engagement tools",
  "Automated payroll calculations with zero manual errors",
  "Real-time visibility into team performance and OKRs",
  "Streamline compliance with complete audit trails",
  "Scale from 10 to 10,000+ employees seamlessly",
];

const faqs = [
  {
    q: "Is DClaw HR suitable for small and mid-size businesses?",
    a: "Yes. DClaw HR scales from teams of 10 to enterprises with 10,000+ employees. The platform grows with your organization without complex configuration or expensive consulting.",
  },
  {
    q: "How does the AI salary benchmarking work?",
    a: "Our AI analyzes each employee's compensation against department averages and provides clear recommendations on whether pay is below, at, or above market — helping you stay competitive and retain top talent.",
  },
  {
    q: "Can employees access their own information?",
    a: "Yes. The Self-Service Portal lets employees view their profile, submit time-off, check balances, and review payroll history — all without requiring admin privileges.",
  },
  {
    q: "Is there mobile support?",
    a: "DClaw HR is fully responsive across mobile, tablet, and desktop. Every screen — from the dashboard to employee profiles — is optimized for any device.",
  },
  {
    q: "How secure is our employee data?",
    a: "All data is encrypted in transit and at rest. DClaw HR runs on enterprise-grade PostgreSQL with role-based access controls, audit logging, and regular security reviews.",
  },
  {
    q: "Can we export payroll data for external accounting systems?",
    a: "Yes. One-click CSV export for payroll records is built in, filterable by employee, department, and pay period. Integration with popular accounting tools is also available.",
  },
];

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-[#06040f] text-white overflow-x-hidden">

      {/* ── Ambient glow orbs ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-80 -right-60 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)" }} />
        <div className="absolute top-[55%] -left-60 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,38,211,0.08) 0%, transparent 65%)" }} />
      </div>

      {/* ── Subtle dot grid ────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(167,139,250,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  NAVBAR                                                              */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-violet-900/20 bg-[#06040f]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[66px]">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30"
                style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}>
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-white">DClaw HR</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className="text-[13.5px] text-slate-400 hover:text-violet-300 transition-colors duration-150">
                  {item}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard"
                className="text-[13.5px] text-slate-400 hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-600/25"
                style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}>
                Get Started
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-400 hover:text-white transition-colors p-1">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-violet-900/20 bg-[#06040f]/98 px-4 py-5 space-y-1">
            {NAV_LINKS.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-slate-400 hover:text-violet-300 py-2.5 px-3 rounded-lg hover:bg-violet-500/5 transition-colors">
                {item}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/dashboard"
                className="block text-center text-sm text-slate-300 py-2.5 border border-violet-800/30 rounded-xl hover:bg-violet-500/5 transition-colors">
                Sign In
              </Link>
              <Link href="/dashboard"
                className="block text-center text-sm font-semibold text-white py-2.5 rounded-xl transition-colors"
                style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}>
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  HERO                                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="platform" className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* ── Left: Copy ──────────────────────────────────────────────── */}
            <div className="text-center lg:text-left">

              {/* Category badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-medium text-violet-300 mb-7 border border-violet-500/25"
                style={{ background: "rgba(124, 58, 237, 0.08)" }}>
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered HR Platform
                <ArrowRight className="w-3 h-3 opacity-60" />
              </div>

              {/* Headline */}
              <h1 className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.6rem] font-extrabold leading-[1.08] tracking-tight mb-6">
                Intelligent HR for{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #c084fc, #f0abfc)" }}>
                  Modern Teams
                </span>
              </h1>

              {/* Sub */}
              <p className="text-[1.05rem] text-slate-400 mb-9 max-w-[520px] mx-auto lg:mx-0 leading-[1.75]">
                Streamline employee management, automate HR workflows, and unlock AI-driven insights — everything your team needs in one unified platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <Link href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-violet-600/30"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}>
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#features"
                  className="inline-flex items-center justify-center gap-2 text-[14px] font-medium text-slate-300 hover:text-white px-7 py-3.5 rounded-xl border border-violet-800/30 hover:border-violet-600/40 bg-violet-500/5 hover:bg-violet-500/10 transition-all">
                  Explore Features
                </a>
              </div>

              {/* Trust row */}
              <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
                {[
                  { icon: Shield, text: "Enterprise Security" },
                  { icon: Zap, text: "5-minute setup" },
                  { icon: Star, text: "4.9/5 on G2" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[12.5px] text-slate-500">
                    <Icon className="w-3.5 h-3.5 text-violet-600" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Dashboard mockup ──────────────────────────────────── */}
            <div className="relative">
              {/* Glow behind mockup */}
              <div className="absolute -inset-6 rounded-3xl opacity-40 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)" }} />

              <div className="relative rounded-2xl overflow-hidden border border-violet-800/20 shadow-2xl shadow-black/60"
                style={{ background: "#0c0a1a" }}>

                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-900/20"
                  style={{ background: "#0c0a1a" }}>
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 ml-3 h-6 rounded-md flex items-center px-3"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <span className="text-[11px] text-slate-500">app.dclaw-hr.vercel.app/dashboard</span>
                  </div>
                </div>

                {/* App UI */}
                <div className="flex" style={{ height: "390px" }}>

                  {/* Sidebar */}
                  <div className="w-44 flex-shrink-0 p-3 border-r border-violet-900/20">
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[11.5px] font-bold text-white">DClaw HR</span>
                    </div>
                    {[
                      { label: "Dashboard", active: true },
                      { label: "Employees", active: false },
                      { label: "Time Off", active: false },
                      { label: "Payroll", active: false },
                      { label: "Goals", active: false },
                    ].map((item) => (
                      <div key={item.label}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] mb-0.5 ${item.active ? "text-violet-300" : "text-slate-600"}`}
                        style={item.active ? { background: "rgba(124,58,237,0.18)" } : {}}>
                        <div className={`w-3 h-3 rounded-sm ${item.active ? "bg-violet-400" : "bg-slate-700"}`} />
                        {item.label}
                      </div>
                    ))}
                  </div>

                  {/* Main */}
                  <div className="flex-1 p-4 overflow-hidden">
                    <p className="text-[11.5px] font-semibold text-white mb-3">Overview</p>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { label: "Employees", value: "248", color: "text-violet-300", bg: "rgba(124,58,237,0.12)" },
                        { label: "On Leave", value: "12", color: "text-amber-400", bg: "rgba(245,158,11,0.1)" },
                        { label: "Pending", value: "5", color: "text-orange-400", bg: "rgba(249,115,22,0.1)" },
                        { label: "Payroll", value: "$482K", color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg p-2" style={{ background: s.bg }}>
                          <p className="text-[10px] text-slate-500">{s.label}</p>
                          <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart + AI */}
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <div className="col-span-3 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <p className="text-[10px] text-slate-500 mb-1">Dept Breakdown</p>
                        <div className="flex items-end gap-1 h-14">
                          {[55, 42, 72, 35, 60, 48, 80].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-sm"
                              style={{ height: `${h}%`, background: ["#7c3aed","#9333ea","#a855f7","#c084fc","#d946ef","#e879f9","#f0abfc"][i], opacity: 0.8 }} />
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <p className="text-[10px] text-slate-500 mb-2">AI Insights</p>
                        <div className="space-y-1.5">
                          {["Low Burnout Risk", "At Market Salary", "87% Engaged"].map((t, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                              <span className="text-[10px] text-slate-400">{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <p className="text-[10px] text-slate-500 mb-1.5">Recent Activity</p>
                      <div className="space-y-1">
                        {[
                          { t: "Sarah Chen joined Engineering", d: "2h ago" },
                          { t: "Marcus Lee approved time-off", d: "4h ago" },
                          { t: "Q2 payroll run completed", d: "1d ago" },
                        ].map((a, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 truncate">{a.t}</span>
                            <span className="text-[10px] text-slate-600 ml-2 flex-shrink-0">{a.d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  STATS BAR                                                           */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <div className="border-y border-violet-900/15" style={{ background: "rgba(124,58,237,0.04)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Employees Managed", icon: Users },
              { value: "99.9%", label: "Payroll Accuracy", icon: DollarSign },
              { value: "10+ hrs", label: "Weekly Admin Saved", icon: Clock },
              { value: "Real-time", label: "AI-Powered Insights", icon: Brain },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <Icon className="w-5 h-5 text-violet-500 mx-auto mb-2 opacity-80" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  FEATURES                                                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-medium text-violet-400 mb-5 border border-violet-700/25"
              style={{ background: "rgba(124,58,237,0.07)" }}>
              <Zap className="w-3.5 h-3.5" />
              Full-Stack HR Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[2.8rem] font-bold mb-5 leading-tight">
              Complete HR in{" "}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg,#a78bfa,#c084fc)" }}>
                One Platform
              </span>
            </h2>
            <p className="text-[1.05rem] text-slate-400 max-w-2xl mx-auto leading-relaxed">
              From hiring to retirement, manage every aspect of your workforce with tools purpose-built for modern HR teams.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="group relative rounded-2xl p-6 border border-violet-900/20 hover:border-violet-700/35 transition-all duration-200 cursor-default"
                  style={{ background: "rgba(255,255,255,0.025)" }}>

                  {/* Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex w-10 h-10 rounded-xl ${f.bg} items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <span className="text-[10.5px] font-medium text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/15">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at top left, rgba(124,58,237,0.05) 0%, transparent 60%)" }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  PRODUCT OVERVIEW                                                    */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-violet-900/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-medium text-purple-400 mb-6 border border-purple-700/25"
                style={{ background: "rgba(147,51,234,0.07)" }}>
                <Activity className="w-3.5 h-3.5" />
                Product Tour
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Powerful Tools,{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#c084fc,#e879f9)" }}>
                  Intuitive Interface
                </span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                DClaw HR brings every HR tool into one cohesive platform. No more context-switching between a dozen separate systems — everything lives in one place, working together.
              </p>

              <div className="space-y-3">
                {[
                  { title: "Employee Lifecycle Management", desc: "Onboarding to offboarding — profiles, org charts, history", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
                  { title: "Automated HR Workflows", desc: "Leave approvals, payroll runs, and smart notifications", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { title: "AI-Powered Analytics", desc: "Leave trends, salary benchmarks, and engagement scores", icon: Brain, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
                  { title: "1-on-1 Meeting Tracker", desc: "Log manager check-ins with notes and follow-up actions", icon: Video, color: "text-pink-400", bg: "bg-pink-500/10" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title}
                      className="flex items-start gap-4 p-4 rounded-xl border border-violet-900/20 hover:border-violet-700/30 transition-all"
                      style={{ background: "rgba(255,255,255,0.025)" }}>
                      <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{item.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual cards */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-30 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(147,51,234,0.25) 0%, transparent 70%)" }} />
              <div className="relative space-y-3">

                {/* Employee table card */}
                <div className="rounded-2xl border border-violet-800/20 p-4" style={{ background: "#0c0a1a" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Employee Directory</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full text-violet-300 border border-violet-700/30"
                      style={{ background: "rgba(124,58,237,0.12)" }}>248 employees</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Sarah Chen", role: "Senior Engineer", dept: "Engineering", active: true },
                      { name: "Marcus Lee", role: "Product Manager", dept: "Product", active: true },
                      { name: "Emily Watson", role: "HR Director", dept: "HR", active: false },
                    ].map((emp) => (
                      <div key={emp.name} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.035)" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                          {emp.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white">{emp.name}</div>
                          <div className="text-[11px] text-slate-500">{emp.role} · {emp.dept}</div>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${emp.active ? "text-emerald-400 bg-emerald-500/15" : "text-amber-400 bg-amber-500/15"}`}>
                          {emp.active ? "Active" : "On Leave"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time-off card */}
                <div className="rounded-2xl border border-violet-800/20 p-4" style={{ background: "#0c0a1a" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Pending Approvals</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full text-orange-400 bg-orange-500/15 border border-orange-700/20">5 pending</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "James Park", type: "Vacation", period: "Jun 15–20", days: 5 },
                      { name: "Ana Rivera", type: "Sick Leave", period: "Jun 8–9", days: 2 },
                    ].map((req) => (
                      <div key={req.name} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.035)" }}>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white">{req.name}</div>
                          <div className="text-[11px] text-slate-500">{req.type} · {req.period} ({req.days}d)</div>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="px-2.5 py-1 rounded-lg text-[11px] text-emerald-400 bg-emerald-500/15 cursor-pointer hover:bg-emerald-500/25 transition-colors font-medium">Approve</div>
                          <div className="px-2.5 py-1 rounded-lg text-[11px] text-red-400 bg-red-500/15 cursor-pointer hover:bg-red-500/25 transition-colors font-medium">Reject</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals card */}
                <div className="rounded-2xl border border-violet-800/20 p-4" style={{ background: "#0c0a1a" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Q2 OKR Progress</span>
                    <span className="text-[11px] text-slate-500">3 active goals</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Reduce time-to-hire", pct: 72 },
                      { label: "Improve eNPS score", pct: 48 },
                      { label: "Complete salary review", pct: 91 },
                    ].map((g) => (
                      <div key={g.label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">{g.label}</span>
                          <span className="text-violet-400 font-medium">{g.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)" }}>
                          <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: "linear-gradient(90deg,#7c3aed,#c084fc)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  WORKFLOW / HOW IT WORKS                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-violet-900/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              Up and Running in{" "}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg,#a78bfa,#c084fc)" }}>
                Minutes
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              Designed for rapid deployment. No lengthy onboarding, no complex configuration, no dedicated IT team required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-16 left-[33%] right-[33%] h-px border-t border-dashed border-violet-800/40" />

            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step}
                  className="flex flex-col items-center text-center p-8 rounded-2xl border border-violet-900/20 hover:border-violet-700/35 transition-all"
                  style={{ background: "rgba(255,255,255,0.025)" }}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-xl ${step.glow}`}
                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                    data-gradient={step.gradient}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="text-[10.5px] font-bold text-violet-600 mb-2 tracking-[0.15em] uppercase">Step {step.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  AI SECTION                                                          */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-violet-900/15 relative overflow-hidden">
        {/* AI section background tint */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(109,40,217,0.08) 0%, transparent 60%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* AI capability cards */}
            <div className="space-y-4 order-2 lg:order-1">
              {aiCapabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title}
                    className="flex gap-4 p-5 rounded-2xl border border-violet-900/20 hover:border-violet-700/35 transition-all"
                    style={{ background: "rgba(255,255,255,0.025)" }}>
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-semibold text-white text-sm">{item.title}</span>
                        <span className={`text-[10.5px] px-2 py-0.5 rounded-full ${item.badgeBg}`}>{item.badge}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: copy + AI result mockup */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-medium text-fuchsia-400 mb-6 border border-fuchsia-700/25"
                style={{ background: "rgba(192,38,211,0.07)" }}>
                <Brain className="w-3.5 h-3.5" />
                AI-Powered Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                HR Decisions Backed{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#e879f9,#a78bfa)" }}>
                  by Data
                </span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Stop guessing. DClaw HR&apos;s AI engine continuously analyzes workforce data to surface hidden patterns and deliver proactive recommendations before problems become crises.
              </p>

              {/* AI result card */}
              <div className="rounded-2xl border border-violet-700/25 p-5" style={{ background: "rgba(109,40,217,0.08)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-semibold text-white">AI Analysis · James Park</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <span className="text-xs text-slate-400">Burnout Risk Level</span>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">Medium</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <span className="text-xs text-slate-400">Salary vs. Market</span>
                    <span className="text-xs font-semibold text-violet-400 px-2.5 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.15)" }}>At Market</span>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-[11px] text-slate-500 mb-1.5">AI Recommendation</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Employee has taken 8 sick days in Q2 vs. a 2-day team average. Schedule a 1-on-1 to discuss workload and wellbeing proactively.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  BENEFITS                                                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="benefits" className="py-24 md:py-32 border-t border-violet-900/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Why Teams{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#a78bfa,#c084fc)" }}>
                  Choose DClaw HR
                </span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Built for HR teams who need a platform that keeps pace with growth, integrates AI seamlessly, and doesn&apos;t require a 3-month implementation project to get started.
              </p>
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-white px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-violet-600/25"
                style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                Get Started Today
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  FAQ                                                                 */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 md:py-32 border-t border-violet-900/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg,#a78bfa,#c084fc)" }}>
                Questions
              </span>
            </h2>
            <p className="text-slate-400">
              Everything you need to know.{" "}
              <a href="#contact" className="text-violet-400 hover:text-violet-300 transition-colors">
                Still have questions? Contact us.
              </a>
            </p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-violet-900/20 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-violet-500/5 transition-colors">
                  <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-violet-900/20">
                    <p className="pt-4 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  CONTACT / CTA                                                       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 md:py-32 border-t border-violet-900/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl border border-violet-700/20 p-10 sm:p-14 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(147,51,234,0.06) 100%)" }}>

            {/* Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)" }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-medium text-violet-300 mb-6 border border-violet-600/25"
                style={{ background: "rgba(124,58,237,0.1)" }}>
                <Award className="w-3.5 h-3.5" />
                Get Started Today
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Transform Your{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#a78bfa,#e879f9)" }}>
                  HR Operations
                </span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto">
                Join thousands of HR teams who manage their workforce smarter, faster, and with AI-powered confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  suppressHydrationWarning
                  className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all border border-violet-800/30 focus:border-violet-600/50"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <Link href="/dashboard"
                  className="inline-flex items-center justify-center text-sm font-semibold text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/25 whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                  Get Started Free
                </Link>
              </div>
              <p className="text-xs text-slate-600 mt-4">No credit card required · Free up to 25 employees</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  FOOTER                                                              */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-violet-900/15 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">

            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/25"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-[17px]">DClaw HR</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                AI-powered HR platform for modern teams. Manage your workforce smarter, faster, and with confidence.
              </p>
            </div>

            {[
              { heading: "Product", links: ["Features", "Pricing", "Changelog", "API Docs", "Roadmap"] },
              { heading: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
              { heading: "Resources", links: ["Documentation", "Help Center", "Community", "Status", "Security"] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-500 hover:text-violet-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-violet-900/15">
            <p className="text-sm text-slate-600">© 2026 DClaw HR. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                <a key={link} href="#" className="text-sm text-slate-600 hover:text-violet-400 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
