"use client";

import { BarChart3, Inbox, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/common/lib/cn";

const navItems = [
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "대시보드",
  },
  {
    href: "/tickets",
    icon: Inbox,
    label: "고객 문의",
  },
  {
    href: "/deleted-tickets",
    icon: Trash2,
    label: "삭제된 문의",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-5">
      <p className="px-3 text-xs font-bold uppercase text-slate-500">
        Workspace
      </p>
      <ul className="mt-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white",
                  active && "bg-white text-ink hover:bg-white hover:text-ink",
                )}
                href={item.href}
              >
                <Icon
                  className={active ? "text-ink" : "text-slate-400"}
                  size={18}
                />
                <span className={active ? "text-ink" : "text-slate-400"}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
