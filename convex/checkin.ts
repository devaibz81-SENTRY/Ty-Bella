import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cors } from "./cors";

export const listAllGuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("guests").collect();
  },
});

export const checkInGuest = mutation({
  args: { id: v.id("guests") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { checked_in: true, checked_in_at: Date.now() });
  },
});

export const checkIn = httpAction(async (ctx, request) => {
  const { guestId } = await request.json();
  if (!guestId) return cors({ error: "Missing guestId" }, 400);
  const guests = await ctx.runQuery("checkin:listAllGuests") as any[];
  const guest = guests.find(g => g._id.toString() === guestId);
  if (!guest) return cors({ error: "Guest not found" }, 404);
  await ctx.runMutation("checkin:checkInGuest", { id: guest._id });
  return cors({ ok: true, name: `${guest.first_name} ${guest.last_name}` });
});

export const lookup = httpAction(async (ctx, request) => {
  const { name } = await request.json();
  if (!name) return cors({ error: "Missing name" }, 400);
  const guests = await ctx.runQuery("checkin:listAllGuests") as any[];
  const q = String(name).toLowerCase().trim();
  const matches = guests.filter((g: any) => {
    const full = `${g.first_name} ${g.last_name}`.toLowerCase();
    return full.includes(q) || g.first_name.toLowerCase().includes(q);
  });
  return cors(matches.map((g: any) => ({
    _id: g._id.toString(), first_name: g.first_name, last_name: g.last_name, checked_in: g.checked_in || false,
  })));
});
