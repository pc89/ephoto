/**
 * Utility to generate and download Canva Template Wireframe Guides and Ready-to-Use Frames
 * for 4R (4x6 in) and Strip Photo (2x6 in) based on standard photobooth specifications.
 */

import { PhotoCount, TemplateTheme, TemplateType } from '../types/photobooth';

export interface SlotBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  ratio: string;
}

export interface CanvaTemplatePreset {
  id: string;
  name: string;
  type: TemplateType;
  photoCount: PhotoCount;
  width: number;
  height: number;
  dpi: number;
  inchSize: string;
  ratioLabel: string;
  description: string;
  slots: SlotBox[];
  headerArea: { x: number; y: number; width: number; height: number };
  footerArea: { x: number; y: number; width: number; height: number };
  canvaTemplateUrl: string;
  canvaCustomSizeUrl: string;
}

/**
 * Standard Photobooth Slot Dimensions (DNP 300 DPI Dye-Sub / Life4Cuts standard):
 * - Strip: 600 x 1800 px (2x6 inches)
 * - 4R: 1200 x 1800 px (4x6 inches)
 */
export const CANVA_PRESETS: CanvaTemplatePreset[] = [
  // 1. STRIP PHOTO • 4 FOTO (Classic Photostrip Korean Style / Life4Cuts)
  {
    id: 'canva-strip-4photo',
    name: 'Strip Photo • 4 Foto (Classic 2x6)',
    type: 'strip_photo',
    photoCount: 4,
    width: 600,
    height: 1800,
    dpi: 300,
    inchSize: '2 x 6 Inci (5 x 15.2 cm)',
    ratioLabel: 'Rasio Standar Photobooth Korea (520 x 360 px)',
    description: 'Format 4 foto strip vertikal standar Life4Cuts / Photomatics. Posisi slot foto sudah terkunci presisi di tengah.',
    canvaTemplateUrl: 'https://www.canva.com/templates/?query=photostrip+2x6',
    canvaCustomSizeUrl: 'https://www.canva.com/design?create=true&width=600&height=1800&units=px',
    headerArea: { x: 35, y: 25, width: 530, height: 75 },
    footerArea: { x: 35, y: 1615, width: 530, height: 160 },
    slots: [
      { x: 40, y: 120, width: 520, height: 355, label: 'Slot Foto 1', ratio: '4:3 Landscape' },
      { x: 40, y: 495, width: 520, height: 355, label: 'Slot Foto 2', ratio: '4:3 Landscape' },
      { x: 40, y: 870, width: 520, height: 355, label: 'Slot Foto 3', ratio: '4:3 Landscape' },
      { x: 40, y: 1245, width: 520, height: 355, label: 'Slot Foto 4', ratio: '4:3 Landscape' },
    ],
  },

  // 2. STRIP PHOTO • 3 FOTO (Trio Strip 2x6)
  {
    id: 'canva-strip-3photo',
    name: 'Strip Photo • 3 Foto (Trio 2x6)',
    type: 'strip_photo',
    photoCount: 3,
    width: 600,
    height: 1800,
    dpi: 300,
    inchSize: '2 x 6 Inci (5 x 15.2 cm)',
    ratioLabel: 'Rasio Standar 4:3 Murni (520 x 390 px)',
    description: 'Format strip 3 foto dengan rasio 4:3 kamera murni + area footer bawah ekstra luas untuk desain logo event dan sponsor.',
    canvaTemplateUrl: 'https://www.canva.com/templates/?query=photostrip+3+photos',
    canvaCustomSizeUrl: 'https://www.canva.com/design?create=true&width=600&height=1800&units=px',
    headerArea: { x: 35, y: 30, width: 530, height: 90 },
    footerArea: { x: 35, y: 1470, width: 530, height: 290 },
    slots: [
      { x: 40, y: 145, width: 520, height: 390, label: 'Slot Foto 1', ratio: '4:3 Murni' },
      { x: 40, y: 575, width: 520, height: 390, label: 'Slot Foto 2', ratio: '4:3 Murni' },
      { x: 40, y: 1005, width: 520, height: 390, label: 'Slot Foto 3', ratio: '4:3 Murni' },
    ],
  },

  // 3. STRIP PHOTO • 2 FOTO (Duo Strip 2x6)
  {
    id: 'canva-strip-2photo',
    name: 'Strip Photo • 2 Foto (Duo 2x6)',
    type: 'strip_photo',
    photoCount: 2,
    width: 600,
    height: 1800,
    dpi: 300,
    inchSize: '2 x 6 Inci (5 x 15.2 cm)',
    ratioLabel: 'Rasio Square/Besar (520 x 480 px)',
    description: 'Format strip 2 foto pose besar, sangat cocok untuk wedding couple atau peluncuran produk khusus.',
    canvaTemplateUrl: 'https://www.canva.com/templates/?query=bookmark+strip',
    canvaCustomSizeUrl: 'https://www.canva.com/design?create=true&width=600&height=1800&units=px',
    headerArea: { x: 35, y: 40, width: 530, height: 120 },
    footerArea: { x: 35, y: 1390, width: 530, height: 360 },
    slots: [
      { x: 40, y: 200, width: 520, height: 520, label: 'Slot Foto 1', ratio: '1:1 / Square' },
      { x: 40, y: 770, width: 520, height: 520, label: 'Slot Foto 2', ratio: '1:1 / Square' },
    ],
  },

  // 4. 4R SINGLE FRAME • 4 FOTO (Quad 2x2 Grid)
  {
    id: 'canva-4r-4photo',
    name: 'Single Frame 4R • 4 Foto (Quad 2x2)',
    type: 'single_frame',
    photoCount: 4,
    width: 1200,
    height: 1800,
    dpi: 300,
    inchSize: '4 x 6 Inci (10.2 x 15.2 cm)',
    ratioLabel: 'Rasio Standar 4:3 Grid (535 x 680 px)',
    description: 'Format 4R postcard 2 baris x 2 kolom standar photobooth. Paling populer untuk suvenir pernikahan dan pesta.',
    canvaTemplateUrl: 'https://www.canva.com/templates/?query=photobooth+postcard',
    canvaCustomSizeUrl: 'https://www.canva.com/design?create=true&width=1200&height=1800&units=px',
    headerArea: { x: 45, y: 30, width: 1110, height: 80 },
    footerArea: { x: 45, y: 1620, width: 1110, height: 150 },
    slots: [
      { x: 45, y: 130, width: 535, height: 710, label: 'Slot Foto 1', ratio: 'Portret Kolase' },
      { x: 620, y: 130, width: 535, height: 710, label: 'Slot Foto 2', ratio: 'Portret Kolase' },
      { x: 45, y: 875, width: 535, height: 710, label: 'Slot Foto 3', ratio: 'Portret Kolase' },
      { x: 620, y: 875, width: 535, height: 710, label: 'Slot Foto 4', ratio: 'Portret Kolase' },
    ],
  },

  // 5. 4R SINGLE FRAME • 3 FOTO (Trio Cinematic Postcard)
  {
    id: 'canva-4r-3photo',
    name: 'Single Frame 4R • 3 Foto (Trio Postcard)',
    type: 'single_frame',
    photoCount: 3,
    width: 1200,
    height: 1800,
    dpi: 300,
    inchSize: '4 x 6 Inci (10.2 x 15.2 cm)',
    ratioLabel: 'Rasio Standar 4:3 Stacked (1110 x 460 px)',
    description: 'Format 4R dengan 3 foto landscape sinematik bertumpuk rapi dengan border bersih.',
    canvaTemplateUrl: 'https://www.canva.com/templates/?query=photo+collage+4x6',
    canvaCustomSizeUrl: 'https://www.canva.com/design?create=true&width=1200&height=1800&units=px',
    headerArea: { x: 45, y: 30, width: 1110, height: 80 },
    footerArea: { x: 45, y: 1630, width: 1110, height: 140 },
    slots: [
      { x: 45, y: 135, width: 1110, height: 460, label: 'Slot Foto 1', ratio: 'Landscape Lebar' },
      { x: 45, y: 625, width: 1110, height: 460, label: 'Slot Foto 2', ratio: 'Landscape Lebar' },
      { x: 45, y: 1115, width: 1110, height: 460, label: 'Slot Foto 3', ratio: 'Landscape Lebar' },
    ],
  },

  // 6. 4R SINGLE FRAME • 2 FOTO (Duo Polaroid Postcard)
  {
    id: 'canva-4r-2photo',
    name: 'Single Frame 4R • 2 Foto (Duo Polaroid 4R)',
    type: 'single_frame',
    photoCount: 2,
    width: 1200,
    height: 1800,
    dpi: 300,
    inchSize: '4 x 6 Inci (10.2 x 15.2 cm)',
    ratioLabel: 'Rasio Standar 4:3 Besar (1110 x 680 px)',
    description: 'Format 4R dengan 2 foto ekstra besar standar 4:3. Format paling bersih dan tajam.',
    canvaTemplateUrl: 'https://www.canva.com/templates/?query=polaroid+frame+4x6',
    canvaCustomSizeUrl: 'https://www.canva.com/design?create=true&width=1200&height=1800&units=px',
    headerArea: { x: 45, y: 35, width: 1110, height: 90 },
    footerArea: { x: 45, y: 1610, width: 1110, height: 155 },
    slots: [
      { x: 45, y: 150, width: 1110, height: 690, label: 'Slot Foto 1', ratio: '4:3 Besar' },
      { x: 45, y: 880, width: 1110, height: 690, label: 'Slot Foto 2', ratio: '4:3 Besar' },
    ],
  },
];

/**
 * Generate a ready-to-use Transparent PNG Overlay Frame.
 * The photo slots are ALREADY CUT OUT (completely transparent holes).
 * The user can put ANY background in Canva behind this layer, and the photo slots remain locked!
 */
export function generateCanvaReadyOverlayPng({
  preset,
  frameColor = '#ffffff',
  borderColor = 'rgba(0,0,0,0.15)',
  borderWidth = 4,
  cornerRadius = 16,
  addSlotDropShadow = true,
}: {
  preset: CanvaTemplatePreset;
  frameColor?: string;
  borderColor?: string;
  borderWidth?: number;
  cornerRadius?: number;
  addSlotDropShadow?: boolean;
}): string {
  const canvas = document.createElement('canvas');
  canvas.width = preset.width;
  canvas.height = preset.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { width, height, slots } = preset;

  // 1. Fill entire frame with frameColor (e.g. solid white or custom color)
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Cut out the photo slots (Making them completely transparent holes)
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  slots.forEach((slot) => {
    ctx.beginPath();
    ctx.roundRect(slot.x, slot.y, slot.width, slot.height, cornerRadius);
    ctx.fill();
  });
  ctx.restore();

  // 3. Draw border around the cutouts
  ctx.save();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  slots.forEach((slot) => {
    ctx.beginPath();
    ctx.roundRect(slot.x, slot.y, slot.width, slot.height, cornerRadius);
    ctx.stroke();
  });
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/**
 * Generate a transparent PNG Guide Wireframe with detailed measurements
 */
export function generateCanvaGuidePng(preset: CanvaTemplatePreset): string {
  const canvas = document.createElement('canvas');
  canvas.width = preset.width;
  canvas.height = preset.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { width, height, slots, headerArea, footerArea } = preset;

  ctx.clearRect(0, 0, width, height);

  // Outer safe margin line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Header Box
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.fillRect(headerArea.x, headerArea.y, headerArea.width, headerArea.height);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(headerArea.x, headerArea.y, headerArea.width, headerArea.height);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HEADER AREA • POSISI JUDUL / LOGO CANVA', width / 2, headerArea.y + headerArea.height / 2 + 8);

  // Photo Slots (Fixed Position)
  ctx.setLineDash([]);
  slots.forEach((slot, idx) => {
    // Fill transparent blue
    ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);

    // Cross diagonal guidelines
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(slot.x, slot.y);
    ctx.lineTo(slot.x + slot.width, slot.y + slot.height);
    ctx.moveTo(slot.x + slot.width, slot.y);
    ctx.lineTo(slot.x, slot.y + slot.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Slot Tag
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${slot.label} (POSISI FIX)`, slot.x + slot.width / 2, slot.y + slot.height / 2 - 15);

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#1d4ed8';
    ctx.fillText(
      `${slot.width} x ${slot.height} px • ${slot.ratio}`,
      slot.x + slot.width / 2,
      slot.y + slot.height / 2 + 25
    );
  });

  // Footer Box
  ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
  ctx.fillRect(footerArea.x, footerArea.y, footerArea.width, footerArea.height);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(footerArea.x, footerArea.y, footerArea.width, footerArea.height);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('FOOTER AREA • NAMA ACARA, TANGGAL & HASHTAG', width / 2, footerArea.y + footerArea.height / 2 - 10);

  ctx.font = '16px sans-serif';
  ctx.fillText(
    `Dimensi: ${width} x ${height} px @ 300 DPI • ${preset.inchSize}`,
    width / 2,
    footerArea.y + footerArea.height / 2 + 20
  );

  return canvas.toDataURL('image/png');
}

/**
 * Trigger download of transparent cutout frame
 */
export function downloadTransparentCanvaFrame(preset: CanvaTemplatePreset): void {
  const dataUrl = generateCanvaReadyOverlayPng({ preset, frameColor: '#ffffff' });
  if (!dataUrl) return;

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `canva-fixed-frame-${preset.type}-${preset.photoCount}foto-${preset.width}x${preset.height}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Trigger download of wireframe guide
 */
export function downloadCanvaGuide(preset: CanvaTemplatePreset): void {
  const dataUrl = generateCanvaGuidePng(preset);
  if (!dataUrl) return;

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `canva-guide-${preset.type}-${preset.photoCount}foto-${preset.width}x${preset.height}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Get matching Canva preset for specified template type and photo count
 */
export function getPresetForTemplate(type: TemplateType, count: PhotoCount): CanvaTemplatePreset {
  const match = CANVA_PRESETS.find((p) => p.type === type && p.photoCount === count);
  if (match) return match;
  return CANVA_PRESETS.find((p) => p.type === type) || CANVA_PRESETS[0];
}

/**
 * Get slots for a theme, prioritizing customSlots if calibrated on the theme
 */
export function getSlotsForTheme(
  theme: TemplateTheme | undefined,
  type: TemplateType,
  count: PhotoCount
): SlotBox[] {
  if (theme?.customSlots && theme.customSlots.length === count) {
    return theme.customSlots;
  }
  return getPresetForTemplate(type, count).slots;
}

/**
 * Calculate precise photobooth slot boxes from customizable margins
 */
export function calculateSlots({
  width,
  height,
  type,
  count,
  topMargin,
  bottomMargin,
  sideMargin,
  gap,
}: {
  width: number;
  height: number;
  type: TemplateType;
  count: PhotoCount;
  topMargin: number;
  bottomMargin: number;
  sideMargin: number;
  gap: number;
}): SlotBox[] {
  if (type === 'strip_photo') {
    // Vertical strip of 'count' photos
    const totalGaps = gap * (count - 1);
    const availableHeight = height - topMargin - bottomMargin - totalGaps;
    const slotHeight = Math.max(10, Math.floor(availableHeight / count));
    const slotWidth = Math.max(10, width - sideMargin * 2);

    return Array.from({ length: count }, (_, i) => ({
      x: sideMargin,
      y: topMargin + i * (slotHeight + gap),
      width: slotWidth,
      height: slotHeight,
      label: `Slot Foto ${i + 1}`,
      ratio: '4:3 Landscape',
    }));
  } else {
    // Single Frame 4R
    if (count === 4) {
      // 2x2 grid
      const availableWidth = width - sideMargin * 2 - gap;
      const slotWidth = Math.max(10, Math.floor(availableWidth / 2));
      const availableHeight = height - topMargin - bottomMargin - gap;
      const slotHeight = Math.max(10, Math.floor(availableHeight / 2));

      return [
        { x: sideMargin, y: topMargin, width: slotWidth, height: slotHeight, label: 'Slot Foto 1', ratio: 'Grid' },
        { x: sideMargin + slotWidth + gap, y: topMargin, width: slotWidth, height: slotHeight, label: 'Slot Foto 2', ratio: 'Grid' },
        { x: sideMargin, y: topMargin + slotHeight + gap, width: slotWidth, height: slotHeight, label: 'Slot Foto 3', ratio: 'Grid' },
        { x: sideMargin + slotWidth + gap, y: topMargin + slotHeight + gap, width: slotWidth, height: slotHeight, label: 'Slot Foto 4', ratio: 'Grid' },
      ];
    } else {
      // 2 or 3 stacked landscape photos
      const totalGaps = gap * (count - 1);
      const availableHeight = height - topMargin - bottomMargin - totalGaps;
      const slotHeight = Math.max(10, Math.floor(availableHeight / count));
      const slotWidth = Math.max(10, width - sideMargin * 2);

      return Array.from({ length: count }, (_, i) => ({
        x: sideMargin,
        y: topMargin + i * (slotHeight + gap),
        width: slotWidth,
        height: slotHeight,
        label: `Slot Foto ${i + 1}`,
        ratio: 'Landscape',
      }));
    }
  }
}

/**
 * Automatically scans an uploaded PNG image to find transparent slot cutouts (alpha < 40)
 */
export async function detectTransparentSlotsInImage(
  dataUrl: string,
  targetWidth: number,
  targetHeight: number,
  expectedCount: PhotoCount
): Promise<SlotBox[] | null> {
  return new Promise((resolve) => {
    const img = new Image();
    if (dataUrl.startsWith('http')) img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imgData.data;

        // Sample scan lines vertically to locate transparent bands
        const rowIsTransparent: boolean[] = [];
        for (let y = 0; y < targetHeight; y += 4) {
          let transCount = 0;
          let samples = 0;
          for (let x = Math.floor(targetWidth * 0.2); x < Math.floor(targetWidth * 0.8); x += 8) {
            const idx = (y * targetWidth + x) * 4;
            if (data[idx + 3] < 50) transCount++;
            samples++;
          }
          rowIsTransparent.push(transCount / samples > 0.6);
        }

        // Group contiguous transparent bands
        const bands: { startY: number; endY: number }[] = [];
        let inBand = false;
        let bandStart = 0;

        for (let i = 0; i < rowIsTransparent.length; i++) {
          const actualY = i * 4;
          if (rowIsTransparent[i] && !inBand) {
            inBand = true;
            bandStart = actualY;
          } else if (!rowIsTransparent[i] && inBand) {
            inBand = false;
            if (actualY - bandStart > 60) {
              bands.push({ startY: bandStart, endY: actualY });
            }
          }
        }
        if (inBand && targetHeight - bandStart > 60) {
          bands.push({ startY: bandStart, endY: targetHeight });
        }

        if (bands.length === expectedCount) {
          // Found matching bands! Now find horizontal bounds for each band
          const detectedSlots: SlotBox[] = bands.map((band, idx) => {
            const midY = Math.floor((band.startY + band.endY) / 2);
            let minX = targetWidth;
            let maxX = 0;

            for (let x = 0; x < targetWidth; x += 4) {
              const idx4 = (midY * targetWidth + x) * 4;
              if (data[idx4 + 3] < 50) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
              }
            }

            const slotX = minX < targetWidth ? minX : 40;
            const slotW = maxX > minX ? maxX - minX : targetWidth - 80;
            return {
              x: slotX,
              y: band.startY,
              width: slotW,
              height: band.endY - band.startY,
              label: `Slot Foto ${idx + 1}`,
              ratio: 'Auto Terdeteksi',
            };
          });

          return resolve(detectedSlots);
        }

        resolve(null);
      } catch (e) {
        console.warn('Auto detection error:', e);
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

const overlayCache = new Map<string, string>();

/**
 * Takes an uploaded Canva template image (JPG or PNG) and returns a transparent PNG
 * where the photo slots defined by the preset or custom slots are cut out cleanly.
 */
export async function punchHolesInCanvaOverlay(
  imageUrl: string,
  preset: CanvaTemplatePreset,
  cornerRadius: number = 14,
  customSlots?: SlotBox[]
): Promise<string> {
  if (!imageUrl) return '';

  const slotsToUse = customSlots && customSlots.length > 0 ? customSlots : preset.slots;
  const cacheKey = `${imageUrl.slice(0, 80)}_${imageUrl.length}_${preset.id}_${cornerRadius}_${slotsToUse.length}_${slotsToUse[0]?.x}_${slotsToUse[0]?.y}`;
  if (overlayCache.has(cacheKey)) {
    return overlayCache.get(cacheKey)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    if (imageUrl.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = preset.width;
        canvas.height = preset.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        // Draw the uploaded Canva template stretched/fit to standard photobooth preset dimensions
        ctx.drawImage(img, 0, 0, preset.width, preset.height);

        // Check if image already has transparent cutouts (alpha < 220)
        let hasTransparency = false;
        try {
          const sampleData = ctx.getImageData(0, 0, preset.width, preset.height).data;
          // Sample every 32nd pixel for fast check
          for (let i = 3; i < sampleData.length; i += 128) {
            if (sampleData[i] < 220) {
              hasTransparency = true;
              break;
            }
          }
        } catch {
          hasTransparency = false;
        }

        if (hasTransparency) {
          // Template already has transparent cutouts from Canva!
          // Use scaled PNG with exact preset dimensions so user's transparent shapes and borders are preserved 100%
          const transparentPng = canvas.toDataURL('image/png');
          overlayCache.set(cacheKey, transparentPng);
          resolve(transparentPng);
          return;
        }

        // Only for opaque images (like JPG): punch out the photo slots so they become transparent holes
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        slotsToUse.forEach((slot) => {
          ctx.beginPath();
          ctx.roundRect(slot.x, slot.y, slot.width, slot.height, cornerRadius);
          ctx.fill();
        });
        ctx.restore();

        const resultUrl = canvas.toDataURL('image/png');
        overlayCache.set(cacheKey, resultUrl);
        resolve(resultUrl);
      } catch (err) {
        console.warn('Error punching holes in template overlay:', err);
        resolve(imageUrl);
      }
    };

    img.onerror = () => {
      console.warn('Failed to load template overlay for punching');
      resolve(imageUrl);
    };

    img.src = imageUrl;
  });
}
