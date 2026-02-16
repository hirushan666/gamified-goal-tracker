import express from "express";
import auth from "../middleware/auth.js";
import {
  createChallenge,
  getChallenges,
  getChallenge,
  deleteChallenge,
} from "../controllers/challengeController.js";

const router = express.Router();

router.get("/", auth, getChallenges);
router.post("/", auth, createChallenge);
router.get("/:id", auth, getChallenge);
router.delete("/:id", auth, deleteChallenge);

export default router;
