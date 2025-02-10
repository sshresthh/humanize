import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findTextDifferences(
  originalText: string,
  newText: string,
): TextDiff {
  const originalWords = originalText.toLowerCase().split(/\s+/);
  const newWords = newText.toLowerCase().split(/\s+/);

  const addedWords = newWords.filter((word) => !originalWords.includes(word));

  let longestUnchangedPart = "";
  let currentUnchanged = "";

  newText.split(/\s+/).forEach((word) => {
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
