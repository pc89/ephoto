import { BackgroundItem, PricingConfig, TemplateTheme, ChromaSettings } from '../types/photobooth';

export const DEFAULT_PRICING: PricingConfig = {
  physicalPrintPrice: 35000,
  digitalOnlyPrice: 20000,
  currencySymbol: 'Rp',
  boothName: 'E PHOTO BOOTH',
  footerText: 'MEMORIES THAT LAST FOREVER • E PHOTO BOOTH',
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

const KOREAN_LIFE4CUTS_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800" viewBox="0 0 600 1800">
  <defs>
    <mask id="cutouts">
      <rect width="600" height="1800" fill="white" />
      <rect x="40" y="120" width="520" height="355" rx="16" fill="black" />
      <rect x="40" y="495" width="520" height="355" rx="16" fill="black" />
      <rect x="40" y="870" width="520" height="355" rx="16" fill="black" />
      <rect x="40" y="1245" width="520" height="355" rx="16" fill="black" />
    </mask>
  </defs>
  <rect width="600" height="1800" fill="#fff1f2" mask="url(#cutouts)" />
  <rect x="40" y="120" width="520" height="355" rx="16" fill="none" stroke="#f43f5e" stroke-width="6" />
  <rect x="40" y="495" width="520" height="355" rx="16" fill="none" stroke="#f43f5e" stroke-width="6" />
  <rect x="40" y="870" width="520" height="355" rx="16" fill="none" stroke="#f43f5e" stroke-width="6" />
  <rect x="40" y="1245" width="520" height="355" rx="16" fill="none" stroke="#f43f5e" stroke-width="6" />
  <text x="300" y="72" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#e11d48" text-anchor="middle" letter-spacing="4">KOREAN LIFE4CUTS</text>
  <text x="300" y="96" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#fb7185" text-anchor="middle" letter-spacing="2">PHOTOBOOTH STUDIO</text>
  <text x="300" y="1670" font-family="system-ui, sans-serif" font-weight="800" font-size="24" fill="#e11d48" text-anchor="middle" letter-spacing="3">BEST MEMORIES</text>
  <text x="300" y="1710" font-family="monospace" font-weight="700" font-size="16" fill="#f43f5e" text-anchor="middle">★ SPECIAL EDITION ★</text>
</svg>
`.trim())}`;

const CANVA_4R_POSTCARD_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800" viewBox="0 0 1200 1800">
  <defs>
    <mask id="cutouts4r">
      <rect width="1200" height="1800" fill="white" />
      <rect x="45" y="130" width="535" height="710" rx="16" fill="black" />
      <rect x="620" y="130" width="535" height="710" rx="16" fill="black" />
      <rect x="45" y="875" width="535" height="710" rx="16" fill="black" />
      <rect x="620" y="875" width="535" height="710" rx="16" fill="black" />
    </mask>
  </defs>
  <rect width="1200" height="1800" fill="#f8fafc" mask="url(#cutouts4r)" />
  <rect x="45" y="130" width="535" height="710" rx="16" fill="none" stroke="#0ea5e9" stroke-width="6" />
  <rect x="620" y="130" width="535" height="710" rx="16" fill="none" stroke="#0ea5e9" stroke-width="6" />
  <rect x="45" y="875" width="535" height="710" rx="16" fill="none" stroke="#0ea5e9" stroke-width="6" />
  <rect x="620" y="875" width="535" height="710" rx="16" fill="none" stroke="#0ea5e9" stroke-width="6" />
  <text x="600" y="75" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#0369a1" text-anchor="middle" letter-spacing="4">CANVA MODERN POSTCARD</text>
  <text x="600" y="102" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#0284c7" text-anchor="middle" letter-spacing="2">4R FRAME • TRANSPARENT WINDOWS</text>
  <text x="600" y="1680" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#0369a1" text-anchor="middle" letter-spacing="3">FOTOKIOSK PRO MEMORIES</text>
  <text x="600" y="1720" font-family="monospace" font-weight="700" font-size="18" fill="#0ea5e9" text-anchor="middle">★ CELEBRATION MOMENT ★</text>
</svg>
`.trim())}`;

export const DEFAULT_TEMPLATE_THEMES: TemplateTheme[] = [
  // CANVA TRANSPARENT TEMPLATES (Photos sit behind template, shining through transparent cutouts)
  {
    id: 'canva-korean-life4cuts',
    name: 'Canva Korean Life4Cuts (Transparan)',
    type: 'strip_photo',
    photoCount: 4,
    bgColor: '#ffffff',
    textColor: '#e11d48',
    accentColor: '#f43f5e',
    borderColor: '#f43f5e',
    layout: 'vertical_strip',
    badge: 'Canva Frame',
    overlayUrl: KOREAN_LIFE4CUTS_SVG,
  },
  {
    id: 'canva-4r-aesthetic-quad',
    name: 'Canva Postcard 4R (Transparan)',
    type: 'single_frame',
    photoCount: 4,
    bgColor: '#ffffff',
    textColor: '#0369a1',
    accentColor: '#0ea5e9',
    borderColor: '#0ea5e9',
    layout: 'grid',
    badge: 'Canva 4R',
    overlayUrl: CANVA_4R_POSTCARD_SVG,
  },
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
