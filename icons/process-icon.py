#!/usr/bin/env python3
"""
Process Oscar icon: remove white background and create all icon sizes.

Usage:
    1. Save the Oscar dog image as 'oscar-original.png' in this folder
    2. Run: python3 process-icon.py

Requires: pip install Pillow
"""

from PIL import Image
import os

def remove_white_background(img):
    """Remove white/light background and make it transparent."""
    img = img.convert("RGBA")
    pixels = img.load()

    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # If pixel is white or very light (background), make transparent
            if r > 240 and g > 240 and b > 240:
                pixels[x, y] = (r, g, b, 0)

    return img

def create_icons(source_path):
    """Create all required icon sizes from source image."""
    sizes = [16, 32, 48, 128]

    # Open source image
    img = Image.open(source_path)

    # Remove white background
    img = remove_white_background(img)

    # Get the bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # Save processed full-size version
    img.save("oscar-processed.png")
    print(f"Saved oscar-processed.png ({img.size[0]}x{img.size[1]})")

    # Create each icon size
    for size in sizes:
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        filename = f"icon{size}.png"
        resized.save(filename)
        print(f"Saved {filename}")

    print("\nDone! Reload the extension in Chrome to see the new icons.")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    source = "oscar-original.png"

    if not os.path.exists(source):
        print(f"Error: {source} not found!")
        print(f"Please save the Oscar dog image as '{source}' in:")
        print(f"  {script_dir}")
    else:
        create_icons(source)
