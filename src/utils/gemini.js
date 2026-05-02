import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (prompt, language = 'en') => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    throw new Error("Gemini API Key is missing or invalid.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: language === 'hi' 
        ? "आप एक भारतीय चुनाव सहायक हैं। आप भारतीय चुनाव प्रक्रिया के बारे में सटीक जानकारी देते हैं। विनम्र रहें।"
        : "You are an Indian Election Assistant. You provide accurate info about the Indian electoral process. Be polite.",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    throw error;
  }
};

