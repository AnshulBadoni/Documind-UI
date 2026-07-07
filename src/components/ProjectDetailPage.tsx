"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  StarIcon,
  ExternalLinkIcon,
  RouteIcon,
  CubeIcon,
  DatabaseIcon2,
  HomeIcon,
  FolderIcon,
  CheckCircleIcon,
  GearIcon,
  SparkleSmallIcon,
  BookOpenIcon,
} from "@/components/icons";

import ProjectSwitcher from "@/components/ProjectSwitcher";
import { type Project, getTechIcon, projectSuggestions } from "@/lib/data";
import { useAuth } from "@/lib/useAuth";
import { apiRequest } from "@/lib/api";
import Header from "./Header";

function getTechStackForProject(
  name: string,
  description: string = "",
): { name: string; icon: string }[] {
  const combined = (name + " " + description).toLowerCase();
  const tech = [];
  if (combined.includes("typescript") || combined.includes("ts")) {
    tech.push({ name: "TypeScript", icon: "/typescript.svg" });
  }
  if (
    combined.includes("node") ||
    combined.includes("express") ||
    combined.includes("javascript") ||
    combined.includes("js")
  ) {
    tech.push({ name: "Node.js", icon: "/nodejs.svg" });
  }
  if (combined.includes("mongo")) {
    tech.push({ name: "MongoDB", icon: "/mongo.svg" });
  }
  if (combined.includes("redis")) {
    tech.push({ name: "Redis", icon: "/redis.svg" });
  }
  if (
    combined.includes("postgres") ||
    combined.includes("pgsql") ||
    combined.includes("postgresql")
  ) {
    tech.push({ name: "PostgreSQL", icon: "/pgsql.svg" });
  }
  if (
    combined.includes("python") ||
    combined.includes("django") ||
    combined.includes("fastapi")
  ) {
    tech.push({ name: "Python", icon: "/python.svg" });
  }
  if (combined.includes("kafka")) {
    tech.push({ name: "Kafka", icon: "/kafka.svg" });
  }
  if (combined.includes("mysql")) {
    tech.push({ name: "MySQL", icon: "/mysql.svg" });
  }
  if (tech.length === 0) {
    tech.push({ name: "JavaScript", icon: "/javascript.svg" });
  }
  return tech;
}

const archNodes = [
  { name: "Client", color: "default" },
  { name: "API (Express)", color: "green" },
  { name: "Services", color: "blue" },
  { name: "Redis", color: "red" },
  { name: "MongoDB", color: "green" },
  { name: "Janus", color: "blue" },
];

const changes = [
  {
    type: "add" as const,
    title: "Added EmotionService",
    desc: "New service for emotion detection and analysis",
    time: "2h ago",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    type: "update" as const,
    title: "Updated MeetingService",
    desc: "Refactored meeting creation flow and added Redis caching",
    time: "1d ago",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    type: "doc" as const,
    title: "New Redis Cache Layer",
    desc: "Added caching for room and participant state",
    time: "2d ago",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    type: "doc" as const,
    title: "Documentation regenerated",
    desc: "Knowledge base updated",
    time: "2d ago",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
];

const statColor: Record<string, string> = {
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
};

// --- Small reusable icons ---
function ChevronRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function PlusIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function RefreshIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
      <path d="M13.5 3.5V7h-3.5" />
    </svg>
  );
}

function ClockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function NetworkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <path d="M12 8v4M9.5 14.5L6.5 17.5M14.5 14.5l3 3" />
    </svg>
  );
}

function BranchIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="4" cy="4" r="1.5" />
      <circle cx="12" cy="4" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <path d="M4 5.5v5M4 5.5c0 2 2 2 4 2s4 0 4-2" />
    </svg>
  );
}

function DashedArrow() {
  return (
    <div className="flex items-center px-1">
      <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
        <path
          d="M0 6h28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="text-slate-300 dark:text-neutral-600"
        />
        <path
          d="M26 3l3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-300 dark:text-neutral-600"
        />
      </svg>
    </div>
  );
}

const archNodeStyle: Record<string, string> = {
  default:
    "border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",
  green:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
  blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400",
  red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400",
};

const changeIconStyle: Record<string, string> = {
  add: "bg-blue-50 text-blue-500",
  update: "bg-emerald-50 text-emerald-500",
  doc: "bg-orange-50 text-orange-500",
};

const getUserIdFromToken = (): number | null => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // Replace base64url characters and add padding
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const decoded = JSON.parse(atob(padded));
    return Number(decoded.sub);
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.0"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export default function ProjectDetailPage() {
  const { loading: authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const projectIdStr = pathname.split("/")[2] || "";

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    danger?: boolean;
  }>({
    show: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const isOwner = project && project.owner_id === getUserIdFromToken();

  const handleDeleteProject = () => {
    if (!project) return;
    setConfirmModal({
      show: true,
      title: "Delete Project",
      description: `Are you sure you want to delete the project "${project.name}"? This action cannot be undone and will permanently delete all related documents, chat history, and analysis results.`,
      danger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, show: false }));
        try {
          const { apiRequest } = await import("@/lib/api");
          const res = await apiRequest(`/projects/${project.id}`, {
            method: "DELETE",
          });
          if (res.status === 200) {
            showToast("Project deleted successfully", "success");
            setTimeout(() => router.push("/project"), 1000);
          } else {
            showToast(res.message || "Failed to delete project", "error");
          }
        } catch (err) {
          console.error("Failed to delete project", err);
          showToast("An error occurred while deleting the project", "error");
        }
      }
    });
  };

  const handleShareProject = async () => {
    if (!project) return;
    const targetIdentity = window.prompt(
      "Enter the username or email of the account to share this project with:",
    );
    if (!targetIdentity || !targetIdentity.trim()) return;

    try {
      const { apiRequest } = await import("@/lib/api");
      const res = await apiRequest(`/projects/${project.id}/share`, {
        method: "POST",
        body: JSON.stringify({ target_identity: targetIdentity.trim() }),
      });
      if (res.status === 200) {
        showToast(`Project successfully shared with "${targetIdentity.trim()}"`, "success");
      } else {
        showToast(res.message || "Failed to share project", "error");
      }
    } catch (err) {
      console.error("Failed to share project", err);
      showToast("An error occurred while sharing the project", "error");
    }
  };

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [techStack, setTechStack] = useState<{ name: string; icon: string }[]>(
    [],
  );
  const [docStats, setDocStats] = useState<any[]>([
    {
      icon: RouteIcon,
      label: "Routes",
      value: "0",
      sub: "endpoints documented",
      color: "indigo" as const,
    },
    {
      icon: CubeIcon,
      label: "Services",
      value: "0",
      sub: "services analyzed",
      color: "emerald" as const,
    },
    {
      icon: DatabaseIcon2,
      label: "Models",
      value: "0",
      sub: "models documented",
      color: "sky" as const,
    },
    {
      icon: HomeIcon,
      label: "Classes",
      value: "0",
      sub: "classes structured",
      color: "orange" as const,
    },
    {
      icon: FolderIcon,
      label: "Functions",
      value: "0",
      sub: "functions analyzed",
      color: "violet" as const,
    },
    {
      icon: FolderIcon,
      label: "File Structure",
      value: "0",
      sub: "files analyzed",
      color: "amber" as const,
    },
  ]);
  const [syncing, setSyncing] = useState(false);
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docsCount, setDocsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!projectIdStr) return;
      try {
        setLoading(true);
        const projectRes = await apiRequest(`/projects/${projectIdStr}`);
        if (projectRes.status === 200 && projectRes.data) {
          const p = projectRes.data;
          const mappedProject: Project = {
            id: String(p.id),
            name: p.name,
            owner_id: p.owner_id,
            stack: p.technology_stack || [
              p.repository_url ? "Git Repo" : "Local Codebase",
            ],
            repository_url: p.repository_url || "",
            branch: "main",
            synced: "Just now",
            files: "Analyzed",
            color: "indigo",
            project_type: p.project_type || "backend",
            stats: p.stats || {},
          };
          setProject(mappedProject);

          // Map technologies directly from technology_stack
          const mappedTech = (p.technology_stack || []).map((t: string) => {
            return { name: t, icon: getTechIcon(t) };
          });
          setTechStack(mappedTech);
        }

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
            color: ["emerald", "indigo", "violet", "sky"][idx % 4] || "indigo",
          }));
          setProjectsList(mapped);
        }

        const docRes = await apiRequest(`/projects/${projectIdStr}/documents`);
        if (docRes.status === 200 && Array.isArray(docRes.data)) {
          setDocsCount(docRes.data.length);
        }
      } catch (err) {
        console.error("Failed to load project details", err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, projectIdStr]);

  // Dynamically compute stats cards based on selected project type
  useEffect(() => {
    if (!project) return;
    const s = project.stats || {};
    const pt = (project.project_type || "backend").toLowerCase();

    const cards = [];

    // Always show Files & Lines of Code as core metrics
    cards.push({
      icon: FolderIcon,
      label: "File Structure",
      value: String(s.files ?? 0),
      sub: "files analyzed",
      color: "amber" as const,
    });

    cards.push({
      icon: FolderIcon,
      label: "Functions",
      value: String(s.functions ?? 0),
      sub: "functions analyzed",
      color: "violet" as const,
    });

    if (pt === "frontend" || pt === "mobile") {
      cards.unshift(
        {
          icon: RouteIcon,
          label: "Pages",
          value: String(s.pages ?? 0),
          sub: "pages documented",
          color: "indigo" as const,
        },
        {
          icon: CubeIcon,
          label: "Components",
          value: String(s.components ?? 0),
          sub: "components analyzed",
          color: "emerald" as const,
        },
      );
    } else if (pt === "ml_ai") {
      cards.unshift(
        {
          icon: DatabaseIcon2,
          label: "Datasets",
          value: String(s.datasets ?? 0),
          sub: "datasets processed",
          color: "emerald" as const,
        },
        {
          icon: HomeIcon,
          label: "Models",
          value: String(s.models ?? 0),
          sub: "ML models structured",
          color: "indigo" as const,
        },
      );
    } else {
      // backend / fullstack
      cards.unshift(
        {
          icon: RouteIcon,
          label: "Routes",
          value: String(s.routes ?? 0),
          sub: "endpoints documented",
          color: "indigo" as const,
        },
        {
          icon: CubeIcon,
          label: "Services",
          value: String(s.services ?? 0),
          sub: "services analyzed",
          color: "emerald" as const,
        },
        {
          icon: DatabaseIcon2,
          label: "Models",
          value: String(s.models ?? 0),
          sub: "models documented",
          color: "sky" as const,
        },
      );
    }

    setDocStats(cards);
  }, [project]);

  const handleSelectProject = (p: Project) => {
    router.push(`/project/${p.id}`);
  };

  async function handleSync() {
    if (!project) return;
    const confirmSync = window.confirm(
      "Are you sure you want to resync? This will re-clone the repository, delete all existing documentation, chunks, and database models, and perform a complete fresh regeneration.",
    );
    if (!confirmSync) return;

    setSyncing(true);
    try {
      const res = await apiRequest(`/projects/${project.id}/analysis-runs`, {
        method: "POST",
        body: JSON.stringify({ force_regenerate: true }),
      });
      if (res.status === 201) {
        alert(
          "Full project resync and regeneration triggered successfully in the background! Please allow a few minutes for completion.",
        );
      } else {
        alert(res.message || "Failed to trigger resync.");
      }
    } catch (err) {
      console.error(err);
      alert("Error triggering project resync.");
    } finally {
      setSyncing(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-neutral-200">
          Project Not Found
        </h2>
        <Link
          href="/project"
          className="mt-3 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* ===== Top bar ===== */}
      <Header
        project={project}
        onSelectProject={handleSelectProject}
        projectsList={projectsList}
      />

      {/* ===== Body ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-2">
            {/* Title & Type */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white">
                  {project.name}
                </h1>
                {/* Repo link */}
                <a
                  href="#"
                  className="mt-1 inline-flex items-center gap-1 text-[13px] text-blue-600 hover:underline"
                >
                  {project.repository_url}
                </a>
              </div>

              <div className="flex items-center gap-3">
                {/* Resync Button */}
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-2 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-[13px] font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshIcon
                    className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`}
                  />
                  <span>{syncing ? "Resyncing..." : "Resync Project"}</span>
                </button>

                {/* Project Type Dropdown */}
                <div className="flex items-center gap-2 px-3.5 py-2">
                  <select
                    value={project.project_type || "backend"}
                    onChange={async (e) => {
                      const newType = e.target.value;
                      try {
                        const { apiRequest } = await import("@/lib/api");
                        const res = await apiRequest(
                          `/projects/${project.id}`,
                          {
                            method: "PUT",
                            body: JSON.stringify({ project_type: newType }),
                          },
                        );
                        if (res.status === 200 && res.data) {
                          const updated = {
                            ...project,
                            project_type: res.data.project_type,
                            stats: res.data.stats || project.stats,
                          };
                          setProject(updated);
                        } else {
                          alert(res.message || "Failed to update project type");
                        }
                      } catch (err) {
                        console.error("Failed to update project type", err);
                        alert("Error updating project type");
                      }
                    }}
                    className="rounded-sm border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-[13px] font-medium text-slate-700 dark:text-neutral-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="ml_ai">ML/AI</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>

                {/* Delete & Share Buttons */}
                {isOwner && (
                  <>
                    <button
                      onClick={handleShareProject}
                      className="flex items-center gap-2 rounded-md bg-blue-50/50 dark:bg-neutral-900 px-3.5 py-2 text-[13px] font-semibold text-blue-600 dark:text-blue-400 transition hover:bg-blue-100/50 dark:hover:bg-blue-950/40 cursor-pointer"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      className="flex items-center gap-2 rounded-md  bg-red-50/50 dark:bg-neutral-900 px-3.5 py-2 text-[13px] font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-100/50 dark:hover:bg-red-950/40 cursor-pointer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="my-3 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
              {project.name} is a Node.js and TypeScript backend responsible for
              meeting creation, participant management, Redis caching, Janus
              integration, and post-processing workflows.
            </p>

            {/* Tech badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {techStack.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium ring-1 bg-slate-50 text-slate-600 dark:bg-neutral-900 dark:text-neutral-300 ring-slate-100 dark:ring-neutral-800"
                >
                  <img
                    src={t.icon}
                    className="h-3.5 w-3.5 object-contain"
                    alt={t.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/javascript.svg";
                    }}
                  />
                  <span>{t.name}</span>
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-10 flex flex-wrap gap-2.5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2 text-[13px] font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400 dark:hover:bg-violet-950/60"
              >
                <SparkleSmallIcon className="h-4 w-4" />
                Ask AI
              </Link>
              <Link
                href={`/project/${project.id}/documentation`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <BookOpenIcon className="h-4 w-4" />
                View Documentation
              </Link>
              <Link
                href={`/project/${project.id}/architecture`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <NetworkIcon className="h-4 w-4" />
                Explore Architecture
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <ClockIcon className="h-4 w-4" />
                View Changes
              </Link>
            </div>

            {/* Documentation */}
            <div className="mt-16">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Documentation
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {docStats.map((stat, index) => (
                  <Link
                    href="#"
                    key={index}
                    className="group flex items-center gap-3 rounded-xl bg-white p-3.5 transition hover:border-blue-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-800"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${statColor[stat.color]}`}
                    >
                      {React.createElement(stat.icon, {
                        className: "h-4 w-4",
                      })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-medium text-slate-500 dark:text-neutral-400">
                        {stat.label}
                      </div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-neutral-500">
                        {stat.sub}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:text-blue-500 dark:text-neutral-600 dark:group-hover:text-blue-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Right Sidebar ===== */}
        <div className="w-[340px] scroll-thin shrink-0 bg-white dark:bg-neutral-950 overflow-y-auto p-5">
          {/* Recent Changes */}
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-900 dark:text-white text-[14px]">
              Recent Changes
            </div>
            <Link
              href="#"
              className="text-[12px] font-medium text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-3 space-y-4">
            {changes.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${changeIconStyle[c.type]}`}
                >
                  {c.type === "add" && <PlusIcon className="h-3 w-3" />}
                  {c.type === "update" && <RefreshIcon className="h-3 w-3" />}
                  {c.type === "doc" && <BookOpenIcon className="h-3 w-3" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-slate-800 dark:text-neutral-200 text-[13px] leading-tight">
                      {c.title}
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400 dark:text-neutral-500">
                      {c.time}
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-500 dark:text-neutral-400 mt-0.5 leading-snug">
                    {c.desc}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <img
                      src={c.avatar}
                      alt=""
                      className="h-5 w-5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="#"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:underline"
          >
            View all changes
            <ChevronRight className="h-3 w-3" />
          </Link>

          {/* Suggested Questions */}
          <div className="mt-7">
            <div className="font-semibold text-slate-900 dark:text-white text-[14px]">
              Suggested Questions
            </div>
            <p className="text-[12px] text-slate-500 dark:text-neutral-400 mt-0.5">
              Ask anything about your codebase
            </p>

            <div className="mt-2.5 space-y-1.5">
              {(
                (project &&
                  projectSuggestions[project.project_type || "backend"]) ||
                projectSuggestions["backend"]
              )
                .slice(0, 5)
                .map((s, i) => (
                  <Link
                    key={i}
                    href="/"
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-blue-800 dark:hover:text-blue-400"
                  >
                    <span className="truncate">{s.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-blue-400 ml-2 shrink-0" />
                  </Link>
                ))}
            </div>
          </div>

          {/* Knowledge Base Health */}
          <div className="mt-7 rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="font-semibold text-slate-900 dark:text-white text-[14px]">
              Knowledge Base Health
            </div>
            <div className="mt-0.5 text-[12px] font-medium text-emerald-600">
              Everything looks great!
            </div>

            <div className="mt-4 flex items-center gap-4">
              {/* Large progress circle */}
              <div className="relative h-20 w-20 shrink-0">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 52 52">
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                  />
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="4"
                    strokeDasharray="127.5 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold text-slate-900 dark:text-white">
                    92%
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-neutral-500 leading-none">
                    Coverage
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 space-y-2">
                {docStats.slice(0, 3).map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400">
                      <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                      {s.label}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-neutral-200">
                      {s.value} / {s.value}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400">
                    <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                    Up to date
                  </span>
                  <span className="font-medium text-slate-800 dark:text-neutral-200">
                    Just now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
