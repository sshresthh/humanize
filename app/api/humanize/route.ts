import { NextResponse } from "next/server";
import { HumanizerType } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();

    if (!text || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Here we'll integrate with DeepSeek
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are an expert at rewriting text to make it more ${type}. Maintain the core meaning but adjust the style and tone accordingly.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error("Error processing text:", error);
    return NextResponse.json(
      { error: "Failed to process text" },
      { status: 500 },
    );
  }
}
