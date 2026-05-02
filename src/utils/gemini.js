import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt, language = 'en') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: language === 'hi' 
        ? "आप एक भारतीय चुनाव सहायक हैं। आप भारतीय चुनाव प्रक्रिया, नियमों और सामान्य ज्ञान के बारे में सटीक और उपयोगी जानकारी प्रदान करते हैं। हमेशा विनम्र रहें और केवल चुनाव से संबंधित प्रश्नों का उत्तर दें। हिंदी में उत्तर दें।"
        : "You are an Indian Election Assistant. You provide accurate and helpful information about the Indian electoral process, rules, and general knowledge. Always be polite and only answer questions related to elections. Answer in English.",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'hi' 
      ? "क्षमा करें, मुझे उत्तर देने में कुछ समस्या हो रही है। कृपया पुनः प्रयास करें।"
      : "Sorry, I'm having trouble responding right now. Please try again later.";
  }
};
