// src/services/api/gemini.js

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Current, supported model + endpoint
const MODEL = 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Call Gemini to generate a Jarvie-style response.
 * @param {string} message  - User's latest message.
 * @param {string} context  - Optional previous conversation / extra system context.
 */
export async function generateResponse(message, context = '') {
  try {
    if (!message) {
      throw new Error('Message is required');
    }

    if (!API_KEY) {
      throw new Error('Missing VITE_GEMINI_API_KEY. Check your .env and Netlify env vars.');
    }

    // --- Jarvie system prompt with multilingual + special behaviour ---
    const systemPrompt = `
You are **Jarvie**, an empathetic, multilingual mental health companion.

CORE BEHAVIOUR:
1. Be warm, supportive, and emotionally aware.
2. Your job is to listen, validate feelings, and gently guide – not to give medical diagnoses.
3. Use simple language and short paragraphs so replies are easy to read.
4. You can use light emojis occasionally 🙂, but do not overuse them.

LANGUAGE RULES:
5. Detect the language of the user's latest message.
6. ALWAYS respond in the same language as the user's latest message.
7. If the user mixes languages (e.g. Hindi + English, Marathi + English),
   you may answer in a similar mix or in the dominant language they use.
8. NEVER say that you can only talk in English. Do not ask them to switch language.

SPECIAL HANDLING – CASUAL GREETINGS:
9. If the user sends friendly greetings or casual openers like:
   - "hi", "hello", "hey"
   - "kya haal hai", "kya haal hai jarvie", "kya hal hai", etc.
   - "kya hum baat kare", "chalo baat karte hai"
   - "namaste", "नमस्ते", "नमस्कार"
   then:
   a) Reply in the same language.
   b) Start with a warm greeting.
   c) For Hindi phrases like "kya haal hai" / "kya haal hai Jarvie",
      respond in a friendly way such as:
      "Main theek hoon, koi nahi, aap batao – aap kaise ho? 😊"
      and invite them to share how they feel.
   d) For Marathi greetings, you may say:
      "मी ठीक आहे, तुम्ही सांगा ना, कसे आहात?"

STYLE:
10. Do NOT prefix your messages with labels like "[Jarvie]:".
11. You may use simple markdown like **bold** or *italic* if it helps clarity.
12. Always stay kind, non-judgmental, and respectful.
`.trim();

    // Combine context (if any) + system prompt + latest user message
    const fullContext = [
      systemPrompt,
      context && context.trim() ? `Previous conversation or context:\n${context.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const prompt = `${fullContext}\n\nUser: ${message}\nAssistant:`;

    console.log('Gemini request message:', message);
    console.log('API key present?', !!API_KEY);

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || `Gemini request failed: ${response.status}`);
    }

    // Safely extract the text from the first candidate
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('') || '';

    return text.trim();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error(error.message || 'Failed to generate response');
  }
}
