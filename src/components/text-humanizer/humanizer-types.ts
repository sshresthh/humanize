export type HumanizerType = "simple" | "standard" | "academic" | "ultra";

export const humanizerTypes: {
  label: string;
  value: HumanizerType;
  description: string;
  color: string;
  gradient: string;
  icon: string;
}[] = [
  {
    label: "Simple",
    value: "simple",
    description: "Clear and concise text",
    color: "from-blue-500 to-cyan-400",
    gradient: "hover:bg-gradient-to-r",
    icon: "✨",
  },
  {
    label: "Standard",
    value: "standard",
    description: "Natural, balanced style",
    color: "from-violet-500 to-purple-400",
    gradient: "hover:bg-gradient-to-r",
    icon: "🌟",
  },
  {
    label: "Academic",
    value: "academic",
    description: "Scholarly and formal",
    color: "from-emerald-500 to-teal-400",
    gradient: "hover:bg-gradient-to-r",
    icon: "📚",
  },
  {
    label: "Advanced",
    value: "ultra",
    description: "Enhanced AI processing",
    color: "from-rose-500 to-pink-400",
    gradient: "hover:bg-gradient-to-r",
    icon: "⚡",
  },
];

export interface TextDiff {
  addedWords: string[];
  longestUnchangedPart: string;
}

export function findTextDifferences(
  originalText: string,
  newText: string,
): TextDiff {
  const originalWords = originalText.toLowerCase().split(/\s+/);
  const newWords = newText.toLowerCase().split(/\s+/);

  // Find added words
  const addedWords = newWords.filter((word) => !originalWords.includes(word));

  // Find longest unchanged part
  let longestUnchangedPart = "";
  let currentUnchanged = "";

  newText.split(/\s+/).forEach((word, i, arr) => {
    if (originalText.toLowerCase().includes(word.toLowerCase())) {
      currentUnchanged += (currentUnchanged ? " " : "") + word;
      if (currentUnchanged.length > longestUnchangedPart.length) {
        longestUnchangedPart = currentUnchanged;
      }
    } else {
      currentUnchanged = "";
    }
  });

  return {
    addedWords,
    longestUnchangedPart,
  };
}
