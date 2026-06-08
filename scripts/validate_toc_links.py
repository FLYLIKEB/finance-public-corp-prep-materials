#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
TOC = ROOT / "TOC.md"
LINK_RE = re.compile(r"\[[^\]]+\]\((pages/[^)]+\.md)\)")


def main() -> int:
    text = TOC.read_text(encoding="utf-8")
    links = LINK_RE.findall(text)
    missing = [link for link in links if not (ROOT / link).exists()]
    has_test_page = "01-1-1-테스트-세부-목차" in text or (ROOT / "pages/01-1-1-테스트-세부-목차.md").exists()

    print(f"link_count {len(links)}")
    print(f"missing_count {len(missing)}")
    if missing:
        for link in missing:
            print(f"missing {link}")
    print(f"test_page_present {has_test_page}")

    if missing or has_test_page:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
