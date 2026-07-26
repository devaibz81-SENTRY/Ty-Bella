import { httpAction } from "./_generated/server";

export const listSongs = httpAction(async (ctx) => {
  const songs = await ctx.db.query("songs").collect();
  return new Response(JSON.stringify(songs), { status: 200 });
});

export const submitSong = httpAction(async (ctx, request) => {
  const { name, song, artist } = await request.json();
  if (!name || !song) {
    return new Response(JSON.stringify({ error: "Name and song are required" }), { status: 400 });
  }
  const id = await ctx.db.insert("songs", {
    name: String(name).trim(),
    song: String(song).trim(),
    artist: artist ? String(artist).trim() : undefined,
    created_at: Date.now(),
  });
  return new Response(JSON.stringify({ _id: id.toString(), ok: true }), { status: 200 });
});
