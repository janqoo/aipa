import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (perfumeId: string) => void;
  removeFromFavorites: (perfumeId: string) => void;
  isFavorite: (perfumeId: string) => boolean;
  toggleFavorite: (perfumeId: string) => void;
  clearFavorites: () => void;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load favorites from localStorage or API
  const loadFavorites = async () => {
    if (!isAuthenticated || !user) {
      // Load from localStorage for non-authenticated users
      const localFavorites = localStorage.getItem('perfume-favorites');
      if (localFavorites) {
        try {
          setFavorites(JSON.parse(localFavorites));
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error);
          setFavorites([]);
        }
      }
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Load favorites from API when backend is ready
      // For now, use localStorage
      const localFavorites = localStorage.getItem(`perfume-favorites-${user.id}`);
      if (localFavorites) {
        setFavorites(JSON.parse(localFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save favorites to localStorage or API
  const saveFavorites = async (newFavorites: string[]) => {
    if (!isAuthenticated || !user) {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('perfume-favorites', JSON.stringify(newFavorites));
      return;
    }

    try {
      // TODO: Save favorites to API when backend is ready
      // For now, use localStorage
      localStorage.setItem(`perfume-favorites-${user.id}`, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Add perfume to favorites
  const addToFavorites = (perfumeId: string) => {
    if (!favorites.includes(perfumeId)) {
      const newFavorites = [...favorites, perfumeId];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
    }
  };

  // Remove perfume from favorites
  const removeFromFavorites = (perfumeId: string) => {
    const newFavorites = favorites.filter(id => id !== perfumeId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // Check if perfume is in favorites
  const isFavorite = (perfumeId: string) => {
    return favorites.includes(perfumeId);
  };

  // Toggle favorite status
  const toggleFavorite = (perfumeId: string) => {
    if (isFavorite(perfumeId)) {
      removeFromFavorites(perfumeId);
    } else {
      addToFavorites(perfumeId);
    }
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    if (isAuthenticated && user) {
      localStorage.removeItem(`perfume-favorites-${user.id}`);
    } else {
      localStorage.removeItem('perfume-favorites');
    }
  };

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites();
  }, [user, isAuthenticated]);

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isLoading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

export default FavoritesContext;