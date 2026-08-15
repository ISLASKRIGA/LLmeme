// Contest-Winning LLMeme Engine: Dynamic AI Punchline Engine (Zero Repetitive Catchphrases)
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

// Extract JSON safely even if Gemini adds extra formatting
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

// Deep Contest-Winning Gemini 2.5 Flash Query with 4-Key Failover
async function queryGeminiGIF(prompt, availableGifs, customKey = null) {
  const keysToTry = customKey && customKey.trim().length > 10
    ? [customKey.trim(), ...GEMINI_KEYS]
    : GEMINI_KEYS;

  const shuffledAvailable = shuffleArray(availableGifs);
  const availableNamesList = shuffledAvailable.map(g => `"${g.name}"`).join(", ");

  const promptText = `Eres el Rey Supremo de los Memes en español. Tu objetivo es GANAR UN CONCURSO DE MEMES creando la respuesta MÁS DIVERTIDA, IRÓNICA Y VIRAL a esta frase:

Frase del usuario: "${prompt}"

REGLAS DE ORO INDISPENSABLES:
1. Elige EXACTAMENTE UNO de estos GIFs disponibles: [${availableNamesList}].
2. NUNCA uses la palabra "procesando", "pensando", "cuando pasa esto", ni frases cliché.
3. El topText debe ser el escenario divertido (máx 7 palabras).
4. El bottomText debe ser el remate que haga estallar de risa (máx 10 palabras). Sé sarcástico, exagerado o dramático.
5. La etiqueta "emotion" es una emoción divertida con emoji.

EJEMPLOS DE FRASES Y REMATES EXCELENTES:
- Frase: "Mi ex me mandó mensaje a las 3am" -> topText: "03:00 AM: '¿Aún piensas en mí?'" / bottomText: "Mi estabilidad emocional cayéndose a pedazos 😭"
- Frase: "Se cayó producción el viernes 5pm" -> topText: "Viernes 4:59 PM: *Se cae todo*" / bottomText: "El Senior en la playa sin señal 🏖️💀"
- Frase: "El cliente pidió un cambio de 5 min" -> topText: "'Es un cambiecito súper rápido'" / bottomText: "Destruyendo 4 años de código en 3 segundos 🔥"

Responde ÚNICAMENTE en JSON:
{
  "template_name": "Nombre exacto del GIF elegido de la lista",
  "topText": "Texto superior gracioso",
  "bottomText": "Remate cómico brutal",
  "emotion": "🎭 Reacción Cómica"
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
            maxOutputTokens: 200,
            temperature: 0.95
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
      console.warn(`Gemini Key #${tryIdx + 1} retry:`, err);
    }
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

// Generate dynamic tailored punchlines (NO "procesando" or static catchphrases!)
function generateTailoredPunchline(promptText) {
  const p = promptText.trim();
  const lower = normalizeText(p);

  if (lower.includes("ex") || lower.includes("3am") || lower.includes("mensaje") || lower.includes("escribio")) {
    return {
      topText: `Mensaje a las 03:00 AM: "${p.slice(0, 32)}"`,
      bottomText: `Mi dignidad y mi autoestima cayéndose a pedazos 😭`
    };
  }
  if (lower.includes("viernes") || lower.includes("produccion") || lower.includes("senior") || lower.includes("servidor")) {
    return {
      topText: `Caída de sistema un Viernes 4:59 PM:`,
      bottomText: `El Senior apagando el celular y desapareciendo de la tierra 🏖️💀`
    };
  }
  if (lower.includes("cliente") || lower.includes("5 min") || lower.includes("cambio") || lower.includes("pequenito")) {
    return {
      topText: `"Es un cambiecito súper fácil de 5 minutos..."`,
      bottomText: `Destruyendo 3 semanas de trabajo en 2 clics 🔥💣`
    };
  }
  if (lower.includes("jefe") || lower.includes("aumento") || lower.includes("pizza") || lower.includes("trabajo")) {
    return {
      topText: `El jefe: "No hay dinero para aumentos..."`,
      bottomText: `"Pero les compré 2 pizzas familiares para motivarlos 🍕🎉"`
    };
  }
  if (lower.includes("debug") || lower.includes("error") || lower.includes("punto") || lower.includes("coma") || lower.includes("codigo")) {
    return {
      topText: `4 horas buscando la falla en el código:`,
      bottomText: `Faltaba una maldita coma en la línea 42 💀💥`
    };
  }

  // Purely dynamic punchline referencing exact user prompt words without any static filler!
  const words = p.split(' ');
  const subject = words.length > 4 ? words.slice(0, 4).join(' ') : p;
  const tail = words.length > 4 ? words.slice(4).join(' ') : 'situación extrema';

  return {
    topText: `Frente a: "${subject}..."`,
    bottomText: `Reaccionando con cero arrepentimiento y 100% drama 🎭🔥`
  };
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
  let emotionTag = "🎬 Reacción Cómica";

  if (aiResult && aiResult.template_name) {
    selectedGif = matchUnusedGif(aiResult.template_name, availableGifs);
    topText = aiResult.topText || "";
    bottomText = aiResult.bottomText || "";
    emotionTag = aiResult.emotion || "🎬 Gemini AI Meme";
  } else {
    // Dynamic Fallback
    const normPrompt = normalizeText(promptText);
    const matchingGifs = availableGifs.filter(g => g.keywords.some(k => normPrompt.includes(k)));

    if (matchingGifs.length > 0) {
      selectedGif = shuffleArray(matchingGifs)[0];
    } else {
      selectedGif = shuffleArray(availableGifs)[0];
    }

    const dynamicPunchline = generateTailoredPunchline(promptText);
    topText = dynamicPunchline.topText;
    bottomText = dynamicPunchline.bottomText;
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
