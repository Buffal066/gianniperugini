from pathlib import Path
import zipfile


SOURCE_DIR = Path(r"C:\Users\giann\repo\digital-art\packs-cleaned")
OUTPUT_DIR = Path(r"C:\Users\giann\repo\digital-art\packs-variants")


def copy_selected(source: Path, destination: Path, format_name: str) -> tuple[int, int]:
    file_count = 0
    image_count = 0
    with zipfile.ZipFile(source) as incoming, zipfile.ZipFile(
        destination,
        "w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=6,
    ) as outgoing:
        for info in incoming.infolist():
            normalized = info.filename.replace("\\", "/")
            is_format_file = normalized.lower().startswith(f"{format_name}/")
            is_support_file = "/" not in normalized.rstrip("/") and normalized.lower().endswith((".txt", ".pdf"))
            if info.is_dir() or not (is_format_file or is_support_file):
                continue
            outgoing.writestr(info, incoming.read(info.filename))
            file_count += 1
            if is_format_file and normalized.lower().endswith((".jpg", ".jpeg", ".png")):
                image_count += 1
    return file_count, image_count


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    collection_packs = sorted(
        path for path in SOURCE_DIR.glob("*-pack.zip")
        if path.name != "dark-sample-pack.zip"
    )

    for source in collection_packs:
        base = source.name.removesuffix("-pack.zip")
        for format_name in ("desktop", "mobile"):
            destination = OUTPUT_DIR / f"{base}-{format_name}-only.zip"
            file_count, image_count = copy_selected(source, destination, format_name)
            if image_count != 12:
                raise ValueError(f"Expected 12 {format_name} images in {source.name}; found {image_count}")
            print(f"{destination.name}: {file_count} files, {image_count} wallpapers")

    archive_source = SOURCE_DIR / "complete-dark-archive.zip"
    for format_name in ("desktop", "mobile"):
        destination = OUTPUT_DIR / f"complete-dark-archive-{format_name}-only.zip"
        file_count, image_count = copy_selected(archive_source, destination, format_name)
        if image_count != 168:
            raise ValueError(f"Expected 168 {format_name} archive images; found {image_count}")
        print(f"{destination.name}: {file_count} files, {image_count} wallpapers")


if __name__ == "__main__":
    main()
