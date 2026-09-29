import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Subtle fade-in on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#0A1128] selection:bg-[#7C3AED] selection:text-white pt-24">
      
      {/* SECTION 1: Editorial Hero */}
      <section className="relative min-h-[85vh] flex items-center px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 w-full items-center">
          
          {/* Typography Element */}
          <div className="lg:col-span-7 z-10">
            <h1 className="text-[12vw] lg:text-[7.5rem] leading-[0.85] font-editorial tracking-tighter">
              AI PERFUME <br />
              <span className="italic text-[#7C3AED] pr-8">ASSISTANT.</span>
            </h1>
            <p className="mt-12 text-xl lg:text-2xl font-editorial italic text-[#0A1128]/70 max-w-md">
              Discover fragrance differently. A curated, intelligent approach to finding your signature scent.
            </p>
            <div className="mt-12 flex items-center gap-6">
              <button 
                onClick={() => navigate('/recommendations')}
                className="bg-[#7C3AED] text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#0A1128] transition-all duration-500"
              >
                Begin Consultation
              </button>
              <button 
                onClick={() => navigate('/perfumes')}
                className="text-[#0A1128] px-2 py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:text-[#7C3AED] transition-colors border-b border-transparent hover:border-[#7C3AED]"
              >
                Explore Archive
              </button>
            </div>
          </div>

          {/* Integrated Visual Element */}
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[75vh] w-full mt-12 lg:mt-0">
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src="/perfume-images/by-kilian-angels-share.jpg" 
                alt="Luxury Fragrance" 
                className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-[2s] ease-out grayscale-[20%]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1887&auto=format&fit=crop';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Typography Marquee */}
      <section className="py-24 overflow-hidden border-y border-[#0A1128]/10 bg-white">
        <div className="whitespace-nowrap flex text-[4rem] lg:text-[6rem] font-editorial uppercase tracking-tight text-[#0A1128]/10">
          <div className="animate-marquee inline-flex gap-16 pr-16">
            <span>Bergamot</span> <span>•</span> <span>Oud</span> <span>•</span> 
            <span>Vanilla</span> <span>•</span> <span>Jasmine</span> <span>•</span> 
            <span>Sandalwood</span> <span>•</span> <span>Musk</span> <span>•</span> 
            <span>Iris</span> <span>•</span>
          </div>
          <div className="animate-marquee inline-flex gap-16 pr-16" aria-hidden="true">
            <span>Bergamot</span> <span>•</span> <span>Oud</span> <span>•</span> 
            <span>Vanilla</span> <span>•</span> <span>Jasmine</span> <span>•</span> 
            <span>Sandalwood</span> <span>•</span> <span>Musk</span> <span>•</span> 
            <span>Iris</span> <span>•</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: Asymmetric Features (AI & Photo) */}
      <section className="py-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-12">
          
          {/* Ask AI Block */}
          <div className="flex flex-col justify-center lg:pr-24">
            <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-6 block">01 / The Consultation</span>
            <h2 className="text-4xl lg:text-6xl font-editorial leading-tight mb-8">
              Find your signature <br/> scent, mathematically.
            </h2>
            <p className="text-[#0A1128]/70 font-light leading-relaxed mb-10 max-w-lg text-[15px]">
              Our artificial intelligence analyzes thousands of olfactory profiles, base notes, and perfumer histories to recommend the exact fragrance that aligns with your aesthetic and body chemistry.
            </p>
            <div>
              <button 
                onClick={() => navigate('/recommendations')}
                className="text-[#0A1128] text-[11px] uppercase tracking-[0.2em] font-medium hover:text-[#7C3AED] transition-colors border-b border-[#0A1128] pb-1 hover:border-[#7C3AED]"
              >
                Ask the AI
              </button>
            </div>
          </div>

          {/* Photo AI Block */}
          <div className="relative group cursor-pointer" onClick={() => navigate('/photo-ai')}>
            <div className="aspect-[3/4] w-full lg:w-[80%] ml-auto overflow-hidden bg-[#0A1128]">
              <img 
                src="/perfume-images/dior-sauvage.jpg" 
                alt="Photo Analysis"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1753&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="absolute -bottom-12 lg:bottom-12 lg:-left-12 bg-[#F9F8F6] p-8 lg:p-12 w-[90%] lg:w-auto shadow-2xl">
              <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-4 block">02 / Visual Recognition</span>
              <h3 className="text-3xl font-editorial mb-4">Identify by Photo.</h3>
              <p className="text-[#0A1128]/70 text-sm max-w-[250px]">Upload a photo of any bottle to immediately view its notes and history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Explore Statement */}
      <section className="py-32 px-6 lg:px-12 bg-[#0A1128] text-[#F9F8F6] text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-5xl lg:text-7xl font-editorial tracking-tight max-w-4xl leading-[1.1] mb-12">
          An archive of the world's most <span className="italic text-[#7C3AED]">provocative</span> compositions.
        </h2>
        <button 
          onClick={() => navigate('/perfumes')}
          className="bg-transparent border border-[#F9F8F6]/30 text-[#F9F8F6] px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#F9F8F6] hover:text-[#0A1128] transition-all duration-500"
        >
          View Collections
        </button>
      </section>

    </div>
  );
};

export default Home;