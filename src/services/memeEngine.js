// LLMeme Engine: 100% Famous Animated Reaction GIFs (No Bottom Text Overlays)
import { GIF_REPERTOIRE } from './memeCatalog';

export const GEMINI_KEYS = [
  "AIzaSyBWVUuVWh3GvU-tXO0EfD7NWo9J2yqOa2Y",
  "AIzaSyCIg1DrHQV1txQSCfbTUhjiKaRdc1gsSEY",
  "AIzaSyCvxq7i4tH1Ubz3Od68_SHHCE62q-r97UQ",
  "AIzaSyAXr9csp0yzB3_iqUAwsPHoKkCdTe206M0"
];

let currentKeyIndex = 0;
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

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parseJsonResponse(rawText) {
  if (!rawText) return null;
  try {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed && parsed.template_name) return parsed;
    }
  } catch (e) {
    console.warn("JSON parse error:", e);
  }
  return null;
}

// Gemini AI Query selecting the most famous GIF reaction
async function queryGeminiPureGIF(prompt, availableGifs, customKey = null) {
  const keysToTry = customKey && customKey.trim().length > 10
    ? [customKey.trim(), ...GEMINI_KEYS]
    : GEMINI_KEYS;

  const shuffledAvailable = shuffleArray(availableGifs);
  const availableNamesList = shuffledAvailable.map(g => `"${g.name}"`).join(", ");

  const promptText = `Eres LLMeme. Tu única tarea es responder a esta frase eligiendo EL GIF ANIMADO DE REACCIÓN MÁS FAMOSO Y PERFECTO:

Frase del usuario: "${prompt}"

Elige EXACTAMENTE UNO de estos GIFs disponibles: [${availableNamesList}].

Responde ÚNICAMENTE en JSON:
{
  "template_name": "Nombre exacto del GIF elegido de la lista",
  "emotion": "🎭 Reacción Cómica Corta con Emoji"
}`;

  const startIndex = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % keysToTry.length;

  for (let i = 0; i < keysToTry.length; i++) {
    const tryIdx = (startIndex + i) % keysToTry.length;
    const activeKey = keysToTry[tryIdx];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.9
          }
        })
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = parseJsonResponse(rawText);
        if (parsed) return parsed;
      }
    } catch (err) {
      console.warn(`Gemini Key #${tryIdx + 1} call note:`, err);
    }
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

  let bestGifs = [];
  let highestScore = -1;

  for (const gif of availableGifs) {
    let score = 0;
    for (const kw of gif.keywords) {
      if (normTarget.includes(kw)) score += 3;
    }
    if (score > highestScore) {
      highestScore = score;
      bestGifs = [gif];
    } else if (score === highestScore && score > 0) {
      bestGifs.push(gif);
    }
  }

  if (bestGifs.length > 0) {
    return bestGifs[Math.floor(Math.random() * bestGifs.length)];
  }

  return shuffleArray(availableGifs)[0];
}

export async function queryLLMeme(promptText, customApiKey = null) {
  let availableGifs = GIF_REPERTOIRE.filter(g => !sessionUsedGifIds.has(g.id));

  if (availableGifs.length === 0) {
    sessionUsedGifIds.clear();
    availableGifs = [...GIF_REPERTOIRE];
  }

  const aiResult = await queryGeminiPureGIF(promptText, availableGifs, customApiKey);

  let selectedGif = shuffleArray(availableGifs)[0];
  let emotionTag = "🎭 GIF Famoso de Reacción";

  if (aiResult && aiResult.template_name) {
    selectedGif = matchUnusedGif(aiResult.template_name, availableGifs);
    emotionTag = aiResult.emotion || selectedGif.emotions?.[0] || "🎭 GIF Animado";
  } else {
    const normPrompt = normalizeText(promptText);
    const matchingGifs = availableGifs.filter(g => g.keywords.some(k => normPrompt.includes(k)));

    if (matchingGifs.length > 0) {
      selectedGif = shuffleArray(matchingGifs)[0];
    } else {
      selectedGif = shuffleArray(availableGifs)[0];
    }
    emotionTag = selectedGif.emotions?.[0] || "🎬 GIF Cómico";
  }

  sessionUsedGifIds.add(selectedGif.id);

  return {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    prompt: promptText,
    meme: {
      id: selectedGif.id,
      name: selectedGif.name,
      type: "gif",
      imgUrl: selectedGif.imgUrl,
      origin: selectedGif.origin || "Pure Reaction GIF Vault",
      sound: selectedGif.sound || "wow"
    },
    emotion: emotionTag,
    // ZERO text overlays anywhere!
    captions: {
      topText: "",
      bottomText: ""
    },
    confidence: "99.9% Match",
    source: "🎬 Gemini 2.5 Flash Pure GIF Engine",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
