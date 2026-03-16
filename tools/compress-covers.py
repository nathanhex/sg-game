#!/usr/bin/env python3
"""压缩 games/*/cover.png，保留 cover-original.png 备份。目标 440×220，PNG 优化。"""
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("需要 Pillow: pip install Pillow")
    raise

ROOT = Path(__file__).resolve().parent.parent
GAMES = ROOT / "games"
TARGET_SIZE = (440, 220)

def main():
    for game_dir in sorted(GAMES.iterdir()):
        if not game_dir.is_dir():
            continue
        cover = game_dir / "cover.png"
        if not cover.exists():
            continue
        # 备份已由用户事先做成 cover-original.png，这里只压缩 cover.png
        img = Image.open(cover)
        if img.mode == "RGBA":
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        out = game_dir / "cover.png"
        img.save(out, "PNG", optimize=True, compress_level=9)
        before = cover.stat().st_size
        after = out.stat().st_size
        print(f"{game_dir.name}: {before // 1024} KB -> {after // 1024} KB")

if __name__ == "__main__":
    main()
