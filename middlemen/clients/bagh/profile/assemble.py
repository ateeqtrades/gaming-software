"""Join the flattened page images into one PDF. Usage: python3 assemble.py <folder with pg-*.png> <output.pdf>"""
import glob
import sys

from PIL import Image

pages = [Image.open(f).convert("RGB") for f in sorted(glob.glob(sys.argv[1] + "/pg-*.png"))]
pages[0].save(sys.argv[2], save_all=True, append_images=pages[1:], resolution=240, quality=90)
print(len(pages), "pages", pages[0].size)
