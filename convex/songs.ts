import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cors } from "./cors";

export const listAllSongs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("songs").collect();
  },
});

export const insertSong = mutation({
  args: { name: v.string(), song: v.string(), artist: v.optional(v.string()), created_at: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("songs", args);
  },
});

export const listSongs = httpAction(async (ctx) => {
  const data = await ctx.runQuery("songs:listAllSongs");
  return cors(data);
});

export const submitSong = httpAction(async (ctx, request) => {
  const { name, song, artist } = await request.json();
  if (!name || !song) {
    return cors({ error: "Name and song are required" }, 400);
  }
  const id = await ctx.runMutation("songs:insertSong", {
    name: String(name).trim(), song: String(song).trim(),
    artist: artist ? String(artist).trim() : undefined, created_at: Date.now(),
  });
  return cors({ _id: id.toString(), ok: true });
});
