import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const newPerfumes = [
  // Stronger With You line
  {
    id: "29", name: "Stronger With You", brand: "Emporio Armani", category: "oriental",
    notes: { top: ["Pink Pepper","Cardamom","Violet Leaf"], middle: ["Chestnut","Sage","Lavender"], base: ["Vanilla","Sandalwood","Musk","Cashmere Wood"] },
    description: "The original and iconic. A warm, spicy-sweet fragrance built around chestnut and vanilla.",
    price: 95, image: "/perfume-images/armani-stronger-with-you.jpg", rating: 4.5, reviewCount: 8234,
    gender: "men", seasons: ["autumn","winter"], occasions: ["date","evening","casual"],
    longevity: "long-lasting", sillage: "strong", concentration: "edt", releaseYear: 2017,
    perfumer: "Quentin Bisch", size: 100, inStock: true
  },
  {
    id: "30", name: "Stronger With You Intensely", brand: "Emporio Armani", category: "oriental",
    notes: { top: ["Pink Pepper","Cardamom"], middle: ["Chestnut","Lavender","Sage"], base: ["Vanilla","Tonka Bean","Musk","Amber"] },
    description: "A richer, deeper take on the original. More vanilla, more tonka, more intensity.",
    price: 115, image: "/perfume-images/armani-stronger-with-you-intensely.jpg", rating: 4.7, reviewCount: 6543,
    gender: "men", seasons: ["autumn","winter"], occasions: ["evening","date","special"],
    longevity: "eternal", sillage: "enormous", concentration: "edp", releaseYear: 2019,
    perfumer: "Quentin Bisch", size: 100, inStock: true
  },
  {
    id: "31", name: "Stronger With You Only", brand: "Emporio Armani", category: "fresh",
    notes: { top: ["Grapefruit"], middle: ["Lavender","Geranium"], base: ["Vanilla","Chestnut","Labdanum"] },
    description: "The fresh, daytime version of the Stronger With You family.",
    price: 95, image: "/perfume-images/armani-stronger-with-you-only.jpg", rating: 4.3, reviewCount: 3421,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["casual","office","date"],
    longevity: "moderate", sillage: "moderate", concentration: "edt", releaseYear: 2022,
    perfumer: "Quentin Bisch", size: 100, inStock: true
  },
  // JPG Le Male line
  {
    id: "32", name: "Le Male", brand: "Jean Paul Gaultier", category: "fresh",
    notes: { top: ["Mint","Bergamot","Cardamom"], middle: ["Lavender","Cumin","Cinnamon"], base: ["Vanilla","Sandalwood","Amber","Musk"] },
    description: "The iconic original. A timeless masculine fragrance — one of the best-selling men's fragrances of all time.",
    price: 85, image: "/perfume-images/jpg-le-male.jpg", rating: 4.6, reviewCount: 15234,
    gender: "men", seasons: ["spring","summer","autumn"], occasions: ["casual","date","office"],
    longevity: "long-lasting", sillage: "strong", concentration: "edt", releaseYear: 1995,
    perfumer: "Francis Kurkdjian", size: 125, inStock: true
  },
  {
    id: "33", name: "Le Male Elixir", brand: "Jean Paul Gaultier", category: "oriental",
    notes: { top: ["Lavender","Cardamom"], middle: ["Vanilla","Tonka Bean"], base: ["Amber","Musk","Sandalwood"] },
    description: "The most intense and seductive version of Le Male. Dark, addictive, and unforgettable.",
    price: 145, image: "/perfume-images/jpg-le-male-elixir.jpg", rating: 4.8, reviewCount: 7823,
    gender: "men", seasons: ["autumn","winter"], occasions: ["evening","date","special"],
    longevity: "eternal", sillage: "enormous", concentration: "parfum", releaseYear: 2023,
    perfumer: "Quentin Bisch", size: 125, inStock: true
  },
  {
    id: "34", name: "Le Male Le Parfum", brand: "Jean Paul Gaultier", category: "oriental",
    notes: { top: ["Mint","Bergamot"], middle: ["Lavender","Vanilla"], base: ["Tonka Bean","Amber","Musk"] },
    description: "A more refined, intense interpretation of the classic Le Male.",
    price: 120, image: "/perfume-images/jpg-le-male-le-parfum.jpg", rating: 4.6, reviewCount: 5432,
    gender: "men", seasons: ["autumn","winter","spring"], occasions: ["evening","date","formal"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2021,
    perfumer: "Quentin Bisch", size: 125, inStock: true
  },
  {
    id: "35", name: "Le Beau", brand: "Jean Paul Gaultier", category: "fresh",
    notes: { top: ["Bergamot","Coconut"], middle: ["Vetiver","Iris"], base: ["Tonka Bean","Sandalwood","Musk"] },
    description: "A fresh, tropical masculine fragrance. Coconut and bergamot into a clean vetiver heart.",
    price: 95, image: "/perfume-images/jpg-le-beau.jpg", rating: 4.5, reviewCount: 4321,
    gender: "men", seasons: ["spring","summer"], occasions: ["casual","sport","date"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edt", releaseYear: 2019,
    perfumer: "Quentin Bisch", size: 125, inStock: true
  },
  {
    id: "36", name: "Le Male Essence de Parfum", brand: "Jean Paul Gaultier", category: "oriental",
    notes: { top: ["Mint","Lavender"], middle: ["Iris","Cumin"], base: ["Vanilla","Amber","Sandalwood","Musk"] },
    description: "A concentrated, powdery-oriental take on Le Male. Iris and cumin add depth.",
    price: 130, image: "/perfume-images/jpg-le-male-essence.jpg", rating: 4.4, reviewCount: 2876,
    gender: "men", seasons: ["autumn","winter"], occasions: ["evening","formal","date"],
    longevity: "long-lasting", sillage: "strong", concentration: "edp", releaseYear: 2016,
    perfumer: "Francis Kurkdjian", size: 75, inStock: true
  },
  // Parfums de Marly top 3
  {
    id: "37", name: "Layton", brand: "Parfums de Marly", category: "oriental",
    notes: { top: ["Bergamot","Lavender","Apple","Mandarin Orange"], middle: ["Violet","Jasmine","Geranium"], base: ["Guaiac Wood","Patchouli","Sandalwood","Cardamom","Vanilla","Pepper"] },
    description: "The undisputed king of Parfums de Marly. A magnetic apple-lavender opening into warm spicy-woody heart.",
    price: 225, image: "/perfume-images/pdm-layton.jpg", rating: 4.9, reviewCount: 12543,
    gender: "unisex", seasons: ["autumn","winter","spring"], occasions: ["office","formal","date","casual"],
    longevity: "eternal", sillage: "enormous", concentration: "edp", releaseYear: 2016,
    perfumer: "Hamid Merati-Kashani", size: 125, inStock: true
  },
  {
    id: "38", name: "Pegasus", brand: "Parfums de Marly", category: "fresh",
    notes: { top: ["Heliotrope","Cumin","Bergamot"], middle: ["Bitter Almond","Lavender","Jasmine"], base: ["Vanilla","Sandalwood","Amber"] },
    description: "A soft, powdery-fresh masterpiece. Heliotrope and almond over warm vanilla-sandalwood.",
    price: 225, image: "/perfume-images/pdm-pegasus.jpg", rating: 4.8, reviewCount: 9876,
    gender: "unisex", seasons: ["spring","summer","autumn"], occasions: ["casual","office","date"],
    longevity: "long-lasting", sillage: "strong", concentration: "edp", releaseYear: 2011,
    perfumer: "Hamid Merati-Kashani", size: 125, inStock: true
  },
  {
    id: "39", name: "Herod", brand: "Parfums de Marly", category: "oriental",
    notes: { top: ["Cinnamon","Pepper"], middle: ["Tobacco","Vanilla","Osmanthus"], base: ["Sandalwood","Patchouli","Musk"] },
    description: "A rich, smoky tobacco-vanilla masterpiece. Bold, masculine, and deeply luxurious.",
    price: 225, image: "/perfume-images/pdm-herod.jpg", rating: 4.7, reviewCount: 7654,
    gender: "men", seasons: ["autumn","winter"], occasions: ["evening","special","date"],
    longevity: "eternal", sillage: "strong", concentration: "edp", releaseYear: 2012,
    perfumer: "Hamid Merati-Kashani", size: 125, inStock: true
  },
  // Individual additions
  {
    id: "40", name: "Tuxedo", brand: "Yves Saint Laurent", category: "oriental",
    notes: { top: ["Bergamot","Cardamom","Pink Pepper"], middle: ["Iris","Violet","Jasmine"], base: ["Vanilla","Sandalwood","Musk","Amber"] },
    description: "A sophisticated, powdery-floral fragrance from YSL's Le Vestiaire des Parfums.",
    price: 250, image: "/perfume-images/ysl-tuxedo.jpg", rating: 4.5, reviewCount: 2134,
    gender: "unisex", seasons: ["autumn","winter","spring"], occasions: ["formal","evening","date"],
    longevity: "long-lasting", sillage: "moderate", concentration: "edp", releaseYear: 2021,
    perfumer: "Dora Baghriche", size: 125, inStock: true
  },
  {
    id: "41", name: "Hacivat", brand: "Nishane", category: "chypre",
    notes: { top: ["Pineapple","Bergamot","Pink Pepper"], middle: ["Jasmine","Oakmoss","Patchouli"], base: ["Ambergris","Musk","Vetiver","Sandalwood"] },
    description: "A Turkish niche masterpiece. Complex, long-lasting, and utterly unique.",
    price: 295, image: "/perfume-images/nishane-hacivat.jpg", rating: 4.8, reviewCount: 5432,
    gender: "unisex", seasons: ["spring","summer","autumn"], occasions: ["casual","date","special"],
    longevity: "eternal", sillage: "enormous", concentration: "parfum", releaseYear: 2017,
    perfumer: "Nishane", size: 100, inStock: true
  },
  {
    id: "42", name: "1 Million", brand: "Paco Rabanne", category: "oriental",
    notes: { top: ["Blood Mandarin","Grapefruit","Mint"], middle: ["Rose","Cinnamon","Spices"], base: ["Leather","Amber","Patchouli","Blond Wood"] },
    description: "One of the best-selling men's fragrances in the world. Bold, flashy, and unmistakably iconic.",
    price: 110, image: "/perfume-images/paco-rabanne-1-million.jpg", rating: 4.6, reviewCount: 28765,
    gender: "men", seasons: ["autumn","winter"], occasions: ["evening","date","special"],
    longevity: "long-lasting", sillage: "strong", concentration: "edt", releaseYear: 2008,
    perfumer: "Christophe Raynaud", size: 100, inStock: true
  }
];

async function loadPerfumes() {
  console.log(`Loading ${newPerfumes.length} new perfumes into DynamoDB...`);
  let success = 0;

  for (const perfume of newPerfumes) {
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

  console.log(`\nDone! ${success}/${newPerfumes.length} perfumes loaded.`);
}

loadPerfumes();
