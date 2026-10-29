/**
 * Real-time AI Person Segmentation (Virtual Background without physical green screen)
 * Powered by Google MediaPipe Selfie Segmentation.
 */

declare global {
  interface Window {
    SelfieSegmentation?: any;
  }
}

interface Results {
  image: HTMLCanvasElement | HTMLImageElement | ImageBitmap;
  segmentationMask: HTMLCanvasElement | HTMLImageElement | ImageBitmap;
}

let segmenterInstance: any = null;
let isInitializing = false;
let isModelReady = false;
let lastResults: Results | null = null;

export function isAiModelLoaded(): boolean {
  return isModelReady;
}

/**
 * Dynamically load MediaPipe SelfieSegmentation UMD script
 */
async function loadScript(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if (window.SelfieSegmentation) return window.SelfieSegmentation;

  return new Promise((resolve, reject) => {
    const existing = document.getElementById('mediapipe-selfie-script') as HTMLScriptElement | null;
    if (existing) {
      if (window.SelfieSegmentation) {
        resolve(window.SelfieSegmentation);
      } else {
        existing.addEventListener('load', () => resolve(window.SelfieSegmentation));
        existing.addEventListener('error', reject);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'mediapipe-selfie-script';
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/selfie_segmentation.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      resolve(window.SelfieSegmentation);
    };
    script.onerror = (err) => {
      reject(err);
    };
    document.head.appendChild(script);
  });
}

/**
 * Initialize or get singleton SelfieSegmentation instance
 */
export async function getAiSegmenter(): Promise<any> {
  if (segmenterInstance && isModelReady) {
    return segmenterInstance;
  }

  if (isInitializing) {
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    if (segmenterInstance) return segmenterInstance;
  }

  isInitializing = true;

  try {
    const SelfieSegmentationClass = await loadScript();
    if (!SelfieSegmentationClass) {
      throw new Error('SelfieSegmentation is not available');
    }

    const segmenter = new SelfieSegmentationClass({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/${file}`,
    });

    segmenter.setOptions({
      modelSelection: 1, // 1: Landscape model (fast, optimal for photobooths)
      selfieMode: false,
    });

    segmenter.onResults((results: Results) => {
      lastResults = results;
      isModelReady = true;
    });

    await segmenter.initialize();
    segmenterInstance = segmenter;
    isModelReady = true;
    isInitializing = false;
    return segmenter;
  } catch (err) {
    console.warn('Failed to initialize MediaPipe SelfieSegmentation:', err);
    isInitializing = false;
    throw err;
  }
}

/**
 * Send frame to AI model
 */
export async function sendFrameToAi(video: HTMLVideoElement): Promise<void> {
  if (!video || video.readyState < 2) return;
  try {
    const segmenter = await getAiSegmenter();
    await segmenter.send({ image: video });
  } catch {
    // ignore frame drop
  }
}

/**
 * Composite AI-segmented person over background onto destination canvas.
 * Uses high-speed GPU Canvas 2D blend modes (source-in, destination-over).
 */
export function compositeAiSegmentation({
  destCanvas,
  backgroundImage,
  mirror = true,
}: {
  destCanvas: HTMLCanvasElement;
  backgroundImage: HTMLImageElement | null;
  mirror?: boolean;
}): boolean {
  if (!lastResults || !lastResults.segmentationMask) {
    return false;
  }

  const ctx = destCanvas.getContext('2d');
  if (!ctx) return false;

  const width = destCanvas.width;
  const height = destCanvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // If mirroring, transform canvas
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  // 1. Draw segmentation mask (white where person is, black where background is)
  ctx.drawImage(lastResults.segmentationMask, 0, 0, width, height);

  // 2. Composite person video ONLY inside the mask
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(lastResults.image, 0, 0, width, height);

  // 3. Composite custom background image BEHIND the person
  ctx.globalCompositeOperation = 'destination-over';

  // If we flipped canvas, undo flip for background so background scenery is right-side up
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
    const bgW = backgroundImage.naturalWidth || backgroundImage.width;
    const bgH = backgroundImage.naturalHeight || backgroundImage.height;
    const scale = Math.max(width / bgW, height / bgH);
    const nw = bgW * scale;
    const nh = bgH * scale;
    const nx = (width - nw) / 2;
    const ny = (height - nh) / 2;
    ctx.drawImage(backgroundImage, nx, ny, nw, nh);
  } else {
    // Default studio backdrop
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
  return true;
}
