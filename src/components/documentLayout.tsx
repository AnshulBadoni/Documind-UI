"use client";

import { useState, useEffect } from "react";
import MarkdownContent from "./Markdown";

export type DocInfo = {
  title?: string;
  author?: string;
  date?: string;
  tags?: string[];
  sources?: { name: string; url: string }[];
  wordCount?: number;
};

export default function DocumentLayout({
  content,
  docInfo,
}: {
  content: string;
  docInfo: DocInfo;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative flex h-screen bg-white dark:bg-neutral-950">
      {/* ─── Main Content Area ─── */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isOpen ? "md:mr-80" : "mr-0"
        }`}
      >
        <div className="mx-auto max-w-3xl px-6 py-8 relative">
          {/* Toggle Button (hidden when sidebar is open) */}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="fixed right-4 top-4 z-40 flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-neutral-400 shadow-sm hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Open document info"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Doc Info
            </button>
          )}

          <MarkdownContent content={content} />
        </div>
      </main>

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 border-l border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-neutral-200">
            Document Info
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800 dark:text-neutral-400 transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100%-56px)] overflow-y-auto p-4 space-y-5">
          {/* Metadata */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-neutral-500 mb-2">
              Metadata
            </h3>
            <div className="space-y-2 text-sm">
              {docInfo.title && (
                <p className="text-slate-700 dark:text-neutral-300">
                  <span className="text-slate-500 dark:text-neutral-500">
                    Title:
                  </span>{" "}
                  {docInfo.title}
                </p>
              )}
              {docInfo.author && (
                <p className="text-slate-700 dark:text-neutral-300">
                  <span className="text-slate-500 dark:text-neutral-500">
                    Author:
                  </span>{" "}
                  {docInfo.author}
                </p>
              )}
              {docInfo.date && (
                <p className="text-slate-700 dark:text-neutral-300">
                  <span className="text-slate-500 dark:text-neutral-500">
                    Date:
                  </span>{" "}
                  {docInfo.date}
                </p>
              )}
              {docInfo.wordCount && (
                <p className="text-slate-700 dark:text-neutral-300">
                  <span className="text-slate-500 dark:text-neutral-500">
                    Words:
                  </span>{" "}
                  {docInfo.wordCount.toLocaleString()}
                </p>
              )}
            </div>
          </section>

          {/* Tags */}
          {docInfo.tags && docInfo.tags.length > 0 && (
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-neutral-500 mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {docInfo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Sources */}
          {docInfo.sources && docInfo.sources.length > 0 && (
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-neutral-500 mb-2">
                Sources
              </h3>
              <ul className="space-y-1.5">
                {docInfo.sources.map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span className="truncate">{src.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>

      {/* ─── Mobile Backdrop ─── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
