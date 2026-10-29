import React, { useEffect, useRef, useState } from 'react';
import { Printer, Download, QrCode, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { OrderSession, PhotoCapture, PricingConfig, TemplateTheme } from '../types/photobooth';
import { getPresetForTemplate } from '../utils/canvaTemplates';

interface StepPrintDownloadProps {
  order: OrderSession;
  pricing: PricingConfig;
  selectedTheme: TemplateTheme;
  captures: PhotoCapture[];
  onNewSession: () => void;
}

export const StepPrintDownload: React.FC<StepPrintDownloadProps> = ({
  order,
  pricing,
  selectedTheme,
  captures,
  onNewSession,
}) => {
  const [downloadQrUrl, setDownloadQrUrl] = useState<string>('');
  const [compositeDataUrl, setCompositeDataUrl] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const printCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'],
      });
    } catch {
      // ignore
    }
  }, []);

  // Helper to load image safely into HTMLImageElement
  const loadImage = (src: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (!src) {
        resolve(null);
        return;
      }
      const img = new Image();
      // Only set crossOrigin for remote http(s) URLs, never for data: URLs
      if (src.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn('Failed to load image:', src.slice(0, 50));
        resolve(null);
      };
      img.src = src;
    });
  };

  // Helper to apply photo filters onto canvas context
  const getFilterString = (filterType: string): string => {
    switch (filterType) {
      case 'bw':
        return 'grayscale(100%) contrast(120%)';
      case 'vintage':
        return 'sepia(80%) contrast(110%) brightness(95%)';
      case 'warm':
        return 'contrast(105%) saturate(130%) hue-rotate(-10deg)';
      case 'cool':
        return 'contrast(105%) saturate(90%) hue-rotate(15deg)';
      default:
        return 'none';
    }
  };

  // Generate High Resolution Composite Canvas
  useEffect(() => {
    let isCancelled = false;

    async function buildComposite() {
      const canvas = printCanvasRef.current;
      if (!canvas) return;

      const preset = getPresetForTemplate(order.templateType, order.photoCount);
      const width = preset.width;
      const height = preset.height;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Base Background Layer
      ctx.fillStyle = selectedTheme.bgColor || '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Preload custom Canva template image if present
      let templateImg: HTMLImageElement | null = null;
      if (selectedTheme.overlayUrl) {
        templateImg = await loadImage(selectedTheme.overlayUrl);
        if (isCancelled) return;
      }

      // 2. If Custom Template is present, draw as base background artwork
      if (templateImg) {
        ctx.drawImage(templateImg, 0, 0, width, height);
      } else {
        // Otherwise draw standard studio header for built-in themes
        ctx.fillStyle = selectedTheme.textColor || '#1c1917';
        ctx.font = 'bold 36px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pricing.boothName || 'FOTOKIOSK PRO', width / 2, preset.headerArea.y + 42);

        ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillText('STUDIO MEMORIES', width / 2, preset.headerArea.y + 72);
      }

      // 3. Resolve and Draw Photos into designated Slots
      const slots = preset.slots;
      const assignedIds = order.assignedSlots || [];

      // Preload all slot images concurrently
      const imagePromises = slots.map(async (slot, idx) => {
        const assignedId = assignedIds[idx];
        const capture =
          captures.find((c) => c.id === assignedId) ||
          captures[idx] ||
          captures[0];

        if (capture?.dataUrl) {
          const img = await loadImage(capture.dataUrl);
          return { img, slot, idx };
        }
        return { img: null, slot, idx };
      });

      const loadedSlots = await Promise.all(imagePromises);
      if (isCancelled) return;

      // Draw each photo into its designated slot rectangle with cover crop & clean borders
      loadedSlots.forEach(({ img, slot, idx }) => {
        if (!img) {
          // Draw empty slot fallback box
          ctx.fillStyle = '#f5f5f4';
          ctx.beginPath();
          ctx.roundRect(slot.x, slot.y, slot.width, slot.height, 14);
          ctx.fill();
          ctx.strokeStyle = '#d6d3d1';
          ctx.lineWidth = 3;
          ctx.stroke();
          return;
        }

        ctx.save();
        ctx.filter = getFilterString(order.filter);

        // Aspect ratio cover math to fill the slot completely without distortion
        const imgAspect = img.width / img.height;
        const slotAspect = slot.width / slot.height;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;

        if (imgAspect > slotAspect) {
          sw = img.height * slotAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / slotAspect;
          sy = (img.height - sh) / 2;
        }

        // Clip rounded rectangle for photo slot
        ctx.beginPath();
        ctx.roundRect(slot.x, slot.y, slot.width, slot.height, 14);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.width, slot.height);
        ctx.restore();

        // Stroke border ONLY for built-in themes (Canva templates already provide custom frames)
        if (!templateImg) {
          ctx.strokeStyle =
            selectedTheme.borderColor ||
            (selectedTheme.bgColor === '#ffffff' ? '#18181b' : '#ffffff');
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.roundRect(slot.x, slot.y, slot.width, slot.height, 14);
          ctx.stroke();
        }
      });

      // 4. Draw Custom Canva Overlay with slot cutouts punched transparently
      // Sits ON TOP of the photos, so the Canva frame, borders, and decorations cleanly frame the photos!
      if (templateImg) {
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = width;
        overlayCanvas.height = height;
        const octx = overlayCanvas.getContext('2d');
        if (octx) {
          octx.drawImage(templateImg, 0, 0, width, height);
          octx.save();
          octx.globalCompositeOperation = 'destination-out';
          slots.forEach((slot) => {
            octx.beginPath();
            // Punch out the exact slot window cleanly so photos show through 100%
            octx.roundRect(slot.x, slot.y, slot.width, slot.height, 14);
            octx.fill();
          });
          octx.restore();

          // Draw the punched Canva frame overlay on top of the composite
          ctx.drawImage(overlayCanvas, 0, 0, width, height);
        }
      }

      // 5. Draw Footer Text & Date
      if (!templateImg) {
        ctx.fillStyle = selectedTheme.textColor || '#1c1917';
        ctx.font = 'bold 24px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        const footerY = preset.footerArea.y + 45;
        ctx.fillText(order.customCaption || 'FOTOKIOSK SPECIAL MOMENTS', width / 2, footerY);

        ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(120, 113, 108, 0.9)';
        const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        ctx.fillText(`${dateStr} • #${order.id.slice(0, 8).toUpperCase()}`, width / 2, footerY + 34);
      } else if (order.customCaption && order.customCaption.trim() !== '') {
        // Only draw custom user caption on Canva template if specified
        ctx.fillStyle = selectedTheme.textColor || '#1c1917';
        ctx.font = 'bold 22px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(order.customCaption, width / 2, preset.footerArea.y + 45);
      }

      if (isCancelled) return;

      const finalUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCompositeDataUrl(finalUrl);

      // Generate Download QR Code
      QRCode.toDataURL(finalUrl, {
        width: 240,
        margin: 1,
        color: { dark: '#1c1917', light: '#ffffff' },
      })
        .then((url) => {
          if (!isCancelled) setDownloadQrUrl(url);
        })
        .catch(() => {
          const fallback = `${window.location.origin}/#download-${order.id}`;
          QRCode.toDataURL(fallback, { width: 240, margin: 1 }).then((url) => {
            if (!isCancelled) setDownloadQrUrl(url);
          });
        });
    }

    buildComposite();

    return () => {
      isCancelled = true;
    };
  }, [
    order.id,
    order.templateType,
    order.photoCount,
    (order.assignedSlots || []).join(','),
    order.filter,
    order.customCaption,
    selectedTheme.id,
    selectedTheme.bgColor,
    selectedTheme.overlayUrl,
    captures.length,
    pricing.boothName,
  ]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 600);
  };

  const handleDownload = () => {
    if (!compositeDataUrl) return;
    const a = document.createElement('a');
    a.href = compositeDataUrl;
    a.download = `fotokiosk-${order.templateType}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Offscreen / Print-Ready Canvas */}
      <canvas ref={printCanvasRef} className="hidden" />

      {/* Printable Area targeted by @media print */}
      <div id="printable-photobooth-area" className="hidden">
        {compositeDataUrl && (
          <img
            src={compositeDataUrl}
            alt="Print Output"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Langkah Terakhir • Sesi Selesai
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading tracking-tight">
          Foto Kenangan Anda Siap!
        </h1>
        <p className="mt-2 text-stone-600 text-sm max-w-xl mx-auto">
          {order.serviceType === 'physical_print'
            ? 'Cetak lembar fisik foto ke printer studio atau scan kode QR untuk download langsung ke smartphone.'
            : 'Scan kode QR di bawah ini menggunakan kamera HP untuk mengunduh file foto resolusi tinggi.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
        {/* Left: Final Composite Preview (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white p-2.5 max-w-[340px] w-full">
            {compositeDataUrl ? (
              <img
                src={compositeDataUrl}
                alt="Composite Output"
                className="w-full rounded-xl shadow-md object-contain"
              />
            ) : (
              <div className="w-full aspect-[2/3] flex flex-col items-center justify-center text-stone-400 text-xs gap-2 bg-stone-50 rounded-xl">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Merender hasil cetak foto...</span>
              </div>
            )}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono font-medium text-stone-400">
                Preset: {selectedTheme.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & QR Download (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Main Action based on Service Type */}
          {order.serviceType === 'physical_print' && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-white border-2 border-amber-300 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-400 text-stone-950 shadow-md shadow-amber-400/30">
                  <Printer className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-heading">
                    Cetak Fisik ke Printer Foto
                  </h3>
                  <p className="text-xs text-stone-600">
                    Kertas foto glossy resolusi 300 DPI siap dicetak langsung
                  </p>
                </div>
              </div>

              <button
                onClick={handlePrint}
                disabled={isPrinting || !compositeDataUrl}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-base rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-5 h-5" />
                <span>{isPrinting ? 'Mempersiapkan Printer...' : 'CETAK SEKARANG KE PRINTER'}</span>
              </button>
            </div>
          )}

          {/* Smartphone QR Code Scan */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-stone-100 text-stone-800 border border-stone-200">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-heading">
                  Scan QR Code untuk Download ke HP
                </h3>
                <p className="text-xs text-stone-500">
                  Buka kamera ponsel Anda dan arahkan ke kode QR berikut
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner shrink-0">
                {downloadQrUrl ? (
                  <img
                    src={downloadQrUrl}
                    alt="Download QR"
                    className="w-36 h-36 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-36 h-36 bg-stone-100 flex items-center justify-center text-stone-400 text-xs rounded-lg">
                    Generating...
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs text-stone-600">
                <p className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-600 shrink-0">1.</span>
                  <span>Buka aplikasi Kamera di iPhone atau ponsel Android Anda.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-600 shrink-0">2.</span>
                  <span>Arahkan lensa ke kode QR di samping hingga muncul notifikasi.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-600 shrink-0">3.</span>
                  <span>Ketuk tautan untuk membuka dan menyimpan gambar ke galeri foto!</span>
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center gap-2 border border-stone-200 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-600" />
                    <span>Download File Langsung (.JPG)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* New Session Reset */}
          <div className="pt-2">
            <button
              onClick={onNewSession}
              className="w-full py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 font-bold text-sm rounded-2xl border border-stone-200 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Selesai & Mulai Sesi Pelanggan Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
