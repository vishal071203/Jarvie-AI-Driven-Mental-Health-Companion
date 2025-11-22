// src/services/api/gemini.js

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Latest supported Gemini model
const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Generate Jarvie-style response.
 */
export async function generateResponse(message, context = '', userName = '') {
  try {
    if (!message) throw new Error('Message is required');
    if (!API_KEY) throw new Error('Missing VITE_GEMINI_API_KEY.');

    // If username is not provided, use blank (not "friend")
    const nameUsed = userName?.trim() || '';

    const systemPrompt = `
You are **Jarvie**, an empathetic multilingual mental health companion.

NAME RULES:
1. If the app provides a user name: always use it warmly.
   Example: "Kaise ho ${nameUsed}?"  (if userName exists)
2. If no user name exists (empty string): 
   - Do NOT use "friend"
   - Do NOT invent names
   - In Hindi, you may use "bhai", "dost"
   - In Marathi, "मित्रा"
   - In English, respond naturally without addressing the user by name.

LANGUAGE RULES:
3. Detect user language automatically.
4. ALWAYS respond in the same language as the user's message.
5. If user mixes languages, you may respond in mixed tone too.
6. NEVER say you can only speak English.

SPECIAL Hindi phrases:
7. For "kya haal hai", "kya haal hai jarvie", "kya hal hai":
   Respond kindly:
   - "Main theek hoon ${nameUsed ? nameUsed : 'dost'}, tum batao kaise ho? 😊"

SPECIAL Marathi phrases:
8. For greetings like "नमस्कार", "काय चाललंय":
   Respond:
   - "मी ठीक आहे ${nameUsed ? nameUsed : 'मित्रा'}, तुम्ही सांगा?"

STYLE:
9. Be warm, empathetic, non-judgmental.
10. Use short, easy-to-read replies.
11. Do not use labels like [Jarvie]:.
`.trim();

    const fullContext = [
      systemPrompt,
      context?.trim()
        ? `Previous context:\n${context.trim()}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const fullPrompt = `${fullContext}\n\nUser: ${message}\nAssistant:`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: fullPrompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Error: ${response.status}`);
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || '')
        .join('') || '';

    return text.trim();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error(error.message);
  }
}
