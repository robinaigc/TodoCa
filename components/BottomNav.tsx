"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Navigation,
  MessageSquareText,
  User,
  type LucideIcon,
} from "lucide-react";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "今日", icon: LayoutDashboard },
  { href: "/tasks", label: "任务", icon: ListChecks },
  { href: "/scripts", label: "对照", icon: MessageSquareText },
  { href: "/map", label: "导航", icon: Navigation },
  { href: "/profile", label: "我的", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="nav-bar">
      <div className="mx-auto flex max-w-lg px-2 pt-1.5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition-colors ${
                active ? "font-semibold text-brand" : "font-medium text-text-secondary"
              }`}
            >
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={active ? 2.25 : 1.75}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.12 : 0}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
