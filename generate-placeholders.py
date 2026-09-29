#!/usr/bin/env python3
"""
Generate branded JPG placeholder images for perfumes using Pillow.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import hashlib

PROJECT_ROOT = Path(__file__).parent
OUTPUT_DIR = PROJECT_ROOT / 'public' / 'perfume-images'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
SIZE = (600, 600)
FONT = ImageFont.load_default()

PERFUMES = [
    "creed-aventus",
    "by-kilian-angels-share",
    "chanel-bleu-de-chanel",
    "chanel-coco-mademoiselle",
    "dior-sauvage",
    "dior-jadore",
    "pdm-althair",
    "ysl-babycat",
    "ysl-y",
    "ysl-caban",
    "ysl-black-opium",
    "creed-blue-talisman",
    "lv-imagination",
    "lv-pacific-chill",
    "prada-lhomme",
    "xerjoff-naxos",
    "lancome-la-vie-est-belle",
    "viktor-rolf-flowerbomb",
    "giardini-bianco-latte",
    "giardini-vanilla-powder",
    "creed-silver-mountain-water",
]

def color_from_name(name: str):
    h = hashlib.sha1(name.encode('utf-8')).hexdigest()
    r = int(h[0:2], 16)
    g = int(h[2:4], 16)
    b = int(h[4:6], 16)
    # Muted pastel
    r = (r + 200) // 2
    g = (g + 200) // 2
    b = (b + 200) // 2
    return (r, g, b)


def draw_bottle(draw, w, h):
    # simple bottle: rounded rectangle body + cap
    body_w = int(w * 0.45)
    body_h = int(h * 0.55)
    x0 = (w - body_w) // 2
    y0 = int(h * 0.25)
    x1 = x0 + body_w
    y1 = y0 + body_h
    # body
    draw.rounded_rectangle([x0, y0, x1, y1], radius=20, fill=(255,255,255,200))
    # cap
    cap_h = int(h * 0.07)
    cap_w = int(body_w * 0.6)
    cx0 = (w - cap_w) // 2
    cy0 = y0 - cap_h - 4
    cx1 = cx0 + cap_w
    cy1 = cy0 + cap_h
    draw.rectangle([cx0, cy0, cx1, cy1], fill=(255,255,255,220))


def create_placeholder(name: str):
    img = Image.new('RGB', SIZE, color_from_name(name))
    draw = ImageDraw.Draw(img)
    w, h = SIZE

    # Draw subtle vignette
    for i in range(120):
        alpha = int(3*i/120)
        draw.rectangle([i, i, w-i-1, h-i-1], outline=None)

    # Draw bottle silhouette
    draw_bottle(draw, w, h)

    # Text: brand/name split by first hyphen
    parts = name.split('-', 1)
    brand = parts[0].upper()
    title = parts[1].replace('-', ' ').title() if len(parts) > 1 else ''

    # Title text
    title_font = FONT
    brand_font = FONT

    # Calculate text positions
    # Measure text using textbbox for compatibility
    brand_bbox = draw.textbbox((0, 0), brand, font=brand_font)
    brand_w, brand_h = brand_bbox[2] - brand_bbox[0], brand_bbox[3] - brand_bbox[1]
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w, title_h = title_bbox[2] - title_bbox[0], title_bbox[3] - title_bbox[1]

    draw.text(((w - brand_w) / 2, h - 110), brand, fill=(30,30,30), font=brand_font)
    draw.text(((w - title_w) / 2, h - 90), title, fill=(40,40,40), font=title_font)

    out_path = OUTPUT_DIR / f"{name}.jpg"
    img.save(out_path, 'JPEG', quality=90)
    return out_path


def main():
    created = 0
    for p in PERFUMES:
        path = OUTPUT_DIR / f"{p}.jpg"
        if path.exists():
            print(f"Exists: {path.name}")
            continue
        out = create_placeholder(p)
        print(f"Created: {out.name}")
        created += 1
    print(f"Done. {created} images created in {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
