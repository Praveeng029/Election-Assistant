import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from 'fs';

// simple .env parser
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if (key && val) acc[key.trim()] = val.trim();
  return acc;
}, {});

const apiKey = env.VITE_GEMINI_API_KEY;

const testGemini = async () => {
  try {
    let url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    let allModels = [];
    while (url) {
      const res = await fetch(url);
      const data = await res.json();
      allModels = allModels.concat(data.models.map(m => m.name));
      if (data.nextPageToken) {
        url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageToken=${data.nextPageToken}`;
      } else {
        url = null;
      }
    }
    console.log("All Models:", allModels);
  } catch (error) {
    console.error("Caught Error:", error);
  }
};

testGemini();
