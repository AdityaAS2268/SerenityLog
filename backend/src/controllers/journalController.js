import { connectDB } from "../database/sqlite.js";
import { analyzeEmotion } from "../services/geminiService.js";
import { generateInsight } from "../services/insightService.js";
import redisClient from "../cache/redisClient.js";

export const getEmotionTrends = async (req, res) => {
  try {
    const db = await connectDB();

    const rows = await db.all(`SELECT emotion FROM journals`);

    if (!rows || rows.length === 0) {
      return res.json({ emotionCounts: {} });
    }

    const emotionCounts = {};

    rows.forEach((row) => {
      if (!row.emotion) return;

      emotionCounts[row.emotion] = (emotionCounts[row.emotion] || 0) + 1;
    });

    res.json({ emotionCounts });
  } catch (error) {
    console.error("Trend error:", error);
    res.json({ emotionCounts: {} });
  }
};

export const createJournal = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Journal text is required",
      });
    }

    const db = await connectDB();

    await db.run(`INSERT INTO journals (text) VALUES (?)`, [text]);

    // Clear trends cache because data changed
    await redisClient.del("emotion_trends");

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

    console.log("Text Received: ", text);

    if (!text || text.length < 5) {
      return res.status(400).json({
        error: "Journal entry must contain at least 5 characters",
      });
    }

    const cacheKey = `analysis:${text}`;

    let cachedResult = null;

    if (redisClient) {
      // 1️⃣ Check Redis cache
      cachedResult = await redisClient.get(cacheKey);
    }

    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    // 2️⃣ If cache miss → call Gemini
    const emotionResult = await analyzeEmotion(text);

    console.log("Emotion: ", emotionResult);

    const insightResult = await generateInsight(text, emotionResult.emotion);

    const result = {
      emotion: emotionResult.emotion,
      confidence: emotionResult.confidence,
      insight: insightResult.insight,
      suggestion: insightResult.suggestion,
    };

    const db = await connectDB();

    await db.run(
      `INSERT INTO journals (text, emotion, confidence)
       VALUES (?, ?, ?)`,
      [text, emotionResult.emotion, emotionResult.confidence],
    );

    if (redisClient) {
      // 3️⃣ Store full result in Redis (30 minutes)
      await redisClient.setEx(cacheKey, 1800, JSON.stringify(result));
    }

    if (redisClient) {
      // 4️⃣ Clear trends cache
      await redisClient.del("emotion_trends");
    }

    res.json(result);
  } catch (error) {
    console.error("Analyze Journal Error:", error);

    res.status(500).json({
      error: "Emotion analysis failed",
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    const db = await connectDB();

    const journal = await db.get(
      `SELECT text, emotion FROM journals ORDER BY created_at DESC LIMIT 1`,
    );

    if (!journal) {
      return res.json({
        message: "No journal entries yet",
      });
    }

    const insightResult = await generateInsight(journal.text, journal.emotion);

    res.json({
      text: journal.text,
      emotion: journal.emotion,
      insight: insightResult.insight,
      suggestion: insightResult.suggestion,
    });
  } catch (error) {
    console.error("Insights error:", error);

    res.status(500).json({
      error: "Insight generation failed",
    });
  }
};

export const getEmotionTimeline = async (req, res) => {
  try {
    const db = await connectDB();

    const rows = await db.all(`
      SELECT emotion, created_at
      FROM journals
      ORDER BY created_at ASC
      LIMIT 10
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Timeline retrieval failed",
    });
  }
};
