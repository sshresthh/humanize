import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw, FileText, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HumanizerType } from "./humanizer-types";

interface HumanizerOutputProps {
  text: string;
  type: HumanizerType;
  originalText?: string;
  onRegenerate?: () => void;
}

const downloadAsPDF = async (text: string) => {
  try {
    const { default: html2pdf } = await import("html2pdf.js");

    // Create a temporary div with the text content
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.fontSize = "12px";
    element.style.lineHeight = "1.5";
    element.innerHTML = text
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("");

    const opt = {
      margin: 10,
      filename: "humanized-text.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const downloadAsWord = (text: string) => {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Humanized Text</title>
      <style>
        body { font-family: 'Calibri', sans-serif; line-height: 1.5; }
        p { margin-bottom: 1em; }
      </style>
    </head>
    <body>
  `;
  const footer = "</body></html>";
  const formattedText = text
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");
  const sourceHTML = header + formattedText + footer;

  const source =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = "humanized-text.doc";
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

export function HumanizerOutput({
  text,
  type,
  originalText,
  onRegenerate,
}: HumanizerOutputProps) {
  const [copied, setCopied] = useState(false);

  if (!text) {
    return (
      <div className="h-full border rounded-lg bg-background/50 flex items-center justify-center text-muted-foreground">
        Humanized text will appear here
      </div>
    );
  }

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
      <div className="flex-1 relative rounded-lg border bg-card p-4 font-mono text-sm text-foreground">
        <div className="absolute bottom-2 right-2 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => downloadAsPDF(text)}>
                <FileText className="mr-2 h-4 w-4" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadAsWord(text)}>
                <FileText className="mr-2 h-4 w-4" />
                Download as Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="h-8 w-8 hover:bg-primary/10"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRegenerate}
              className="h-8 w-8 hover:bg-primary/10"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-4">
          {text.split(" ").map((word, i) => (
            <span key={i}>{word} </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="text-xs text-muted-foreground">{wordCount} words</div>
      </div>
    </div>
  );
}
