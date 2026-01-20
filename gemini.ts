
import { GoogleGenAI } from "@google/genai";
import { ProductionRecord } from "../types";

export const getProductionInsights = async (records: ProductionRecord[]) => {
  try {
    // API Key ని నేరుగా process.env నుండి తీసుకుంటున్నాము
    // @ts-ignore
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("API_KEY is not configured.");
      return "క్షమించండి, AI విశ్లేషణ అందుబాటులో లేదు. దయచేసి API Key ని సెట్ చేయండి.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const summaryData = records.slice(-5).map(r => ({
      machine: r.machineId,
      total: r.hourlyProduction.reduce((acc, h) => acc + h.count, 0),
      breakdown: r.breakdown.durationMinutes
    }));

    if (summaryData.length === 0) return "డేటా నమోదు కాలేదు.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional factory consultant. Based on these egg tray production records, provide a very short, encouraging 2-sentence feedback in Telugu for the factory owner: ${JSON.stringify(summaryData)}`,
    });

    return response.text || "విశ్లేషణ విఫలమైంది.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI విశ్లేషణ ప్రస్తుతం అందుబాటులో లేదు.";
  }
};
