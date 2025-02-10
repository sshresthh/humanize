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

export interface TextDiff {
  addedWords: string[];
  longestUnchangedPart: string;
}

export interface HumanizeResponse {
  text: string;
  error?: string;
}
