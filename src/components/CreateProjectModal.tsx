"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

/* ─── Icons ─────────────────────────────────────────────── */
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  );
}
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function FolderPlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Step indicator ─────────────────────────────────────── */
function StepDot({ step, active, done }: { step: number; active: boolean; done: boolean }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300 ${
      done
        ? "bg-blue-500 text-white"
        : active
        ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/40"
        : "bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500"
    }`}>
      {done ? <CheckIcon className="h-4 w-4" /> : step}
    </div>
  );
}

/* ─── Types ─────────────────────────────────────────────── */
interface FormData {
  name: string;
  description: string;
  repository_url: string;
  isPrivate: boolean;
  access_token: string;
  entry_point_files: string;
  excluded_paths: string;
}

interface Props {
  onClose: () => void;
  onCreated: (project: any) => void;
}

/* ─── Main Modal ─────────────────────────────────────────── */
export default function CreateProjectModal({ onClose, onCreated }: Props) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [projectType, setProjectType] = useState<"github" | "local">("github");

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    repository_url: "",
    isPrivate: false,
    access_token: "",
    entry_point_files: "",
    excluded_paths: "",
  });

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  /* Detect repo name from URL */
  const handleRepoUrlChange = (url: string) => {
    set("repository_url", url);
    if (!form.name && url) {
      const match = url.match(/[/\\]([^/\\]+?)(?:\.git)?$/);
      if (match?.[1]) set("name", match[1]);
    }
  };

  const canNext1 = form.name.trim().length >= 2;
  const canSubmit = canNext1;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);

    const payload: Record<string, any> = {
      name: form.name.trim(),
    };
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.repository_url.trim()) payload.repository_url = form.repository_url.trim();
    if (form.isPrivate && form.access_token.trim()) payload.access_token = form.access_token.trim();
    if (form.entry_point_files.trim()) {
      payload.entry_point_files = form.entry_point_files
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (form.excluded_paths.trim()) {
      payload.excluded_paths = form.excluded_paths
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    try {
      const res = await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.status === 201 || res.status === 200) {
        setCreated(true);
        onCreated(res.data);
      } else {
        setError(res.message || res.detail || res.data?.detail || "Failed to create project.");
      }
    } catch (e: any) {
      setError(e.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (created) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 mb-5">
            <CheckIcon className="h-9 w-9 text-emerald-500" />
          </div>
          <h3 className="text-[22px] font-bold text-slate-900 dark:text-white">Project Created!</h3>
          <p className="mt-2 text-[14px] text-slate-500 dark:text-neutral-400 max-w-[340px]">
            <span className="font-semibold text-slate-700 dark:text-neutral-200">{form.name}</span> has been created
            {form.repository_url ? " and is being indexed in the background." : "."}
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-neutral-700 px-5 py-2.5 text-[13.5px] font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-slate-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
            <FolderPlusIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white">Create Project</h2>
            <p className="text-[12.5px] text-slate-400 dark:text-neutral-500">Connect a repo or create a local project</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 px-7 pt-5 pb-2">
        <StepDot step={1} active={step === 1} done={step > 1} />
        <div className={`h-px flex-1 transition-all duration-500 ${step > 1 ? "bg-blue-400" : "bg-slate-200 dark:bg-neutral-800"}`} />
        <StepDot step={2} active={step === 2} done={step > 2} />
        <div className={`h-px flex-1 transition-all duration-500 ${step > 2 ? "bg-blue-400" : "bg-slate-200 dark:bg-neutral-800"}`} />
        <StepDot step={3} active={step === 3} done={created} />
      </div>
      <div className="flex justify-between px-7 mb-1">
        {["Basic Info", "Repository", "Review"].map((label, i) => (
          <span key={label} className={`text-[11px] font-medium ${step === i + 1 ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-neutral-500"}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="px-7 pt-4 pb-6 space-y-5 min-h-[260px]">
        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. my-backend-api"
                className="w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
              {form.name.length > 0 && form.name.length < 2 && (
                <p className="mt-1 text-[11.5px] text-red-500">Name must be at least 2 characters.</p>
              )}
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Description <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A short description of what this project does…"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>

            {/* Quick type selector */}
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Project type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "github", label: "GitHub Repo", icon: <GitHubIcon className="h-4 w-4" />, hint: "Clone & analyze a git repo" },
                  { id: "local", label: "Local Codebase", icon: <FolderPlusIcon className="h-4 w-4" />, hint: "Provide a local directory path" },
                ].map(({ id, label, icon, hint }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setProjectType(id as "github" | "local");
                      setStep(2);
                    }}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                      projectType === id
                        ? "border-blue-500 bg-blue-50/40 dark:border-blue-500/50 dark:bg-blue-500/5"
                        : "border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5"
                    }`}
                  >
                    <div className={`mt-0.5 ${projectType === id ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-neutral-400"}`}>{icon}</div>
                    <div>
                      <p className={`text-[13px] font-semibold ${projectType === id ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-neutral-200"}`}>{label}</p>
                      <p className="text-[11.5px] text-slate-400 dark:text-neutral-500">{hint}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Repository ── */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                {projectType === "github" ? "Repository URL" : "Local Directory Path"} <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                <input
                  type="text"
                  autoFocus
                  value={form.repository_url}
                  onChange={(e) => handleRepoUrlChange(e.target.value)}
                  placeholder={projectType === "github" ? "https://github.com/org/repo" : "e.g. D:\\projects\\my-app or /home/projects/my-app"}
                  className="w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
              <p className="mt-1.5 text-[11.5px] text-slate-400 dark:text-neutral-500">
                {projectType === "github"
                  ? "Leave blank if you'll upload files manually later."
                  : "Provide the absolute path to your local directory on this machine."}
              </p>
            </div>

            {/* Private repo toggle */}
            {projectType === "github" && form.repository_url.trim() && (
              <div>
                <button
                  type="button"
                  onClick={() => set("isPrivate", !form.isPrivate)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    form.isPrivate
                      ? "border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10"
                      : "border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LockIcon className={`h-4 w-4 ${form.isPrivate ? "text-amber-500" : "text-slate-400 dark:text-neutral-500"}`} />
                    <div>
                      <p className={`text-[13px] font-semibold ${form.isPrivate ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-neutral-300"}`}>
                        Private repository
                      </p>
                      <p className="text-[11.5px] text-slate-400 dark:text-neutral-500">
                        Requires a Personal Access Token to clone
                      </p>
                    </div>
                  </div>
                  {/* Toggle pill */}
                  <div className={`relative h-5 w-9 rounded-full transition-colors ${form.isPrivate ? "bg-amber-400 dark:bg-amber-500" : "bg-slate-200 dark:bg-neutral-700"}`}>
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${form.isPrivate ? "left-[18px]" : "left-0.5"}`} />
                  </div>
                </button>

                {/* PAT field — shown only when private is on */}
                {form.isPrivate && (
                  <div className="mt-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5 p-4 space-y-3">
                    <div>
                      <label className="block text-[12px] font-semibold text-amber-700 dark:text-amber-400 mb-1.5">
                        Personal Access Token
                      </label>
                      <input
                        type="password"
                        autoComplete="off"
                        value={form.access_token}
                        onChange={(e) => set("access_token", e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="w-full rounded-lg border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-mono"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <p className="text-[11.5px] text-amber-700 dark:text-amber-400 leading-relaxed">
                        Token is used <span className="font-semibold">only during cloning</span> and is never stored in our database.{" "}
                        <a
                          href="https://github.com/settings/tokens/new?description=DocuMind&scopes=repo"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-amber-900 dark:hover:text-amber-200 transition"
                        >
                          Create a GitHub token →
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Entry Point Files <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.entry_point_files}
                onChange={(e) => set("entry_point_files", e.target.value)}
                placeholder="server.ts, main.py, index.js  (comma-separated)"
                className="w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Excluded Paths <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.excluded_paths}
                onChange={(e) => set("excluded_paths", e.target.value)}
                placeholder="node_modules, dist, .git  (comma-separated)"
                className="w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
              <p className="mt-1.5 text-[11.5px] text-slate-400 dark:text-neutral-500">
                Paths that DocuMind will skip during analysis.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="rounded-2xl border border-slate-100 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-900/50 divide-y divide-slate-100 dark:divide-neutral-800 overflow-hidden">
              <ReviewRow label="Project name" value={form.name} />
              <ReviewRow label="Description" value={form.description || "—"} muted={!form.description} />
              <ReviewRow
                label={projectType === "github" ? "Repository URL" : "Local path"}
                value={form.repository_url || "Not set"}
                muted={!form.repository_url}
              />
              {projectType === "github" && form.repository_url && (
                <ReviewRow
                  label="Visibility"
                  value={form.isPrivate ? "🔒 Private (token provided)" : "Public"}
                  muted={!form.isPrivate}
                />
              )}
              {form.entry_point_files && (
                <ReviewRow label="Entry points" value={form.entry_point_files} />
              )}
              {form.excluded_paths && (
                <ReviewRow label="Excluded paths" value={form.excluded_paths} />
              )}
            </div>

            {form.repository_url && (
              <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-4 py-3">
                <SparkleIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <p className="text-[12.5px] text-blue-700 dark:text-blue-300">
                  {projectType === "github"
                    ? "DocuMind will clone and analyze your repository in the background. This may take a few minutes."
                    : "DocuMind will copy and analyze your local directory files. This may take a few minutes."}
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-[12.5px] text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 dark:border-neutral-800 px-7 py-5">
        <button
          type="button"
          onClick={() => (step === 1 ? onClose() : setStep((s) => s - 1))}
          className="rounded-xl border border-slate-200 dark:border-neutral-700 px-5 py-2.5 text-[13.5px] font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-2.5">
          {/* Skip repo step button on step 1 */}
          {step === 1 && (
            <button
              type="button"
              disabled={!canNext1}
              onClick={() => setStep(3)}
              className="rounded-xl border border-slate-200 dark:border-neutral-700 px-5 py-2.5 text-[13.5px] font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Skip to Review
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 ? !canNext1 : false}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-[13.5px] font-semibold text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating…
                </>
              ) : (
                <>
                  <SparkleIcon className="h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

/* ─── Shell wrapper (backdrop + card) ───────────────────── */
function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[540px] rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl shadow-black/15 dark:shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}

/* ─── Review row ────────────────────────────────────────── */
function ReviewRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <span className="shrink-0 text-[12px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mt-0.5">
        {label}
      </span>
      <span className={`text-right text-[13px] font-medium break-all ${muted ? "text-slate-400 dark:text-neutral-600" : "text-slate-800 dark:text-neutral-200"}`}>
        {value}
      </span>
    </div>
  );
}
