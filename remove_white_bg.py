import sys, urllib.request, numpy as np
from PIL import Image

url = "https://marketjoy.com/wp-content/uploads/2023/04/cropped-Logo.png"
out = sys.argv[1] if len(sys.argv) > 1 else "public/marketjoy-logo.png"
src = sys.argv[2] if len(sys.argv) > 2 else None
if not src:
    src = "mj-logo-src.png"
    urllib.request.urlretrieve(url, src)

a = np.array(Image.open(src).convert("RGB")).astype(float)
alpha = np.clip(((1 - a.min(axis=2) / 255) - 0.04) / 0.96, 0, 1)
safe = np.where(alpha > 0, alpha, 1)
rgb = np.clip((a - 255 * (1 - alpha[..., None])) / safe[..., None], 0, 255)
Image.fromarray(np.dstack([rgb, alpha * 255]).astype("uint8"), "RGBA").save(out)
