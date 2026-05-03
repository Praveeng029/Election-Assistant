import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const responseCache = new Map();

export const getGeminiResponse = async (prompt, language = 'en', retries = 2) => {
  if (!navigator.onLine) {
    throw new Error("OFFLINE");
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }

  const cacheKey = `${language}-${prompt.toLowerCase().trim()}`;
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        systemInstruction: language === 'hi' 
          ? "आप एक भारतीय चुनाव विशेषज्ञ हैं। केवल चुनाव, मतदान और राजनीति के उत्तर दें।"
          : "You are an Indian Election Expert. Only answer questions related to elections, voting, and politics.",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (!text || text.trim() === '') {
        throw new Error("EMPTY_RESPONSE");
      }
      
      responseCache.set(cacheKey, text);
      return text;
      
    } catch (error) {
      // Detailed logging for debugging
      console.error(`Gemini API Error (Attempt ${attempt + 1}/${retries + 1}):`, {
        message: error.message,
        stack: error.stack,
        prompt: prompt.substring(0, 50) + "..."
      });
      
      if (error.message === "API_KEY_MISSING" || error.message?.includes("SAFETY")) {
        throw error;
      }
      
      if (attempt === retries) {
        // Return a graceful fallback instead of crashing
        return language === 'hi'
          ? "माफ़ कीजिये, मैं अभी उत्तर नहीं दे पा रहा हूँ। कृपया भारतीय चुनाव आयोग की वेबसाइट (eci.gov.in) देखें।"
          : "I'm currently unable to fetch a specific answer. For the most accurate information, please visit the Election Commission of India website at eci.gov.in.";
      }
      
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }
  }
};
