"use client";

import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/lib/SidebarContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950 text-slate-900 dark:text-neutral-100">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
