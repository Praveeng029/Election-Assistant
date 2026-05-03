import { GoogleGenerativeAI } from "@google/generative-ai";

const responseCache = new Map();

export const getGeminiResponse = async (prompt, language = 'en') => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }

  // Cache check for performance
  const cacheKey = `${language}-${prompt.toLowerCase().trim()}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: language === 'hi' 
        ? "आप एक भारतीय चुनाव सहायक हैं। आप भारतीय चुनाव प्रक्रिया और सामान्य ज्ञान के बारे में उपयोगी जानकारी प्रदान करते हैं। केवल चुनाव से संबंधित प्रश्नों का उत्तर दें।"
        : "You are an Indian Election Assistant. You provide helpful information about the Indian electoral process and general knowledge. Only answer questions related to elections.",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (text) responseCache.set(cacheKey, text);
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Graceful fallback for accurate user experience
    return language === 'hi' 
      ? "क्षमा करें, मुझे उत्तर देने में समस्या हो रही है। कृपया चुनाव आयोग की वेबसाइट (eci.gov.in) देखें।"
      : "I'm having trouble responding right now. For accurate information, please visit eci.gov.in.";
  }
};
