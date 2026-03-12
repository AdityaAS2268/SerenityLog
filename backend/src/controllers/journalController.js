import { connectDB } from "../database/sqlite.js";

export const createJournal = async (req, res) => {
  try {
    const { userId, ambience, text } = req.body;

    const db = await connectDB();

    await db.run(
      "INSERT INTO journals (userId, ambience, text) VALUES (?, ?, ?)",
      [userId, ambience, text],
    );

    res.json({ message: "Journal entry saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJournals = async (req, res) => {
  try {
    const { userId } = req.params;

    const db = await connectDB();

    const journals = await db.all(
      "SELECT * FROM journals WHERE userId = ? ORDER BY createdAt DESC",
      [userId],
    );

    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const analyzeJournal = async (req, res) => {
  res.json({ message: "Analyze endpoint will use Gemini soon" });
};

export const getInsights = async (req, res) => {
  res.json({ message: "Insights endpoint coming next" });
};
