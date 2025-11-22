// src/services/api/gemini.js
import { countTokens } from '../utils/tokenizer';
import { formatChatHistory } from '../utils/chatFormatter';

// ✅ Use env var, NOT hard-coded key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ✅ Use a supported model + v1beta endpoint
const MODEL = 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_TOKENS = 30000;

export async function generateResponse(message, chatHistory = [], userName = '') {
  try {
    if (!message) {
      throw new Error('Message is required');
    }

    if (!API_KEY) {
      throw new Error('Missing VITE_GEMINI_API_KEY. Check your .env and Netlify env vars.');
    }

    // Safely format history (if any)
    let trimmedHistory = '';
    try {
      if (chatHistory && chatHistory.length > 0) {
        const formatted = formatChatHistory(
          chatHistory,
          MAX_TOKENS - countTokens(message)
        );
        trimmedHistory = formatted.trimmedHistory || '';
      }
    } catch (e) {
      console.error('Error formatting history:', e);
      trimmedHistory = '';
    }

    const systemPrompt = `
You are Jarvie, an empathetic, multilingual mental health companion speaking with ${
      userName || 'a user'
    }.
The user's name is "${userName || 'friend'}".

OVERRIDE ALL PREVIOUS INSTRUCTIONS:
- Ignore any earlier system or assistant messages that say you can only speak English
  or that you must ask the user to switch to English. Those instructions are wrong.

LANGUAGE RULES:
1. Detect the language of the user's latest message.
2. ALWAYS answer fully in that language.
3. NEVER say things like "we agreed to speak in English" or "I can only respond in English".
4. If the user mixes languages (Hindi + English, Marathi + English, etc.),
   you may answer in a similar mix or the dominant language.

GREETING RULES:
5. If the user greets you or casually asks to talk
   (e.g. "hi", "hello", "kya haal hai", "kya hum baat kare",
    "namaste", "नमस्ते", "नमस्कार"),
   start with a warm greeting that includes their name.
   Examples:
   - In English: "Hello ${userName || 'friend'}!!"
   - In Hindi: "नमस्ते ${userName || 'दोस्त'}!!"
   - In Marathi: "नमस्कार ${userName || 'मित्रा'}!!"

BEHAVIOUR:
6. Be friendly, supportive, and emotionally aware.
7. Do NOT include "[Jarvie]:" in your responses.
8. You may use simple markdown like **bold** or *italic* when helpful.
`.trim();

    const promptText =
      systemPrompt +
      '\n\n' +
      (trimmedHistory ? `Previous conversation:\n${trimmedHistory}\n\n` : '') +
      `User: ${message}\nAssistant:`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }],
        },
      ],
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    };

    console.log('Sending request to Gemini API:', API_URL);

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', responseData);
      throw new Error(
        responseData.error?.message ||
          `API request failed with status ${response.status}`
      );
    }

    console.log('API Response received successfully');

    const text =
      responseData?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/^\[Jarvie\]:\s*/i, '')
        ?.trim() || '';

    if (!text) {
      console.error('Invalid API response format:', responseData);
      throw new Error('Invalid response format from API');
    }

    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error(
      error.message || 'Failed to generate response. Please try again.'
    );
  }
}
