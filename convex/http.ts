import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

import { login, logout, me } from "./auth";
import { list, addOrUpdate, deleteGuest } from "./guests";
import { listAssigned, assign, getByGuest } from "./seating";
import { listSongs, submitSong } from "./songs";
import { listMessages, submitMessage } from "./messages";
import { checkIn, lookup } from "./checkin";
import { submit as rsvp, search as rsvpSearch } from "./rsvp";
import { list as listTables, get as getTable, assignGuestToTable, seedTables } from "./tables";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const preflight = httpAction(async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
});

const router = httpRouter();

const apiPaths = [
  "/api/auth/login", "/api/auth/logout", "/api/auth/me",
  "/api/guests", "/api/guest", "/api/guest/delete",
  "/api/seating", "/api/seating/guest",
  "/api/songs", "/api/messages",
  "/api/checkin", "/api/checkin/lookup",
  "/api/rsvp", "/api/rsvp/search",
  "/api/tables", "/api/tables/get", "/api/tables/assign", "/api/tables/seed",
];
for (const p of apiPaths) {
  router.route({ path: p, method: "OPTIONS", handler: preflight });
}

router.route({ path: "/api/auth/login", method: "POST", handler: login });
router.route({ path: "/api/auth/logout", method: "POST", handler: logout });
router.route({ path: "/api/auth/me", method: "GET", handler: me });
router.route({ path: "/api/guests", method: "GET", handler: list });
router.route({ path: "/api/guest", method: "POST", handler: addOrUpdate });
router.route({ path: "/api/guest/delete", method: "POST", handler: deleteGuest });
router.route({ path: "/api/seating", method: "GET", handler: listAssigned });
router.route({ path: "/api/seating", method: "POST", handler: assign });
router.route({ path: "/api/seating/guest", method: "GET", handler: getByGuest });
router.route({ path: "/api/songs", method: "GET", handler: listSongs });
router.route({ path: "/api/songs", method: "POST", handler: submitSong });
router.route({ path: "/api/messages", method: "GET", handler: listMessages });
router.route({ path: "/api/messages", method: "POST", handler: submitMessage });
router.route({ path: "/api/checkin", method: "POST", handler: checkIn });
router.route({ path: "/api/checkin/lookup", method: "POST", handler: lookup });
router.route({ path: "/api/rsvp", method: "POST", handler: rsvp });
router.route({ path: "/api/rsvp/search", method: "GET", handler: rsvpSearch });
router.route({ path: "/api/tables", method: "GET", handler: listTables });
router.route({ path: "/api/tables/get", method: "GET", handler: getTable });
router.route({ path: "/api/tables/assign", method: "POST", handler: assignGuestToTable });
router.route({ path: "/api/tables/seed", method: "POST", handler: seedTables });

export default router;
