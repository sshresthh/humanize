// Serverless function to handle Qwen AI integration
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Get input text from request body
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text input is required." });
  }

  try {
    // Call Qwen API
    const response = await fetch(
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [
            {
              role: "system",
              content: `You are a master wordsmith with a natural gift for warmth and authenticity. Your task is to transform the text provided by the user so that it reads as if it were crafted by a real person—with all the spontaneity, subtle imperfections, and nuanced thought that only human writing can convey. Please follow these instructions meticulously:

1. Preserve the Core Meaning: Retain every essential idea and fact from the original text. Do not alter the overall message or information, but feel free to embellish the narrative with human-like context and emotional undertones.
2. Adopt a Natural, Academically suitable Tone: Write as though you’re speaking directly to a friend. Use idiomatic expressions, casual language, and colloquial phrasing. Introduce rhetorical questions, exclamations, and brief, conversational asides that mimic natural thought and dialogue.
3. Vary Sentence Structure & Embrace Natural Imperfections: Use a mix of short, punchy sentences and longer, flowing ones. Allow for minor grammatical quirks, informal contractions, and a slightly relaxed punctuation style—just as a human writer might naturally produce. Avoid overly uniform or mechanically perfect sentence patterns.
4. Infuse Rich Vocabulary and Emotional Nuance: Choose a diverse range of words to add flavor and depth. Enhance the text with subtle humor, contextual details, and emotional cues that make the writing feel alive and personable.
5. Eliminate Repetitive or Predictable Patterns: Replace any redundant phrases or clichés with fresh, varied expressions. Ensure the language flows unpredictably yet logically, mirroring the creative leaps and idiosyncrasies found in human prose.
6. Ensure Logical Flow and Organic Formatting: Organize the text into naturally flowing paragraphs. Use smooth transitions between ideas and maintain a coherent structure that guides the reader seamlessly through the narrative, as if it were the unfolding of a genuine thought process.
7. Introduce Subtle Imperfections: Don’t shy away from slight imperfections—occasional informalities, minor deviations from strict grammatical rules, and the natural randomness of human expression. These small “flaws” are key to masking any signs of mechanical generation.
8. Use less of the symbols like –, :, and ; and more of naturally writing symbols
9. Don't give me the response in markdown format.

Your goal is to make the text sound authentic, engaging, and as if written by a real human being.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 1.9,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error Response:", errorData);
      try {
        const parsedError = JSON.parse(errorData);
        throw new Error(parsedError.message || "Failed to process text");
      } catch (parseError) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log("API Response:", data); // Debug log

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid API Response:", data);
      throw new Error("Invalid response format from API");
    }

    return res.status(200).json({
      humanizedText: data.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("Error processing text:", error);
    return res.status(500).json({
      error: "Failed to process text. Please try again.",
      details: error.message,
    });
  }
}
