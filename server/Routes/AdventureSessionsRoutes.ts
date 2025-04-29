import express from "express";
import { createAdventureSession, fetchAdventureSessions } from "../controller/AdventureSessionsController";

const router = express.Router();

// Route to create a new adventure session
router.post("/", async (req, res) => {
  try {
    const session = await createAdventureSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
});

// Route to fetch all adventure sessions for a user
router.get("/:userId", async (req, res) => {
  try {
    const sessions = await fetchAdventureSessions(req.params.userId);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
});

export default router;