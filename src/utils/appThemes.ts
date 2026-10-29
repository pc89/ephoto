import { AppThemeConfig, AppThemeId } from '../types/photobooth';
import { idbGet, idbSet } from './idb';

export const APP_THEMES: AppThemeConfig[] = [
  // 1. WARM STUDIO GOLD (Default Photobooth)
  {
    id: 'warm_amber',
    name: 'Warm Studio Gold',
    subtitle: 'Klasik Fotoboth • Hangat & Estetik',
    description: 'Nuansa studio foto klasik dengan aksen emas amber hangat, latar pasir lembut, dan kontras yang ramah mata.',
    tag: 'Default Kiosk',
    isDark: false,
    swatch: ['#faf8f5', '#ffffff', '#f59e0b', '#fbbf24'],
    cssVars: {
      '--app-bg': '#faf8f5',
      '--app-surface': '#ffffff',
      '--app-surface-subtle': '#f5f5f4',
      '--app-border': '#e7e5e4',
      '--app-text': '#1c1917',
      '--app-text-muted': '#78716c',
      '--app-primary': '#f59e0b',
      '--app-primary-hover': '#d97706',
      '--app-primary-light': '#fef3c7',
      '--app-primary-text': '#78350f',
      '--app-accent': '#fbbf24',
      '--app-ring': 'rgba(245, 158, 11, 0.4)',
    },
    classes: {
      bgApp: 'bg-[#faf8f5] text-stone-900',
      bgNavbar: 'bg-white/90 backdrop-blur-md border-stone-200/80',
      bgCard: 'bg-white border-stone-200 shadow-sm',
      bgCardSubtle: 'bg-stone-50 border-stone-200',
      borderCard: 'border-stone-200',
      textHeading: 'text-stone-900',
      textMuted: 'text-stone-500',
      primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold shadow-md shadow-amber-400/20 active:scale-95',
      primaryBtnText: 'text-stone-950',
      primaryAccentText: 'text-amber-600',
      primaryBadge: 'bg-amber-100 text-amber-900 border-amber-300/70',
      activeStep: 'bg-amber-400 text-stone-950 shadow-xs font-bold',
    },
  },

  // 2. KOREAN PASTEL DREAM (Life4Cuts / K-Pop Y2K)
  {
    id: 'korean_pastel',
    name: 'Korean Pastel Dream',
    subtitle: 'Life4Cuts Seoul • Cute & Sweet Pink',
    description: 'Gaya photobox Korea populer dengan dominasi pastel pink stroberi, aksen rose ceria, dan vibe imut khas tren K-Pop.',
    tag: 'Populer Remaja',
    isDark: false,
    swatch: ['#fff1f4', '#ffffff', '#f43f5e', '#fb7185'],
    cssVars: {
      '--app-bg': '#fff1f4',
      '--app-surface': '#ffffff',
      '--app-surface-subtle': '#ffe4e6',
      '--app-border': '#fecdd3',
      '--app-text': '#4c0519',
      '--app-text-muted': '#9f1239',
      '--app-primary': '#f43f5e',
      '--app-primary-hover': '#e11d48',
      '--app-primary-light': '#ffe4e6',
      '--app-primary-text': '#881337',
      '--app-accent': '#fb7185',
      '--app-ring': 'rgba(244, 63, 94, 0.4)',
    },
    classes: {
      bgApp: 'bg-[#fff1f4] text-rose-950',
      bgNavbar: 'bg-white/90 backdrop-blur-md border-rose-200/80',
      bgCard: 'bg-white border-rose-200 shadow-sm',
      bgCardSubtle: 'bg-rose-50/70 border-rose-200',
      borderCard: 'border-rose-200',
      textHeading: 'text-rose-950',
      textMuted: 'text-rose-600',
      primaryBtn: 'bg-rose-500 hover:bg-rose-400 text-white font-extrabold shadow-md shadow-rose-500/25 active:scale-95',
      primaryBtnText: 'text-white',
      primaryAccentText: 'text-rose-600',
      primaryBadge: 'bg-rose-100 text-rose-900 border-rose-300',
      activeStep: 'bg-rose-500 text-white shadow-xs font-bold',
    },
  },

  // 3. CYBERPUNK NEON NIGHT (Futuristic Dark Mode)
  {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon Night',
    subtitle: 'Futuristik • Neon Cyan & Dark Studio',
    description: 'Mode gelap futuristik dengan latar hitam midnight, aksen biru cyan neon berkilau, dan tombol bercahaya modern.',
    tag: 'Dark Mode Hits',
    isDark: true,
    swatch: ['#090d16', '#111827', '#06b6d4', '#8b5cf6'],
    cssVars: {
      '--app-bg': '#090d16',
      '--app-surface': '#111827',
      '--app-surface-subtle': '#1f2937',
      '--app-border': '#374151',
      '--app-text': '#f3f4f6',
      '--app-text-muted': '#9ca3af',
      '--app-primary': '#06b6d4',
      '--app-primary-hover': '#0891b2',
      '--app-primary-light': 'rgba(6, 182, 212, 0.2)',
      '--app-primary-text': '#cffafe',
      '--app-accent': '#8b5cf6',
      '--app-ring': 'rgba(6, 182, 212, 0.5)',
    },
    classes: {
      bgApp: 'bg-[#090d16] text-slate-100',
      bgNavbar: 'bg-slate-900/90 backdrop-blur-md border-slate-800',
      bgCard: 'bg-slate-900 border-slate-800 shadow-md',
      bgCardSubtle: 'bg-slate-800/60 border-slate-700/80',
      borderCard: 'border-slate-800',
      textHeading: 'text-white',
      textMuted: 'text-slate-400',
      primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/25 active:scale-95',
      primaryBtnText: 'text-slate-950',
      primaryAccentText: 'text-cyan-400',
      primaryBadge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/70',
      activeStep: 'bg-cyan-500 text-slate-950 shadow-xs font-bold',
    },
  },

  // 4. MINIMALIST NOIR STUDIO (Monochrome High-Fashion)
  {
    id: 'minimal_noir',
    name: 'Minimalist Noir Studio',
    subtitle: 'Editorial • Monokrom High-Contrast',
    description: 'Desain monokromatis mewah bergaya majalah editorial dengan kontras hitam-putih tajam, garis tegas, dan elegan.',
    tag: 'Luxury Modern',
    isDark: true,
    swatch: ['#09090b', '#18181b', '#fafafa', '#a1a1aa'],
    cssVars: {
      '--app-bg': '#09090b',
      '--app-surface': '#18181b',
      '--app-surface-subtle': '#27272a',
      '--app-border': '#3f3f46',
      '--app-text': '#fafafa',
      '--app-text-muted': '#a1a1aa',
      '--app-primary': '#fafafa',
      '--app-primary-hover': '#e4e4e7',
      '--app-primary-light': 'rgba(255, 255, 255, 0.15)',
      '--app-primary-text': '#18181b',
      '--app-accent': '#d4d4d8',
      '--app-ring': 'rgba(250, 250, 250, 0.4)',
    },
    classes: {
      bgApp: 'bg-[#09090b] text-zinc-100',
      bgNavbar: 'bg-zinc-900/90 backdrop-blur-md border-zinc-800',
      bgCard: 'bg-zinc-900 border-zinc-800 shadow-md',
      bgCardSubtle: 'bg-zinc-800/60 border-zinc-700',
      borderCard: 'border-zinc-800',
      textHeading: 'text-zinc-50',
      textMuted: 'text-zinc-400',
      primaryBtn: 'bg-zinc-100 hover:bg-white text-zinc-950 font-extrabold shadow-md active:scale-95',
      primaryBtnText: 'text-zinc-950',
      primaryAccentText: 'text-zinc-300',
      primaryBadge: 'bg-zinc-800 text-zinc-200 border-zinc-600',
      activeStep: 'bg-zinc-100 text-zinc-950 shadow-xs font-bold',
    },
  },

  // 5. MATCHA GREEN BOTANICAL (Sage & Earthy Cafe)
  {
    id: 'matcha_sage',
    name: 'Matcha Sage Botanical',
    subtitle: 'Alami • Sage Green • Scandinavian Cafe',
    description: 'Nuansa hijau sage dan matcha yang menenangkan, terinspirasi dari estetika kafe organik dan studio foto ramah lingkungan.',
    tag: 'Earthy Vibe',
    isDark: false,
    swatch: ['#f2f7f2', '#ffffff', '#10b981', '#34d399'],
    cssVars: {
      '--app-bg': '#f2f7f2',
      '--app-surface': '#ffffff',
      '--app-surface-subtle': '#e6f0e6',
      '--app-border': '#d1e2d1',
      '--app-text': '#142e1a',
      '--app-text-muted': '#4a6b50',
      '--app-primary': '#10b981',
      '--app-primary-hover': '#059669',
      '--app-primary-light': '#d1fae5',
      '--app-primary-text': '#065f46',
      '--app-accent': '#34d399',
      '--app-ring': 'rgba(16, 185, 129, 0.4)',
    },
    classes: {
      bgApp: 'bg-[#f2f7f2] text-emerald-950',
      bgNavbar: 'bg-white/90 backdrop-blur-md border-emerald-200/80',
      bgCard: 'bg-white border-emerald-200 shadow-sm',
      bgCardSubtle: 'bg-emerald-50/70 border-emerald-200',
      borderCard: 'border-emerald-200',
      textHeading: 'text-emerald-950',
      textMuted: 'text-emerald-700',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-600/20 active:scale-95',
      primaryBtnText: 'text-white',
      primaryAccentText: 'text-emerald-600',
      primaryBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      activeStep: 'bg-emerald-600 text-white shadow-xs font-bold',
    },
  },

  // 6. SUNSET RETRO 90S (Vintage Tangerine Polaroid)
  {
    id: 'sunset_retro',
    name: 'Sunset Retro 90s',
    subtitle: 'Nostalgia • Tangerine Orange • Vintage',
    description: 'Aura hangat era 90-an dengan warna oranye terakota matahari terbenam, bernostalgia dengan kamera polaroid film instan.',
    tag: 'Retro Nostalgia',
    isDark: false,
    swatch: ['#faf4ee', '#ffffff', '#ea580c', '#f97316'],
    cssVars: {
      '--app-bg': '#faf4ee',
      '--app-surface': '#ffffff',
      '--app-surface-subtle': '#ffedd5',
      '--app-border': '#fed7aa',
      '--app-text': '#431407',
      '--app-text-muted': '#9a3412',
      '--app-primary': '#ea580c',
      '--app-primary-hover': '#c2410c',
      '--app-primary-light': '#ffedd5',
      '--app-primary-text': '#7c2d12',
      '--app-accent': '#f97316',
      '--app-ring': 'rgba(234, 88, 12, 0.4)',
    },
    classes: {
      bgApp: 'bg-[#faf4ee] text-amber-950',
      bgNavbar: 'bg-white/90 backdrop-blur-md border-orange-200/80',
      bgCard: 'bg-white border-orange-200 shadow-sm',
      bgCardSubtle: 'bg-orange-50/70 border-orange-200',
      borderCard: 'border-orange-200',
      textHeading: 'text-amber-950',
      textMuted: 'text-orange-700',
      primaryBtn: 'bg-orange-600 hover:bg-orange-500 text-white font-extrabold shadow-md shadow-orange-600/20 active:scale-95',
      primaryBtnText: 'text-white',
      primaryAccentText: 'text-orange-600',
      primaryBadge: 'bg-orange-100 text-orange-950 border-orange-300',
      activeStep: 'bg-orange-600 text-white shadow-xs font-bold',
    },
  },
];

const APP_THEME_STORAGE_KEY = 'fotokiosk_app_theme_id_v2';
export const DEFAULT_APP_THEME_ID: AppThemeId = 'warm_amber';

// In-memory cache
let cachedAppThemeId: AppThemeId = DEFAULT_APP_THEME_ID;

/**
 * Get stored app UI theme ID from localStorage or fallback
 */
export function getStoredAppThemeId(): AppThemeId {
  try {
    const val = localStorage.getItem(APP_THEME_STORAGE_KEY) as AppThemeId;
    if (val && APP_THEMES.some((t) => t.id === val)) {
      cachedAppThemeId = val;
      return val;
    }
  } catch {
    // fallback
  }
  return cachedAppThemeId;
}

/**
 * Get full AppThemeConfig object for a given ID
 */
export function getAppTheme(id?: AppThemeId): AppThemeConfig {
  const targetId = id || cachedAppThemeId;
  return APP_THEMES.find((t) => t.id === targetId) || APP_THEMES[0];
}

/**
 * Save chosen app theme to localStorage and IndexedDB, then apply to DOM
 */
export function saveStoredAppThemeId(themeId: AppThemeId): void {
  cachedAppThemeId = themeId;
  try {
    localStorage.setItem(APP_THEME_STORAGE_KEY, themeId);
  } catch {
    // ignore
  }
  idbSet(APP_THEME_STORAGE_KEY, themeId).catch(() => {});

  const themeConfig = getAppTheme(themeId);
  applyAppThemeCss(themeConfig);
}

/**
 * Apply CSS variables and data attributes to :root for instantaneous application-wide styling
 */
export function applyAppThemeCss(theme: AppThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-app-theme', theme.id);

  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Inject CSS Variables
  Object.entries(theme.cssVars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
}
