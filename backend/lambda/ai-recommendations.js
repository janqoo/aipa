const AWS = require("aws-sdk");
const { getAIRecommendations, findDupes } = require("./bedrock-utils");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const PERFUMES_TABLE = process.env.PERFUMES_TABLE;

/**
 * Lambda handler for AI-powered perfume recommendations
 * Receives a user query and returns personalized recommendations
 */
exports.handler = async (event) => {
  console.log("Recommendation request received:", event);

  try {
    // Parse request body
    let body;
    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else {
      body = event.body;
    }

    const { query, limit = 5, includeAlternatives = true } = body;

    if (!query) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "query parameter is required" }),
      };
    }

    console.log(`Getting recommendations for query: "${query}"`);

    // Fetch available perfumes from DynamoDB
    let perfumes = [];
    try {
      const scanResult = await dynamoDB
        .scan({
          TableName: PERFUMES_TABLE,
          Limit: 100, // Limit for performance
        })
        .promise();

      perfumes = scanResult.Items || [];
      console.log(`Found ${perfumes.length} perfumes in database`);
    } catch (dbError) {
      console.warn("Could not fetch from DynamoDB, using minimal data:", dbError.message);
      perfumes = [];
    }

    // Get AI recommendations
    const recommendations = await getAIRecommendations(query, perfumes);

    // Enrich recommendations with full perfume data
    let enrichedRecommendations = recommendations.map(rec => {
      const perfume = perfumes.find(p => p.id === rec.id);
      if (!perfume) {
        console.warn(`Perfume with id ${rec.id} not found in database`);
        return null;
      }
      
      return {
        id: rec.id,
        reason: rec.reason,
        confidence: rec.score, // Map score to confidence for frontend compatibility
        perfume: perfume,
        highlights: rec.highlights,
        whyBetter: rec.whyBetter,
      };
    }).filter(rec => rec !== null);

    // Optionally find dupes for each recommendation
    if (includeAlternatives && perfumes.length > 0) {
      enrichedRecommendations = await Promise.all(
        enrichedRecommendations.slice(0, 3).map(async (rec) => {
          const perfume = rec.perfume;
          let dupes = [];
          
          if (perfume && perfume.price > 100) {
            // Only find dupes for expensive fragrances
            dupes = await findDupes(perfume, perfumes);
          }
          
          return {
            ...rec,
            dupes: dupes,
          };
        })
      );
    }

    const responseData = enrichedRecommendations.slice(0, limit);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        data: responseData,
        recommendations: responseData,
        query: query,
        source: "bedrock",
        model: "claude-3-5-sonnet",
        timestamp: new Date().toISOString(),
        totalAvailable: perfumes.length,
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
        error: error.message || "Failed to get recommendations",
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
