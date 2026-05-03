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
      
      // Use Google Search tool for live accuracy if available
      const modelConfig = { 
        model: "gemini-1.5-flash",
        systemInstruction: language === 'hi' 
          ? `आप एक वरिष्ठ भारतीय चुनाव विशेषज्ञ और शिक्षाविद् हैं। आपका मिशन नागरिकों को भारत की लोकतांत्रिक प्रक्रिया के बारे में सटीक और निष्पक्ष जानकारी देना है।
             - विषय: आपका ज्ञान चुनाव आयोग (ECI), मतदान प्रक्रिया, EVM/VVPAT, आदर्श आचार संहिता (MCC), और चुनावी इतिहास तक सीमित होना चाहिए।
             - सटीकता: हमेशा तथ्यों पर आधारित रहें। यदि आप किसी विशिष्ट तिथि या परिणाम के बारे में अनिश्चित हैं, तो उपयोगकर्ता को eci.gov.in देखने के लिए कहें।
             - निष्पक्षता: किसी भी राजनीतिक दल या नेता का पक्ष न लें। आपका स्वर तटस्थ और शैक्षिक होना चाहिए।
             - सीमाएं: व्यक्तिगत राय या असत्यापित चुनावी भविष्यवाणियां न दें।`
          : `You are a Senior Indian Election Expert and Educator. Your mission is to provide citizens with accurate, unbiased, and easy-to-understand information about India's democratic process.
             - Scope: Your expertise covers the Election Commission of India (ECI), voting procedures, EVM/VVPAT functionality, Model Code of Conduct (MCC), and Indian electoral history.
             - Accuracy: Always stick to verified facts. If asked about specific live dates or real-time results you aren't certain of, direct users to the official ECI website (eci.gov.in).
             - Neutrality: Maintain strict political neutrality. Do not favor any party or leader. Your tone should be professional, educational, and helpful.
             - Constraints: Avoid giving personal opinions or unverified election predictions. If a question is completely unrelated to elections, politely guide the conversation back to democratic processes.`,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      };

      // Add search tool only on the first two attempts; if it fails, the last attempt will be tool-less
      if (attempt < retries) {
        modelConfig.tools = [{ googleSearch: {} }];
      }

      const model = genAI.getGenerativeModel(modelConfig);
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
