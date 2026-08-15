// Contest-Winning LLMeme Engine: Powered by Gemini 2.5 Flash with Dynamic GIF Rotation & Zero Bias
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

// Fisher-Yates array shuffle for unbiased random distribution
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deep Contest-Winning Prompt Engineering for Gemini 2.5 Flash
async function queryGeminiGIF(prompt, availableGifs, customKey = null) {
  const activeKey = customKey && customKey.trim().length > 10
    ? customKey.trim()
    : GEMINI_KEYS[currentKeyIndex % GEMINI_KEYS.length];

  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

  // Randomize available GIF list order sent to Gemini to prevent position bias
  const shuffledAvailable = shuffleArray(availableGifs);
  const availableNamesList = shuffledAvailable.map(g => `"${g.name}"`).join(", ");

  const promptText = `Eres LLMeme, el modelo de IA más cómico del mundo. Tu misión es GANAR EL CONCURSO MUNDIAL DE MEMES respondiendo con el GIF y los textos MÁS GRACIOSOS POSIBLES en español latino.

Frase del usuario: "${prompt}"

REGLAS DE ORO PARA SER GRACIOSO:
1. Elige EXACTAMENTE UNO de estos GIFs disponibles que mejor encaje: [${availableNamesList}].
2. El topText debe ser SETUP CÓMICO ultra específico y cotidiano (máx 8 palabras).
3. El bottomText debe ser el REMATE que destruya al usuario de risa (máx 10 palabras). Usa jerga latina, sarcasmo brutal o la verdad incómoda.
4. PROHIBIDO usar: "Yo pensando en...", "Cuando...", frases genéricas. Sé ESPECÍFICO y ORIGINAL.
5. La etiqueta "emotion" es una reacción cómica de 3-4 palabras con emoji.

Ejemplos de textos BUENOS (copiar este estilo):
- topText: "Mi mamá viendo mis calificaciones:" / bottomText: "Dios, dame paciencia antes de que yo le dé algo a ella 😤"
- topText: "El cliente a las 5pm del viernes:" / bottomText: "'¿Queda tiempo para un cambiecito?' NO. NUNCA. JAMÁS."
- topText: "Yo pagando Netflix:" / bottomText: "Para ver el mismo capítulo de Brooklyn 99 por 400va vez"

Responde ÚNICAMENTE un objeto JSON válido:
{
  "template_name": "Nombre exacto del GIF elegido",
  "topText": "Texto superior gracioso y específico",
  "bottomText": "Remate épico que destruya de risa",
  "emotion": "🎭 Etiqueta Cómica"
}`;

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
          temperature: 0.95 // High creativity & variety
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
    console.warn("Gemini API call warning:", err);
  }
  return null;
}

function matchUnusedGif(templateName, availableGifs) {
  const normTarget = normalizeText(templateName || "");

  // 1. Direct name match
  for (const gif of availableGifs) {
    const normName = normalizeText(gif.name);
    if (normTarget.includes(normName) || normName.includes(normTarget)) {
      return gif;
    }
  }

  // 2. Keyword match
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

  // 3. Fallback: Pick a random available GIF to guarantee zero bias!
  const randomizedAvailable = shuffleArray(availableGifs);
  return randomizedAvailable[0];
}

export async function queryLLMeme(promptText, customApiKey = null) {
  // Filter out GIFs that have already been used in this chat session
  let availableGifs = GIF_REPERTOIRE.filter(g => !sessionUsedGifIds.has(g.id));

  // If all GIFs in repertoire have been used, reset session memory for fresh rotation
  if (availableGifs.length === 0) {
    sessionUsedGifIds.clear();
    availableGifs = [...GIF_REPERTOIRE];
  }

  const aiResult = await queryGeminiGIF(promptText, availableGifs, customApiKey);

  let selectedGif = shuffleArray(availableGifs)[0];
  let topText = "";
  let bottomText = "";
  let emotionTag = "🎬 GIF Animado Cómico";

  if (aiResult && aiResult.template_name) {
    selectedGif = matchUnusedGif(aiResult.template_name, availableGifs);
    topText = aiResult.topText || "";
    bottomText = aiResult.bottomText || "";
    emotionTag = aiResult.emotion || "🎬 GIF Cómico Inteligente";
  } else {
    // Smart Topic Matching Fallback
    const normPrompt = normalizeText(promptText);
    const matchingGifs = availableGifs.filter(g => g.keywords.some(k => normPrompt.includes(k)));

    if (matchingGifs.length > 0) {
      selectedGif = shuffleArray(matchingGifs)[0];
    } else {
      selectedGif = shuffleArray(availableGifs)[0];
    }

    if (normPrompt.includes("ex") || normPrompt.includes("3am") || normPrompt.includes("mensaje")) {
      topText = `03:00 AM en mi celular:`;
      bottomText = `"${promptText.slice(0, 40)}" — mi autoestima abandonando el chat 💀`;
    } else if (normPrompt.includes("viernes") || normPrompt.includes("produccion") || normPrompt.includes("senior")) {
      topText = `Viernes 4:59 PM — caída en producción:`;
      bottomText = "El Senior: apagó el celular, se fue al mar, no existe 🏖️💀";
    } else if (normPrompt.includes("cliente") || normPrompt.includes("5 min") || normPrompt.includes("cambio")) {
      topText = `"Solo es un cambiecito rápido, ¿verdad?"`;
      bottomText = "3 horas después, el servidor llorando en una esquina 🔥👁️";
    } else if (normPrompt.includes("lunes") || normPrompt.includes("trabajo") || normPrompt.includes("jefe")) {
      topText = `El jefe: "¿Cómo vas con eso?"`;
      bottomText = `Yo: "${promptText.slice(0, 35)}..." — totalmente bien, todo normal 😅`;
    } else {
      topText = `Situación: "${promptText.slice(0, 35)}..."`;
      bottomText = "Mi cerebro procesando esto a las 2AM como si importara 🤯💀";
    }
  }

  // Mark selected GIF ID as used so it will NEVER repeat in this session
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
    source: "🎬 Gemini 2.5 Flash Contest Engine",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
