import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateReply } from "@/lib/assistant";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chatId = Number(id);
  if (!Number.isFinite(chatId)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }
  const [chat] = await db.select().from(chats).where(eq(chats.id, chatId));
  if (!chat) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.id);
  return Response.json({ chat, messages: msgs });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chatId = Number(id);
  if (!Number.isFinite(chatId)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }
  const body = (await req.json()) as { content?: string };
  const content = (body.content ?? "").trim();
  if (!content) {
    return Response.json({ error: "content is required" }, { status: 400 });
  }

  await db.insert(messages).values({ chatId, role: "user", content });
  const reply = generateReply(content);
  await db
    .insert(messages)
    .values({ chatId, role: "assistant", content: reply });
  await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.id);
  return Response.json({ messages: msgs });
}
