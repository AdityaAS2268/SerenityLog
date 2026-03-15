import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { getEmotionTrends } from "./trendService.js";
import redisClient from "../cache/redisClient.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInsight = async (text = null, emotion = null) => {
  try {
    let cacheKey;

    // -------- MODE 1: Single Journal Entry Insight --------
    if (text && emotion) {
      cacheKey = `insight:${text}`;
    }

    // -------- MODE 2: Overall Emotional Trends Insight --------
    else {
      cacheKey = "insight:trends";
    }

    // 1️⃣ Check Redis Cache
    const cachedInsight = await redisClient.get(cacheKey);

    if (cachedInsight) {
      return JSON.parse(cachedInsight);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    let prompt;

    // -------- MODE 1: Single Journal Entry Insight --------
    if (text && emotion) {
      prompt = `
You are a mental wellness assistant.

A user wrote the following journal entry:

"${text}"

Detected emotion: ${emotion}

Generate:

1. A short emotional insight
2. A supportive suggestion

Return ONLY JSON:

{
 "insight": "short reflection",
 "suggestion": "helpful suggestion"
}
`;
    }

    // -------- MODE 2: Emotional Trends Insight --------
    else {
      const trends = await getEmotionTrends();

      prompt = `
You are a mental wellness assistant.

A user's emotional trends from journal entries are:

${JSON.stringify(trends)}

Generate:

1. A short emotional summary
2. The dominant emotion
3. A helpful wellness suggestion

Return ONLY JSON:

{
 "summary": "emotional overview",
 "dominantEmotion": "emotion name",
 "wellnessAdvice": "suggestion"
}
`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const outputText = response.text();

    const jsonString = outputText.replace(/```json|```/g, "").trim();

    const insightData = JSON.parse(jsonString);

    // 2️⃣ Save result to Redis cache (10 minutes)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(insightData));

    return insightData;
  } catch (error) {
    console.error("Insight generation error:", error);
    throw new Error("Insight generation failed");
  }
};
