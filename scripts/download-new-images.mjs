import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/perfume-images');

// Image URLs for new perfumes — verified Fragrantica CDN IDs
const images = [
  // Emporio Armani Stronger With You (IDs: 45258, 64501, 71505)
  { file: 'armani-stronger-with-you.jpg',           url: 'https://fimgs.net/mdimg/perfume/375x500.45258.jpg' },
  { file: 'armani-stronger-with-you-intensely.jpg', url: 'https://fimgs.net/mdimg/perfume/375x500.64501.jpg' },
  { file: 'armani-stronger-with-you-only.jpg',      url: 'https://fimgs.net/mdimg/perfume/375x500.71505.jpg' },
  // Jean Paul Gaultier (IDs: 430, 81642, 72158, 55785, 39583)
  { file: 'jpg-le-male.jpg',                        url: 'https://fimgs.net/mdimg/perfume/375x500.430.jpg' },
  { file: 'jpg-le-male-elixir.jpg',                 url: 'https://fimgs.net/mdimg/perfume/375x500.81642.jpg' },
  { file: 'jpg-le-male-le-parfum.jpg',              url: 'https://fimgs.net/mdimg/perfume/375x500.72158.jpg' },
  { file: 'jpg-le-beau.jpg',                        url: 'https://fimgs.net/mdimg/perfume/375x500.55785.jpg' },
  { file: 'jpg-le-male-essence.jpg',                url: 'https://fimgs.net/mdimg/perfume/375x500.39583.jpg' },
  // Parfums de Marly (IDs: 39314, 16938, 16939)
  { file: 'pdm-layton.jpg',                         url: 'https://fimgs.net/mdimg/perfume/375x500.39314.jpg' },
  { file: 'pdm-pegasus.jpg',                        url: 'https://fimgs.net/mdimg/perfume/375x500.16938.jpg' },
  { file: 'pdm-herod.jpg',                          url: 'https://fimgs.net/mdimg/perfume/375x500.16939.jpg' },
  // Others (IDs: 71708 for Tuxedo YSL, 44174 for Hacivat, 3747 for 1 Million)
  { file: 'ysl-tuxedo.jpg',                         url: 'https://fimgs.net/mdimg/perfume/375x500.71708.jpg' },
  { file: 'nishane-hacivat.jpg',                    url: 'https://fimgs.net/mdimg/perfume/375x500.44174.jpg' },
  { file: 'paco-rabanne-1-million.jpg',             url: 'https://fimgs.net/mdimg/perfume/375x500.3747.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.fragrantica.com/'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    req.on('error', (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

async function downloadAll() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  console.log(`Downloading ${images.length} perfume images...\n`);
  
  for (const { file, url } of images) {
    const dest = path.join(OUTPUT_DIR, file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      console.log(`⏭️  Skipping ${file} (already exists)`);
      continue;
    }
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      if (size < 1000) {
        fs.unlinkSync(dest);
        console.log(`❌ ${file} — too small (${size} bytes), likely blocked`);
      } else {
        console.log(`✅ ${file} (${Math.round(size/1024)}KB)`);
      }
    } catch (err) {
      console.log(`❌ ${file} — ${err.message}`);
    }
  }
  console.log('\nDone!');
}

downloadAll();
