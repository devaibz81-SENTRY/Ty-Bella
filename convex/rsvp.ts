import { httpAction } from "./_generated/server";
import { cors } from "./cors";

export const submit = httpAction(async (ctx, request) => {
  const body = await request.json();
  const { guest_id, attendance, spouse_attending, guests_count, dietary, message, song_request, name } = body;

  if (!guest_id || !attendance) {
    return cors({ error: "guest_id and attendance are required" }, 400);
  }

  const guests = await ctx.runQuery("guests:listGuests");
  const guest = guests.find((g: any) => g._id.toString() === guest_id);
  if (!guest) {
    return cors({ error: "Guest not found" }, 404);
  }

  const patch: Record<string, unknown> = { attendance };
  if (spouse_attending !== undefined) patch.spouse_attending = spouse_attending;
  if (guests_count) patch.max_party = parseInt(guests_count, 10);
  if (dietary) patch.dietary = dietary;
  if (message) patch.message = message;
  if (song_request) patch.song_request = song_request;

  await ctx.runMutation("guests:patchGuest", { id: guest._id, patch });

  if (message) {
    await ctx.runMutation("messages:insertMessage", {
      name: name || guest.first_name,
      text: message,
      created_at: Date.now(),
    });
  }

  if (song_request) {
    await ctx.runMutation("songs:insertSong", {
      name: name || guest.first_name,
      song: song_request,
      artist: guest.spouse_name || undefined,
      created_at: Date.now(),
    });
  }

  return cors({ ok: true });
});

export const search = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  if (!q || q.length < 2) return cors({ error: "Query too short" }, 400);
  const guests = await ctx.runQuery("guests:listGuests");
  const matches = guests.filter((g: any) => {
    const full = `${g.first_name} ${g.last_name}`.toLowerCase();
    const fullReversed = `${g.last_name} ${g.first_name}`.toLowerCase();
    return full.includes(q) || fullReversed.includes(q);
  });
  return cors(matches.slice(0, 20));
});
