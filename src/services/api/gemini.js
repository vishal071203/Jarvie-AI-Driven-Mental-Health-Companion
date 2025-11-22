// src/services/api/gemini.js

// Read API key from .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Latest valid Gemini model
const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Jarvie: Mental-Health Companion AI
 * @param {string} message - User’s current message
 * @param {string} context - Previous conversation text (optional)
 */
export async function generateResponse(message, context = '') {
  try {
    if (!API_KEY) {
      throw new Error("Missing VITE_GEMINI_API_KEY. Check .env & Netlify variables.");
    }
    if (!message) throw new Error("Message is required.");

    // 🔥 System Prompt – defines Jarvie's personality
    const systemPrompt = `
You are **Jarvie**, an empathetic AI mental-health and emotional-support companion.

YOUR ROLE:
- You help with feelings, emotions, stress, anxiety, loneliness, motivation and self-understanding.
- You DO NOT give medical or professional clinical advice.
- You ALWAYS remain kind, gentle, validating and safe.

LANGUAGE RULES:
1. Detect user's language automatically.
2. ALWAYS reply in the same language (Hindi, Marathi, English, or mixed).
3. If user mixes languages, you may also respond in mixed language.
4. NEVER tell them to switch languages or that you can only speak English.

USER NAME RULES:
5. If user says "my name is X", "mera naam X hai", "माझं नाव X आहे":
   - Extract the name.
   - Remember it for this conversation.
6. If name is known (e.g., Vishal), use it warmly in replies:
   - "Vishal, tum kaise ho?"
   - "Vishal, मी तुझं ऐकण्यासाठी इथे आहे."
   - "How are you feeling today, Vishal?"
7. If the name is NOT known, do NOT call them "friend".
   - Instead use natural words like:
       Hindi → "dost", "bhai"
       Marathi → "मित्रा"
       English → respond normally without name

MENTAL-HEALTH DOMAIN RULE:
8. If user asks anything outside emotional wellbeing (e.g., coding, maths, exam answers, programming, politics):
   Respond with:
   "I am designed as a mental-health and emotional-support companion, so I focus only on feelings, mood, stress, and emotional wellbeing. But I can still talk to you or help you express what you feel."

GREETING RULE:
9. If user writes "kya haal hai", "namaste", "नमस्कार", "hello", etc.:
   Respond warmly in same language:
   - "Main theek hoon Vishal, tum batao kaise ho? 😊"
   - "मी ठीक आहे Vishal, तुम्ही सांगा?"

STYLE:
10. Be conversational, short, warm and non-judgmental.
11. NEVER use labels like [Jarvie]: in responses.
12. Use simple emojis when helpful 🙂 but not too many.
`.trim();

    const finalPrompt = `
${systemPrompt}

${context ? `Previous conversation:\n${context}\n` : ''}

User: ${message}
Assistant:
`.trim();

    console.log("Gemini request:", message);
    console.log("Using API Key?", !!API_KEY);
    console.log("Model:", MODEL);

    // Send request
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: finalPrompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Gemini request failed.");
    }

    // Extract final text
    const output =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("") || "";

    return output.trim();
  } catch (err) {
    console.error("Error generating response:", err);
    return "Sorry, I'm having trouble right now. Please try again in a moment.";
  }
}
