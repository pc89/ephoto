import React from 'react';
import { Camera, Lock, Sparkles, RotateCcw, ShieldCheck, Palette } from 'lucide-react';
import { PricingConfig, ServiceType, AppThemeConfig } from '../types/photobooth';

interface NavbarProps {
  currentStep: number;
  totalSteps: number;
  pricing: PricingConfig;
  selectedService: ServiceType | null;
  onOpenAdmin: () => void;
  onOpenPrompt: () => void;
  onResetSession: () => void;
  isAdminLoggedIn: boolean;
  appTheme?: AppThemeConfig;
}

const STEP_LABELS = [
  'Layanan',
  'Pembayaran',
  'Background',
  'Pemotretan',
  'Template & Foto',
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
  appTheme,
}) => {
  const isDark = appTheme?.isDark;
  const primaryColor = appTheme?.cssVars['--app-primary'] || '#f59e0b';
  const accentColor = appTheme?.cssVars['--app-accent'] || '#fbbf24';
  const primaryTextColor = appTheme?.cssVars['--app-primary-text'] || '#000000';

  return (
    <header className={`sticky top-0 z-30 transition-colors duration-200 border-b shadow-xs ${
      appTheme?.classes.bgNavbar || 'bg-white/85 backdrop-blur-md border-stone-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo E Photo Booth */}
        <div
          onClick={onResetSession}
          className="flex items-center py-0.5 cursor-pointer transition hover:opacity-95 active:scale-98 select-none group shrink-0"
          title="E Photo Booth • Beranda"
        >
          <img
            src="/assets/aistudio/EPhotoBooth_90461f47.png"
            alt="E Photo Booth"
            className="h-11 sm:h-13 w-auto object-contain drop-shadow-sm filter transition-transform duration-200 group-hover:scale-[1.02]"
          />
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
                      ? appTheme?.classes.activeStep || 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : isCompleted
                      ? isDark
                        ? 'text-slate-300 bg-slate-800/80 border border-slate-700'
                        : 'text-stone-700 bg-stone-100 border border-stone-200'
                      : isDark
                      ? 'text-slate-600'
                      : 'text-stone-400'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? isDark
                          ? 'bg-slate-950 text-cyan-300'
                          : 'bg-stone-950 text-amber-300'
                        : isCompleted
                        ? isDark
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-stone-200 text-stone-700'
                        : isDark
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {stepNum}
                  </span>
                  <span>{label}</span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <span className={`mx-0.5 text-xs ${isDark ? 'text-slate-700' : 'text-stone-300'}`}>/</span>
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
