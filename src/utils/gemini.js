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

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Gemini API Attempt ${attempt + 1}/${retries + 1} with gemini-1.5-flash-latest...`);
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        tools: [{ googleSearch: {} }],
        systemInstruction,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
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
      console.error(`Gemini Error on attempt ${attempt + 1}:`, error.message);
      
      if (attempt === retries) {
        throw error; // Re-throw the last error so UI can handle it
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }
  }
};
