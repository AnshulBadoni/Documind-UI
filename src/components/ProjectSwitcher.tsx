"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getProjectIcon, projects, type Project } from "@/lib/data";
import {
  ChevronDown,
  HexagonIcon,
  SearchIcon,
  PlusIcon,
  FolderIcon,
} from "@/components/icons";

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500",
  indigo: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
  violet: "bg-sky-50 dark:bg-sky-500/10 text-sky-500",
  sky: "bg-sky-50 dark:bg-sky-500/10 text-sky-500",
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m5 13 4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProjectSwitcher({
  selected,
  onSelect,
  projectsList = [],
}: {
  selected: Project | null;
  onSelect: (p: Project) => void;
  projectsList?: Project[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [internalList, setInternalList] = useState<Project[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projectsList.length === 0) {
      async function loadProjects() {
        try {
          const { apiRequest } = await import("@/lib/api");
          const listRes = await apiRequest("/projects");
          if (listRes.status === 200 && Array.isArray(listRes.data)) {
            const mapped = listRes.data.map((p: any, idx: number) => ({
              id: String(p.id),
              name: p.name,
              stack: p.technology_stack || [
                p.repository_url ? "Git Repo" : "Local Codebase",
              ],
              branch: "main",
              synced: "Synced",
              files: "Analyzed",
              color:
                ["emerald", "indigo", "violet", "sky"][idx % 4] || "indigo",
            }));
            setInternalList(mapped);
          }
        } catch (err) {
          console.error("Failed to load switcher projects list", err);
        }
      }
      loadProjects();
    }
  }, [projectsList]);

  const listToUse =
    projectsList.length > 0
      ? projectsList
      : internalList;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listToUse;
    return listToUse.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q)),
    );
  }, [query, listToUse]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  function choose(p: Project) {
    onSelect(p);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) choose(filtered[active]);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1 rounded-md px-2.5 text-left transition ${
          open
            ? "border-blue-300 dark:border-blue-500/40 text-blue-50/40 dark:bg-blue-500/10 ring-1 ring-blue-100 dark:ring-blue-500/20"
            : "border-slate-100 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"
        }`}
      >
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg `}>
          {/*<FolderIcon className="h-[18px] w-[18px]" />*/}
          <img
            src={getProjectIcon(selected?.stack || [])}
            alt="Project Image"
            className="h-[18px] w-[18px]"
          />
        </div>
        <div className="pr-1">
          <p className="text-[13.5px] font-semibold text-slate-800 dark:text-neutral-200">
            {selected ? selected.name : "Select Project..."}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 dark:text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-fade-up absolute left-0 top-[calc(100%+8px)] z-50 w-[320px] overflow-hidden rounded-xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <div className="border-b border-slate-100 dark:border-neutral-800 p-2.5">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-neutral-800 px-2.5 py-2">
              <SearchIcon className="h-[15px] w-[15px] text-slate-400 dark:text-neutral-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search projects..."
                className="w-full bg-transparent text-[13.5px] text-slate-700 dark:text-neutral-300 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="scroll-thin max-h-[300px] overflow-y-auto p-1.5">
            <p className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-slate-400 dark:text-neutral-500">
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </p>
            {filtered.length === 0 && (
              <p className="px-2.5 py-6 text-center text-[13px] text-slate-400 dark:text-neutral-500">
                No projects found
              </p>
            )}
            {filtered.map((p, i) => {
              const isSelected = selected ? p.id === selected.id : false;
              const isActive = i === active;
              return (
                <button
                  key={p.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(p)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition ${isActive ? "bg-slate-100 dark:bg-neutral-800" : "hover:bg-slate-50 dark:hover:bg-neutral-800/50"}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorMap[p.color]}`}
                  >
                    <img
                      src={getProjectIcon(p.stack)}
                      alt="Project Image"
                      className="h-[18px] w-[18px]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-slate-800 dark:text-neutral-200">
                      {p.name}
                    </p>
                    <p className="truncate text-[12px] text-slate-400 dark:text-neutral-500">
                      {p.stack} &nbsp;•&nbsp; {p.branch} &nbsp;•&nbsp; synced{" "}
                      {p.synced}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckIcon className="h-[18px] w-[18px] shrink-0 text-blue-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 dark:border-neutral-800 p-1.5">
            <button className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13.5px] font-medium text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-500/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-blue-300 dark:border-blue-500/40 text-blue-500">
                <PlusIcon className="size-4" />
              </span>
              Connect new project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
