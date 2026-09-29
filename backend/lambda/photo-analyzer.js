const { analyzePermumeImage } = require("./bedrock-utils");

/**
 * Lambda handler for perfume photo analysis
 * Receives a base64-encoded image and returns perfume analysis
 */
exports.handler = async (event) => {
  console.log("Photo analysis request received");

  try {
    // Parse request body
    let body;
    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else {
      body = event.body;
    }

    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "imageBase64 is required" }),
      };
    }

    console.log(`Analyzing image (${mimeType || "image/jpeg"})`);

    // Analyze the image using Claude
    const analysis = await analyzePermumeImage(imageBase64, mimeType || "image/jpeg");

    console.log("Analysis complete:", {
      identified: analysis.identified,
      brand: analysis.brand,
      name: analysis.name,
      confidence: analysis.confidence,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        data: analysis,
        source: "bedrock",
        model: "claude-3-5-sonnet",
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error.message || "Failed to analyze image",
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
