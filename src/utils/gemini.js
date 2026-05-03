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
        model: "gemini-2.5-flash",
        tools: [{ googleSearch: {} }],
        systemInstruction: language === 'hi' 
          ? "आप एक भारतीय चुनाव विशेषज्ञ हैं। आपको केवल चुनाव, मतदान प्रक्रिया, और राजनीति से संबंधित प्रश्नों के उत्तर देने हैं। यदि उपयोगकर्ता चुनाव से असंबंधित कुछ पूछता है, तो विनम्रतापूर्वक उत्तर देने से मना कर दें।"
          : "You are an Indian Election Expert. You must ONLY answer questions related to elections, voting processes, and politics. If the user asks something completely unrelated to elections, politely refuse to answer.",
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
      console.error(`Gemini SDK Error (Attempt ${attempt + 1}/${retries + 1}):`, error);
      
      // Don't retry on missing API key or safety errors
      if (error.message === "API_KEY_MISSING" || error.message?.includes("SAFETY")) {
        throw error;
      }
      
      // If it's the last attempt, throw the generic API error
      if (attempt === retries) {
        throw new Error("API_ERROR");
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }
  }
};
