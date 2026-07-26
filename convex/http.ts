import { httpRouter } from "convex/server";

import { login, logout, me } from "./auth";
import { list, addOrUpdate, deleteGuest } from "./guests";
import { listAssigned, assign, getByGuest } from "./seating";
import { listSongs, submitSong } from "./songs";
import { listMessages, submitMessage } from "./messages";
import { checkIn, lookup } from "./checkin";

const router = httpRouter();

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

export default router;
