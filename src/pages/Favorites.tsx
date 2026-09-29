import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Heart, Star, Sparkles, Trash2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { mockPerfumes } from '../services/mockData';
import { getInternetRecommendationLinks, getSimilarPerfumes } from '../services/recommendationUtils';

const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  const favoritePerfumes = mockPerfumes.filter(p => favorites.includes(p.id));
  const latestFavorite = mockPerfumes.find(p => p.id === favorites[favorites.length - 1]);
  const similarPerfumes = latestFavorite ? getSimilarPerfumes(latestFavorite, 4) : [];
  const internetLinks = latestFavorite ? getInternetRecommendationLinks(latestFavorite) : [];

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400 fill-current" />
            </div>
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-white/40 ml-13">{favoritePerfumes.length} saved fragrance{favoritePerfumes.length !== 1 ? 's' : ''}</p>
        </div>

        {favoritePerfumes.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
            <Heart className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white/50 mb-2">No favorites yet</h2>
            <p className="text-white/30 mb-6">Browse perfumes and tap the heart to save your favorites</p>
            <button
              onClick={() => navigate('/perfumes')}
              className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Browse Perfumes
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {latestFavorite && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-violet-300" />
                  <h2 className="text-lg font-bold text-white">Similar to {latestFavorite.name}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {similarPerfumes.map(perfume => (
                    <button
                      key={perfume.id}
                      onClick={() => navigate(`/perfumes/${perfume.id}`)}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden text-left hover:border-violet-400/40 transition-colors"
                    >
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="h-28 w-full object-cover bg-white/5"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="block p-2">
                        <span className="block text-xs text-violet-300 truncate">{perfume.brand}</span>
                        <span className="block text-sm font-semibold text-white truncate">{perfume.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {internetLinks.map(link => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:border-violet-400/40 transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {favoritePerfumes.map(perfume => (
                <div
                  key={perfume.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-400/30 rounded-xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1"
                  onClick={() => navigate(`/perfumes/${perfume.id}`)}
                >
                  <div className="relative aspect-[4/3] bg-white/5">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <button
                      onClick={e => { e.stopPropagation(); removeFromFavorites(perfume.id); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-violet-300">{perfume.brand}</p>
                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">{perfume.name}</h3>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-white/60">{perfume.rating}</span>
                      </div>
                      <span className="text-sm font-bold text-white">${perfume.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
