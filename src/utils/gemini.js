import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const getGeminiResponse = async (prompt, language = 'en') => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }],
      systemInstruction: language === 'hi' 
        ? "आप एक भारतीय चुनाव सहायक हैं। चुनाव प्रक्रिया के बारे में सटीक, अद्यतित (up-to-date) जानकारी दें।"
        : "You are an Indian Election Assistant. Answer only election related questions using the most up-to-date information.",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini SDK Detailed Error:", error);
    // Return a more descriptive error for debugging
    return `[AI Error]: ${error.message || "Unknown error"}. Please check your API key and connection.`;
  }
};



