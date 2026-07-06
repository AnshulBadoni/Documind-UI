"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/useAuth";
import { apiRequest } from "@/lib/api";
import { getProjectIcon, getTechIcon, type Project } from "@/lib/data";
import CreateProjectModal from "@/components/CreateProjectModal";
import Header from "./Header";

// ---------- Crisp SaaS Icons ----------
const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <Icon
    className={className}
    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
  />
);
const RepoIcon = ({ className }: { className?: string }) => (
  <Icon
    className={className}
    d="M20 19V7a2 2 0 00-2-2h-5l-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2z"
  />
);
const FileIcon = ({ className }: { className?: string }) => (
  <Icon
    className={className}
    d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M14 2v5h5"
  />
);
const ApiIcon = ({ className }: { className?: string }) => (
  <Icon className={className} d="M13 10V3L4 14h7v7l9-11h-7z" />
);
const DocIcon = ({ className }: { className?: string }) => (
  <Icon
    className={className}
    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  />
);
const PlusIcon = ({ className }: { className?: string }) => (
  <Icon className={className} d="M12 4v16m8-8H4" />
);
const ChevronDown = ({ className }: { className?: string }) => (
  <Icon className={className} d="M19 9l-7 7-7-7" />
);
const FilterIcon = ({ className }: { className?: string }) => (
  <Icon className={className} d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25" />
);

// ---------- Safe Data Parsing ----------
function formatCount(value: any) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return !Number.isNaN(num) ? num.toLocaleString() : null;
}

function formatRelativeTime(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = date.getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  for (const [unit, seconds] of units) {
    if (abs >= seconds || unit === "second")
      return rtf.format(Math.round(diffSeconds / seconds), unit);
  }
  return null;
}

type NormalizedStatus =
  "indexed" | "syncing" | "importing" | "needs-update" | null;

interface ProjectCard {
  id: string;
  name: string;
  description: string;
  repo: string;
  category: "Git Repository" | "Local Project";
  tech: string[];
  status: NormalizedStatus;
  lastAnalyzed: string | null;
  files: number | null;
  apis: number | null;
  docs: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

type FilterType = "all" | "indexed" | "syncing";
type SortType = "updated" | "name" | "size";

export default function ProjectListPage() {
  const { loading: authLoading } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [projectsList, setProjectsList] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("updated");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setShowSortDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await apiRequest("/projects");
        if (res.status === 200 && Array.isArray(res.data)) {
          const mapped: ProjectCard[] = res.data.map((p: any) => {
            let statsObj = p.stats;
            if (typeof statsObj === "string") {
              try {
                statsObj = JSON.parse(statsObj);
              } catch (e) {
                statsObj = null;
              }
            }

            return {
              id: String(p.id),
              name: p.name ?? "Untitled Project",
              description: p.description ?? "",
              repo: p.repository_url ?? "Unknown Source",
              category: p.repository_url?.startsWith("http")
                ? "Git Repository"
                : "Local Project",
              tech: Array.isArray(p.technology_stack) ? p.technology_stack : [],
              status: statsObj !== null ? "indexed" : "syncing",
              lastAnalyzed: p.updated_at ?? null,
              files: statsObj?.files ?? null,
              apis: statsObj?.routes ?? null,
              docs: statsObj?.pages ?? null,
              createdAt: p.created_at ?? null,
              updatedAt: p.updated_at ?? null,
            };
          });
          setProjectsList(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) loadProjects();
  }, [authLoading]);

  const filtered = useMemo(() => {
    let result = [...projectsList];
    if (activeFilter === "indexed")
      result = result.filter((p) => p.status === "indexed");
    if (activeFilter === "syncing")
      result = result.filter(
        (p) => p.status === "syncing" || p.status === "importing",
      );

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        [p.name, p.repo, ...p.tech].some((v) => v.toLowerCase().includes(q)),
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return (Number(b.files) || -1) - (Number(a.files) || -1);
        case "updated":
        default:
          return (
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime()
          );
      }
    });
    return result;
  }, [projectsList, query, activeFilter, sortBy]);

  const headerProjectsList: Project[] = useMemo(
    () =>
      projectsList.map((p) => ({
        id: p.id,
        name: p.name,
        stack: p.tech,
        branch: "—",
        synced: formatRelativeTime(p.lastAnalyzed) ?? "—",
        files: p.files != null ? `${formatCount(p.files)} files` : "—",
        color: "slate",
      })),
    [projectsList],
  );

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 font-sans">
      <Header
        project={null}
        onSelectProject={(selected) => router.push(`/project/${selected.id}`)}
        projectsList={headerProjectsList}
        onShareClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
          } catch {}
        }}
        onHistoryClick={() => {}}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Repositories
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and analyze your codebase architecture, APIs, and
              documentation.
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
            >
              <PlusIcon className="h-4 w-4" />
              Add Repository
            </button>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full rounded-md py-2 pl-9 pr-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-neutral-900 dark:text-white dark:ring-gray-800 dark:focus:ring-blue-500"
              placeholder="Search repositories..."
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800">
              {(["all", "indexed", "syncing"] as const).map((filter, idx) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium focus:z-10 transition-colors ${
                    idx === 0 ? "rounded-l-md" : ""
                  } ${idx === 2 ? "rounded-r-md" : ""} ${
                    activeFilter === filter
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-neutral-900 dark:text-gray-400 dark:hover:bg-gray-800/50"
                  } ${idx !== 0 ? "-ml-px" : ""}`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:text-gray-300 dark:ring-gray-800 dark:hover:bg-gray-800/50"
              >
                <FilterIcon className="h-4 w-4 text-gray-400" />
                Sort
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:ring-gray-800">
                  <div className="py-1">
                    {[
                      { key: "updated", label: "Recently Updated" },
                      { key: "name", label: "Alphabetical" },
                      { key: "size", label: "Largest Size" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => {
                          setSortBy(item.key as SortType);
                          setShowSortDropdown(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          sortBy === item.key
                            ? "text-blue-600 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Cards Grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-800 p-12 text-center">
              <RepoIcon className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                No projects found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new repository to your workspace.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <PlusIcon className="mr-1.5 h-4 w-4" /> Add Repository
                </button>
              </div>
            </div>
          ) : (
            filtered.map((p) => (
              <Link
                key={p.id}
                href={`/project/${p.id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300 dark:bg-neutral-900 dark:ring-gray-800 dark:hover:ring-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                        <img
                          src={getProjectIcon(p.tech)}
                          alt={p.name}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold leading-6 text-gray-900 dark:text-white">
                          {p.name}
                        </h3>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {p.repo.replace(
                            /^https?:\/\/(www\.)?github\.com\//,
                            "",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800/50 dark:text-gray-300 dark:ring-gray-700/50"
                      >
                        <img src={getTechIcon(t)} alt="" className="h-3 w-3" />
                        {t}
                      </span>
                    ))}
                    {p.tech.length > 4 && (
                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-500">
                        +{p.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {p.description && (
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800/60 dark:bg-[#111113]">
                  <dl className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <dt className="text-xs font-medium text-gray-500">
                        Files
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCount(p.files) ?? "—"}
                      </dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-xs font-medium text-gray-500">
                        APIs
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCount(p.apis) ?? "—"}
                      </dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-xs font-medium text-gray-500">
                        Docs
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCount(p.docs) ?? "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
