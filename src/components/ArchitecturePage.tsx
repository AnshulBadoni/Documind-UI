"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// @ts-ignore
import mermaid from "mermaid";

import ProjectSwitcher from "@/components/ProjectSwitcher";
import { ThemeToggle } from "@/components/ThemeProvider";
import { type Project } from "@/lib/data";
import { useAuth } from "@/lib/useAuth";
import { apiRequest, regenerateDocument } from "@/lib/api";
import Header from "./Header";

// ---------- Icons ----------
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

function AlertIcon({ className }: { className?: string }) {
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
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ---------- Knowledge graph parsing ----------
interface GraphNode {
  path: string;
  classes: number;
  functions: number;
}
interface GraphEdge {
  from: string;
  to: string;
}

function parseKnowledgeGraph(content: string): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const nodeRegex =
    /\*\*Node\*\*: `([^`]+)` \(Classes: (\d+), Functions: (\d+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = nodeRegex.exec(content)) !== null) {
    nodes.push({ path: m[1], classes: Number(m[2]), functions: Number(m[3]) });
  }

  const edgeRegex = /`([^`]+)`\s*--->\s*imports\s*--->\s*`([^`]+)`/g;
  while ((m = edgeRegex.exec(content)) !== null) {
    edges.push({ from: m[1], to: m[2] });
  }

  return { nodes, edges };
}

const dirOf = (p: string) => (p.includes("/") ? p.split("/")[0] : "app");
const safeId = (p: string) => "n_" + p.replace(/[^a-zA-Z0-9]/g, "_");

const DIR_META: Record<
  string,
  { label: string; fill: string; stroke: string }
> = {
  app: { label: "Entry Point", fill: "#e8f0fe", stroke: "#1a73e8" },
  routes: { label: "Routes", fill: "#e8f0fe", stroke: "#1a73e8" },
  controller: { label: "Controllers", fill: "#e6f4ea", stroke: "#188038" },
  services: { label: "Services", fill: "#fef7e0", stroke: "#f9ab00" },
  models: { label: "Models", fill: "#fce8e6", stroke: "#d93025" },
  dependency: { label: "Dependencies", fill: "#e4f7fb", stroke: "#12a4af" },
  database: { label: "Database", fill: "#f3e8fd", stroke: "#9334e6" },
  worker: { label: "Worker", fill: "#fff0e1", stroke: "#e8710a" },
};

function buildDependencyMermaid(
  nodes: GraphNode[],
  edges: GraphEdge[],
): string {
  const groups: Record<string, GraphNode[]> = {};
  nodes.forEach((n) => {
    const dir = dirOf(n.path);
    (groups[dir] ||= []).push(n);
  });

  let out = "flowchart LR\n";
  Object.entries(groups).forEach(([dir, dirNodes]) => {
    const meta = DIR_META[dir] || {
      label: dir,
      fill: "#f1f3f4",
      stroke: "#5f6368",
    };
    out += `  subgraph sg_${dir}["${meta.label}"]\n`;
    dirNodes.forEach((n) => {
      const fileName = n.path.split("/").pop();
      out += `    ${safeId(n.path)}["${fileName}"]\n`;
    });
    out += "  end\n";
  });

  edges.forEach((e) => {
    out += `  ${safeId(e.from)} --> ${safeId(e.to)}\n`;
  });

  Object.keys(groups).forEach((dir) => {
    const meta = DIR_META[dir] || {
      fill: "#f1f3f4",
      stroke: "#5f6368",
      label: dir,
    };
    out += `  style sg_${dir} fill:${meta.fill},stroke:${meta.stroke},stroke-width:1.5px\n`;
  });
  return out;
}

function buildLayerMermaid(edges: GraphEdge[]): string {
  const layerEdges = new Set<string>();
  const layers = new Set<string>();

  edges.forEach((e) => {
    const a = dirOf(e.from);
    const b = dirOf(e.to);
    layers.add(a);
    layers.add(b);
    if (a !== b) layerEdges.add(`${a}|${b}`);
  });

  let out = "flowchart TB\n";
  layers.forEach((dir) => {
    const meta = DIR_META[dir] || {
      label: dir,
      fill: "#f1f3f4",
      stroke: "#5f6368",
    };
    out += `  L_${dir}["${meta.label}"]\n`;
  });

  layerEdges.forEach((pair) => {
    const [a, b] = pair.split("|");
    out += `  L_${a} --> L_${b}\n`;
  });

  layers.forEach((dir) => {
    const meta = DIR_META[dir] || {
      fill: "#f1f3f4",
      stroke: "#5f6368",
      label: dir,
    };
    out += `  style L_${dir} fill:${meta.fill},stroke:${meta.stroke},stroke-width:1.5px\n`;
  });
  return out;
}

function sanitizeMermaid(src: string): string {
  let out = src.replace(/\\n/g, " ");
  out = out.replace(/(\b[\w_]+\b)\[([^\]]*)\]/g, (_match, id, label) => {
    const cleaned = cleanLabel(label);
    return `${id}["${cleaned}"]`;
  });
  return out;
}

function cleanLabel(raw: string): string {
  return raw
    .replace(/^["']|["']$/g, "")
    .replace(/\n/g, " ")
    .replace(/`/g, "")
    .replace(/\(/g, "‹")
    .replace(/\)/g, "›")
    .replace(/</g, "‹")
    .replace(/>/g, "›")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------- Lightweight markdown renderer ----------
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={`${keyPrefix}-${i}`}
          className="font-semibold text-slate-900 dark:text-white"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-${i}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12.5px] text-slate-700 dark:bg-neutral-800 dark:text-neutral-300 border border-slate-200/50 dark:border-neutral-700/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught a rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function MermaidDiagram({
  chart,
  onFallback,
}: {
  chart: string;
  onFallback?: (type: "layers" | "dependencies") => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 10)}`);

  // Zoom configuration — change MAX_SCALE to allow more than 300% (3.0 = 300%).
  // For example, set MAX_SCALE = 5 for 500% max zoom.
  const MIN_SCALE = 0.15;
  const MAX_SCALE = 6;
  const ZOOM_STEP = 0.15;

  useEffect(() => {
    let cancelled = false;
    const runRender = async () => {
      try {
        setError(null);
        setRendered(false);

        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "default",
          securityLevel: "loose",
          suppressErrorRendering: true,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          flowchart: { htmlLabels: true, curve: "basis", padding: 20 },
        });

        const cleanSource = sanitizeMermaid(chart.trim());
        const { svg } = await mermaid.render(idRef.current, cleanSource);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.setAttribute("width", "100%");
            svgEl.setAttribute("height", "100%");
            svgEl.style.maxWidth = "none";
            svgEl.style.minWidth = "600px";
          }
          setRendered(true);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (!cancelled) {
          setError(
            err?.message || "Failed to render dependency topology chart.",
          );
        }
      }
    };

    runRender();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  useEffect(() => {
    const el = svgWrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.06 : 0.08;
      setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [rendered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, s + ZOOM_STEP));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, s - ZOOM_STEP));
  const resetViewport = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const exportSvg = () => {
    const svgEl = containerRef.current?.querySelector("svg");
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const trigger = document.createElement("a");
    trigger.href = url;
    trigger.download = "architecture-blueprint.svg";
    trigger.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-6 text-center">
        <AlertIcon className="mx-auto h-8 w-8 text-red-500" />
        <h4 className="mt-2 text-sm font-semibold text-slate-800 dark:text-neutral-200">
          Mermaid Render Error
        </h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
          The diagram syntax is incompatible with the renderer.
        </p>
        {onFallback && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onFallback("layers")}
              className="rounded-lg bg-slate-200/80 dark:bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-300 dark:hover:bg-neutral-700 transition"
            >
              View Layered Overview
            </button>
            <button
              type="button"
              onClick={() => onFallback("dependencies")}
              className="rounded-lg bg-slate-200/80 dark:bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-300 dark:hover:bg-neutral-700 transition"
            >
              View File Dependency Graph
            </button>
          </div>
        )}
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-xs font-semibold text-red-600 dark:text-red-400">
            View error raw details
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-slate-900 p-3 font-mono text-[11px] text-red-300">
            {error}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-lg border border-slate-200/80 dark:border-neutral-800 bg-linear-to-b from-slate-50/50 to-white dark:from-neutral-900/50 dark:to-neutral-950 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-0.5">
            <button
              type="button"
              onClick={zoomOut}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700 hover:text-slate-800"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="flex h-7 min-w-[50px] items-center justify-center text-[11px] font-semibold text-slate-600 dark:text-neutral-300 select-none tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700 hover:text-slate-800"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            onClick={resetViewport}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2.5 text-[11px] font-medium text-slate-500 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-700"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
            Fit Frame
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportSvg}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-[11.5px] font-medium text-slate-600 dark:text-neutral-300 hover:text-slate-950 hover:bg-slate-50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            SVG
          </button>
        </div>
      </div>

      <div
        ref={svgWrapRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative h-[480px] overflow-hidden bg-[radial-gradient(#e2e8f0_1.1px,transparent_1.1px)] dark:bg-[radial-gradient(#262626_1.2px,transparent_1.2px)] bg-[length:20px_20px] bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {!rendered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-500 dark:border-neutral-800 dark:border-t-blue-400" />
            <span className="text-[12px] text-slate-400 dark:text-neutral-500 font-medium">
              Assembling design chart...
            </span>
          </div>
        )}
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center origin-center transition-transform duration-75 ease-out p-10"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
}

interface MarkdownSegment {
  type: "text" | "mermaid";
  content: string;
}

function parseMarkdownSegments(content: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  const lines = content.split("\n");
  let currentBlock: string[] = [];
  let isInsideMermaid = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```mermaid")) {
      if (currentBlock.length > 0) {
        segments.push({ type: "text", content: currentBlock.join("\n") });
        currentBlock = [];
      }
      isInsideMermaid = true;
      continue;
    }

    if (isInsideMermaid && line.trim().startsWith("```")) {
      isInsideMermaid = false;
      segments.push({ type: "mermaid", content: currentBlock.join("\n") });
      currentBlock = [];
      continue;
    }

    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    segments.push({
      type: isInsideMermaid ? "mermaid" : "text",
      content: currentBlock.join("\n"),
    });
  }

  return segments;
}

function MarkdownContent({ content }: { content: string }) {
  const segments = useMemo(() => parseMarkdownSegments(content), [content]);

  return (
    <div className="space-y-4">
      {segments.map((segment, index) => {
        if (segment.type === "mermaid") {
          return <MermaidDiagram key={index} chart={segment.content} />;
        }

        const lines = segment.content.split("\n");
        const blocks: ReactNode[] = [];
        let i = 0;
        let key = 0;

        while (i < lines.length) {
          const line = lines[i];

          if (line.trim().startsWith("```")) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("```")) {
              codeLines.push(lines[i]);
              i++;
            }
            i++;
            blocks.push(
              <pre
                key={key++}
                className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[12.5px] leading-relaxed text-slate-700 dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:text-neutral-300"
              >
                {codeLines.join("\n")}
              </pre>,
            );
            continue;
          }

          if (line.trim().startsWith("|")) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith("|")) {
              tableLines.push(lines[i]);
              i++;
            }
            if (tableLines.length >= 2) {
              const parseRow = (row: string) =>
                row
                  .split("|")
                  .slice(1, -1)
                  .map((c) => c.trim());
              const header = parseRow(tableLines[0]);
              const body = tableLines.slice(2).map(parseRow);
              blocks.push(
                <div
                  key={key++}
                  className="my-4 overflow-x-auto rounded-xl border border-slate-200/80 dark:border-neutral-800"
                >
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-slate-50/50 dark:bg-neutral-900/50">
                      <tr>
                        {header.map((h, hi) => (
                          <th
                            key={hi}
                            className="px-3.5 py-2.5 font-semibold text-slate-700 dark:text-neutral-300"
                          >
                            {renderInline(h, `th-${key}-${hi}`)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                      {body.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="px-3.5 py-2.5 text-slate-600 dark:text-neutral-400"
                            >
                              {renderInline(cell, `td-${key}-${ri}-${ci}`)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>,
              );
            }
            continue;
          }

          if (line.startsWith("### ")) {
            const text = line.slice(4);
            blocks.push(
              <h4
                key={key++}
                id={slugify(text)}
                className="mt-6 mb-2 text-[15px] font-semibold text-slate-900 dark:text-white"
              >
                {renderInline(text, `h4-${key}`)}
              </h4>,
            );
            i++;
            continue;
          }
          if (line.startsWith("## ")) {
            const text = line.slice(3);
            blocks.push(
              <h3
                key={key++}
                id={slugify(text)}
                className="mt-8 mb-3 text-[18px] font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-800 pb-2"
              >
                {renderInline(text, `h3-${key}`)}
              </h3>,
            );
            i++;
            continue;
          }
          if (line.startsWith("# ")) {
            i++;
            continue;
          }

          if (/^\s*[-*] /.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\s*[-*] /.test(lines[i])) {
              items.push(lines[i].replace(/^\s*[-*] /, ""));
              i++;
            }
            blocks.push(
              <ul key={key++} className="my-3 space-y-1.5 pl-5">
                {items.map((item, li) => (
                  <li
                    key={li}
                    className="list-disc text-[14px] leading-relaxed text-slate-600 dark:text-neutral-400"
                  >
                    {renderInline(item, `li-${key}-${li}`)}
                  </li>
                ))}
              </ul>,
            );
            continue;
          }

          if (line.trim() === "---" || line.trim() === "") {
            i++;
            continue;
          }

          blocks.push(
            <p
              key={key++}
              className="my-2.5 text-[14px] leading-relaxed text-slate-600 dark:text-neutral-400"
            >
              {renderInline(line, `p-${key}`)}
            </p>,
          );
          i++;
        }

        return <div key={index}>{blocks}</div>;
      })}
    </div>
  );
}

// ---------- Page ----------
const isFailedDoc = (content?: string) =>
  !content || content.startsWith("Error during generation");

const KNOWN_TECH = [
  "FastAPI",
  "MongoDB",
  "Redis",
  "PostgreSQL",
  "MySQL",
  "APScheduler",
  "AWS S3",
  "Slack",
  "JWT",
  "bcrypt",
  "Pydantic",
  "boto3",
  "httpx",
  "Docker",
];

export default function ArchitecturePage() {
  const { loading: authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const projectIdStr = pathname.split("/")[2] || "";
  const projectId = projectIdStr;

  const [project, setProject] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [documents, setDocuments] = useState<any[]>([]);
  const [activeDiagram, setActiveDiagram] = useState<
    "ai" | "layers" | "dependencies"
  >("ai");

  useEffect(() => {
    async function loadData() {
      if (!projectIdStr) return;
      try {
        setLoading(true);

        const projectRes = await apiRequest(`/projects/${projectIdStr}`);
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
          });
        }

        const listRes = await apiRequest("/projects");
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

        const docsRes = await apiRequest(`/projects/${projectIdStr}/documents`);
        if (docsRes.status === 200 && Array.isArray(docsRes.data)) {
          setDocuments(docsRes.data);
        }
      } catch (err) {
        console.error("Failed to load details", err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, projectIdStr]);

  const knowledgeGraphDoc = documents.find(
    (d) => d.document_type === "knowledge_graph",
  );
  const architectureDoc = documents.find(
    (d) => d.document_type === "architecture",
  );
  const summaryDoc = documents.find(
    (d) => d.document_type === "project_summary",
  );

  const graph = useMemo(
    () =>
      knowledgeGraphDoc?.content
        ? parseKnowledgeGraph(knowledgeGraphDoc.content)
        : { nodes: [], edges: [] },
    [knowledgeGraphDoc?.content],
  );

  const architectureFailed = isFailedDoc(architectureDoc?.content);

  const articleDoc = !architectureFailed ? architectureDoc : summaryDoc;
  const articleContent: string = articleDoc?.content || "";

  const embeddedMermaid = useMemo(() => {
    if (architectureFailed || !architectureDoc?.content) return "";
    const match = architectureDoc.content.match(/```mermaid([\s\S]*?)```/);
    return match?.[1]?.trim() || "";
  }, [architectureDoc?.content, architectureFailed]);

  const resolvedTab = useMemo(() => {
    if (activeDiagram === "ai" && !embeddedMermaid) {
      return "layers";
    }
    return activeDiagram;
  }, [activeDiagram, embeddedMermaid]);

  const diagramSource = useMemo(() => {
    const raw =
      resolvedTab === "ai"
        ? embeddedMermaid
        : resolvedTab === "layers"
          ? buildLayerMermaid(graph.edges)
          : buildDependencyMermaid(graph.nodes, graph.edges);
    return raw ? sanitizeMermaid(raw) : "";
  }, [embeddedMermaid, graph, resolvedTab]);

  const tocItems = useMemo(() => {
    if (!articleContent) return [];
    return articleContent
      .split("\n")
      .filter((l) => l.startsWith("## "))
      .map((l) => l.slice(3).trim())
      .slice(0, 12);
  }, [articleContent]);

  const techStack = useMemo(() => {
    const allText = documents.map((d) => d.content || "").join(" ");
    return KNOWN_TECH.filter((t) => allText.includes(t));
  }, [documents]);

  const handleSelectProject = (p: Project) => {
    router.push(`/project/${p.id}/architecture`);
  };

  async function handleSync() {
    if (!project) return;
    setSyncing(true);
    try {
      await apiRequest(`/projects/${project.id}/analysis-runs`, {
        method: "POST",
      });
      alert("Analysis run triggered successfully in background!");
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  }

  async function handleRegenerate() {
    if (!project) return;
    setRegenerating(true);
    try {
      const res = await regenerateDocument(project.id, "architecture");
      if (res.status === 200 && res.data) {
        // Update the documents state
        setDocuments((prev) => {
          const filtered = prev.filter(
            (d) => d.document_type !== "architecture",
          );
          return [...filtered, res.data];
        });
        alert("Architecture regenerated successfully!");
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

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#1a73e8] border-t-transparent" />
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
          className="mt-4 rounded-xl bg-[#1a73e8] px-4 py-2 text-white"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Header
        project={project}
        onSelectProject={handleSelectProject}
        projectsList={projectsList}
      />

      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6">
        {[
          {
            icon: OverviewIcon,
            label: "Overview",
            href: `/project/${projectId}`,
          },
          {
            icon: GlobeIcon,
            label: "Documentation",
            href: `/project/${projectId}/documentation`,
          },
          {
            icon: ArchitectureIcon,
            label: "Architecture",
            href: `/project/${projectId}/architecture`,
            active: true,
          },
          { icon: ChangesIcon, label: "Changes", href: "#" },
          { icon: AIWorkspaceIcon, label: "AI Workspace", href: "#" },
          { icon: SettingsIcon, label: "Settings", href: "#" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[13px] font-medium transition ${
              tab.active
                ? "border-[#1a73e8] text-[#1a73e8] dark:text-blue-400"
                : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden scroll-thin ">
        <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-950">
          <div className="p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  System Architecture
                </h1>
                <p className="mt-2 text-[14.5px] text-slate-500 dark:text-neutral-400">
                  Generated from the analyzed codebase of {project.name} —{" "}
                  {graph.nodes.length} files, {graph.edges.length} import
                  relationships.
                </p>
              </div>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition"
              >
                <svg
                  className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3"
                  />
                </svg>
                {regenerating ? "Regenerating..." : "Regenerate"}
              </button>
            </div>

            {architectureFailed && architectureDoc && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">
                    The AI-written architecture document failed to generate
                  </span>{" "}
                  (provider limit reached). Diagrams below are built directly
                  from the project&apos;s knowledge graph. Run{" "}
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="font-semibold underline hover:no-underline disabled:opacity-50"
                  >
                    {regenerating ? "Regenerating..." : "Regenerate Now"}
                  </button>{" "}
                  to retry generation.
                </div>
              </div>
            )}

            {graph.nodes.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-neutral-900/60 p-1.5 rounded-md border border-slate-100 dark:border-neutral-800/80 w-fit">
                {embeddedMermaid && (
                  <button
                    onClick={() => setActiveDiagram("ai")}
                    className={`rounded-md px-4 py-2 text-[13px] font-medium transition ${
                      resolvedTab === "ai"
                        ? "bg-white dark:bg-neutral-800 text-slate-800 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-neutral-700/50"
                        : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    AI Generated
                  </button>
                )}
                <button
                  onClick={() => setActiveDiagram("layers")}
                  className={`rounded-md px-4 py-2 text-[13px] font-medium transition ${
                    resolvedTab === "layers"
                      ? "bg-white dark:bg-neutral-800 text-slate-800 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-neutral-700/50"
                      : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
                  }`}
                >
                  Layered Overview
                </button>
                <button
                  onClick={() => setActiveDiagram("dependencies")}
                  className={`rounded-lg px-4 py-2 text-[13px] font-medium transition ${
                    resolvedTab === "dependencies"
                      ? "bg-white dark:bg-neutral-800 text-slate-800 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-neutral-700/50"
                      : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
                  }`}
                >
                  File Dependency Graph
                </button>
              </div>
            )}

            {diagramSource ? (
              <ErrorBoundary
                key={diagramSource}
                fallback={
                  <div className="my-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-6 text-center">
                    <AlertIcon className="mx-auto h-8 w-8 text-red-500" />
                    <h4 className="mt-2 text-sm font-semibold text-slate-800 dark:text-neutral-200">
                      Mermaid Render Error
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                      The diagram syntax is incompatible with the renderer.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveDiagram("layers")}
                        className="rounded-lg bg-slate-200/80 dark:bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-300 dark:hover:bg-neutral-700 transition"
                      >
                        View Layered Overview
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDiagram("dependencies")}
                        className="rounded-lg bg-slate-200/80 dark:bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-300 dark:hover:bg-neutral-700 transition"
                      >
                        View File Dependency Graph
                      </button>
                    </div>
                  </div>
                }
              >
                <MermaidDiagram
                  chart={diagramSource}
                  onFallback={(fallbackTab) => setActiveDiagram(fallbackTab)}
                />
              </ErrorBoundary>
            ) : (
              <div className="mb-10 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-neutral-800 p-8 text-center">
                <ArchitectureIcon className="h-8 w-8 text-slate-300 dark:text-neutral-600" />
                <p className="mt-3 text-[14px] font-medium text-slate-700 dark:text-neutral-300">
                  No architecture data yet
                </p>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-neutral-500">
                  Run an analysis to generate the knowledge graph and diagrams.
                </p>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="mt-4 rounded-lg bg-[#1a73e8] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1557b0] disabled:opacity-60"
                >
                  {syncing ? "Running..." : "Run Analysis"}
                </button>
              </div>
            )}

            {articleContent && (
              <article className="mt-8">
                <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
                  {articleDoc?.document_type === "architecture"
                    ? "Architecture Overview"
                    : "Project Overview"}
                </h2>
                <MarkdownContent content={articleContent} />
              </article>
            )}
          </div>
        </div>

        <div className="hidden lg:block w-[280px] shrink-0 overflow-y-auto border-l border-slate-200 dark:border-neutral-800 bg-slate-50/40 dark:bg-neutral-950/40">
          <div className="p-6">
            {/* Document Info */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500">
                Document
              </h3>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                    Type
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                    {articleDoc?.document_type === "architecture"
                      ? "Architecture"
                      : "Project Summary"}
                  </p>
                </div>

                {articleDoc?.updated_at && (
                  <div>
                    <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                      Updated
                    </p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-neutral-300">
                      {new Date(articleDoc.updated_at).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TOC */}
            {tocItems.length > 0 && (
              <div className="mt-8 border-t border-slate-200 pt-6 dark:border-neutral-800">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500">
                  On this page
                </h3>

                <nav className="mt-3 space-y-1">
                  {tocItems.map((item) => (
                    <a
                      key={item}
                      href={`#${slugify(item)}`}
                      className="
                        block
                        border-l-2
                        border-transparent
                        py-1.5
                        pl-3
                        text-[13px]
                        text-slate-600
                        transition-colors
                        hover:border-slate-300
                        hover:text-slate-900
                        dark:text-neutral-400
                        dark:hover:border-neutral-600
                        dark:hover:text-white
                      "
                    >
                      <span className="block truncate">{item}</span>
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Codebase Stats */}
            {graph.nodes.length > 0 && (
              <div className="mt-8 border-t border-slate-200 pt-6 dark:border-neutral-800">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500">
                  Codebase
                </h3>

                <div className="mt-4 space-y-3 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">
                      Files
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {graph.nodes.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">
                      Imports
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {graph.edges.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">
                      Classes
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {graph.nodes.reduce((s, n) => s + n.classes, 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">
                      Functions
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {graph.nodes.reduce((s, n) => s + n.functions, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="mt-8 border-t border-slate-200 pt-6 dark:border-neutral-800">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500">
                  Tech Stack
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        text-slate-700
                        dark:bg-neutral-900
                        dark:text-neutral-300
                      "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
