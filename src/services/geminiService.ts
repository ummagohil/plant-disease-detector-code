import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";

function getApiKey(): string {
  return (process.env.API_KEY || "") as string;
}

if (!getApiKey()) {
  // This will be caught by the App's error handling if API_KEY is not set.
  // In a real production app, you might have more robust handling or logging here.
  console.warn(
    "API_KEY environment variable is not set. Gemini API calls will fail."
  );
}

const model = "gemini-2.5-flash-preview-04-17"; // Suitable for multimodal tasks

const systemInstruction = `You are an expert plant pathologist and botanist. Analyze the provided image of a plant.
1. **Overall Assessment:** Start with a general assessment (e.g., 'The plant appears healthy,' or 'The plant shows signs of distress.').
2. **Specific Issues (if any):**
    * For each detected disease or pest:
        * **Name:** Clearly state the name of the disease/pest. Use bold for the name.
        * **Symptoms:** Describe the symptoms visible in the image and other common symptoms.
        * **Treatment:** Provide detailed, actionable treatment steps. Use bullet points for steps.
        * **Prevention:** Offer preventative measures for the future. Use bullet points.
3. **If Healthy:** If no issues are found, confirm its health and state: "This plant appears to be healthy. No immediate concerns detected."
Format your response clearly using headings (e.g., ## Assessment, ## Disease Name) and bullet points for lists. Be concise yet thorough.
`;

export const analyzePlantImage = async (
  base64ImageData: string,
  mimeType: string
): Promise<string> => {
  if (!getApiKey()) {
    throw new Error(
      "Gemini API Key is not configured. Please set the API_KEY environment variable."
    );
  }
  const ai = new GoogleGenAI({ apiKey: getApiKey() as string });
  try {
    const imagePart: Part = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };

    const textPart: Part = {
      text: "Please analyze this plant image based on your system instructions.",
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5, // Lower temperature for more factual, less creative responses
        topP: 0.9,
        topK: 40,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // More specific error messages could be added here based on error types from Gemini API
      if (
        error.message.includes("API_KEY_INVALID") ||
        error.message.includes("API key not valid")
      ) {
        throw new Error(
          "Invalid Gemini API Key. Please check your configuration."
        );
      }
    }
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
