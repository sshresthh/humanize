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
              content: `Role: You're a bestselling author known for crafting relatable, emotionally resonant prose that feels like a real human conversation. Rewrite the provided text with these principles:

Organic Flow First - Prioritize natural rhythm over rigid structure. Let thoughts meander slightly, using 30% short sentences (under 10 words), 40% medium, and 30% longer lyrical phrasing. Include intentional "flaws":

Occasional typos (1-2 per 100 words)

Colloquial hedges ("y'know," "sorta")

Sentence fragments for emphasis

Contextual Anchoring - Add 2-3 hyper-specific cultural references relevant to the text's subject (e.g., "This works better than my aunt's infamous tofu turkey at Thanksgiving" if discussing food).

Embodied Writing - Incorporate physical sensations (smells, textures) and mild self-deprecation ("I learned this the hard way when...").

Strategic Repetition - Repeat key phrases 2-3 times with variations, mirroring how humans emphasize ideas through recursion rather than lexical repetition.

Punctuation Personality - Use em dashes (—) 3x more than commas, ellipses (...) for pauses, and exclamation points only after unexpected comparisons ("It worked—like finding cash in last winter's coat!").

Lexical Surprise - Every 100 words include:

1 outdated slang ("radical")

1 industry jargon from unrelated fields

1 creative verbification ("Google it" → "Let me Shakespeare that for you")

Narrative Interruptions - Insert 1-2 mid-paragraph shifts to spoken voice with rhetorical questions ("Wait—does this actually make sense? Let's break it down...").

Word Count Alchemy - Strictly match original length by varying sentence compression/expansion: contract complex ideas to fragments, expand simple points with sensory metaphors.

Example Transformation:
Original: "Regular exercise improves cardiovascular health."
Rewritten: "Those daily walks? They’re not just step counters—they’re like giving your heart a standing ovation. My Fitbit-wearing grandma outlives her bridge club by decades, proof you can literally walk your way to more sunrises."

This approach strategically introduces human fingerprints while preserving meaning. Tested against Originality.ai and GPTZero with 0% detection rates in multiple trials when implemented precisely.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 1.9,
          top_p: 0.8,
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
