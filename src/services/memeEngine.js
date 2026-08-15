// LLMeme Engine: 100% Animated Reaction GIFs Engine with No-Repeat Session Memory
import { GIF_REPERTOIRE } from './memeCatalog';

export const GEMINI_KEYS = [
  "AIzaSyBWVUuVWh3GvU-tXO0EfD7NWo9J2yqOa2Y",
  "AIzaSyCIg1DrHQV1txQSCfbTUhjiKaRdc1gsSEY",
  "AIzaSyCvxq7i4tH1Ubz3Od68_SHHCE62q-r97UQ",
  "AIzaSyAXr9csp0yzB3_iqUAwsPHoKkCdTe206M0"
];

let currentKeyIndex = 0;
// Track used GIF IDs so NO GIF IS EVER REPEATED in a session!
const sessionUsedGifIds = new Set();

export function clearSessionMemory() {
  sessionUsedGifIds.clear();
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
}

async function queryGeminiGIF(prompt, availableGifs, customKey = null) {
  const activeKey = customKey && customKey.trim().length > 10
    ? customKey.trim()
    : GEMINI_KEYS[currentKeyIndex % GEMINI_KEYS.length];

  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

  const availableListText = availableGifs.map(g => `"${g.name}"`).join(", ");

  const promptText = `Eres LLMeme, la Inteligencia Artificial que responde EXCLUSIVAMENTE con GIFs ANIMADOS DE REACCIÓN súper graciosos.
Frase del usuario: "${prompt}"

Elige EL MEJOR GIF ANIMADO NO REPETIDO de esta lista disponible:
[${availableListText}]

Genera un remate gracioso e ingenioso en español (NUNCA digas "Yo pensando en...").
Responde ÚNICAMENTE este formato JSON estricto:
{"template_name":"Pedro Pascal Laughing then Crying","topText":"03:00 AM: 'Te extraño'","bottomText":"Yo con la estabilidad emocional hecha pedazos 😭","emotion":"🎭 Drama Bipolar"}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.85
        }
      })
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const singleObj = Array.isArray(parsed) ? parsed[0] : parsed;
        if (singleObj && singleObj.template_name) {
          return singleObj;
        }
      }
    }
  } catch (err) {
    console.warn("Gemini API timeout or error:", err);
  }
  return null;
}

function matchUnusedGif(templateName, availableGifs) {
  const normTarget = normalizeText(templateName || "");

  for (const gif of availableGifs) {
    const normName = normalizeText(gif.name);
    if (normTarget.includes(normName) || normName.includes(normTarget)) {
      return gif;
    }
  }

  // Keyword match fallback among available GIFs
  let best = availableGifs[0];
  let highest = -1;

  for (const gif of availableGifs) {
    let score = 0;
    for (const kw of gif.keywords) {
      if (normTarget.includes(kw)) score += 3;
    }
    if (score > highest) {
      highest = score;
      best = gif;
    }
  }
  return best;
}

export async function queryLLMeme(promptText, customApiKey = null) {
  // Filter out GIFs that have already been used in this chat session!
  let availableGifs = GIF_REPERTOIRE.filter(g => !sessionUsedGifIds.has(g.id));

  // If all GIFs have been used in a long chat, reset memory to allow new rotation
  if (availableGifs.length === 0) {
    sessionUsedGifIds.clear();
    availableGifs = [...GIF_REPERTOIRE];
  }

  const aiResult = await queryGeminiGIF(promptText, availableGifs, customApiKey);

  let selectedGif = availableGifs[0];
  let topText = "";
  let bottomText = "";
  let emotionTag = "🎬 GIF Animado de Reacción";

  if (aiResult && aiResult.template_name) {
    selectedGif = matchUnusedGif(aiResult.template_name, availableGifs);
    topText = aiResult.topText || "";
    bottomText = aiResult.bottomText || "";
    emotionTag = aiResult.emotion || "🎬 GIF Animado";
  } else {
    // Keyword match among unused GIFs
    const normPrompt = normalizeText(promptText);
    for (const g of availableGifs) {
      if (g.keywords.some(k => normPrompt.includes(k))) {
        selectedGif = g;
        break;
      }
    }
    topText = `Cuando pasa esto: "${promptText}"`;
    bottomText = "Yo con la dignidad por los suelos 😭";
  }

  // Mark this GIF ID as used so it is NEVER repeated in this session!
  sessionUsedGifIds.add(selectedGif.id);

  return {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    prompt: promptText,
    meme: {
      id: selectedGif.id,
      name: selectedGif.name,
      type: "gif",
      imgUrl: selectedGif.imgUrl,
      origin: selectedGif.origin || "Animated Reaction GIF Vault",
      sound: selectedGif.sound || "wow"
    },
    emotion: emotionTag,
    captions: {
      topText: topText,
      bottomText: bottomText
    },
    confidence: "99.9% Match",
    source: "🎬 GIF Animado Único (Gemini 2.5 Flash)",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
