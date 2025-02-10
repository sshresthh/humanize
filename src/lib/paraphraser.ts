import { HumanizerType } from "@/components/text-humanizer/humanizer-types";

const academicPhrases = {
  "I think": [
    "it can be argued that",
    "research suggests",
    "evidence indicates",
  ],
  "I believe": [
    "evidence suggests",
    "studies demonstrate",
    "findings indicate",
  ],
  shows: ["demonstrates", "illustrates", "elucidates"],
  but: ["however", "nevertheless", "conversely"],
  uses: ["utilizes", "employs", "implements"],
  many: ["numerous", "multiple", "various"],
  big: ["substantial", "significant", "considerable"],
  important: ["significant", "crucial", "essential"],
  "looks at": ["examines", "investigates", "analyzes"],
  "talks about": ["discusses", "addresses", "explores"],
  good: ["favorable", "advantageous", "beneficial"],
  bad: ["unfavorable", "detrimental", "adverse"],
  problem: ["challenge", "obstacle", "impediment"],
  idea: ["concept", "proposition", "hypothesis"],
  change: ["transformation", "modification", "alteration"],
};

const casualPhrases = {
  therefore: ["so", "that's why", "because of that"],
  however: ["but", "though", "still"],
  additionally: ["also", "plus", "on top of that"],
  demonstrate: ["show", "prove", "point out"],
  obtain: ["get", "grab", "pick up"],
  purchase: ["buy", "get", "pick up"],
  require: ["need", "want", "gotta have"],
  utilize: ["use", "work with", "try"],
  commence: ["start", "begin", "kick off"],
  terminate: ["end", "stop", "finish"],
  approximately: ["about", "around", "roughly"],
  sufficient: ["enough", "plenty", "lots"],
  assist: ["help", "give a hand", "pitch in"],
  attempt: ["try", "give it a shot", "take a crack at"],
  communicate: ["talk", "chat", "get in touch"],
};

const professionalPhrases = {
  get: ["obtain", "acquire", "procure"],
  use: ["utilize", "employ", "implement"],
  start: ["initiate", "commence", "begin"],
  end: ["conclude", "finalize", "complete"],
  but: ["however", "nevertheless", "nonetheless"],
  show: ["demonstrate", "illustrate", "indicate"],
  help: ["assist", "facilitate", "support"],
  make: ["create", "develop", "establish"],
  look: ["examine", "analyze", "assess"],
  talk: ["discuss", "communicate", "confer"],
  problem: ["challenge", "issue", "matter"],
  good: ["satisfactory", "favorable", "positive"],
  quick: ["expeditious", "prompt", "timely"],
  team: ["group", "unit", "department"],
  plan: ["strategy", "approach", "methodology"],
};

const creativePhrases = {
  walk: ["stroll", "saunter", "meander"],
  said: ["exclaimed", "declared", "proclaimed"],
  happy: ["overjoyed", "elated", "ecstatic"],
  sad: ["heartbroken", "melancholic", "despondent"],
  angry: ["furious", "enraged", "livid"],
  big: ["enormous", "colossal", "gigantic"],
  small: ["tiny", "minuscule", "diminutive"],
  good: ["magnificent", "splendid", "marvelous"],
  bad: ["dreadful", "atrocious", "abysmal"],
  look: ["gaze", "peer", "observe"],
  beautiful: ["stunning", "breathtaking", "mesmerizing"],
  scary: ["terrifying", "haunting", "chilling"],
  run: ["dash", "sprint", "bolt"],
  laugh: ["chuckle", "giggle", "chortle"],
  think: ["ponder", "contemplate", "muse"],
};

const sentenceStarters = {
  academic: [
    "Furthermore,",
    "Moreover,",
    "In addition,",
    "Consequently,",
    "Therefore,",
    "Thus,",
    "Subsequently,",
    "As a result,",
  ],
  casual: [
    "Plus,",
    "Also,",
    "So,",
    "Anyway,",
    "Well,",
    "You know,",
    "Like,",
    "By the way,",
  ],
  professional: [
    "Additionally,",
    "Furthermore,",
    "Moreover,",
    "Subsequently,",
    "In light of this,",
    "With respect to,",
    "Considering this,",
    "As noted,",
  ],
  creative: [
    "Suddenly,",
    "Mysteriously,",
    "Without warning,",
    "In a flash,",
    "Like magic,",
    "To everyone's surprise,",
    "As fate would have it,",
    "In that moment,",
  ],
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function shuffleSentences(sentences: string[]): string[] {
  // Keep first and last sentences in place for context
  if (sentences.length <= 2) return sentences;

  const first = sentences[0];
  const last = sentences[sentences.length - 1];
  const middle = sentences.slice(1, -1);

  const shuffled = [...middle].sort(() => Math.random() - 0.5);
  return [first, ...shuffled, last];
}

function addRandomWhitespace(text: string): string {
  return text
    .split(" ")
    .map((word) => {
      if (Math.random() > 0.9) {
        return `${word}${String.fromCharCode(8203)}`; // Add zero-width space
      }
      return word;
    })
    .join(" ");
}

function varyPunctuation(text: string): string {
  return text
    .replace(/\./g, (match) => {
      const rand = Math.random();
      if (rand > 0.9) return "....";
      if (rand > 0.7) return "...";
      if (rand > 0.95) return "!!";
      return match;
    })
    .replace(/,/g, (match) => {
      const rand = Math.random();
      if (rand > 0.9) return ";";
      if (rand > 0.8) return " —";
      return match;
    });
}

export function paraphraseText(text: string, type: HumanizerType): string {
  let phrases: Record<string, string[]> = {};
  let starters = [];

  switch (type) {
    case "academic":
      phrases = academicPhrases;
      starters = sentenceStarters.academic;
      break;
    case "casual":
      phrases = casualPhrases;
      starters = sentenceStarters.casual;
      break;
    case "professional":
      phrases = professionalPhrases;
      starters = sentenceStarters.professional;
      break;
    case "creative":
      phrases = creativePhrases;
      starters = sentenceStarters.creative;
      break;
    default:
      return text;
  }

  // Split text into sentences
  let sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  // Process each sentence with advanced transformations
  sentences = sentences.map((sentence, index) => {
    // Split into words for more granular processing
    let words = sentence.split(/\s+/);

    // Apply word-level transformations
    words = words.map((word) => {
      // 10% chance to add invisible characters
      if (Math.random() < 0.1) {
        return word.split("").join(String.fromCharCode(8203));
      }
      return word;
    });

    let processed = words.join(" ").trim();

    // Replace phrases with random variations
    Object.entries(phrases).forEach(([key, values]) => {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      processed = processed.replace(
        regex,
        () => values[Math.floor(Math.random() * values.length)],
      );
    });

    // Add variety to sentence starters (20% chance)
    if (index > 0 && Math.random() < 0.2) {
      const starter = getRandomElement(starters);
      processed = `${starter} ${processed.charAt(0).toLowerCase()}${processed.slice(1)}`;
    }

    return capitalizeFirstLetter(processed);
  });

  // Anti-detection measures
  sentences = shuffleSentences(sentences);
  let result = sentences.join(" ");
  result = addRandomWhitespace(result);
  result = varyPunctuation(result);

  return result;
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}
