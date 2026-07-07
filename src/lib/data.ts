export type Project = {
  id: string;
  name: string;
  description?: string;
  stack: string[];
  repository_url?: string;
  branch: string;
  synced: string;
  files: string;
  color: string;
  project_type?: string;
  stats?: any;
  owner_id?: number;
};

export const projects: Project[] = [
  {
    id: "monet-backend",
    name: "Monet Backend",
    stack: ["Node.js", "TS"],
    branch: "main",
    synced: "2h ago",
    files: "2,847 files",
    color: "emerald",
  },
  {
    id: "atlas-web",
    name: "Atlas Web",
    stack: ["Next.js", "React"],
    branch: "develop",
    synced: "20m ago",
    files: "1,204 files",
    color: "indigo",
  },
  {
    id: "orion-mobile",
    name: "Orion Mobile",
    stack: ["React Native"],
    branch: "release/2.4",
    synced: "1d ago",
    files: "934 files",
    color: "violet",
  },
  {
    id: "ledger-svc",
    name: "Ledger Service",
    stack: ["Go"],
    branch: "main",
    synced: "5h ago",
    files: "612 files",
    color: "sky",
  },
];

export const recentChats = {
  Today: [
    "How does meeting creation work?",
    "Explain auth flow",
    "Which services use Redis?",
    "What changed this week?",
  ],
  Yesterday: [
    "Architecture overview",
    "Meeting lifecycle",
    "Queue processing flow",
  ],
  "Last 7 days": [
    "Database schema",
    "Environment variables",
    "Janus integration flow",
  ],
};

export const projectSuggestions: Record<
  string,
  { icon: string; color: string; title: string; sub: string }[]
> = {
  backend: [
    {
      icon: "flow",
      color: "indigo",
      title: "How does meeting this app work?",
      sub: "Explain the flow from API to database",
    },
    {
      icon: "database",
      color: "green",
      title: "Which services use Redis?",
      sub: "Show all services that depend on Redis",
    },
    {
      icon: "clock",
      color: "violet",
      title: "What changed this week?",
      sub: "Summarize the changes from the last 7 days",
    },
    {
      icon: "shield",
      color: "blue",
      title: "Show authentication flow",
      sub: "Explain how user authentication works",
    },
    {
      icon: "alert",
      color: "red",
      title: "What breaks if Redis goes down?",
      sub: "Impact analysis and fallback mechanisms",
    },
    {
      icon: "code",
      color: "sky",
      title: "Show all environment variables",
      sub: "List and explain all env variables",
    },
  ],
  frontend: [
    {
      icon: "flow",
      color: "indigo",
      title: "What components make up the landing page?",
      sub: "List key visual building blocks",
    },
    {
      icon: "database",
      color: "green",
      title: "Explain the UI routing structure",
      sub: "Map out all views and child routes",
    },
    {
      icon: "clock",
      color: "violet",
      title: "How is global state managed?",
      sub: "Detail store, signals, or context setup",
    },
    {
      icon: "shield",
      color: "blue",
      title: "Show the main page layout",
      sub: "Explain the template and grid structure",
    },
    {
      icon: "alert",
      color: "red",
      title: "What UI libraries are installed?",
      sub: "List Tailwind, Shadcn, or CSS assets",
    },
    {
      icon: "code",
      color: "sky",
      title: "How does event handling work?",
      sub: "Describe component communication",
    },
  ],
  ml_ai: [
    {
      icon: "flow",
      color: "indigo",
      title: "What model architecture is used?",
      sub: "Describe layer structure and parameters",
    },
    {
      icon: "database",
      color: "green",
      title: "Explain the dataset training pipeline",
      sub: "Detail preprocessing, loss, and training steps",
    },
    {
      icon: "clock",
      color: "violet",
      title: "Show evaluation metrics",
      sub: "List accuracy, precision, and recall summaries",
    },
    {
      icon: "shield",
      color: "blue",
      title: "How does inference pipeline run?",
      sub: "Describe data load to model output",
    },
    {
      icon: "alert",
      color: "red",
      title: "What frameworks are installed?",
      sub: "Verify PyTorch, TensorFlow, or Scikit-Learn",
    },
    {
      icon: "code",
      color: "sky",
      title: "How is the model saved/exported?",
      sub: "Describe checkpoint and ONNX formats",
    },
  ],
  fullstack: [
    {
      icon: "flow",
      color: "indigo",
      title: "How does the system request flow work?",
      sub: "Trace data from client UI to DB",
    },
    {
      icon: "database",
      color: "green",
      title: "Explain frontend-backend API contract",
      sub: "Map out endpoint requests and schemas",
    },
    {
      icon: "clock",
      color: "violet",
      title: "How is global auth synced?",
      sub: "Trace JWT from client storage to API verify",
    },
    {
      icon: "shield",
      color: "blue",
      title: "What database models exist?",
      sub: "Describe key schemas and relations",
    },
    {
      icon: "alert",
      color: "red",
      title: "List dependencies in both environments",
      sub: "Overview of npm/pip packages",
    },
    {
      icon: "code",
      color: "sky",
      title: "What environment variables are required?",
      sub: "Outline config variables needed",
    },
  ],
  mobile: [
    {
      icon: "flow",
      color: "indigo",
      title: "What screens are registered?",
      sub: "List all main view controllers and screens",
    },
    {
      icon: "database",
      color: "green",
      title: "How does screen navigation work?",
      sub: "Trace navigator routes and stacks",
    },
    {
      icon: "clock",
      color: "violet",
      title: "How is state shared between screens?",
      sub: "Explain global state management",
    },
    {
      icon: "shield",
      color: "blue",
      title: "What local storage is used?",
      sub: "Describe SQLite, AsyncStore, or MMKV usage",
    },
    {
      icon: "alert",
      color: "red",
      title: "Show external API integrations",
      sub: "Detail network request structures",
    },
    {
      icon: "code",
      color: "sky",
      title: "List packages and dependencies",
      sub: "Overview of native/cross-platform deps",
    },
  ],
};

export const suggestions = projectSuggestions.backend;

export const codebaseStats = [
  { label: "Files", value: "2,847" },
  { label: "Lines of Code", value: "186,432" },
  { label: "Functions", value: "1,248" },
  { label: "Routes", value: "45" },
  { label: "Services", value: "18" },
  { label: "Models", value: "22" },
];

export const technologies = [
  "TypeScript",
  "Express",
  "MongoDB",
  "Redis",
  "Socket.IO",
  "Janus",
];

export const recentActivity = [
  { icon: "doc", color: "blue", text: "Documentation updated", time: "2h ago" },
  {
    icon: "commit",
    color: "green",
    text: "New commit detected",
    time: "5h ago",
  },
  {
    icon: "book",
    color: "violet",
    text: "Knowledge base synced",
    time: "1d ago",
  },
];

export function getProjectIcon(stack: string[] = []): string {
  const technologies = stack.map((s) => s.toLowerCase());

  const has = (...names: string[]) =>
    names.some((name) => technologies.includes(name.toLowerCase()));

  if (
    has(
      "typescript",
      "javascript",
      "node",
      "nodejs",
      "node.js",
      "express",
      "nestjs",
      "nextjs",
      "next.js",
      "react",
      "vue",
      "angular",
      "bun",
      "hono",
      "elysia",
    )
  ) {
    return "/nodejs.svg";
  }

  if (has("python", "fastapi", "flask", "django", "pydantic", "uvicorn")) {
    return "/python.svg";
  }
  if (has("java", "spring", "springboot", "spring boot")) {
    return "/java.svg";
  }

  if (has("go", "golang", "gin", "fiber")) {
    return "/go.svg";
  }
  if (has("rust", "actix", "axum")) {
    return "/rust.svg";
  }

  return "/fallback.svg";
}

export function getTechIcon(name: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes("typescript") || n === "ts") return "/typescript.svg";
  if (n.includes("javascript") || n === "js") return "/javascript.svg";
  if (n.includes("react") || n === "js") return "/react.svg";
  if (n.includes("angular") || n === "js") return "/angular.svg";
  if (n.includes("mongo")) return "/mongo.svg";
  if (n.includes("postgres") || n.includes("pgsql") || n.includes("postgresql"))
    return "/pgsql.svg";
  if (n.includes("redis")) return "/redis.svg";
  if (n.includes("python") || n.includes("fastapi")) return "/python.svg";
  if (n.includes("kafka")) return "/kafka.svg";
  if (n.includes("mysql")) return "/mysql.svg";
  if (n.includes("aws") || n.includes("s3")) return "/aws.svg";
  if (n.includes("node") || n.includes("express")) return "/nodejs.svg";
  if (n.includes("slack")) return "/slack.svg";
  if (n.includes("integration")) return "/integration.svg";
  if (n.includes("docker")) return "/docker.svg";
  if (n.includes("tensorflow")) return "/tensorflow.svg";
  if (n.includes("pytorch")) return "/pytorch.svg";
  if (n.includes("scikit-learn")) return "/scikitlearn.svg";
  if (n.includes("flask")) return "/flask.svg";
  if (n.includes("vue")) return "/vue.svg";
  return "/fallback.svg";
}
