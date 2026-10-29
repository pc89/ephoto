import React from 'react';
import { Columns, Grid, Check, Sparkles, ArrowRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { PhotoCount, TemplateTheme, TemplateType } from '../types/photobooth';

interface StepTemplateSelectProps {
  selectedType: TemplateType;
  selectedCount: PhotoCount;
  selectedThemeId: string;
  themes: TemplateTheme[];
  onSelectType: (type: TemplateType) => void;
  onSelectCount: (count: PhotoCount) => void;
  onSelectTheme: (themeId: string) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const StepTemplateSelect: React.FC<StepTemplateSelectProps> = ({
  selectedType,
  selectedCount,
  selectedThemeId,
  themes,
  onSelectType,
  onSelectCount,
  onSelectTheme,
  onProceed,
  onBack,
}) => {
  // Filter themes that match current type and photo count (or universal)
  const currentThemes = themes.filter(
    (t) => t.type === selectedType && (t.photoCount === selectedCount || !t.photoCount)
  );

  const selectedTheme =
    currentThemes.find((t) => t.id === selectedThemeId) ||
    currentThemes[0] ||
    themes.find((t) => t.type === selectedType) ||
    themes[0];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300/80">
          ✓ Pembayaran Tervalidasi
        </span>
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-bold font-mono tracking-widest uppercase text-amber-800 bg-amber-100/70 px-3.5 py-1.5 rounded-full border border-amber-300/80 shadow-2xs">
          Langkah 3 dari 7 • Desain Template & Jumlah Pose
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-stone-900 font-heading tracking-tight">
          Pilih Format Template & Jumlah Foto
        </h1>
        <p className="mt-2 text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
          Pilih antara format strip vertikal klasik atau single frame postcard 4R, lalu tentukan jumlah jepretan pose Anda.
        </p>
      </div>

      {/* 1. Tipe Template (Strip vs Single Frame) */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          1. Pilih Format Desain Template:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strip Photo */}
          <div
            onClick={() => onSelectType('strip_photo')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-4 ${
              selectedType === 'strip_photo'
                ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Columns className="w-6 h-6 rotate-90" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">Strip Photo</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-amber-800 border border-stone-200">
                  2x6 Inci
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Gaya strip vertikal klasik photobooth mall/Korea (Life4Cuts) yang memanjang ke bawah.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                selectedType === 'strip_photo'
                  ? 'bg-amber-400 border-amber-500 text-stone-950 shadow-xs'
                  : 'border-stone-300 bg-stone-50'
              }`}
            >
              {selectedType === 'strip_photo' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Single Frame */}
          <div
            onClick={() => onSelectType('single_frame')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-4 ${
              selectedType === 'single_frame'
                ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Grid className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">Single Frame 4R</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-amber-800 border border-stone-200">
                  4x6 Inci
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Format kartu foto kolase modern postcard dengan layout grid simetris dan estetik.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                selectedType === 'single_frame'
                  ? 'bg-amber-400 border-amber-500 text-stone-950 shadow-xs'
                  : 'border-stone-300 bg-stone-50'
              }`}
            >
              {selectedType === 'single_frame' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Jumlah Foto (2, 3, atau 4 Foto) */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          2. Pilih Jumlah Pose Foto yang Ingin Dicetak:
        </label>
        <div className="grid grid-cols-3 gap-3">
          {([2, 3, 4] as PhotoCount[]).map((count) => {
            const isSelected = selectedCount === count;
            return (
              <button
                key={count}
                onClick={() => onSelectCount(count)}
                className={`py-4 px-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 font-extrabold border-amber-500 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50 shadow-xs'
                }`}
              >
                <span className="text-2xl font-black font-heading">{count}</span>
                <span className="text-xs uppercase tracking-wider font-bold">
                  Foto Pose
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    isSelected ? 'text-stone-950/80' : 'text-stone-500'
                  }`}
                >
                  {count === 2
                    ? 'Duo Pose'
                    : count === 3
                    ? 'Trio Pose'
                    : 'Quad Max Pose'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Pilihan Tema Warna & Frame Border */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            3. Pilih Tema Warna Frame:
          </label>
          <span className="text-xs font-medium text-stone-500">
            {currentThemes.length} Desain Siap Dipakai
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentThemes.map((theme) => {
            const isSelected = selectedTheme?.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/30'
                    : 'border-stone-200 bg-white hover:border-stone-300 shadow-xs'
                }`}
              >
                {/* Visual miniature layout */}
                <div
                  className="w-full h-28 rounded-xl p-1 mb-2.5 flex flex-col items-center justify-center shadow-inner relative overflow-hidden"
                  style={{
                    backgroundColor: theme.bgColor,
                    border: `1px solid ${theme.borderColor || 'rgba(0,0,0,0.1)'}`,
                  }}
                >
                  {theme.overlayUrl ? (
                    <img
                      src={theme.overlayUrl}
                      alt={theme.name}
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <>
                      <div
                        className={`w-full flex-1 gap-1 flex p-1 ${
                          selectedType === 'strip_photo'
                            ? 'flex-col'
                            : selectedCount === 4
                            ? 'grid grid-cols-2'
                            : selectedCount === 3
                            ? 'flex flex-col'
                            : 'flex flex-row'
                        }`}
                      >
                        {Array.from({ length: selectedCount }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-stone-400/30 rounded flex items-center justify-center text-[9px] font-bold text-stone-700"
                            style={{ minHeight: '12px' }}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      <span
                        className="text-[8px] font-black tracking-widest uppercase mt-0.5 truncate max-w-full"
                        style={{ color: theme.textColor }}
                      >
                        FOTOKIOSK
                      </span>
                    </>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 truncate">
                      {theme.name}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[3]" />
                    )}
                  </div>
                  {theme.overlayUrl && (
                    <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                      <ImageIcon className="w-3 h-3" />
                      <span>Custom Admin</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-200">
        <button
          onClick={() => {
            onSelectTheme(selectedTheme.id);
            onProceed();
          }}
          className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl shadow-md shadow-amber-400/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <span>Pilih Latar Belakang Foto</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
