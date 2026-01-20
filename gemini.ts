
import { GoogleGenAI } from "@google/genai";
import { ProductionRecord } from "../types";

export const getProductionInsights = async (records: ProductionRecord[]) => {
  try {
    // API KEY ని నేరుగా పర్యావరణం నుండి తీసుకుంటుంది.
    // @ts-ignore
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return "API Key సెట్ చేయబడలేదు. దయచేసి Vercel Settings లో API_KEY ని కాన్ఫిగర్ చేయండి.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const summaryData = records.slice(-5).map(r => ({
      machine: r.machineId,
      total: r.hourlyProduction.reduce((acc, h) => acc + h.count, 0),
      breakdown: r.breakdown.durationMinutes
    }));

    if (summaryData.length === 0) return "విశ్లేషించడానికి తగినంత డేటా లేదు.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert factory consultant. Analyze these production records and give a 2-sentence feedback in Telugu. Focus on efficiency and breakdowns: ${JSON.stringify(summaryData)}`,
    });

    return response.text || "క్షమించండి, విశ్లేషణ చేయలేకపోయాను.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI సర్వర్ కనెక్ట్ అవ్వడంలో సమస్య ఉంది.";
  }
};
