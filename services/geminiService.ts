import { GoogleGenAI, Type } from "@google/genai";
import { ConversionResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const convertCurrency = async (
  amount: number,
  fromCode: string,
  toCode: string
): Promise<ConversionResult> => {
  try {
    const prompt = `
      Convert ${amount} ${fromCode} to ${toCode}.
      Provide the current estimated market exchange rate, the total converted amount, and a simulated list of the exchange rate for the past 7 days (including today) to visualize the trend.
      Ensure the dates are in 'YYYY-MM-DD' format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conversionRate: {
              type: Type.NUMBER,
              description: "The exchange rate used for conversion (1 unit of source to target).",
            },
            convertedAmount: {
              type: Type.NUMBER,
              description: "The total amount in the target currency.",
            },
            currencyCode: {
              type: Type.STRING,
              description: "The 3-letter code of the target currency.",
            },
            lastUpdated: {
              type: Type.STRING,
              description: "The date of the conversion rate.",
            },
            historicalRates: {
              type: Type.ARRAY,
              description: "Past 7 days of exchange rates for 1 unit of source currency.",
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  rate: { type: Type.NUMBER },
                },
                required: ["date", "rate"],
              },
            },
          },
          required: ["conversionRate", "convertedAmount", "currencyCode", "historicalRates"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini API");
    }

    return JSON.parse(resultText) as ConversionResult;
  } catch (error) {
    console.error("Error converting currency:", error);
    throw error;
  }
};
