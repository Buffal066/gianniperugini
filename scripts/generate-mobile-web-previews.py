import json
from io import BytesIO
from pathlib import Path
import zipfile

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
WORKS_PATH = ROOT / "assets" / "images" / "archive" / "works.json"
PACKS_DIR = Path(r"C:\Users\giann\repo\digital-art\packs-cleaned")
OUTPUT_DIR = ROOT / "assets" / "images" / "watermarked" / "mobile"
SEAL_PATH = ROOT / "_fix_watermarks" / "gp_seal_clean.png"
PREVIEW_SIZE = (720, 1280)


def slug(value: str) -> str:
    return value.lower().replace(" ", "-")


def add_watermark(image: Image.Image) -> None:
    with Image.open(SEAL_PATH) as source:
        seal = source.convert("RGBA")
    width = 112
    height = round(seal.height * width / seal.width)
    seal = seal.resize((width, height), Image.Resampling.LANCZOS)
    x = image.width - width - 22
    y = image.height - height - 22
    image.paste(seal, (x, y), seal)


def main() -> None:
    data = json.loads(WORKS_PATH.read_text(encoding="utf-8"))
    groups: dict[str, list[dict]] = {}
    for work in data["composites"]:
        if work.get("series"):
            groups.setdefault(work["series"], []).append(work)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    generated = 0
    for series, works in groups.items():
        series_slug = slug(series)
        pack_path = PACKS_DIR / f"{series_slug}-pack.zip"
        with zipfile.ZipFile(pack_path) as archive:
            entries = {
                Path(name).name: name
                for name in archive.namelist()
                if name.lower().startswith("mobile/")
                and name.lower().endswith((".jpg", ".jpeg", ".png"))
            }
            for work in works:
                source_name = work["file"].removeprefix("digital-art-")
                entry = entries.get(source_name)
                if not entry:
                    raise FileNotFoundError(f"{source_name} not found in {pack_path.name}")
                with Image.open(BytesIO(archive.read(entry))) as source:
                    preview = ImageOps.fit(
                        source.convert("RGB"),
                        PREVIEW_SIZE,
                        Image.Resampling.LANCZOS,
                    )
                add_watermark(preview)
                output_name = f"{Path(work['file']).stem}-mobile-watermarked.jpg"
                preview.save(
                    OUTPUT_DIR / output_name,
                    "JPEG",
                    quality=84,
                    optimize=True,
                    progressive=True,
                )
                generated += 1

    print(f"Generated {generated} mobile web previews in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
