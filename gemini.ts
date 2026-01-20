
import { GoogleGenAI } from "@google/genai";
import { ProductionRecord } from "../types";

export const getProductionInsights = async (records: ProductionRecord[]) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "API Key సెట్ చేయబడలేదు. Vercel Settings లో చెక్ చేయండి.";

    const ai = new GoogleGenAI({ apiKey });
    
    const summaryData = records.slice(-5).map(r => ({
      m: r.machineId,
      t: r.hourlyProduction.reduce((acc, h) => acc + h.count, 0),
      b: r.breakdown.durationMinutes
    }));

    if (summaryData.length === 0) return "డేటా అందుబాటులో లేదు.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these egg tray machine records and provide a very brief 2-sentence feedback in Telugu for the factory owner: ${JSON.stringify(summaryData)}`,
    });

    return response.text || "విశ్లేషణ విఫలమైంది.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI అనలిటిక్స్ ప్రస్తుతం అందుబాటులో లేదు.";
  }
};
