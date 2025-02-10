import { useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Trash2, FileText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HumanizerInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function HumanizerInput({ onSubmit, disabled }: HumanizerInputProps) {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
        setError("");
      };
      reader.readAsText(file);
    } catch (error) {
      setError(
        "Error reading file. Please try a different file or copy/paste the text directly.",
      );
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
        setError("");
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      setError("Failed to copy text to clipboard");
    }
  };

  const clearText = () => {
    setText("");
    setError("");
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length;
  const paragraphCount = text.split(/\n\s*\n/).filter(Boolean).length;

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="relative group"
          >
            <Upload className="w-4 h-4" />
            <span className="sr-only">Upload file</span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Upload file
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            disabled={!text || disabled}
            className="relative group"
          >
            <Copy className="w-4 h-4" />
            <span className="sr-only">Copy text</span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Copy text
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={clearText}
            disabled={!text || disabled}
            className="relative group"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Clear text</span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Clear text
            </span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground space-x-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span>{sentenceCount} sentences</span>
          <span>{paragraphCount} paragraphs</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className={`relative rounded-lg transition-all ${isDragging ? "ring-2 ring-primary" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center z-10"
            >
              <div className="flex items-center gap-2 text-primary">
                <FileText className="w-6 h-6" />
                Drop your file here
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Textarea
          placeholder="Enter or paste your text here..."
          className="min-h-[300px] bg-background/50 dark:bg-background/25 backdrop-blur-sm font-mono text-sm border-none focus-visible:ring-1 focus-visible:ring-accent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.doc,.docx,.rtf,.pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      <Button
        className="w-full"
        onClick={() => onSubmit(text)}
        disabled={!text.trim() || disabled}
      >
        Humanize Text
      </Button>
    </div>
  );
}
