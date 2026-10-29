/**
 * High-performance Chroma Key (Green Screen) processing on HTML5 Canvas.
 */

export interface ChromaOptions {
  keyColor: string; // Hex, e.g. #00ff00 or #12a845
  tolerance: number; // 0 - 100
  smoothness: number; // 0 - 100
  spillSuppression: number; // 0 - 100
  enabled: boolean;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Apply chroma keying to an image data buffer.
 * Replaces keyed green pixels with transparency (alpha = 0).
 */
export function processChromaKey(
  imgData: ImageData,
  options: ChromaOptions
) {
  if (!options.enabled) return;

  const data = imgData.data;
  const keyRgb = hexToRgb(options.keyColor || '#00ff00');
  const kr = keyRgb.r;
  const kg = keyRgb.g;
  const kb = keyRgb.b;

  // Normalized tolerance range: map 0-100 to color distance (e.g., 20 - 240)
  const tol = 30 + (options.tolerance / 100) * 160;
  const smooth = 5 + (options.smoothness / 100) * 70;
  const spill = options.spillSuppression / 100;

  const tolSq = tol * tol;
  const maxTolSq = (tol + smooth) * (tol + smooth);

  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Euclidean color distance from key color
    const dr = r - kr;
    const dg = g - kg;
    const db = b - kb;
    const distSq = dr * dr + dg * dg + db * db;

    if (distSq <= tolSq) {
      // Completely within green key threshold
      data[i + 3] = 0;
    } else if (distSq < maxTolSq) {
      // Smooth feathering transition
      const factor = (Math.sqrt(distSq) - tol) / smooth;
      data[i + 3] = Math.floor(factor * 255);

      // Spill suppression on transition edges
      if (spill > 0 && g > r && g > b) {
        const maxRB = Math.max(r, b);
        data[i + 1] = Math.floor(g - (g - maxRB) * spill);
      }
    } else {
      // Fully opaque, apply spill suppression if green is casting on hair/edges
      if (spill > 0 && g > r && g > b) {
        const maxRB = Math.max(r, b);
        data[i + 1] = Math.floor(g - (g - maxRB) * spill * 0.7);
      }
    }
  }
}

/**
 * Composite a video frame over a background image onto a destination canvas.
 */
export function compositeChromaFrame({
  sourceVideo,
  destCanvas,
  backgroundImage,
  options,
  mirror = true,
}: {
  sourceVideo: HTMLVideoElement | HTMLCanvasElement;
  destCanvas: HTMLCanvasElement;
  backgroundImage: HTMLImageElement | null;
  options: ChromaOptions;
  mirror?: boolean;
}) {
  const destCtx = destCanvas.getContext('2d', { willReadFrequently: true });
  if (!destCtx) return;

  const width = destCanvas.width;
  const height = destCanvas.height;

  // 1. Draw Background Image (cover style)
  if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
    destCtx.save();
    const bgW = backgroundImage.naturalWidth || backgroundImage.width;
    const bgH = backgroundImage.naturalHeight || backgroundImage.height;
    const scale = Math.max(width / bgW, height / bgH);
    const nw = bgW * scale;
    const nh = bgH * scale;
    const nx = (width - nw) / 2;
    const ny = (height - nh) / 2;
    destCtx.drawImage(backgroundImage, nx, ny, nw, nh);
    destCtx.restore();
  } else {
    // Neutral studio gradient backdrop fallback
    const grad = destCtx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    destCtx.fillStyle = grad;
    destCtx.fillRect(0, 0, width, height);
  }

  if (!options.enabled) {
    // If chroma key disabled, simply draw mirrored video
    destCtx.save();
    if (mirror) {
      destCtx.translate(width, 0);
      destCtx.scale(-1, 1);
    }
    destCtx.drawImage(sourceVideo, 0, 0, width, height);
    destCtx.restore();
    return;
  }

  // 2. Offscreen buffer for video frame chroma processing
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!offCtx) return;

  offCtx.save();
  if (mirror) {
    offCtx.translate(width, 0);
    offCtx.scale(-1, 1);
  }
  offCtx.drawImage(sourceVideo, 0, 0, width, height);
  offCtx.restore();

  // 3. Process green screen pixels
  const frameData = offCtx.getImageData(0, 0, width, height);
  processChromaKey(frameData, options);
  offCtx.putImageData(frameData, 0, 0);

  // 4. Draw keyed subject on top of background
  destCtx.drawImage(offscreen, 0, 0);
}
