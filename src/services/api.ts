import { fetchAuthSession } from 'aws-amplify/auth';
import { 
  Perfume, 
  PerfumeCollection, 
  PerfumeReview,
  ReviewSummary,
  Recommendation, 
  PerfumeFilters, 
  SortOption,
  ApiResponse 
} from '../types';
import { mockPerfumes, mockCollections } from './mockData';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE_URL = ['none', 'null', 'undefined', ''].includes(rawApiBaseUrl.trim().toLowerCase())
  ? ''
  : rawApiBaseUrl.trim();

if (!API_BASE_URL && rawApiBaseUrl.trim()) {
  console.warn(`VITE_API_BASE_URL value "${rawApiBaseUrl}" is treated as unset. Set a real backend URL or remove the placeholder from .env.local.`);
}

const scentSynonymMap: Record<string, string> = {
  oud: 'oud',
  oudh: 'oud',
  agarwood: 'oud',
  agar: 'oud',
  incense: 'oriental',
  resin: 'oriental',
  amber: 'oriental',
  leather: 'oriental',
  smoky: 'oriental',
  patchouli: 'woody',
  cedar: 'woody',
  sandalwood: 'woody',
  vetiver: 'woody',
  rose: 'floral',
  jasmine: 'floral',
  vanilla: 'gourmand',
  caramel: 'gourmand',
  honey: 'gourmand',
  citrus: 'citrus',
  bergamot: 'citrus',
  lemon: 'citrus',
  mandarin: 'citrus',
  fruity: 'fruity',
  fresh: 'fresh',
  marine: 'fresh',
  aquatic: 'fresh',
};

const categoryCues: Record<string, string[]> = {
  woody: ['woody', 'wood', 'cedar', 'sandalwood', 'vetiver', 'patchouli'],
  fresh: ['fresh', 'aquatic', 'marine', 'ozonic', 'clean'],
  floral: ['floral', 'flower', 'rose', 'jasmine', 'lily', 'lavender'],
  gourmand: ['gourmand', 'sweet', 'vanilla', 'caramel', 'honey', 'chocolate'],
  oriental: ['oriental', 'amber', 'incense', 'resin', 'oud', 'oudh', 'agarwood', 'leather', 'smoky'],
  fruity: ['fruity', 'citrus', 'berry', 'apple', 'pear', 'peach', 'mandarin'],
  spicy: ['spicy', 'pepper', 'cinnamon', 'ginger', 'clove'],
};

const seasonKeywords: Record<string, string[]> = {
  spring: ['spring'],
  summer: ['summer'],
  autumn: ['autumn', 'fall'],
  winter: ['winter'],
};

const occasionKeywords: Record<string, string[]> = {
  date: ['date', 'romantic', 'love', 'intimate'],
  evening: ['evening', 'night', 'night out'],
  casual: ['casual', 'everyday', 'daily', 'weekend'],
  office: ['office', 'work', 'business', 'meeting'],
  formal: ['formal', 'special', 'party', 'wedding', 'gala'],
  travel: ['travel', 'vacation', 'holiday'],
};

const genderKeywords: Record<string, string[]> = {
  men: ['men', 'man', 'male', 'masculine'],
  women: ['women', 'woman', 'female', 'feminine'],
  unisex: ['unisex', 'genderless'],
};

const luxuryKeywords = ['luxury', 'niche', 'designer', 'premium', 'expensive', 'exclusive', 'top end', 'statement', 'opulent', 'elegant'];
const budgetKeywords = ['budget', 'affordable', 'cheap', 'value', 'inexpensive', 'everyday', 'daily', 'under 100', 'under 80', 'under 50'];
const performanceKeywords = ['long lasting', 'long-lasting', 'longlasting', 'sillage', 'projection', 'strong', 'soft', 'subtle', 'light'];

const moodKeywords: Record<string, string[]> = {
  romantic: ['romantic', 'intimate', 'love', 'date'],
  confident: ['confident', 'bold', 'powerful', 'statement'],
  cozy: ['cozy', 'warm', 'comfort', 'snug'],
  fresh: ['bright', 'clean', 'energized', 'invigorating'],
};

type QueryIntent = {
  brands: string[];
  names: string[];
  styles: string[];
  notes: string[];
  seasons: string[];
  occasions: string[];
  genders: string[];
  luxury: boolean;
  budget: boolean;
  moods: string[];
  performance: boolean;
};

type PerfumesResponse = ApiResponse<Perfume[]> & {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

type RecommendationResponse = ApiResponse<Recommendation[]> & {
  recommendations?: Recommendation[];
};

type ReviewsResponse = ApiResponse<PerfumeReview[]> & {
  summary?: ReviewSummary;
};

function extractQueryIntent(query: string): QueryIntent {
  const normalized = query.toLowerCase();
  const tokens = normalized
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const brandCandidates = Array.from(new Set(mockPerfumes.map((perfume) => perfume.brand.toLowerCase())))
    .filter((brand) => brand && normalized.includes(brand));

  const nameCandidates = Array.from(new Set(mockPerfumes.map((perfume) => perfume.name.toLowerCase())))
    .filter((name) => name && normalized.includes(name));

  const styles = Object.keys(categoryCues).filter((style) =>
    categoryCues[style].some((keyword) => normalized.includes(keyword))
  );

  const seasons = Object.keys(seasonKeywords).filter((season) =>
    seasonKeywords[season].some((keyword) => normalized.includes(keyword))
  );

  const occasions = Object.keys(occasionKeywords).filter((occasion) =>
    occasionKeywords[occasion].some((keyword) => normalized.includes(keyword))
  );

  const genders = Object.keys(genderKeywords).filter((gender) =>
    genderKeywords[gender].some((keyword) => normalized.includes(keyword))
  );

  const notes = tokens
    .map((token) => scentSynonymMap[token] || token.replace(/s$/, ''))
    .filter((token) => token.length >= 3 && !stopWords.has(token));

  const luxury = luxuryKeywords.some((keyword) => normalized.includes(keyword));
  const budget = budgetKeywords.some((keyword) => normalized.includes(keyword));
  const performance = performanceKeywords.some((keyword) => normalized.includes(keyword));
  const moods = Object.keys(moodKeywords).filter((mood) =>
    moodKeywords[mood].some((keyword) => normalized.includes(keyword))
  );

  return {
    brands: brandCandidates,
    names: nameCandidates,
    styles,
    notes: Array.from(new Set(notes)),
    seasons,
    occasions,
    genders,
    luxury,
    budget,
    moods,
    performance,
  };
}

function scorePerfumeAgainstIntent(perfume: Perfume, intent: QueryIntent, normalizedQuery: string) {
  const searchableText = [
    perfume.name,
    perfume.brand,
    perfume.category,
    perfume.description,
    ...(perfume.notes.top || []),
    ...(perfume.notes.middle || []),
    ...(perfume.notes.base || []),
    ...(perfume.seasons || []),
    ...(perfume.occasions || []),
    ...(perfume.accords || []).map((accord) => accord.name),
  ]
    .join(' ')
    .toLowerCase();

  let score = 0;
  const matches = new Set<string>();
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  if (intent.names.includes(perfume.name.toLowerCase())) {
    score += 18;
    matches.add(perfume.name);
  }

  if (intent.brands.some((brand) => perfume.brand.toLowerCase() === brand)) {
    score += 14;
    matches.add(perfume.brand);
  }

  if (intent.styles.includes(perfume.category.toLowerCase())) {
    score += 12;
    matches.add(perfume.category);
  }

  intent.notes.forEach((note) => {
    if (searchableText.includes(note)) {
      score += 5;
      matches.add(note);
    }
  });

  if (intent.seasons.some((season) => perfume.seasons.map((s) => s.toLowerCase()).includes(season))) {
    score += 8;
    matches.add('season');
  }

  if (intent.occasions.some((occasion) =>
    perfume.occasions.some((perfumeOccasion) => perfumeOccasion.toLowerCase().includes(occasion))
  )) {
    score += 8;
    matches.add('occasion');
  }

  if (intent.genders.some((gender) => perfume.gender.toLowerCase() === gender)) {
    score += 6;
    matches.add(perfume.gender);
  }

  if (intent.luxury && perfume.price <= 100) {
    score -= 3;
  }

  if (intent.luxury && perfume.price > 200) {
    score += 7;
    matches.add('luxury');
  }

  if (intent.budget && perfume.price <= 100) {
    score += 6;
    matches.add('budget-friendly');
  }

  if (intent.performance) {
    if (perfume.longevity || perfume.sillage) {
      score += 5;
      matches.add('performance');
    }
  }

  if (intent.moods.length > 0) {
    intent.moods.forEach((mood) => {
      if (searchableText.includes(mood)) {
        score += 4;
        matches.add(mood);
      }
    });
  }

  queryTokens.forEach((term) => {
    if (searchableText.includes(term)) {
      score += 1;
    }
  });

  score += Math.min(2, Math.max(0, (perfume.rating - 3) * 0.5));

  return {
    score,
    matches: Array.from(matches),
  };
}

const stopWords = new Set([
  'ok', 'give', 'me', 'best', 'please', 'find', 'show', 'recommend', 'recommendation', 'recommendations', 'perfume', 'perfumes', 'line', 'set', 'collection', 'top', 'new', 'year', 'like', 'want', 'need', 'for', 'the', 'a', 'an', 'and', 'of', 'with', 'in', 'on', 'to', 'my', 'your', 'is', 'are', 'it'
]);

function normalizeQueryTerms(query: string): string[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => scentSynonymMap[token] || token.replace(/s$/, ''))
    .filter((token) => token.length >= 3 && !stopWords.has(token));

  return Array.from(new Set(tokens));
}

function getLocalRecommendations(query: string): Recommendation[] {
  const normalizedQuery = (query || '').toString().trim().toLowerCase();
  const queryTerms = normalizeQueryTerms(normalizedQuery);
  const intent = extractQueryIntent(normalizedQuery);

  if (normalizedQuery && queryTerms.length === 0 && intent.brands.length === 0 && intent.styles.length === 0) {
    const fallback = mockPerfumes
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
      .map((perfume) => ({
        id: perfume.id,
        perfumeId: perfume.id,
        perfume,
        confidence: 0.75,
        reason: `No direct scent keywords were detected in "${query}"; here are high-rated fragrances that may still fit your search.`
      }));
    return fallback;
  }

  const scoredRecommendations = mockPerfumes.map((perfume) => {
    const { score, matches } = scorePerfumeAgainstIntent(perfume, intent, normalizedQuery);

    return {
      perfume,
      score,
      matches,
    };
  });

  const recommendations = scoredRecommendations
    .sort((a, b) => b.score - a.score || b.perfume.rating - a.perfume.rating)
    .slice(0, 3)
    .map((item) => ({
      id: item.perfume.id,
      perfumeId: item.perfume.id,
      perfume: item.perfume,
      confidence: Math.min(0.95, Math.max(0.65, 0.6 + item.score * 0.035)),
      reason: item.matches.length > 0
        ? `Based on your query "${query}", ${item.perfume.name} by ${item.perfume.brand} aligns with ${item.matches.slice(0, 3).join(', ')}.`
        : `Based on your query "${query}", ${item.perfume.name} by ${item.perfume.brand} is one of our highest-rated matches.`
    }));

  return recommendations;
}

function sortPerfumes(perfumes: Perfume[], sort?: SortOption): Perfume[] {
  const sorted = [...perfumes];

  switch (sort) {
    case 'brand':
      return sorted.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.releaseYear - a.releaseYear);
    case 'popular':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'name':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function filterPerfumes(perfumes: Perfume[], filters?: PerfumeFilters): Perfume[] {
  if (!filters) return perfumes;

  return perfumes.filter((perfume) => {
    const searchText = [
      perfume.name,
      perfume.brand,
      perfume.category,
      perfume.description,
      ...perfume.notes.top,
      ...perfume.notes.middle,
      ...perfume.notes.base,
    ].join(' ').toLowerCase();

    if (filters.search && !searchText.includes(filters.search.toLowerCase())) return false;
    if (filters.category && perfume.category !== filters.category) return false;
    if (filters.brand && perfume.brand !== filters.brand) return false;
    if (filters.gender && perfume.gender !== filters.gender) return false;
    if (filters.minPrice !== undefined && perfume.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && perfume.price > filters.maxPrice) return false;
    if (filters.inStock !== undefined && perfume.inStock !== filters.inStock) return false;
    if (filters.seasons?.length && !filters.seasons.some((season) => perfume.seasons.includes(season))) return false;
    if (filters.occasions?.length && !filters.occasions.some((occasion) => perfume.occasions.includes(occasion))) return false;

    return true;
  });
}

function getLocalPerfumes(
  filters?: PerfumeFilters,
  sort?: SortOption,
  page = 1,
  limit = 20
): Perfume[] {
  const filtered = filterPerfumes(mockPerfumes, filters);
  const sorted = sortPerfumes(filtered, sort);
  const startIndex = (page - 1) * limit;

  return sorted.slice(startIndex, startIndex + limit);
}

function getLocalPerfume(id: string): Perfume {
  const perfume = mockPerfumes.find((item) => item.id === id);
  if (!perfume) {
    throw new Error('Perfume not found');
  }
  return perfume;
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  } catch (error) {
    return {
      'Content-Type': 'application/json',
    };
  }
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = await getAuthHeaders();

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = [errorData.message, errorData.error, errorData.details]
        .filter(Boolean)
        .join(': ');
      throw new Error(message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Helper function for cached GET requests
async function cachedGet<T>(endpoint: string, cacheKey: string): Promise<T> {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await apiRequest<T>(endpoint);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

// Helper function to get mock data based on endpoint
function getMockData<T>(endpoint: string): T {
  if (endpoint.includes('/perfumes')) {
    return mockPerfumes as T;
  }
  if (endpoint.includes('/collections')) {
    return mockCollections as T;
  }
  throw new Error(`No mock data available for ${endpoint}`);
}

// Perfume API functions
export async function getPerfumes(
  filters?: PerfumeFilters,
  sort?: SortOption,
  page = 1,
  limit = 20
): Promise<Perfume[]> {
  const queryParams = new URLSearchParams();
  
  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.category) queryParams.append('category', filters.category);
  if (filters?.brand) queryParams.append('brand', filters.brand);
  if (filters?.gender) queryParams.append('gender', filters.gender);
  if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
  if (filters?.seasons?.length) queryParams.append('seasons', filters.seasons.join(','));
  if (filters?.occasions?.length) queryParams.append('occasions', filters.occasions.join(','));
  if (filters?.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString());
  if (sort) queryParams.append('sort', sort);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const endpoint = `/perfumes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const cacheKey = `perfumes-${queryParams.toString()}`;

  if (!API_BASE_URL) {
    return getLocalPerfumes(filters, sort, page, limit);
  }

  try {
    const response = await cachedGet<Perfume[] | PerfumesResponse>(endpoint, cacheKey);
    return Array.isArray(response) ? response : response.data ?? [];
  } catch (error) {
    console.warn('Perfumes API failed, using local catalog', error);
    return getLocalPerfumes(filters, sort, page, limit);
  }
}

export async function getPerfume(id: string): Promise<Perfume> {
  const endpoint = `/perfumes/${id}`;
  const cacheKey = `perfume-${id}`;

  if (!API_BASE_URL) {
    return getLocalPerfume(id);
  }

  try {
    const response = await cachedGet<Perfume | ApiResponse<Perfume>>(endpoint, cacheKey);
    return 'data' in response ? response.data : response;
  } catch (error) {
    console.warn('Perfume API failed, using local catalog', error);
    return getLocalPerfume(id);
  }
}

export async function getPerfumeReviews(
  perfumeId: string
): Promise<{ reviews: PerfumeReview[]; summary: ReviewSummary }> {
  if (!API_BASE_URL) {
    return { reviews: [], summary: { averageRating: 0, reviewCount: 0 } };
  }

  try {
    const response = await apiRequest<ReviewsResponse>(`/perfumes/${perfumeId}/reviews`);
    const reviews = Array.isArray(response.data) ? response.data : [];
    const summary = response.summary ?? {
      averageRating: reviews.length
        ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
        : 0,
      reviewCount: reviews.length,
    };

    return { reviews, summary };
  } catch (error) {
    console.warn('Reviews API failed', error);
    return { reviews: [], summary: { averageRating: 0, reviewCount: 0 } };
  }
}

export async function submitPerfumeReview(
  perfumeId: string,
  review: Pick<PerfumeReview, 'rating' | 'title' | 'body'>
): Promise<PerfumeReview> {
  const response = await apiRequest<ApiResponse<PerfumeReview>>(`/perfumes/${perfumeId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
  });

  return response.data;
}

// Collection API functions
export async function getCollections(): Promise<PerfumeCollection[]> {
  return apiRequest<PerfumeCollection[]>('/collections');
}

export async function createCollection(
  collection: Omit<PerfumeCollection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<PerfumeCollection> {
  return apiRequest<PerfumeCollection>('/collections', {
    method: 'POST',
    body: JSON.stringify(collection),
  });
}

export async function updateCollection(
  id: string,
  updates: Partial<PerfumeCollection>
): Promise<PerfumeCollection> {
  return apiRequest<PerfumeCollection>(`/collections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteCollection(id: string): Promise<void> {
  return apiRequest<void>(`/collections/${id}`, {
    method: 'DELETE',
  });
}

// Recommendation API functions
export async function getRecommendations(query: string): Promise<Recommendation[]> {
  const queryText = query?.toString().trim() || '';
  if (!queryText) {
    return getLocalRecommendations(queryText);
  }

  if (!API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not configured; using local recommendation matcher instead of remote AI backend.');
    return getLocalRecommendations(queryText);
  }

  const endpoint = '/recommendations';
  
  try {
    const response = await apiRequest<RecommendationResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ query: queryText }),
    });
    
    return Array.isArray(response.data) ? response.data : response.recommendations ?? [];
  } catch (error) {
    console.warn('Recommendations API failed, using local matcher', error);
    return getLocalRecommendations(queryText);
  }
}

export async function analyzePhoto(
  imageBase64: string,
  mimeType: string
): Promise<any> {
  return apiRequest<any>('/analyze-photo', {
    method: 'POST',
    body: JSON.stringify({ imageBase64, mimeType }),
  });
}

// Search API functions
export async function searchPerfumes(
  query: string,
  filters?: PerfumeFilters
): Promise<Perfume[]> {
  const searchFilters = { ...filters, search: query };
  return getPerfumes(searchFilters);
}

// Admin API functions (for future use)
export async function createPerfume(perfume: Omit<Perfume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Perfume> {
  const endpoint = '/admin/perfumes';
  
  return apiRequest<Perfume>(endpoint, {
    method: 'POST',
    body: JSON.stringify(perfume),
  });
}

export async function updatePerfume(id: string, updates: Partial<Perfume>): Promise<Perfume> {
  const endpoint = `/admin/perfumes/${id}`;
  
  return apiRequest<Perfume>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deletePerfume(id: string): Promise<void> {
  const endpoint = `/admin/perfumes/${id}`;
  
  return apiRequest<void>(endpoint, {
    method: 'DELETE',
  });
}

// Utility functions
export function clearCache(): void {
  cache.clear();
}

export function getCacheSize(): number {
  return cache.size;
}

// Export cache for debugging
export { cache };
