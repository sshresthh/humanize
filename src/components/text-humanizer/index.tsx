import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeSelector } from "./type-selector";
import { HumanizerInput } from "./humanizer-input";
import { HumanizerOutput } from "./humanizer-output";
import type { HumanizerType } from "./humanizer-types";
import { paraphraseText } from "@/lib/paraphraser";

export function TextHumanizer() {
  const [type, setType] = useState<HumanizerType | null>(null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    if (!type || !inputText) return;
    setLoading(true);
    try {
      const humanized = await humanizeText(inputText, type);
      setOutputText(humanized || inputText);
    } catch (error) {
      console.error("Error humanizing text:", error);
      setOutputText(inputText);
    } finally {
      setLoading(false);
    }
  };

  const humanizeText = async (text: string, type: HumanizerType) => {
    if (!type || !text) return text;
    try {
      // Process text in chunks for better performance
      const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
      let result = "";

      for (const chunk of chunks) {
        result += (result ? " " : "") + paraphraseText(chunk, type);
      }

      return result;
    } catch (error) {
      console.error("Error in humanizeText:", error);
      return text;
    }
  };

  const handleTypeSelect = (selectedType: HumanizerType) => {
    setType(selectedType);
    setIsTypeSelected(true);
  };

  const handleSubmit = async (text: string) => {
    if (!type || !text.trim()) return;
    setLoading(true);
    setInputText(text);
    try {
      const humanized = await humanizeText(text, type);
      setOutputText(humanized || text);
    } catch (error) {
      console.error("Error humanizing text:", error);
      setOutputText(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-dot-pattern dark:bg-dot-pattern-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">AI Text Humanizer</h1>
          <p className="text-muted-foreground">
            Transform your text into natural, human-like writing
          </p>
        </motion.div>

        <div className="mb-8">
          <TypeSelector selected={type} onSelect={handleTypeSelect} />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="space-y-4">
            <HumanizerInput
              onSubmit={handleSubmit}
              disabled={!isTypeSelected || loading}
            />
          </div>
          <div className="h-full">
            <HumanizerOutput
              text={outputText}
              type={type}
              originalText={inputText}
              onRegenerate={handleRegenerate}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
