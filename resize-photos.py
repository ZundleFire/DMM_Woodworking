#!/usr/bin/env python3
"""
resize-photos.py

Shrinks the gallery photos in assets/work-examples/ to web size, in place.
Straight off a camera these are ~4900px / 1-4 MB each; the gallery shows them
at 270px and the lightbox at most ~1800px tall, so full-size files cost
visitors megabytes for pixels they never see.

Run after dropping new photos in, before build-gallery.js:

    python resize-photos.py
    node build-gallery.js

Needs Pillow:  pip install Pillow

Already-resized files are skipped, so it is safe to re-run — re-encoding an
untouched JPEG would only cost a little quality each time.
"""
import pathlib
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip install Pillow")

MAX_EDGE = 1800   # longest side, in pixels
QUALITY = 82      # JPEG quality; 82 is visually clean at this size
WORK_DIR = pathlib.Path(__file__).parent / "assets" / "work-examples"


def main():
    photos = sorted(WORK_DIR.rglob("*.jpg"))
    if not photos:
        sys.exit(f"No .jpg files found under {WORK_DIR}")

    before = after = 0
    resized = skipped = 0

    for path in photos:
        original = path.stat().st_size
        before += original

        with Image.open(path) as img:
            if max(img.size) <= MAX_EDGE:
                # Already web-sized — leave it alone rather than re-encoding.
                after += original
                skipped += 1
                continue
            # exif_transpose bakes in rotation; saving without exif= drops the
            # EXIF block, which on phone photos can carry the GPS location of a
            # customer's home.
            img = ImageOps.exif_transpose(img).convert("RGB")
            img.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
            img.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)

        new = path.stat().st_size
        after += new
        resized += 1
        print(f"  {original // 1024:>5} KB -> {new // 1024:>4} KB   {path.name}")

    print(
        f"\n{resized} resized, {skipped} already web-sized.\n"
        f"Total {before / 1048576:.1f} MB -> {after / 1048576:.1f} MB"
    )


if __name__ == "__main__":
    main()
