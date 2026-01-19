"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  FolderKanban, 
  LogOut, 
  Settings as SettingsIcon,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/organizations", label: "Organizations", icon: Building2 },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
];

export function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar shrink-0 h-screen sticky top-0 flex flex-col z-20">
      <div className="p-6 border-b border-sidebar-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <motion.div 
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold"
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            T
          </motion.div>
          <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
            TaskFlow
          </h1>
        </Link>
      </div>

      <nav className="p-4 space-y-1 grow overflow-y-auto">
        {navItems.map((item) => {
          const active = isLinkActive(item.href);
          return (
            <Link key={item.href} href={item.href} className="block relative group">
              <div className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md transition-all relative z-10",
                active ? "text-primary font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent/10"
              )}>
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-4 h-4 transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {active && (
                   <motion.div layoutId="activeNav" className="absolute inset-0 bg-primary/10 rounded-md -z-10 border border-primary/20" />
                )}
                {active && <ChevronRight className="w-3 h-3" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border shrink-0 space-y-2 bg-sidebar/50">
        <div className="flex items-center gap-2 text-sm text-sidebar-foreground p-2 rounded-lg bg-background/50 border border-border/30">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
            {userEmail?.[0].toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-tight">{userEmail?.split('@')[0]}</p>
            <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
        
        <Link href="/auth/logout" className="block outline-none">
          <motion.button 
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 w-full text-xs text-muted-foreground hover:text-destructive p-2 rounded hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </motion.button>
        </Link>
      </div>
    </aside>
  );
}
