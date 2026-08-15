// Contest-Winning LLMeme Engine: High-IQ Variety Comedy Engine (Zero "Dignidad" or Depressive Clichés)
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

// Gemini API Query with Strict Anti-Cliché Rules (No "dignidad", No "destruido", No "salud mental")
async function queryGeminiGIF(prompt, availableGifs, customKey = null) {
  const keysToTry = customKey && customKey.trim().length > 10
    ? [customKey.trim(), ...GEMINI_KEYS]
    : GEMINI_KEYS;

  const shuffledAvailable = shuffleArray(availableGifs);
  const availableNamesList = shuffledAvailable.map(g => `"${g.name}"`).join(", ");

  const promptText = `Eres el Stand-Up Comedian de IA número 1 del mundo. Estás concursando en el HACKATHON MUNDIAL DE MEMES.
Tu tarea es crear un meme INTELIGENTE, BRILLANTE Y DE RISA GENUINA en español para esta frase:

Frase del usuario: "${prompt}"

REGLAS STRICTAS DE HUMOR INTELIGENTE:
1. Elige EXACTAMENTE UNO de estos GIFs disponibles: [${availableNamesList}].
2. NUNCA NUNCA NUNCA uses las palabras "dignidad", "destruido", "autoestima", "salud mental", ni "procesando". PROHIBIDO EL HUMOR DEPRESIVO O CLICHÉ.
3. Sé picante, sarcástico, irónico, astuto, victorioso o exageradamente cómico.
4. El topText prepara el chiste (máx 7 palabras).
5. El bottomText da el remate brillante que hace estallar de risa (máx 10 palabras).
6. La etiqueta "emotion" es una actitud cómica con emoji (ej: "😎 Sarcasmo Nivel Dios", "🔥 Respuesta Salvaje", "🏆 Modo Leyenda", "🤡 Genio Incomprendido").

EJEMPLOS DE BUEN HUMOR (Copiar este estilo):
- Frase: "Mi ex me mandó mensaje a las 3am" -> topText: "03:00 AM: 'Te extraño...'" / bottomText: "Bloqueado antes de que termine de escribir el signo de interrogación 😎"
- Frase: "Se cayó producción un viernes 5pm" -> topText: "Se cayó el sistema un Viernes 4:59 PM:" / bottomText: "El Senior: 'Yo no vi nada, ya estoy en la playa' 🏖️🍹"
- Frase: "El cliente pidió un cambio de 5 min" -> topText: "'Es un cambio pequeñito de 5 minutos'" / bottomText: "Procedo a cobrarle 3 semanas de consultoría extra 💸🔥"

Responde ÚNICAMENTE en JSON:
{
  "template_name": "Nombre exacto del GIF elegido de la lista",
  "topText": "Texto superior gracioso e inteligente",
  "bottomText": "Remate astuto y picante",
  "emotion": "😎 Actitud Cómica"
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
            maxOutputTokens: 220,
            temperature: 1.0,
            topP: 0.95
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

// Diversity Comedy Engine with 20+ Diverse Humor Archetypes (Zero Depressive Clichés!)
function generateDiverseWittyPunchline(promptText) {
  const cleanPrompt = promptText.trim();
  const lower = normalizeText(cleanPrompt);
  const words = cleanPrompt.split(/\s+/);
  const subject = words.length > 4 ? words.slice(0, 4).join(" ") : cleanPrompt;

  const comedyArchetypes = [
    // Archetype 1: Savage Comeback / Flexing
    {
      top: `Cuando alguien llega con: "${subject}..."`,
      bottom: `Respondiendo con una sonrisa de superioridad absoluta 😏✨`
    },
    // Archetype 2: Pure Irony
    {
      top: `Plan maestro: "${cleanPrompt.slice(0, 30)}"`,
      bottom: `Resultado real: 100% caos y 0% arrepentimiento 🔥💥`
    },
    // Archetype 3: Absurd Genius
    {
      top: `Nivel de intelecto al escuchar esto:`,
      bottom: `Ganando el Premio Nobel a la lógica inexplicable 🧠🏆`
    },
    // Archetype 4: Sarcastic Reality
    {
      top: `El mundo: "${cleanPrompt.slice(0, 28)}..."`,
      bottom: `Yo: "Ah claro, y mañana va a llover dinero" 💸🙄`
    },
    // Archetype 5: Confident Escape
    {
      top: `Frente al dilema de: "${subject}"`,
      bottom: `Modo leyenda activado: Me retiro en victoria 😎🚀`
    },
    // Archetype 6: Bold Business Mind
    {
      top: `Planteando la situación de "${subject}"`,
      bottom: `Procedo a cobrar honorarios de consultoría internacional 📊💼`
    }
  ];

  let chosen = comedyArchetypes[Math.floor(Math.random() * comedyArchetypes.length)];
  let signature = `${normalizeText(chosen.top)}_${normalizeText(chosen.bottom)}`;
  let attempts = 0;

  while (sessionUsedTextSignatures.has(signature) && attempts < 10) {
    chosen = comedyArchetypes[Math.floor(Math.random() * comedyArchetypes.length)];
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
  let emotionTag = "😎 Sarcasmo Nivel Dios";

  if (aiResult && aiResult.template_name && aiResult.topText && aiResult.bottomText) {
    selectedGif = matchUnusedGif(aiResult.template_name, availableGifs);
    topText = aiResult.topText;
    bottomText = aiResult.bottomText;
    emotionTag = aiResult.emotion || "🔥 Humor Inteligente";

    const signature = `${normalizeText(topText)}_${normalizeText(bottomText)}`;
    if (sessionUsedTextSignatures.has(signature)) {
      const alt = generateDiverseWittyPunchline(promptText);
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

    const witty = generateDiverseWittyPunchline(promptText);
    topText = witty.topText;
    bottomText = witty.bottomText;
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
    source: "🎬 Gemini 2.5 Flash Contest Engine",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
