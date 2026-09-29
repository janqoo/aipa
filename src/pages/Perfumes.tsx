import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Perfume } from '../types';
import PerfumeGrid from '../components/perfumes/PerfumeGrid';
import { mockPerfumes } from '../services/mockData';
import { getPerfumes } from '../services/api';

const Perfumes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadPerfumes = async () => {
      setLoading(true);
      try {
        const data = await getPerfumes(undefined, 'brand', 1, 100);
        setPerfumes(data);
      } catch (err) {
        console.warn('Perfume catalog unavailable, falling back to local data', err);
        const sorted = [...mockPerfumes].sort((a, b) => {
          if (a.brand < b.brand) return -1;
          if (a.brand > b.brand) return 1;
          return a.name.localeCompare(b.name);
        });
        setPerfumes(sorted);
      } finally {
        setLoading(false);
      }
    };

    loadPerfumes();
  }, []);

  useEffect(() => {
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    
    if (gender) setSelectedGender(gender);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...perfumes];
    if (selectedGender !== 'all') {
      filtered = filtered.filter(p => p.gender === selectedGender);
    }
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'niche') {
        const nicheBrands = ['Xerjoff', 'By Kilian', 'Giardini di Toscana', 'Parfums de Marly'];
        filtered = filtered.filter(p => nicheBrands.includes(p.brand));
      } else {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
    }
    setFilteredPerfumes(filtered);
  }, [perfumes, selectedGender, selectedCategory]);

  const handleAddToCollection = (perfume: Perfume) => {
    alert(`Added "${perfume.name}" to collection!`);
  };

  const handleToggleFavorite = (perfumeId: string) => {
    setFavoriteIds(prev => 
      prev.includes(perfumeId)
        ? prev.filter(id => id !== perfumeId)
        : [...prev, perfumeId]
    );
  };

  const getCategoryTitle = () => {
    if (selectedGender === 'men') return "Masculine Edit";
    if (selectedGender === 'women') return "Feminine Edit";
    if (selectedGender === 'unisex') return "Fluid Edit";
    if (selectedCategory === 'niche') return "Niche Houses";
    return "The Archive";
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#F9F8F6] text-[#0A1128]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Editorial Header */}
        <div className="mb-20 border-b border-[#0A1128]/10 pb-12 text-center max-w-4xl mx-auto">
          <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-6 block">Collection View</span>
          <h1 className="text-6xl lg:text-[5rem] font-editorial tracking-tight mb-8">
            {getCategoryTitle()}
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-[#0A1128]/50">
            Cataloging {filteredPerfumes.length} Formulations
          </p>
        </div>

        {/* Minimal Filters */}
        <div className="mb-16 flex flex-col md:flex-row justify-center gap-12 md:gap-24">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0A1128]/40 mb-4 text-center md:text-left">
              Orientation
            </label>
            <div className="flex flex-wrap justify-center gap-1">
              {['all', 'men', 'women', 'unisex'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-widest transition-colors ${
                    selectedGender === gender
                      ? 'border-b border-[#0A1128] text-[#0A1128] font-semibold'
                      : 'border-b border-transparent text-[#0A1128]/50 hover:text-[#0A1128]'
                  }`}
                >
                  {gender === 'all' ? 'All' : gender}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0A1128]/40 mb-4 text-center md:text-left">
              Classification
            </label>
            <div className="flex flex-wrap justify-center gap-1">
              {['all', 'niche', 'woody', 'floral', 'oriental', 'fresh'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-widest transition-colors ${
                    selectedCategory === category
                      ? 'border-b border-[#0A1128] text-[#0A1128] font-semibold'
                      : 'border-b border-transparent text-[#0A1128]/50 hover:text-[#0A1128]'
                  }`}
                >
                  {category === 'all' ? 'All Families' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Perfume Grid */}
        <PerfumeGrid
          perfumes={filteredPerfumes}
          loading={loading}
          onAddToCollection={handleAddToCollection}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
        />

        {/* Empty State */}
        {!loading && filteredPerfumes.length === 0 && (
          <div className="text-center py-24 border border-[#0A1128]/10 bg-white">
            <h3 className="text-3xl font-editorial text-[#0A1128] mb-4">No results found.</h3>
            <button
              onClick={() => {
                setSelectedGender('all');
                setSelectedCategory('all');
              }}
              className="text-[#7C3AED] text-[11px] uppercase tracking-widest font-medium border-b border-[#7C3AED] pb-1 hover:text-[#0A1128] hover:border-[#0A1128] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfumes;