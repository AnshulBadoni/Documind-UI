import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { deriveTitle, generateReply } from "@/lib/assistant";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(chats).orderBy(desc(chats.updatedAt));
    return Response.json({ chats: rows });
  } catch {
    return Response.json({ chats: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim();
    if (!content) {
      return Response.json({ error: "content is required" }, { status: 400 });
    }

    const [chat] = await db
      .insert(chats)
      .values({ title: deriveTitle(content) })
      .returning();

    await db
      .insert(messages)
      .values({ chatId: chat.id, role: "user", content });

    const reply = generateReply(content);
    await db
      .insert(messages)
      .values({ chatId: chat.id, role: "assistant", content: reply });

    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, chat.id));

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chat.id))
      .orderBy(messages.id);

    return Response.json({ chat, messages: msgs });
  } catch {
    return Response.json({ error: "failed to create chat" }, { status: 500 });
  }
}
