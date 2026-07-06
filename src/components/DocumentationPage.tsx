"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { CubeIcon, RefreshIcon } from "./icons";
import Header from "./Header";
import { type Project } from "@/lib/data";
import { useAuth } from "@/lib/useAuth";
import { apiRequest, regenerateDocument, getApiBaseUrl } from "@/lib/api";
import MarkdownContent from "./Markdown";

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 6h11M19 6h1M4 12h3M11 12h9M4 18h7M15 18h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="6" r="2" fill="currentColor" />
      <circle cx="9" cy="12" r="2" fill="currentColor" />
      <circle cx="13" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function RoutesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.3 7.2 15.7 11M8.3 16.8 15.7 13"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function ControllerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H6a2 2 0 0 0-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ServicesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.3 7 12 12l8.7-5M12 22V12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse
        cx="12"
        cy="6"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function RepoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FlowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.3 8.4 15.6 11M8.3 15.6 15.6 13"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function PackageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 12 20 7.5M12 12v9M12 12 4 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PlugIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 22v-6M8 22v-6M16 22v-6M19 10a7 7 0 1 0-14 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 2v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function EnvIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 9h.01M11 9h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 13h.01M11 13h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function QueueIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 2 4.09 12.11a2 2 0 0 0 1.51 3.3H11V22l8.91-10.11a2 2 0 0 0-1.51-3.3H13V2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M10.3 4 3 17a2 2 0 0 0 1.7 3h14.6a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function TypeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7V4h16v3M9 20h6M12 4v16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function AIWorkspaceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3c.5 3.8 1.8 5.1 5.6 5.6-3.8.5-5.1 1.8-5.6 5.6-.5-3.8-1.8-5.1-5.6-5.6 3.8-.5 5.1-1.8 5.6-5.6Z"
        fill="currentColor"
      />
      <path d="m9 14-2 6 6-2 6-6-6 2-6 2Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
function ArchitectureIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2 2 7l10 5 10-5-10-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function ChangesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 7v10c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 13v3M12 16l3-3M12 16l-3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ================================================================
   TYPES
   ================================================================ */
interface Param {
  name: string;
  type: string;
  desc: string;
  required: boolean;
  defaultValue?: string;
  kind: "path" | "query";
}

interface Route {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  tags: string[];
  authRequired: boolean;
  responses: { code: number; label: string }[];
  params: Param[];
  body?: Record<string, { type: string; required: boolean; desc: string }>;
  sampleResponse: string;
}

interface DocRecord {
  id?: string;
  document_type: string;
  content: string;
  updated_at?: string;
}

/* ================================================================
   CONSTANTS
   ================================================================ */
const PAGE_SIZE = 6;
const METHOD_FILTERS = ["ALL", "GET", "POST", "PUT", "DELETE"] as const;

const methodColors: Record<string, string> = {
  GET: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  POST: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  PUT: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  DELETE:
    "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  PATCH:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
};

const SECTION_META: Record<string, { title: string; description: string }> = {
  project_summary: {
    title: "Project Overview",
    description: "High-level summary of the project",
  },
  routes: {
    title: "API Routes",
    description: "HTTP endpoints exposed by the application",
  },
  controllers: {
    title: "Controllers",
    description: "Request handlers and controller logic",
  },
  services: {
    title: "Services",
    description: "Business logic services and utilities",
  },
  database_models: {
    title: "Data Models",
    description: "Database schemas, models and relationships",
  },
  repositories: {
    title: "Repositories",
    description: "Data access layer and repository pattern",
  },
  request_flow: {
    title: "Request Flow",
    description: "How requests flow through the system",
  },
  dependencies: {
    title: "Dependencies",
    description: "External libraries and package dependencies",
  },
  external_integrations: {
    title: "Integrations",
    description: "Third-party services and external APIs",
  },
  architecture: {
    title: "Architecture",
    description: "System architecture and design patterns",
  },
  auth_flow: {
    title: "Auth Flow",
    description: "Authentication and authorization flow",
  },
  environment_variables: {
    title: "Environment Variables",
    description: "Required configuration and environment variables",
  },
  cron_jobs: { title: "Cron Jobs", description: "Scheduled background tasks" },
  queues: { title: "Queues", description: "Message queues and job processing" },
  caching: {
    title: "Caching",
    description: "Caching strategies and implementations",
  },
  error_handling: {
    title: "Error Handling",
    description: "Error handling patterns and logging",
  },
  types_interfaces: {
    title: "Types & Interfaces",
    description: "TypeScript types and interfaces",
  },
  enums: { title: "Enums", description: "Enumerations and constant mappings" },
  configuration: {
    title: "Configuration",
    description: "Application configuration files",
  },
};

/* ================================================================
   ROUTE PARSER  (unchanged from your original)
   ================================================================ */
const strip = (s: string) => s.replace(/`/g, "").trim();

function parseTableAfter(
  block: string,
  markerRegex: RegExp,
): Record<string, string>[] {
  const markerMatch = block.match(markerRegex);
  if (!markerMatch || markerMatch.index === undefined) return [];
  const lines = block.slice(markerMatch.index).split("\n");
  let start = -1;
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    if (lines[i].trim().startsWith("|")) {
      start = i;
      break;
    }
  }
  if (start === -1) return [];
  const tableLines: string[] = [];
  for (let i = start; i < lines.length; i++) {
    if (lines[i].trim().startsWith("|")) tableLines.push(lines[i]);
    else break;
  }
  if (tableLines.length < 3) return [];
  const parseRow = (row: string) =>
    row
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
  const headers = parseRow(tableLines[0]).map((h) => strip(h).toLowerCase());
  return tableLines.slice(2).map((row) => {
    const cells = parseRow(row);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i] || "";
    });
    return obj;
  });
}

function httpLabel(code: number): string {
  const map: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    422: "Validation Error",
    500: "Internal Server Error",
  };
  return map[code] || "Response";
}
function parseRoutesFromMarkdown(md: string): Route[] {
  const routes: Route[] = [];
  const seen = new Set<string>();

  // Strategy 1: Parse heading format (## GET /path)
  const headingRe =
    /^#{2,4}\s+`?(GET|POST|PUT|DELETE|PATCH)\s+([^\s`]+)`?\s*$/gim;
  const headingMatches = [...md.matchAll(headingRe)];

  headingMatches.forEach((m, i) => {
    const method = m[1].toUpperCase() as Route["method"];
    const path = m[2];
    const key = `${method} ${path}`;
    if (seen.has(key)) return;
    seen.add(key);

    const start = (m.index || 0) + m[0].length;
    const end =
      i + 1 < headingMatches.length ? headingMatches[i + 1].index! : md.length;
    const block = md.slice(start, end);

    routes.push(parseRouteBlock(method, path, block));
  });

  // Strategy 2: Parse table format (| Method | Path | ...)
  // Look for tables that have Method/Path columns
  const tableRegex =
    /\| Method \| Path \| Description \|[\s\S]*?(?=\n#{1,4}|\n\n## |\n### |$)/g;
  const tableMatches = [...md.matchAll(tableRegex)];

  tableMatches.forEach((tableMatch) => {
    const tableBlock = tableMatch[0];
    const lines = tableBlock
      .split("\n")
      .filter((line) => line.trim().startsWith("|") && !line.includes("---"));

    // Skip header line (index 0)
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i]
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c);
      if (cells.length >= 3) {
        const method = cells[0]
          .replace(/`/g, "")
          .trim()
          .toUpperCase() as Route["method"];
        const path = cells[1].replace(/`/g, "").trim();
        const description = cells[2].replace(/`/g, "").trim();

        if (
          !method ||
          !path ||
          !["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)
        )
          continue;

        const key = `${method} ${path}`;
        if (seen.has(key)) continue;
        seen.add(key);

        // Look for context before this table (section description)
        const tableStart = tableMatch.index || 0;
        const precedingText = md.slice(
          Math.max(0, tableStart - 500),
          tableStart,
        );

        routes.push({
          method,
          path,
          description: description || extractSectionDescription(precedingText),
          tags: extractTags(precedingText, path),
          authRequired: /authMiddleware|Authentication|Protected/i.test(
            precedingText,
          ),
          responses: [{ code: 200, label: "OK" }], // Tables don't show response codes
          params: extractParamsFromPath(path),
          body: undefined,
          sampleResponse: "",
        });
      }
    }
  });

  return routes;
}

// Helper functions for table parsing
function extractSectionDescription(text: string): string {
  // Look for bold description or first sentence
  const descMatch = text.match(/\*\*Description\*\*:\s*(.+)/);
  if (descMatch) return descMatch[1].trim();

  const lines = text.split("\n").reverse();
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith("|") &&
      !trimmed.startsWith("#") &&
      trimmed.length > 10
    ) {
      return trimmed.replace(/\*\*/g, "").slice(0, 140);
    }
  }
  return "API endpoint";
}

function extractTags(text: string, path: string): string[] {
  const tags: string[] = [];
  const seg = path.split("/").filter(Boolean)[0] || "root";

  const tagMap: Record<string, string> = {
    auth: "Authentication",
    admin: "Admin",
    user: "User",
    study: "Studies",
    room: "Rooms",
    meeting: "Meetings",
    calendar: "Calendar",
    assignment: "Assignments",
    report: "Reports",
    drm: "DRM",
    support: "Support",
    autoscale: "Infrastructure",
    prometheus: "Observability",
  };

  if (tagMap[seg]) tags.push(tagMap[seg]);
  if (/authMiddleware|Authentication|Protected/i.test(text))
    tags.push("Auth Required");

  return tags.length ? tags : ["System"];
}

function extractParamsFromPath(path: string): Param[] {
  const params: Param[] = [];
  const matches = [...path.matchAll(/\{([^}]+)\}/g)];
  matches.forEach((match) => {
    params.push({
      name: match[1],
      type: "string",
      desc: "Path parameter",
      required: true,
      kind: "path",
    });
  });
  return params;
}

function parseRouteBlock(method: string, path: string, block: string): Route {
  // Your existing parsing logic for heading format
  const descMatch = block.match(/\*\*Description\*\*:\s*(.+)/);
  let description = descMatch ? descMatch[1].trim() : "";

  if (!description) {
    const firstLine = block
      .split("\n")
      .find(
        (l) =>
          l.trim() && !l.trim().startsWith("|") && !l.trim().startsWith("**"),
      );
    description = firstLine
      ? firstLine.replace(/`/g, "").trim().slice(0, 140)
      : "API endpoint";
  }
  description = description.replace(/\s*\(Identical to.*$/, "");

  const pathParamNames = [...path.matchAll(/\{([^}]+)\}/g)].map((x) => x[1]);
  const pathTable = parseTableAfter(block, /\*\*Path Parameters\*\*/i);
  const pathParams: Param[] = pathParamNames.map((name) => {
    const row = pathTable.find((r) => strip(r["parameter"] || "") === name);
    return {
      name,
      type: row ? strip(row["type"] || "str") : "str",
      desc: row ? row["description"] || "" : "Path parameter",
      required: true,
      kind: "path",
    };
  });

  const queryTable = parseTableAfter(block, /\*\*Query Parameters\*\*/i);
  const queryParams: Param[] = queryTable
    .map((r) => ({
      name: strip(r["parameter"] || r["field"] || ""),
      type: strip(r["type"] || "str"),
      desc: r["description"] || "",
      required: /yes/i.test(r["required"] || ""),
      defaultValue: strip(r["default"] || "") || undefined,
      kind: "query" as const,
    }))
    .filter((p) => p.name);

  const bodyTable = parseTableAfter(block, /\*\*Request Body\*\*/i);
  let body: Route["body"];
  if (bodyTable.length > 0) {
    body = {};
    bodyTable.forEach((r) => {
      const name = strip(r["field"] || r["parameter"] || "");
      if (!name) return;
      body![name] = {
        type: strip(r["type"] || "str"),
        required: /yes/i.test(r["required"] || ""),
        desc: r["description"] || "",
      };
    });
    if (Object.keys(body).length === 0) body = undefined;
  }

  const responses: { code: number; label: string }[] = [];
  const codeSet = new Set<number>();
  for (const rm of block.matchAll(/\*\*(\d{3})\s*([A-Za-z][A-Za-z ]*)?\*\*/g)) {
    const code = parseInt(rm[1], 10);
    if (!codeSet.has(code)) {
      codeSet.add(code);
      responses.push({
        code,
        label: (rm[2] || "").trim() || httpLabel(code),
      });
    }
  }
  if (responses.length === 0) responses.push({ code: 200, label: "OK" });
  responses.sort((a, b) => a.code - b.code);

  const jsonMatch = block.match(/```json([\s\S]*?)```/);
  const sampleResponse = jsonMatch ? jsonMatch[1].trim() : "";

  const seg = path.split("/").filter(Boolean)[0] || "root";
  const tagMap: Record<string, string> = {
    auth: "Authentication",
    db: "Database",
    backup: "Backup",
    settings: "Settings",
  };
  const tags = [tagMap[seg] || "System"];
  const authRequired = /Authentication\*?\*?:?\s*Required|auth_required/i.test(
    block,
  );
  if (authRequired) tags.push("Auth Required");

  return {
    method: method as Route["method"],
    path,
    description,
    tags,
    authRequired,
    responses,
    params: [...pathParams, ...queryParams],
    body,
    sampleResponse,
  };
}
const PAGE_SIZE_CONST = PAGE_SIZE; // alias to keep grep-friendly

export default function DocumentationPage() {
  const { loading: authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const projectIdStr = pathname.split("/")[2] || "";

  /* ---- state ---- */
  const [project, setProject] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<DocRecord[]>([]);
  const [activeSection, setActiveSection] = useState("routes");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] =
    useState<(typeof METHOD_FILTERS)[number]>("ALL");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const searchRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  /* ---- keyboard shortcut ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---- close filter dropdown ---- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* ---- data fetching ---- */
  useEffect(() => {
    if (authLoading || !projectIdStr) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const [projectRes, listRes, docsRes] = await Promise.all([
          apiRequest(`/projects/${projectIdStr}`),
          apiRequest("/projects"),
          apiRequest(`/projects/${projectIdStr}/documents`),
        ]);

        if (cancelled) return;

        if (projectRes.status === 200 && projectRes.data) {
          const p = projectRes.data;
          setProject({
            id: String(p.id),
            name: p.name,
            stack: p.technology_stack || [],
            branch: "main",
            synced: "Just now",
            files: "Analyzed",
            color: "indigo",
            project_type: p.project_type || "backend",
            stats: p.stats || {},
          });
        }

        if (listRes.status === 200 && Array.isArray(listRes.data)) {
          setProjectsList(
            listRes.data.map((p: any, idx: number) => ({
              id: String(p.id),
              name: p.name,
              stack: p.technology_stack || [],
              branch: "main",
              synced: "Synced",
              files: "Analyzed",
              color:
                ["emerald", "indigo", "violet", "sky"][idx % 4] || "indigo",
            })),
          );
        }

        if (docsRes.status === 200 && Array.isArray(docsRes.data)) {
          setDocuments(docsRes.data);
        }
      } catch (err) {
        console.error("Failed to load", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, projectIdStr]);

  /* ---- derived: parse routes once ---- */
  const dynamicRoutes = useMemo(() => {
    const doc = documents.find((d) => d.document_type === "routes");
    if (!doc?.content || doc.content.startsWith("Error during generation"))
      return [];
    return parseRoutesFromMarkdown(doc.content);
  }, [documents]);

  /* ---- select first route when routes load ---- */
  useEffect(() => {
    if (dynamicRoutes.length > 0 && !selectedRoute) {
      setSelectedRoute(dynamicRoutes[0]);
    }
  }, [dynamicRoutes, selectedRoute]);

  /* ---- current non-route document ---- */
  const currentDocument = useMemo(() => {
    if (activeSection === "routes") return null;
    return documents.find((d) => d.document_type === activeSection) ?? null;
  }, [documents, activeSection]);

  /* ---- filter + paginate routes ---- */
  const filtered = useMemo(() => {
    let list = dynamicRoutes;
    if (methodFilter !== "ALL")
      list = list.filter((r) => r.method === methodFilter);
    const q = query.trim().toLowerCase();
    if (q)
      list = list.filter(
        (r) =>
          r.path.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    return list;
  }, [dynamicRoutes, methodFilter, query]);

  /*  Reset page when filters change — computed, NOT in an effect.
      We track the "previous" filter key and reset synchronously during render. */
  const filterKey = `${query}|${methodFilter}|${activeSection}`;
  const prevFilterKey = useRef(filterKey);
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
    if (page !== 1) setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRoutes = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isSelected = (r: Route) =>
    selectedRoute?.path === r.path && selectedRoute?.method === r.method;

  /* ---- helpers ---- */
  const handleSelectProject = (p: Project) =>
    router.push(`/project/${p.id}/documentation`);

  async function handleSync() {
    if (!project) return;
    setSyncing(true);
    try {
      await apiRequest(`/projects/${project.id}/analysis-runs`, {
        method: "POST",
      });
      alert("Analysis triggered!");
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  }

  async function handleRegenerateSection() {
    if (!project || !activeSection) return;
    setRegenerating(true);
    try {
      const res = await regenerateDocument(project.id, activeSection);
      if (res.status === 200 && res.data) {
        // Update the documents state
        setDocuments((prev) => {
          const filtered = prev.filter(
            (d) => d.document_type !== activeSection,
          );
          return [...filtered, res.data];
        });
        alert(`${meta.title} regenerated successfully!`);
      } else {
        alert(
          `Failed to regenerate: ${res.message || res.detail || "Unknown error"}`,
        );
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error during regeneration: ${err.message || err}`);
    } finally {
      setRegenerating(false);
    }
  }

  function handleSidebarClick(docType: string) {
    setActiveSection(docType);
    setQuery("");
    setMethodFilter("ALL");
    if (docType === "routes" && dynamicRoutes.length > 0) {
      setSelectedRoute(dynamicRoutes[0]);
    } else {
      setSelectedRoute(null);
    }
  }

  const meta = SECTION_META[activeSection] ?? {
    title: activeSection
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "",
  };

  /* ---- sidebar config (active is derived from state) ---- */
  const pt = (project?.project_type || "backend").toLowerCase();

  const getSidebarSections = () => {
    if (pt === "frontend") {
      return [
        {
          title: "Documentation",
          items: [
            {
              icon: OverviewIcon,
              label: "Overview",
              docType: "project_summary",
            },
            {
              icon: ArchitectureIcon,
              label: "Frontend Architecture",
              docType: "architecture",
            },
            {
              icon: RoutesIcon,
              label: "Routing Structure",
              docType: "routing_structure",
            },
          ],
        },
        {
          title: "Core",
          items: [
            { icon: OverviewIcon, label: "Pages", docType: "pages" },
            { icon: ServicesIcon, label: "Components", docType: "components" },
            { icon: FlowIcon, label: "UI Flow", docType: "ui_flow" },
          ],
        },
        {
          title: "Operations",
          items: [
            {
              icon: ServicesIcon,
              label: "State Management",
              docType: "state_management",
            },
            {
              icon: PlugIcon,
              label: "API Integrations",
              docType: "api_integrations",
            },
            {
              icon: PackageIcon,
              label: "Packages",
              docType: "packages",
            },
            {
              icon: OverviewIcon,
              label: "File Explanations",
              docType: "file_explanations",
            },
          ],
        },
      ];
    } else if (pt === "ml_ai") {
      return [
        {
          title: "Documentation",
          items: [
            {
              icon: OverviewIcon,
              label: "Overview",
              docType: "project_summary",
            },
            {
              icon: ArchitectureIcon,
              label: "Architecture Overview",
              docType: "architecture",
            },
          ],
        },
        {
          title: "Core Pipeline",
          items: [
            {
              icon: DatabaseIcon,
              label: "Dataset Analysis",
              docType: "dataset_analysis",
            },
            {
              icon: CubeIcon,
              label: "Model Architecture",
              docType: "model_architecture",
            },
            {
              icon: FlowIcon,
              label: "Training Pipeline",
              docType: "training_pipeline",
            },
          ],
        },
        {
          title: "Operations & Metrics",
          items: [
            {
              icon: PlugIcon,
              label: "Inference Pipeline",
              docType: "inference_pipeline",
            },
            {
              icon: OverviewIcon,
              label: "Evaluation Metrics",
              docType: "evaluation_metrics",
            },
            {
              icon: PackageIcon,
              label: "Packages",
              docType: "packages",
            },
            {
              icon: OverviewIcon,
              label: "File Explanations",
              docType: "file_explanations",
            },
          ],
        },
      ];
    } else if (pt === "fullstack") {
      return [
        {
          title: "Documentation",
          items: [
            {
              icon: OverviewIcon,
              label: "Overview",
              docType: "project_summary",
            },
            {
              icon: ArchitectureIcon,
              label: "System Architecture",
              docType: "system_architecture",
            },
            {
              icon: ArchitectureIcon,
              label: "Frontend Architecture",
              docType: "frontend_architecture",
            },
            {
              icon: ArchitectureIcon,
              label: "Backend Architecture",
              docType: "backend_architecture",
            },
          ],
        },
        {
          title: "Core Components",
          items: [
            { icon: RoutesIcon, label: "API Routes", docType: "routes" },
            { icon: BoltIcon, label: "Events", docType: "events" },
            {
              icon: DatabaseIcon,
              label: "Database Models",
              docType: "database_models",
            },
            { icon: OverviewIcon, label: "Pages", docType: "pages" },
            { icon: CubeIcon, label: "Components", docType: "components" },
            { icon: ServicesIcon, label: "Services", docType: "services" },
          ],
        },
        {
          title: "Operations & Flows",
          items: [
            { icon: BoltIcon, label: "Auth Flow", docType: "auth_flow" },
            { icon: FlowIcon, label: "Data Flow", docType: "data_flow" },
            {
              icon: PackageIcon,
              label: "Packages/Dependencies",
              docType: "packages",
            },
            {
              icon: OverviewIcon,
              label: "File Explanations",
              docType: "file_explanations",
            },
          ],
        },
      ];
    } else if (pt === "mobile") {
      return [
        {
          title: "Documentation",
          items: [
            {
              icon: OverviewIcon,
              label: "Overview",
              docType: "project_summary",
            },
            {
              icon: ArchitectureIcon,
              label: "Mobile Architecture",
              docType: "architecture",
            },
          ],
        },
        {
          title: "Core",
          items: [
            { icon: OverviewIcon, label: "Screens", docType: "screens" },
            { icon: CubeIcon, label: "Components", docType: "components" },
            { icon: FlowIcon, label: "UI Flow", docType: "ui_flow" },
          ],
        },
        {
          title: "Operations",
          items: [
            {
              icon: PackageIcon,
              label: "Packages",
              docType: "packages",
            },
            {
              icon: OverviewIcon,
              label: "File Explanations",
              docType: "file_explanations",
            },
          ],
        },
      ];
    }

    // Default Backend
    return [
      {
        title: "Documentation",
        items: [
          { icon: OverviewIcon, label: "Overview", docType: "project_summary" },
        ],
      },
      {
        title: "Core",
        items: [
          { icon: RoutesIcon, label: "Routes", docType: "routes" },
          { icon: BoltIcon, label: "Events", docType: "events" },
          {
            icon: ControllerIcon,
            label: "Controllers",
            docType: "controllers",
          },
          { icon: ServicesIcon, label: "Services", docType: "services" },
          { icon: DatabaseIcon, label: "Models", docType: "database_models" },
          { icon: RepoIcon, label: "Repositories", docType: "repositories" },
        ],
      },
      {
        title: "Architecture",
        items: [
          { icon: FlowIcon, label: "Request Flow", docType: "request_flow" },
          { icon: PackageIcon, label: "Dependencies", docType: "dependencies" },
          {
            icon: PlugIcon,
            label: "Integrations",
            docType: "external_integrations",
          },
          {
            icon: ArchitectureIcon,
            label: "Architecture",
            docType: "architecture",
          },
          { icon: BoltIcon, label: "Auth Flow", docType: "auth_flow" },
        ],
      },
      {
        title: "Operations",
        items: [
          {
            icon: EnvIcon,
            label: "Environment Variables",
            docType: "environment_variables",
          },
          { icon: ClockIcon, label: "Cron Jobs", docType: "cron_jobs" },
          { icon: QueueIcon, label: "Queues", docType: "queues" },
          { icon: BoltIcon, label: "Caching", docType: "caching" },
          {
            icon: AlertIcon,
            label: "Error Handling",
            docType: "error_handling",
          },
        ],
      },
      {
        title: "Misc",
        items: [
          {
            icon: TypeIcon,
            label: "Types & Interfaces",
            docType: "types_interfaces",
          },
          { icon: TypeIcon, label: "Enums", docType: "enums" },
          {
            icon: SettingsIcon,
            label: "Configuration",
            docType: "configuration",
          },
        ],
      },
    ];
  };

  const sidebarSections = getSidebarSections();

  /* ---- extract headings from current doc for TOC ---- */
  const tocHeadings = useMemo(() => {
    if (!currentDocument?.content) return [];
    const matches = currentDocument.content.match(/^#{1,4}\s+.+$/gm);
    if (!matches) return [];
    return matches.map((line) => {
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s+/, "").replace(/`/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return { level, text, id };
    });
  }, [currentDocument]);

  /* ---- loading / error guards ---- */
  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-neutral-200">
          Project Not Found
        </h2>
        <Link
          href="/project"
          className="mt-4 rounded-xl bg-blue-500 px-4 py-2 text-white"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Header
        project={project}
        onSelectProject={handleSelectProject}
        projectsList={projectsList}
      />
      {/* ---- SUB NAV ---- */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6">
        {[
          {
            icon: OverviewIcon,
            label: "Overview",
            href: `/project/${project.id}`,
          },
          {
            icon: GlobeIcon,
            label: "Documentation",
            href: `/project/${project.id}/documentation`,
            active: true,
          },
          {
            icon: ArchitectureIcon,
            label: "Architecture",
            href: `/project/${project.id}/architecture`,
          },
          { icon: ChangesIcon, label: "Changes", href: "#" },
          { icon: AIWorkspaceIcon, label: "AI Workspace", href: "#" },
          { icon: SettingsIcon, label: "Settings", href: "#" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[13px] font-medium transition ${tab.active ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"}`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        ))}
      </div>
      {/* ---- MAIN ---- */}
      <div className="flex flex-1 overflow-hidden scroll-thin">
        {/* LEFT SIDEBAR */}
        <div className="w-60 shrink-0 overflow-y-auto border-r border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
          {sidebarSections.map((section, idx) => (
            <div key={section.title} className={idx > 0 ? "mt-6" : ""}>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                {section.title}
              </p>
              <div className="mt-2 space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeSection === item.docType;
                  const hasDoc = documents.some(
                    (d) => d.document_type === item.docType,
                  );
                  return (
                    <button
                      key={item.docType}
                      onClick={() => handleSidebarClick(item.docType)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] transition ${isActive ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <item.icon
                          className={`h-4 w-4 ${isActive ? "text-blue-500" : "text-slate-400 dark:text-neutral-500"}`}
                        />
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-950">
          <div className="max-w-[900px] p-8">
            {/* Section header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    {meta.title}
                  </h1>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    Auto-generated
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-neutral-400">
                  {meta.description}
                </p>
              </div>
              {activeSection !== "file_explanations" &&
                activeSection !== "file_detail" && (
                  <button
                    onClick={handleRegenerateSection}
                    disabled={regenerating}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition"
                  >
                    <RefreshIcon className="h-3.5 w-3.5" />
                    {regenerating ? "Regenerating..." : "Regenerate Section"}
                  </button>
                )}
              {/*<div className="flex items-center gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search documentation…"
                    className="h-9 w-[220px] rounded-lg border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 pl-9 pr-10 text-[13px] text-slate-700 dark:text-neutral-300 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/10"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-100 dark:border-neutral-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-neutral-500">
                    ⌘/
                  </span>
                </div>
                <button className="rounded-lg border border-slate-100 dark:border-neutral-800 p-2 text-slate-400 dark:text-neutral-500 hover:bg-slate-50 dark:hover:bg-neutral-800">
                  <MenuIcon className="h-4 w-4" />
                </button>
              </div>*/}
            </div>

            {/* ============ ROUTES VIEW ============ */}
            {activeSection === "routes" && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="h-5 w-5 text-slate-400 dark:text-neutral-500" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Routes
                    </h2>
                  </div>
                  <div className="relative" ref={filterRef}>
                    <button
                      onClick={() => setFilterOpen((o) => !o)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-100 dark:border-neutral-800 px-3 py-1.5 text-[12px] font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"
                    >
                      <FilterIcon className="h-3.5 w-3.5" />
                      {methodFilter === "ALL" ? "Filter" : methodFilter}
                      <ChevronDownIcon className="h-3 w-3 text-slate-400 dark:text-neutral-500" />
                    </button>
                    {filterOpen && (
                      <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-1 shadow-lg">
                        {METHOD_FILTERS.map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setMethodFilter(m);
                              setFilterOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${methodFilter === m ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"}`}
                          >
                            {m === "ALL" ? "All methods" : m}
                            <span className="text-[10px] text-slate-400">
                              {m === "ALL"
                                ? dynamicRoutes.length
                                : dynamicRoutes.filter((r) => r.method === m)
                                    .length}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-neutral-400">
                  Total {filtered.length} routes.
                </p>

                {dynamicRoutes.length === 0 ? (
                  <div className="mt-10 flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 text-center">
                    <GlobeIcon className="h-8 w-8 text-slate-300 dark:text-neutral-600" />
                    <p className="mt-3 text-[14px] font-medium text-slate-700 dark:text-neutral-300">
                      No routes documented yet
                    </p>
                    <p className="mt-1 text-[13px] text-slate-500 dark:text-neutral-500">
                      Run an analysis to extract API routes.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {pageRoutes.map((route) => (
                      <div
                        key={`${route.method}-${route.path}`}
                        onClick={() => setSelectedRoute(route)}
                        className={`group cursor-pointer rounded-lg border p-4 transition ${isSelected(route) ? "border-blue-200 bg-blue-50/30 dark:border-blue-500/30 dark:bg-blue-500/5" : "border-slate-100 dark:border-neutral-900 bg-white dark:bg-neutral-900 hover:border-slate-300 dark:hover:border-neutral-700"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <span
                              className={`shrink-0 rounded-md border px-2 py-1 text-[11px] font-semibold ${methodColors[route.method]}`}
                            >
                              {route.method}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-mono text-[14px] font-medium text-slate-900 dark:text-white">
                                {route.path}
                              </p>
                              <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-500 dark:text-neutral-400">
                                {route.description}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {route.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 text-[11px] text-slate-600 dark:text-neutral-400"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <div className="text-right">
                              <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                                Responses
                              </p>
                              <p className="text-[13px] font-medium text-emerald-600">
                                {route.responses.map((r) => r.code).join(" · ")}
                              </p>
                            </div>
                            <ChevronRightIcon className="h-4 w-4 text-slate-300 transition group-hover:text-blue-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-40"
                    >
                      <ChevronRightIcon className="h-4 w-4 rotate-180" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium ${p === page ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"}`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-40"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ============ NON-ROUTE DOCUMENT VIEW ============ */}
            {activeSection !== "routes" && currentDocument && (
              <div className="mt-8">
                <MarkdownContent content={currentDocument.content} />
              </div>
            )}

            {/* ============ EMPTY STATE ============ */}
            {activeSection !== "routes" && !currentDocument && (
              <div className="mt-10 flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 text-center">
                <GlobeIcon className="h-8 w-8 text-slate-300 dark:text-neutral-600" />
                <p className="mt-3 text-[14px] font-medium text-slate-700 dark:text-neutral-300">
                  No {meta.title} documented yet
                </p>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-neutral-500">
                  Run an analysis to generate this section.
                </p>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {syncing ? "Running…" : "Run Analysis"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[280px] shrink-0 overflow-y-auto border-l border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          {/* ---- Routes right panel ---- */}
          {activeSection === "routes" && (
            <>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                On this page
              </h3>
              <div className="mt-3 space-y-1">
                {pageRoutes.map((r) => (
                  <button
                    key={`${r.method}-${r.path}`}
                    onClick={() => setSelectedRoute(r)}
                    className={`block w-full truncate text-left text-[13px] transition ${isSelected(r) ? "font-medium text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"}`}
                  >
                    <span className="mr-1.5 font-mono text-[10px] text-slate-400">
                      {r.method}
                    </span>
                    {r.path}
                  </button>
                ))}
                {filtered.length > pageRoutes.length && (
                  <p className="pt-1 text-[12px] text-slate-400 dark:text-neutral-500">
                    + {filtered.length - pageRoutes.length} more
                  </p>
                )}
              </div>

              {selectedRoute && (
                <div className="mt-8 rounded-xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Route Details
                  </h4>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${methodColors[selectedRoute.method]}`}
                      >
                        {selectedRoute.method}
                      </span>
                      <span className="break-all font-mono text-[12px] text-slate-700 dark:text-neutral-300">
                        {selectedRoute.path}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                        Description
                      </p>
                      <p className="mt-1 text-[13px] text-slate-600 dark:text-neutral-400">
                        {selectedRoute.description}
                      </p>
                    </div>
                    {selectedRoute.params.length > 0 && (
                      <div className="mt-4">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                          Parameters
                        </p>
                        <div className="mt-2 space-y-2">
                          {selectedRoute.params.map((param) => (
                            <div
                              key={param.name}
                              className="flex items-start justify-between rounded-lg border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[12px] font-medium text-slate-700 dark:text-neutral-300">
                                    {param.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                                    {param.kind} · {param.type}
                                  </span>
                                </div>
                                <p className="truncate text-[11px] text-slate-500 dark:text-neutral-400">
                                  {param.desc}
                                </p>
                              </div>
                              {param.required && (
                                <span className="ml-2 shrink-0 rounded bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 dark:text-blue-400">
                                  Required
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedRoute.body && (
                      <div className="mt-4">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                          Request Body
                        </p>
                        <div className="mt-2 space-y-2">
                          {Object.entries(selectedRoute.body).map(
                            ([name, meta]) => (
                              <div
                                key={name}
                                className="flex items-start justify-between rounded-lg border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[12px] font-medium text-slate-700 dark:text-neutral-300">
                                      {name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                                      {meta.type}
                                    </span>
                                  </div>
                                  <p className="truncate text-[11px] text-slate-500 dark:text-neutral-400">
                                    {meta.desc}
                                  </p>
                                </div>
                                {meta.required && (
                                  <span className="ml-2 shrink-0 rounded bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 dark:text-blue-400">
                                    Required
                                  </span>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                        Responses
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {selectedRoute.responses.map((resp) => (
                          <div
                            key={resp.code}
                            className="flex items-center gap-3 text-[12px]"
                          >
                            <span
                              className={`w-6 font-mono font-medium ${resp.code < 300 ? "text-emerald-600" : resp.code < 500 ? "text-amber-600" : "text-red-600"}`}
                            >
                              {resp.code}
                            </span>
                            <span className="text-slate-600 dark:text-neutral-400">
                              {resp.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowApiModal(true)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 py-2 text-[12px] font-medium text-blue-600 dark:text-blue-400 transition hover:bg-blue-100 dark:hover:bg-blue-500/20"
                  >
                    View Full API Reference
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M7 17 17 7M17 7H7M17 7v10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

          {/* ---- Non-route right panel ---- */}
          {activeSection !== "routes" && currentDocument && (
            <>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Document Info
              </h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-slate-100 dark:border-neutral-800 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                    Type
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-neutral-300">
                    {meta.title}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 dark:border-neutral-800 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                    Size
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-neutral-300">
                    {currentDocument.content.split(/\s+/).length} words ·{" "}
                    {currentDocument.content.split("\n").length} lines
                  </p>
                </div>
                {currentDocument.updated_at && (
                  <div className="rounded-lg border border-slate-100 dark:border-neutral-800 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                      Updated
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-neutral-300">
                      {new Date(
                        currentDocument.updated_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {tocHeadings.length > 0 && (
                <div className="mt-8">
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-500">
                    On this page
                  </h4>

                  <nav className="relative">
                    {tocHeadings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className="group relative block rounded-md py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                        style={{
                          paddingLeft: `${12 + (h.level - 1) * 16}px`,
                        }}
                      >
                        <span className="absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full bg-transparent transition-colors group-hover:bg-slate-300 dark:group-hover:bg-neutral-600" />
                        <span className="line-clamp-2 text-xs">{h.text}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}

          {/* ---- Empty right panel ---- */}
          {activeSection !== "routes" && !currentDocument && (
            <div className="flex h-32 items-center justify-center text-[13px] text-slate-400 dark:text-neutral-500">
              No document available
            </div>
          )}
        </div>
      </div>
      {/* API Modal */}
      {showApiModal && selectedRoute && (
        <ApiReferenceModal
          route={selectedRoute}
          onClose={() => setShowApiModal(false)}
        />
      )}
    </div>
  );
}

/* ================================================================
   API REFERENCE MODAL  (real requests — unchanged logic)
   ================================================================ */
interface TryResponse {
  status: number;
  statusText: string;
  ms: number;
  body: string;
  ok: boolean;
  networkError: boolean;
}

function ApiReferenceModal({
  route,
  onClose,
}: {
  route: Route;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"try" | "nodejs" | "fastapi">(
    "try",
  );
  const [baseUrl, setBaseUrl] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("docu_try_base_url") || getApiBaseUrl()
      : getApiBaseUrl(),
  );
  const [token, setToken] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("docu_try_token") || ""
      : "",
  );
  const [paramValues, setParamValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    route.params.forEach((p) => {
      init[p.name] = p.defaultValue || "";
    });
    if (route.body)
      Object.keys(route.body).forEach((k) => {
        init[`body_${k}`] = "";
      });
    return init;
  });
  const [response, setResponse] = useState<TryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("docu_try_base_url", baseUrl);
  }, [baseUrl]);
  useEffect(() => {
    localStorage.setItem("docu_try_token", token);
  }, [token]);

  const setParam = (key: string, val: string) =>
    setParamValues((prev) => ({ ...prev, [key]: val }));
  const hasBody = !!route.body && !["GET", "DELETE"].includes(route.method);

  function buildUrl(): string {
    let path = route.path;
    route.params
      .filter((p) => p.kind === "path")
      .forEach((p) => {
        path = path.replace(
          `{${p.name}}`,
          encodeURIComponent(paramValues[p.name] || `{${p.name}}`),
        );
      });
    let url = `${baseUrl.replace(/\/$/, "")}${path}`;
    const qp = route.params
      .filter((p) => p.kind === "query")
      .map((p) => {
        const val = paramValues[p.name] || p.defaultValue || "";
        return val ? `${p.name}=${encodeURIComponent(val)}` : "";
      })
      .filter(Boolean)
      .join("&");
    if (qp) url += `?${qp}`;
    return url;
  }

  function buildBodyObj(): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    if (!route.body) return obj;
    Object.entries(route.body).forEach(([k, meta]) => {
      const raw = paramValues[`body_${k}`];
      if (raw === "" || raw === undefined) return;
      if (/int|number|float/i.test(meta.type)) obj[k] = Number(raw);
      else if (/bool/i.test(meta.type)) obj[k] = raw === "true";
      else obj[k] = raw;
    });
    return obj;
  }

  function buildBody(): string | null {
    if (!route.body) return null;
    return JSON.stringify(buildBodyObj(), null, 2);
  }

  async function handleSend() {
    setLoading(true);
    setResponse(null);
    const started = performance.now();
    const url = buildUrl();
    const headers: Record<string, string> = {};
    if (token.trim()) headers["Authorization"] = `Bearer ${token.trim()}`;
    if (hasBody) headers["Content-Type"] = "application/json";
    try {
      const res = await fetch(url, {
        method: route.method,
        headers,
        body: hasBody ? JSON.stringify(buildBodyObj()) : undefined,
      });
      const ms = Math.round(performance.now() - started);
      const text = await res.text();
      let body = text || "(empty response body)";
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* raw */
      }
      setResponse({
        status: res.status,
        statusText: res.statusText,
        ms,
        body,
        ok: res.ok,
        networkError: false,
      });
    } catch (err: any) {
      const ms = Math.round(performance.now() - started);
      setResponse({
        status: 0,
        statusText: "Network Error",
        ms,
        ok: false,
        networkError: true,
        body: `${err?.message || "Failed to fetch"}\n\nPossible causes:\n  • Server not running at ${baseUrl}\n  • CORS blocking\n  • Invalid path parameters`,
      });
    } finally {
      setLoading(false);
    }
  }

  function getNodeCode(): string {
    const url = buildUrl();
    const bodyStr = buildBody();
    const lines: string[] = [];
    lines.push(`const url = '${url}';`);
    lines.push(``);
    if (bodyStr && hasBody) lines.push(`const body = ${bodyStr};\n`);
    lines.push(`const response = await fetch(url, {`);
    lines.push(`  method: '${route.method}',`);
    lines.push(`  headers: {`);
    if (hasBody) lines.push(`    'Content-Type': 'application/json',`);
    lines.push(
      `    'Authorization': 'Bearer ${token.trim() || "<YOUR_TOKEN>"}'`,
    );
    lines.push(`  },`);
    if (bodyStr && hasBody) lines.push(`  body: JSON.stringify(body)`);
    lines.push(`});\n`);
    lines.push(`const data = await response.json();`);
    lines.push(`console.log(data);`);
    return lines.join("\n");
  }

  function getFastApiCode(): string {
    const url = buildUrl();
    const bodyStr = buildBody();
    const lines: string[] = [];
    lines.push(`import requests\n`);
    lines.push(`url = "${url}"`);
    lines.push(
      `headers = {"Authorization": "Bearer ${token.trim() || "<YOUR_TOKEN>"}"}\n`,
    );
    if (bodyStr && hasBody) {
      lines.push(`payload = ${bodyStr}\n`);
      lines.push(
        `response = requests.${route.method.toLowerCase()}(url, json=payload, headers=headers)`,
      );
    } else {
      lines.push(
        `response = requests.${route.method.toLowerCase()}(url, headers=headers)`,
      );
    }
    lines.push(`print(response.status_code)`);
    lines.push(`print(response.json())`);
    return lines.join("\n");
  }

  const getCodeForTab = () =>
    activeTab === "nodejs"
      ? getNodeCode()
      : activeTab === "fastapi"
        ? getFastApiCode()
        : "";

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* noop */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tabs = [
    { id: "try" as const, label: "Try it" },
    { id: "nodejs" as const, label: "Node.js" },
    { id: "fastapi" as const, label: "Python" },
  ];

  const inputClass =
    "flex-1 rounded-lg border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 font-mono text-[12px] text-slate-700 dark:text-neutral-300 placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-blue-300 dark:focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/10";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 dark:bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[820px] flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-bold ${methodColors[route.method]}`}
            >
              {route.method}
            </span>
            <span className="truncate font-mono text-[14px] font-medium text-slate-800 dark:text-neutral-200">
              {route.path}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 dark:text-neutral-500 transition hover:bg-slate-100 dark:hover:bg-neutral-800"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-neutral-800 px-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setCopied(false);
              }}
              className={`border-b-2 px-4 py-3 text-[13px] font-medium transition ${activeTab === t.id ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "try" && (
            <div className="space-y-5 p-6">
              <p className="text-[13px] text-slate-500 dark:text-neutral-400">
                {route.description}
              </p>

              {/* Connection */}
              <div className="rounded-xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                  Connection
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="w-28 shrink-0 text-[12px] font-medium text-slate-600 dark:text-neutral-400">
                      Base URL
                    </label>
                    <input
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder={getApiBaseUrl()}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-28 shrink-0 text-[12px] font-medium text-slate-600 dark:text-neutral-400">
                      Bearer Token
                    </label>
                    <input
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder={route.authRequired ? "Required" : "Optional"}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-3 overflow-x-auto rounded-lg border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2">
                  <code className="whitespace-nowrap font-mono text-[11.5px] text-slate-500 dark:text-neutral-400">
                    <span className="font-semibold text-slate-700 dark:text-neutral-200">
                      {route.method}
                    </span>{" "}
                    {buildUrl()}
                  </code>
                </div>
              </div>

              {/* Params */}
              {route.params.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                    Parameters
                  </p>
                  <div className="space-y-2">
                    {route.params.map((p) => (
                      <div key={p.name} className="flex items-center gap-3">
                        <label className="w-28 shrink-0">
                          <span className="font-mono text-[12px] font-medium text-slate-700 dark:text-neutral-300">
                            {p.name}
                          </span>
                          {p.required && (
                            <span className="ml-1 text-[9px] text-red-500">
                              *
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                            {p.kind} · {p.type}
                          </p>
                        </label>
                        <input
                          value={paramValues[p.name] || ""}
                          onChange={(e) => setParam(p.name, e.target.value)}
                          placeholder={p.defaultValue || p.desc}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Body */}
              {route.body && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                    Request Body
                  </p>
                  <div className="space-y-2">
                    {Object.entries(route.body).map(([key, meta]) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="w-28 shrink-0">
                          <span className="font-mono text-[12px] font-medium text-slate-700 dark:text-neutral-300">
                            {key}
                          </span>
                          {meta.required && (
                            <span className="ml-1 text-[9px] text-red-500">
                              *
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                            {meta.type}
                          </p>
                        </label>
                        <input
                          value={paramValues[`body_${key}`] || ""}
                          onChange={(e) =>
                            setParam(`body_${key}`, e.target.value)
                          }
                          placeholder={meta.desc}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending…
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    Send Request
                  </>
                )}
              </button>

              {/* Response */}
              {response !== null && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                      Response
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${response.networkError ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : response.ok ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"}`}
                      >
                        {response.networkError
                          ? "Failed"
                          : `${response.status} ${response.statusText}`}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                        {response.ms} ms
                      </span>
                      <button
                        onClick={() => copyText(response.body)}
                        className="rounded-md p-1.5 text-slate-400 dark:text-neutral-500 transition hover:bg-slate-100 dark:hover:bg-neutral-800"
                      >
                        {copied ? (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="m5 13 4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <pre
                    className={`max-h-[240px] overflow-auto rounded-xl border p-4 font-mono text-[12px] leading-relaxed ${response.networkError ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400" : "border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300"}`}
                  >
                    {response.body}
                  </pre>
                </div>
              )}

              {response === null && route.sampleResponse && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                    Documented Example
                  </p>
                  <pre className="max-h-[200px] overflow-auto rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 p-4 font-mono text-[12px] leading-relaxed text-slate-500 dark:text-neutral-400">
                    {route.sampleResponse}
                  </pre>
                </div>
              )}
            </div>
          )}

          {(activeTab === "nodejs" || activeTab === "fastapi") && (
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-slate-700 dark:text-neutral-300">
                  {activeTab === "nodejs"
                    ? "Node.js (fetch)"
                    : "Python (requests)"}
                </p>
                <button
                  onClick={() => copyText(getCodeForTab())}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-100 dark:border-neutral-800 px-3 py-1.5 text-[12px] font-medium text-slate-600 dark:text-neutral-400 transition hover:bg-slate-50 dark:hover:bg-neutral-800"
                >
                  {copied ? (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="m5 13 4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy code
                    </>
                  )}
                </button>
              </div>
              <pre className="max-h-[420px] overflow-auto rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 p-5 font-mono text-[12px] leading-relaxed text-slate-700 dark:text-neutral-300">
                {getCodeForTab()}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
