#!/usr/bin/env python3
"""Unified photo pipeline: crop -> tone match -> sharpen -> compress (JPEG + WebP).

Usage:
  python3 scripts/optimize-images.py <source> <dest.jpg> <width> <height>

Every site photo goes through this one pass so the whole page reads as a single
warm, airy, lightly desaturated boutique set, at optimal file size.
"""

import sys
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

TARGET_LUMA = 148.0   # shared mid-tone target
MAX_EXPOSURE = 1.18   # bounded so highlights never blow out
MIN_EXPOSURE = 0.92
WB_STRENGTH = 0.55    # pull toward warm-neutral
WARM_BIAS = (1.012, 1.0, 0.988)
CONTRAST = 1.03
SATURATION = 0.94


def crop_resize(img: Image.Image, w: int, h: int) -> Image.Image:
    return ImageOps.fit(img, (w, h), method=Image.LANCZOS, centering=(0.5, 0.5))


def tone(img: Image.Image) -> Image.Image:
    r, g, b = [c.resize((64, 64)).getdata() for c in img.split()[:3]]
    means = [sum(c) / len(c) for c in (r, g, b)]
    grey = sum(means) / 3.0

    # exposure normalization toward the shared target
    exposure = min(MAX_EXPOSURE, max(MIN_EXPOSURE, TARGET_LUMA / max(grey, 1.0)))

    # per-channel white balance pull toward neutral, with a touch of warmth kept
    gains = []
    for mean, warm in zip(means, WARM_BIAS):
        raw = grey / max(mean, 1.0)
        gain = 1.0 + (raw - 1.0) * WB_STRENGTH
        gains.append(gain * exposure * warm)

    img = Image.merge(
        "RGB",
        [ch.point(lambda v, gn=gn: min(255, int(v * gn + 0.5))) for ch, gn in zip(img.split()[:3], gains)],
    )
    img = ImageEnhance.Contrast(img).enhance(CONTRAST)
    img = ImageEnhance.Color(img).enhance(SATURATION)
    return img


def main() -> None:
    src, dest, w, h = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    img = Image.open(src)
    img = ImageOps.exif_transpose(img).convert("RGB")
    img = crop_resize(img, w, h)
    img = tone(img)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.1, percent=62, threshold=3))

    img.save(dest, "JPEG", quality=85, optimize=True, progressive=True)
    img.save(dest.rsplit(".", 1)[0] + ".webp", "WEBP", quality=82, method=6)
    print(f"{dest} {w}x{h}")


if __name__ == "__main__":
    main()
