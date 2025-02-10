export type HumanizerType =
  | "free"
  | "standard"
  | "academic"
  | "simple"
  | "formal"
  | "informal"
  | "expand"
  | "shorten"
  | "ultra";

export const humanizerTypes: {
  label: string;
  value: HumanizerType;
  description: string;
}[] = [
  {
    label: "Free",
    value: "free",
    description: "Basic text humanization",
  },
  {
    label: "Standard",
    value: "standard",
    description: "Balanced, natural language",
  },
  {
    label: "Academic",
    value: "academic",
    description: "Formal academic style",
  },
  {
    label: "Simple",
    value: "simple",
    description: "Clear and easy to understand",
  },
  {
    label: "Formal",
    value: "formal",
    description: "Professional and polished",
  },
  {
    label: "Informal",
    value: "informal",
    description: "Casual and conversational",
  },
  {
    label: "Expand",
    value: "expand",
    description: "Make text longer and detailed",
  },
  {
    label: "Shorten",
    value: "shorten",
    description: "Make text concise and brief",
  },
  {
    label: "Ultra",
    value: "ultra",
    description: "Advanced AI processing",
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
