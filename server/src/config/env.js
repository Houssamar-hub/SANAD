require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sanad',
  JWT_SECRET: process.env.JWT_SECRET || 'sanad_fallback_secret_key_2026',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  TAVILY_API_KEY: process.env.TAVILY_API_KEY || '',
  MAPTILER_API_KEY: process.env.MAPTILER_API_KEY || '',
  CLIENT_URL: process.env.CLIENT_URL || '*'
};

module.exports = env;
