import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const responseCache = new Map();

export const getGeminiResponse = async (prompt, language = 'en') => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }

  // Cache check for performance
  const cacheKey = `${language}-${prompt.toLowerCase().trim()}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  const genAI = new GoogleGenerativeAI(apiKey);
  const systemInstruction = language === 'hi' 
    ? "आप एक भारतीय चुनाव विशेषज्ञ हैं। भारतीय चुनाव प्रक्रिया और ताज़ा घटनाक्रमों के बारे में सटीक जानकारी दें।"
    : "You are an Indian Election Expert. Provide accurate and up-to-date information about the Indian electoral process and current events.";

  // Try with Google Search tool first for "up-to-date" requirement
  try {
    const searchModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      tools: [{ googleSearch: {} }],
      systemInstruction,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const result = await searchModel.generateContent(prompt);
    const text = result.response.text();
    if (text) {
      responseCache.set(cacheKey, text);
      return text;
    }
  } catch (searchError) {
    console.warn("Gemini Search failed, falling back to standard model:", searchError.message);
    
    // Fallback to standard model without tools if Search fails
    try {
      const standardModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction,
      });
      const result = await standardModel.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        responseCache.set(cacheKey, text);
        return text;
      }
    } catch (finalError) {
      console.error("Gemini API Error:", finalError);
      return language === 'hi' 
        ? "क्षमा करें, मुझे अभी उत्तर देने में समस्या हो रही है। कृपया eci.gov.in देखें।"
        : "I'm having trouble responding right now. For the latest updates, please visit the official ECI website at eci.gov.in.";
    }
  }
  
  return language === 'hi' ? "क्षमा करें, मुझे कोई उत्तर नहीं मिला।" : "I couldn't find an answer for that.";
};
