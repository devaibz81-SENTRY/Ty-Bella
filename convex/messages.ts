import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cors } from "./cors";

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
  return cors(data);
});

export const submitMessage = httpAction(async (ctx, request) => {
  const { name, text } = await request.json();
  if (!name || !text) {
    return cors({ error: "Name and message are required" }, 400);
  }
  const id = await ctx.runMutation("messages:insertMessage", {
    name: String(name).trim(), text: String(text).trim(), created_at: Date.now(),
  });
  return cors({ _id: id.toString(), ok: true });
});
