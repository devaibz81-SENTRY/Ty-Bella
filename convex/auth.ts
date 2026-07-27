import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertSession = mutation({
  args: { token: v.string(), created_at: v.number() },
  handler: async (ctx, { token, created_at }) => {
    return await ctx.db.insert("sessions", { token, created_at });
  },
});

export const deleteSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const existing = await ctx.db.query("sessions").withIndex("by_token", q => q.eq("token", token)).first();
    if (existing) await ctx.db.delete(existing._id);
  },
});

export const findSession = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    return await ctx.db.query("sessions").withIndex("by_token", q => q.eq("token", token)).first();
  },
});

const ADMIN_PASSWORD = "Ty&Bella@26";

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let i = 0; i < 40; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

export const login = httpAction(async (ctx, request) => {
  const { password } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
  }
  const token = generateToken();
  await ctx.runMutation("auth:insertSession", { token, created_at: Date.now() });
  return new Response(JSON.stringify({ token }), { status: 200 });
});

export const logout = httpAction(async (ctx, request) => {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token) await ctx.runMutation("auth:deleteSession", { token });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});

export const me = httpAction(async (ctx, request) => {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return new Response("Unauthorized", { status: 401 });
  const session = await ctx.runQuery("auth:findSession", { token });
  if (!session) return new Response("Unauthorized", { status: 401 });
  return new Response(JSON.stringify({ valid: true }), { status: 200 });
});
