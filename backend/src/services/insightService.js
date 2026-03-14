import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInsight = async (text, emotion) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const prompt = `
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const outputText = response.text();

    const jsonString = outputText.replace(/```json|```/g, "").trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Insight generation error:", error);
    throw new Error("Insight generation failed");
  }
};
