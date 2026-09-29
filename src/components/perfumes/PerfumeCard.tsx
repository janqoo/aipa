import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Perfume } from '../../types';

interface PerfumeCardProps {
  perfume: Perfume;
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group cursor-pointer flex flex-col"
      onClick={() => navigate(`/perfumes/${perfume.id}`)}
    >
      <div className="relative aspect-[3/4] bg-white border border-[#0A1128]/10 flex items-center justify-center p-8 mb-6 overflow-hidden">
        <img 
          src={perfume.image} 
          alt={perfume.name} 
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
        />
        <div className="absolute inset-0 bg-[#0A1128]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="text-center flex-grow flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0A1128]/50 mb-2">
          {perfume.brand}
        </p>
        <h3 className="font-editorial text-2xl text-[#0A1128] leading-tight mb-2 group-hover:text-[#7C3AED] transition-colors">
          {perfume.name}
        </h3>
        <p className="text-[11px] uppercase tracking-widest text-[#0A1128]/40 mt-auto pt-2">
          {perfume.category} — ${perfume.price}
        </p>
      </div>
    </div>
  );
};

export default PerfumeCard;