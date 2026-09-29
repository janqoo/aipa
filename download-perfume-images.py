#!/usr/bin/env python3
"""
AI Perfume Recommendation System - Image Downloader
Downloads high-quality perfume bottle images from reliable sources
"""

import os
import sys
import time
import requests
from pathlib import Path
from PIL import Image
from io import BytesIO

# Configuration
PROJECT_ROOT = Path(__file__).parent
PUBLIC_DIR = PROJECT_ROOT / "public" / "perfume-images"
TARGET_SIZE = (600, 600)
QUALITY = 90

# Perfume information: (filename, fragrantica_id, fallback_description)
PERFUMES = [
    ("creed-aventus", "1701", "Creed Aventus"),
    ("by-kilian-angels-share", "29403", "By Kilian Angel's Share"),
    ("chanel-bleu-de-chanel", "22047", "Chanel Bleu de Chanel"),
    ("chanel-coco-mademoiselle", "1275", "Chanel Coco Mademoiselle"),
    ("dior-sauvage", "26154", "Dior Sauvage"),
    ("dior-jadore", "1110", "Dior J'adore"),
    ("pdm-althair", "3945", "Parfums de Marly Althaïr"),
    ("ysl-babycat", "59848", "Yves Saint Laurent Y Le Parfum"),
    ("ysl-y", "42784", "YSL Y"),
    ("ysl-caban", "39916", "YSL La Nuit de L'Homme"),
    ("ysl-black-opium", "31703", "YSL Black Opium"),
    ("creed-blue-talisman", "48919", "Creed Blue Talisman"),
    ("lv-imagination", "39779", "Louis Vuitton Imagination"),
    ("lv-pacific-chill", "48881", "Louis Vuitton Pacific Chill"),
    ("prada-lhomme", "5741", "Prada L'Homme"),
    ("xerjoff-naxos", "16254", "Xerjoff Naxos"),
    ("lancome-la-vie-est-belle", "2898", "Lancôme La Vie est Belle"),
    ("viktor-rolf-flowerbomb", "1702", "Viktor & Rolf Flowerbomb"),
    ("giardini-bianco-latte", "36530", "Giardini di Toscana Bianco Latte"),
    ("giardini-vanilla-powder", "36531", "Giardini di Toscana Vanilla Powder"),
]

def download_from_fragrantica(fragrantica_id):
    """Attempt to download a bottle image from Fragrantica using its ID.

    The original site used to expose product pictures at a predictable URL but
    in 2026 the pattern now returns 404.  We still try for convenience, but most
    calls will fall back to manual links listed later in the script.
    """
    try:
        # Fragrantica image URL pattern (subject to change)
        image_url = f"https://www.fragrantica.com/graphics/product/{fragrantica_id}/original.jpg"
        print(f"  Downloading from Fragrantica (ID: {fragrantica_id})...")
        response = requests.get(image_url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        if response.status_code == 200:
            return Image.open(BytesIO(response.content))
        else:
            # log status for troubleshooting
            print(f"  ⚠️  Received status {response.status_code} from Fragrantica")
        return None
    except Exception as e:
        print(f"  ❌ Fragrantica download failed: {str(e)}")
        return None

def download_from_google_images(perfume_name):
    """Provide user with Google Images search link as fallback"""
    search_query = perfume_name.replace(" ", "+")
    url = f"https://www.google.com/search?q={search_query}+perfume+bottle&tbm=isch&tbs=isz:lt,islt:qsvga"
    return url

def resize_image(image):
    """Resize image to target size while maintaining aspect ratio"""
    try:
        # Calculate aspect ratio
        ratio = min(TARGET_SIZE[0] / image.width, TARGET_SIZE[1] / image.height)
        new_size = (int(image.width * ratio), int(image.height * ratio))

        # Resize
        resized = image.resize(new_size, Image.Resampling.LANCZOS)

        # Create white background
        background = Image.new('RGB', TARGET_SIZE, (255, 255, 255))
        offset = ((TARGET_SIZE[0] - resized.width) // 2, (TARGET_SIZE[1] - resized.height) // 2)
        background.paste(resized, offset)

        return background
    except Exception as e:
        print(f"  ❌ Image resize failed: {str(e)}")
        return None

def save_image(image, filename):
    """Ensure converted image is written and clear old SVG copy.

    Removing the `.svg` prevents stale files from remaining in the public
    directory and confusing the build or the browser cache.
    """
    try:
        output_path = PUBLIC_DIR / f"{filename}.jpg"

        # Convert RGBA to RGB if necessary
        if image.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1] if image.mode in ('RGBA', 'LA') else None)
            image = background

        image.save(output_path, 'JPEG', quality=QUALITY, optimize=True)

        # delete svg fallback if it exists
        svg_path = PUBLIC_DIR / f"{filename}.svg"
        if svg_path.exists():
            try:
                svg_path.unlink()
                print(f"  🗑  Removed old SVG: {svg_path.name}")
            except Exception:
                pass

        return str(output_path)
    except Exception as e:
        print(f"  ❌ Save failed: {str(e)}")
        return None

def update_mockdata():
    """Update mockData.ts to use .jpg instead of .svg"""
    try:
        mockdata_path = PROJECT_ROOT / "src" / "services" / "mockData.ts"
        
        if not mockdata_path.exists():
            print("❌ mockData.ts not found!")
            return False
        
        content = mockdata_path.read_text()
        original_content = content
        
        # Replace all .svg with .jpg
        content = content.replace('.svg', '.jpg')
        
        if content != original_content:
            mockdata_path.write_text(content)
            print("✅ Updated mockData.ts to use .jpg images")
            return True
        else:
            print("ℹ️  mockData.ts already uses .jpg or no images found")
            return True
    except Exception as e:
        print(f"❌ Failed to update mockData.ts: {str(e)}")
        return False

def main():
    """Main function"""
    print("=" * 70)
    print("🎨 AI Perfume Recommendation System - Image Downloader")
    print("=" * 70)
    
    # Create directory if needed
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    # clean up old svg files so the public folder only contains jpegs
    for svg in PUBLIC_DIR.glob("*.svg"):
        try:
            svg.unlink()
            print(f"🗑  removed stale SVG {svg.name}")
        except Exception:
            pass
    
    # Check internet connection
    try:
        requests.head("https://www.fragrantica.com", timeout=5)
        print("✅ Internet connection: OK\n")
    except:
        print("⚠️  No internet connection detected")
        print("Using fallback options...\n")
    
    successful = 0
    failed = 0
    manual_needed = []
    
    for filename, fragrantica_id, perfume_name in PERFUMES:
        print(f"📸 {perfume_name}...")

        jpg_path = PUBLIC_DIR / f"{filename}.jpg"

        # detect tiny files that are almost certainly the generated placeholder
        if jpg_path.exists():
            size = jpg_path.stat().st_size
            if size < 15_000:
                print(f"  ⚠️  {jpg_path.name} is only {size} bytes – probably a placeholder")
                # remove it so we can try downloading again (or prompt user later)
                jpg_path.unlink()
            else:
                print("  ⏭  already exists, skipping")
                successful += 1
                continue

        # Try Fragrantica
        image = download_from_fragrantica(fragrantica_id)

        if image:
            # Resize image
            resized = resize_image(image)

            if resized:
                # Save image
                result = save_image(resized, filename)

                if result:
                    print(f"  ✅ Saved: {result}")
                    successful += 1
                    time.sleep(1)  # Rate limiting
                else:
                    failed += 1
                    manual_needed.append((filename, perfume_name))
            else:
                failed += 1
                manual_needed.append((filename, perfume_name))
        else:
            failed += 1
            manual_needed.append((filename, perfume_name))
    
    print("\n" + "=" * 70)
    print(f"📊 Results: {successful} downloaded, {failed} need manual setup")
    print("=" * 70)
    
    if manual_needed:
        print("\n📝 Manual Download Links (Click to find images):\n")
        for filename, perfume_name in manual_needed:
            google_url = download_from_google_images(perfume_name)
            print(f"• {perfume_name}")
            print(f"  Google Images: {google_url}")
            print(f"  Save as: public/perfume-images/{filename}.jpg\n")
    
    # Update mockData.ts
    print("\n🔄 Updating code references...")
    if update_mockdata():
        print("✅ Code update complete!")
    else:
        print("⚠️  Manual code update may be needed")

    print(
        "\n⚠️  NOTE: If all of the JPG files are small (~10KB) they are just the "
        "coloured placeholders. Fragrantica no longer provides real photos so "
        "you'll need to download actual bottle images yourself and place them in "
        "`public/perfume-images/` with the exact filenames listed above.\n"
    )
    print("\n" + "=" * 70)
    print("✨ Done! Your perfume images are ready to use.")
    print("=" * 70)

if __name__ == "__main__":
    main()
