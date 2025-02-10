import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlignLeft,
  Check,
  Clock,
  Copy,
  Hash,
  Instagram,
  Loader2,
  Maximize2,
  Minimize2,
  Pilcrow,
  Type,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TextStats {
  characters: number;
  words: number;
  sentences: number;
  paragraphs: number;
}

const LoadingTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1.5 text-muted-foreground/80 mt-4 animate-in fade-in duration-700">
      <Clock className="w-4 h-4 animate-pulse" />
      <span className="text-sm tabular-nums font-medium">
        {elapsedTime < 60
          ? `${elapsedTime}s`
          : `${Math.floor(elapsedTime / 60)}m ${elapsedTime % 60}s`}
      </span>
    </div>
  );
};

// Define whitelist of special users and their limits
const SPECIAL_USERS = {
  "ss_stha00@gmail.com": "unlimited",
  "test@example.com": 20,
  // Add more users as needed
} as const;

const DEFAULT_LIMIT = 7;

export function Humanizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isInputMaximized, setIsInputMaximized] = useState(false);
  const [isOutputMaximized, setIsOutputMaximized] = useState(false);
  const [generationCount, setGenerationCount] = useState(() => {
    const stored = localStorage.getItem("generation-count");
    return stored ? parseInt(stored, 10) : 0;
  });

  // Get remaining generations text
  const getRemainingText = () => {
    return `${DEFAULT_LIMIT - generationCount} generations remaining`;
  };

  // Update localStorage whenever generation count changes
  useEffect(() => {
    localStorage.setItem("generation-count", generationCount.toString());
  }, [generationCount]);

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

    // Check generation limit
    if (generationCount >= DEFAULT_LIMIT) {
      setError(
        "Sorry, but you've hit the maximum limit. I'll update the limit in the future."
      );
      return;
    }

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

      const data = await response.json().catch(() => ({
        error: "Failed to parse response",
        message: "Invalid server response",
      }));

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to humanize text"
        );
      }

      if (!data.humanizedText) {
        throw new Error("Invalid response format");
      }

      setOutputText(data.humanizedText);
      setGenerationCount((prev) => prev + 1);
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
    <div className="flex items-center gap-1.5 px-2 py-1.5">
      <Icon className="w-3.5 h-3.5 text-primary/70" />
      <span className="text-xs font-medium text-muted-foreground">
        {label}:
      </span>
      <span className="text-xs font-semibold tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 flex-grow">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent">
            AI Text Humanizer
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Transform your text into natural, human-like writing with the power
            of AI
          </p>
        </div>

        <div
          className={`grid grid-cols-1 ${
            !isInputMaximized && !isOutputMaximized ? "lg:grid-cols-2" : ""
          } gap-6 sm:gap-8 lg:gap-12 mx-auto mb-8 sm:mb-12`}
        >
          {/* Input Section */}
          {!isOutputMaximized && (
            <Card
              className={`p-4 sm:p-6 lg:p-8 shadow-xl border-2 hover:border-primary/20 transition-colors ${
                isInputMaximized ? "col-span-full" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  <span className="text-foreground">Original Text</span>
                </h2>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputText("")}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                    disabled={!inputText || isLoading}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsInputMaximized(!isInputMaximized)}
                    className="flex items-center gap-2"
                  >
                    {isInputMaximized ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-wrap items-center divide-x divide-border/50 bg-muted/50 px-2 py-1.5 rounded-lg backdrop-blur-sm overflow-x-auto">
                  <StatDisplay
                    icon={Type}
                    label="Characters"
                    value={inputStats.characters}
                  />
                  <StatDisplay
                    icon={Hash}
                    label="Words"
                    value={inputStats.words}
                  />
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
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type or paste your text here..."
                  className="min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] resize-none focus:ring-2 focus:ring-primary/20 text-base leading-relaxed transition-shadow duration-200 ease-in-out hover:bg-muted/20"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!inputText || isLoading}
                  className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:shadow-none text-sm sm:text-base"
                  size="lg"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  )}
                  {isLoading ? "Humanizing..." : "Humanize Text"}
                </Button>
              </div>
            </Card>
          )}

          {/* Output Section */}
          {!isInputMaximized && (
            <Card
              className={`p-4 sm:p-6 lg:p-8 shadow-xl border-2 hover:border-primary/20 transition-colors ${
                isOutputMaximized ? "col-span-full h-[calc(100vh-16rem)]" : ""
              }`}
            >
              <div
                className={`space-y-4 sm:space-y-6 ${
                  isOutputMaximized ? "h-full flex flex-col" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      <span className="text-foreground">Humanized Text</span>
                    </h2>
                    <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-muted/50 border border-border/40 text-muted-foreground w-fit">
                      {getRemainingText()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 transition-colors duration-200 text-xs sm:text-sm"
                      onClick={handleCopy}
                      title="Copy to clipboard"
                      disabled={!outputText}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsOutputMaximized(!isOutputMaximized)}
                      className="flex items-center gap-2"
                      title={isOutputMaximized ? "Minimize" : "Maximize"}
                    >
                      {isOutputMaximized ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center divide-x divide-border/50 bg-muted/50 px-2 py-1.5 rounded-lg backdrop-blur-sm overflow-x-auto">
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
                {isLoading ? (
                  <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] bg-muted/30 rounded-lg animate-pulse">
                    <div className="text-center space-y-2">
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping opacity-25">
                          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-primary" />
                        </div>
                        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin mx-auto text-primary relative" />
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground font-medium mt-4">
                        Transforming your text...
                      </p>
                      <LoadingTimer />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${
                      isOutputMaximized
                        ? "flex-grow"
                        : "min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]"
                    } bg-muted/30 rounded-lg p-4 sm:p-6 relative group transition-all duration-200 hover:bg-muted/40 overflow-y-auto`}
                  >
                    {outputText ? (
                      <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                        {outputText}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-sm sm:text-base text-muted-foreground font-medium text-center px-4">
                        Humanized text will appear here
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
      <footer className="py-4 border-t border-border/40">
        <div className="container max-w-screen-2xl mx-auto px-4 sm:px-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p className="mb-1">
            © 2025 Swaraj & Shyamsundar. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-2 mt-2">
            <Instagram size={16} />
            <a
              href="https://instagram.com/saeshhdu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @saeshhdu
            </a>
          </div>
          <div className="flex justify-center items-center gap-2 mt-2">
            <Instagram size={16} />
            <a
              href="https://instagram.com/ss_stha00"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @ss_stha00
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
