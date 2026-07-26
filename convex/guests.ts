import { httpAction } from "./_generated/server";

export const list = httpAction(async (ctx) => {
  const guests = await ctx.db.query("guests").collect();
  return new Response(JSON.stringify(guests), { status: 200 });
});

export const addOrUpdate = httpAction(async (ctx, request) => {
  const body = await request.json();
  if (body.action === "update_guest" && body.guest_id) {
    const guest = await ctx.db.query("guests").collect().then(gs => gs.find(g => g._id.toString() === body.guest_id));
    if (guest) {
      await ctx.db.patch(guest._id, {
        first_name: body.first_name,
        last_name: body.last_name,
        spouse_name: body.spouse_name || undefined,
        guest_type: body.guest_type,
        max_party: body.max_party,
        phone: body.phone || undefined,
        deadline: body.deadline || undefined,
        easy_mode: body.easy_mode || undefined,
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "Guest not found" }), { status: 404 });
  }
  const id = await ctx.db.insert("guests", {
    first_name: body.first_name,
    last_name: body.last_name,
    spouse_name: body.spouse_name || undefined,
    guest_type: body.guest_type,
    max_party: body.max_party,
    phone: body.phone || undefined,
    deadline: body.deadline || undefined,
    easy_mode: body.easy_mode || undefined,
    attendance: body.attendance || "invited",
    created_at: Date.now(),
  });
  return new Response(JSON.stringify({ _id: id.toString(), ok: true }), { status: 200 });
});

export const deleteGuest = httpAction(async (ctx, request) => {
  const { guestId } = await request.json();
  const guest = await ctx.db.query("guests").collect().then(gs => gs.find(g => g._id.toString() === guestId));
  if (guest) {
    await ctx.db.delete(guest._id);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  return new Response(JSON.stringify({ error: "Guest not found" }), { status: 404 });
});
