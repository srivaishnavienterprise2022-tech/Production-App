import { GoogleGenAI } from "@google/genai";
import { ProductionRecord } from "../types";

export const getProductionInsights = async (records: ProductionRecord[]) => {
  try {
    // API Key ని నేరుగా initialization లో ఉపయోగిస్తున్నాము
    // Vite build సమయంలో process.env.API_KEY అనేది vite.config.ts లోని 'define' ద్వారా ఇంజెక్ట్ అవుతుంది.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    if (!process.env.API_KEY) {
      return "గమనిక: API Key సెట్ చేయబడలేదు. Vercel Settings లో API_KEY యాడ్ చేయండి.";
    }

    const summaryData = records.slice(-5).map(r => ({
      machine: r.machineId,
      total: r.hourlyProduction.reduce((acc, h) => acc + h.count, 0),
      breakdown: r.breakdown.durationMinutes
    }));

    if (summaryData.length === 0) return "విశ్లేషించడానికి తగినంత డేటా లేదు.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert egg tray manufacturing consultant. 
      Analyze this production data and give a very brief 2-sentence advice in Telugu to the owner: ${JSON.stringify(summaryData)}`,
    });

    return response.text || "విశ్లేషణ విఫలమైంది.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI ప్రస్తుతం అందుబాటులో లేదు. దయచేసి ఇంటర్నెట్ మరియు API Key చెక్ చేయండి.";
  }
};
