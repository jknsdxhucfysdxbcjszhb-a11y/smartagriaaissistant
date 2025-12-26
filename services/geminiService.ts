
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CropDetails } from "../types";

const getBase64Parts = (dataUri: string) => {
  let mimeType = "image/jpeg";
  let base64Data = dataUri;

  const match = dataUri.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    mimeType = match[1];
    base64Data = match[2];
  } else {
    base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "");
  }
  return { mimeType, base64Data };
};

export const predictCrop = async (dataUri: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { mimeType, base64Data } = getBase64Parts(dataUri);

  const prompt = "Identify the main crop/plant in this image. Respond with ONLY the common name of the crop (e.g., 'Tomato', 'Maize', 'Coffee'). If unsure, provide the best guess.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ],
      },
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Crop Prediction Failed:", error);
    return "";
  }
};

export const analyzePlantImage = async (
  dataUri: string,
  details: CropDetails
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const { mimeType, base64Data } = getBase64Parts(dataUri);

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
    3. List 3-5 specific visual symptoms or affected plant parts visible (e.g., "Yellowing leaf margins", "Brown spots on stem", "Wilting tips").
    4. Provide a confidence score (e.g., "95%").
    5. Based on the crop type, age, and condition, recommend precise quantities for immediate care:
       - Water (liters per plant/plot)
       - Fertilizer (specific type and amount in kg/g)
    6. Recommend specific treatments for the disease with ESTIMATED MARKET VALUES:
       - Organic Solution: Provide the specific product name, estimated price, AND a brief benefit or application instruction in the format "Product Name | Price | Benefit/Application".
       - Inorganic Solution: Provide the specific chemical/brand name, estimated price, AND a brief benefit or application instruction in the format "Chemical Name | Price | Benefit/Application".
       - Recommended Pesticide: A summary of the most effective commercial product name.
       - Recommended Pesticide Market Value: The estimated current market price of the recommended pesticide.
    7. Provide simple, step-by-step remediation instructions. IMPORTANT: Format the instructions into two distinct sections labeled "ORGANIC PROTOCOL:" and "INORGANIC PROTOCOL:". Use bullet points for each step.
    8. Include a mandatory warning about the dangers of overuse of chemicals and safety/PPE advice.

    Tone: Simple, encouraging, farmer-friendly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING },
            confidence: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommended_water_liters: { type: Type.STRING },
            recommended_fertilizer: { type: Type.STRING },
            recommended_pesticide: { type: Type.STRING },
            recommended_pesticide_market_value: { type: Type.STRING },
            organic_solution: { type: Type.STRING },
            inorganic_solution: { type: Type.STRING },
            treatment_instructions: { type: Type.STRING },
            overuse_warning: { type: Type.STRING },
          },
          required: [
            "disease", "confidence", "severity", "symptoms", "recommended_water_liters",
            "recommended_fertilizer", "recommended_pesticide", "recommended_pesticide_market_value",
            "organic_solution", "inorganic_solution", "treatment_instructions", "overuse_warning",
          ],
        },
      },
    });

    if (response.text) {
      const text = response.text;
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        return JSON.parse(text.substring(startIndex, endIndex + 1)) as AnalysisResult;
      }
      return JSON.parse(text) as AnalysisResult;
    } else {
      throw new Error("No response text received");
    }
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
