import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cors } from "./cors";

export const listGuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("guests").collect();
  },
});

export const patchGuest = mutation({
  args: { id: v.id("guests"), patch: v.any() },
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch);
  },
});

export const insertGuest = mutation({
  args: {
    first_name: v.string(), last_name: v.string(), spouse_name: v.optional(v.string()),
    guest_type: v.string(), max_party: v.number(), phone: v.optional(v.string()),
    deadline: v.optional(v.string()), easy_mode: v.optional(v.boolean()),
    attendance: v.string(), created_at: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("guests", args);
  },
});

export const deleteGuestMutation = mutation({
  args: { id: v.id("guests") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const list = httpAction(async (ctx) => {
  const guests = await ctx.runQuery("guests:listGuests");
  return cors(guests);
});

export const addOrUpdate = httpAction(async (ctx, request) => {
  const body = await request.json();
  if (body.action === "update_guest" && body.guest_id) {
    const guests = await ctx.runQuery("guests:listGuests");
    const guest = guests.find((g: any) => g._id.toString() === body.guest_id);
    if (guest) {
      await ctx.runMutation("guests:patchGuest", {
        id: guest._id,
        patch: {
          first_name: body.first_name, last_name: body.last_name,
          spouse_name: body.spouse_name || undefined, guest_type: body.guest_type,
          max_party: body.max_party, phone: body.phone || undefined,
          deadline: body.deadline || undefined, easy_mode: body.easy_mode || undefined,
        },
      });
      return cors({ ok: true });
    }
    return cors({ error: "Guest not found" }, 404);
  }
  const id = await ctx.runMutation("guests:insertGuest", {
    first_name: body.first_name, last_name: body.last_name,
    spouse_name: body.spouse_name || undefined, guest_type: body.guest_type,
    max_party: body.max_party, phone: body.phone || undefined,
    deadline: body.deadline || undefined, easy_mode: body.easy_mode || undefined,
    attendance: body.attendance || "invited", created_at: Date.now(),
  });
  return cors({ _id: id.toString(), ok: true });
});

export const deleteGuest = httpAction(async (ctx, request) => {
  const { guestId } = await request.json();
  const guests = await ctx.runQuery("guests:listGuests");
  const guest = guests.find((g: any) => g._id.toString() === guestId);
  if (guest) {
    await ctx.runMutation("guests:deleteGuestMutation", { id: guest._id });
    return cors({ ok: true });
  }
  return cors({ error: "Guest not found" }, 404);
});
