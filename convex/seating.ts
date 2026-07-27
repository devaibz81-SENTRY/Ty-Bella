import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cors } from "./cors";

export const listAllSeating = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("seating").collect();
  },
});

export const upsertSeating = mutation({
  args: { guest_id: v.string(), table_num: v.string(), updated_at: v.number() },
  handler: async (ctx, { guest_id, table_num, updated_at }) => {
    const existing = await ctx.db.query("seating").withIndex("by_guest", q => q.eq("guest_id", guest_id)).first();
    if (existing) {
      await ctx.db.patch(existing._id, { table_num, updated_at });
    } else {
      await ctx.db.insert("seating", { guest_id, table_num, updated_at });
    }
  },
});

export const listAssigned = httpAction(async (ctx) => {
  const data = await ctx.runQuery("seating:listAllSeating");
  return cors(data);
});

export const assign = httpAction(async (ctx, request) => {
  const { guestId, tableNum } = await request.json();
  await ctx.runMutation("seating:upsertSeating", { guest_id: guestId, table_num: String(tableNum), updated_at: Date.now() });
  return cors({ ok: true });
});

export const getByGuest = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const guestId = url.searchParams.get("guestId");
  if (!guestId) return cors({ error: "Missing guestId" }, 400);
  const all = await ctx.runQuery("seating:listAllSeating");
  const seat = all.find((s: any) => s.guest_id === guestId);
  return cors(seat || { table_num: null });
});
