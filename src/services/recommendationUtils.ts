import { Perfume } from '../types';
import { mockPerfumes } from './mockData';

const noteTiers = ['top', 'middle', 'base'] as const;

export function getSimilarPerfumes(perfume: Perfume, limit = 4): Perfume[] {
  const sourceNotes = new Set(
    noteTiers.flatMap(tier => perfume.notes[tier].map(note => note.toLowerCase()))
  );

  return mockPerfumes
    .filter(candidate => candidate.id !== perfume.id)
    .map(candidate => {
      const matchingNotes = noteTiers.reduce((total, tier) => {
        return total + candidate.notes[tier].filter(note => sourceNotes.has(note.toLowerCase())).length;
      }, 0);

      const matchingAccords = (candidate.accords || []).filter(accord => {
        return (perfume.accords || []).some(sourceAccord => sourceAccord.name === accord.name);
      }).length;

      const score =
        (candidate.category === perfume.category ? 5 : 0) +
        (candidate.gender === perfume.gender ? 2 : 0) +
        matchingNotes * 3 +
        matchingAccords * 2 +
        candidate.seasons.filter(season => perfume.seasons.includes(season)).length +
        candidate.occasions.filter(occasion => perfume.occasions.includes(occasion)).length +
        candidate.rating / 10;

      return { candidate, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.rating - a.candidate.rating)
    .slice(0, limit)
    .map(item => item.candidate);
}

export function getInternetRecommendationLinks(perfume: Perfume) {
  const strongestAccords = (perfume.accords || [])
    .slice()
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 3)
    .map(accord => accord.name)
    .join(' ');

  const notes = [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base]
    .slice(0, 5)
    .join(' ');

  const similarQuery = `${perfume.brand} ${perfume.name} similar fragrances ${strongestAccords || perfume.category}`;
  const notesQuery = `best perfumes like ${perfume.brand} ${perfume.name} with ${notes}`;

  return [
    {
      label: 'Similar online',
      url: `https://www.google.com/search?q=${encodeURIComponent(similarQuery)}`,
    },
    {
      label: 'By notes',
      url: `https://www.google.com/search?q=${encodeURIComponent(notesQuery)}`,
    },
    {
      label: 'Fragrantica',
      url: `https://www.google.com/search?q=${encodeURIComponent(`${perfume.brand} ${perfume.name} similar site:fragrantica.com`)}`,
    },
  ];
}
