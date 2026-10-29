import React, { useState, useEffect } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Wand2,
  Filter,
  Type,
  Plus,
  Trash2,
} from 'lucide-react';
import { PhotoCapture, PhotoCount, TemplateTheme, TemplateType } from '../types/photobooth';
import { soundFx } from '../utils/audio';
import { getPresetForTemplate, punchHolesInCanvaOverlay } from '../utils/canvaTemplates';

interface StepPhotoSelectProps {
  templateType: TemplateType;
  photoCount: PhotoCount;
  selectedTheme: TemplateTheme;
  captures: PhotoCapture[];
  assignedSlots: (string | null)[];
  onUpdateAssignedSlots: (slots: (string | null)[]) => void;
  filter: 'normal' | 'bw' | 'vintage' | 'warm' | 'cool';
  onUpdateFilter: (filter: 'normal' | 'bw' | 'vintage' | 'warm' | 'cool') => void;
  customCaption: string;
  onUpdateCaption: (caption: string) => void;
  onProceed: () => void;
  onRetake: () => void;
}

export const StepPhotoSelect: React.FC<StepPhotoSelectProps> = ({
  templateType,
  photoCount,
  selectedTheme,
  captures,
  assignedSlots,
  onUpdateAssignedSlots,
  filter,
  onUpdateFilter,
  customCaption,
  onUpdateCaption,
  onProceed,
  onRetake,
}) => {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [lastAssignedInfo, setLastAssignedInfo] = useState<string | null>(null);
  const [punchedOverlayUrl, setPunchedOverlayUrl] = useState<string | null>(null);

  // Generate transparent slot cutouts for custom Canva template so photos sit behind the frame
  useEffect(() => {
    let isCancelled = false;
    if (selectedTheme.overlayUrl) {
      const preset = getPresetForTemplate(templateType, photoCount);
      punchHolesInCanvaOverlay(selectedTheme.overlayUrl, preset, 14).then((url) => {
        if (!isCancelled) {
          setPunchedOverlayUrl(url);
        }
      });
    } else {
      setPunchedOverlayUrl(null);
    }
    return () => {
      isCancelled = true;
    };
  }, [selectedTheme.overlayUrl, templateType, photoCount]);

  // Guarantee that assignedSlots has the exact length required
  useEffect(() => {
    if (assignedSlots.length !== photoCount) {
      const initial = Array.from(
        { length: photoCount },
        (_, i) => captures[i]?.id || captures[0]?.id || null
      );
      onUpdateAssignedSlots(initial);
    }
  }, [photoCount, captures]);

  // Handle assigning a specific photo to a specific slot
  const handleAssignToSlot = (photoId: string, slotIdx: number) => {
    soundFx.playCountdownTick(false);
    const nextSlots = [...assignedSlots];
    // Fill up to photoCount if array was shorter
    while (nextSlots.length < photoCount) {
      nextSlots.push(null);
    }
    nextSlots[slotIdx] = photoId;
    onUpdateAssignedSlots(nextSlots);

    const shotIndex = captures.findIndex((c) => c.id === photoId) + 1;
    setLastAssignedInfo(`Foto #${shotIndex} berhasil dimasukkan ke Slot ${slotIdx + 1}`);
    setTimeout(() => setLastAssignedInfo(null), 2500);

    // Auto-advance active slot to the next slot
    const nextEmpty = nextSlots.findIndex((s, idx) => idx > slotIdx && !s);
    if (nextEmpty !== -1) {
      setActiveSlotIndex(nextEmpty);
    } else {
      setActiveSlotIndex((slotIdx + 1) % photoCount);
    }
  };

  // Quick fill all slots sequentially
  const handleAutoFill = () => {
    soundFx.playPaymentVerified();
    const filled = Array.from(
      { length: photoCount },
      (_, i) => captures[i]?.id || captures[0]?.id || null
    );
    onUpdateAssignedSlots(filled);
    setLastAssignedInfo('Semua slot berhasil diisi berurutan!');
    setTimeout(() => setLastAssignedInfo(null), 2500);
  };

  // Clear a slot
  const handleClearSlot = (slotIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSlots = [...assignedSlots];
    nextSlots[slotIdx] = null;
    onUpdateAssignedSlots(nextSlots);
    setActiveSlotIndex(slotIdx);
  };

  const isAllFilled =
    assignedSlots.length === photoCount && assignedSlots.every((s) => s !== null && s !== undefined);

  // CSS Filter string for preview
  const getFilterStyle = (): React.CSSProperties => {
    switch (filter) {
      case 'bw':
        return { filter: 'grayscale(100%) contrast(120%)' };
      case 'vintage':
        return { filter: 'sepia(80%) contrast(110%) brightness(95%)' };
      case 'warm':
        return { filter: 'contrast(105%) saturate(130%) hue-rotate(-10deg)' };
      case 'cool':
        return { filter: 'contrast(105%) saturate(90%) hue-rotate(15deg)' };
      default:
        return {};
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-100 px-4 py-2.5 rounded-xl border border-stone-200 shadow-sm transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-amber-600" />
          <span>Foto Ulang (Retake Sesi)</span>
        </button>

        <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-300">
          {captures.length} Pose Tersedia • Butuh {photoCount} Foto
        </span>
      </div>

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider uppercase text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Langkah 6 dari 7 • Masukkan Foto ke Template
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading tracking-tight">
          Masukkan Foto ke Desain Template
        </h1>
        <p className="mt-2 text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
          Pilih foto terbaik Anda lalu tentukan ingin ditaruh di <strong>Slot 1, 2, 3, atau 4</strong>.
          Foto otomatis muncul di desain template sebelah kanan.
        </p>

        {lastAssignedInfo && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold animate-in fade-in slide-in-from-top-1">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>{lastAssignedInfo}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Left Column: Captured Shots Gallery & Direct Slot Assign Buttons (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-heading">
                  1. Pilih Jepretan Foto Anda
                </h3>
                <p className="text-xs text-stone-500">
                  Target Aktif: <strong className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Slot {activeSlotIndex + 1}</strong>
                </p>
              </div>

              <button
                onClick={handleAutoFill}
                className="text-xs text-amber-900 bg-amber-400 hover:bg-amber-300 font-extrabold flex items-center gap-1.5 px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95 cursor-pointer shrink-0"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Isi Otomatis Berurutan</span>
              </button>
            </div>

            {/* Shots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {captures.map((capture, index) => {
                const assignedIndex = assignedSlots.indexOf(capture.id);
                const isAssigned = assignedIndex !== -1;

                return (
                  <div
                    key={capture.id}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-stone-50 shadow-sm flex flex-col justify-between ${
                      isAssigned
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Photo Image container */}
                    <div
                      onClick={() => handleAssignToSlot(capture.id, activeSlotIndex)}
                      className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer bg-stone-200"
                      title={`Klik untuk memasukkan ke Slot ${activeSlotIndex + 1}`}
                    >
                      <img
                        src={capture.dataUrl}
                        alt={`Pose ${index + 1}`}
                        style={getFilterStyle()}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      {/* Pose badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-950/80 text-white backdrop-blur-sm border border-white/20">
                          Foto #{index + 1}
                        </span>
                        {isAssigned && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 shadow-sm flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Slot {assignedIndex + 1}</span>
                          </span>
                        )}
                      </div>

                      {/* Click overlay indicator */}
                      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition duration-200 text-xs font-extrabold text-stone-950 bg-white/95 px-3 py-1.5 rounded-xl shadow-lg border border-stone-200">
                          + Masukkan ke Slot {activeSlotIndex + 1}
                        </span>
                      </div>
                    </div>

                    {/* Direct slot assignment pills bar */}
                    <div className="p-2.5 bg-white border-t border-stone-200 flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
                        Taruh ke:
                      </span>
                      <div className="flex items-center gap-1 flex-1 justify-end">
                        {Array.from({ length: photoCount }).map((_, slotIdx) => {
                          const isCurrentSlot = assignedSlots[slotIdx] === capture.id;
                          return (
                            <button
                              key={slotIdx}
                              onClick={() => handleAssignToSlot(capture.id, slotIdx)}
                              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition active:scale-95 cursor-pointer ${
                                isCurrentSlot
                                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                                  : 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200'
                              }`}
                              title={`Pilih foto #${index + 1} untuk mengisi Slot ${slotIdx + 1}`}
                            >
                              S{slotIdx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Preset Controls */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider font-heading">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>2. Efek Filter Warna Foto:</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'normal', label: 'Original' },
                { id: 'bw', label: 'B & W Noir' },
                { id: 'vintage', label: 'Vintage' },
                { id: 'warm', label: 'Golden Warm' },
                { id: 'cool', label: 'Clean Cool' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateFilter(f.id as any)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
                    filter === f.id
                      ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Input */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider font-heading">
              <Type className="w-4 h-4 text-amber-600" />
              <span>3. Tulisan Caption / Tanggal di Foto:</span>
            </div>

            <input
              type="text"
              value={customCaption}
              onChange={(e) => onUpdateCaption(e.target.value)}
              placeholder="Contoh: BEST FRIENDS FOREVER • OKTOBER 2026"
              maxLength={45}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Column: Live Interactive Template Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Desain Template Terpilih:
            </label>
            <span className="text-[11px] font-mono text-stone-500">
              {templateType === 'strip_photo' ? 'Strip Photo (2x6)' : 'Single Frame (4R)'} • {photoCount} Foto
            </span>
          </div>

          {(() => {
            const preset = getPresetForTemplate(templateType, photoCount);
            return (
              <div
                className={`w-full rounded-3xl shadow-2xl transition-all duration-200 border-2 relative overflow-hidden select-none ${
                  templateType === 'strip_photo' ? 'max-w-[290px] sm:max-w-[310px]' : 'max-w-[380px] sm:max-w-[400px]'
                }`}
                style={{
                  aspectRatio: `${preset.width} / ${preset.height}`,
                  backgroundColor: selectedTheme.bgColor || '#ffffff',
                  borderColor: selectedTheme.borderColor || '#e7e5e4',
                }}
              >
                {/* Layer 0: Custom Template Background base if present */}
                {selectedTheme.overlayUrl && (
                  <img
                    src={selectedTheme.overlayUrl}
                    alt="Template Base Artwork"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
                  />
                )}

                {/* Studio Header (Rendered only for built-in themes) */}
                {!selectedTheme.overlayUrl && (
                  <div
                    className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-2 z-10"
                    style={{
                      left: `${(preset.headerArea.x / preset.width) * 100}%`,
                      top: `${(preset.headerArea.y / preset.height) * 100}%`,
                      width: `${(preset.headerArea.width / preset.width) * 100}%`,
                      height: `${(preset.headerArea.height / preset.height) * 100}%`,
                    }}
                  >
                    <span
                      className="text-xs font-black tracking-widest uppercase font-heading block leading-tight"
                      style={{ color: selectedTheme.textColor }}
                    >
                      FOTOKIOSK PRO
                    </span>
                    <span
                      className="text-[9px] tracking-widest font-mono uppercase opacity-70 block mt-0.5"
                      style={{ color: selectedTheme.textColor }}
                    >
                      STUDIO MEMORIES
                    </span>
                  </div>
                )}

                {/* Layer 1: Photo Slots positioned INSIDE the frame windows (z-10) */}
                {preset.slots.map((slot, slotIdx) => {
                  const assignedPhotoId = assignedSlots[slotIdx];
                  const photoObj = captures.find((c) => c.id === assignedPhotoId);
                  const isActive = activeSlotIndex === slotIdx;

                  return (
                    <div
                      key={slotIdx}
                      onClick={() => setActiveSlotIndex(slotIdx)}
                      className={`group absolute rounded-xl overflow-hidden cursor-pointer transition-all duration-150 flex items-center justify-center z-10 ${
                        !selectedTheme.overlayUrl
                          ? `border-3 ${
                              isActive
                                ? 'ring-4 ring-amber-400 shadow-xl scale-[1.01]'
                                : 'shadow-md hover:scale-[1.005]'
                            }`
                          : 'shadow-inner'
                      }`}
                      style={{
                        left: `${(slot.x / preset.width) * 100}%`,
                        top: `${(slot.y / preset.height) * 100}%`,
                        width: `${(slot.width / preset.width) * 100}%`,
                        height: `${(slot.height / preset.height) * 100}%`,
                        borderColor: !selectedTheme.overlayUrl
                          ? isActive
                            ? '#f59e0b'
                            : selectedTheme.borderColor || '#ffffff'
                          : 'transparent',
                        backgroundColor: photoObj ? 'transparent' : 'rgba(245, 245, 244, 0.9)',
                      }}
                      title={`Klik untuk memilih Slot Bingkai ${slotIdx + 1}`}
                    >
                      {photoObj ? (
                        <img
                          src={photoObj.dataUrl}
                          alt={`Slot ${slotIdx + 1}`}
                          style={getFilterStyle()}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-stone-500 text-center gap-1">
                          <Plus className="w-5 h-5 text-amber-600 stroke-[2.5]" />
                          <span className="text-[11px] font-bold text-stone-800">Slot {slotIdx + 1}</span>
                          <span className="text-[9px] text-stone-500 font-medium">Klik untuk isi</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Layer 2: Canva Frame Overlay with cut out slot windows (z-20) */}
                {/* Sits ON TOP of the photos, so Canva borders, stickers, headers and artwork frame the photo! */}
                {selectedTheme.overlayUrl && (
                  <img
                    src={punchedOverlayUrl || selectedTheme.overlayUrl}
                    alt="Canva Frame Overlay"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20 select-none"
                  />
                )}

                {/* Layer 3: Interactive Active Slot Target Rings & Delete Action Buttons (z-30) */}
                {preset.slots.map((slot, slotIdx) => {
                  const assignedPhotoId = assignedSlots[slotIdx];
                  const photoObj = captures.find((c) => c.id === assignedPhotoId);
                  const isActive = activeSlotIndex === slotIdx;

                  return (
                    <div
                      key={`ctrl-${slotIdx}`}
                      onClick={() => setActiveSlotIndex(slotIdx)}
                      className={`absolute rounded-xl pointer-events-none z-30 transition-all duration-150 ${
                        isActive
                          ? 'ring-4 ring-amber-400 shadow-xl'
                          : 'hover:ring-2 hover:ring-amber-300/60'
                      }`}
                      style={{
                        left: `${(slot.x / preset.width) * 100}%`,
                        top: `${(slot.y / preset.height) * 100}%`,
                        width: `${(slot.width / preset.width) * 100}%`,
                        height: `${(slot.height / preset.height) * 100}%`,
                      }}
                    >
                      {/* Active / Slot Tag Badge */}
                      <div
                        className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm backdrop-blur-sm pointer-events-none ${
                          isActive
                            ? 'bg-amber-400 text-stone-950 font-black ring-1 ring-amber-500'
                            : 'bg-stone-900/80 text-white'
                        }`}
                      >
                        S{slotIdx + 1} {isActive ? '★ Target' : ''}
                      </div>

                      {/* Remove from slot button on hover */}
                      {photoObj && (
                        <button
                          onClick={(e) => handleClearSlot(slotIdx, e)}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-stone-900/85 hover:bg-rose-600 text-white shadow-md transition pointer-events-auto cursor-pointer"
                          title="Hapus foto dari slot ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Footer Area */}
                <div
                  className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-2 z-25"
                  style={{
                    left: `${(preset.footerArea.x / preset.width) * 100}%`,
                    top: `${(preset.footerArea.y / preset.height) * 100}%`,
                    width: `${(preset.footerArea.width / preset.width) * 100}%`,
                    height: `${(preset.footerArea.height / preset.height) * 100}%`,
                  }}
                >
                  {(!selectedTheme.overlayUrl || customCaption) && (
                    <p
                      className="text-[10px] font-mono tracking-wider truncate uppercase font-bold"
                      style={{ color: selectedTheme.textColor }}
                    >
                      {customCaption || (!selectedTheme.overlayUrl ? 'FOTOKIOSK MEMORIES • 2026' : '')}
                    </p>
                  )}
                  {!selectedTheme.overlayUrl && (
                    <span
                      className="text-[8px] tracking-widest opacity-60 font-mono block mt-0.5"
                      style={{ color: selectedTheme.textColor }}
                    >
                      #{new Date().toLocaleDateString('id-ID')} • OFFICIAL PHOTOBOOTH
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="mt-3 text-center">
            <span className="text-xs text-stone-500">
              Tema aktif: <strong className="text-stone-800">{selectedTheme.name}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Proceed Navigation Button */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t border-stone-200">
        <button
          onClick={onRetake}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2 rounded-xl transition"
        >
          ← Ulangi Foto Sesi Ini
        </button>

        <button
          onClick={onProceed}
          disabled={!isAllFilled}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:from-stone-200 disabled:to-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-stone-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
        >
          <span>SELESAI & LANJUT KE CETAK / UNDUH</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
