import { connectDB } from "../database/sqlite.js";

export const getEmotionTrends = async () => {
  const db = await connectDB();

  const rows = await db.all(`
    SELECT emotion, COUNT(*) as count
    FROM journals
    GROUP BY emotion
  `);

  const emotionCounts = {};

  rows.forEach((row) => {
    emotionCounts[row.emotion] = row.count;
  });

  const mostFrequentEmotion =
    rows.sort((a, b) => b.count - a.count)[0]?.emotion || "neutral";

  return {
    mostFrequentEmotion,
    emotionCounts,
  };
};
