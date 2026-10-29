/**
 * Utility to optimize and downscale image uploads before storing in state/storage.
 * Prevents QuotaExceededError and improves rendering performance.
 */

export function optimizeImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1800,
  preserveAlpha = true
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Determine mime type: if preserving alpha or original is PNG, use image/png, else image/jpeg
        const isPng = preserveAlpha && (file.type.includes('png') || file.name.endsWith('.png'));
        if (isPng) {
          // PNG with alpha
          resolve(canvas.toDataURL('image/png'));
        } else {
          // JPEG with 0.85 quality for compact size (~200KB)
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        }
      };

      img.onerror = () => {
        resolve(reader.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}
