import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  guests: defineTable({
    first_name: v.string(),
    last_name: v.string(),
    spouse_name: v.optional(v.string()),
    guest_type: v.string(),
    max_party: v.number(),
    phone: v.optional(v.string()),
    attendance: v.optional(v.string()),
    deadline: v.optional(v.string()),
    easy_mode: v.optional(v.boolean()),
    checked_in: v.optional(v.boolean()),
    checked_in_at: v.optional(v.number()),
    created_at: v.number(),
  }),
  sessions: defineTable({
    token: v.string(),
    created_at: v.number(),
  }).index("by_token", ["token"]),
  seating: defineTable({
    guest_id: v.string(),
    table_num: v.string(),
    updated_at: v.number(),
  }).index("by_guest", ["guest_id"]),
  songs: defineTable({
    name: v.string(),
    song: v.string(),
    artist: v.optional(v.string()),
    created_at: v.number(),
  }),
  messages: defineTable({
    name: v.string(),
    text: v.string(),
    created_at: v.number(),
  }),
});
