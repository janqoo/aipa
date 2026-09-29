import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, ShoppingBag, Heart, MapPin, Search } from 'lucide-react';
import { getRecommendations } from '../services/api';
import { Perfume } from '../types';

interface Recommendation {
  id: string;
  reason: string;
  confidence: number;
  perfume: Perfume;
  fragranticaUrl?: string;
}

const suggestedQueries = [
  "Woody fragrance for winter evenings",
  "Fresh scent for summer days",
  "Romantic perfume for a date night",
  "Office-appropriate unisex scent",
  "Luxury oud fragrance",
  "Sweet gourmand for autumn",
];

const Recommendations: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setIsLoading(true);
    setError('');
    setResults([]);
    setActiveTab(0);
    try {
      const resultList = await getRecommendations(q);
      if (resultList?.length) {
        setResults(resultList as Recommendation[]);
      } else {
        setError('No recommendations found. Try a different description.');
      }
    } catch (error) {
      console.error('Recommendation search failed:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const confidenceColor = (c: number) => {
    if (c >= 0.9) return 'text-green-400';
    if (c >= 0.8) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const confidenceLabel = (c: number) => {
    if (c >= 0.9) return 'Perfect Match';
    if (c >= 0.8) return 'Great Match';
    return 'Good Match';
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-violet-500/20 border border-violet-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-violet-300" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">AI Perfume Assistant</h1>
          <p className="text-white/50 text-lg">Describe your mood, occasion, or preference and let AI find your perfect scent</p>
        </div>

        {/* Search Box */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. I want a woody fragrance for winter evenings..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-colors"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isLoading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>

          {/* Suggested queries */}
          <div className="mt-4">
            <p className="text-white/30 text-xs mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map(q => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); handleSearch(q); }}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-white/10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !isLoading && (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
              {results.map((rec, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === i
                      ? 'bg-violet-500 text-white shadow-lg'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <span className="hidden sm:inline">{rec.perfume?.brand} </span>
                  {rec.perfume?.name}
                </button>
              ))}
            </div>

            {/* Active recommendation */}
            {results[activeTab] && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6">
                  {/* Match badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-sm font-semibold flex items-center gap-1.5 ${confidenceColor(results[activeTab].confidence)}`}>
                      <Sparkles className="w-4 h-4" />
                      {confidenceLabel(results[activeTab].confidence)} — {Math.round(results[activeTab].confidence * 100)}%
                    </span>
                    <span className="text-xs text-white/30">#{activeTab + 1} of {results.length}</span>
                  </div>

                  {/* Perfume card */}
                  <div className="flex gap-5">
                    {/* Image */}
                    <div
                      className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-white/5 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-violet-400/50 transition-colors"
                      onClick={() => {
                        const p = results[activeTab].perfume;
                        const rec = results[activeTab];
                        if (p?.id && !p.id.startsWith('ext-')) navigate(`/perfumes/${p.id}`);
                        else if (rec.fragranticaUrl) window.open(rec.fragranticaUrl, '_blank');
                      }}
                    >
                      {results[activeTab].perfume?.image ? (
                        <img
                          src={results[activeTab].perfume?.image}
                          alt={results[activeTab].perfume?.name}
                          className="w-full h-full object-cover"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center gap-1"><span class="text-3xl">🌸</span><span class="text-xs text-white/30 text-center px-2">Tap to view</span></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                          <span className="text-3xl">🌸</span>
                          <span className="text-xs text-white/30 text-center leading-tight">{results[activeTab].perfume?.brand}</span>
                          <span className="text-xs text-violet-400/60 text-center leading-tight">View on Fragrantica</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-violet-300 text-sm font-medium">{results[activeTab].perfume?.brand}</p>
                      <h2 className="text-2xl font-bold text-white mb-1">{results[activeTab].perfume?.name}</h2>

                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-white font-medium">{results[activeTab].perfume?.rating}</span>
                          <span className="text-xs text-white/40">({results[activeTab].perfume?.reviewCount})</span>
                        </div>
                        <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">{results[activeTab].perfume?.category}</span>
                        <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{results[activeTab].perfume?.gender}</span>
                        <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{results[activeTab].perfume?.concentration?.toUpperCase()}</span>
                      </div>

                      <p className="text-white/60 text-sm mb-3 line-clamp-2">{results[activeTab].perfume?.description}</p>

                      <div className="text-2xl font-bold text-white">${results[activeTab].perfume?.price}
                        <span className="text-sm text-white/40 font-normal ml-1">{results[activeTab].perfume?.size}ml</span>
                      </div>
                    </div>
                  </div>

                  {/* AI reason */}
                  <div className="mt-5 bg-violet-500/10 border border-violet-400/20 rounded-xl p-4">
                    <p className="text-xs text-violet-300 font-semibold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Why AI picked this
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">{results[activeTab].reason}</p>
                  </div>

                  {/* Notes preview */}
                  {results[activeTab].perfume?.notes && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {(['top', 'middle', 'base'] as const).map(tier => (
                        <div key={tier} className="bg-white/5 rounded-xl p-3">
                          <p className="text-xs text-white/40 uppercase tracking-wider mb-1.5 capitalize">{tier}</p>
                          <p className="text-xs text-white/70 leading-relaxed">
                            {results[activeTab].perfume.notes[tier].slice(0, 3).join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => {
                        const p = results[activeTab].perfume;
                        if (p?.id && !p.id.startsWith('ext-')) navigate(`/perfumes/${p.id}`);
                        else window.open(`https://www.google.com/search?q=${encodeURIComponent(p?.brand + ' ' + p?.name + ' perfume buy')}`, '_blank');
                      }}
                      className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {results[activeTab].perfume?.id?.startsWith('ext-') ? 'Search Online' : 'View Details'}
                    </button>
                    <button
                      onClick={() => toggleFavorite(results[activeTab].perfume?.id)}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        favorites.has(results[activeTab].perfume?.id)
                          ? 'bg-red-500/20 border-red-400/30 text-red-400'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(results[activeTab].perfume?.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(pos => {
                            const { latitude, longitude } = pos.coords;
                            window.open(`https://www.google.com/maps/search/${encodeURIComponent(results[activeTab].perfume?.brand + ' perfume store')}/@${latitude},${longitude},14z`, '_blank');
                          });
                        }
                      }}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-green-400 transition-colors"
                      title="Find nearest store"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Store hint */}
                  <p className="text-center text-white/25 text-xs mt-3 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> Tap the pin to find the nearest store that carries this fragrance
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
