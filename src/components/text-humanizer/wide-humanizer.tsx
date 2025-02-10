import { useState } from "react";
import { motion } from "framer-motion";
import { HumanizerInput } from "./humanizer-input";
import { HumanizerOutput } from "./humanizer-output";
import { paraphraseText } from "@/lib/paraphraser";

export function WideHumanizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const humanized = await humanizeText(inputText);
      setOutputText(humanized || inputText);
    } catch (error) {
      console.error("Error humanizing text:", error);
      setOutputText(inputText);
    } finally {
      setLoading(false);
    }
  };

  const humanizeText = async (text: string) => {
    if (!text) return text;
    try {
      const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
      let result = "";

      for (const chunk of chunks) {
        result += (result ? " " : "") + paraphraseText(chunk, "standard");
      }

      return result;
    } catch (error) {
      console.error("Error in humanizeText:", error);
      return text;
    }
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setInputText(text);
    try {
      const humanized = await humanizeText(text);
      setOutputText(humanized || text);
    } catch (error) {
      console.error("Error humanizing text:", error);
      setOutputText(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
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
          <h1 className="text-4xl font-display font-semibold tracking-tight mb-3">
            What would you like to humanize?
          </h1>
          <p className="text-lg text-muted-foreground font-display">
            Transform your text into natural, human-like writing
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1400px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <HumanizerInput onSubmit={handleSubmit} disabled={loading} />
          </div>
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <HumanizerOutput
              text={outputText}
              type="standard"
              originalText={inputText}
              onRegenerate={handleRegenerate}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
