import { httpAction } from "./_generated/server";

export const listAssigned = httpAction(async (ctx) => {
  const seating = await ctx.db.query("seating").collect();
  return new Response(JSON.stringify(seating), { status: 200 });
});

export const assign = httpAction(async (ctx, request) => {
  const { guestId, tableNum } = await request.json();
  const existing = await ctx.db.query("seating").withIndex("by_guest", q => q.eq("guest_id", guestId)).first();
  if (existing) {
    await ctx.db.patch(existing._id, { table_num: String(tableNum), updated_at: Date.now() });
  } else {
    await ctx.db.insert("seating", { guest_id: guestId, table_num: String(tableNum), updated_at: Date.now() });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});

export const getByGuest = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const guestId = url.searchParams.get("guestId");
  if (!guestId) return new Response(JSON.stringify({ error: "Missing guestId" }), { status: 400 });
  const seat = await ctx.db.query("seating").withIndex("by_guest", q => q.eq("guest_id", guestId)).first();
  return new Response(JSON.stringify(seat || { table_num: null }), { status: 200 });
});
