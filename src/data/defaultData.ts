import { BackgroundItem, PricingConfig, TemplateTheme, ChromaSettings } from '../types/photobooth';

export const DEFAULT_PRICING: PricingConfig = {
  physicalPrintPrice: 35000,
  digitalOnlyPrice: 20000,
  currencySymbol: 'Rp',
  boothName: 'FOTOKIOSK PRO',
  footerText: 'MEMORIES THAT LAST FOREVER • PHOTOKIOSK STUDIO',
};

export const DEFAULT_CHROMA_SETTINGS: ChromaSettings = {
  mode: 'ai_virtual', // Default: AI Smart Cutout (Tanpa kain hijau)
  enabled: true,
  keyColor: '#00FF00',
  tolerance: 45,
  smoothness: 25,
  spillSuppression: 45,
};

export const DEFAULT_BACKGROUNDS: BackgroundItem[] = [
  {
    id: 'bg-tokyo-night',
    name: 'Tokyo Neon Cyber',
    category: 'City & Lights',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bg-sunset-beach',
    name: 'Golden Tropical Beach',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bg-aesthetic-studio',
    name: 'Aesthetic Warm Studio',
    category: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bg-cozy-cafe',
    name: 'Vintage Parisian Cafe',
    category: 'Lifestyle',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bg-party-confetti',
    name: 'Disco Festival Lights',
    category: 'Party',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bg-cherry-blossom',
    name: 'Sakura Garden Bloom',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bg-none',
    name: 'Asli Ruangan (No Chroma)',
    category: 'Original',
    url: '',
    thumbnailUrl: '',
  },
];

export const DEFAULT_TEMPLATE_THEMES: TemplateTheme[] = [
  // STRIP PHOTO (Classic 2x6 booth strips)
  {
    id: 'strip-classic-noir',
    name: 'Classic Noir Photostrip',
    type: 'strip_photo',
    photoCount: 4,
    bgColor: '#121214',
    textColor: '#f4f4f5',
    accentColor: '#fbbf24',
    borderColor: '#ffffff',
    layout: 'vertical_strip',
    badge: 'Popular',
  },
  {
    id: 'strip-minimalist-white',
    name: 'Aesthetic Clean White Strip',
    type: 'strip_photo',
    photoCount: 4,
    bgColor: '#ffffff',
    textColor: '#18181b',
    accentColor: '#3b82f6',
    borderColor: '#18181b',
    layout: 'vertical_strip',
  },
  {
    id: 'strip-pastel-dream',
    name: 'Pastel Dream Pop Strip',
    type: 'strip_photo',
    photoCount: 3,
    bgColor: '#fdf2f8',
    textColor: '#831843',
    accentColor: '#ec4899',
    borderColor: '#f472b6',
    layout: 'vertical_strip',
  },
  {
    id: 'strip-vintage-duo',
    name: 'Retro Duo Strip',
    type: 'strip_photo',
    photoCount: 2,
    bgColor: '#1c1917',
    textColor: '#f5f5f4',
    accentColor: '#f97316',
    borderColor: '#f59e0b',
    layout: 'vertical_strip',
  },

  // SINGLE FRAME (Modern postcard / 4x6 print)
  {
    id: 'single-quad-grid',
    name: 'Quad Modern Grid Frame',
    type: 'single_frame',
    photoCount: 4,
    bgColor: '#ffffff',
    textColor: '#09090b',
    accentColor: '#059669',
    borderColor: '#18181b',
    layout: 'grid',
    badge: 'Best Value',
  },
  {
    id: 'single-triple-cinematic',
    name: 'Triple Cinematic Story',
    type: 'single_frame',
    photoCount: 3,
    bgColor: '#18181b',
    textColor: '#fafafa',
    accentColor: '#a855f7',
    borderColor: '#ffffff',
    layout: 'modern_split',
  },
  {
    id: 'single-duo-polaroid',
    name: 'Polaroid Twin Memories',
    type: 'single_frame',
    photoCount: 2,
    bgColor: '#fafaf9',
    textColor: '#292524',
    accentColor: '#e11d48',
    borderColor: '#1c1917',
    layout: 'polaroid_stack',
  },
];
