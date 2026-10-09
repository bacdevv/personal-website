#!/usr/bin/env python3
"""Prepare locally supplied SF fonts for this Astro website (does not download fonts).

Requires: python -m pip install fonttools brotli
The website owner is responsible for confirming permission to web-host these fonts.
"""
from __future__ import annotations
import argparse
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError as exc:
    raise SystemExit("Install the one-time converter: python -m pip install fonttools brotli") from exc

ROOT = Path(__file__).resolve().parents[1]
DISPLAY = {
    "Regular": "sf-pro-display-regular.woff2",
    "Semibold": "sf-pro-display-semibold.woff2",
    "Bold": "sf-pro-display-bold.woff2",
    "RegularItalic": "sf-pro-display-regularitalic.woff2",
}
MONO = {
    "Regular": "sf-mono-regular.woff2",
    "Medium": "sf-mono-medium.woff2",
    "RegularItalic": "sf-mono-regularitalic.woff2",
    "MediumItalic": "sf-mono-mediumitalic.woff2",
}

# English, Vietnamese, Latin diacritics, common mathematical and UI symbols.
RANGES = [
    (0x20, 0x024F),
    (0x0300, 0x036F),
    (0x1E00, 0x1EFF),
    (0x2000, 0x20CF),
    (0x2100, 0x22FF),
    (0x2500, 0x26FF),
]
UNICODES = {cp for first, last in RANGES for cp in range(first, last + 1)}


def convert(source: bytes, destination: Path) -> None:
    font = TTFont(BytesIO(source))
    supported = set(font.getBestCmap())
    missing = [c for c in "Đđắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựỳỷỹỵ" if ord(c) not in supported]
    if missing:
        raise ValueError(f"{destination.name} is missing Vietnamese glyphs: {''.join(missing)}")
    options = subset.Options()
    options.layout_features = ["*"]
    options.recalc_bounds = True
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=UNICODES & supported)
    subsetter.subset(font)
    font.flavor = "woff2"
    destination.parent.mkdir(parents=True, exist_ok=True)
    font.save(destination)
    font.close()
    print(f"Created: {destination} ({destination.stat().st_size // 1024} KB)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--downloads", type=Path, default=Path.home() / "Downloads",
                        help="Folder holding 'SF Pro Display.zip' and the four SFMonoLigaturized .ttf files")
    parser.add_argument("--output", type=Path, default=ROOT / "public" / "fonts",
                        help="Output location (default: public/fonts)")
    args = parser.parse_args()
    archive = args.downloads / "SF Pro Display.zip"
    if not archive.is_file():
        parser.error(f"Missing: {archive}")
    with ZipFile(archive) as z:
        for style, filename in DISPLAY.items():
            original_name = f"SF-Pro-Display-{style}.otf"
            entries = [name for name in z.namelist() if name.endswith('/' + original_name) and not name.startswith('__MACOSX/')]
            if len(entries) != 1:
                parser.error(f"Could not uniquely find {original_name} inside {archive}")
            convert(z.read(entries[0]), args.output / filename)
    for style, filename in MONO.items():
        source = args.downloads / f"SFMonoLigaturized-{style}.ttf"
        if not source.is_file():
            parser.error(f"Missing: {source}")
        convert(source.read_bytes(), args.output / filename)
    print("Success: all 8 local web fonts generated. No Google Fonts are needed.")
    print("Check your font license before committing these files to a public GitHub repository.")


if __name__ == "__main__":
    main()
