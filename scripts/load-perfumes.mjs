import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const perfumes = [
  {
    id: "1", name: "Aventus", brand: "Creed", category: "chypre",
    notes: { top: ["Pineapple","Bergamot","Black Currant","Apple"], middle: ["Birch","Patchouli","Moroccan Jasmine","Rose"], base: ["Musk","Oak Moss","Ambergris","Vanilla"] },
    description: "A legendary fragrance inspired by Napoleon's dramatic life. Fruity opening with smoky birch and elegant woods.",
    price: 425, image: "/perfume-images/creed-aventus.jpg", rating: 4.9, reviewCount: 3456,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["formal","special","evening"],
    longevity: "eternal", sillage: "enormous", concentration: "parfum", releaseYear: 2010,
    perfumer: "Olivier Creed", size: 120, inStock: true
  },
  {
    id: "21", name: "Silver Mountain Water", brand: "Creed", category: "fresh",
    notes: { top: ["Bergamot","Green Tea","Mandarin"], middle: ["Black Currant","Galbanum"], base: ["Musk","Sandalwood","Petitgrain"] },
    description: "A crystalline aquatic aromatic that captures mountain air and glacier water.",
    price: 375, image: "/perfume-images/creed-silver-mountain-water.jpg", rating: 4.8, reviewCount: 4225,
    gender: "unisex", seasons: ["spring","summer"], occasions: ["casual","office"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 1999,
    perfumer: "Olivier Creed", size: 100, inStock: true
  },
  {
    id: "2", name: "Angel's Share", brand: "By Kilian", category: "gourmand",
    notes: { top: ["Cognac","Cinnamon","Oak"], middle: ["Tonka Bean","Praline","Hazelnut"], base: ["Vanilla","Sandalwood","Akigalawood"] },
    description: "A warm, boozy gourmand fragrance inspired by the angel's share of aging cognac.",
    price: 325, image: "/perfume-images/by-kilian-angels-share.jpg", rating: 4.7, reviewCount: 1876,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","date","special"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2020,
    perfumer: "Benoist Lapouza", size: 50, inStock: true
  },
  {
    id: "3", name: "Bleu de Chanel", brand: "Chanel", category: "woody",
    notes: { top: ["Grapefruit","Lemon","Mint","Pink Pepper"], middle: ["Ginger","Nutmeg","Jasmine","Melon"], base: ["Incense","Vetiver","Cedar","Sandalwood","Patchouli","Labdanum"] },
    description: "A woody aromatic fragrance for the man who defies convention.",
    price: 155, image: "/perfume-images/chanel-bleu-de-chanel.jpg", rating: 4.7, reviewCount: 2387,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["office","casual","formal"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2010,
    perfumer: "Jacques Polge", size: 100, inStock: true
  },
  {
    id: "16", name: "Coco Mademoiselle", brand: "Chanel", category: "floral",
    notes: { top: ["Orange","Bergamot","Grapefruit"], middle: ["Rose","Jasmine","Lychee","Italian Jasmine"], base: ["Patchouli","Vanilla","Vetiver","White Musk"] },
    description: "A modern, elegant fragrance with fresh citrus and floral notes.",
    price: 155, image: "/perfume-images/chanel-coco-mademoiselle.jpg", rating: 4.7, reviewCount: 4521,
    gender: "women", seasons: ["spring","summer","autumn"], occasions: ["casual","office","date"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2001,
    perfumer: "Jacques Polge", size: 100, inStock: true
  },
  {
    id: "25", name: "Blonde Amber", brand: "Clive Christian", category: "oriental",
    notes: { top: ["Rum","Frankincense","Bitter Orange","Cardamom","Ginger","Grapefruit"], middle: ["Blonde Tobacco","Tuberose","Jasmine","Dried Fruits"], base: ["Tonka Bean","Myrrh","Vanilla","Labdanum","Patchouli","Cedar","Musk","Vetiver"] },
    description: "Art Deco decadence in a bottle. Warm amber spiced with aromatic blonde tobacco.",
    price: 525, image: "/perfume-images/clive-christian-blonde-amber.jpg", rating: 4.7, reviewCount: 287,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","special","date"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2021,
    perfumer: "Clive Christian", size: 50, inStock: true
  },
  {
    id: "4", name: "Sauvage", brand: "Dior", category: "fresh",
    notes: { top: ["Calabrian Bergamot","Pepper"], middle: ["Sichuan Pepper","Lavender","Pink Pepper","Vetiver","Patchouli","Geranium","Elemi"], base: ["Ambroxan","Cedar","Labdanum"] },
    description: "A wild and noble fragrance. Fresh bergamot with spicy pepper and woody ambroxan.",
    price: 135, image: "/perfume-images/dior-sauvage.jpg", rating: 4.6, reviewCount: 2934,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["casual","office","date"],
    longevity: "long-lasting", sillage: "strong", concentration: "edt", releaseYear: 2015,
    perfumer: "François Demachy", size: 100, inStock: true
  },
  {
    id: "17", name: "J'adore", brand: "Dior", category: "floral",
    notes: { top: ["Pear","Melon","Bergamot","Mandarin Orange"], middle: ["Jasmine","Lily of the Valley","Tuberose","Freesia","Rose","Orchid","Plum"], base: ["Musk","Vanilla","Blackberry","Cedar"] },
    description: "A luminous floral bouquet. An ode to women, their audacity, and their beauty.",
    price: 135, image: "/perfume-images/dior-jadore.jpg", rating: 4.6, reviewCount: 3892,
    gender: "women", seasons: ["spring","summer"], occasions: ["evening","special","date"],
    longevity: "long-lasting", sillage: "strong", concentration: "edp", releaseYear: 1999,
    perfumer: "Calice Becker", size: 100, inStock: true
  },
  {
    id: "9", name: "Blue Talisman", brand: "Ex Nihilo", category: "woody",
    notes: { top: ["Pear","Bergamot","Mandarin","Ginger"], middle: ["Orange Blossom","Violet","Musk"], base: ["Amber","Sandalwood","Musk"] },
    description: "A hypnotic jewel from Ex Nihilo Paris. Juicy citrus and ginger open into a clean woody-amber heart.",
    price: 325, image: "/perfume-images/ex-nihilo-blue-talisman.jpg", rating: 4.3, reviewCount: 654,
    gender: "unisex", seasons: ["spring","summer","autumn"], occasions: ["casual","office","date"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2023,
    perfumer: "Ex Nihilo", size: 100, inStock: true
  },
  {
    id: "14", name: "Bianco Latte", brand: "Giardini di Toscana", category: "gourmand",
    notes: { top: ["Milk","Honey","Star Anise"], middle: ["White Chocolate","Coconut","Rice"], base: ["Vanilla","Sandalwood","White Musk"] },
    description: "A creamy, milky gourmand fragrance. Soft, comforting, and irresistibly sweet.",
    price: 165, image: "/perfume-images/giardini-bianco-latte.jpg", rating: 4.4, reviewCount: 678,
    gender: "unisex", seasons: ["autumn","winter","spring"], occasions: ["casual","date","evening"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2018,
    perfumer: "Silvia Monti", size: 100, inStock: true
  },
  {
    id: "15", name: "Vanilla Powder", brand: "Giardini di Toscana", category: "gourmand",
    notes: { top: ["Vanilla","Powdery Notes","Bergamot"], middle: ["Iris","Heliotrope","Almond"], base: ["Vanilla","Sandalwood","White Musk","Tonka Bean"] },
    description: "A soft, powdery vanilla fragrance. Delicate, comforting, and elegantly sweet.",
    price: 165, image: "/perfume-images/giardini-vanilla-powder.jpg", rating: 4.3, reviewCount: 543,
    gender: "unisex", seasons: ["autumn","winter","spring"], occasions: ["casual","date","office"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2018,
    perfumer: "Silvia Monti", size: 100, inStock: true
  },
  {
    id: "27", name: "Side Effect", brand: "Initio Parfums Privés", category: "oriental",
    notes: { top: ["Rum","Cinnamon Bark","Saffron"], middle: ["Tobacco","Hedione","Vanilla"], base: ["Sandalwood","Musk","Leather","Amber"] },
    description: "Hypnotic and addictive. Rum and cinnamon open into a seductive tobacco and vanilla heart.",
    price: 400, image: "/perfume-images/initio-side-effect.jpg", rating: 4.8, reviewCount: 1243,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","date","special"],
    longevity: "eternal", sillage: "enormous", concentration: "edp", releaseYear: 2018,
    perfumer: "Initio", size: 90, inStock: true
  },
  {
    id: "19", name: "La Vie Est Belle", brand: "Lancôme", category: "gourmand",
    notes: { top: ["Black Currant","Pear"], middle: ["Iris","Jasmine","Orange Blossom"], base: ["Praline","Vanilla","Patchouli","Tonka Bean"] },
    description: "Life is beautiful. A sweet, sophisticated gourmand with iris and praline.",
    price: 135, image: "/perfume-images/lancome-la-vie-est-belle.jpg", rating: 4.4, reviewCount: 4167,
    gender: "women", seasons: ["autumn","winter","spring"], occasions: ["casual","office","date"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2012,
    perfumer: "Olivier Polge", size: 100, inStock: true
  },
  {
    id: "10", name: "Imagination", brand: "Louis Vuitton", category: "woody",
    notes: { top: ["Bergamot","Ginger","Pink Pepper"], middle: ["Tea","Neroli","Orange Blossom"], base: ["Ambroxan","Sandalwood","Musk"] },
    description: "A sophisticated and modern woody fragrance. Clean, refined, and effortlessly luxurious.",
    price: 285, image: "/perfume-images/lv-imagination.jpg", rating: 4.4, reviewCount: 789,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["office","casual","formal"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2018,
    perfumer: "Jacques Cavallier Belletrud", size: 100, inStock: true
  },
  {
    id: "23", name: "Ombre Nomade", brand: "Louis Vuitton", category: "oriental",
    notes: { top: ["Incense","Raspberry"], middle: ["Oud Wood","Rose","Benzoin"], base: ["Amberwood","Leather","Musk"] },
    description: "A rebellious oud masterpiece. Smoky incense and sweet raspberry open into precious oud and rose.",
    price: 480, image: "/perfume-images/lv-ombre-nomade.jpg", rating: 4.8, reviewCount: 1876,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","special","date"],
    longevity: "eternal", sillage: "enormous", concentration: "edp", releaseYear: 2018,
    perfumer: "Jacques Cavallier Belletrud", size: 100, inStock: true
  },
  {
    id: "11", name: "Pacific Chill", brand: "Louis Vuitton", category: "fresh",
    notes: { top: ["Ginger","Bergamot","Mandarin"], middle: ["Mint","Eucalyptus","Lavender"], base: ["Sandalwood","Cedar","Musk"] },
    description: "A refreshing and invigorating fragrance inspired by ocean breezes.",
    price: 285, image: "/perfume-images/lv-pacific-chill.jpg", rating: 4.2, reviewCount: 567,
    gender: "unisex", seasons: ["spring","summer"], occasions: ["casual","sport","office"],
    longevity: "moderate", sillage: "moderate", concentration: "edp", releaseYear: 2018,
    perfumer: "Jacques Cavallier Belletrud", size: 100, inStock: true
  },
  {
    id: "22", name: "Stellar Times", brand: "Louis Vuitton", category: "oriental",
    notes: { top: ["Orange Blossom","Bergamot","Mandarin"], middle: ["Peru Balsam","Rose","Jasmine"], base: ["Amber","Sandalwood","Musk","Vanilla"] },
    description: "A subliminal journey through time. Golden orange blossom on a transfigured amber accord.",
    price: 620, image: "/perfume-images/lv-stellar-times.jpg", rating: 4.7, reviewCount: 432,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","special","formal"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2019,
    perfumer: "Jacques Cavallier Belletrud", size: 100, inStock: true
  },
  {
    id: "5", name: "Althair", brand: "Parfums de Marly", category: "oriental",
    notes: { top: ["Cardamom","Cinnamon","Orange","Bergamot"], middle: ["Bourbon Vanilla","Rose","Jasmine"], base: ["Vanilla","Sandalwood","Amberwood","Guaiac Wood","Musk"] },
    description: "A sophisticated oriental fragrance with warm spices and creamy vanilla.",
    price: 225, image: "/perfume-images/pdm-althair.jpg", rating: 4.5, reviewCount: 1234,
    gender: "men", seasons: ["autumn","winter"], occasions: ["evening","date","formal"],
    longevity: "long-lasting", sillage: "strong", concentration: "edp", releaseYear: 2019,
    perfumer: "Hamid Merati-Kashani", size: 125, inStock: true
  },
  {
    id: "12", name: "L'Homme", brand: "Prada", category: "fresh",
    notes: { top: ["Neroli","Black Pepper","Cardamom"], middle: ["Iris","Violet","Geranium"], base: ["Sandalwood","Cedar","Patchouli"] },
    description: "A modern interpretation of classic masculinity. Fresh, sophisticated, and elegantly refined.",
    price: 95, image: "/perfume-images/prada-lhomme.jpg", rating: 4.3, reviewCount: 1456,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["office","casual","formal"],
    longevity: "moderate", sillage: "moderate", concentration: "edt", releaseYear: 2016,
    perfumer: "Daniela Andrier", size: 100, inStock: true
  },
  {
    id: "20", name: "Flowerbomb", brand: "Viktor & Rolf", category: "floral",
    notes: { top: ["Tea","Bergamot","Osmanthus"], middle: ["Sambac Jasmine","Orchid","Freesia","Rose"], base: ["Patchouli","Musk","Amber"] },
    description: "An explosive floral bouquet. A powerful, positive, addictive fragrance.",
    price: 155, image: "/perfume-images/viktor-rolf-flowerbomb.jpg", rating: 4.6, reviewCount: 3745,
    gender: "women", seasons: ["spring","autumn","winter"], occasions: ["evening","special","date"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2005,
    perfumer: "Olivier Polge", size: 100, inStock: true
  },
  {
    id: "13", name: "Naxos", brand: "Xerjoff", category: "oriental",
    notes: { top: ["Bergamot","Lemon","Lavender"], middle: ["Cinnamon","Honey","Cashmeran"], base: ["Vanilla","Tobacco Leaf","Sandalwood"] },
    description: "A luxurious oriental fragrance with Mediterranean influences.",
    price: 225, image: "/perfume-images/xerjoff-naxos.jpg", rating: 4.6, reviewCount: 892,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","date","special"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2015,
    perfumer: "Chris Maurice", size: 100, inStock: true
  },
  {
    id: "6", name: "Babycat", brand: "Yves Saint Laurent", category: "gourmand",
    notes: { top: ["Black Currant","Ginger"], middle: ["Peach","Fig","Carrot Seeds"], base: ["Ambroxan","Cashmeran","Ambergris"] },
    description: "A playful and modern gourmand fragrance. Sweet, fruity, and irresistibly charming.",
    price: 280, image: "/perfume-images/ysl-babycat.jpg", rating: 4.3, reviewCount: 987,
    gender: "unisex", seasons: ["spring","summer"], occasions: ["casual","date","office"],
    longevity: "moderate", sillage: "moderate", concentration: "edp", releaseYear: 2021,
    perfumer: "Dora Baghriche", size: 75, inStock: true
  },
  {
    id: "18", name: "Black Opium", brand: "Yves Saint Laurent", category: "oriental",
    notes: { top: ["Pink Pepper","Orange Blossom","Pear"], middle: ["Coffee","Jasmine","Bitter Almond","Licorice"], base: ["Vanilla","Patchouli","Cedar","Cashmere Wood"] },
    description: "A seductive, addictive fragrance. Coffee and vanilla create an intoxicating blend.",
    price: 163, image: "/perfume-images/ysl-black-opium.jpg", rating: 4.5, reviewCount: 5234,
    gender: "women", seasons: ["autumn","winter"], occasions: ["evening","special","date"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2014,
    perfumer: "Nathalie Lorson", size: 90, inStock: true
  },
  {
    id: "8", name: "Caban", brand: "Yves Saint Laurent", category: "woody",
    notes: { top: ["Ginger","Black Pepper","Bergamot"], middle: ["Patchouli","Sandalwood","Cedar"], base: ["Vanilla","Benzoin","Labdanum"] },
    description: "A warm and enveloping woody fragrance. Sophisticated, masculine, and deeply comforting.",
    price: 250, image: "/perfume-images/ysl-caban.jpg", rating: 4.2, reviewCount: 876,
    gender: "men", seasons: ["autumn","winter"], occasions: ["evening","formal","date"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2021,
    perfumer: "Dora Baghriche", size: 100, inStock: true
  },
  {
    id: "7", name: "Y", brand: "Yves Saint Laurent", category: "fresh",
    notes: { top: ["Apple","Ginger","Bergamot","Lemon"], middle: ["Sage","Juniper Berries","Geranium"], base: ["Amberwood","Tonka Bean","Cedar","Vetiver","Olibanum"] },
    description: "A fresh and modern fragrance for the contemporary man.",
    price: 115, image: "/perfume-images/ysl-y.jpg", rating: 4.4, reviewCount: 1567,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["casual","office","sport"],
    longevity: "moderate", sillage: "moderate", concentration: "edt", releaseYear: 2017,
    perfumer: "Dominique Ropion", size: 100, inStock: true
  },
  {
    id: "24", name: "Outlands", brand: "Amouage", category: "oriental",
    notes: { top: ["Lemon","Bergamot","Citrus"], middle: ["Patchouli","Rose","Oud"], base: ["Amber","Resin","Musk","Sandalwood"] },
    description: "An invitation to journey into the beyond. Bright citrus into lush patchouli and magnetic amber.",
    price: 425, image: "/perfume-images/amouage-outlands.jpg", rating: 4.6, reviewCount: 312,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","special","formal"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2023,
    perfumer: "Cécile Zarokian", size: 100, inStock: true
  },
  {
    id: "28", name: "Purpose 50", brand: "Amouage", category: "oriental",
    notes: { top: ["Frankincense","Papyrus","Bergamot"], middle: ["Sand Vetiver","Rose","Incense"], base: ["Sandalwood","Vanillin","Musk","Amber"] },
    description: "A deeper, more intimate take on Purpose. Frankincense and papyrus meet creamy sandalwood.",
    price: 550, image: "/perfume-images/amouage-purpose-50.jpg", rating: 4.8, reviewCount: 198,
    gender: "unisex", seasons: ["autumn","winter"], occasions: ["evening","special","formal"],
    longevity: "eternal", sillage: "strong", concentration: "extrait", releaseYear: 2023,
    perfumer: "Amouage", size: 100, inStock: true
  },
  {
    id: "26", name: "Animalique", brand: "Byredo", category: "chypre",
    notes: { top: ["Bergamot","Lemon"], middle: ["Mimosa","Violet","Jasmine"], base: ["Suede","Amber","Tobacco Leaf","Musk"] },
    description: "A celebration of primal instinct and raw sensuality. Bright citrus into feral suede and amber.",
    price: 220, image: "/perfume-images/byredo-animalique.jpg", rating: 4.5, reviewCount: 543,
    gender: "unisex", seasons: ["autumn","winter","spring"], occasions: ["evening","date","special"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2024,
    perfumer: "Byredo", size: 50, inStock: true
  }
];

async function loadPerfumes() {
  console.log(`Loading ${perfumes.length} perfumes into DynamoDB...`);
  let success = 0;

  for (const perfume of perfumes) {
    try {
      await client.send(new PutItemCommand({
        TableName: "Perfumes",
        Item: marshall(perfume, { removeUndefinedValues: true })
      }));
      console.log(`✅ ${perfume.brand} — ${perfume.name}`);
      success++;
    } catch (err) {
      console.error(`❌ Failed: ${perfume.name}`, err.message);
    }
  }

  console.log(`\nDone! ${success}/${perfumes.length} perfumes loaded.`);
}

loadPerfumes();
