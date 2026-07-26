import { httpAction } from "./_generated/server";

export const listMessages = httpAction(async (ctx) => {
  const messages = await ctx.db.query("messages").collect();
  return new Response(JSON.stringify(messages), { status: 200 });
});

export const submitMessage = httpAction(async (ctx, request) => {
  const { name, text } = await request.json();
  if (!name || !text) {
    return new Response(JSON.stringify({ error: "Name and message are required" }), { status: 400 });
  }
  const id = await ctx.db.insert("messages", {
    name: String(name).trim(),
    text: String(text).trim(),
    created_at: Date.now(),
  });
  return new Response(JSON.stringify({ _id: id.toString(), ok: true }), { status: 200 });
});
