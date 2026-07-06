"use client";

import React from "react";
import ProjectSwitcher from "@/components/ProjectSwitcher";
import { ThemeToggle } from "@/components/ThemeProvider";
import { type Project } from "@/lib/data";

// ---------- Inline Icons ----------
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

// ---------- Component Props ----------
interface HeaderProps {
  project: Project | null;
  onSelectProject: (project: Project) => void;
  projectsList: Project[];
  onShareClick?: () => void;
  onHistoryClick?: () => void;
}

// ---------- Header Component ----------
export default function Header({
  project,
  onSelectProject,
  projectsList,
  onShareClick,
  onHistoryClick,
}: HeaderProps) {
  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between bg-white dark:bg-neutral-950 px-6 transition-colors">
      {/* Left: Project Switcher */}
      <ProjectSwitcher
        selected={project}
        onSelect={onSelectProject}
        projectsList={projectsList}
      />

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/*<button
          type="button"
          onClick={onHistoryClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 transition hover:bg-slate-50 dark:hover:bg-neutral-800 active:scale-[0.98]"
          title="View history"
        >
          <HistoryIcon className="h-[17px] w-[17px]" />
        </button>*/}

        <ThemeToggle />
      </div>
    </header>
  );
}
