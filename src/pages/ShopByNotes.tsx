import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowLeft } from 'lucide-react';
import { mockPerfumes } from '../services/mockData';
import { useFavorites } from '../contexts/FavoritesContext';

// Category definitions with matching local perfume photos and note logic
const SCENT_FAMILIES = [
  {
    id: 'citrus',
    label: 'Citrus',
    subtitle: 'Fresh & Zesty',
    description: 'Light, bright, and energising — perfect for summer and daytime wear',
    image: '/perfume-images/lv-pacific-chill.jpg',
    gradient: 'from-yellow-400/40 to-orange-400/20',
    border: 'border-yellow-400/40',
    seasons: ['spring', 'summer'],
    notes: ['Bergamot','Lemon','Grapefruit','Mandarin','Orange','Lime','Yuzu','Bitter Orange','Calabrian Bergamot','Amalfi Lemon','Mandarin Orange'],
  },
  {
    id: 'floral',
    label: 'Floral',
    subtitle: 'Romantic & Feminine',
    description: 'Blooming bouquets from delicate rose to intoxicating jasmine',
    image: '/perfume-images/chanel-coco-mademoiselle.jpg',
    gradient: 'from-pink-400/40 to-rose-400/20',
    border: 'border-pink-400/40',
    seasons: ['spring', 'summer', 'autumn'],
    notes: ['Rose','Jasmine','Lavender','Violet','Iris','Geranium','Tuberose','Orange Blossom','Neroli','Lily of the Valley','Freesia','Orchid','Mimosa','Heliotrope','Sambac Jasmine','Italian Jasmine','Moroccan Jasmine'],
  },
  {
    id: 'woody',
    label: 'Woody',
    subtitle: 'Warm & Grounding',
    description: 'Deep, earthy woods that anchor any fragrance with sophistication',
    image: '/perfume-images/creed-aventus.jpg',
    gradient: 'from-amber-700/40 to-yellow-900/20',
    border: 'border-amber-600/40',
    seasons: ['autumn', 'winter'],
    notes: ['Sandalwood','Cedar','Vetiver','Patchouli','Oud','Oud Wood','Guaiac Wood','Birch','Oakmoss','Amberwood','Balsam Fir','Petitgrain','Akigalawood'],
  },
  {
    id: 'spicy',
    label: 'Spicy',
    subtitle: 'Bold & Seductive',
    description: 'Warm spices that add depth, heat, and irresistible magnetism',
    image: '/perfume-images/ysl-babycat.jpg',
    gradient: 'from-red-500/40 to-orange-600/20',
    border: 'border-red-500/40',
    seasons: ['autumn', 'winter'],
    notes: ['Pink Pepper','Black Pepper','Cardamom','Cinnamon','Ginger','Saffron','Nutmeg','Clove','Cumin','Cinnamon Bark','Sichuan Pepper'],
  },
  {
    id: 'oriental',
    label: 'Oriental & Amber',
    subtitle: 'Rich & Luxurious',
    description: 'Opulent resins, amber, and exotic ingredients for evening wear',
    image: '/perfume-images/lv-ombre-nomade.jpg',
    gradient: 'from-orange-500/40 to-amber-600/20',
    border: 'border-orange-500/40',
    seasons: ['autumn', 'winter'],
    notes: ['Amber','Benzoin','Labdanum','Myrrh','Frankincense','Incense','Olibanum','Peru Balsam','Resin','Ambergris','Ambroxan'],
  },
  {
    id: 'gourmand',
    label: 'Gourmand & Sweet',
    subtitle: 'Delicious & Addictive',
    description: 'Edible, dessert-like fragrances built on vanilla, tonka, and praline',
    image: '/perfume-images/by-kilian-angels-share.jpg',
    gradient: 'from-rose-400/40 to-purple-400/20',
    border: 'border-rose-400/40',
    seasons: ['autumn', 'winter', 'spring'],
    notes: ['Vanilla','Tonka Bean','Praline','Honey','Coffee','Rum','Cognac','Hazelnut','White Chocolate','Caramel','Almond'],
  },
  {
    id: 'leather',
    label: 'Leather & Tobacco',
    subtitle: 'Dark & Sophisticated',
    description: 'Smoky, animalic, and bold — for those who leave a lasting impression',
    image: '/perfume-images/ysl-tuxedo.jpg',
    gradient: 'from-stone-500/40 to-amber-900/20',
    border: 'border-stone-400/40',
    seasons: ['autumn', 'winter'],
    notes: ['Leather','Tobacco','Suede','Tobacco Leaf'],
  },
  {
    id: 'fresh',
    label: 'Fresh & Aquatic',
    subtitle: 'Clean & Invigorating',
    description: 'Crisp, cool, and effortless — ideal for office and everyday wear',
    image: '/perfume-images/creed-silver-mountain-water.jpg',
    gradient: 'from-cyan-400/40 to-teal-400/20',
    border: 'border-cyan-400/40',
    seasons: ['spring', 'summer'],
    notes: ['Mint','Eucalyptus','Green Tea','Tea','Galbanum','Sage','Rosemary'],
  },
  {
    id: 'musky',
    label: 'Musky & Powdery',
    subtitle: 'Soft & Sensual',
    description: 'Skin-close, intimate musks that blend seamlessly with your natural scent',
    image: '/perfume-images/prada-lhomme.jpg',
    gradient: 'from-purple-400/40 to-indigo-400/20',
    border: 'border-purple-400/40',
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    notes: ['Musk','White Musk','Cashmeran','Civet','Hedione'],
  },
];

const ShopByNotes: React.FC = () => {
  const [selectedFamily, setSelectedFamily] = useState<typeof SCENT_FAMILIES[0] | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const matchingPerfumes = useMemo(() => {
    if (!selectedFamily) return [];
    return mockPerfumes.filter(p => {
      const allNotes = [...p.notes.top, ...p.notes.middle, ...p.notes.base];
      return selectedFamily.notes.some(n =>
        allNotes.some(pn => pn.toLowerCase() === n.toLowerCase())
      );
    });
  }, [selectedFamily]);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          {selectedFamily && (
            <button
              onClick={() => setSelectedFamily(null)}
              className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to families
            </button>
          )}
          <h1 className="text-3xl font-bold text-white mb-2">
            {selectedFamily ? selectedFamily.label : 'Shop by Scent Family'}
          </h1>
          <p className="text-white/40">
            {selectedFamily
              ? `${matchingPerfumes.length} fragrance${matchingPerfumes.length !== 1 ? 's' : ''} — ${selectedFamily.description}`
              : 'Choose a scent family to discover matching fragrances'}
          </p>
        </div>

        {/* Scent family cards */}
        {!selectedFamily && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCENT_FAMILIES.map(family => {
              const count = mockPerfumes.filter(p => {
                const allNotes = [...p.notes.top, ...p.notes.middle, ...p.notes.base];
                return family.notes.some(n => allNotes.some(pn => pn.toLowerCase() === n.toLowerCase()));
              }).length;

              return (
                <button
                  key={family.id}
                  onClick={() => setSelectedFamily(family)}
                  className={`relative overflow-hidden rounded-2xl border ${family.border} group cursor-pointer text-left transition-all hover:-translate-y-1 hover:shadow-2xl`}
                >
                  {/* Background image */}
                  <div className="relative h-48">
                    <img
                      src={family.image}
                      alt={family.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${family.gradient} via-black/20 to-transparent`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{family.label}</h3>
                    <p className="text-sm text-white/70 mt-0.5">{family.subtitle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-white/50">{count} fragrances</p>
                      <div className="flex gap-1">
                        {family.seasons.slice(0, 2).map(s => (
                          <span key={s} className="text-xs bg-white/20 text-white/70 px-2 py-0.5 rounded-full capitalize">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Perfumes grid */}
        {selectedFamily && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {matchingPerfumes.map(perfume => (
              <div
                key={perfume.id}
                className="bg-white/5 border border-white/10 hover:border-violet-400/30 rounded-xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1"
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
                    onClick={e => { e.stopPropagation(); toggleFavorite(perfume.id); }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                      isFavorite(perfume.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white/60 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(perfume.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-violet-300">{perfume.brand}</p>
                  <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">{perfume.name}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-white/50">{perfume.rating}</span>
                    </div>
                    <span className="text-sm font-bold text-white">${perfume.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByNotes;
