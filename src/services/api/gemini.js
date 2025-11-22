// src/services/gemini.js  (or wherever you keep it)
import { countTokens } from '../utils/tokenizer';
import { formatChatHistory } from '../utils/chatFormatter';

const API_KEY = "AIzaSyD-E7YtkUAIzaSyDZgUMuWgino6F5z-afswyymeKGT87twXQOKHD1cqkkIt_V65cc_UX2m8Dw";
const API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const MAX_TOKENS = 30000;

export async function generateResponse(message, chatHistory = [], userName = '') {
  if (!message) {
    throw new Error('Message is required');
  }

  if (!API_KEY) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Check .env and Netlify env vars.');
  }

  const availableTokens = MAX_TOKENS - countTokens(message);
  const { trimmedHistory } =
    chatHistory && chatHistory.length > 0
      ? formatChatHistory(chatHistory, availableTokens)
      : { trimmedHistory: '' };

  const systemPrompt = `You are Jarvie, an AI mental health companion speaking with ${
    userName || 'a user'
  }.
Be empathetic, supportive, and professional while maintaining conversation context.`;

  const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${trimmedHistory}\n\nUser: ${message}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: fullPrompt }],
      },
    ],
  };

  const res = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || `Gemini API error: ${res.status}`);
  }

  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';

  return text.trim();
}
