import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeEmotion = async (text) => {
  try {
    // Using the 3.1 Preview model name from your dashboard
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const prompt = `
        Analyze the emotion of the following journal entry.

        Choose ONLY ONE emotion from this list:

        joy
        sadness
        anger
        fear
        calm
        stress
        neutral

        Return ONLY JSON:

        {
        "emotion": "emotion_name",
        "confidence": number_between_0_and_1
        }

        Journal entry:
        ${text}
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const outputText = response.text();

    // Clean up markdown and parse
    const jsonString = outputText.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("--- Gemini Preview Error ---");
    console.error("Status:", error.status);
    console.error("Message:", error.message);

    // If it still 404s, it means the API name is slightly different in your region.
    if (error.message.includes("404")) {
      console.log(
        "Tip: Try changing the model name to 'gemini-3-flash-preview'",
      );
    }

    throw new Error("Emotion analysis failed");
  }
};
