import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ArrowLeft, ImageOff, Plus, Wand2 } from 'lucide-react';
import { BackgroundItem } from '../types/photobooth';

interface StepBackgroundSelectProps {
  backgrounds: BackgroundItem[];
  selectedBackgroundId: string;
  onSelectBackground: (bgId: string) => void;
  onProceed: () => void;
  onBack: () => void;
  onOpenAdmin: () => void;
}

export const StepBackgroundSelect: React.FC<StepBackgroundSelectProps> = ({
  backgrounds,
  selectedBackgroundId,
  onSelectBackground,
  onProceed,
  onBack,
  onOpenAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(backgrounds.map((b) => b.category).filter(Boolean)))];

  const filteredBackgrounds =
    selectedCategory === 'All'
      ? backgrounds
      : backgrounds.filter((b) => b.category === selectedCategory);

  const currentBg = backgrounds.find((b) => b.id === selectedBackgroundId) || backgrounds[0];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ganti Desain Template</span>
        </button>

        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-300/80">
          Chroma & AI Siap
        </span>
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-bold font-mono tracking-widest uppercase text-amber-800 bg-amber-100/70 px-3.5 py-1.5 rounded-full border border-amber-300/80 shadow-2xs">
          Langkah 4 dari 7 • Latar Belakang Virtual
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-stone-900 font-heading tracking-tight">
          Pilih Background Foto Anda
        </h1>
        <p className="mt-2 text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
          Kamera secara cerdas menghapus latar belakang ruangan dan menggantikannya dengan pemandangan studio favorit Anda (Bisa dengan atau tanpa kain hijau!).
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-stone-200 shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat === 'All' ? 'Semua Background' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl border border-amber-300/80 font-bold transition shrink-0 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Background Baru (Admin)</span>
        </button>
      </div>

      {/* Background Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {filteredBackgrounds.map((bg) => {
          const isSelected = selectedBackgroundId === bg.id;
          const isNone = bg.id === 'bg-none' || !bg.url;

          return (
            <div
              key={bg.id}
              onClick={() => onSelectBackground(bg.id)}
              className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 aspect-[4/3] flex flex-col justify-end p-3 ${
                isSelected
                  ? 'border-amber-500 ring-4 ring-amber-400/30 shadow-xl scale-[1.02]'
                  : 'border-stone-200 hover:border-stone-300 bg-white shadow-md'
              }`}
            >
              {isNone ? (
                <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center text-stone-500 p-4 text-center">
                  <ImageOff className="w-8 h-8 mb-2 text-stone-400" />
                  <span className="text-xs font-bold text-stone-800">Background Asli</span>
                  <span className="text-[10px] text-stone-500 font-medium">Tanpa Ganti Latar</span>
                </div>
              ) : (
                <>
                  <img
                    src={bg.thumbnailUrl || bg.url}
                    alt={bg.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                </>
              )}

              {/* Status Tags */}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className={`text-xs font-bold truncate ${isNone ? 'text-stone-800' : 'text-white drop-shadow'}`}>
                    {bg.name}
                  </h4>
                  {bg.isCustom && (
                    <span className="text-[9px] font-mono text-amber-300 bg-black/60 px-1 py-0.5 rounded">
                      Admin Upload
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-md shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Preview Banner */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-inner">
            {currentBg.url ? (
              <img
                src={currentBg.thumbnailUrl || currentBg.url}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                <ImageOff className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">Background Terpilih:</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {currentBg.name}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
              {currentBg.url
                ? 'Latar belakang ruangan kamera akan otomatis digantikan secara cerdas dengan tema ini.'
                : 'Kamera akan menampilkan latar asli ruangan photobooth tanpa penggantian latar.'}
            </p>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 transition active:scale-95 shrink-0 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>Mulai Hitungan Mundur & Foto</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
