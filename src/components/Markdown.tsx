import React, { memo, useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";

/* ---------- Mermaid boundary & component ---------- */

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

class MermaidErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  public state: BoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): BoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("MermaidErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 10)}`);

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

        // Simple cleaning
        let cleanSource = chart.trim().replace(/\\n/g, " ");
        cleanSource = cleanSource.replace(/(\b[\w_]+\b)\[([^\]]*)\]/g, (_match, id, label) => {
          const cleaned = label
            .replace(/^["']|["']$/g, "")
            .replace(/\n/g, " ")
            .replace(/`/g, "")
            .replace(/\(/g, "‹")
            .replace(/\)/g, "›")
            .replace(/</g, "‹")
            .replace(/>/g, "›")
            .trim();
          return `${id}["${cleaned}"]`;
        });

        const { svg } = await mermaid.render(idRef.current, cleanSource);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error in Markdown:", err);
        if (!cancelled) {
          setError(err?.message || "Failed to render diagram");
        }
      }
    };

    runRender();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-4 text-center">
        <p className="text-[12px] font-semibold text-slate-800 dark:text-neutral-200">
          Mermaid Render Error
        </p>
        <pre className="mt-1 text-[10.5px] text-left overflow-x-auto text-slate-500 dark:text-neutral-400 p-2 bg-white dark:bg-neutral-900 rounded border border-slate-100 dark:border-neutral-800 font-mono">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-4 flex justify-center overflow-x-auto rounded-xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}

/* ---------- Code block with copy button (ChatGPT-style) ---------- */

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const lang = /language-(\w+)/.exec(className || "")?.[1] ?? "";
  const code = String(children).replace(/\n$/, "");

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800">
      {/* header bar */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-neutral-800 px-4 py-1.5">
        <span className="text-[11px] font-medium text-slate-500 dark:text-neutral-400">
          {lang || "code"}
        </span>
        <button
          onClick={copy}
          className="text-[11px] text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200 transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-slate-50 dark:bg-neutral-900 p-4">
        <code className="text-[12.5px] font-mono leading-relaxed text-slate-700 dark:text-neutral-300">
          {code}
        </code>
      </pre>
    </div>
  );
}

/* ---------- Main renderer ---------- */

const MarkdownContent = memo(function MarkdownContent({
  content,
}: {
  content: string;
}) {
  return (
    <div className="text-[14px] leading-7 text-slate-700 dark:text-neutral-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* headings */
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 text-2xl font-bold text-slate-900 dark:text-white first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 mb-3 border-b border-slate-100 dark:border-neutral-800 pb-2 text-xl font-semibold text-slate-900 dark:text-white first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-[16px] font-semibold text-slate-800 dark:text-neutral-200">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-5 mb-2 text-[14px] font-semibold text-slate-800 dark:text-neutral-200">
              {children}
            </h4>
          ),

          /* text */
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 dark:text-neutral-100">
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:no-underline"
            >
              {children}
            </a>
          ),

          /* lists — proper ul/ol wrappers, unlike the regex version */
          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-1.5 marker:text-slate-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-1.5 marker:text-slate-400">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,

          /* blockquote */
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-slate-300 dark:border-neutral-600 pl-4 text-slate-600 dark:text-neutral-400 italic">
              {children}
            </blockquote>
          ),

          /* code — inline vs block */
          code: ({ className, children, ...props }) => {
            const isBlock =
              /language-/.test(className || "") ||
              String(children).includes("\n");
            
            const isMermaid = className === "language-mermaid" || /language-mermaid/.test(className || "");
            
            if (isMermaid) {
              const chartSource = String(children);
              return (
                <MermaidErrorBoundary fallback={
                  <pre className="overflow-x-auto bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <code className="text-[12.5px] font-mono leading-relaxed text-slate-700 dark:text-neutral-300">
                      {chartSource}
                    </code>
                  </pre>
                }>
                  <MermaidDiagram chart={chartSource} />
                </MermaidErrorBoundary>
              );
            }

            if (isBlock)
              return <CodeBlock className={className}>{children}</CodeBlock>;
            return (
              <code
                className="rounded-md bg-slate-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono text-[12.5px] text-blue-600 dark:text-rose-400"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>, // CodeBlock handles the <pre>

          /* tables (remark-gfm parses these for you) */
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-neutral-700 text-[13px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 dark:bg-neutral-800">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {children}
            </tbody>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-slate-600 dark:text-neutral-400">
              {children}
            </td>
          ),

          hr: () => (
            <hr className="my-6 border-slate-100 dark:border-neutral-800" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

export default MarkdownContent;
