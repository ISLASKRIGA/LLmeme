// Curated Catalog of Top Animated GIFs & Hilarious Meme Templates with Specific Punchline Engines

export const MEME_CATALOG = [
  // --- ANIMATED REACTION GIFS (Top priority for hilarity) ---
  {
    id: "gif-pedro-pascal",
    name: "Pedro Pascal Laughing then Crying",
    type: "gif",
    emotions: ["tristeza", "bipolar", "risa_llanto", "drama", "ex"],
    keywords: ["ex", "mensaje", "3am", "bipolar", "llorar", "reir", "pedro pascal", "drama"],
    imgUrl: "https://media.giphy.com/media/d2W7eZX5z62ziqdi/giphy.gif",
    sound: "sadViolin",
    origin: "Pedro Pascal Laughing Crying GIF",
    punchline: (prompt) => ({
      topText: `03:00 AM: "${prompt}"`,
      bottomText: `Yo con la dignidad en la mano y la estabilidad emocional rota 😭`
    })
  },
  {
    id: "gif-steve-carell-no",
    name: "Michael Scott NO GOD PLEASE NO!",
    type: "gif",
    emotions: ["panico", "rechazo", "nooo", "desesperacion"],
    keywords: ["michael scott", "the office", "no god please no", "negativa", "error", "prod"],
    imgUrl: "https://media.giphy.com/media/8vUEXZA2tnq48/giphy.gif",
    sound: "emotionalDamage",
    origin: "The Office NO GOD PLEASE NO GIF",
    punchline: (prompt) => ({
      topText: `Cuando pasa esto: "${prompt}"`,
      bottomText: `¡NO DIOS POR FAVOR NOOOOO! 😱`
    })
  },
  {
    id: "gif-travolta",
    name: "Confused John Travolta",
    type: "gif",
    emotions: ["confusion", "perdidote", "donde", "que"],
    keywords: ["travolta", "confused", "pulp fiction", "donde esta", "que paso", "lost"],
    imgUrl: "https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif",
    sound: "wow",
    origin: "Pulp Fiction Confused GIF",
    punchline: (prompt) => ({
      topText: `Tratando de encontrarle sentido a: "${prompt}"`,
      bottomText: `Yo buscando en el limbo 🤷‍♂️`
    })
  },
  {
    id: "gif-cat-jam",
    name: "Cat Vibing / Cat Jam",
    type: "gif",
    emotions: ["victoria", "fiesta", "ritmo", "feliz"],
    keywords: ["cat jam", "cat vibing", "gato bailando", "musica", "ritmo", "feliz"],
    imgUrl: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
    sound: "victory",
    origin: "Cat Vibing GIF",
    punchline: (prompt) => ({
      topText: `Ignorando todos mis problemas y pensando en:`,
      bottomText: `"${prompt}" 😎🎶`
    })
  },
  {
    id: "gif-elmo-fire",
    name: "Elmo in Front of Fire (Hellmo)",
    type: "gif",
    emotions: ["caos", "panico", "fuego", "destruccion"],
    keywords: ["elmo", "fire", "hellmo", "caos", "fuego", "destruir"],
    imgUrl: "https://media.giphy.com/media/P7JmDW7IkB7TW/giphy.gif",
    sound: "emotionalDamage",
    origin: "Elmo Fire GIF",
    punchline: (prompt) => ({
      topText: `Todo ardiendo alrededor por culpa de:`,
      bottomText: `"${prompt}" 🔥😈`
    })
  },
  {
    id: "gif-homer-bush",
    name: "Homer Backing Into Bushes",
    type: "gif",
    emotions: ["evitacion", "verguenza", "desaparecer"],
    keywords: ["homer", "simpsons", "bush", "disappear", "desaparecer"],
    imgUrl: "https://media.giphy.com/media/COYGe9rZvfiaQ/giphy.gif",
    sound: "bruh",
    origin: "Homer Bush GIF",
    punchline: (prompt) => ({
      topText: `Cuando escucho la frase: "${prompt}"`,
      bottomText: `Lentamente me retiro del universo 🌳`
    })
  },
  {
    id: "gif-popcat",
    name: "Popcat Opening Mouth",
    type: "gif",
    emotions: ["absurdo", "sorpresa", "gato", "pop"],
    keywords: ["popcat", "pop cat", "gato pop"],
    imgUrl: "https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif",
    sound: "pop",
    origin: "Popcat GIF",
    punchline: (prompt) => ({
      topText: `Mi única reacción a: "${prompt}"`,
      bottomText: `*POP POP POP* 😮`
    })
  },
  {
    id: "gif-mind-blown",
    name: "Tim and Eric Mind Blown",
    type: "gif",
    emotions: ["iluminacion", "mind_blown", "shock"],
    keywords: ["mind blown", "tim and eric", "shock"],
    imgUrl: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
    sound: "wow",
    origin: "Mind Blown GIF",
    punchline: (prompt) => ({
      topText: `Mi cerebro cuando trato de procesar:`,
      bottomText: `"${prompt}" 🤯💥`
    })
  },
  {
    id: "gif-ron-swanson-computer",
    name: "Ron Swanson Throws Computer in Dumpster",
    type: "gif",
    emotions: ["enojo", "frustracion", "codigo_basura"],
    keywords: ["ron swanson", "computer dumpster", "tirar pc"],
    imgUrl: "https://media.giphy.com/media/133DKEhjvOJKy4/giphy.gif",
    sound: "emotionalDamage",
    origin: "Ron Swanson Computer GIF",
    punchline: (prompt) => ({
      topText: `Mi PC al recibir: "${prompt}"`,
      bottomText: `¡A LA BASURA TODO! 🗑️`
    })
  },
  {
    id: "gif-shaq-shimmy",
    name: "Shaq Shimmy Goldfish Laugh",
    type: "gif",
    emotions: ["sarcasmo", "sabrosura", "triunfo"],
    keywords: ["shaq", "shimmy", "burlarse"],
    imgUrl: "https://media.giphy.com/media/UO5elnTqo4vSg/giphy.gif",
    sound: "victory",
    origin: "Shaq Shimmy GIF",
    punchline: (prompt) => ({
      topText: `Yo listo para reirme de:`,
      bottomText: `"${prompt}" 😏✨`
    })
  },

  // --- STATIC MEMES ---
  {
    id: "188390779",
    name: "Woman Yelling At Cat",
    type: "image",
    emotions: ["pelea", "acusacion", "confusion", "drama"],
    keywords: ["woman yelling", "cat", "smudge", "dinner table"],
    imgUrl: "https://i.imgflip.com/345v05.jpg",
    sound: "emotionalDamage",
    origin: "Woman Yelling at Cat",
    punchline: (prompt) => ({
      topText: `¡EXIJO QUE ME EXPLIQUES: "${prompt.toUpperCase()}"!`,
      bottomText: `El gato pensando en la cena 🐱`
    })
  },
  {
    id: "181913649",
    name: "Drake Hotline Bling",
    type: "image",
    emotions: ["preferencia", "desecho", "decision"],
    keywords: ["drake", "no", "yes"],
    imgUrl: "https://i.imgflip.com/30b1gx.jpg",
    sound: "wow",
    origin: "Drake Hotline Bling",
    punchline: (prompt) => ({
      topText: `Tomar una decisión madura sobre: "${prompt}"`,
      bottomText: `Hacer exactamente lo contrario y sufrir las consecuencias`
    })
  },
  {
    id: "87743020",
    name: "Two Buttons (El Dilema)",
    type: "image",
    emotions: ["dilema", "panico", "decision"],
    keywords: ["buttons", "choice", "dilemma"],
    imgUrl: "https://i.imgflip.com/1g8my4.jpg",
    sound: "bruh",
    origin: "Two Buttons Webcomic",
    punchline: (prompt) => ({
      topText: `Afrontar "${prompt}"`,
      bottomText: `Ignorarlo y ver memes hasta las 4 AM`
    })
  },
  {
    id: "93895088",
    name: "Expanding Brain (Galaxy Brain)",
    type: "image",
    emotions: ["iluminacion", "genio", "progreso"],
    keywords: ["brain", "galaxy brain"],
    imgUrl: "https://i.imgflip.com/1jwhww.jpg",
    sound: "victory",
    origin: "Expanding Brain",
    punchline: (prompt) => ({
      topText: `1. Ignorar | 2. Buscar en Google | 3. Entender "${prompt}" como un dios`,
      bottomText: ""
    })
  },
  {
    id: "55311130",
    name: "This Is Fine Dog",
    type: "image",
    emotions: ["panico", "caos", "resignacion"],
    keywords: ["fine", "dog", "fire"],
    imgUrl: "https://i.imgflip.com/26am.jpg",
    sound: "sadViolin",
    origin: "This is Fine Dog",
    punchline: (prompt) => ({
      topText: `Tratando de lidiar con: ${prompt}`,
      bottomText: "This is fine. Todo bajo control."
    })
  }
];
