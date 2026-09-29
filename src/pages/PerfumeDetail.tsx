import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Heart, Star, Plus, Clock, Droplets, Wind, Sparkles, X, Check, MessageSquare } from 'lucide-react';
import { Perfume, PerfumeReview, ReviewSummary } from '../types';
import FragranceNotes from '../components/perfumes/FragranceNotes';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCollections } from '../contexts/CollectionsContext';
import { useAuth } from '../contexts/AuthContext';
import { getPerfume, getPerfumeReviews, submitPerfumeReview } from '../services/api';
import { getInternetRecommendationLinks, getSimilarPerfumes } from '../services/recommendationUtils';

const PerfumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { collections, addPerfumeToCollection, createCollection } = useCollections();
  const { user, isAuthenticated } = useAuth();

  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [creating, setCreating] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const [similarPerfumes, setSimilarPerfumes] = useState<Perfume[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [reviews, setReviews] = useState<PerfumeReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary>({ averageRating: 0, reviewCount: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        setPerfume(await getPerfume(id));
      } catch {
        setPerfume(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const { reviews, summary } = await getPerfumeReviews(id);
        setReviews(reviews);
        setReviewSummary(summary);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [id]);

  useEffect(() => {
    const ownReview = reviews.find(review => review.userId === user?.id);
    if (!ownReview) return;

    setReviewRating(ownReview.rating);
    setReviewTitle(ownReview.title || '');
    setReviewBody(ownReview.body || '');
  }, [reviews, user?.id]);

  // Load similar perfumes from catalog when favorited
  const handleFavorite = async () => {
    if (!perfume) return;
    toggleFavorite(perfume.id);
    if (!isFavorite(perfume.id)) {
      // Just favorited — find similar from catalog
      setLoadingSimilar(true);
      setSimilarPerfumes(getSimilarPerfumes(perfume, 4));
      setLoadingSimilar(false);
    } else {
      setSimilarPerfumes([]);
    }
  };

  const handlePickCollection = async (colId: string) => {
    if (!perfume) return;
    await addPerfumeToCollection(colId, perfume.id);
    setAdded(colId);
    setTimeout(() => { setAdded(null); setShowCollectionPicker(false); }, 800);
  };

  const handleCreateAndAdd = async () => {
    if (!newColName.trim() || !perfume) return;
    setCreating(true);
    try {
      const col = await createCollection(newColName.trim(), '');
      await addPerfumeToCollection(col.id, perfume.id);
      setNewColName('');
      setAdded(col.id);
      setTimeout(() => { setAdded(null); setShowCollectionPicker(false); }, 800);
    } finally { setCreating(false); }
  };

  const handleSubmitReview = async () => {
    if (!perfume || !reviewBody.trim()) return;

    setReviewSubmitting(true);
    setReviewError('');
    try {
      await submitPerfumeReview(perfume.id, {
        rating: reviewRating,
        title: reviewTitle.trim(),
        body: reviewBody.trim(),
      });
      const { reviews, summary } = await getPerfumeReviews(perfume.id);
      setReviews(reviews);
      setReviewSummary(summary);
    } catch (error: any) {
      setReviewError(error.message || 'Could not save review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
      <div className="w-10 h-10 border-2 border-[#0A1128] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!perfume) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F9F8F6]">
      <div className="text-center">
        <h2 className="text-3xl font-editorial text-[#0A1128] mb-6">Fragrance Not Found</h2>
        <button onClick={() => navigate('/perfumes')} className="bg-[#0A1128] text-white px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-[#7C3AED] transition-colors">
          Return to Archive
        </button>
      </div>
    </div>
  );

  const favorite = isFavorite(perfume.id);
  const internetLinks = getInternetRecommendationLinks(perfume);
  const displayedRating = reviewSummary.reviewCount > 0 ? reviewSummary.averageRating : perfume.rating;
  const displayedReviewCount = reviewSummary.reviewCount > 0 ? reviewSummary.reviewCount : perfume.reviewCount;
  const userHasReview = reviews.some(review => review.userId === user?.id);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12 bg-[#F9F8F6] text-[#0A1128]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Editorial Back Button */}
        <button onClick={() => navigate('/perfumes')} className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium text-[#0A1128]/50 hover:text-[#0A1128] mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Archive
        </button>

        {/* TOP SECTION: Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Col — Image & Actions (Spans 5) */}
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className="aspect-[4/5] bg-white border border-[#0A1128]/10 p-8 flex items-center justify-center overflow-hidden">
              <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-700 ease-out"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowCollectionPicker(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0A1128] hover:bg-[#7C3AED] text-white px-6 py-4 transition-colors text-[11px] uppercase tracking-widest font-medium"
              >
                <Plus className="w-4 h-4" /> Add to Collection
              </button>
              <button
                onClick={handleFavorite}
                className={`flex items-center justify-center px-6 py-4 border transition-colors ${
                  favorite ? 'border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED]/5' : 'border-[#0A1128]/20 text-[#0A1128] hover:border-[#0A1128]'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Col — Details (Spans 7) */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Header Block */}
            <div>
              <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-4 block">
                {perfume.brand} — {perfume.releaseYear}
              </span>
              <h1 className="text-5xl lg:text-7xl font-editorial tracking-tight leading-[1.1] mb-8">{perfume.name}</h1>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-[#0A1128] fill-current" />
                  <span className="text-lg font-medium text-[#0A1128]">{displayedRating}</span>
                </div>
                <span className="text-sm text-[#0A1128]/40 uppercase tracking-widest">({displayedReviewCount} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                <span className="px-4 py-2 border border-[#0A1128]/20 text-[11px] uppercase tracking-wider">{perfume.category}</span>
                <span className="px-4 py-2 border border-[#0A1128]/20 text-[11px] uppercase tracking-wider">{perfume.gender}</span>
                <span className="px-4 py-2 border border-[#0A1128]/20 text-[11px] uppercase tracking-wider">{perfume.size}ml</span>
              </div>
              
              <p className="text-[#0A1128]/70 text-lg leading-relaxed font-light mb-12 max-w-2xl">
                {perfume.description}
              </p>

              <div className="flex items-end justify-between border-b border-[#0A1128]/10 pb-8">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#0A1128]/50 block mb-2">Price</span>
                  <span className="text-4xl font-editorial">${perfume.price} <span className="text-sm font-sans font-light tracking-normal">USD</span></span>
                </div>
                {perfume.perfumer && (
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-widest text-[#0A1128]/50 block mb-2">Perfumer</span>
                    <span className="text-lg font-editorial italic">{perfume.perfumer}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Stats */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#0A1128]/50 uppercase tracking-[0.2em] mb-6">Performance Matrix</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: <Clock className="w-4 h-4" />, label: 'Longevity', value: perfume.longevity },
                  { icon: <Wind className="w-4 h-4" />, label: 'Sillage', value: perfume.sillage },
                  { icon: <Droplets className="w-4 h-4" />, label: 'Concentration', value: perfume.concentration?.toUpperCase() },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="border border-[#0A1128]/10 p-5 bg-white">
                    <div className="flex items-center gap-2 text-[#0A1128]/50 mb-3 uppercase tracking-widest text-[10px]">
                      {icon} <span>{label}</span>
                    </div>
                    <span className="text-[15px] font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasons & Occasions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <h3 className="text-[11px] font-semibold text-[#0A1128]/50 uppercase tracking-[0.2em] mb-4">Seasons</h3>
                <div className="flex flex-wrap gap-2">
                  {perfume.seasons?.map(s => <span key={s} className="px-3 py-1.5 border border-[#0A1128]/20 text-[11px] uppercase tracking-wider capitalize">{s}</span>)}
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-semibold text-[#0A1128]/50 uppercase tracking-[0.2em] mb-4">Occasions</h3>
                <div className="flex flex-wrap gap-2">
                  {perfume.occasions?.map(o => <span key={o} className="px-3 py-1.5 border border-[#0A1128]/20 text-[11px] uppercase tracking-wider capitalize">{o}</span>)}
                </div>
              </div>
            </div>

            {/* Fragrance Notes (Relying on existing component, just wrapping in editorial container) */}
            <div className="pt-8 border-t border-[#0A1128]/10">
              <h3 className="text-[11px] font-semibold text-[#0A1128]/50 uppercase tracking-[0.2em] mb-8">Olfactory Profile</h3>
              <div className="bg-white p-8 border border-[#0A1128]/10">
                <FragranceNotes notes={perfume.notes} accords={perfume.accords} />
              </div>
            </div>

          </div>
        </div>

        {/* Similar perfumes */}
        {(similarPerfumes.length > 0 || loadingSimilar) && (
          <div className="mt-32 border-t border-[#0A1128]/10 pt-16">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-4 block">Based on your selection</span>
                <h2 className="text-4xl font-editorial">Related Compositions</h2>
              </div>
            </div>
            
            {loadingSimilar ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-white border border-[#0A1128]/10 animate-pulse" />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10">
                  {similarPerfumes.map(p => (
                    <div key={p.id} onClick={() => navigate(`/perfumes/${p.id}`)}
                      className="group cursor-pointer">
                      <div className="aspect-[3/4] bg-white border border-[#0A1128]/10 flex items-center justify-center p-6 mb-4 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-[#0A1128]/50 mb-1">{p.brand}</p>
                        <p className="text-[15px] font-medium font-editorial leading-tight group-hover:text-[#7C3AED] transition-colors">{p.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* External Links */}
                {internetLinks.length > 0 && (
                  <div className="mt-12 flex flex-wrap gap-4 justify-center">
                    {internetLinks.map(link => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border-b border-[#0A1128]/20 pb-1 text-[11px] uppercase tracking-widest font-medium hover:text-[#7C3AED] hover:border-[#7C3AED] transition-colors"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-32 pt-16 border-t border-[#0A1128]/10">
          <div className="mb-12">
            <h2 className="text-4xl font-editorial mb-4">Impressions</h2>
            <div className="flex items-center gap-2 text-sm text-[#0A1128]/60 uppercase tracking-widest">
              <Star className="w-4 h-4 text-[#0A1128] fill-current" />
              <span className="font-semibold text-[#0A1128]">{displayedRating}</span>
              <span>— {displayedReviewCount} total reviews</span>
            </div>
          </div>

          <div className="grid gap-16 lg:grid-cols-12 items-start">
            
            {/* Review Form */}
            <div className="lg:col-span-5 bg-white border border-[#0A1128]/10 p-8">
              {isAuthenticated ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-editorial">{userHasReview ? 'Update your review' : 'Write a review'}</h3>
                    <p className="mt-2 text-[11px] uppercase tracking-widest text-[#0A1128]/50">Signed in as {user?.name}</p>
                  </div>
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-widest text-[#0A1128]/70">Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setReviewRating(value)}
                          className={`transition-colors ${value <= reviewRating ? 'text-[#0A1128]' : 'text-[#0A1128]/20 hover:text-[#0A1128]/50'}`}
                          aria-label={`${value} star rating`}
                        >
                          <Star className={`w-6 h-6 ${value <= reviewRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    value={reviewTitle}
                    onChange={event => setReviewTitle(event.target.value)}
                    maxLength={80}
                    placeholder="Review title"
                    className="w-full border-b border-[#0A1128]/20 bg-transparent px-0 py-3 text-sm text-[#0A1128] placeholder-[#0A1128]/40 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                  <textarea
                    value={reviewBody}
                    onChange={event => setReviewBody(event.target.value)}
                    rows={5}
                    maxLength={1200}
                    placeholder="Share how it smells, performs, and when you wear it..."
                    className="w-full resize-none border border-[#0A1128]/20 bg-transparent p-4 text-sm text-[#0A1128] placeholder-[#0A1128]/40 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                  {reviewError && <p className="text-sm text-red-500">{reviewError}</p>}
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={reviewSubmitting || reviewBody.trim().length < 10}
                    className="w-full bg-[#0A1128] py-4 text-[11px] uppercase tracking-widest font-medium text-white transition-colors hover:bg-[#7C3AED] disabled:opacity-40"
                  >
                    {reviewSubmitting ? 'Saving...' : userHasReview ? 'Update Review' : 'Post Review'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-2xl font-editorial mb-4">Share your thoughts</h3>
                  <p className="mb-8 text-[#0A1128]/60 text-sm">Sign in to share your rating and experience with {perfume.name}.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full bg-[#0A1128] py-4 text-[11px] uppercase tracking-widest font-medium text-white transition-colors hover:bg-[#7C3AED]"
                  >
                    Sign In to Review
                  </button>
                </div>
              )}
            </div>

            {/* Review List */}
            <div className="lg:col-span-7 space-y-6">
              {reviewsLoading ? (
                [1, 2, 3].map(item => <div key={item} className="h-32 bg-white border border-[#0A1128]/5 animate-pulse" />)
              ) : reviews.length > 0 ? (
                reviews.map(review => (
                  <article key={review.id} className="bg-white border border-[#0A1128]/10 p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map(value => (
                            <Star key={value} className={`w-3.5 h-3.5 ${value <= review.rating ? 'text-[#0A1128] fill-current' : 'text-[#0A1128]/20'}`} />
                          ))}
                        </div>
                        {review.title && <h3 className="text-xl font-editorial mb-1">{review.title}</h3>}
                        <p className="text-[11px] uppercase tracking-widest text-[#0A1128]/50">By {review.userName}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#0A1128]/40">{new Date(review.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[15px] font-light leading-relaxed text-[#0A1128]/80">{review.body}</p>
                  </article>
                ))
              ) : (
                <div className="bg-white border border-[#0A1128]/10 p-12 text-center">
                  <p className="text-xl font-editorial text-[#0A1128] mb-2">No impressions yet</p>
                  <p className="text-[#0A1128]/50 text-sm">Be the first to articulate your experience with {perfume.name}.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Collection picker modal (Restyled as Editorial Pop-up) */}
      {showCollectionPicker && (
        <div className="fixed inset-0 bg-[#0A1128]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCollectionPicker(false)}>
          <div className="bg-[#F9F8F6] border border-[#0A1128]/10 p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-editorial text-[#0A1128]">Save to Archive</h3>
              <button onClick={() => setShowCollectionPicker(false)} className="text-[#0A1128]/40 hover:text-[#0A1128] transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            {collections.length > 0 && (
              <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2">
                {collections.map(col => (
                  <button key={col.id} onClick={() => handlePickCollection(col.id)}
                    className={`w-full flex items-center justify-between p-4 border transition-colors text-left ${
                      added === col.id ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'bg-white border-[#0A1128]/10 hover:border-[#0A1128]'
                    }`}>
                    <div>
                      <p className="text-[13px] font-medium uppercase tracking-widest text-[#0A1128]">{col.name}</p>
                      <p className="text-[11px] text-[#0A1128]/50 mt-1">{col.perfumeIds.length} formulations</p>
                    </div>
                    {added === col.id && <Check className="w-5 h-5 text-[#7C3AED]" />}
                  </button>
                ))}
              </div>
            )}
            
            <div className="border-t border-[#0A1128]/10 pt-6">
              <p className="text-[11px] uppercase tracking-widest text-[#0A1128]/50 mb-4">Establish New Archive</p>
              <div className="flex flex-col gap-4">
                <input type="text" value={newColName} onChange={e => setNewColName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateAndAdd()}
                  placeholder="Archive Name" autoFocus
                  className="w-full bg-white border-b border-[#0A1128]/20 px-0 py-3 text-sm text-[#0A1128] placeholder-[#0A1128]/30 focus:outline-none focus:border-[#7C3AED] transition-colors" />
                <button onClick={handleCreateAndAdd} disabled={creating || !newColName.trim()}
                  className="w-full bg-[#0A1128] hover:bg-[#7C3AED] disabled:opacity-40 text-white py-4 text-[11px] uppercase tracking-widest font-medium transition-colors">
                  {creating ? 'Processing...' : 'Create & Save'}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfumeDetail;