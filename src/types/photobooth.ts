export type ServiceType = 'physical_print' | 'digital_only';

export type PaymentMethod = 'cash' | 'qris';

export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export type TemplateType = 'single_frame' | 'strip_photo';

export type PhotoCount = 2 | 3 | 4;

export interface PricingConfig {
  physicalPrintPrice: number; // e.g. 35000
  digitalOnlyPrice: number;   // e.g. 20000
  currencySymbol: string;     // 'Rp'
  boothName: string;
  footerText: string;
}

export interface BackgroundItem {
  id: string;
  name: string;
  category: string;
  url: string;
  thumbnailUrl?: string;
  isCustom?: boolean;
}

export interface TemplateTheme {
  id: string;
  name: string;
  type: TemplateType;
  photoCount: PhotoCount;
  bgColor: string;
  textColor: string;
  accentColor: string;
  borderColor?: string;
  overlayUrl?: string; // Optional custom transparent frame overlay uploaded by admin
  layout: 'grid' | 'vertical_strip' | 'polaroid_stack' | 'modern_split';
  badge?: string;
}

export type BackgroundRemovalMode = 'ai_virtual' | 'green_screen' | 'none';

export interface ChromaSettings {
  mode: BackgroundRemovalMode; // 'ai_virtual' (Tanpa kain hijau), 'green_screen' (Kain hijau fisik), 'none'
  enabled: boolean;
  keyColor: string; // Hex color code e.g. #00FF00
  tolerance: number; // 0 - 100
  smoothness: number; // 0 - 100
  spillSuppression: number; // 0 - 100
}

export interface PhotoCapture {
  id: string;
  timestamp: number;
  dataUrl: string; // Processed photo with background replaced
  rawUrl?: string; // Original raw camera snap
}

export interface OrderSession {
  id: string;
  createdAt: number;
  serviceType: ServiceType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amount: number;
  templateType: TemplateType;
  photoCount: PhotoCount;
  selectedBackgroundId: string;
  selectedThemeId: string;
  capturedPhotos: PhotoCapture[];
  assignedSlots: (string | null)[]; // Photo IDs assigned to each slot index
  filter: 'normal' | 'bw' | 'vintage' | 'warm' | 'cool';
  customCaption?: string;
  isPrinted?: boolean;
}

export interface AdminCredentials {
  pin: string;
}
