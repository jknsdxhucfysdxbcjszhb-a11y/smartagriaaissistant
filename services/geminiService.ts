import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CropDetails } from "../types";

export const analyzePlantImage = async (
  dataUri: string,
  details: CropDetails
): Promise<AnalysisResult> => {
  // Initialize AI client inside the function to ensure environment is ready
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  // Parse Data URI to separate MIME type and Base64 data
  // The API expects 'data' to be raw base64, not a Data URI.
  let mimeType = "image/jpeg";
  let base64Data = dataUri;

  const match = dataUri.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    mimeType = match[1];
    base64Data = match[2];
  } else {
    // Fallback: If it's already raw base64 or has a different format, 
    // try to strip a generic header if present.
    base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "");
  }

  const prompt = `
    Act as an expert agronomist and plant pathologist. Analyze the provided image of a plant.
    
    Context provided by farmer:
    - Crop Type: ${details.cropType}
    - Soil Type: ${details.soilType}
    - Plant Age: ${details.plantAge}
    ${details.location ? `- GPS Location: Lat ${details.location.latitude}, Long ${details.location.longitude}` : ''}

    Task:
    1. Identify any disease or deficiency present in the plant image. If healthy, state "Healthy".
    2. Assess the severity (low, medium, high).
    3. Provide a confidence score (e.g., "95%").
    4. Based on the crop type, age, and condition, recommend precise quantities for immediate care:
       - Water (liters per plant/plot)
       - Fertilizer (specific type and amount in kg/g)
    5. Recommend specific treatments for the disease with MARKET VALUES:
       - Organic Solution: Provide the specific product name AND estimated market price range (e.g., "Neem Oil - approx. $12/Liter").
       - Inorganic Solution: Provide the specific chemical/brand name AND estimated market price range (e.g., "Copper Oxychloride - approx. $25/kg").
       - Recommended Pesticide: A summary of the most effective commercial product name or active ingredient.
    6. Provide simple, step-by-step general care instructions (e.g., pruning, isolation).
    7. Include a mandatory warning about the dangers of overuse of chemicals.
    8. Always include safety & PPE (Personal Protective Equipment) advice.

    Tone: Simple, encouraging, farmer-friendly, yet authoritative on safety.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING, description: "Name of the disease or 'Healthy'" },
            confidence: { type: Type.STRING, description: "Confidence score percentage" },
            severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "Severity level" },
            recommended_water_liters: { type: Type.STRING, description: "Recommended water quantity with unit" },
            recommended_fertilizer: { type: Type.STRING, description: "Recommended fertilizer type and quantity" },
            recommended_pesticide: { type: Type.STRING, description: "Recommended pesticide type and quantity" },
            organic_solution: { type: Type.STRING, description: "Specific organic product name and estimated market price" },
            inorganic_solution: { type: Type.STRING, description: "Specific chemical product name and estimated market price" },
            treatment_instructions: { type: Type.STRING, description: "Step-by-step treatment guide" },
            overuse_warning: { type: Type.STRING, description: "Warning about chemical overuse and safety" },
          },
          required: [
            "disease",
            "confidence",
            "severity",
            "recommended_water_liters",
            "recommended_fertilizer",
            "recommended_pesticide",
            "organic_solution",
            "inorganic_solution",
            "treatment_instructions",
            "overuse_warning",
          ],
        },
      },
    });

    if (response.text) {
      // Robust JSON extraction to handle potential markdown code blocks or preamble
      const text = response.text;
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1) {
        const jsonString = text.substring(startIndex, endIndex + 1);
        return JSON.parse(jsonString) as AnalysisResult;
      } else {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText) as AnalysisResult;
      }
    } else {
      throw new Error("No response text received from AI");
    }
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};