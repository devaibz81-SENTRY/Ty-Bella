import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAllMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const insertMessage = mutation({
  args: { name: v.string(), text: v.string(), created_at: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", args);
  },
});

export const listMessages = httpAction(async (ctx) => {
  const data = await ctx.runQuery("messages:listAllMessages");
  return new Response(JSON.stringify(data), { status: 200 });
});

export const submitMessage = httpAction(async (ctx, request) => {
  const { name, text } = await request.json();
  if (!name || !text) {
    return new Response(JSON.stringify({ error: "Name and message are required" }), { status: 400 });
  }
  const id = await ctx.runMutation("messages:insertMessage", {
    name: String(name).trim(), text: String(text).trim(), created_at: Date.now(),
  });
  return new Response(JSON.stringify({ _id: id.toString(), ok: true }), { status: 200 });
});
