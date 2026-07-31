import hashlib
import json
from pathlib import Path
import zipfile


SITE_ROOT = Path(__file__).resolve().parents[1]
DIGITAL_ART_ROOT = Path(r"C:\Users\giann\repo\digital-art")
WORKS_PATH = SITE_ROOT / "assets" / "images" / "archive" / "works.json"
MANIFEST_PATH = SITE_ROOT / "assets" / "data" / "individual-products.json"
ZIP_ROOT = DIGITAL_ART_ROOT / "packs-individual"


def main() -> None:
    errors: list[str] = []
    works = json.loads(WORKS_PATH.read_text(encoding="utf-8"))["composites"]
    sale_works = {work["file"]: work for work in works if work.get("series") and work.get("file")}
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    items = manifest.get("items", [])

    if len(sale_works) != 168:
        errors.append(f"Expected 168 sale artworks, found {len(sale_works)}")
    if len(items) != 168 or manifest.get("itemCount") != 168:
        errors.append(f"Manifest count mismatch: items={len(items)}, itemCount={manifest.get('itemCount')}")

    ids = [item.get("id") for item in items]
    files = [item.get("file") for item in items]
    zip_paths = [item.get("zipRelativePath") for item in items]
    if len(ids) != len(set(ids)):
        errors.append("Duplicate individual product IDs")
    if len(files) != len(set(files)):
        errors.append("Duplicate artwork files in manifest")
    if len(zip_paths) != len(set(zip_paths)):
        errors.append("Duplicate individual ZIP paths")
    if set(files) != set(sale_works):
        errors.append("Manifest artwork set does not match works.json")

    total_bytes = 0
    urls = 0
    enabled = 0
    for item in items:
        if not item.get("payhipTitle") or not item.get("payhipDescription"):
            errors.append(f"Missing Payhip metadata: {item.get('file')}")
        cover_file = item.get("coverFile", "")
        extension_index = cover_file.rfind(".")
        cover_name = (
            f"{cover_file[:extension_index]}-watermarked{cover_file[extension_index:]}"
            if extension_index >= 0 else f"{cover_file}-watermarked"
        )
        cover_path = SITE_ROOT / "assets" / "images" / "watermarked" / "archive" / cover_name
        if not cover_path.exists():
            errors.append(f"Missing watermarked cover: {cover_path}")
        zip_path = ZIP_ROOT / item["zipRelativePath"]
        if not zip_path.exists():
            errors.append(f"Missing ZIP: {zip_path}")
            continue
        data = zip_path.read_bytes()
        total_bytes += len(data)
        if len(data) != item.get("zipSizeBytes"):
            errors.append(f"Size mismatch: {zip_path.name}")
        if hashlib.sha256(data).hexdigest() != item.get("sha256"):
            errors.append(f"SHA-256 mismatch: {zip_path.name}")
        try:
            with zipfile.ZipFile(zip_path) as archive:
                names = archive.namelist()
                bad_file = archive.testzip()
        except zipfile.BadZipFile:
            errors.append(f"Invalid ZIP: {zip_path.name}")
            continue
        if bad_file or len(names) != 4:
            errors.append(f"ZIP integrity/entry failure: {zip_path.name}")
        if sum(name.startswith("desktop/") for name in names) != 1:
            errors.append(f"Desktop entry failure: {zip_path.name}")
        if sum(name.startswith("mobile/") for name in names) != 1:
            errors.append(f"Mobile entry failure: {zip_path.name}")
        if "README.txt" not in names or "PERSONAL-LICENSE.txt" not in names:
            errors.append(f"Support-file failure: {zip_path.name}")
        if item.get("payhipUrl"):
            urls += 1
        if item.get("enabled"):
            enabled += 1

    print(f"Sale artworks: {len(sale_works)}")
    print(f"Manifest products: {len(items)}")
    print(f"Verified ZIP bytes: {total_bytes}")
    print(f"Payhip URLs configured: {urls}/168")
    print(f"Website checkout links enabled: {enabled}/168")
    if errors:
        print(f"FAIL: {len(errors)} error(s)")
        for error in errors[:50]:
            print(f"- {error}")
        raise SystemExit(1)
    print("PASS: all individual ZIP and manifest checks succeeded.")


if __name__ == "__main__":
    main()
