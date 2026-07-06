"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogoIcon,
  PlusIcon,
  ChatIcon,
  ProjectsIcon,
  KnowledgeIcon,
  IntegrationsIcon,
  GearIcon,
  MoreIcon,
} from "@/components/icons";
import { useSidebarContext } from "@/lib/SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const isProjectPage =
    pathname === "/project" || pathname.startsWith("/project/");
  const isChatPage = pathname === "/";

  const router = useRouter();
  const {
    sessions,
    setSessions,
    activeSessionId,
    setActiveSessionId,
    onSessionSelect,
    onNewChat,
  } = useSidebarContext();

  const [userName, setUserName] = useState("User");
  const [showSettings, setShowSettings] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [saving, setSaving] = useState(false);

  // Collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const projectIdMatch = pathname.match(/\/project\/([a-zA-Z0-9_-]+)/);
  const projectId = projectIdMatch ? projectIdMatch[1] : null;

  useEffect(() => {
    async function loadSidebarSessions() {
      if (!projectId) return;
      try {
        const { apiRequest } = await import("@/lib/api");
        const res = await apiRequest(`/projects/${projectId}/chat/sessions`);
        if (res.status === 200 && Array.isArray(res.data)) {
          setSessions(res.data);
        }
      } catch (err) {
        console.error("Failed to load sidebar sessions", err);
      }
    }
    loadSidebarSessions();
  }, [projectId]);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("username");
      if (stored) {
        setUserName(stored);
        setNewUserName(stored);
      }
    };
    handleUpdate();
    window.addEventListener("profile_updated", handleUpdate);
    return () => window.removeEventListener("profile_updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (showSettings) {
      const stored = localStorage.getItem("username");
      if (stored) setNewUserName(stored);
    }
  }, [showSettings]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || saving) return;
    setSaving(true);
    try {
      const { apiRequest } = await import("@/lib/api");
      const res = await apiRequest("/auth/me", {
        method: "PUT",
        body: JSON.stringify({ username: newUserName }),
      });
      if (res.status === 200) {
        localStorage.setItem("username", newUserName.trim());
        setUserName(newUserName.trim());
        setShowSettings(false);
        window.dispatchEvent(new Event("profile_updated"));
      } else {
        alert(res.message || "Failed to update username");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setSaving(false);
    }
  };

  // Reusable class for smoothly hiding text when collapsed
  const textHiddenClass = `overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
  }`;

  return (
    <aside
      className={`flex shrink-0 flex-col  bg-white dark:bg-neutral-950 transition-all duration-300 ease-in-out overflow-hidden ${
        isCollapsed ? "w-[72px]" : "w-[252px]"
      }`}
    >
      {/* Brand & Toggle Header */}
      <div
        className={`flex h-[64px] items-center transition-all duration-300 ${
          isCollapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        {/* Logo Container - Click to Expand when collapsed */}
        <button
          type="button"
          onClick={() => {
            if (isCollapsed) setIsCollapsed(false);
          }}
          className={`flex items-center gap-2.5 overflow-hidden text-left transition-all duration-200 ${
            isCollapsed
              ? "ml-3 cursor-pointer p-2 rounded-xl active:scale-95"
              : "cursor-default"
          }`}
          title={isCollapsed ? "Click to expand sidebar" : ""}
        >
          <LogoIcon className="h-7 w-7 shrink-0 text-blue-600 dark:text-blue-400" />
          <span
            className={`font-display text-[19px] font-semibold tracking-tight text-slate-900 dark:text-white ${textHiddenClass}`}
          >
            DocuMind
          </span>
        </button>

        {/* Collapse Toggle Arrow - Hidden when collapsed so logo is centered */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-600 dark:hover:text-neutral-200 transition"
            title="Collapse sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                d="M11 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="px-3.5">
        {isChatPage && onNewChat ? (
          <button
            onClick={onNewChat}
            title="New Chat"
            className={`flex w-full items-center rounded-xl bg-blue-50/85 dark:bg-blue-500/10 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 transition hover:bg-blue-100/80 dark:hover:bg-blue-500/20 ${
              isCollapsed ? "justify-center px-0" : "justify-between px-3.5"
            }`}
          >
            <PlusIcon className="h-4 w-4 shrink-0" />
            <span className={`${textHiddenClass}`}>New Chat</span>
            {!isCollapsed && (
              <span className="rounded border border-blue-200 dark:border-blue-500/35 bg-white dark:bg-neutral-900 px-1.5 py-0.5 text-[10.5px] font-semibold">
                ⌘K
              </span>
            )}
          </button>
        ) : (
          <Link
            href="/"
            title="AI Chat"
            className={`flex w-full items-center rounded-xl py-2.5 text-[14px] font-medium transition ${
              isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
            } ${
              isChatPage
                ? "bg-blue-50/80 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"
            }`}
          >
            <ChatIcon className="h-[18px] w-[18px] shrink-0 text-slate-400 dark:text-neutral-500" />
            <span className={textHiddenClass}>AI Chat</span>
          </Link>
        )}

        <Link
          href="/project"
          title="Projects"
          className={`mt-1 flex w-full items-center rounded-xl py-2.5 text-[14px] font-medium transition ${
            isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
          } ${
            pathname === "/project"
              ? "bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white"
              : isProjectPage
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"
          }`}
        >
          <ProjectsIcon className="h-[18px] w-[18px] shrink-0 text-slate-400 dark:text-neutral-500" />
          <span className={textHiddenClass}>Projects</span>
        </Link>
      </div>

      {/* Sessions list — shown when expanded */}
      {!isCollapsed && (
        <div className="scroll-thin mt-4 flex-1 overflow-y-auto px-3.5">
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
            Recent Conversations
          </p>
          {sessions.length === 0 ? (
            <div className="px-2.5 py-6 text-center rounded-xl ">
              <p className="text-[12.5px] text-slate-400 dark:text-neutral-500">
                No chats yet
              </p>
              <p className="text-[11px] text-slate-300 dark:text-neutral-600 mt-0.5">
                Start a new conversation above
              </p>
            </div>
          ) : (
            Object.entries(
              sessions.reduce<Record<string, typeof sessions>>((groups, s) => {
                const diffDays = Math.ceil(
                  Math.abs(Date.now() - new Date(s.created_at).getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                const period =
                  diffDays <= 1
                    ? "Today"
                    : diffDays <= 2
                      ? "Yesterday"
                      : "Previous Chats";
                if (!groups[period]) groups[period] = [];
                groups[period].push(s);
                return groups;
              }, {}),
            ).map(([period, items]) => (
              <div key={period} className="mt-3">
                <p className="px-2.5 pb-1 text-[11px] font-medium text-slate-400 dark:text-neutral-500">
                  {period}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = activeSessionId === item.session_id;
                    return (
                      <div
                        key={item.session_id}
                        className={`group/item flex w-full items-center justify-between rounded-lg px-2.5 py-[5px] text-left text-[13px] transition ${
                          isActive
                            ? "bg-blue-50/80 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                            : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (onSessionSelect) {
                              onSessionSelect(item.session_id);
                            } else {
                              setActiveSessionId(item.session_id);
                              router.push(`/?session=${item.session_id}`);
                            }
                          }}
                          className="min-w-0 flex-1 truncate text-left pr-2 py-0.5"
                        >
                          {item.title}
                        </button>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Are you sure you want to delete this chat session?",
                              )
                            ) {
                              try {
                                const { deleteChatSession } =
                                  await import("@/lib/api");
                                const res = await deleteChatSession(
                                  item.session_id,
                                );
                                if (res.status === 200) {
                                  const updated = sessions.filter(
                                    (s) => s.session_id !== item.session_id,
                                  );
                                  setSessions(updated);
                                  window.dispatchEvent(
                                    new CustomEvent("session_deleted", {
                                      detail: { sessionId: item.session_id },
                                    }),
                                  );
                                } else {
                                  alert(
                                    res.message || "Failed to delete session",
                                  );
                                }
                              } catch (err) {
                                console.error(err);
                                alert("Failed to delete session");
                              }
                            }
                          }}
                          className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition rounded-md hover:bg-slate-200 dark:hover:bg-neutral-700 shrink-0"
                          title="Delete conversation"
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
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Fill remaining height when collapsed or empty */}
      {(isCollapsed || sessions.length === 0) && <div className="flex-1" />}

      {/* User Profile Footer */}
      <div className="p-3">
        <button
          onClick={() => setShowSettings(true)}
          title="Profile & Settings"
          className={`flex w-full items-center rounded-xl py-2 transition hover:bg-slate-50 dark:hover:bg-neutral-800 group text-left ${
            isCollapsed ? "justify-center px-0" : "gap-2.5 px-2"
          }`}
        >
          <img
            src="https://i.pravatar.cc/80?img=12"
            alt="User"
            className="h-9 w-9 rounded-full object-cover shrink-0"
          />
          <div className={`min-w-0 flex-1 ${textHiddenClass}`}>
            <p className="truncate text-[13.5px] font-semibold text-slate-800 dark:text-neutral-200">
              {userName}
            </p>
            <p className="truncate text-[11.5px] text-slate-400 dark:text-neutral-500">
              Edit Profile & Settings
            </p>
          </div>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xl">
            <h3 className="font-display text-[18px] font-semibold text-slate-900 dark:text-white">
              Profile Settings
            </h3>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-neutral-400">
              Update your username or sign out.
            </p>

            <form onSubmit={handleUpdateUsername} className="mt-5 space-y-4">
              <div>
                <label className="block text-[12.5px] font-medium text-slate-700 dark:text-neutral-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2 px-3 text-[13.5px] text-slate-800 dark:text-neutral-100 outline-none transition focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-neutral-700 py-2 text-[13px] font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <div className="border-t border-slate-100 dark:border-neutral-800 mt-5 pt-4">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to sign out?")) {
                    import("@/lib/api").then((m) => m.logout());
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
