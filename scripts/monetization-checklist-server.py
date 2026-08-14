#!/usr/bin/env python3
"""Local interactive checklist backed by docs/monetization-go-to-market.md.

The Markdown file remains the only source of truth. This server exposes a
localhost-only dashboard that reads the file on every refresh and changes only
the requested checkbox marker plus the document's Updated date.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import threading
from datetime import date
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


REPO_ROOT = Path(__file__).resolve().parents[1]
PLAN_PATH = REPO_ROOT / "docs" / "monetization-go-to-market.md"
APP_PATH = REPO_ROOT / "tools" / "monetization-checklist" / "index.html"

CHECKBOX_RE = re.compile(r"^(?P<indent>\s*)- \[(?P<mark>[ xX])\] (?P<text>.+?)\s*$")
HEADING_RE = re.compile(r"^(?P<level>#{1,6})\s+(?P<text>.+?)\s*$")
UPDATED_RE = re.compile(r"^- \*\*Updated:\*\*\s+\d{4}-\d{2}-\d{2}\s*$")
NEXT_ACTION_RE = re.compile(r"^\*\*Next open action:\*\*\s*(?P<text>.+?)\s*$")
WRITE_LOCK = threading.Lock()


def read_plan() -> str:
    with PLAN_PATH.open("r", encoding="utf-8", newline="") as handle:
        return handle.read()


def stable_task_id(section_path: list[str], text: str, occurrence: int) -> str:
    identity = "\x00".join([*section_path, text.strip(), str(occurrence)])
    return hashlib.sha256(identity.encode("utf-8")).hexdigest()[:20]


def parse_plan(source: str) -> dict[str, Any]:
    headings: list[tuple[int, str]] = []
    items: list[dict[str, Any]] = []
    occurrences: dict[tuple[tuple[str, ...], str], int] = {}
    updated = ""
    next_action = ""

    for line_number, raw_line in enumerate(source.splitlines(), start=1):
        line = raw_line.rstrip("\r\n")
        heading = HEADING_RE.match(line)
        if heading:
            level = len(heading.group("level"))
            headings = [entry for entry in headings if entry[0] < level]
            headings.append((level, heading.group("text").strip()))
            continue

        if UPDATED_RE.match(line):
            updated = line.split("**", 2)[-1].strip()

        next_action_match = NEXT_ACTION_RE.match(line)
        if next_action_match:
            next_action = next_action_match.group("text").strip()

        checkbox = CHECKBOX_RE.match(line)
        if not checkbox:
            continue

        section_path = [text for _, text in headings]
        text = checkbox.group("text").strip()
        occurrence_key = (tuple(section_path), text)
        occurrence = occurrences.get(occurrence_key, 0)
        occurrences[occurrence_key] = occurrence + 1
        task_id = stable_task_id(section_path, text, occurrence)
        items.append(
            {
                "id": task_id,
                "checked": checkbox.group("mark").lower() == "x",
                "text": text,
                "sectionPath": section_path,
                "section": section_path[-1] if section_path else "Checklist",
                "line": line_number,
            }
        )

    completed = sum(1 for item in items if item["checked"])
    total = len(items)
    next_open = next((item for item in items if not item["checked"]), None)
    version = hashlib.sha256(source.encode("utf-8")).hexdigest()[:16]
    return {
        "source": "docs/monetization-go-to-market.md",
        "updated": updated,
        "nextAction": next_action,
        "version": version,
        "summary": {
            "total": total,
            "completed": completed,
            "open": total - completed,
            "percent": round((completed / total) * 100) if total else 0,
        },
        "nextOpen": next_open,
        "items": items,
    }


def update_checkbox(task_id: str, checked: bool) -> dict[str, Any]:
    with WRITE_LOCK:
        source = read_plan()
        state = parse_plan(source)
        target = next((item for item in state["items"] if item["id"] == task_id), None)
        if target is None:
            raise KeyError("Checklist item no longer exists. Refresh and try again.")

        lines = source.splitlines(keepends=True)
        target_index = target["line"] - 1
        if target_index < 0 or target_index >= len(lines):
            raise RuntimeError("Checklist line moved unexpectedly. Refresh and try again.")

        raw_target = lines[target_index]
        ending = raw_target[len(raw_target.rstrip("\r\n")) :]
        content = raw_target.rstrip("\r\n")
        checkbox = CHECKBOX_RE.match(content)
        if checkbox is None:
            raise RuntimeError("Checklist item changed unexpectedly. Refresh and try again.")

        mark = "x" if checked else " "
        lines[target_index] = (
            f'{checkbox.group("indent")}- [{mark}] {checkbox.group("text").strip()}{ending}'
        )

        today = date.today().isoformat()
        for index, raw_line in enumerate(lines):
            line_ending = raw_line[len(raw_line.rstrip("\r\n")) :]
            line_content = raw_line.rstrip("\r\n")
            if UPDATED_RE.match(line_content):
                trailing_spaces = line_content[len(line_content.rstrip()) :]
                lines[index] = f"- **Updated:** {today}{trailing_spaces}{line_ending}"
                break

        updated_source = "".join(lines)
        temp_path = PLAN_PATH.with_suffix(".md.tmp")
        with temp_path.open("w", encoding="utf-8", newline="") as handle:
            handle.write(updated_source)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_path, PLAN_PATH)
        return parse_plan(updated_source)


class ChecklistHandler(BaseHTTPRequestHandler):
    server_version = "GianniChecklist/1.0"

    def log_message(self, message: str, *args: object) -> None:
        print(f"[{self.log_date_time_string()}] {message % args}")

    def send_bytes(self, payload: bytes, content_type: str, status: int = 200) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:")
        self.end_headers()
        self.wfile.write(payload)

    def send_json(self, data: Any, status: int = 200) -> None:
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_bytes(payload, "application/json; charset=utf-8", status)

    def do_GET(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        path = urlparse(self.path).path
        if path == "/":
            self.send_bytes(APP_PATH.read_bytes(), "text/html; charset=utf-8")
            return
        if path == "/api/state":
            self.send_json(parse_plan(read_plan()))
            return
        if path == "/api/source":
            self.send_bytes(read_plan().encode("utf-8"), "text/markdown; charset=utf-8")
            return
        if path == "/favicon.ico":
            self.send_bytes(b"", "image/x-icon", HTTPStatus.NO_CONTENT)
            return
        self.send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        path = urlparse(self.path).path
        if path != "/api/toggle":
            self.send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)
            return

        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > 65536:
            self.send_json({"error": "Invalid request size"}, HTTPStatus.BAD_REQUEST)
            return

        try:
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            task_id = body.get("id")
            checked = body.get("checked")
            if not isinstance(task_id, str) or not isinstance(checked, bool):
                raise ValueError("Expected an item id and checkbox state.")
            self.send_json(update_checkbox(task_id, checked))
        except KeyError as error:
            self.send_json({"error": str(error)}, HTTPStatus.CONFLICT)
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as error:
            self.send_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
        except Exception as error:  # pragma: no cover - defensive HTTP boundary
            self.send_json({"error": f"Unable to update checklist: {error}"}, HTTPStatus.INTERNAL_SERVER_ERROR)


def validate_files() -> None:
    missing = [path for path in (PLAN_PATH, APP_PATH) if not path.is_file()]
    if missing:
        joined = ", ".join(str(path) for path in missing)
        raise SystemExit(f"Missing required file(s): {joined}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1", help="Local bind address")
    parser.add_argument("--port", type=int, default=8771, help="Local port")
    parser.add_argument("--check", action="store_true", help="Validate and print checklist state, then exit")
    args = parser.parse_args()

    validate_files()
    state = parse_plan(read_plan())
    if args.check:
        summary = state["summary"]
        print(
            f'Checklist valid: {summary["completed"]}/{summary["total"]} complete; '
            f'{summary["open"]} open; source={state["source"]}'
        )
        return

    server = ThreadingHTTPServer((args.host, args.port), ChecklistHandler)
    print(f"Monetization checklist: http://{args.host}:{args.port}/")
    print(f"Source of truth: {PLAN_PATH}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
