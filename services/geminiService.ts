import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";
import { TOTAL_BUDGET } from "../constants";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const getBudgetAdvice = async (transactions: Transaction[]) => {
  try {
    const ai = getGeminiClient();
    
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = TOTAL_BUDGET - totalSpent;
    
    // Summarize data for the prompt to save tokens
    const categoryBreakdown = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `
      I am managing a kitchen renovation project.
      Total Budget: ₹${TOTAL_BUDGET}
      Total Spent: ₹${totalSpent}
      Remaining: ₹${remaining}
      
      Spending by Category:
      ${JSON.stringify(categoryBreakdown, null, 2)}
      
      Recent Transactions (last 5):
      ${JSON.stringify(transactions.slice(0, 5).map(t => `${t.date}: ${t.description} (${t.amount})`), null, 2)}

      Please provide a brief, helpful financial assessment. 
      1. Are we on track? 
      2. Any specific warnings based on typical kitchen renovation costs (e.g. if labor seems low compared to materials)?
      3. A quick tip for saving money.
      Keep it under 150 words. Format with bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Unable to generate advice at this time. Please check your API key.";
  }
};