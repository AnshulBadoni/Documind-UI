// Lightweight, deterministic "assistant" used to simulate responses for the
// DocuMind demo. No external API keys required.

const CANNED: { match: RegExp; reply: string }[] = [
  {
    match: /meeting creation|meeting/i,
    reply:
      "Meeting creation flows from `POST /api/meetings` → `MeetingService.create()` → MongoDB `meetings` collection. The service validates the payload, emits a `meeting.created` event over Socket.IO, and schedules reminders through the Janus queue.",
  },
  {
    match: /redis/i,
    reply:
      "Redis is used by 4 services: `SessionStore`, `RateLimiter`, `QueueProcessor`, and `CacheLayer`. If Redis goes down, sessions fall back to JWT-only validation and rate limiting becomes best-effort in-memory.",
  },
  {
    match: /auth|authentication|login/i,
    reply:
      "Authentication uses Express middleware `requireAuth`. A request carries a Bearer JWT, which is verified against the secret, the user is hydrated from MongoDB, and the session is cached in Redis for 15 minutes.",
  },
  {
    match: /changed|this week|recent/i,
    reply:
      "In the last 7 days there were 38 commits across 12 files. Highlights: refactored the queue processor, added the Janus integration, and patched the Redis fallback logic.",
  },
  {
    match: /environment|env var/i,
    reply:
      "Key environment variables: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JANUS_API_KEY`, `SOCKET_PORT`, and `NODE_ENV`. All are loaded via `dotenv` in `src/config/env.ts`.",
  },
];

export function generateReply(prompt: string): string {
  for (const { match, reply } of CANNED) {
    if (match.test(prompt)) return reply;
  }
  return `Here's what I found about "${prompt.trim()}": I scanned the Monet Backend codebase (Node.js/TS, 2,847 files). This area touches the service layer and its MongoDB models. Ask me to trace a specific function or route and I'll walk you through the flow.`;
}

export function deriveTitle(prompt: string): string {
  const clean = prompt.trim().replace(/\s+/g, " ");
  if (clean.length <= 48) return clean;
  return clean.slice(0, 45) + "…";
}
