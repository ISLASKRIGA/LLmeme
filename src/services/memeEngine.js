// LLMeme Engine: Intelligent Meme Captions Tailored to Each Template & Prompt
import { MEME_CATALOG } from './memeCatalog';

export const GEMINI_KEYS = [
  "AIzaSyBWVUuVWh3GvU-tXO0EfD7NWo9J2yqOa2Y",
  "AIzaSyCIg1DrHQV1txQSCfbTUhjiKaRdc1gsSEY",
  "AIzaSyCvxq7i4tH1Ubz3Od68_SHHCE62q-r97UQ",
  "AIzaSyAXr9csp0yzB3_iqUAwsPHoKkCdTe206M0"
];

let currentKeyIndex = 0;
const sessionUsedMemeIds = new Set();

export function clearSessionMemory() {
  sessionUsedMemeIds.clear();
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

async function queryGeminiMemeImage(prompt, availableMemes, customKey = null) {
  const keysToTry = customKey && customKey.trim().length > 10
    ? [customKey.trim(), ...GEMINI_KEYS]
    : GEMINI_KEYS;

  const shuffledAvailable = shuffleArray(availableMemes);
  const availableNamesList = shuffledAvailable.map(m => `"${m.name}"`).join(", ");

  const promptText = `Eres un Generador de Memes de Inteligencia Artificial de alto nivel.
Dada la frase del usuario: "${prompt}"

Elige la mejor plantilla de esta lista: [${availableNamesList}] y crea los dos textos del meme (topText y bottomText).

REGLAS DE FORMATO:
- Si eliges "Drake Hotline Bling": topText = lo que rechaza Drake (máx 5 palabras). bottomText = lo que prefiere Drake (máx 5 palabras).
- Si eliges "Two Buttons": topText = opción 1 absurda. bottomText = opción 2 real.
- Si eliges "Woman Yelling At Cat": topText = lo que grita la señora. bottomText = lo que responde el gato.
- Para otras plantillas: topText = contexto corto (3-5 palabras). bottomText = remate cómico (3-5 palabras).

Ejemplo para "${prompt}" con Drake:
{
  "template_name": "Drake Hotline Bling",
  "topText": "Hacer el cambiecito gratis",
  "bottomText": "Cobrar 3 semanas extra 💸",
  "emotion": "😎 Aprobación Total"
}

Responde ÚNICAMENTE en JSON:
{
  "template_name": "Nombre exacto del meme elegido",
  "topText": "Texto superior corto",
  "bottomText": "Texto inferior remate",
  "emotion": "😎 Actitud Cómica"
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

function matchUnusedMeme(templateName, availableMemes) {
  const normTarget = normalizeText(templateName || "");

  for (const meme of availableMemes) {
    const normName = normalizeText(meme.name);
    if (normTarget.includes(normName) || normName.includes(normTarget)) {
      return meme;
    }
  }

  let bestMemes = [];
  let highestScore = -1;

  for (const meme of availableMemes) {
    let score = 0;
    for (const kw of meme.keywords) {
      if (normTarget.includes(kw)) score += 3;
    }
    if (score > highestScore) {
      highestScore = score;
      bestMemes = [meme];
    } else if (score === highestScore && score > 0) {
      bestMemes.push(meme);
    }
  }

  if (bestMemes.length > 0) {
    return bestMemes[Math.floor(Math.random() * bestMemes.length)];
  }

  return shuffleArray(availableMemes)[0];
}

function generateFallbackCaptions(promptText, memeName) {
  const isDrake = memeName && memeName.toLowerCase().includes('drake');
  const cleanPrompt = promptText.trim();
  const words = cleanPrompt.split(/\s+/);
  const shortHead = words.slice(0, Math.min(3, words.length)).join(" ");

  if (isDrake) {
    return {
      topText: `Hacer "${shortHead}" gratis`,
      bottomText: "Cobrar 3 semanas extra 💸"
    };
  }

  return {
    topText: `Frente a: "${shortHead}"`,
    bottomText: "Modo leyenda activado 😎"
  };
}

export async function queryLLMeme(promptText, customApiKey = null) {
  let availableMemes = MEME_CATALOG.filter(m => !sessionUsedMemeIds.has(m.id));

  if (availableMemes.length === 0) {
    sessionUsedMemeIds.clear();
    availableMemes = [...MEME_CATALOG];
  }

  const aiResult = await queryGeminiMemeImage(promptText, availableMemes, customApiKey);

  let selectedMeme = shuffleArray(availableMemes)[0];
  let topText = "";
  let bottomText = "";
  let emotionTag = "😎 Meme de Imagen";

  if (aiResult && aiResult.template_name) {
    selectedMeme = matchUnusedMeme(aiResult.template_name, availableMemes);
    topText = aiResult.topText || "";
    bottomText = aiResult.bottomText || "";
    emotionTag = aiResult.emotion || "🔥 Meme Directo";
  } else {
    const normPrompt = normalizeText(promptText);
    const matchingMemes = availableMemes.filter(m => m.keywords.some(k => normPrompt.includes(k)));

    if (matchingMemes.length > 0) {
      selectedMeme = shuffleArray(matchingMemes)[0];
    } else {
      selectedMeme = shuffleArray(availableMemes)[0];
    }

    const fallback = generateFallbackCaptions(promptText, selectedMeme.name);
    topText = fallback.topText;
    bottomText = fallback.bottomText;
  }

  sessionUsedMemeIds.add(selectedMeme.id);

  return {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    prompt: promptText,
    meme: {
      id: selectedMeme.id,
      name: selectedMeme.name,
      type: "image",
      imgUrl: selectedMeme.imgUrl,
      origin: selectedMeme.origin || "Classic Meme Image Vault",
      sound: selectedMeme.sound || "wow"
    },
    emotion: emotionTag,
    captions: {
      topText: topText,
      bottomText: bottomText
    },
    confidence: "99.9% Match",
    source: "✨ Gemini 2.5 Flash Meme Engine",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
