const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { mockPerfumes } = require('./catalog');

// Initialize AWS services
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
// Bedrock is only available in specific regions — always use us-east-1 unless overridden
const bedrockRuntime = new AWS.BedrockRuntime({
  region: process.env.BEDROCK_REGION || 'us-east-1'
});

// Environment variables
const PERFUMES_TABLE = process.env.PERFUMES_TABLE;
const COLLECTIONS_TABLE = process.env.COLLECTIONS_TABLE;
const REVIEWS_TABLE = process.env.REVIEWS_TABLE;
const BUCKET_NAME = process.env.BUCKET_NAME;
// Use Haiku for fast recommendations, Sonnet for accurate photo analysis
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';
const BEDROCK_VISION_MODEL_ID = process.env.BEDROCK_VISION_MODEL_ID || 'us.anthropic.claude-sonnet-4-5-20250929-v1:0';

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const { httpMethod, pathParameters, queryStringParameters, body } = event;
  // Strip stage prefix (e.g. /dev/analyze-photo → /analyze-photo)
  const rawPath = event.path || '';
  const path = rawPath.replace(/^\/(dev|staging|prod)/, '');

  try {
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: getHeaders(),
        body: ''
      };
    }

    // Use resource template path for parameterized routes, real path for fixed routes
    const resource = event.resource || path;

    switch (`${httpMethod} ${resource}`) {
      case 'GET /perfumes':
        return await getPerfumes(queryStringParameters);
      case 'GET /perfumes/{id}':
        return await getPerfume(pathParameters.id);
      case 'GET /perfumes/{id}/reviews':
        return await getPerfumeReviews(pathParameters.id);
      case 'POST /perfumes/{id}/reviews':
        return await upsertPerfumeReview(pathParameters.id, body ? JSON.parse(body) : {}, event);
      case 'POST /perfumes':
        return await createPerfume(JSON.parse(body));
      case 'PUT /perfumes/{id}':
        return await updatePerfume(pathParameters.id, JSON.parse(body));
      case 'DELETE /perfumes/{id}':
        return await deletePerfume(pathParameters.id);
      case 'GET /collections':
        return await getCollections(queryStringParameters);
      case 'POST /collections':
        return await createCollection(JSON.parse(body));
      case 'PUT /collections/{id}':
        return await updateCollection(pathParameters.id, JSON.parse(body));
      case 'DELETE /collections/{id}':
        return await deleteCollection(pathParameters.id);
      case 'POST /recommendations':
        return await getRecommendations(JSON.parse(body));
      case 'POST /analyze-photo':
        return await analyzePhoto(body ? JSON.parse(body) : {});
      default:
        return {
          statusCode: 404,
          headers: getHeaders(),
          body: JSON.stringify({ error: 'Not Found', path: resource })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

function getHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  };
}

function getCurrentUser(event) {
  const claims = event?.requestContext?.authorizer?.claims || {};
  let tokenClaims = {};

  if (!claims.sub) {
    const authorization = event?.headers?.Authorization || event?.headers?.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization;
    const payload = token.split('.')[1];

    if (payload) {
      try {
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        tokenClaims = JSON.parse(Buffer.from(normalized, 'base64').toString('utf8'));
      } catch {}
    }
  }

  const mergedClaims = { ...tokenClaims, ...claims };
  const userId = mergedClaims.sub;

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    email: mergedClaims.email || '',
    name: mergedClaims.name || mergedClaims['cognito:username'] || mergedClaims.email?.split('@')[0] || 'Fragrance fan'
  };
}

function extractJson(text) {
  // Clean up common problematic characters from LLM responses
  const clean = str => str
    .replace(/[\u2018\u2019]/g, "'")    // smart single quotes
    .replace(/[\u201C\u201D]/g, '"')    // smart double quotes  
    .replace(/\u2014|\u2013/g, '-')     // em/en dashes
    .replace(/\u2026/g, '...')          // ellipsis
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ''); // control chars

  const cleaned = clean(text);

  // Try direct parse first
  try { return JSON.parse(cleaned); } catch {}

  // Try extracting JSON array
  const arrStart = cleaned.indexOf('[');
  const arrEnd = cleaned.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd > arrStart) {
    try { return JSON.parse(cleaned.substring(arrStart, arrEnd + 1)); } catch {}
  }

  // Try extracting JSON object
  const objStart = cleaned.indexOf('{');
  const objEnd = cleaned.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    try { return JSON.parse(cleaned.substring(objStart, objEnd + 1)); } catch {}
  }

  throw new Error('Could not extract valid JSON from Bedrock response');
}

function normalizeNotes(notes) {
  return {
    top: Array.isArray(notes?.top) ? notes.top.slice(0, 5) : [],
    middle: Array.isArray(notes?.middle) ? notes.middle.slice(0, 5) : [],
    base: Array.isArray(notes?.base) ? notes.base.slice(0, 5) : []
  };
}

async function getPerfumes(queryParams) {
  // For now, return mock data. Later this will query DynamoDB
  let perfumes = [...mockPerfumes];

  // Apply filters
  if (queryParams) {
    if (queryParams.search) {
      const searchTerm = queryParams.search.toLowerCase();
      perfumes = perfumes.filter(perfume =>
        perfume.name.toLowerCase().includes(searchTerm) ||
        perfume.brand.toLowerCase().includes(searchTerm) ||
        perfume.notes.top.some(note => note.toLowerCase().includes(searchTerm)) ||
        perfume.notes.middle.some(note => note.toLowerCase().includes(searchTerm)) ||
        perfume.notes.base.some(note => note.toLowerCase().includes(searchTerm))
      );
    }

    if (queryParams.category) {
      perfumes = perfumes.filter(p => p.category === queryParams.category);
    }

    if (queryParams.brand) {
      perfumes = perfumes.filter(p => p.brand === queryParams.brand);
    }

    if (queryParams.gender) {
      perfumes = perfumes.filter(p => p.gender === queryParams.gender);
    }

    if (queryParams.minPrice) {
      perfumes = perfumes.filter(p => p.price >= parseInt(queryParams.minPrice));
    }

    if (queryParams.maxPrice) {
      perfumes = perfumes.filter(p => p.price <= parseInt(queryParams.maxPrice));
    }

    if (queryParams.inStock !== undefined) {
      perfumes = perfumes.filter(p => p.inStock === (queryParams.inStock === 'true'));
    }
  }

  // Apply sorting
  if (queryParams && queryParams.sort) {
    switch (queryParams.sort) {
      case 'price_asc':
        perfumes.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        perfumes.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        perfumes.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        perfumes.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }

  // Apply pagination
  const page = parseInt(queryParams?.page) || 1;
  const limit = parseInt(queryParams?.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPerfumes = perfumes.slice(startIndex, endIndex);

  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify({
      data: paginatedPerfumes,
      total: perfumes.length,
      page,
      limit,
      totalPages: Math.ceil(perfumes.length / limit)
    })
  };
}

async function getPerfume(id) {
  const perfume = mockPerfumes.find(p => p.id === id);

  if (!perfume) {
    return {
      statusCode: 404,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Perfume not found' })
    };
  }

  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify({ data: perfume })
  };
}

async function getPerfumeReviews(perfumeId) {
  if (!REVIEWS_TABLE) {
    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify({ data: [], summary: { averageRating: 0, reviewCount: 0 } })
    };
  }

  const result = await dynamoDB.query({
    TableName: REVIEWS_TABLE,
    IndexName: 'PerfumeCreatedIndex',
    KeyConditionExpression: 'perfumeId = :perfumeId',
    ExpressionAttributeValues: {
      ':perfumeId': perfumeId
    },
    ScanIndexForward: false
  }).promise();

  const reviews = result.Items || [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? Number((reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount).toFixed(1))
    : 0;

  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify({
      data: reviews,
      summary: { averageRating, reviewCount }
    })
  };
}

async function upsertPerfumeReview(perfumeId, reviewData, event) {
  const user = getCurrentUser(event);

  if (!user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Sign in to write a review' })
    };
  }

  const rating = Number(reviewData.rating);
  const title = String(reviewData.title || '').trim().slice(0, 80);
  const body = String(reviewData.body || '').trim().slice(0, 1200);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      statusCode: 400,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Rating must be between 1 and 5' })
    };
  }

  if (body.length < 10) {
    return {
      statusCode: 400,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Review must be at least 10 characters' })
    };
  }

  const now = new Date().toISOString();
  const reviewId = `${perfumeId}#${user.id}`;

  const existing = REVIEWS_TABLE ? await dynamoDB.get({
    TableName: REVIEWS_TABLE,
    Key: { id: reviewId }
  }).promise() : {};

  const review = {
    id: reviewId,
    perfumeId,
    userId: user.id,
    userName: user.name,
    rating,
    title,
    body,
    createdAt: existing.Item?.createdAt || now,
    updatedAt: now
  };

  if (REVIEWS_TABLE) {
    await dynamoDB.put({
      TableName: REVIEWS_TABLE,
      Item: review
    }).promise();
  }

  return {
    statusCode: existing.Item ? 200 : 201,
    headers: getHeaders(),
    body: JSON.stringify({ data: review })
  };
}

async function createPerfume(perfumeData) {
  const newPerfume = {
    id: uuidv4(),
    ...perfumeData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // TODO: Save to DynamoDB

  return {
    statusCode: 201,
    headers: getHeaders(),
    body: JSON.stringify({ data: newPerfume })
  };
}

async function updatePerfume(id, updates) {
  const perfumeIndex = mockPerfumes.findIndex(p => p.id === id);

  if (perfumeIndex === -1) {
    return {
      statusCode: 404,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Perfume not found' })
    };
  }

  mockPerfumes[perfumeIndex] = {
    ...mockPerfumes[perfumeIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify({ data: mockPerfumes[perfumeIndex] })
  };
}

async function deletePerfume(id) {
  const perfumeIndex = mockPerfumes.findIndex(p => p.id === id);

  if (perfumeIndex === -1) {
    return {
      statusCode: 404,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Perfume not found' })
    };
  }

  mockPerfumes.splice(perfumeIndex, 1);

  return {
    statusCode: 204,
    headers: getHeaders(),
    body: ''
  };
}

// Collection functions
async function getCollections(queryParams) {
  // TODO: Query DynamoDB for collections
  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify({ data: [] })
  };
}

async function createCollection(collectionData) {
  const newCollection = {
    id: uuidv4(),
    ...collectionData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // TODO: Save to DynamoDB

  return {
    statusCode: 201,
    headers: getHeaders(),
    body: JSON.stringify({ data: newCollection })
  };
}

async function updateCollection(id, updates) {
  // TODO: Update in DynamoDB
  return {
    statusCode: 200,
    headers: getHeaders(),
    body: JSON.stringify({ data: { id, ...updates } })
  };
}

async function deleteCollection(id) {
  // TODO: Delete from DynamoDB
  return {
    statusCode: 204,
    headers: getHeaders(),
    body: ''
  };
}

// Recommendation function
async function getRecommendations(requestBody) {
  const { query } = requestBody;

  if (!query) {
    return {
      statusCode: 400,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'query is required' })
    };
  }

  // ── Step 1: Pre-filter catalog using keyword scoring ──────────────────────
  // This acts as a lightweight "retrieval" step before sending to the LLM,
  // ensuring we pass the most relevant candidates rather than the full catalog.
  const queryLower = query.toLowerCase();

  // Fragrance family / accord keyword maps for semantic pre-matching
  const scentKeywords = {
    sweet: ['gourmand', 'vanilla', 'praline', 'caramel', 'honey', 'tonka', 'chocolate'],
    fresh: ['fresh', 'citrus', 'aquatic', 'green', 'bergamot', 'mint', 'tea'],
    woody: ['woody', 'cedar', 'sandalwood', 'vetiver', 'oud', 'patchouli', 'guaiac'],
    floral: ['floral', 'rose', 'jasmine', 'iris', 'violet', 'tuberose', 'orange blossom'],
    spicy: ['spicy', 'pepper', 'cardamom', 'cinnamon', 'saffron', 'ginger', 'clove'],
    oriental: ['oriental', 'amber', 'musk', 'incense', 'resin', 'balsamic', 'warm'],
    smoky: ['smoky', 'leather', 'tobacco', 'birch', 'tar', 'incense'],
    fruity: ['fruity', 'pineapple', 'apple', 'peach', 'raspberry', 'blackcurrant', 'pear'],
    creamy: ['creamy', 'milky', 'soft', 'smooth', 'powdery', 'velvety', 'cashmeran'],
    luxurious: ['niche', 'luxury', 'luxurious', 'premium', 'exclusive', 'refined', 'sophisticated'],
    masculine: ['masculine', 'men', 'male', 'manly', 'virile', 'bold'],
    feminine: ['feminine', 'women', 'female', 'delicate', 'elegant', 'graceful'],
    summer: ['summer', 'beach', 'hot', 'tropical', 'fresh', 'light'],
    winter: ['winter', 'cold', 'cozy', 'warm', 'heavy', 'rich', 'dark'],
    office: ['office', 'work', 'professional', 'subtle', 'clean', 'inoffensive'],
    date: ['date', 'romantic', 'seductive', 'sensual', 'evening', 'night'],
  };

  // Score each perfume for relevance to the query
  const scored = mockPerfumes.map(p => {
    let score = 0;
    const perfumeText = [
      p.name, p.brand, p.category, p.gender, p.description,
      ...(p.notes?.top || []), ...(p.notes?.middle || []), ...(p.notes?.base || []),
      ...(p.accords?.map(a => a.name) || []),
      ...(p.seasons || []), ...(p.occasions || [])
    ].join(' ').toLowerCase();

    // Direct keyword match
    queryLower.split(/\s+/).forEach(word => {
      if (word.length > 2 && perfumeText.includes(word)) score += 3;
    });

    // Semantic keyword expansion
    Object.entries(scentKeywords).forEach(([concept, keywords]) => {
      const queryMentionsConcept = keywords.some(k => queryLower.includes(k)) || queryLower.includes(concept);
      if (queryMentionsConcept) {
        const perfumeHasConcept = keywords.some(k => perfumeText.includes(k));
        if (perfumeHasConcept) score += 5;
      }
    });

    // Boost by rating
    score += (p.rating || 0) * 0.5;

    return { perfume: p, score };
  }).sort((a, b) => b.score - a.score);

  // Take top 15 candidates to send to LLM (not all 42 — keeps prompt focused)
  const candidates = scored.slice(0, 15).map(s => ({
    id: s.perfume.id,
    brand: s.perfume.brand,
    name: s.perfume.name,
    category: s.perfume.category,
    gender: s.perfume.gender,
    price: s.perfume.price,
    rating: s.perfume.rating,
    concentration: s.perfume.concentration,
    longevity: s.perfume.longevity,
    sillage: s.perfume.sillage,
    notes: s.perfume.notes,
    accords: s.perfume.accords?.map(a => a.name),
    description: s.perfume.description,
    seasons: s.perfume.seasons,
    occasions: s.perfume.occasions,
    image: s.perfume.image
  }));

  // ── Step 2: LLM reranking with luxury consultant persona ──────────────────
  const prompt = `You are an elite fragrance consultant at a luxury perfume house — think Harrods fragrance floor or a Parisian niche boutique. You have encyclopedic knowledge of fragrance families, note pyramids, accords, scent DNA, and the emotional language of perfumery.

A client has told you: "${query}"

You have pre-selected these candidate fragrances from the collection:
${JSON.stringify(candidates, null, 2)}

Your task: Select the 3 best matches and explain them with the depth and warmth of a true fragrance expert.

Return ONLY a valid JSON array with exactly 3 objects. Each object must have this exact shape:
{
  "id": "rec1",
  "perfume": { <copy the full perfume object from candidates exactly as-is> },
  "reason": "<3-4 sentences written as a luxury consultant — explain the scent DNA match, describe how it smells, why it fits the client's request emotionally and olfactively, mention specific notes and accords, describe projection and longevity, suggest occasion and season>",
  "confidence": <0.75 to 0.98>
}

Consultant guidelines:
- Understand the INTENT behind the query, not just keywords. "Something like Sauvage but sweeter" means: keep the ambroxan/woody DNA, reduce the sharp pepper, add warmth and creaminess.
- Reference specific notes and accords when explaining. Don't say "this is a nice fragrance." Say "the interplay of tonka bean and cashmeran creates a skin-close warmth that feels more intimate than Sauvage's aggressive projection."
- Describe the emotional vibe: confidence, romance, mystery, freshness, comfort.
- Mention when to wear it: morning commute, candlelit dinner, winter evening, summer beach.
- If the client mentions a reference fragrance, explain how your recommendation relates to it structurally.
- Rank by best match first. confidence 0.95+ = near-perfect match, 0.85 = excellent, 0.75 = good alternative.
- Return JSON only. No markdown, no preamble.`;

  try {
    const bedrockResponse = await bedrockRuntime.invokeModel({
      modelId: BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 4000,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }]
      })
    }).promise();

    const decoded = JSON.parse(Buffer.from(bedrockResponse.body || bedrockResponse.Body).toString('utf-8'));
    const text = decoded.content?.find(item => item.type === 'text')?.text || '';
    console.log('Bedrock raw response (first 500 chars):', text.substring(0, 500));
    const recommendations = extractJson(text);
    const list = Array.isArray(recommendations) ? recommendations : recommendations.recommendations || [];

    // Ensure perfume objects have images from catalog
    const enriched = list.slice(0, 3).map(rec => {
      const catalogMatch = mockPerfumes.find(p => p.id === rec.perfume?.id);
      return {
        ...rec,
        perfume: catalogMatch || rec.perfume
      };
    });

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify({ recommendations: enriched })
    };
  } catch (error) {
    console.error('Bedrock recommendations failed:', error);

    // Fallback: return top scored candidates with descriptive reasons
    const fallback = scored.slice(0, 3).map((item, i) => ({
      id: `rec${i + 1}`,
      perfume: item.perfume,
      reason: `${item.perfume.brand} ${item.perfume.name} is a ${item.perfume.category} fragrance with ${[...(item.perfume.notes?.top || []), ...(item.perfume.notes?.middle || [])].slice(0, 3).join(', ')} — a strong match for your preference.`,
      confidence: Math.max(0.72, 0.88 - i * 0.06)
    }));

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify({ recommendations: fallback })
    };
  }
}

async function analyzePhoto(requestBody) {
  const { imageBase64, mimeType = 'image/jpeg' } = requestBody || {};

  if (!imageBase64) {
    return {
      statusCode: 400,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'imageBase64 is required' })
    };
  }

  if (imageBase64.length > 5_500_000) {
    return {
      statusCode: 413,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Image too large. Please upload an image under 4MB.' })
    };
  }

  const prompt = `You are a world-class perfume expert with encyclopedic knowledge of all fragrances — designer, niche, and drugstore.

Analyze this perfume bottle image carefully. Read the label text precisely.

CRITICAL: If you can identify the perfume, return ONLY its ACTUAL documented notes from your knowledge. Do NOT guess or invent notes. If you know the perfume, you know its exact notes from Fragrantica or official brand sources.

Return ONLY a JSON object with this exact structure (no extra text, no markdown):
{
  "identified": true,
  "brand": "exact brand name from label",
  "name": "exact perfume name from label",
  "concentration": "EDT / EDP / Parfum / EDC",
  "tier": "designer" or "niche" or "drugstore" or "unknown",
  "realNotes": {
    "top": ["exact note 1", "exact note 2", "exact note 3"],
    "middle": ["exact note 1", "exact note 2"],
    "base": ["exact note 1", "exact note 2", "exact note 3"]
  },
  "scentProfile": "2-sentence description of how it actually smells based on its real notes",
  "accords": ["main accord 1", "main accord 2", "main accord 3"],
  "confidence": 0.95,
  "hasDupes": true,
  "dupes": [
    {
      "brand": "dupe brand",
      "name": "dupe name",
      "price": "$XX",
      "reason": "why it smells similar — reference specific shared notes"
    }
  ],
  "similarProfiles": [
    {
      "brand": "brand",
      "name": "perfume name",
      "reason": "shares specific notes or DNA"
    }
  ]
}

Rules:
- Read the label text EXACTLY. Do not guess from bottle shape or color.
- realNotes MUST be the ACTUAL documented notes of THIS SPECIFIC perfume you identified — not notes from a different perfume by the same brand.
- Every perfume has unique notes. Lattafa Dynasty, Lattafa Raghaid, Lattafa Oud For Glory are all different perfumes with completely different notes. Return the notes for the exact perfume name you read on the label.
- If you are not certain of the exact notes, lower the confidence score but still give your best knowledge.
- If it is an affordable/designer fragrance, hasDupes should be true and list 3-5 dupes under $50.
- If it is niche/luxury, hasDupes may be false — list similar scent profiles instead.
- confidence: 0.9+ means certain identification, 0.7-0.9 means fairly sure, below 0.7 means uncertain.
- If you cannot read the label, set identified to false.`;

  try {
    const bedrockResponse = await bedrockRuntime.invokeModel({
      modelId: BEDROCK_VISION_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: imageBase64
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      })
    }).promise();

    const responseBody = bedrockResponse.body || bedrockResponse.Body;
    const decoded = JSON.parse(Buffer.from(responseBody).toString('utf-8'));
    const text = decoded.content?.find(item => item.type === 'text')?.text || '';
    const analysis = extractJson(text);

    const notes = normalizeNotes(analysis.realNotes || analysis.generatedNotes || analysis.notes);

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify({
        data: {
          identified: analysis.identified !== false,
          brand: analysis.brand || null,
          name: analysis.name || null,
          concentration: analysis.concentration || null,
          tier: analysis.tier || 'unknown',
          notes,
          scentProfile: analysis.scentProfile || analysis.profile || '',
          accords: Array.isArray(analysis.accords) ? analysis.accords : [],
          confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 0.8,
          hasDupes: analysis.hasDupes === true,
          dupes: Array.isArray(analysis.dupes) ? analysis.dupes.slice(0, 5) : [],
          similarProfiles: Array.isArray(analysis.similarProfiles) ? analysis.similarProfiles.slice(0, 3) : []
        }
      })
    };
  } catch (error) {
    console.error('Bedrock photo analysis failed:', error);
    return {
      statusCode: 502,
      headers: getHeaders(),
      body: JSON.stringify({
        error: 'Bedrock photo analysis failed',
        details: error.message
      })
    };
  }
}
