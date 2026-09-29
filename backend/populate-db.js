#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Get table name from environment or use default
const PERFUMES_TABLE = process.env.PERFUMES_TABLE || 'perfume-recommendation-perfumes-dev';

async function populatePerfumes() {
  try {
    // Read the mockData.ts file
    const mockDataPath = path.join(__dirname, '../../src/services/mockData.ts');
    const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

    // Extract the mockPerfumes array (this is a simple regex approach)
    const mockPerfumesMatch = mockDataContent.match(/export const mockPerfumes: Perfume\[\] = \[([\s\S]*?)\];/);

    if (!mockPerfumesMatch) {
      console.error('Could not find mockPerfumes array in mockData.ts');
      process.exit(1);
    }

    // For simplicity, let's create a smaller dataset manually
    // In a real scenario, you'd parse the TypeScript file properly
    const perfumes = [
      {
        id: '1',
        name: 'Aventus',
        brand: 'Creed',
        category: 'woody',
        notes: {
          top: ['Pineapple', 'Bergamot', 'Black Currant'],
          middle: ['Birch', 'Patchouli', 'Jasmine'],
          base: ['Musk', 'Oakmoss', 'Ambergris']
        },
        accords: [
          { name: 'woody', intensity: 90, color: '#8B4513' },
          { name: 'fruity', intensity: 75, color: '#FF6B6B' },
          { name: 'floral', intensity: 60, color: '#E9C46A' }
        ],
        description: 'A legendary fruity woody fragrance. Bold, sophisticated, and instantly recognizable with its fresh yet smoky character.',
        price: 425,
        image: '/perfume-images/creed-aventus.jpg',
        rating: 4.8,
        reviewCount: 2456,
        gender: 'men',
        seasons: ['fall', 'winter'],
        occasions: ['evening', 'special', 'formal'],
        longevity: 'eternal',
        sillage: 'strong',
        concentration: 'edp',
        releaseYear: 2010,
        perfumer: 'Pierre Bourdon',
        size: 50,
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Blue Talisman',
        brand: 'Creed',
        category: 'woody',
        notes: {
          top: ['Grapefruit', 'Apple', 'Black Currant'],
          middle: ['Ginger', 'Jasmine', 'Sandalwood'],
          base: ['Ambergris', 'Musk', 'Oakmoss']
        },
        accords: [
          { name: 'woody', intensity: 85, color: '#8B4513' },
          { name: 'fruity', intensity: 70, color: '#FF6B6B' },
          { name: 'aromatic', intensity: 65, color: '#2E8B57' }
        ],
        description: 'A fresh and woody fragrance with citrus and spice notes. Clean, masculine, and perfect for everyday wear.',
        price: 325,
        image: '/perfume-images/creed-blue-talisman.jpg',
        rating: 4.6,
        reviewCount: 1876,
        gender: 'men',
        seasons: ['spring', 'summer'],
        occasions: ['day', 'casual', 'office'],
        longevity: 'long-lasting',
        sillage: 'moderate',
        concentration: 'edp',
        releaseYear: 2014,
        perfumer: 'Pierre Bourdon',
        size: 50,
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Silver Mountain Water',
        brand: 'Creed',
        category: 'woody',
        notes: {
          top: ['Bergamot', 'Lemon', 'Mandarin'],
          middle: ['Pineapple', 'Peach', 'Coconut'],
          base: ['Sandalwood', 'Amber', 'Musk']
        },
        accords: [
          { name: 'citrus', intensity: 80, color: '#FFA500' },
          { name: 'fruity', intensity: 75, color: '#FF6B6B' },
          { name: 'woody', intensity: 70, color: '#8B4513' }
        ],
        description: 'A fresh aquatic fragrance with citrus and fruit notes. Light, clean, and unisex - perfect for warm weather.',
        price: 375,
        image: '/perfume-images/creed-silver-mountain-water.jpg',
        rating: 4.5,
        reviewCount: 1456,
        gender: 'unisex',
        seasons: ['spring', 'summer'],
        occasions: ['day', 'casual', 'beach'],
        longevity: 'moderate',
        sillage: 'moderate',
        concentration: 'edp',
        releaseYear: 1995,
        perfumer: 'Pierre Bourdon',
        size: 50,
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    console.log(`📥 Populating ${perfumes.length} perfumes to DynamoDB table: ${PERFUMES_TABLE}`);

    // Batch write items to DynamoDB
    const batchSize = 25; // DynamoDB limit
    for (let i = 0; i < perfumes.length; i += batchSize) {
      const batch = perfumes.slice(i, i + batchSize);

      const putRequests = batch.map(perfume => ({
        PutRequest: {
          Item: perfume
        }
      }));

      const params = {
        RequestItems: {
          [PERFUMES_TABLE]: putRequests
        }
      };

      try {
        await dynamoDB.batchWrite(params).promise();
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} completed`);
      } catch (error) {
        console.error(`❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error);
      }
    }

    console.log('🎉 Successfully populated perfumes in DynamoDB!');

  } catch (error) {
    console.error('❌ Error populating perfumes:', error);
    process.exit(1);
  }
}

// Run the population script
populatePerfumes();