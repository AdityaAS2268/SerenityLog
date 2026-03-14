import express from "express";

import {
  createJournal,
  getJournals,
  analyzeJournal,
  getInsights,
  getTrends,
} from "../controllers/journalController.js";

const router = express.Router();

router.post("/", createJournal);
router.post("/analyze", analyzeJournal);

router.get("/journals", getJournals);
router.get("/insights", getInsights);
router.get("/trends", getTrends);

export default router;
