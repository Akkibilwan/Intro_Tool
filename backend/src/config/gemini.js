/**
 * Google Gemini AI Configuration
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get Gemini model instance
 * Using Gemini 2.5 Pro for best video analysis quality
 */
function getModel(modelName = 'gemini-2.5-pro') {
  return genAI.getGenerativeModel({ model: modelName });
}

module.exports = {
  genAI,
  getModel
};
