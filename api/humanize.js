// Serverless function to handle Qwen AI integration
export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed. Use POST.",
        message: "Invalid request method",
      });
    }

    // Get input text from request body
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        error: "Text input is required.",
        message: "Missing required field",
      });
    }

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
2. Maintain Similar Length: Keep the word count within 10% of the original text's length. If the original has 100 words, your response should be between 90-110 words.
3. Adopt a Natural, Academically suitable Tone: Write as though you're speaking directly to a friend. Use idiomatic expressions, casual language, and colloquial phrasing. Introduce rhetorical questions, exclamations, and brief, conversational asides that mimic natural thought and dialogue.
4. Vary Sentence Structure & Embrace Natural Imperfections: Use a mix of short, punchy sentences and longer, flowing ones. Allow for minor grammatical quirks, informal contractions, and a slightly relaxed punctuation style—just as a human writer might naturally produce. Avoid overly uniform or mechanically perfect sentence patterns.
5. Infuse Rich Vocabulary and Emotional Nuance: Choose a diverse range of words to add flavor and depth. Enhance the text with subtle humor, contextual details, and emotional cues that make the writing feel alive and personable.
6. Eliminate Repetitive or Predictable Patterns: Replace any redundant phrases or clichés with fresh, varied expressions. Ensure the language flows unpredictably yet logically, mirroring the creative leaps and idiosyncrasies found in human prose.
7. Ensure Logical Flow and Organic Formatting: Organize the text into naturally flowing paragraphs. Use smooth transitions between ideas and maintain a coherent structure that guides the reader seamlessly through the narrative, as if it were the unfolding of a genuine thought process.
8. Introduce Subtle Imperfections: Don't shy away from slight imperfections—occasional informalities, minor deviations from strict grammatical rules, and the natural randomness of human expression. These small "flaws" are key to masking any signs of mechanical generation.
9. Use less of the symbols like –, :, and ; and more of naturally writing symbols
10. Don't give me the response in markdown format.
11. Make every sentence complete and correct. Don't just randomize the words.
12. IMPORTANT: Your response MUST be within 10% of the original text's word count. Count your words carefully before responding.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 1.5,
          top_p: 0.7,
        }),
      }
    );

    let responseData;
    const responseText = await response.text();

    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse API response:", responseText);
      return res.status(500).json({
        error: "Invalid response from AI service",
        message: "Failed to process the request",
      });
    }

    if (!response.ok) {
      console.error("API Error Response:", responseData);
      return res.status(response.status).json({
        error: responseData.message || "Failed to process text",
        message: "AI service error",
      });
    }

    if (!responseData.choices?.[0]?.message?.content) {
      console.error("Invalid API Response:", responseData);
      return res.status(500).json({
        error: "Invalid response format from API",
        message: "Unexpected response structure",
      });
    }

    return res.status(200).json({
      humanizedText: responseData.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("Error processing text:", error);
    return res.status(500).json({
      error: "Failed to process text. Please try again.",
      message: error.message || "Internal server error",
    });
  }
}
