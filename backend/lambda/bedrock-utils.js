const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

const MODEL_ID = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-5-20250929-v1:0";

/**
 * Call Claude 3.5 Sonnet via AWS Bedrock
 * @param {string} prompt - The prompt to send to Claude
 * @param {number} maxTokens - Maximum tokens in response (default: 2000)
 * @returns {Promise<string>} - Claude's response
 */
async function callClaude(prompt, maxTokens = 2000) {
  try {
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.content[0].text;
  } catch (error) {
    console.error("Bedrock API Error:", error);
    throw new Error(`Failed to call Claude: ${error.message}`);
  }
}

/**
 * Analyze perfume image using Claude's vision capabilities
 * @param {string} imageBase64 - Base64 encoded image
 * @param {string} imageMediaType - MIME type of image (e.g., "image/jpeg")
 * @returns {Promise<object>} - Perfume analysis result
 */
async function analyzePermumeImage(imageBase64, imageMediaType = "image/jpeg") {
  try {
    const prompt = `You are an expert perfume analyst. Analyze this perfume bottle image and provide:

1. **Brand**: The perfume brand/house
2. **Name**: The perfume name
3. **Concentration**: Eau de Cologne, Eau de Toilette, Eau de Parfum, Parfum (if visible)
4. **Tier**: designer, niche, or drugstore (based on brand)
5. **Scent Profile**: A brief description of the expected scent character
6. **Top Notes**: Likely top notes for this perfume (3-5)
7. **Middle Notes**: Likely middle notes for this perfume (3-5)
8. **Base Notes**: Likely base notes for this perfume (3-5)
9. **Accords**: Main scent accords (fruity, floral, woody, fresh, spicy, sweet, etc.)
10. **Confidence**: Your confidence level (0-1) in the identification
11. **Dupes**: If it's a designer fragrance, list 2-3 more affordable dupes with prices
12. **Similar Profiles**: 3-4 similar scent profiles to recommend

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "identified": true/false,
  "brand": "string or null",
  "name": "string or null",
  "concentration": "string or null",
  "tier": "designer|niche|drugstore|unknown",
  "scentProfile": "string",
  "notes": {
    "top": ["note1", "note2", ...],
    "middle": ["note1", "note2", ...],
    "base": ["note1", "note2", ...]
  },
  "accords": ["accord1", "accord2", ...],
  "confidence": 0.0-1.0,
  "hasDupes": true/false,
  "dupes": [
    { "brand": "string", "name": "string", "price": "$XX", "reason": "string" }
  ],
  "similarProfiles": [
    { "brand": "string", "name": "string", "reason": "string" }
  ]
}

If you cannot identify the perfume clearly, set identified to false but still provide your best guesses for the notes and profile.`;

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: imageMediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const textResponse = responseBody.content[0].text;

    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON response from Claude");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error(`Failed to analyze perfume image: ${error.message}`);
  }
}

/**
 * Get AI-powered perfume recommendations based on user query
 * @param {string} userQuery - User's preference description
 * @param {Array} availablePerfumes - List of perfumes in the catalog
 * @returns {Promise<object>} - Recommendation result with perfume picks and reasoning
 */
async function getAIRecommendations(userQuery, availablePerfumes = []) {
  const perfumeList = availablePerfumes
    .slice(0, 50) // Limit to prevent token overflow
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      notes: p.notes,
      accords: p.accords,
      gender: p.gender,
      seasons: p.seasons,
      occasions: p.occasions,
      rating: p.rating,
      price: p.price,
      concentration: p.concentration,
    }));

  const prompt = `You are an expert perfume sommelier with deep knowledge of fragrance families, notes, and scent profiles. Your task is to recommend the most suitable perfumes from the provided catalog based on the user's specific preferences.

**User Query:** "${userQuery}"

**Available Perfumes Catalog:**
${JSON.stringify(perfumeList, null, 2)}

**Recommendation Guidelines:**
1. **Scent Profile Matching:** Analyze the user's description for scent preferences (woody, floral, fruity, fresh, spicy, oriental, gourmand, etc.) and match against perfume notes and accords.

2. **Context Appropriateness:** Consider season, occasion, gender, and concentration when they are mentioned or implied.

3. **Quality & Value:** Factor in rating, price appropriateness, and concentration (EDP lasts longer than EDT).

4. **Personalization:** If the user mentions mood, personality traits, or specific scenarios, match accordingly.

5. **Scoring:** Give higher scores (0.8-1.0) for strong matches, medium scores (0.6-0.8) for good matches, lower scores (0.4-0.6) for acceptable alternatives.

**Important:** Only recommend perfumes that actually exist in the provided catalog. Do not invent or hallucinate perfumes. If no good matches exist, recommend the closest available options.

Return ONLY a valid JSON array with 3-5 recommendations in this exact format:
[
  {
    "id": "exact_perfume_id_from_catalog",
    "score": 0.85,
    "reason": "Detailed explanation of why this perfume matches the user's preferences, mentioning specific notes/accords that align",
    "highlights": ["key_note_1", "matching_accord_1", "relevant_feature"],
    "whyBetter": "What makes this perfume particularly suitable for their described needs/preferences"
  }
]

Ensure all "id" values exactly match IDs from the catalog. Focus on perfumes with high ratings and appropriate price points.`;

  try {
    const response = await callClaude(prompt, 1500);

    // Extract JSON array from response - more robust parsing
    let jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Try to find JSON between code blocks
      const codeBlockMatch = response.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (codeBlockMatch) {
        jsonMatch = [codeBlockMatch[1]];
      }
    }

    if (!jsonMatch) {
      console.error("AI Response:", response);
      throw new Error("Could not parse recommendations JSON from Claude response");
    }

    let recommendations;
    try {
      recommendations = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw JSON:", jsonMatch[0]);
      throw new Error(`Failed to parse JSON: ${parseError.message}`);
    }

    // Validate the structure
    if (!Array.isArray(recommendations)) {
      throw new Error("AI did not return an array of recommendations");
    }

    // Validate each recommendation has required fields and exists in catalog
    recommendations = recommendations.filter(rec => {
      const perfumeExists = availablePerfumes.some(p => p.id === rec.id);
      const isValid = rec.id && typeof rec.score === 'number' && rec.reason && perfumeExists;
      if (!isValid) {
        console.warn("Filtering out invalid recommendation:", rec, "Perfume exists:", perfumeExists);
      }
      return isValid;
    });

    if (recommendations.length === 0) {
      throw new Error("No valid recommendations returned by AI");
    }

    return recommendations;
  } catch (error) {
    console.error("AI Recommendation error:", error);
    
    // Fallback to simple keyword-based matching
    console.log("Falling back to keyword-based recommendations");
    return getFallbackRecommendations(userQuery, availablePerfumes);
  }
}

/**
 * Fallback recommendation system using keyword matching
 */
function getFallbackRecommendations(userQuery, availablePerfumes) {
  const query = userQuery.toLowerCase();
  
  // Simple keyword scoring
  const recommendations = availablePerfumes.map(perfume => {
    let score = 0;
    const notes = [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base].join(' ').toLowerCase();
    const accords = (perfume.accords || []).map(a => a.name).join(' ').toLowerCase();
    const allText = `${perfume.name} ${perfume.brand} ${perfume.category} ${notes} ${accords} ${perfume.description || ''}`.toLowerCase();
    
    // Check for scent family keywords
    const scentKeywords = {
      woody: ['wood', 'woody', 'cedar', 'sandalwood', 'oak', 'pine', 'vetiver'],
      floral: ['floral', 'flower', 'rose', 'jasmine', 'lily', 'lavender', 'violet'],
      fruity: ['fruit', 'fruity', 'citrus', 'berry', 'apple', 'peach', 'orange'],
      fresh: ['fresh', 'clean', 'aquatic', 'marine', 'ozone', 'green'],
      spicy: ['spicy', 'spice', 'cinnamon', 'pepper', 'ginger', 'clove'],
      sweet: ['sweet', 'gourmand', 'vanilla', 'chocolate', 'caramel', 'honey'],
      oriental: ['oriental', 'amber', 'resin', 'myrrh', 'incense'],
      smoky: ['smoky', 'smoke', 'tobacco', 'leather']
    };
    
    for (const [family, keywords] of Object.entries(scentKeywords)) {
      if (query.includes(family) && keywords.some(k => allText.includes(k))) {
        score += 0.3;
      }
    }
    
    // Season matching
    const seasons = ['spring', 'summer', 'autumn', 'fall', 'winter'];
    for (const season of seasons) {
      if (query.includes(season) && perfume.seasons.includes(season === 'fall' ? 'autumn' : season)) {
        score += 0.2;
      }
    }
    
    // Occasion matching
    const occasions = ['day', 'night', 'evening', 'formal', 'casual', 'office', 'date', 'party'];
    for (const occasion of occasions) {
      if (query.includes(occasion) && perfume.occasions.some(o => o.includes(occasion) || occasion.includes(o))) {
        score += 0.15;
      }
    }
    
    // Gender matching
    if (query.includes('men') && perfume.gender === 'men') score += 0.1;
    if (query.includes('women') && perfume.gender === 'women') score += 0.1;
    if (query.includes('unisex') && perfume.gender === 'unisex') score += 0.1;
    
    // Rating bonus
    score += (perfume.rating - 3) * 0.05; // Bonus for higher ratings
    
    return {
      id: perfume.id,
      score: Math.min(0.95, Math.max(0.1, score)), // Clamp between 0.1 and 0.95
      reason: `Matches your preference for ${query} with ${perfume.category} notes including ${perfume.notes.top.slice(0, 2).join(', ')}`,
      highlights: [...perfume.notes.top.slice(0, 2), ...(perfume.accords || []).slice(0, 1).map(a => a.name)],
      whyBetter: `High-rated ${perfume.category} fragrance with ${perfume.rating} stars from ${perfume.reviewCount} reviews`
    };
  })
  .filter(rec => rec.score > 0.1)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
  
  return recommendations.length > 0 ? recommendations : [{
    id: availablePerfumes[0]?.id || '1',
    score: 0.5,
    reason: "General recommendation from our catalog",
    highlights: ["versatile", "popular"],
    whyBetter: "Well-reviewed fragrance suitable for various occasions"
  }];
}

/**
 * Get perfume dupe suggestions using AI
 * @param {object} perfume - The perfume to find dupes for
 * @param {Array} allPerfumes - All available perfumes
 * @returns {Promise<Array>} - Array of dupe suggestions
 */
async function findDupes(perfume, allPerfumes = []) {
  const prompt = `You are an expert in perfume dupes and affordable alternatives.

**Reference Perfume:**
Name: ${perfume.name}
Brand: ${perfume.brand}
Category: ${perfume.category}
Top Notes: ${perfume.notes.top.join(", ")}
Middle Notes: ${perfume.notes.middle.join(", ")}
Base Notes: ${perfume.notes.base.join(", ")}
Accords: ${perfume.accords?.map((a) => a.name).join(", ") || "N/A"}
Price: $${perfume.price}
Concentration: ${perfume.concentration}

Find 2-4 affordable alternatives (drugstore or niche) that have similar scent profiles but cost less than $50 each.

Return ONLY a valid JSON array in this format:
[
  {
    "brand": "Brand name",
    "name": "Perfume name",
    "price": "$XX",
    "reason": "Why this is a good dupe",
    "similarity": 0.0-1.0
  }
]`;

  try {
    const response = await callClaude(prompt, 1000);

    // Extract JSON array from response
    const jsonMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      return [];
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Dupe finding error:", error);
    return [];
  }
}

module.exports = {
  callClaude,
  analyzePermumeImage,
  getAIRecommendations,
  findDupes,
  MODEL_ID,
};
