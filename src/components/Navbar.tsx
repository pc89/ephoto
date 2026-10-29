import React from 'react';
import { Camera, Lock, Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import { PricingConfig, ServiceType } from '../types/photobooth';

interface NavbarProps {
  currentStep: number;
  totalSteps: number;
  pricing: PricingConfig;
  selectedService: ServiceType | null;
  onOpenAdmin: () => void;
  onOpenPrompt: () => void;
  onResetSession: () => void;
  isAdminLoggedIn: boolean;
}

const STEP_LABELS = [
  'Layanan',
  'Pembayaran',
  'Template',
  'Background',
  'Pemotretan',
  'Pilih Foto',
  'Cetak & Unduh',
];

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  totalSteps,
  pricing,
  selectedService,
  onOpenAdmin,
  onOpenPrompt,
  onResetSession,
  isAdminLoggedIn,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center text-stone-950 font-black shadow-md shadow-amber-400/25">
            <Camera className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg tracking-tight text-stone-900">
                {pricing.boothName || 'FOTOKIOSK PRO'}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300/70 font-bold">
                Smart Studio
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block font-medium">
              Selfie & Photobooth Studio Experience
            </p>
          </div>
        </div>

        {/* Step Indicator on Desktop */}
        <div className="hidden md:flex items-center gap-1.5">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : isCompleted
                      ? 'text-stone-700 bg-stone-100 border border-stone-200'
                      : 'text-stone-400'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-stone-950 text-amber-300'
                        : isCompleted
                        ? 'bg-stone-200 text-stone-700'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {stepNum}
                  </span>
                  <span>{label}</span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <span className="text-stone-300 mx-0.5 text-xs">/</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Prompt AI Studio Modal */}
          <button
            onClick={onOpenPrompt}
            title="Lihat & Salin Prompt AI Studio"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-xl transition shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Prompt AI Studio</span>
          </button>

          {/* Sesi Baru */}
          {currentStep > 1 && (
            <button
              onClick={onResetSession}
              title="Mulai Ulang Sesi"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Admin Login */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition shadow-2xs ${
              isAdminLoggedIn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-stone-700 border-stone-300 hover:text-stone-950 hover:bg-stone-50'
            }`}
          >
            {isAdminLoggedIn ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin Kasir</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span>Admin Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
