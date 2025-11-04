import { GoogleGenAI } from "@google/genai";

// The API key is injected automatically.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getPlaceInfo(placeName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a short, exciting, one-paragraph description for "${placeName}" in Manali, suitable for a group of young friends on a trip. Mention what makes it special.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
        (chunk: any) => chunk.web
    ).filter(Boolean) || [];

    if (!text) {
        throw new Error("No content generated.");
    }
    
    return { text, sources };

  } catch (error) {
    console.error("Error fetching place info:", error);
    return { text: "Could not fetch details for this place. Please try again.", sources: [] };
  }
}