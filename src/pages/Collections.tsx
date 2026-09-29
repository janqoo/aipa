import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Trash2, Star, X } from 'lucide-react';
import { useCollections } from '../contexts/CollectionsContext';
import { mockPerfumes } from '../services/mockData';

const Collections: React.FC = () => {
  const { collections, createCollection, deleteCollection, addPerfumeToCollection, removePerfumeFromCollection, isLoading } = useCollections();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const collection = await createCollection(newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
      setActiveCollection(collection.id);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const selectedCollection = collections.find(c => c.id === activeCollection);
  const collectionPerfumes = selectedCollection
    ? mockPerfumes.filter(p => selectedCollection.perfumeIds.includes(p.id))
    : [];
  const availablePerfumes = selectedCollection
    ? mockPerfumes.filter(p => !selectedCollection.perfumeIds.includes(p.id)).slice(0, 12)
    : [];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12 bg-[#F9F8F6] text-[#0A1128]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#0A1128]/10 pb-10 gap-6">
          <div>
            <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-4 block">Personal Archive</span>
            <h1 className="text-5xl lg:text-6xl font-editorial tracking-tight mb-2">My Collections</h1>
            <p className="text-[#0A1128]/50 text-sm font-light italic">Maintaining {collections.length} catalogued groupings</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-3 bg-[#0A1128] hover:bg-[#7C3AED] text-white px-8 py-4 text-[11px] uppercase tracking-widest font-medium transition-colors w-full md:w-auto"
          >
            <Plus className="w-4 h-4" /> Establish New
          </button>
        </div>

        {/* Create Modal (Light Editorial Style) */}
        {showCreate && (
          <div className="fixed inset-0 bg-[#0A1128]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#F9F8F6] border border-[#0A1128]/10 p-10 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-editorial text-[#0A1128]">New Collection</h2>
                <button onClick={() => setShowCreate(false)} className="text-[#0A1128]/40 hover:text-[#0A1128] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-semibold text-[#0A1128]/50 mb-2">Title</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Summer Transition"
                    className="w-full bg-white border border-[#0A1128]/10 px-4 py-4 text-sm text-[#0A1128] placeholder-[#0A1128]/30 focus:outline-none focus:border-[#7C3AED] transition-colors"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-semibold text-[#0A1128]/50 mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Brief description of the curation..."
                    className="w-full bg-white border border-[#0A1128]/10 px-4 py-4 text-sm text-[#0A1128] placeholder-[#0A1128]/30 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="w-full bg-[#0A1128] hover:bg-[#7C3AED] disabled:opacity-40 text-white font-medium py-4 text-[11px] uppercase tracking-widest transition-colors mt-4"
                >
                  {creating ? 'Establishing...' : 'Confirm'}
                </button>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="border border-[#0A1128]/10 bg-white p-8 animate-pulse h-32" />)}
          </div>
        ) : collections.length === 0 ? (
          <div className="border border-[#0A1128]/10 bg-white p-24 text-center">
            <h2 className="text-3xl font-editorial text-[#0A1128] mb-4">The archive is empty.</h2>
            <p className="text-[#0A1128]/50 text-sm mb-8 max-w-sm mx-auto">Establish your first collection to begin categorizing formulations.</p>
            <button onClick={() => setShowCreate(true)} className="bg-transparent border border-[#0A1128] text-[#0A1128] hover:bg-[#0A1128] hover:text-white px-8 py-3 text-[11px] uppercase tracking-widest transition-all">
              Initialize Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Collections List (Left Menu) */}
            <div className="lg:col-span-4 space-y-4">
              {collections.map(col => (
                <div
                  key={col.id}
                  onClick={() => setActiveCollection(col.id === activeCollection ? null : col.id)}
                  className={`border p-6 cursor-pointer transition-all flex justify-between items-start ${
                    activeCollection === col.id ? 'border-[#7C3AED] bg-white shadow-lg' : 'border-[#0A1128]/10 bg-transparent hover:bg-white'
                  }`}
                >
                  <div>
                    <h3 className="font-editorial text-xl text-[#0A1128] mb-1">{col.name}</h3>
                    {col.description && <p className="text-[13px] text-[#0A1128]/60 mb-3 font-light">{col.description}</p>}
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-[#7C3AED]">
                      {col.perfumeIds.length} formulation{col.perfumeIds.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteCollection(col.id); }}
                    className="p-2 text-[#0A1128]/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Collection Contents (Right Panel) */}
            <div className="lg:col-span-8">
              {selectedCollection ? (
                <div className="border border-[#0A1128]/10 bg-white p-8 lg:p-12">
                  <h2 className="text-4xl font-editorial text-[#0A1128] mb-10">{selectedCollection.name}</h2>
                  
                  {collectionPerfumes.length === 0 ? (
                    <div className="py-16 text-center border-b border-[#0A1128]/10 mb-12">
                      <p className="text-[#0A1128]/40 mb-6 text-lg font-editorial">This collection contains no formulations.</p>
                      <button onClick={() => navigate('/perfumes')} className="text-[#7C3AED] text-[11px] uppercase tracking-widest font-semibold hover:text-[#0A1128] transition-colors border-b border-[#7C3AED] pb-1 hover:border-[#0A1128]">
                        Browse Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16 border-b border-[#0A1128]/10 pb-16">
                      {collectionPerfumes.map(perfume => (
                        <div
                          key={perfume.id}
                          className="group cursor-pointer"
                          onClick={() => navigate(`/perfumes/${perfume.id}`)}
                        >
                          <div className="relative aspect-[3/4] bg-[#F9F8F6] border border-[#0A1128]/10 p-6 flex items-center justify-center overflow-hidden mb-4">
                            <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <button
                              onClick={e => { e.stopPropagation(); removePerfumeFromCollection(selectedCollection.id, perfume.id); }}
                              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-widest text-[#0A1128]/50 mb-1">{perfume.brand}</p>
                            <p className="font-editorial text-lg text-[#0A1128] leading-tight group-hover:text-[#7C3AED] transition-colors">{perfume.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add more section */}
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-semibold text-[#0A1128]/50 mb-6">Append to Collection</h3>
                    {availablePerfumes.length === 0 ? (
                      <p className="text-[#0A1128]/40 text-sm">All available catalog formulations are already included.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availablePerfumes.map(perfume => (
                          <button
                            key={perfume.id}
                            onClick={() => addPerfumeToCollection(selectedCollection.id, perfume.id)}
                            className="flex items-center gap-4 border border-[#0A1128]/10 p-3 hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 transition-colors text-left group"
                          >
                            <div className="h-12 w-10 bg-[#F9F8F6] overflow-hidden flex-shrink-0">
                              <img src={perfume.image} alt={perfume.name} className="h-full w-full object-cover mix-blend-multiply" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-[10px] uppercase tracking-widest text-[#0A1128]/50">{perfume.brand}</span>
                              <span className="block text-sm font-editorial text-[#0A1128] truncate mt-0.5">{perfume.name}</span>
                            </div>
                            <Plus className="h-4 w-4 text-[#0A1128]/30 group-hover:text-[#7C3AED]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-[#0A1128]/10 bg-white p-24 text-center h-full flex flex-col items-center justify-center">
                  <p className="text-2xl font-editorial text-[#0A1128]/40">Select an archive to inspect.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;