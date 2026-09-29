import { Perfume, PerfumeCollection } from '../types';

export const mockPerfumes: Perfume[] = [
  {
    id: '1',
    name: 'Aventus',
    brand: 'Creed',
    category: 'chypre',
    notes: {
      top: ['Pineapple', 'Bergamot', 'Black Currant', 'Apple'],
      middle: ['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'],
      base: ['Musk', 'Oak Moss', 'Ambergris', 'Vanilla']
    },
    accords: [
      { name: 'fruity', intensity: 100, color: '#FF6B6B' },
      { name: 'citrus', intensity: 85, color: '#FEE440' },
      { name: 'smoky', intensity: 75, color: '#FF8C42' },
      { name: 'woody', intensity: 70, color: '#8B4513' },
      { name: 'fresh', intensity: 65, color: '#4ECDC4' },
      { name: 'musky', intensity: 55, color: '#C8B6E2' }
    ],
    description: 'A legendary fragrance inspired by Napoleon\'s dramatic life. Fruity opening with smoky birch and elegant woods.',
    price: 425,
    image: '/perfume-images/creed-aventus.jpg',
    rating: 4.9,
    reviewCount: 3456,
    gender: 'men',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['formal', 'special', 'evening'],
    longevity: 'eternal',
    sillage: 'enormous',
    concentration: 'parfum',
    releaseYear: 2010,
    perfumer: 'Olivier Creed',
    size: 120,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    name: 'Blue Talisman',
    brand: 'Ex Nihilo',
    category: 'woody',
    notes: {
      top: ['Pear', 'Bergamot', 'Mandarin', 'Ginger'],
      middle: ['Orange Blossom', 'Violet', 'Musk'],
      base: ['Amber', 'Sandalwood', 'Musk']
    },
    description: 'A hypnotic jewel from Ex Nihilo Paris. Juicy citrus and ginger open into a clean woody-amber heart — bold, luminous, and magnetically elegant.',
    price: 325,
    image: '/perfume-images/ex-nihilo-blue-talisman.jpg',
    rating: 4.3,
    reviewCount: 654,
    gender: 'unisex',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['casual', 'office', 'date'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2023,
    perfumer: 'Ex Nihilo',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '21',
    name: 'Silver Mountain Water',
    brand: 'Creed',
    category: 'fresh',
    notes: {
      top: ['Bergamot', 'Green Tea', 'Mandarin'],
      middle: ['Black Currant', 'Galbanum'],
      base: ['Musk', 'Sandalwood', 'Petitgrain']
    },
    accords: [
      {name: 'fresh', intensity: 95, color: '#4ECDC4'},
      {name: 'citrus', intensity: 75, color: '#F4D35E'},
      {name: 'woody', intensity: 55, color: '#8B4513'}
    ],
    description: 'A crystalline aquatic aromatic that captures mountain air and glacier water in a refined Creed bottle.',
    price: 375,
    image: '/perfume-images/creed-silver-mountain-water.jpg',
    rating: 4.8,
    reviewCount: 4225,
    gender: 'unisex',
    seasons: ['spring', 'summer'],
    occasions: ['casual', 'office'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',

    releaseYear: 1999,
    perfumer: 'Olivier Creed',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Angel\'s Share',
    brand: 'By Kilian',
    category: 'gourmand',
    notes: {
      top: ['Cognac', 'Cinnamon', 'Oak'],
      middle: ['Tonka Bean', 'Praline', 'Hazelnut'],
      base: ['Vanilla', 'Sandalwood', 'Akigalawood']
    },
    description: 'A warm, boozy gourmand fragrance inspired by the angel\'s share of aging cognac. Rich, luxurious, and addictive.',
    price: 325,
    image: '/perfume-images/by-kilian-angels-share.jpg',
    rating: 4.7,
    reviewCount: 1876,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'date', 'special'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2020,
    perfumer: 'Benoist Lapouza',
    size: 50,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '27',
    name: 'Side Effect',
    brand: 'Initio',
    category: 'woody',
    notes: {
      top: ['Juniper Berries', 'Saffron', 'Cardamom'],
      middle: ['Black Rose', 'Patchouli', 'Dark Chocolate'],
      base: ['Amber', 'Sandalwood', 'Musk']
    },
    accords: [
      { name: 'woody', intensity: 90, color: '#8B4513' },
      { name: 'amber', intensity: 80, color: '#F4A261' },
      { name: 'floral', intensity: 70, color: '#E9C46A' }
    ],
    description: 'A dark, mysterious woody fragrance with saffron and dark rose. Sophisticated, enigmatic, and irresistibly alluring.',
    price: 285,
    image: '/perfume-images/initio-side-effect.jpg',
    rating: 4.4,
    reviewCount: 876,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'special', 'date'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2015,
    perfumer: 'Ben Gorham',
    size: 50,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '26',
    name: 'Animalique',
    brand: 'Byredo',
    category: 'oriental',
    notes: {
      top: ['Bergamot', 'Orange Blossom', 'Rose'],
      middle: ['Jasmine', 'Patchouli', 'Sandalwood'],
      base: ['Vanilla', 'Amber', 'Musk', 'Leather']
    },
    accords: [
      { name: 'floral', intensity: 85, color: '#E9C46A' },
      { name: 'amber', intensity: 80, color: '#F4A261' },
      { name: 'woody', intensity: 70, color: '#8B4513' }
    ],
    description: 'A sophisticated oriental floral with animalic undertones. Elegant, sensual, and deeply luxurious with a modern edge.',
    price: 485,
    image: '/perfume-images/byredo-animalique.jpg',
    rating: 4.6,
    reviewCount: 543,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'special', 'formal'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2022,
    perfumer: 'Francis Kurkdjian',
    size: 70,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    category: 'woody',
    notes: {
      top: ['Grapefruit', 'Lemon', 'Mint', 'Pink Pepper'],
      middle: ['Ginger', 'Nutmeg', 'Jasmine', 'Melon'],
      base: ['Incense', 'Vetiver', 'Cedar', 'Sandalwood', 'Patchouli', 'Labdanum']
    },
    description: 'A woody aromatic fragrance for the man who defies convention. Fresh citrus with warm woods and aromatic herbs.',
    price: 155,
    image: '/perfume-images/chanel-bleu-de-chanel.jpg',
    rating: 4.7,
    reviewCount: 2387,
    gender: 'men',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['office', 'casual', 'formal'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2010,
    perfumer: 'Jacques Polge',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '16',
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    category: 'floral',
    notes: {
      top: ['Orange', 'Bergamot', 'Grapefruit'],
      middle: ['Rose', 'Jasmine', 'Lychee', 'Italian Jasmine'],
      base: ['Patchouli', 'Vanilla', 'Vetiver', 'White Musk']
    },
    description: 'A modern, elegant fragrance with fresh citrus and floral notes. The perfect balance of sophistication and youthful energy.',
    price: 155,
    image: '/perfume-images/chanel-coco-mademoiselle.jpg',
    rating: 4.7,
    reviewCount: 4521,
    gender: 'women',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['casual', 'office', 'date'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2001,
    perfumer: 'Jacques Polge',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '24',
    name: 'Outlands',
    brand: 'Amouage',
    category: 'oriental',
    notes: {
      top: ['Lemon', 'Bergamot', 'Citrus'],
      middle: ['Patchouli', 'Rose', 'Oud'],
      base: ['Amber', 'Resin', 'Musk', 'Sandalwood']
    },
    accords: [
      { name: 'amber', intensity: 90, color: '#F4A261' },
      { name: 'earthy', intensity: 80, color: '#6B4226' },
      { name: 'citrus', intensity: 60, color: '#FEE440' },
      { name: 'woody', intensity: 75, color: '#8B4513' }
    ],
    description: 'An invitation to journey into the beyond. Bright citrus opens into a lush, humid patchouli before descending into a magnetic amber and resin base.',
    price: 425,
    image: '/perfume-images/amouage-outlands.jpg',
    rating: 4.6,
    reviewCount: 312,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'special', 'formal'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2023,
    perfumer: 'Cécile Zarokian',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '25',
    name: 'Blonde Amber',
    brand: 'Clive Christian',
    category: 'oriental',
    notes: {
      top: ['Rum', 'Frankincense', 'Bitter Orange', 'Cardamom', 'Ginger', 'Grapefruit'],
      middle: ['Blonde Tobacco', 'Tuberose', 'Jasmine', 'Dried Fruits'],
      base: ['Tonka Bean', 'Myrrh', 'Vanilla', 'Labdanum', 'Patchouli', 'Cedar', 'Musk', 'Vetiver']
    },
    accords: [
      { name: 'amber', intensity: 100, color: '#F4A261' },
      { name: 'smoky', intensity: 80, color: '#4A4A4A' },
      { name: 'floral', intensity: 70, color: '#E9C46A' },
      { name: 'woody', intensity: 65, color: '#8B4513' }
    ],
    description: 'Art Deco decadence in a bottle. Warm amber spiced with aromatic blonde tobacco, a riot of florals and dried fruits — indulgent, sensuous, and deeply luxurious.',
    price: 525,
    image: '/perfume-images/clive-christian-blonde-amber.jpg',
    rating: 4.7,
    reviewCount: 287,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'special', 'date'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2021,
    perfumer: 'Clive Christian',
    size: 50,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Sauvage',
    brand: 'Dior',
    category: 'fresh',
    notes: {
      top: ['Calabrian Bergamot', 'Pepper'],
      middle: ['Sichuan Pepper', 'Lavender', 'Pink Pepper', 'Vetiver', 'Patchouli', 'Geranium', 'Elemi'],
      base: ['Ambroxan', 'Cedar', 'Labdanum']
    },
    description: 'A wild and noble fragrance. Fresh bergamot with spicy pepper and woody ambroxan create a magnetic masculinity.',
    price: 135,
    image: '/perfume-images/dior-sauvage.jpg',
    rating: 4.6,
    reviewCount: 2934,
    gender: 'men',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['casual', 'office', 'date'],
    longevity: 'long-lasting',
    sillage: 'strong',
    concentration: 'edt',
    releaseYear: 2015,
    perfumer: 'François Demachy',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '17',
    name: "J'adore",
    brand: 'Dior',
    category: 'floral',
    notes: {
      top: ['Pear', 'Melon', 'Bergamot', 'Mandarin Orange'],
      middle: ['Jasmine', 'Lily of the Valley', 'Tuberose', 'Freesia', 'Rose', 'Orchid', 'Plum'],
      base: ['Musk', 'Vanilla', 'Blackberry', 'Cedar']
    },
    description: 'A luminous floral bouquet. An ode to women, their audacity, and their beauty. Sensual and sophisticated.',
    price: 135,
    image: '/perfume-images/dior-jadore.jpg',
    rating: 4.6,
    reviewCount: 3892,
    gender: 'women',
    seasons: ['spring', 'summer'],
    occasions: ['evening', 'special', 'date'],
    longevity: 'long-lasting',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 1999,
    perfumer: 'Calice Becker',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '28',
    name: 'Purpose 50',
    brand: 'Amouage',
    category: 'floral',
    notes: {
      top: ['Black Currant', 'Bergamot', 'Rose'],
      middle: ['Rose', 'Jasmine', 'Patchouli'],
      base: ['Amber', 'Patchouli', 'Sandalwood']
    },
    accords: [
      { name: 'floral', intensity: 95, color: '#E9C46A' },
      { name: 'fruity', intensity: 75, color: '#FF6B6B' },
      { name: 'woody', intensity: 70, color: '#8B4513' }
    ],
    description: 'A masterpiece of rose and blackcurrant. Elegant, sophisticated, and timelessly beautiful - a true portrait of feminine grace.',
    price: 395,
    image: '/perfume-images/amouage-purpose-50.jpg',
    rating: 4.8,
    reviewCount: 1234,
    gender: 'women',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['evening', 'special', 'formal'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2010,
    perfumer: 'Dominique Ropion',
    size: 50,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '14',
    name: 'Bianco Latte',
    brand: 'Giardini di Toscana',
    category: 'gourmand',
    notes: {
      top: ['Milk', 'Honey', 'Star Anise'],
      middle: ['White Chocolate', 'Coconut', 'Rice'],
      base: ['Vanilla', 'Sandalwood', 'White Musk']
    },
    description: 'A creamy, milky gourmand fragrance. Soft, comforting, and irresistibly sweet like warm milk and honey.',
    price: 165,
    image: '/perfume-images/giardini-bianco-latte.jpg',
    rating: 4.4,
    reviewCount: 678,
    gender: 'unisex',
    seasons: ['autumn', 'winter', 'spring'],
    occasions: ['casual', 'date', 'evening'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2018,
    perfumer: 'Silvia Monti',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '15',
    name: 'Vanilla Powder',
    brand: 'Giardini di Toscana',
    category: 'gourmand',
    notes: {
      top: ['Vanilla', 'Powdery Notes', 'Bergamot'],
      middle: ['Iris', 'Heliotrope', 'Almond'],
      base: ['Vanilla', 'Sandalwood', 'White Musk', 'Tonka Bean']
    },
    description: 'A soft, powdery vanilla fragrance. Delicate, comforting, and elegantly sweet like fine vanilla powder.',
    price: 165,
    image: '/perfume-images/giardini-vanilla-powder.jpg',
    rating: 4.3,
    reviewCount: 543,
    gender: 'unisex',
    seasons: ['autumn', 'winter', 'spring'],
    occasions: ['casual', 'date', 'office'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2018,
    perfumer: 'Silvia Monti',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '19',
    name: 'La Vie Est Belle',
    brand: 'Lancôme',
    category: 'gourmand',
    notes: {
      top: ['Black Currant', 'Pear'],
      middle: ['Iris', 'Jasmine', 'Orange Blossom'],
      base: ['Praline', 'Vanilla', 'Patchouli', 'Tonka Bean']
    },
    description: 'Life is beautiful. A sweet, sophisticated gourmand with iris and praline. Happiness in a bottle.',
    price: 135,
    image: '/perfume-images/lancome-la-vie-est-belle.jpg',
    rating: 4.4,
    reviewCount: 4167,
    gender: 'women',
    seasons: ['autumn', 'winter', 'spring'],
    occasions: ['casual', 'office', 'date'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2012,
    perfumer: 'Olivier Polge, Dominique Ropion, Anne Flipo',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    name: 'Imagination',
    brand: 'Louis Vuitton',
    category: 'woody',
    notes: {
      top: ['Bergamot', 'Ginger', 'Pink Pepper'],
      middle: ['Tea', 'Neroli', 'Orange Blossom'],
      base: ['Ambroxan', 'Sandalwood', 'Musk']
    },
    description: 'A sophisticated and modern woody fragrance. Clean, refined, and effortlessly luxurious with a contemporary edge.',
    price: 285,
    image: '/perfume-images/lv-imagination.jpg',
    rating: 4.4,
    reviewCount: 789,
    gender: 'men',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['office', 'casual', 'formal'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2018,
    perfumer: 'Jacques Cavallier Belletrud',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '23',
    name: 'Ombre Nomade',
    brand: 'Louis Vuitton',
    category: 'oriental',
    notes: {
      top: ['Incense', 'Raspberry'],
      middle: ['Oud Wood', 'Rose', 'Benzoin'],
      base: ['Amberwood', 'Leather', 'Musk']
    },
    accords: [
      { name: 'oud', intensity: 100, color: '#6B3A2A' },
      { name: 'smoky', intensity: 85, color: '#4A4A4A' },
      { name: 'fruity', intensity: 65, color: '#E63946' },
      { name: 'woody', intensity: 80, color: '#8B4513' }
    ],
    description: 'A rebellious oud masterpiece. Smoky incense and sweet raspberry open into precious oud and rose, deepening into a warm, enveloping benzoin and amberwood base.',
    price: 480,
    image: '/perfume-images/lv-ombre-nomade.jpg',
    rating: 4.8,
    reviewCount: 1876,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'special', 'date'],
    longevity: 'eternal',
    sillage: 'enormous',
    concentration: 'edp',
    releaseYear: 2018,
    perfumer: 'Jacques Cavallier Belletrud',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '11',
    name: 'Pacific Chill',
    brand: 'Louis Vuitton',
    category: 'fresh',
    notes: {
      top: ['Ginger', 'Bergamot', 'Mandarin'],
      middle: ['Mint', 'Eucalyptus', 'Lavender'],
      base: ['Sandalwood', 'Cedar', 'Musk']
    },
    description: 'A refreshing and invigorating fragrance inspired by ocean breezes. Cool, clean, and utterly relaxing.',
    price: 285,
    image: '/perfume-images/lv-pacific-chill.jpg',
    rating: 4.2,
    reviewCount: 567,
    gender: 'unisex',
    seasons: ['spring', 'summer'],
    occasions: ['casual', 'sport', 'office'],
    longevity: 'moderate',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2018,
    perfumer: 'Jacques Cavallier Belletrud',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '22',
    name: 'Stellar Times',
    brand: 'Louis Vuitton',
    category: 'oriental',
    notes: {
      top: ['Orange Blossom', 'Bergamot', 'Mandarin'],
      middle: ['Peru Balsam', 'Rose', 'Jasmine'],
      base: ['Amber', 'Sandalwood', 'Musk', 'Vanilla']
    },
    accords: [
      { name: 'amber', intensity: 95, color: '#F4A261' },
      { name: 'floral', intensity: 75, color: '#E9C46A' },
      { name: 'woody', intensity: 60, color: '#8B4513' }
    ],
    description: 'A subliminal journey through time. Golden orange blossom swirls on a transfigured amber accord, evoking legendary temples and marvellous fountains.',
    price: 620,
    image: '/perfume-images/lv-stellar-times.jpg',
    rating: 4.7,
    reviewCount: 432,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'special', 'formal'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2019,
    perfumer: 'Jacques Cavallier Belletrud',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Althair',
    brand: 'Parfums de Marly',
    category: 'oriental',
    notes: {
      top: ['Cardamom', 'Cinnamon', 'Orange', 'Bergamot'],
      middle: ['Bourbon Vanilla', 'Rose', 'Jasmine'],
      base: ['Vanilla', 'Sandalwood', 'Amberwood', 'Guaiac Wood', 'Musk']
    },
    description: 'A sophisticated oriental fragrance with warm spices and creamy vanilla. Elegant, refined, and utterly captivating.',
    price: 225,
    image: '/perfume-images/pdm-althair.jpg',
    rating: 4.5,
    reviewCount: 1234,
    gender: 'men',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'date', 'formal'],
    longevity: 'long-lasting',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2019,
    perfumer: 'Hamid Merati-Kashani',
    size: 125,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    name: 'L\'Homme',
    brand: 'Prada',
    category: 'fresh',
    notes: {
      top: ['Neroli', 'Black Pepper', 'Cardamom'],
      middle: ['Iris', 'Violet', 'Geranium'],
      base: ['Sandalwood', 'Cedar', 'Patchouli']
    },
    description: 'A modern interpretation of classic masculinity. Fresh, sophisticated, and elegantly refined.',
    price: 95,
    image: '/perfume-images/prada-lhomme.jpg',
    rating: 4.3,
    reviewCount: 1456,
    gender: 'men',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['office', 'casual', 'formal'],
    longevity: 'moderate',
    sillage: 'moderate',
    concentration: 'edt',
    releaseYear: 2016,
    perfumer: 'Daniela Andrier',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '20',
    name: 'Flowerbomb',
    brand: 'Viktor & Rolf',
    category: 'floral',
    notes: {
      top: ['Tea', 'Bergamot', 'Osmanthus'],
      middle: ['Sambac Jasmine', 'Orchid', 'Freesia', 'Rose'],
      base: ['Patchouli', 'Musk', 'Amber']
    },
    description: 'An explosive floral bouquet. A powerful, positive, addictive fragrance. Like a burst of flowers.',
    price: 155,
    image: '/perfume-images/viktor-rolf-flowerbomb.jpg',
    rating: 4.6,
    reviewCount: 3745,
    gender: 'women',
    seasons: ['spring', 'autumn', 'winter'],
    occasions: ['evening', 'special', 'date'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2005,
    perfumer: 'Olivier Polge, Carlos Benaim, Domitille Bertier',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '13',
    name: 'Naxos',
    brand: 'Xerjoff',
    category: 'oriental',
    notes: {
      top: ['Bergamot', 'Lemon', 'Lavender'],
      middle: ['Cinnamon', 'Honey', 'Cashmeran'],
      base: ['Vanilla', 'Tobacco Leaf', 'Sandalwood']
    },
    description: 'A luxurious oriental fragrance with Mediterranean influences. Warm, sophisticated, and utterly captivating.',
    price: 225,
    image: '/perfume-images/xerjoff-naxos.jpg',
    rating: 4.6,
    reviewCount: 892,
    gender: 'unisex',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'date', 'special'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2015,
    perfumer: 'Chris Maurice',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Babycat',
    brand: 'Yves Saint Laurent',
    category: 'gourmand',
    notes: {
      top: ['Black Currant', 'Ginger'],
      middle: ['Peach', 'Fig', 'Carrot Seeds'],
      base: ['Ambroxan', 'Cashmeran', 'Ambergris']
    },
    description: 'A playful and modern gourmand fragrance. Sweet, fruity, and irresistibly charming with a contemporary edge.',
    price: 280,
    image: '/perfume-images/ysl-babycat.jpg',
    rating: 4.3,
    reviewCount: 987,
    gender: 'unisex',
    seasons: ['spring', 'summer'],
    occasions: ['casual', 'date', 'office'],
    longevity: 'moderate',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2021,
    perfumer: 'Dora Baghriche',
    size: 75,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '18',
    name: 'Black Opium',
    brand: 'Yves Saint Laurent',
    category: 'oriental',
    notes: {
      top: ['Pink Pepper', 'Orange Blossom', 'Pear'],
      middle: ['Coffee', 'Jasmine', 'Bitter Almond', 'Licorice'],
      base: ['Vanilla', 'Patchouli', 'Cedar', 'Cashmere Wood']
    },
    description: 'A seductive, addictive fragrance. Coffee and vanilla create an intoxicating blend. Bold, modern, and unforgettable.',
    price: 163,
    image: '/perfume-images/ysl-black-opium.jpg',
    rating: 4.5,
    reviewCount: 5234,
    gender: 'women',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'special', 'date'],
    longevity: 'eternal',
    sillage: 'strong',
    concentration: 'edp',
    releaseYear: 2014,
    perfumer: 'Nathalie Lorson, Marie Salamagne, Olivier Cresp, Honorine Blanc',
    size: 90,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Caban',
    brand: 'Yves Saint Laurent',
    category: 'woody',
    notes: {
      top: ['Ginger', 'Black Pepper', 'Bergamot'],
      middle: ['Patchouli', 'Sandalwood', 'Cedar'],
      base: ['Vanilla', 'Benzoin', 'Labdanum']
    },
    description: 'A warm and enveloping woody fragrance. Sophisticated, masculine, and deeply comforting like a cashmere coat.',
    price: 250,
    image: '/perfume-images/ysl-caban.jpg',
    rating: 4.2,
    reviewCount: 876,
    gender: 'men',
    seasons: ['autumn', 'winter'],
    occasions: ['evening', 'formal', 'date'],
    longevity: 'long-lasting',
    sillage: 'moderate',
    concentration: 'edp',
    releaseYear: 2021,
    perfumer: 'Dora Baghriche',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'Y',
    brand: 'Yves Saint Laurent',
    category: 'fresh',
    notes: {
      top: ['Apple', 'Ginger', 'Bergamot', 'Lemon'],
      middle: ['Sage', 'Juniper Berries', 'Geranium'],
      base: ['Amberwood', 'Tonka Bean', 'Cedar', 'Vetiver', 'Olibanum']
    },
    description: 'A fresh and modern fragrance for the contemporary man. Crisp, clean, and effortlessly sophisticated.',
    price: 115,
    image: '/perfume-images/ysl-y.jpg',
    rating: 4.4,
    reviewCount: 1567,
    gender: 'men',
    seasons: ['spring', 'summer', 'autumn'],
    occasions: ['casual', 'office', 'sport'],
    longevity: 'moderate',
    sillage: 'moderate',
    concentration: 'edt',
    releaseYear: 2017,
    perfumer: 'Dominique Ropion',
    size: 100,
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCollections: PerfumeCollection[] = [
  {
    id: 'collection-1',
    userId: 'user-1',
    name: 'Evening Elegance',
    description: 'My favorite sophisticated fragrances for special occasions',
    perfumeIds: ['1', '2', '13'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 'collection-2',
    userId: 'user-1',
    name: 'Fresh & Clean',
    description: 'Light, fresh scents perfect for everyday wear',
    perfumeIds: ['4', '7', '12'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z'
  },
  {
    id: 'collection-3',
    userId: 'user-1',
    name: 'Luxury Collection',
    description: 'High-end niche fragrances for the connoisseur',
    perfumeIds: ['1', '10', '13'],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-22T09:45:00Z'
  }
];

// Helper function to get perfumes by IDs
export function getPerfumesByIds(ids: string[]): Perfume[] {
  return mockPerfumes.filter(perfume => ids.includes(perfume.id));
}

// Helper function to search perfumes
export function searchMockPerfumes(query: string): Perfume[] {
  const searchTerm = query.toLowerCase();
  return mockPerfumes.filter(perfume => 
    perfume.name.toLowerCase().includes(searchTerm) ||
    perfume.brand.toLowerCase().includes(searchTerm) ||
    perfume.description.toLowerCase().includes(searchTerm) ||
    perfume.category.toLowerCase().includes(searchTerm) ||
    perfume.notes.top.some(note => note.toLowerCase().includes(searchTerm)) ||
    perfume.notes.middle.some(note => note.toLowerCase().includes(searchTerm)) ||
    perfume.notes.base.some(note => note.toLowerCase().includes(searchTerm))
  );
}

// Helper function to filter perfumes
export function filterMockPerfumes(perfumes: Perfume[], filters: any): Perfume[] {
  return perfumes.filter(perfume => {
    if (filters.category && perfume.category !== filters.category) return false;
    if (filters.brand && perfume.brand !== filters.brand) return false;
    if (filters.gender && perfume.gender !== filters.gender) return false;
    if (filters.minPrice && perfume.price < filters.minPrice) return false;
    if (filters.maxPrice && perfume.price > filters.maxPrice) return false;
    if (filters.inStock !== undefined && perfume.inStock !== filters.inStock) return false;
    if (filters.seasons?.length && !filters.seasons.some((season: string) => perfume.seasons.includes(season as any))) return false;
    if (filters.occasions?.length && !filters.occasions.some((occasion: string) => perfume.occasions.includes(occasion as any))) return false;
    return true;
  });
}
