"use client";

import { useEffect, useRef, useState } from "react";
import {
  suggestions,
  projectSuggestions,
  recentActivity,
  projects,
  type Project,
  getTechIcon,
} from "@/lib/data";
import ProjectSwitcher from "@/components/ProjectSwitcher";
import { useSidebarContext } from "@/lib/SidebarContext";
import { ThemeToggle } from "@/components/ThemeProvider";
import {
  SparkleIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
  SendIcon,
  ShareIcon,
  HistoryIcon,
  RefreshIcon,
  CloseIcon,
  InfoIcon,
  FlowIcon,
  DatabaseIcon,
  ClockIcon,
  ShieldIcon,
  AlertIcon,
  CodeIcon,
  HexagonIcon,
  DocIcon,
  CommitIcon,
  BookIcon,
} from "@/components/icons";
import { useAuth } from "@/lib/useAuth";
import { apiRequest, getApiBaseUrl } from "@/lib/api";
import { getProjectIcon } from "@/lib/data";
import Header from "./Header";

type Msg = { id: number; role: string; content: string; sources?: string[]; failed?: boolean; model_name?: string };

const suggestionIcons = {
  flow: FlowIcon,
  database: DatabaseIcon,
  clock: ClockIcon,
  shield: ShieldIcon,
  alert: AlertIcon,
  code: CodeIcon,
} as const;

const suggestionColors: Record<string, string> = {
  indigo: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  green:
    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  violet: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
  blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  red: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
  sky: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
};

const activityIcons = {
  doc: DocIcon,
  commit: CommitIcon,
  book: BookIcon,
} as const;

const activityColors: Record<string, string> = {
  blue: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  green: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
  violet: "text-sky-500 bg-sky-50 dark:bg-sky-950/30",
};

export default function DocuMind() {
  const { loading: authLoading } = useAuth();
  const {
    activeSessionId,
    setSessions: setSidebarSessions,
    setActiveSessionId,
    setOnSessionSelect,
    setOnNewChat,
  } = useSidebarContext();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const autoSelectDoneRef = useRef<Record<string, boolean>>({});

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<
    { session_id: string; title: string; created_at: string }[]
  >([]);
  const [stats, setStats] = useState<{ label: string; value: string }[]>([
    { label: "Files", value: "0" },
    { label: "Lines of Code", value: "0" },
    { label: "Endpoints", value: "0" },
  ]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ file_path: string; details: string; code: string } | null>(null);
  const [fileLoading, setFileLoading] = useState(false);

  const handleSelectSource = async (sourcePath: string) => {
    if (!project) return;
    setDrawerOpen(true);
    setFileLoading(true);
    setFileDetails(null);
    try {
      const { apiRequest } = await import("@/lib/api");
      const res = await apiRequest(`/projects/${project.id}/files/detail?file_path=${encodeURIComponent(sourcePath)}`);
      if (res.status === 200 && res.data) {
        setFileDetails(res.data);
      } else {
        console.error("Failed to fetch file details:", res.message);
      }
    } catch (err) {
      console.error("Error fetching file details:", err);
    } finally {
      setFileLoading(false);
    }
  };

  const inHome = messages.length === 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  const projectColorMap: Record<string, string> = {
    emerald:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    indigo: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    violet: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
    sky: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
  };

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await apiRequest("/projects");
        if (res.status === 200 && Array.isArray(res.data)) {
          const mapped = res.data.map((p: any, idx: number) => ({
            id: String(p.id),
            name: p.name,
            description: p.description || "No description",
            stack: p.technology_stack || [],
            branch: "main",
            synced: "Just now",
            files: "Analyzed",
            color: ["emerald", "indigo", "violet", "sky"][idx % 4] || "indigo",
          }));
          setProjectsList(mapped);
          if (mapped.length > 0) {
            setProject(mapped[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    }
    if (!authLoading) {
      loadProjects();
    }
  }, [authLoading]);

  useEffect(() => {
    async function loadSessions() {
      if (!project) return;
      try {
        const res = await apiRequest(`/projects/${project.id}/chat/sessions`);
        if (res.status === 200 && Array.isArray(res.data)) {
          setSessions(res.data);
          setSidebarSessions(res.data);
          // Auto-select session
          const projId = project.id;
          if (res.data.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const querySessionId = urlParams.get("session");
            const targetSessionId = querySessionId || activeSessionId || res.data[0].session_id;
            const sessionExists = res.data.some((s) => s.session_id === targetSessionId);
            const finalSessionId = sessionExists ? targetSessionId : res.data[0].session_id;

            if (!autoSelectDoneRef.current[projId] || querySessionId || activeSessionId) {
              autoSelectDoneRef.current[projId] = true;
              selectSession(finalSessionId, res.data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
      }
    }
    async function loadStats() {
      if (!project) return;
      try {
        const res = await apiRequest(`/projects/${project.id}`);
        if (res.status === 200 && res.data) {
          const p = res.data;
          const s = p.stats || {};
          setStats([
            { label: "Files", value: String(s.files ?? 0) },
            { label: "Lines of Code", value: String(s.lines_of_code ?? 0) },
            { label: "Endpoints", value: String(s.routes ?? 0) },
          ]);
          setTechStack(p.technology_stack || []);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    loadSessions();
    loadStats();
  }, [project]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleSessionDeleted = (e: Event) => {
      const sessionId = (e as CustomEvent).detail?.sessionId;
      if (sessionId) {
        setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
        if (currentSessionId === sessionId) {
          startNewChat();
        }
      }
    };
    window.addEventListener("session_deleted", handleSessionDeleted);
    return () =>
      window.removeEventListener("session_deleted", handleSessionDeleted);
  }, [currentSessionId]);

  async function selectSession(sessionId: string, fallbackSessions?: any[]) {
    if (!project) return;
    setCurrentSessionId(sessionId);
    setLoading(true);
    try {
      const res = await apiRequest(
        `/projects/${project.id}/chat/sessions/${sessionId}`,
      );
      if (res.status === 200 && Array.isArray(res.data)) {
        const formatted = res.data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          sources: m.sources || [],
        }));
        setMessages(formatted);
        const list = fallbackSessions || sessions;
        const s = list.find((x) => x.session_id === sessionId);
        if (s) setChatTitle(s.title);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    setMessages([]);
    setCurrentSessionId(null);
    setChatTitle("");
  }

  async function handleDeleteMessage(messageId: number) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const { deleteChatMessage } = await import("@/lib/api");
      const res = await deleteChatMessage(messageId);
      if (res.status === 200) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } else {
        alert(res.message || "Failed to delete message");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
    }
  }

  useEffect(() => {
    setActiveSessionId(currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    setOnSessionSelect(selectSession);
    setOnNewChat(startNewChat);
    return () => {
      setOnSessionSelect(null);
      setOnNewChat(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, sessions]);

  async function send(content: string) {
    const text = content.trim();
    if (!text || loading || !project) return;
    setInput("");
    setLoading(true);

    const userMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: text },
    ]);

    const activeSession = currentSessionId || "session_" + Date.now();
    if (!currentSessionId) {
      setCurrentSessionId(activeSession);
      setChatTitle(text.substring(0, 30) + "...");
    }

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = getApiBaseUrl();

      const response = await fetch(
        `${API_BASE_URL}/projects/${project.id}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: text, session_id: activeSession }),
        },
      );

      if (!response.body) {
        throw new Error("No response body from stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      const assistantMsgId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "", sources: [] },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            const dataStr = line.trim().slice(6).trim();
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.sources) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, sources: parsed.sources }
                      : m,
                  ),
                );
              } else if (parsed.model_name) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, model_name: parsed.model_name }
                      : m,
                  ),
                );
              } else if (parsed.content) {
                assistantText += parsed.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: assistantText }
                      : m,
                  ),
                );
              }
            } catch (e) {
              // Ignore line parse errors
            }
          }
        }
      }

      const hasFailedText = assistantText.includes("fallback failed") || 
                            assistantText.includes("Error during streaming") || 
                            assistantText.includes("Error during generation") ||
                            assistantText.trim() === "";
      if (hasFailedText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, failed: true }
              : m,
          ),
        );
      }

      const resSessions = await apiRequest(
        `/projects/${project.id}/chat/sessions`,
      );
      if (resSessions.status === 200 && Array.isArray(resSessions.data)) {
        setSessions(resSessions.data);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content:
            err.message || "Sorry, I couldn't reach the server. Try again.",
          failed: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry(failedMsgId: number) {
    const index = messages.findIndex((m) => m.id === failedMsgId);
    if (index === -1) return;

    let userText = "";
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        userText = messages[i].content;
        break;
      }
    }

    if (!userText) return;

    setMessages((prev) => prev.filter((m) => m.id !== failedMsgId));
    await send(userText);
  }

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 overflow-hidden">
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/*<header className="flex h-[68px] shrink-0 items-center justify-between bg-white dark:bg-neutral-950 px-6">
          <ProjectSwitcher
            selected={project}
            onSelect={setProject}
            projectsList={projectsList}
          />
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-neutral-700 px-3.5 py-2 text-[13.5px] font-medium text-slate-600 dark:text-neutral-300 transition hover:bg-slate-50 dark:hover:bg-neutral-800">
              <ShareIcon className="h-[16px] w-[16px]" />
              Share
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 transition hover:bg-slate-50 dark:hover:bg-neutral-800">
              <HistoryIcon className="h-[17px] w-[17px]" />
            </button>
            <ThemeToggle />
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="user"
              className="h-9 w-9 rounded-full object-cover"
            />
          </div>
        </header>*/}

        <Header
          project={project}
          onSelectProject={setProject}
          projectsList={projectsList}
        />
        <div ref={scrollRef} className="scroll-thin flex-1 overflow-y-auto">
          {!project ? (
            <div className="flex min-h-full flex-col items-center justify-center p-6 text-center">
              <SparkleIcon className="size-16 text-blue-500 animate-pulse mb-4" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-neutral-100">
                No Projects Found
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400 max-w-[360px]">
                Please go to Projects and connect a repository to start chatting
                with your codebase.
              </p>
              <a
                href="/project"
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Go to Projects
              </a>
            </div>
          ) : inHome ? (
            <HomeView onPick={send} projectType={project?.project_type} />
          ) : (
            <ChatView
              title={chatTitle}
              messages={messages}
              loading={loading}
              onDeleteMessage={handleDeleteMessage}
              onSelectSource={handleSelectSource}
              onRetry={handleRetry}
            />
          )}
        </div>

        {!inHome && project && (
          <div className="shrink-0 bg-white dark:bg-neutral-950 px-6 py-5">
            <div className="mx-auto max-w-[820px]">
              <Composer
                value={input}
                setValue={setInput}
                onSend={() => send(input)}
                loading={loading}
              />
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500 dark:text-neutral-400">
                <InfoIcon className="size-3.5" />
                DocuMind can make mistakes. Please verify important information.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Collapsible */}
      <aside
        className={`${
          sidebarOpen ? "w-[280px]" : "w-0"
        } shrink-0 overflow-hidden transition-all duration-300 ease-in-out  bg-white dark:bg-neutral-950`}
      >
        <div className="h-full overflow-y-auto px-5 py-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Context
            </h2>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:hover:text-neutral-300"
              aria-label="Close sidebar"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Project */}
          <section className="mt-6">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-neutral-500">
              Project
            </div>

            {project ? (
              <div>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${projectColorMap[project.color]}`}
                  >
                    <img
                      src={getProjectIcon(project.stack)}
                      alt=""
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">
                      {project.name}
                    </p>

                    <p className="truncate text-[12px] text-slate-500 dark:text-neutral-400">
                      {project.branch}
                    </p>
                  </div>
                </div>

                {project.description && (
                  <p className="mt-3 text-[12px] leading-5 text-slate-600 dark:text-neutral-400">
                    {project.description}
                  </p>
                )}

                <p className="mt-2 text-[11px] text-slate-500 dark:text-neutral-400">
                  Last synced {project.synced}
                </p>
              </div>
            ) : (
              <p className="text-[12px] text-slate-500 dark:text-neutral-400">
                No project selected
              </p>
            )}
          </section>

          <div className="my-8" />

          {/* Stats */}
          <section>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-neutral-500">
              Codebase
            </div>

            <div className="space-y-2">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-[12.5px] text-slate-600 dark:text-neutral-400">
                    {s.label}
                  </span>

                  <span className="text-[12.5px] font-semibold text-slate-900 dark:text-white tabular-nums">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="my-8" />

          {/* Technologies */}
          <section>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-neutral-500">
              Technologies
            </div>

            <div className="flex flex-wrap gap-1.5">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-neutral-800 px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-neutral-300"
                >
                  <img
                    src={getTechIcon(t)}
                    alt={t}
                    className="h-3 w-3 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/javascript.svg";
                    }}
                  />
                  {t}
                </span>
              ))}
            </div>
          </section>

          <div className="my-8" />

          {/* Activity */}
          <section>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-neutral-500">
              Recent Activity
            </div>

            <div className="space-y-3">
              {recentActivity.map((a) => {
                const Icon =
                  activityIcons[a.icon as keyof typeof activityIcons];

                return (
                  <div key={a.text} className="flex gap-2.5">
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${activityColors[a.color]}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] leading-5 text-slate-700 dark:text-neutral-300">
                        {a.text}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-neutral-400">
                        {a.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </aside>

      {/* Sidebar Toggle Button - visible when closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="shrink-0 border-l border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-4 text-slate-400 transition hover:text-slate-600 dark:hover:text-neutral-300"
          aria-label="Open sidebar"
        >
          <svg
            className="h-5 w-5 rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {/* File Detail Drawer overlay */}
      <FileDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        fileDetails={fileDetails}
        loading={fileLoading}
      />
    </div>
  );
}

/* ---- Sub components ---- */

function HomeView({ onPick, projectType }: { onPick: (q: string) => void; projectType?: string }) {
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("username");
      if (stored) setUserName(stored);
    }
  }, []);

  return (
    <div className="mx-auto flex min-h-full max-w-[840px] flex-col px-6">
      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center">
            <SparkleIcon className="size-16 text-blue-500" />
            <h1 className="font-display bg-clip-text text-[40px] font-semibold leading-none text-blue-600 dark:text-blue-400">
              Hello, {userName}
            </h1>
          </div>
          <p className="font-display text-3xl font-medium text-slate-500 dark:text-neutral-400">
            How can I help you today?
          </p>
        </div>

        <div className="mx-auto w-full max-w-[680px]">
          <Composer
            value={input}
            setValue={setInput}
            onSend={() => {
              if (input.trim()) onPick(input);
              setInput("");
            }}
          />
        </div>

        <div className="mx-auto mt-6 grid w-full max-w-[680px] grid-cols-1 gap-3.5 sm:grid-cols-2">
          {(projectSuggestions[projectType || "backend"] || projectSuggestions["backend"]).map((s) => {
            const Icon =
              suggestionIcons[s.icon as keyof typeof suggestionIcons];
            return (
              <button
                key={s.title}
                onClick={() => onPick(s.title)}
                className="group flex items-start gap-3 rounded-lg bg-white dark:bg-neutral-950 p-4 text-left transition hover:bg-slate-200 dark:hover:bg-neutral-900"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${suggestionColors[s.color]}`}
                >
                  <Icon className="size-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-800 dark:text-neutral-100">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-slate-500 dark:text-neutral-400">
                    {s.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 pb-6 text-center text-xs text-slate-500 dark:text-neutral-400">
        <InfoIcon className="size-3.5" />
        DocuMind can make mistakes. Please verify important information.
      </p>
    </div>
  );
}

function formatMarkdown(text: string) {
  let h2Counter = 0;
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const lang = match ? match[1] : "";
      const code = match ? match[2] : part.slice(3, -3);
      return (
        <pre
          key={index}
          className="my-3 overflow-x-auto rounded-lg bg-slate-900 dark:bg-neutral-800 p-4 text-[13.5px] font-mono text-slate-100 dark:text-neutral-200"
        >
          <code>{code}</code>
        </pre>
      );
    }

    let html = part;
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(
      /`(.*?)`/g,
      "<code class='rounded bg-slate-100 dark:bg-neutral-800 px-1 py-0.5 font-mono text-[13px] text-slate-800 dark:text-neutral-200'>$1</code>",
    );

    html = html.replace(
      /^###\s+(.*?)$/gm,
      "<h3 class='text-sm font-bold text-slate-900 dark:text-neutral-100 mt-4 mb-2'>$1</h3>",
    );
    html = html.replace(/^##\s+(.*?)$/gm, (match, p1) => {
      h2Counter++;
      return `<h2 class='text-base font-bold text-slate-900 dark:text-neutral-100 mt-5 mb-3'>${h2Counter}. ${p1}</h2>`;
    });
    html = html.replace(
      /^#\s+(.*?)$/gm,
      "<h1 class='text-lg font-bold text-slate-900 dark:text-neutral-100 mt-6 mb-4'>$1</h1>",
    );

    html = html.replace(/^\s*-\s+(.*?)$/gm, "<li>$1</li>");
    if (html.includes("<li>")) {
      html = `<ul class='list-disc pl-5 my-2 space-y-1'>${html}</ul>`;
    }

    html = html.replace(/\n/g, "<br />");
    html = html.replace(/(<\/h[1-3]>)\s*<br \/>/g, "$1");
    html = html.replace(/(<\/ul>)\s*<br \/>/g, "$1");
    html = html.replace(/(<\/li>)\s*<br \/>/g, "$1");
    html = html.replace(/(<li>)\s*<br \/>/g, "$1");

    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

function ChatView({
  title,
  messages,
  loading,
  onDeleteMessage,
  onSelectSource,
  onRetry,
}: {
  title: string;
  messages: Msg[];
  loading: boolean;
  onDeleteMessage: (messageId: number) => void;
  onSelectSource: (source: string) => void;
  onRetry: (messageId: number) => void;
}) {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-8">
      {title && (
        <h2 className="font-display mb-6 text-[22px] font-semibold text-slate-800 dark:text-neutral-100">
          {title}
        </h2>
      )}
      <div className="space-y-6">
        {messages.map((m) => (
          <div key={m.id} className="animate-fade-up flex gap-3.5">
            {m.role === "assistant" ? (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40">
                <SparkleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <img
                src="https://i.pravatar.cc/80?img=12"
                alt="me"
                className="h-8 w-8 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1 group/msg relative">
              <div className="flex items-center justify-between">
                <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-neutral-300">
                  {m.role === "assistant" ? "DocuMind" : "You"}
                </p>
                <div className="flex items-center gap-1">
                  {m.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => onRetry(m.id)}
                      className="opacity-0 group-hover/msg:opacity-100 p-1 text-slate-400 hover:text-blue-500 dark:text-neutral-500 dark:hover:text-blue-400 transition rounded hover:bg-slate-100 dark:hover:bg-neutral-800"
                      title="Regenerate response"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteMessage(m.id)}
                    className="opacity-0 group-hover/msg:opacity-100 p-1 text-slate-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition rounded hover:bg-slate-100 dark:hover:bg-neutral-800"
                    title="Delete message"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-[14.5px] leading-relaxed text-slate-600 dark:text-neutral-300 space-y-1">
                {formatMarkdown(m.content)}
              </div>
              {m.failed && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-red-200/50 bg-red-50/40 p-3 text-[13px] text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                  <div className="flex-1 leading-relaxed">
                    Something went wrong. Both NVIDIA and Pollinations LLM attempts failed.
                  </div>
                  <button
                    onClick={() => onRetry(m.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-red-100/70 hover:bg-red-200/80 dark:bg-red-950/50 dark:hover:bg-red-900/50 px-3 py-1.5 text-xs font-semibold transition cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="size-3.5"
                    >
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                    Retry Query
                  </button>
                </div>
              )}
              {m.role === "assistant" && (m.model_name || (m.sources && m.sources.length > 0)) && (
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-neutral-800/60 pt-3 text-[11px]">
                  {m.sources && m.sources.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mr-1">
                        Sources:
                      </span>
                      {m.sources.map((src, i) => {
                        const isFile = src.includes(".") || src.includes("/");
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onSelectSource(src)}
                            className="inline-flex items-center gap-1.25 rounded-md bg-slate-50 dark:bg-neutral-900/60 border border-slate-200/60 dark:border-neutral-800/80 px-2 py-0.75 font-mono text-slate-600 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-blue-400 transition cursor-pointer"
                            title={src}
                          >
                            {isFile ? (
                              <CodeIcon className="h-3 w-3 shrink-0 text-slate-400" />
                            ) : (
                              <DocIcon className="h-3 w-3 shrink-0 text-slate-400" />
                            )}
                            {src.includes("/") ? src.split("/").pop() : src}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {m.model_name && (
                    <span className="ml-auto text-slate-400/80 dark:text-neutral-500 font-medium">
                      Generated by: <span className="font-semibold text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-900/60 px-1.5 py-0.5 rounded-md">{m.model_name}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40">
              <SparkleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1 pt-2.5">
              <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-blue-400 dark:bg-blue-500"
      style={{ animationDelay: delay }}
    />
  );
}

function Composer({
  value,
  setValue,
  onSend,
  loading,
}: {
  value: string;
  setValue: (v: string) => void;
  onSend: () => void;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-gray-100 dark:bg-neutral-900 p-3 transition focus-within:border-slate-300 dark:focus-within:border-neutral-600">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          rows={1}
          placeholder="Ask anything about your codebase..."
          className="max-h-40 flex-1 resize-none bg-transparent px-2.5 py-2 text-[15px] text-slate-700 dark:text-neutral-200 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none"
        />
        <button
          onClick={onSend}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 transition hover:bg-blue-200 dark:hover:bg-blue-900/40 disabled:opacity-60"
        >
          <SendIcon className="h-[17px] w-[17px]" />
        </button>
      </div>
    </div>
  );
}

function FileDetailDrawer({
  isOpen,
  onClose,
  fileDetails,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  fileDetails: { file_path: string; details: string; code: string } | null;
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"code" | "details">("code");
  const [copied, setCopied] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setActiveTab("code");
      setCopied(false);
      const raf = requestAnimationFrame(() => {
        setAnimate(true);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleCopy = () => {
    if (!fileDetails?.code) return;
    navigator.clipboard.writeText(fileDetails.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileName = fileDetails ? fileDetails.file_path.split("/").pop() : "";

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-slate-950/20 dark:bg-black/50 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content */}
      <div
        className={`relative flex h-full w-full max-w-[760px] flex-col bg-white dark:bg-neutral-950 border-l border-slate-100 dark:border-neutral-900 shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] transform transition-transform duration-300 ease-out z-10 ${
          animate ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60 px-7 py-4.5">
          <div className="min-w-0 flex-1 mr-4 flex items-center gap-3.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              <CodeIcon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-800 dark:text-neutral-100 tracking-tight">
                {fileName || "Loading File..."}
              </h3>
              <p className="truncate text-xs font-mono text-slate-400 dark:text-neutral-500 mt-0.5">
                {fileDetails ? fileDetails.file_path : "Locating source chunks..."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-300 transition"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-neutral-950/25">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="mt-3 text-sm text-slate-500 dark:text-neutral-400">Reconstructing file content...</p>
          </div>
        ) : !fileDetails ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <p className="text-sm text-slate-500 dark:text-neutral-400">Failed to load file details.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-neutral-900/60 px-7">
              <button
                onClick={() => setActiveTab("code")}
                className={`border-b-2 px-4.5 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "code"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                }`}
              >
                Code View
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`border-b-2 px-4.5 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                }`}
              >
                AI Detail Summary
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-7 bg-slate-50/20 dark:bg-neutral-950/20">
              {activeTab === "code" ? (
                <div className="h-full flex flex-col">
                  {fileDetails.code ? (
                    <div className="relative flex flex-col flex-1 rounded-xl border border-slate-200/70 bg-slate-950 dark:border-neutral-900/80 dark:bg-[#0c0c0d] overflow-hidden">
                      {/* Fake Terminal Header */}
                      <div className="flex items-center justify-between px-4.5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 dark:bg-neutral-900/40 dark:border-neutral-900 z-10">
                        <span className="text-[11px] font-mono text-slate-400/80 dark:text-neutral-500 font-medium">
                          {fileName}
                        </span>
                        <button
                          onClick={handleCopy}
                          className="rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300 transition z-10"
                        >
                          {copied ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                      <div className="flex-1 p-5 overflow-auto max-h-[580px]">
                        <pre className="text-xs font-mono leading-relaxed text-slate-300 dark:text-neutral-200 whitespace-pre">
                          <code>{fileDetails.code}</code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 py-16 text-sm text-slate-400 dark:text-neutral-500">
                      No code content available (this might be a non-text binary file or folder).
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-neutral-900/60 dark:bg-neutral-900/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-3.5">
                      Functional & Structure Breakdown
                    </h4>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
                      {fileDetails.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
