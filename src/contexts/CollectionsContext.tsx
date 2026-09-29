import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { PerfumeCollection } from '../types';
import * as api from '../services/api';

const guestCollectionsKey = 'perfume-collections';

interface CollectionsContextType {
  collections: PerfumeCollection[];
  isLoading: boolean;
  error: string | null;
  createCollection: (name: string, description: string) => Promise<PerfumeCollection>;
  updateCollection: (id: string, updates: Partial<PerfumeCollection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addPerfumeToCollection: (collectionId: string, perfumeId: string) => Promise<void>;
  removePerfumeFromCollection: (collectionId: string, perfumeId: string) => Promise<void>;
  refreshCollections: () => Promise<void>;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

interface CollectionsProviderProps {
  children: ReactNode;
}

export function CollectionsProvider({ children }: CollectionsProviderProps) {
  const [collections, setCollections] = useState<PerfumeCollection[]>([]);
  const collectionsRef = useRef<PerfumeCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const getStorageKey = () => (
    isAuthenticated && user ? `perfume-collections-${user.id}` : guestCollectionsKey
  );

  const readStoredCollections = (): PerfumeCollection[] => {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch (err) {
      console.error('Error parsing collections from localStorage:', err);
      return [];
    }
  };

  const saveStoredCollections = (nextCollections: PerfumeCollection[]) => {
    localStorage.setItem(getStorageKey(), JSON.stringify(nextCollections));
  };

  const persistCollections = (
    updater: PerfumeCollection[] | ((current: PerfumeCollection[]) => PerfumeCollection[])
  ) => {
    const nextCollections = typeof updater === 'function' ? updater(collectionsRef.current) : updater;
    collectionsRef.current = nextCollections;
    saveStoredCollections(nextCollections);
    setCollections(nextCollections);
  };

  // Load collections from localStorage first, then API when it is available.
  const loadCollections = async () => {
    setIsLoading(true);
    setError(null);
    const storedCollections = readStoredCollections();
    collectionsRef.current = storedCollections;
    setCollections(storedCollections);
    
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      const userCollections = await api.getCollections();
      collectionsRef.current = userCollections;
      setCollections(userCollections);
      saveStoredCollections(userCollections);
    } catch (err: any) {
      console.warn('Collections API unavailable, using saved collections:', err);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new collection
  const createCollection = async (name: string, description: string): Promise<PerfumeCollection> => {
    const now = new Date().toISOString();
    const localCollection: PerfumeCollection = {
      id: `collection-${Date.now()}`,
      userId: user?.id || 'guest',
      name,
      description,
      perfumeIds: [],
      createdAt: now,
      updatedAt: now,
    };

    try {
      if (isAuthenticated && user) {
        const newCollection = await api.createCollection({
          name,
          description,
          perfumeIds: [],
        });
        persistCollections(prev => [...prev, newCollection]);
        return newCollection;
      }
    } catch (err: any) {
      console.warn('Collections API unavailable, creating locally:', err);
    }

    persistCollections(prev => [...prev, localCollection]);
    return localCollection;
  };

  // Update collection
  const updateCollection = async (id: string, updates: Partial<PerfumeCollection>) => {
    try {
      if (isAuthenticated && user) {
        const updatedCollection = await api.updateCollection(id, updates);
        persistCollections(prev => 
          prev.map(collection => 
            collection.id === id ? updatedCollection : collection
          )
        );
        return;
      }
    } catch (err: any) {
      console.warn('Collections API unavailable, updating locally:', err);
    }

    persistCollections(prev =>
      prev.map(collection =>
        collection.id === id
          ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
          : collection
      )
    );
  };

  // Delete collection
  const deleteCollection = async (id: string) => {
    try {
      if (isAuthenticated && user) {
        await api.deleteCollection(id);
      }
    } catch (err: any) {
      console.warn('Collections API unavailable, deleting locally:', err);
    }

    persistCollections(prev => prev.filter(collection => collection.id !== id));
  };

  // Add perfume to collection
  const addPerfumeToCollection = async (collectionId: string, perfumeId: string) => {
    const collection = collectionsRef.current.find(c => c.id === collectionId) || readStoredCollections().find(c => c.id === collectionId);
    if (!collection || collection.perfumeIds.includes(perfumeId)) return;

    const updatedCollection = {
      ...collection,
      perfumeIds: [...collection.perfumeIds, perfumeId],
      updatedAt: new Date().toISOString(),
    };

    persistCollections(prev => {
      const exists = prev.some(item => item.id === collectionId);
      if (!exists) return [...prev, updatedCollection];

      return prev.map(item => item.id === collectionId ? updatedCollection : item);
    });

    try {
      if (isAuthenticated && user) {
        await api.updateCollection(collectionId, { perfumeIds: updatedCollection.perfumeIds });
      }
    } catch (err: any) {
      console.warn('Collections API unavailable, perfume was added locally:', err);
    }
  };

  // Remove perfume from collection
  const removePerfumeFromCollection = async (collectionId: string, perfumeId: string) => {
    const collection = collectionsRef.current.find(c => c.id === collectionId) || readStoredCollections().find(c => c.id === collectionId);
    if (!collection) return;

    const updatedCollection = {
      ...collection,
      perfumeIds: collection.perfumeIds.filter(id => id !== perfumeId),
      updatedAt: new Date().toISOString(),
    };

    persistCollections(prev => prev.map(item => item.id === collectionId ? updatedCollection : item));

    try {
      if (isAuthenticated && user) {
        await api.updateCollection(collectionId, { perfumeIds: updatedCollection.perfumeIds });
      }
    } catch (err: any) {
      console.warn('Collections API unavailable, perfume was removed locally:', err);
    }
  };

  // Refresh collections
  const refreshCollections = async () => {
    await loadCollections();
  };

  // Load collections when user changes
  useEffect(() => {
    loadCollections();
  }, [user, isAuthenticated]);

  const value: CollectionsContextType = {
    collections,
    isLoading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    addPerfumeToCollection,
    removePerfumeFromCollection,
    refreshCollections,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}

export default CollectionsContext;
