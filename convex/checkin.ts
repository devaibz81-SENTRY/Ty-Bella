import { httpAction } from "./_generated/server";

export const checkIn = httpAction(async (ctx, request) => {
  const { guestId } = await request.json();
  if (!guestId) return new Response(JSON.stringify({ error: "Missing guestId" }), { status: 400 });
  const guests = await ctx.db.query("guests").collect();
  const guest = guests.find(g => g._id.toString() === guestId);
  if (!guest) return new Response(JSON.stringify({ error: "Guest not found" }), { status: 404 });
  await ctx.db.patch(guest._id, { checked_in: true, checked_in_at: Date.now() });
  return new Response(JSON.stringify({ ok: true, name: `${guest.first_name} ${guest.last_name}` }), { status: 200 });
});

export const lookup = httpAction(async (ctx, request) => {
  const { name } = await request.json();
  if (!name) return new Response(JSON.stringify({ error: "Missing name" }), { status: 400 });
  const guests = await ctx.db.query("guests").collect();
  const q = String(name).toLowerCase().trim();
  const matches = guests.filter(g => {
    const full = `${g.first_name} ${g.last_name}`.toLowerCase();
    return full.includes(q) || g.first_name.toLowerCase().includes(q);
  });
  return new Response(JSON.stringify(matches.map(g => ({
    _id: g._id.toString(),
    first_name: g.first_name,
    last_name: g.last_name,
    checked_in: g.checked_in || false,
  }))), { status: 200 });
});
