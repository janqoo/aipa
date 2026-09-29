import React from 'react';

interface FragranceNotesProps {
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
  accords?: Array<{
    name: string;
    intensity: number;
    color: string;
  }>;
}

type NoteFamily = 'citrus' | 'spice' | 'floral' | 'wood' | 'resin' | 'fruit' | 'gourmand' | 'green' | 'smoky' | 'abstract';

// We keep the map for labels, but colors are overridden by the global editorial palette in the SVG
const NOTE_FAMILY_STYLES: Record<NoteFamily, { colors: string[]; accent: string; label: string }> = {
  citrus: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Citrus' },
  spice: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Spice' },
  floral: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Floral' },
  wood: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Woods' },
  resin: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Amber' },
  fruit: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Fruit' },
  gourmand: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Sweet' },
  green: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Green' },
  smoky: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Dark' },
  abstract: { colors: ['#0A1128', '#0A1128', '#0A1128'], accent: '#F9F8F6', label: 'Aura' },
};

const NOTE_FAMILY_MAP: Record<string, NoteFamily> = {
  bergamot: 'citrus', lemon: 'citrus', mandarin: 'citrus', 'mandarin orange': 'citrus',
  grapefruit: 'citrus', orange: 'citrus', 'bitter orange': 'citrus', lime: 'citrus', yuzu: 'citrus',
  pepper: 'spice', 'black pepper': 'spice', 'pink pepper': 'spice', 'sichuan pepper': 'spice',
  cardamom: 'spice', cinnamon: 'spice', ginger: 'spice', saffron: 'spice', nutmeg: 'spice',
  clove: 'spice', cumin: 'spice', rose: 'floral', jasmine: 'floral', lavender: 'floral',
  violet: 'floral', iris: 'floral', geranium: 'floral', tuberose: 'floral', 'orange blossom': 'floral',
  neroli: 'floral', freesia: 'floral', orchid: 'floral', heliotrope: 'floral', sandalwood: 'wood',
  cedar: 'wood', vetiver: 'wood', patchouli: 'wood', oud: 'wood', 'oud wood': 'wood', birch: 'wood',
  oak: 'wood', oakmoss: 'wood', 'oak moss': 'wood', amberwood: 'wood', vanilla: 'gourmand',
  'tonka bean': 'gourmand', honey: 'gourmand', praline: 'gourmand', chocolate: 'gourmand',
  almond: 'gourmand', coffee: 'gourmand', amber: 'resin', musk: 'resin', 'white musk': 'resin',
  ambergris: 'resin', ambroxan: 'resin', benzoin: 'resin', labdanum: 'resin', myrrh: 'resin',
  frankincense: 'resin', olibanum: 'resin', incense: 'smoky', pineapple: 'fruit', apple: 'fruit',
  pear: 'fruit', peach: 'fruit', plum: 'fruit', raspberry: 'fruit', 'black currant': 'fruit',
  blackberry: 'fruit', fig: 'fruit', lychee: 'fruit', melon: 'fruit', coconut: 'gourmand',
  mango: 'fruit', leather: 'smoky', suede: 'smoky', tobacco: 'smoky', rum: 'gourmand',
  cognac: 'gourmand', mint: 'green', eucalyptus: 'green', sage: 'green', rosemary: 'green',
  thyme: 'green', tea: 'green', 'green tea': 'green',
};

function getNoteFamily(note: string): NoteFamily {
  const key = note.toLowerCase().trim();
  if (NOTE_FAMILY_MAP[key]) return NOTE_FAMILY_MAP[key];

  if (/wood|cedar|oak|moss|vetiver|sandal|oud|patchouli/.test(key)) return 'wood';
  if (/rose|jasmine|flower|blossom|iris|violet|lily|lavender/.test(key)) return 'floral';
  if (/orange|lemon|bergamot|grapefruit|mandarin|citrus/.test(key)) return 'citrus';
  if (/pepper|spice|cardamom|cinnamon|ginger|saffron/.test(key)) return 'spice';
  if (/vanilla|milk|cream|honey|chocolate|tonka|praline|almond|coffee|coconut/.test(key)) return 'gourmand';
  if (/amber|musk|resin|benzoin|labdanum|myrrh|frankincense/.test(key)) return 'resin';
  if (/apple|pear|berry|fruit|melon|plum|peach|fig|lychee/.test(key)) return 'fruit';
  if (/mint|tea|green|sage|herb|leaf/.test(key)) return 'green';
  if (/leather|tobacco|smoke|incense|suede/.test(key)) return 'smoky';

  return 'abstract';
}

function getCreativeNoteImage(note: string): string {
  const family = getNoteFamily(note);
  const style = NOTE_FAMILY_STYLES[family];
  const initial = note.trim().charAt(0).toUpperCase();

  // Minimalist typographic SVG replacing the heavy glowing shapes
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" fill="#F9F8F6"/>
      <rect width="158" height="158" x="1" y="1" fill="none" stroke="#0A1128" stroke-opacity="0.1" stroke-width="1"/>
      <text x="80" y="100" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="72" font-style="italic" fill="#0A1128" opacity="0.8">${initial}</text>
      <text x="80" y="135" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="500" letter-spacing="2" fill="#0A1128" opacity="0.4">${style.label.toUpperCase()}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface NoteItemProps {
  note: string;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const family = getNoteFamily(note);

  return (
    <div className="group flex w-[80px] flex-col items-center gap-3">
      <div className="relative h-[80px] w-[80px] overflow-hidden border border-[#0A1128]/10 bg-[#F9F8F6] transition-transform duration-500 group-hover:scale-105">
        <img
          src={getCreativeNoteImage(note)}
          alt={`${note} note artwork`}
          className="h-full w-full object-cover mix-blend-multiply"
        />
      </div>
      <div className="text-center w-full">
        <span className="block text-[11px] font-medium leading-tight text-[#0A1128] truncate">{note}</span>
        <span className="block text-[9px] uppercase tracking-widest text-[#0A1128]/40 mt-1">
          {NOTE_FAMILY_STYLES[family].label}
        </span>
      </div>
    </div>
  );
};

const NoteSection: React.FC<{ title: string; notes: string[] }> = ({ title, notes }) => (
  <div className="mb-10 last:mb-0">
    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#0A1128]/40 mb-5 border-b border-[#0A1128]/10 pb-2">
      {title}
    </h4>
    <div className="flex flex-wrap gap-5">
      {notes.map((note) => (
        <NoteItem key={note} note={note} />
      ))}
    </div>
  </div>
);

const FragranceNotes: React.FC<FragranceNotesProps> = ({
  notes,
  className = '',
  showTitle = true,
  compact = false,
  accords
}) => {
  if (compact) {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="text-xs">
          <span className="font-semibold uppercase tracking-widest text-[#0A1128]/50 text-[10px] mr-2">Top</span>
          <span className="text-[#0A1128]/80">{notes.top.slice(0, 3).join(', ')}{notes.top.length > 3 && '...'}</span>
        </div>
        <div className="text-xs">
          <span className="font-semibold uppercase tracking-widest text-[#0A1128]/50 text-[10px] mr-2">Heart</span>
          <span className="text-[#0A1128]/80">{notes.middle.slice(0, 3).join(', ')}{notes.middle.length > 3 && '...'}</span>
        </div>
        <div className="text-xs">
          <span className="font-semibold uppercase tracking-widest text-[#0A1128]/50 text-[10px] mr-2">Base</span>
          <span className="text-[#0A1128]/80">{notes.base.slice(0, 3).join(', ')}{notes.base.length > 3 && '...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Redesigned Accords: Minimalist Architectural Lines */}
      {accords && accords.length > 0 && (
        <div className="mb-14">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#0A1128]/50 mb-6">Structural Accords</h3>
          <div className="space-y-4">
            {[...accords].sort((a, b) => b.intensity - a.intensity).map((accord, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-28 text-[11px] uppercase tracking-widest text-[#0A1128] truncate font-medium">
                  {accord.name}
                </span>
                <div className="flex-1 h-px bg-[#0A1128]/10 relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#0A1128] transition-all duration-1000 ease-out"
                    style={{ width: `${accord.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redesigned Notes Pyramid */}
      <div>
        {showTitle && (
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#0A1128]/50 mb-8">Olfactory Architecture</h3>
        )}

        <NoteSection title="Top Notes" notes={notes.top} />
        <NoteSection title="Heart Notes" notes={notes.middle} />
        <NoteSection title="Base Notes" notes={notes.base} />
      </div>
    </div>
  );
};

export default FragranceNotes;