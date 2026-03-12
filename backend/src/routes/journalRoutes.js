import express from "express";

import {
  createJournal,
  getJournals,
  analyzeJournal,
  getInsights,
} from "../controllers/journalController.js";

const router = express.Router();

router.post("/", createJournal);
router.get("/:userId", getJournals);
router.post("/analyze", analyzeJournal);
router.get("/insights/:userId", getInsights);

export default router;
