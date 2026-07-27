import { httpAction } from "./_generated/server";
import { cors } from "./cors";

export const submit = httpAction(async (ctx, request) => {
  const body = await request.json();
  const { guest_id, attendance, guests_count, dietary, message, name } = body;

  if (!guest_id || !attendance) {
    return cors({ error: "guest_id and attendance are required" }, 400);
  }

  const guests = await ctx.runQuery("guests:listGuests");
  const guest = guests.find((g: any) => g._id.toString() === guest_id);
  if (!guest) {
    return cors({ error: "Guest not found" }, 404);
  }

  const patch: Record<string, unknown> = { attendance };
  if (guests_count) patch.max_party = parseInt(guests_count, 10);
  if (dietary) patch.dietary = dietary;

  await ctx.runMutation("guests:patchGuest", { id: guest._id, patch });

  if (message) {
    await ctx.runMutation("messages:insertMessage", {
      name: name || guest.first_name,
      text: message,
      created_at: Date.now(),
    });
  }

  return cors({ ok: true });
});
