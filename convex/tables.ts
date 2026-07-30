import { httpAction } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cors } from "./cors";

export const listTables = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tables").order("asc").collect();
  },
});

export const getTable = query({
  args: { id: v.id("tables") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const insertTable = mutation({
  args: { name: v.string(), table_number: v.number(), photos: v.array(v.string()), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tables", { ...args, created_at: Date.now() });
  },
});

export const list = httpAction(async (ctx) => {
  const tables = await ctx.runQuery("tables:listTables");
  return cors(tables);
});

export const get = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return cors({ error: "Missing id" }, 400);
  const table = await ctx.runQuery("tables:getTable", { id });
  return cors(table || null);
});

export const assignGuestToTable = httpAction(async (ctx, request) => {
  const { guestId, tableId } = await request.json();
  const guests = await ctx.runQuery("guests:listGuests");
  const guest = guests.find((g: any) => g._id.toString() === guestId);
  if (!guest) return cors({ error: "Guest not found" }, 404);
  await ctx.runMutation("guests:patchGuest", { id: guest._id, patch: { table_id: tableId || undefined } });
  return cors({ ok: true });
});

export const seedTables = httpAction(async (ctx) => {
  const existing = await ctx.runQuery("tables:listTables");
  if (existing.length > 0) return cors({ message: "Tables already seeded" });
  const countries = [
    { name: "United States", table_number: 1 },
    { name: "Canada", table_number: 2 },
    { name: "Mexico", table_number: 3 },
    { name: "Belize", table_number: 4 },
    { name: "Guatemala", table_number: 5 },
    { name: "Costa Rica", table_number: 6 },
    { name: "Panama", table_number: 7 },
    { name: "Bahamas", table_number: 8 },
    { name: "Jamaica", table_number: 9 },
    { name: "Puerto Rico", table_number: 10 },
    { name: "Cuba", table_number: 11 },
    { name: "Dominican Republic", table_number: 12 },
    { name: "Brazil", table_number: 13 },
    { name: "Argentina", table_number: 14 },
    { name: "Chile", table_number: 15 },
    { name: "Peru", table_number: 16 },
    { name: "Colombia", table_number: 17 },
    { name: "Ecuador", table_number: 18 },
    { name: "Venezuela", table_number: 19 },
    { name: "United Kingdom", table_number: 20 },
    { name: "France", table_number: 21 },
    { name: "Italy", table_number: 22 },
    { name: "Spain", table_number: 23 },
    { name: "Portugal", table_number: 24 },
    { name: "Germany", table_number: 25 },
    { name: "Netherlands", table_number: 26 },
    { name: "Switzerland", table_number: 27 },
    { name: "Austria", table_number: 28 },
    { name: "Greece", table_number: 29 },
    { name: "Turkey", table_number: 30 },
    { name: "Croatia", table_number: 31 },
    { name: "Iceland", table_number: 32 },
    { name: "Ireland", table_number: 33 },
    { name: "Sweden", table_number: 34 },
    { name: "Norway", table_number: 35 },
    { name: "Denmark", table_number: 36 },
    { name: "Poland", table_number: 37 },
    { name: "Czech Republic", table_number: 38 },
    { name: "Hungary", table_number: 39 },
    { name: "Romania", table_number: 40 },
    { name: "Israel", table_number: 41 },
    { name: "United Arab Emirates", table_number: 42 },
    { name: "India", table_number: 43 },
    { name: "Thailand", table_number: 44 },
    { name: "Vietnam", table_number: 45 },
    { name: "Japan", table_number: 46 },
    { name: "South Korea", table_number: 47 },
    { name: "China", table_number: 48 },
    { name: "Singapore", table_number: 49 },
    { name: "Malaysia", table_number: 50 },
    { name: "Philippines", table_number: 51 },
    { name: "Indonesia", table_number: 52 },
    { name: "Cambodia", table_number: 53 },
    { name: "Australia", table_number: 54 },
    { name: "New Zealand", table_number: 55 },
    { name: "Fiji", table_number: 56 },
    { name: "Egypt", table_number: 57 },
    { name: "Morocco", table_number: 58 },
    { name: "South Africa", table_number: 59 },
    { name: "Kenya", table_number: 60 },
    { name: "Tanzania", table_number: 61 },
    { name: "Ghana", table_number: 62 },
    { name: "Nigeria", table_number: 63 },
    { name: "Ethiopia", table_number: 64 },
    { name: "Maldives", table_number: 65 },
    { name: "Seychelles", table_number: 66 },
    { name: "Mauritius", table_number: 67 },
    { name: "Bali", table_number: 68 },
    { name: "Santorini", table_number: 69 },
    { name: "Barcelona", table_number: 70 },
    { name: "Paris", table_number: 71 },
    { name: "Tokyo", table_number: 72 },
    { name: "Dubai", table_number: 73 },
    { name: "Rome", table_number: 74 },
    { name: "London", table_number: 75 },
    { name: "New York", table_number: 76 },
    { name: "Caribbean", table_number: 77 },
  ];
  const defaultPhotos = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
  ];
  for (const c of countries) {
    await ctx.runMutation("tables:insertTable", { ...c, photos: defaultPhotos });
  }
  return cors({ ok: true, count: countries.length });
});
