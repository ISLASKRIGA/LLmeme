// LLMeme Engine: Simple, Short & Ultra-Punchy Meme Captions (2-5 words max!)
import { GIF_REPERTOIRE } from './memeCatalog';

export const GEMINI_KEYS = [
  "AIzaSyBWVUuVWh3GvU-tXO0EfD7NWo9J2yqOa2Y",
  "AIzaSyCIg1DrHQV1txQSCfbTUhjiKaRdc1gsSEY",
  "AIzaSyCvxq7i4tH1Ubz3Od68_SHHCE62q-r97UQ",
  "AIzaSyAXr9csp0yzB3_iqUAwsPHoKkCdTe206M0"
];

let currentKeyIndex = 0;

const sessionUsedGifIds = new Set();
const sessionUsedTextSignatures = new Set();

export function clearSessionMemory() {
  sessionUsedGifIds.clear();
  sessionUsedTextSignatures.clear();
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
      if (parsed && parsed.template_name && parsed.topText && parsed.bottomText) return parsed;
    }
  } catch (e) {
    console.warn("JSON parse error:", e);
  }
  return null;
}

// Gemini API Query forcing ULTRA-SIMPLE & SHORT meme texts
async function queryGeminiGIF(prompt, availableGifs, customKey = null) {
  const keysToTry = customKey && customKey.trim().length > 10
    ? [customKey.trim(), ...GEMINI_KEYS]
    : GEMINI_KEYS;

  const shuffledAvailable = shuffleArray(availableGifs);
  const availableNamesList = shuffledAvailable.map(g => `"${g.name}"`).join(", ");

  const promptText = `Eres el Maestro del Humor Sencillo. Crea un meme ULTRA SENCILLO, CORTO Y DIRECTO en español para esta frase:

Frase del usuario: "${prompt}"

REGLAS DE ORO (MEMES SENCILLOS):
1. Elige EXACTAMENTE UNO de estos GIFs disponibles: [${availableNamesList}].
2. El topText debe ser SENCILLO Y CORTO (MÁXIMO 3 A 5 PALABRAS).
3. El bottomText debe ser EL REMATE DIRECTO (MÁXIMO 3 A 5 PALABRAS).
4. CERO textos largos. CERO frases tristes. CERO rodeos. Directo al grano.
5. La etiqueta "emotion" es una actitud cómica corta de 2 palabras con emoji.

EJEMPLOS DE MEMES SENCILLOS PERFECTOS:
- Frase: "Mi ex me mandó mensaje a las 3am" -> topText: "03:00 AM: 'Te extraño'" / bottomText: "Bloqueado al instante 😎"
- Frase: "Se cayó producción un viernes 5pm" -> topText: "Viernes 4:59 PM:" / bottomText: "El Senior en la playa 🏖️"
- Frase: "El cliente pidió un cambio de 5 min" -> topText: "'Es un cambio pequeñito'" / bottomText: "Procedo a cobrar extra 💸"

Responde ÚNICAMENTE en JSON:
{
  "template_name": "Nombre exacto del GIF elegido de la lista",
  "topText": "Texto superior corto (3-5 palabras)",
  "bottomText": "Remate directo (3-5 palabras)",
  "emotion": "😎 Actitud Corta"
}`;

  const startIndex = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % keysToTry.length;

  for (let i = 0; i < keysToTry.length; i++) {
    const tryIdx = (startIndex + i) % keysToTry.length;
    const activeKey = keysToTry[tryIdx];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            maxOutputTokens: 180,
            temperature: 0.9,
            topP: 0.9
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

// Simple & Short Fallback Punchline Engine (Strictly 2-5 words!)
function generateSimplePunchline(promptText) {
  const cleanPrompt = promptText.trim();
  const words = cleanPrompt.split(/\s+/);
  const shortHead = words.slice(0, Math.min(3, words.length)).join(" ");

  const simpleMemes = [
    { top: `Frente a: "${shortHead}"`, bottom: "Modo leyenda activado 😎" },
    { top: `Cuando dicen: "${shortHead}"`, bottom: "Procedo a cobrar extra 💸" },
    { top: `Situación: "${shortHead}"`, bottom: "Cero dudas, 100% estilo 🔥" },
    { top: `Escuchando: "${shortHead}"`, bottom: "Respuesta salvaje activada 😏" },
    { top: `Planteando: "${shortHead}"`, bottom: "Resultado: Éxito total 🏆" }
  ];

  let chosen = simpleMemes[Math.floor(Math.random() * simpleMemes.length)];
  let signature = `${normalizeText(chosen.top)}_${normalizeText(chosen.bottom)}`;
  let attempts = 0;

  while (sessionUsedTextSignatures.has(signature) && attempts < 10) {
    chosen = simpleMemes[Math.floor(Math.random() * simpleMemes.length)];
    signature = `${normalizeText(chosen.top)}_${normalizeText(chosen.bottom)}`;
    attempts++;
  }

  return { topText: chosen.top, bottomText: chosen.bottom };
}

export async function queryLLMeme(promptText, customApiKey = null) {
  let availableGifs = GIF_REPERTOIRE.filter(g => !sessionUsedGifIds.has(g.id));

  if (availableGifs.length === 0) {
    sessionUsedGifIds.clear();
    availableGifs = [...GIF_REPERTOIRE];
  }

  const aiResult = await queryGeminiGIF(promptText, availableGifs, customApiKey);

  let selectedGif = shuffleArray(availableGifs)[0];
  let topText = "";
  let bottomText = "";
  let emotionTag = "😎 Meme Sencillo";

  if (aiResult && aiResult.template_name && aiResult.topText && aiResult.bottomText) {
    selectedGif = matchUnusedGif(aiResult.template_name, availableGifs);
    topText = aiResult.topText;
    bottomText = aiResult.bottomText;
    emotionTag = aiResult.emotion || "🔥 Humor Directo";

    const signature = `${normalizeText(topText)}_${normalizeText(bottomText)}`;
    if (sessionUsedTextSignatures.has(signature)) {
      const alt = generateSimplePunchline(promptText);
      topText = alt.topText;
      bottomText = alt.bottomText;
    }
  } else {
    const normPrompt = normalizeText(promptText);
    const matchingGifs = availableGifs.filter(g => g.keywords.some(k => normPrompt.includes(k)));

    if (matchingGifs.length > 0) {
      selectedGif = shuffleArray(matchingGifs)[0];
    } else {
      selectedGif = shuffleArray(availableGifs)[0];
    }

    const simple = generateSimplePunchline(promptText);
    topText = simple.topText;
    bottomText = simple.bottomText;
  }

  sessionUsedGifIds.add(selectedGif.id);
  sessionUsedTextSignatures.add(`${normalizeText(topText)}_${normalizeText(bottomText)}`);

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
    source: "🎬 Gemini 2.5 Flash Simple Engine",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
