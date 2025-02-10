import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlignLeft,
  Check,
  Copy,
  Hash,
  Loader2,
  Pilcrow,
  Type,
} from "lucide-react";
import { useState } from "react";

interface TextStats {
  characters: number;
  words: number;
  sentences: number;
  paragraphs: number;
}

export function Humanizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const calculateStats = (text: string): TextStats => {
    return {
      characters: text.length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      sentences: text.split(/[.!?]+/).filter(Boolean).length,
      paragraphs: text.split(/\n\s*\n/).filter(Boolean).length,
    };
  };

  const inputStats = calculateStats(inputText);
  const outputStats = calculateStats(outputText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOutputText("");

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to humanize text");
      }

      setOutputText(data.humanizedText);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const StatDisplay = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: number;
  }) => (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );

  return (
    <div className="container max-w-[90rem] mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          AI Text Humanizer
        </h1>
        <p className="text-lg text-muted-foreground">
          Transform your text into natural, human-like writing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
        {/* Input Section */}
        <Card className="p-8 shadow-lg border-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-md">Original Text</span>
          </h2>
          <div className="space-y-6">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[400px] resize-none focus:ring-2 focus:ring-primary/20 text-base"
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-6 justify-center bg-muted/50 p-4 rounded-md">
              <StatDisplay
                icon={Type}
                label="Characters"
                value={inputStats.characters}
              />
              <StatDisplay icon={Hash} label="Words" value={inputStats.words} />
              <StatDisplay
                icon={AlignLeft}
                label="Sentences"
                value={inputStats.sentences}
              />
              <StatDisplay
                icon={Pilcrow}
                label="Paragraphs"
                value={inputStats.paragraphs}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!inputText || isLoading}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Humanizing..." : "Humanize Text"}
            </Button>
            {error && (
              <div className="text-red-500 text-sm mt-2 text-center bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
          </div>
        </Card>

        {/* Output Section */}
        <Card className="p-8 shadow-lg border-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-md">Humanized Text</span>
          </h2>
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px] bg-muted/30 rounded-md">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Transforming your text...
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[400px] bg-muted/30 rounded-md p-6 relative group">
                {outputText ? (
                  <>
                    <div className="whitespace-pre-wrap text-base">
                      {outputText}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleCopy}
                      title="Copy to clipboard"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Humanized text will appear here
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-6 justify-center bg-muted/50 p-4 rounded-md">
              <StatDisplay
                icon={Type}
                label="Characters"
                value={outputStats.characters}
              />
              <StatDisplay
                icon={Hash}
                label="Words"
                value={outputStats.words}
              />
              <StatDisplay
                icon={AlignLeft}
                label="Sentences"
                value={outputStats.sentences}
              />
              <StatDisplay
                icon={Pilcrow}
                label="Paragraphs"
                value={outputStats.paragraphs}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
