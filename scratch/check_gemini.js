import { getGeminiResponse } from './src/utils/gemini.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  console.log("Checking Gemini API key...");
  const response = await getGeminiResponse("Hello, are you there?");
  console.log("Response:", response);
}

check();
