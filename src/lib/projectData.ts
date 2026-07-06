import { Project } from "./data";

export type ProjectDetail = {
  id: string;
  name: string;
  repo: string;
  description: string;
  tech: Array<{ label: string; icon: string }>;
  stats: Array<{
    label: string;
    value: string | number;
    sub: string;
    color: string;
    icon: string;
  }>;
  recentChanges: Array<{
    type: string;
    title: string;
    desc: string;
    time: string;
    avatar: string;
  }>;
  suggestedQuestions: string[];
  architecture: string[];
  knowledgeHealth: {
    coverage: number;
    items: Array<{ label: string; value: string; ok: boolean }>;
  };
};

export const monetBackend: ProjectDetail = {
  id: "monet-backend",
  name: "Monet Backend",
  repo: "github.com/monet-lab/monet-backend",
  description:
    "Monet Backend is a Node.js and TypeScript backend responsible for meeting creation, participant management, Redis caching, Janus integration, and post-processing workflows.",
  tech: [
    { label: "Backend API", icon: "api" },
    { label: "TypeScript", icon: "ts" },
    { label: "Express", icon: "express" },
    { label: "MongoDB", icon: "mongo" },
    { label: "Redis", icon: "redis" },
    { label: "Janus", icon: "janus" },
  ],
  stats: [
    {
      label: "Routes",
      value: 45,
      sub: "endpoints documented",
      color: "indigo",
      icon: "route",
    },
    {
      label: "Services",
      value: 18,
      sub: "services analyzed",
      color: "emerald",
      icon: "cube",
    },
    {
      label: "Models",
      value: 22,
      sub: "models documented",
      color: "sky",
      icon: "db",
    },
    {
      label: "Integrations",
      value: "Redis, Janus, S3",
      sub: "4 integrations",
      color: "orange",
      icon: "link",
    },
    {
      label: "Environment Variables",
      value: 34,
      sub: "variables discovered",
      color: "violet",
      icon: "file",
    },
    {
      label: "File Structure",
      value: 326,
      sub: "files analyzed",
      color: "amber",
      icon: "folder",
    },
  ],
  recentChanges: [
    {
      type: "add",
      title: "Added EmotionService",
      desc: "New service for emotion detection and analysis",
      time: "2h ago",
      avatar: "https://i.pravatar.cc/32?img=15",
    },
    {
      type: "update",
      title: "Updated MeetingService",
      desc: "Refactored meeting creation flow and added Redis caching",
      time: "1d ago",
      avatar: "https://i.pravatar.cc/32?img=28",
    },
    {
      type: "add",
      title: "New Redis Cache Layer",
      desc: "Added caching for room and participant state",
      time: "2d ago",
      avatar: "https://i.pravatar.cc/32?img=47",
    },
    {
      type: "doc",
      title: "Documentation regenerated",
      desc: "Knowledge base updated",
      time: "2d ago",
      avatar: "https://i.pravatar.cc/32?img=32",
    },
  ],
  suggestedQuestions: [
    "How does meeting creation work?",
    "Which services use Redis?",
    "Show authentication flow",
    "What changed this week?",
    "What breaks if Redis fails?",
  ],
  architecture: ["Client", "API (Express)", "Services", "Redis", "MongoDB", "Janus"],
  knowledgeHealth: {
    coverage: 92,
    items: [
      { label: "Routes", value: "45 / 45", ok: true },
      { label: "Services", value: "18 / 18", ok: true },
      { label: "Models", value: "22 / 22", ok: true },
      { label: "Up to date", value: "2h ago", ok: true },
    ],
  },
};

export const projectList = [
  { id: "monet-backend", name: "Monet Backend", icon: "hex", color: "emerald" },
  { id: "monet-frontend", name: "Monet Frontend", icon: "hex", color: "indigo" },
  { id: "video-worker", name: "Video Worker", icon: "hex", color: "sky" },
  { id: "notification-svc", name: "Notification Service", icon: "hex", color: "rose" },
];
