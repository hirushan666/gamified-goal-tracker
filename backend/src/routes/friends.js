import express from "express";
import auth from "../middleware/auth.js";
import {
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  getFriends,
  removeFriend,
} from "../controllers/friendController.js";

const router = express.Router();

router.get("/", auth, getFriends);
router.post("/request", auth, sendRequest);
router.get("/requests", auth, getRequests);
router.put("/requests/:id/accept", auth, acceptRequest);
router.put("/requests/:id/reject", auth, rejectRequest);
router.delete("/:id", auth, removeFriend);

export default router;
