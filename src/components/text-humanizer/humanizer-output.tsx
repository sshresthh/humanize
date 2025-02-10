import { motion } from "framer-motion";
import { HumanizerType, findTextDifferences } from "./humanizer-types";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface HumanizerOutputProps {
  text: string;
  type: HumanizerType;
  originalText?: string;
  onRegenerate?: () => void;
}

export function HumanizerOutput({
  text,
  type,
  originalText,
  onRegenerate,
}: HumanizerOutputProps) {
  const [copied, setCopied] = useState(false);
  const [textDiff, setTextDiff] = useState<{
    addedWords: string[];
    longestUnchangedPart: string;
  }>({ addedWords: [], longestUnchangedPart: "" });

  useEffect(() => {
    if (originalText && text) {
      setTextDiff(findTextDifferences(originalText, text));
    }
  }, [originalText, text]);

  if (!text)
    return (
      <div className="h-full border rounded-lg bg-background/50 flex items-center justify-center text-muted-foreground">
        Humanized text will appear here
      </div>
    );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative rounded-lg border bg-background/50 dark:bg-background/25 backdrop-blur-sm p-4 font-mono text-sm">
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRegenerate}
              className="h-8 w-8"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-1">
          {text.split(" ").map((word, i) => {
            const isAdded = textDiff.addedWords.includes(word.toLowerCase());
            const isInLongestUnchanged = textDiff.longestUnchangedPart
              .toLowerCase()
              .includes(word.toLowerCase());

            return (
              <span
                key={i}
                className={`${isAdded ? "text-orange-400" : ""} ${
                  isInLongestUnchanged ? "text-blue-400" : ""
                }`}
              >
                {word}{" "}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="text-xs text-muted-foreground">{wordCount} words</div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>added change</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>longest unedited part</span>
          </div>
        </div>
      </div>
    </div>
  );
}
