import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getPlaceInfo(placeName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a short, exciting, one-paragraph description for "${placeName}" in Manali, suitable for a group of young friends on a trip. Mention what makes it special.`,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks.map((chunk: any) => {
      if (chunk.web) return { ...chunk.web, type: 'web' };
      if (chunk.maps) return { uri: chunk.maps.uri, title: chunk.maps.title, type: 'map' };
      return null;
    }).filter(Boolean);

    if (!text) throw new Error("No content generated.");
    
    return { text, sources };

  } catch (error) {
    console.error("Error fetching place info:", error);
    return { text: "Could not fetch details for this place. Please try again.", sources: [] };
  }
}

export async function extractLocationsFromItinerary(details: string): Promise<string[]> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `From the following itinerary text, extract a list of specific, mappable tourist places, temples, valleys, or points of interest. Return only a JSON array of strings. Text: "${details}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const result = JSON.parse(response.text);
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Error extracting locations:", error);
        return [];
    }
}

export async function getTravelTips() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What are 3-4 essential travel tips for a group of young friends visiting Manali? Focus on things like packing, local transport, or unique experiences.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
        (chunk: any) => chunk.web
    ).filter(Boolean) || [];

    if (!text) throw new Error("No content generated.");

    return { text, sources };

  } catch (error) {
    console.error("Error fetching travel tips:", error);
    return { text: "Could not fetch travel tips right now. Please check your connection.", sources: [] };
  }
}

export async function generateCaptionForImage(base64Url: string, mimeType: string): Promise<string> {
  try {
    const base64Data = base64Url.split(',')[1];
    if (!base64Data) {
        throw new Error("Invalid base64 string");
    }

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Generate a fun, short, and creative caption for this image from a friends' trip to Manali. Keep it under 15 words. Be witty and engaging.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
    });
    
    const caption = response.text.trim().replace(/"/g, ''); // Clean up the output
    
    if (!caption) {
        throw new Error("Empty caption generated.");
    }
    
    return caption;

  } catch (error) {
    console.error("Error generating image caption:", error);
    return "Another great memory captured!"; // Fallback caption
  }
}