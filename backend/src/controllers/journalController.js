import { connectDB } from "../database/sqlite.js";
import { analyzeEmotion } from "../services/geminiService.js";
import { generateInsight } from "../services/insightService.js";
import { getEmotionTrends } from "../services/trendService.js";

export const getTrends = async (req, res) => {
  try {
    const trends = await getEmotionTrends();

    res.json(trends);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Trend analysis failed",
    });
  }
};

export const createJournal = async (req, res) => {
  try {
    const { text } = req.body;

    const db = await connectDB();

    await db.run(`INSERT INTO journals (text) VALUES (?)`, [text]);

    res.json({ message: "Journal entry saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJournals = async (req, res) => {
  try {
    const db = await connectDB();

    const journals = await db.all(
      `SELECT * FROM journals ORDER BY created_at DESC`,
    );

    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const analyzeJournal = async (req, res) => {
  try {
    const { text } = req.body;

    const emotionResult = await analyzeEmotion(text);

    const insightResult = await generateInsight(text, emotionResult.emotion);

    const db = await connectDB();

    await db.run(
      `INSERT INTO journals (text, emotion, confidence)
       VALUES (?, ?, ?)`,
      [text, emotionResult.emotion, emotionResult.confidence],
    );

    res.setHeader("Content-Type", "application/json");

    res.send(
      JSON.stringify(
        {
          emotion: emotionResult.emotion,
          confidence: emotionResult.confidence,
          insight: insightResult.insight,
          suggestion: insightResult.suggestion,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error("Analyze Journal Error:", error);

    res.status(500).json({
      error: "Emotion analysis failed",
    });
  }
};

export const getInsights = async (req, res) => {
  res.json({ message: "Insights endpoint coming next" });
};
