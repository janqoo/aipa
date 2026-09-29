import React from 'react';
import { Perfume } from '../../types';
import PerfumeCard from './PerfumeCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface PerfumeGridProps {
  perfumes: Perfume[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onAddToCollection?: (perfume: Perfume) => void;
  onToggleFavorite?: (perfumeId: string) => void;
  favoriteIds?: string[];
}

const PerfumeGrid: React.FC<PerfumeGridProps> = ({
  perfumes,
  loading = false,
  onLoadMore,
  hasMore = false,
  onAddToCollection,
  onToggleFavorite,
  favoriteIds = []
}) => {
  if (loading && perfumes.length === 0) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border border-[#0A1128]/20 border-t-[#0A1128] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Editorial Grid (4 cols on large, 2 on small) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
        {perfumes.map((perfume) => (
          <PerfumeCard key={perfume.id} perfume={perfume} />
        ))}
      </div>

      {loading && perfumes.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border border-[#0A1128]/20 border-t-[#0A1128] rounded-full animate-spin" />
        </div>
      )}

      {hasMore && !loading && onLoadMore && (
        <div className="flex justify-center pt-8 border-t border-[#0A1128]/10">
          <button
            onClick={onLoadMore}
            className="border border-[#0A1128] bg-transparent text-[#0A1128] px-10 py-4 text-[11px] uppercase tracking-widest font-medium hover:bg-[#0A1128] hover:text-white transition-all"
          >
            Load More Archives
          </button>
        </div>
      )}
    </div>
  );
};

export default PerfumeGrid;