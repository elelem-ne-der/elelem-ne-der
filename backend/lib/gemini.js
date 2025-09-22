const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. /api/ai/complete will fail until you configure it.");
}

const defaultModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function generateText({ prompt, model, system }) {
  if (!genAI) {
    throw new Error("Gemini client is not initialized. Please set GEMINI_API_KEY.");
  }
  const selectedModel = model || defaultModel;
  const generativeModel = genAI.getGenerativeModel({
    model: selectedModel,
    ...(system ? { systemInstruction: system } : {})
  });

  const result = await generativeModel.generateContent(prompt);
  return result.response.text();
}

module.exports = {
  generateText,
  defaultModel
};


