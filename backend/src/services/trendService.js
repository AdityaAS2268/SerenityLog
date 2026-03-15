import { connectDB } from "../database/sqlite.js";
import redisClient from "../cache/redisClient.js";

export const getEmotionTrends = async () => {
  const cacheKey = "emotion_trends";

  // 1️⃣ Check Redis cache
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // 2️⃣ If cache miss, query database
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

  const result = {
    mostFrequentEmotion,
    emotionCounts,
  };

  // 3️⃣ Save result in Redis (5 minutes)
  await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

  return result;
};
