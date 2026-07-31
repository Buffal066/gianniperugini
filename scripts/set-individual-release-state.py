import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "assets" / "data" / "individual-products.json"


def main() -> None:
    parser = argparse.ArgumentParser(description="Enable or disable individual wallpaper checkout links.")
    parser.add_argument("state", choices=("enabled", "disabled"))
    args = parser.parse_args()

    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    enabled = args.state == "enabled"
    missing_urls = [item["name"] for item in data["items"] if not item.get("payhipUrl")]
    if enabled and missing_urls:
        raise SystemExit(f"Cannot enable release: {len(missing_urls)} products have no Payhip URL.")

    for item in data["items"]:
        item["enabled"] = enabled
    MANIFEST_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Individual checkout links are now {args.state} for {len(data['items'])} products.")


if __name__ == "__main__":
    main()
