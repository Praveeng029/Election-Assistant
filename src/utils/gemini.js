import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const responseCache = new Map();

export const getGeminiResponse = async (prompt, language = 'en', retries = 2) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }

  const cacheKey = `${language}-${prompt.toLowerCase().trim()}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const systemInstruction = language === 'hi' 
    ? "आप एक भारतीय चुनाव विशेषज्ञ हैं। Google Search का उपयोग करके ताज़ा और सटीक जानकारी दें।"
    : "You are an Indian Election Expert. Provide the latest and most accurate information using Google Search for real-time data.";

  const modelsToTry = ["gemini-1.5-flash-latest", "gemini-1.5-flash"];
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    const modelName = modelsToTry[attempt % modelsToTry.length];
    try {
      console.log(`Gemini API Attempt ${attempt + 1}/${retries + 1} using ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        tools: [{ googleSearch: {} }],
        systemInstruction,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (text && text.trim() !== '') {
        responseCache.set(cacheKey, text);
        return text;
      }
      
      throw new Error("EMPTY_RESPONSE");
      
    } catch (error) {
      console.error(`Gemini Error on attempt ${attempt + 1} (${modelName}):`, error.message);
      
      // If it's a 404, immediately retry with the next model name without waiting
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        continue; 
      }

      if (attempt === retries) {
        throw error;
      }
      
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }
  }
};
