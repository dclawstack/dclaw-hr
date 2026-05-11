"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, Banknote, Briefcase, Heart, Target, MessageSquare, UserCog, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Time Off", href: "/time-off", icon: CalendarDays },
  { name: "Payroll", href: "/payroll", icon: Banknote },
  { name: "Recruitment", href: "/recruitment", icon: Briefcase },
  { name: "Recognition", href: "/recognition", icon: Heart },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "1-on-1s", href: "/one-on-ones", icon: Video },
  { name: "Surveys", href: "/surveys", icon: MessageSquare },
  { name: "Self Service", href: "/self-service", icon: UserCog },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xl font-bold text-foreground">DClaw HR</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
