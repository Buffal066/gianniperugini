import json
from io import BytesIO
from pathlib import Path
import textwrap
import zipfile

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
WORKS_PATH = ROOT / "assets" / "images" / "archive" / "works.json"
SHOP_PATH = ROOT / "assets" / "data" / "shop.json"
SOURCE_DIR = ROOT / "assets" / "images" / "watermarked" / "archive"
OUTPUT_DIR = ROOT / "assets" / "images" / "payhip-covers"
PACKS_DIR = Path(r"C:\Users\giann\repo\digital-art\packs-cleaned")
SEAL_PATH = ROOT / "_fix_watermarks" / "gp_seal_clean.png"

SERIES = [
    "Steel Lanes",
    "Faces in Void",
    "Cinder Veil",
    "The Burning Gaze",
    "Till Darkness",
    "Stone Sanctuary",
    "Blackwood",
    "Wet Neon Noir",
    "Static Bloom",
    "Red Eternity",
]

SLUGS = {
    "Burned Canvas": "burned-canvas",
    "Corroded Silence": "corroded-silence",
    "Midnight Masquerade": "midnight-masquerade",
    "Urban Noir": "urban-noir",
    "Steel Lanes": "steel-lanes",
    "Faces in Void": "faces-in-void",
    "Cinder Veil": "cinder-veil",
    "The Burning Gaze": "the-burning-gaze",
    "Till Darkness": "till-darkness",
    "Stone Sanctuary": "stone-sanctuary",
    "Blackwood": "blackwood",
    "Wet Neon Noir": "wet-neon-noir",
    "Static Bloom": "static-bloom",
    "Red Eternity": "red-eternity",
}

ALL_SERIES = list(SLUGS)

CANVAS = (1600, 1650)
BG = "#080808"
TEXT = "#f2eee8"
MUTED = "#aaa39b"
RED = "#8e1717"
MARGIN = 60
GAP = 18
COLS = 3
CELL_W = (CANVAS[0] - (2 * MARGIN) - ((COLS - 1) * GAP)) // COLS
IMAGE_H = 246
ROW_H = 322
GRID_TOP = 180


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


SERIF = font("C:/Windows/Fonts/georgia.ttf", 46)
SANS = font("C:/Windows/Fonts/arial.ttf", 18)
SMALL = font("C:/Windows/Fonts/arial.ttf", 15)
FOOTER = font("C:/Windows/Fonts/arial.ttf", 13)


def watermarked_path(filename: str) -> Path:
    source = Path(filename)
    return SOURCE_DIR / f"{source.stem}-watermarked{source.suffix}"


def short_title(series: str, title: str) -> str:
    prefix = f"{series} "
    return title[len(prefix):] if title.startswith(prefix) else title


def make_sheet(series: str, works: list[dict]) -> Path:
    canvas = Image.new("RGB", CANVAS, BG)
    draw = ImageDraw.Draw(canvas)

    draw.rectangle((24, 24, CANVAS[0] - 25, CANVAS[1] - 25), outline=RED, width=2)
    draw.text((MARGIN, 51), "GIANNI PERUGINI  ·  DIGITAL ART COLLECTION", font=SMALL, fill=RED)
    draw.text((MARGIN, 82), series, font=SERIF, fill=TEXT)
    count_label = f"{len(works)} artworks · desktop + mobile"
    label_w = draw.textbbox((0, 0), count_label, font=SMALL)[2]
    draw.text((CANVAS[0] - MARGIN - label_w, 99), count_label, font=SMALL, fill=MUTED)

    for index, work in enumerate(works):
        row, col = divmod(index, COLS)
        x = MARGIN + col * (CELL_W + GAP)
        y = GRID_TOP + row * ROW_H
        image_path = watermarked_path(work["file"])
        if not image_path.exists():
            raise FileNotFoundError(image_path)
        with Image.open(image_path) as source:
            preview = ImageOps.fit(source.convert("RGB"), (CELL_W, IMAGE_H), Image.Resampling.LANCZOS)
        canvas.paste(preview, (x, y))
        draw.rectangle((x, y, x + CELL_W - 1, y + IMAGE_H - 1), outline="#5c201f", width=1)
        draw.text((x, y + IMAGE_H + 12), short_title(series, work["title"]), font=SANS, fill=TEXT)

    footer = "WATERMARKED SALES PREVIEW  ·  GIANNIPERUGINI.COM"
    footer_w = draw.textbbox((0, 0), footer, font=FOOTER)[2]
    draw.text(((CANVAS[0] - footer_w) // 2, CANVAS[1] - 56), footer, font=FOOTER, fill=MUTED)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / f"{SLUGS[series]}-collection-sheet.jpg"
    canvas.save(output, "JPEG", quality=92, optimize=True, progressive=True)
    return output


def make_sample_sheet(works: list[dict]) -> Path:
    size = (1600, 1040)
    margin = 60
    gap = 18
    cell_w = (size[0] - (2 * margin) - (2 * gap)) // 3
    image_h = 265
    row_h = 340
    grid_top = 185
    canvas = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(canvas)

    draw.rectangle((24, 24, size[0] - 25, size[1] - 25), outline=RED, width=2)
    draw.text((margin, 51), "GIANNI PERUGINI  \u00b7  DIGITAL ART SAMPLE", font=SMALL, fill=RED)
    draw.text((margin, 82), "Dark Art Sample Pack", font=SERIF, fill=TEXT)
    count_label = "6 wallpaper files \u00b7 free sample"
    label_w = draw.textbbox((0, 0), count_label, font=SMALL)[2]
    draw.text((size[0] - margin - label_w, 99), count_label, font=SMALL, fill=MUTED)

    for index, work in enumerate(works):
        row, col = divmod(index, 3)
        x = margin + col * (cell_w + gap)
        y = grid_top + row * row_h
        image_path = watermarked_path(work["file"])
        if not image_path.exists():
            raise FileNotFoundError(image_path)
        with Image.open(image_path) as source:
            preview = ImageOps.fit(source.convert("RGB"), (cell_w, image_h), Image.Resampling.LANCZOS)
        canvas.paste(preview, (x, y))
        draw.rectangle((x, y, x + cell_w - 1, y + image_h - 1), outline="#5c201f", width=1)
        series = work["series"]
        label = f"{series} — {short_title(series, work['title'])}"
        draw.text((x, y + image_h + 12), label, font=SANS, fill=TEXT)

    footer = "WATERMARKED SALES PREVIEW  \u00b7  GIANNIPERUGINI.COM"
    footer_w = draw.textbbox((0, 0), footer, font=FOOTER)[2]
    draw.text(((size[0] - footer_w) // 2, size[1] - 56), footer, font=FOOTER, fill=MUTED)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / "dark-art-sample-pack-sheet.jpg"
    canvas.save(output, "JPEG", quality=92, optimize=True, progressive=True)
    return output


def add_preview_seal(preview: Image.Image, width: int = 62) -> None:
    with Image.open(SEAL_PATH) as source:
        seal = source.convert("RGBA")
    height = round(seal.height * width / seal.width)
    seal = seal.resize((width, height), Image.Resampling.LANCZOS)
    preview.paste(seal, (preview.width - width - 8, preview.height - height - 6), seal)


def make_mobile_sheet(series: str) -> Path:
    slug = SLUGS[series]
    pack = PACKS_DIR / f"{slug}-pack.zip"
    size = (1600, 1280)
    margin = 52
    gap = 16
    columns = 6
    cell_w = (size[0] - (2 * margin) - ((columns - 1) * gap)) // columns
    image_h = round(cell_w * 16 / 9)
    row_h = image_h + 76
    grid_top = 178
    canvas = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(canvas)
    label_font = font("C:/Windows/Fonts/arial.ttf", 14)

    draw.rectangle((24, 24, size[0] - 25, size[1] - 25), outline=RED, width=2)
    draw.text((margin, 51), "GIANNI PERUGINI  \u00b7  MOBILE WALLPAPER COLLECTION", font=SMALL, fill=RED)
    draw.text((margin, 82), series, font=SERIF, fill=TEXT)
    count_label = "12 mobile wallpapers \u00b7 1440 × 2560 \u00b7 9:16"
    label_w = draw.textbbox((0, 0), count_label, font=SMALL)[2]
    draw.text((size[0] - margin - label_w, 99), count_label, font=SMALL, fill=MUTED)

    with zipfile.ZipFile(pack) as archive:
        entries = sorted(
            entry for entry in archive.namelist()
            if entry.lower().startswith("mobile/") and entry.lower().endswith((".jpg", ".jpeg", ".png"))
        )
        if len(entries) != 12:
            raise ValueError(f"Expected 12 mobile files in {pack.name}; found {len(entries)}")
        for index, entry in enumerate(entries):
            row, col = divmod(index, columns)
            x = margin + col * (cell_w + gap)
            y = grid_top + row * row_h
            with Image.open(BytesIO(archive.read(entry))) as source:
                preview = ImageOps.fit(source.convert("RGB"), (cell_w, image_h), Image.Resampling.LANCZOS)
            add_preview_seal(preview)
            canvas.paste(preview, (x, y))
            draw.rectangle((x, y, x + cell_w - 1, y + image_h - 1), outline="#5c201f", width=1)
            stem = Path(entry).stem
            label = stem.removeprefix(f"{slug}-").replace("-", " ").title()
            wrapped = textwrap.wrap(label, width=24)[:2]
            draw.multiline_text((x, y + image_h + 10), "\n".join(wrapped), font=label_font, fill=TEXT, spacing=2)

    footer = "WATERMARKED MOBILE PREVIEW  \u00b7  GIANNIPERUGINI.COM"
    footer_w = draw.textbbox((0, 0), footer, font=FOOTER)[2]
    draw.text(((size[0] - footer_w) // 2, size[1] - 55), footer, font=FOOTER, fill=MUTED)
    output = OUTPUT_DIR / f"{slug}-mobile-collection-sheet.jpg"
    canvas.save(output, "JPEG", quality=92, optimize=True, progressive=True)
    return output


def make_mixed_sample_sheet() -> Path:
    pack = PACKS_DIR / "dark-sample-pack.zip"
    size = (1600, 1360)
    margin = 60
    gap = 18
    col_w = (size[0] - (2 * margin) - (2 * gap)) // 3
    canvas = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(canvas)
    section_font = font("C:/Windows/Fonts/arial.ttf", 18)
    label_font = font("C:/Windows/Fonts/arial.ttf", 15)

    draw.rectangle((24, 24, size[0] - 25, size[1] - 25), outline=RED, width=2)
    draw.text((margin, 51), "GIANNI PERUGINI  \u00b7  DIGITAL ART SAMPLE", font=SMALL, fill=RED)
    draw.text((margin, 82), "Dark Art Sample Pack", font=SERIF, fill=TEXT)
    count_label = "3 desktop + 3 mobile wallpaper files"
    label_w = draw.textbbox((0, 0), count_label, font=SMALL)[2]
    draw.text((size[0] - margin - label_w, 99), count_label, font=SMALL, fill=MUTED)

    with zipfile.ZipFile(pack) as archive:
        desktop = sorted(x for x in archive.namelist() if x.lower().startswith("desktop/") and x.lower().endswith(".jpg"))
        mobile = sorted(x for x in archive.namelist() if x.lower().startswith("mobile/") and x.lower().endswith(".jpg"))
        if len(desktop) != 3 or len(mobile) != 3:
            raise ValueError(f"Unexpected sample contents: {len(desktop)} desktop, {len(mobile)} mobile")

        draw.text((margin, 168), "DESKTOP WALLPAPERS  \u00b7  4K  \u00b7  16:9", font=section_font, fill=RED)
        for index, entry in enumerate(desktop):
            x = margin + index * (col_w + gap)
            y = 205
            with Image.open(BytesIO(archive.read(entry))) as source:
                preview = ImageOps.fit(source.convert("RGB"), (col_w, 260), Image.Resampling.LANCZOS)
            add_preview_seal(preview)
            canvas.paste(preview, (x, y))
            draw.rectangle((x, y, x + col_w - 1, y + 259), outline="#5c201f", width=1)
            draw.text((x, y + 273), Path(entry).stem.replace("-", " ").title(), font=label_font, fill=TEXT)

        draw.text((margin, 535), "MOBILE WALLPAPERS  \u00b7  1440 × 2560  \u00b7  9:16", font=section_font, fill=RED)
        mobile_w = 250
        mobile_h = round(mobile_w * 16 / 9)
        for index, entry in enumerate(mobile):
            column_x = margin + index * (col_w + gap)
            x = column_x + (col_w - mobile_w) // 2
            y = 575
            with Image.open(BytesIO(archive.read(entry))) as source:
                preview = ImageOps.fit(source.convert("RGB"), (mobile_w, mobile_h), Image.Resampling.LANCZOS)
            add_preview_seal(preview)
            canvas.paste(preview, (x, y))
            draw.rectangle((x, y, x + mobile_w - 1, y + mobile_h - 1), outline="#5c201f", width=1)
            label = Path(entry).stem.replace("-", " ").title()
            label_w = draw.textbbox((0, 0), label, font=label_font)[2]
            draw.text((column_x + (col_w - label_w) // 2, y + mobile_h + 14), label, font=label_font, fill=TEXT)

    footer = "WATERMARKED SALES PREVIEW  \u00b7  GIANNIPERUGINI.COM"
    footer_w = draw.textbbox((0, 0), footer, font=FOOTER)[2]
    draw.text(((size[0] - footer_w) // 2, size[1] - 55), footer, font=FOOTER, fill=MUTED)
    output = OUTPUT_DIR / "dark-art-sample-pack-mixed-sheet.jpg"
    canvas.save(output, "JPEG", quality=92, optimize=True, progressive=True)
    return output


def main() -> None:
    data = json.loads(WORKS_PATH.read_text(encoding="utf-8"))
    composites = data["composites"]
    for series in SERIES:
        works = [work for work in composites if work.get("series") == series]
        if len(works) != 12:
            raise ValueError(f"Expected 12 artworks for {series}; found {len(works)}")
        print(make_sheet(series, works))
    for series in ALL_SERIES:
        print(make_mobile_sheet(series))
    print(make_mixed_sample_sheet())


if __name__ == "__main__":
    main()
