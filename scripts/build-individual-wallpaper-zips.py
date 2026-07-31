import csv
import hashlib
import json
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
import re
import zipfile

from PIL import Image


SITE_ROOT = Path(__file__).resolve().parents[1]
DIGITAL_ART_ROOT = Path(r"C:\Users\giann\repo\digital-art")
WORKS_PATH = SITE_ROOT / "assets" / "images" / "archive" / "works.json"
PACKS_DIR = DIGITAL_ART_ROOT / "packs-cleaned"
OUTPUT_DIR = DIGITAL_ART_ROOT / "packs-individual"
SITE_MANIFEST_PATH = SITE_ROOT / "assets" / "data" / "individual-products.json"
PERSONAL_LICENSE_PATH = PACKS_DIR / "PERSONAL-LICENSE.txt"

DESKTOP_SIZE = (3840, 2160)
MOBILE_SIZE = (1440, 2560)


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def artwork_title(work: dict) -> str:
    title = str(work.get("title") or "").strip()
    series = str(work.get("series") or "").strip()
    if title.startswith(series):
        title = title[len(series):].strip()
    return title or Path(work["file"]).stem.removeprefix("digital-art-").replace("-", " ").title()


def read_existing_urls() -> dict[str, dict]:
    if not SITE_MANIFEST_PATH.exists():
        return {}
    data = json.loads(SITE_MANIFEST_PATH.read_text(encoding="utf-8"))
    return {item["file"]: item for item in data.get("items", [])}


def validate_image(data: bytes, expected_size: tuple[int, int], label: str) -> None:
    with Image.open(BytesIO(data)) as image:
        image.verify()
    with Image.open(BytesIO(data)) as image:
        if image.size != expected_size:
            raise ValueError(f"{label} is {image.size}, expected {expected_size}")


def individual_readme(series: str, title: str, filename: str) -> bytes:
    content = f"""{series.upper()} — {title.upper()}
{'=' * (len(series) + len(title) + 3)}

An individual digital wallpaper by Gianni Perugini.

WHAT IS INCLUDED
- 1 desktop wallpaper: 3840 x 2160 pixels (4K, 16:9)
- 1 mobile wallpaper: 1440 x 2560 pixels (9:16)
- README.txt
- PERSONAL-LICENSE.txt

FILES
- desktop/{filename}
- mobile/{filename}

INSTALL
1. Unzip this download.
2. Desktop: open the desktop/ folder and set the image as your background.
3. Mobile: save the image from mobile/ to Photos, then set it as wallpaper
   or a lock screen.

LICENSE
This product is licensed for personal use. Read PERSONAL-LICENSE.txt before
using the artwork. Commercial, publishing, merchandise, book-cover, and
client uses require the appropriate separate licence.

SUPPORT
Visit https://gianniperugini.com/

(c) Gianni Perugini - All rights reserved.
"""
    return content.encode("utf-8")


def payhip_description(series: str, title: str) -> str:
    return f"""ENGLISH

{title} is an individual wallpaper from the {series} collection by Gianni Perugini.

Included:
• 1 desktop JPG wallpaper — 3840 × 2160 pixels (4K, 16:9)
• 1 mobile JPG wallpaper — 1440 × 2560 pixels (9:16)
• Personal Use License and installation guide
• Instant digital download — no physical item will be shipped

$1 USD minimum. You may choose a higher amount if you would like to support my work. Thank you for your support. Personal use only. The files may not be redistributed, resold, shared, used commercially, or used for AI training.

FRANÇAIS

{title} est un fond d’écran individuel de la collection {series}, par Gianni Perugini.

Comprend :
• 1 fond d’écran JPG pour ordinateur — 3840 × 2160 pixels (4K, 16:9)
• 1 fond d’écran JPG pour mobile — 1440 × 2560 pixels (9:16)
• Licence d’usage personnel et guide d’installation
• Téléchargement numérique instantané — aucun article physique ne sera expédié

Minimum de 1 $ US. Vous pouvez choisir un montant plus élevé si vous souhaitez soutenir mon travail. Merci de votre soutien. Usage personnel seulement. Les fichiers ne peuvent pas être redistribués, revendus, partagés, utilisés à des fins commerciales ni pour l’entraînement de modèles d’IA."""


def main() -> None:
    works_data = json.loads(WORKS_PATH.read_text(encoding="utf-8"))
    works = [work for work in works_data["composites"] if work.get("series") and work.get("file")]
    if len(works) != 168:
        raise ValueError(f"Expected 168 sale artworks, found {len(works)}")

    existing = read_existing_urls()
    personal_license = PERSONAL_LICENSE_PATH.read_bytes()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    grouped: dict[str, list[dict]] = {}
    for work in works:
        grouped.setdefault(work["series"], []).append(work)

    manifest_items: list[dict] = []
    validation_lines = [
        "INDIVIDUAL WALLPAPER ZIP VALIDATION",
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        "",
    ]

    for series in sorted(grouped):
        series_slug = slug(series)
        pack_path = PACKS_DIR / f"{series_slug}-pack.zip"
        if not pack_path.exists():
            raise FileNotFoundError(pack_path)
        series_output = OUTPUT_DIR / series_slug
        series_output.mkdir(parents=True, exist_ok=True)

        with zipfile.ZipFile(pack_path) as source_zip:
            source_entries = {entry.filename: entry for entry in source_zip.infolist()}
            for work in sorted(grouped[series], key=lambda item: item["file"]):
                source_filename = work["file"].removeprefix("digital-art-")
                desktop_entry = f"desktop/{source_filename}"
                mobile_entry = f"mobile/{source_filename}"
                if desktop_entry not in source_entries or mobile_entry not in source_entries:
                    raise FileNotFoundError(f"Missing desktop/mobile pair for {source_filename} in {pack_path.name}")

                desktop_data = source_zip.read(desktop_entry)
                mobile_data = source_zip.read(mobile_entry)
                validate_image(desktop_data, DESKTOP_SIZE, desktop_entry)
                validate_image(mobile_data, MOBILE_SIZE, mobile_entry)

                title = artwork_title(work)
                artwork_slug = Path(source_filename).stem
                zip_filename = f"{artwork_slug}-individual.zip"
                zip_path = series_output / zip_filename
                readme = individual_readme(series, title, source_filename)

                with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_STORED) as output_zip:
                    output_zip.writestr(f"desktop/{source_filename}", desktop_data)
                    output_zip.writestr(f"mobile/{source_filename}", mobile_data)
                    output_zip.writestr("README.txt", readme)
                    output_zip.writestr("PERSONAL-LICENSE.txt", personal_license)

                with zipfile.ZipFile(zip_path) as check_zip:
                    bad_file = check_zip.testzip()
                    names = sorted(check_zip.namelist())
                expected_names = sorted([
                    f"desktop/{source_filename}",
                    f"mobile/{source_filename}",
                    "README.txt",
                    "PERSONAL-LICENSE.txt",
                ])
                if bad_file or names != expected_names:
                    raise ValueError(f"Integrity failure in {zip_path.name}: bad={bad_file}, names={names}")

                zip_bytes = zip_path.read_bytes()
                previous = existing.get(work["file"], {})
                item = {
                    "id": f"individual-{artwork_slug}",
                    "file": work["file"],
                    "series": series,
                    "title": title,
                    "name": f"{series} — {title}",
                    "payhipTitle": f"{series} — {title} | Individual Wallpaper",
                    "payhipDescription": payhip_description(series, title),
                    "coverFile": work["file"],
                    "price": 1,
                    "currency": "USD",
                    "payWhatYouWant": True,
                    "zipFilename": zip_filename,
                    "zipRelativePath": f"{series_slug}/{zip_filename}",
                    "zipSizeBytes": len(zip_bytes),
                    "sha256": hashlib.sha256(zip_bytes).hexdigest(),
                    "payhipUrl": previous.get("payhipUrl", ""),
                    "visibility": previous.get("visibility", "invisible"),
                    "enabled": previous.get("enabled", False),
                }
                manifest_items.append(item)
                validation_lines.append(
                    f"PASS | {series} | {title} | 4 entries | "
                    f"{len(zip_bytes)} bytes | {item['sha256']}"
                )

    manifest_items.sort(key=lambda item: (item["series"], item["title"]))
    manifest = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "productType": "individualWallpaper",
        "currency": "USD",
        "minimumPrice": 1,
        "payWhatYouWant": True,
        "visibility": "invisible",
        "itemCount": len(manifest_items),
        "items": manifest_items,
    }
    SITE_MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    SITE_MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    with (OUTPUT_DIR / "UPLOAD-MANIFEST.csv").open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "id", "series", "title", "name", "price", "currency", "payWhatYouWant",
            "visibility", "zipRelativePath", "zipSizeBytes", "sha256", "payhipUrl",
        ])
        writer.writeheader()
        writer.writerows({key: item[key] for key in writer.fieldnames} for item in manifest_items)

    validation_lines.extend([
        "",
        f"PASS: {len(manifest_items)} individual ZIPs created and verified.",
        "Every ZIP contains one 4K desktop JPG, one mobile JPG, README.txt, and PERSONAL-LICENSE.txt.",
    ])
    (OUTPUT_DIR / "VALIDATION-REPORT.txt").write_text("\n".join(validation_lines) + "\n", encoding="utf-8")
    print(f"Created and verified {len(manifest_items)} individual ZIPs in {OUTPUT_DIR}")
    print(f"Website manifest: {SITE_MANIFEST_PATH}")


if __name__ == "__main__":
    main()
