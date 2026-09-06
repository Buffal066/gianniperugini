from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "assets" / "images" / "watermarked"
OUTPUT_ROOT = ROOT / "assets" / "images" / "thumbnails"
SOURCE_DIRECTORIES = ("archive", "mobile")
WIDTHS = (480, 800)
WEBP_QUALITY = 72


def output_path(source: Path, width: int) -> Path:
    relative = source.relative_to(SOURCE_ROOT)
    return OUTPUT_ROOT / relative.parent / f"{source.stem}-{width}.webp"


def generate_thumbnail(source: Path, destination: Path, width: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        target_height = max(1, round(image.height * width / image.width))
        image = image.resize((width, target_height), Image.Resampling.LANCZOS)
        image.save(
            destination,
            "WEBP",
            quality=WEBP_QUALITY,
            method=6,
            optimize=True,
        )


def main() -> None:
    generated = 0
    skipped = 0
    source_bytes = 0
    output_bytes = 0

    for directory in SOURCE_DIRECTORIES:
        source_directory = SOURCE_ROOT / directory
        sources = sorted(
            path
            for path in source_directory.iterdir()
            if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png"}
        )
        for source in sources:
            source_bytes += source.stat().st_size
            for width in WIDTHS:
                destination = output_path(source, width)
                if (
                    destination.exists()
                    and destination.stat().st_mtime_ns >= source.stat().st_mtime_ns
                ):
                    skipped += 1
                else:
                    generate_thumbnail(source, destination, width)
                    generated += 1
                output_bytes += destination.stat().st_size

    reduction = 0 if not source_bytes else 1 - (output_bytes / (source_bytes * len(WIDTHS)))
    print(
        f"Generated {generated} thumbnails; skipped {skipped}; "
        f"responsive thumbnail set is {output_bytes / 1_000_000:.1f} MB "
        f"({reduction:.0%} smaller than equivalent full-size transfers)."
    )


if __name__ == "__main__":
    main()
