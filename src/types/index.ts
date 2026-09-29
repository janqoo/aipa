// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Perfume types
export type ScentFamily = 
  | 'floral' 
  | 'woody' 
  | 'fresh' 
  | 'oriental' 
  | 'gourmand' 
  | 'chypre' 
  | 'fougere';

export type Gender = 'men' | 'women' | 'unisex';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type Occasion = 
  | 'casual' 
  | 'office' 
  | 'evening' 
  | 'date' 
  | 'formal' 
  | 'sport' 
  | 'special';

export type Longevity = 
  | 'very-weak' 
  | 'weak' 
  | 'moderate' 
  | 'long-lasting' 
  | 'eternal';

export type Sillage = 
  | 'intimate' 
  | 'moderate' 
  | 'strong' 
  | 'enormous';

export type Concentration = 
  | 'parfum' 
  | 'edp' 
  | 'edt' 
  | 'edc' 
  | 'edm';

export interface FragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Accord {
  name: string;
  intensity: number;
  color: string;
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  category: ScentFamily;
  notes: FragranceNotes;
  accords?: Accord[];
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  gender: Gender;
  seasons: Season[];
  occasions: Occasion[];
  longevity: Longevity;
  sillage: Sillage;
  concentration: Concentration;
  releaseYear: number;
  perfumer?: string;
  size: number; // in ml
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// Collection types (renamed from ReadingList)
export interface PerfumeCollection {
  id: string;
  userId: string;
  name: string;
  description: string;
  perfumeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PerfumeReview {
  id: string;
  perfumeId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  reviewCount: number;
}

// Recommendation types
export interface Recommendation {
  id: string;
  perfumeId: string;
  reason: string;
  confidence: number; // 0-1
  perfume?: Perfume;
  aiPerfume?: {
    name: string;
    brand: string;
    description: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter types
export interface PerfumeFilters {
  search?: string;
  category?: ScentFamily;
  brand?: string;
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  seasons?: Season[];
  occasions?: Occasion[];
  longevity?: Longevity[];
  sillage?: Sillage[];
  concentration?: Concentration[];
  inStock?: boolean;
}

// Sort types
export type SortOption = 
  | 'name' 
  | 'brand' 
  | 'price-low' 
  | 'price-high' 
  | 'rating' 
  | 'newest' 
  | 'popular';

// User preferences
export interface UserPreferences {
  userId: string;
  preferredScents: ScentFamily[];
  preferredGenders: Gender[];
  preferredOccasions: Occasion[];
  preferredSeasons: Season[];
  budgetMin: number;
  budgetMax: number;
  dislikedNotes: string[];
  likedPerfumes: string[];
  dislikedPerfumes: string[];
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Component prop types
export interface PerfumeCardProps {
  perfume: Perfume;
  onAddToCollection?: (perfume: Perfume) => void;
  onToggleFavorite?: (perfumeId: string) => void;
  isFavorite?: boolean;
}

export interface PerfumeGridProps {
  perfumes: Perfume[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Constants
export const SCENT_FAMILIES: Record<ScentFamily, string> = {
  floral: 'Floral',
  woody: 'Woody',
  fresh: 'Fresh',
  oriental: 'Oriental',
  gourmand: 'Gourmand',
  chypre: 'Chypre',
  fougere: 'Fougère'
};

export const GENDERS: Record<Gender, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex'
};

export const SEASONS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter'
};

export const OCCASIONS: Record<Occasion, string> = {
  casual: 'Casual',
  office: 'Office',
  evening: 'Evening',
  date: 'Date',
  formal: 'Formal',
  sport: 'Sport',
  special: 'Special'
};

export const LONGEVITY_LEVELS: Record<Longevity, string> = {
  'very-weak': 'Very Weak (< 1h)',
  'weak': 'Weak (1-2h)',
  'moderate': 'Moderate (3-5h)',
  'long-lasting': 'Long Lasting (6-8h)',
  'eternal': 'Eternal (8h+)'
};

export const SILLAGE_LEVELS: Record<Sillage, string> = {
  'intimate': 'Intimate',
  'moderate': 'Moderate',
  'strong': 'Strong',
  'enormous': 'Enormous'
};

export const CONCENTRATIONS: Record<Concentration, string> = {
  'parfum': 'Parfum (20-40%)',
  'edp': 'Eau de Parfum (15-20%)',
  'edt': 'Eau de Toilette (5-15%)',
  'edc': 'Eau de Cologne (2-5%)',
  'edm': 'Eau de Mist (1-3%)'
};
