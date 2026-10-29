import { BackgroundItem, PricingConfig, TemplateTheme, ChromaSettings, OrderSession } from '../types/photobooth';
import { DEFAULT_BACKGROUNDS, DEFAULT_PRICING, DEFAULT_TEMPLATE_THEMES, DEFAULT_CHROMA_SETTINGS } from '../data/defaultData';
import { idbGet, idbSet } from './idb';

const STORAGE_KEYS = {
  PRICING: 'fotokiosk_pricing_v1',
  ADMIN_PIN: 'fotokiosk_admin_pin_v1',
  BACKGROUNDS: 'fotokiosk_backgrounds_v1',
  THEMES: 'fotokiosk_themes_v1',
  CHROMA: 'fotokiosk_chroma_v1',
  ORDERS: 'fotokiosk_orders_v1',
  ACTIVE_ORDER: 'fotokiosk_active_order_v1',
};

// In-memory cache for synchronous access
let memoryThemes: TemplateTheme[] = DEFAULT_TEMPLATE_THEMES;
let memoryBackgrounds: BackgroundItem[] = DEFAULT_BACKGROUNDS;
let memoryOrders: OrderSession[] = [];

// Helper to safely write to localStorage without crashing on QuotaExceededError
function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`[Storage] localStorage.setItem failed for key "${key}". Cleaning old caches...`, err);

    // Try to free up space by removing old bloated orders from localStorage
    try {
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.setItem(key, value);
      return true;
    } catch {
      // If still exceeding, swallow error safely. Data is kept in-memory and in IndexedDB.
      return false;
    }
  }
}

export function getStoredPricing(): PricingConfig {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.PRICING);
    if (val) return { ...DEFAULT_PRICING, ...JSON.parse(val) };
  } catch {
    // fallback
  }
  return DEFAULT_PRICING;
}

export function saveStoredPricing(pricing: PricingConfig): void {
  safeLocalStorageSet(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
  idbSet(STORAGE_KEYS.PRICING, pricing).catch(() => {});
}

export function getAdminPin(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || '1234';
  } catch {
    return '1234';
  }
}

export function saveAdminPin(pin: string): void {
  safeLocalStorageSet(STORAGE_KEYS.ADMIN_PIN, pin);
  idbSet(STORAGE_KEYS.ADMIN_PIN, pin).catch(() => {});
}

export function getStoredBackgrounds(): BackgroundItem[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.BACKGROUNDS);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryBackgrounds = parsed;
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return memoryBackgrounds;
}

export function saveStoredBackgrounds(bgs: BackgroundItem[]): void {
  memoryBackgrounds = bgs;

  // Persist full backgrounds to IndexedDB (virtually unlimited quota)
  idbSet(STORAGE_KEYS.BACKGROUNDS, bgs).catch(() => {});

  // Try to persist to localStorage, with fallback
  safeLocalStorageSet(STORAGE_KEYS.BACKGROUNDS, JSON.stringify(bgs));
}

export function getStoredThemes(): TemplateTheme[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.THEMES);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default Canva transparent templates are available
        const existingIds = new Set(parsed.map((t: TemplateTheme) => t.id));
        const merged = [...parsed];
        DEFAULT_TEMPLATE_THEMES.forEach((def) => {
          if (!existingIds.has(def.id)) {
            merged.unshift(def);
          }
        });
        memoryThemes = merged;
        return merged;
      }
    }
  } catch {
    // fallback
  }
  return memoryThemes;
}

export function saveStoredThemes(themes: TemplateTheme[]): void {
  memoryThemes = themes;

  // Persist full themes (including large transparent PNG overlays) into IndexedDB
  idbSet(STORAGE_KEYS.THEMES, themes).catch(() => {});

  // Attempt to save to localStorage. If it exceeds quota, save a lightweight version without heavy overlays
  const serialized = JSON.stringify(themes);
  const success = safeLocalStorageSet(STORAGE_KEYS.THEMES, serialized);

  if (!success) {
    // Save lightweight version to localStorage so metadata still loads on next synchronous refresh
    try {
      const lightweight = themes.map((t) => {
        // If overlayUrl is longer than 50KB base64, truncate for localStorage (it loads from IndexedDB)
        if (t.overlayUrl && t.overlayUrl.length > 50000) {
          return { ...t, overlayUrl: undefined, hasCustomOverlay: true };
        }
        return t;
      });
      safeLocalStorageSet(STORAGE_KEYS.THEMES, JSON.stringify(lightweight));
    } catch {
      // swallowed safely
    }
  }
}

export function getStoredChromaSettings(): ChromaSettings {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CHROMA);
    if (val) return { ...DEFAULT_CHROMA_SETTINGS, ...JSON.parse(val) };
  } catch {
    // fallback
  }
  return DEFAULT_CHROMA_SETTINGS;
}

export function saveStoredChromaSettings(settings: ChromaSettings): void {
  safeLocalStorageSet(STORAGE_KEYS.CHROMA, JSON.stringify(settings));
  idbSet(STORAGE_KEYS.CHROMA, settings).catch(() => {});
}

export function getStoredOrders(): OrderSession[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        memoryOrders = parsed;
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return memoryOrders;
}

export function saveOrder(order: OrderSession): void {
  const current = getStoredOrders();
  const index = current.findIndex((o) => o.id === order.id);
  if (index >= 0) {
    current[index] = order;
  } else {
    current.unshift(order);
  }

  memoryOrders = current;

  // Store full orders in IndexedDB
  idbSet(STORAGE_KEYS.ORDERS, current.slice(0, 50)).catch(() => {});

  // For localStorage, strip heavy base64 capturedPhotos from historical orders
  // to avoid consuming all 5MB of localStorage on just 1 or 2 orders!
  try {
    const lightweightOrders = current.slice(0, 30).map((o) => ({
      ...o,
      capturedPhotos: [], // strip giant photo base64 strings from localStorage
    }));
    safeLocalStorageSet(STORAGE_KEYS.ORDERS, JSON.stringify(lightweightOrders));
  } catch {
    // swallowed safely
  }
}

/**
 * Hydrates data from IndexedDB on startup for large custom assets
 */
export async function hydrateFromIndexedDB(): Promise<{
  themes?: TemplateTheme[];
  backgrounds?: BackgroundItem[];
  orders?: OrderSession[];
}> {
  try {
    const [idbThemes, idbBackgrounds, idbOrders] = await Promise.all([
      idbGet<TemplateTheme[]>(STORAGE_KEYS.THEMES),
      idbGet<BackgroundItem[]>(STORAGE_KEYS.BACKGROUNDS),
      idbGet<OrderSession[]>(STORAGE_KEYS.ORDERS),
    ]);

    const result: {
      themes?: TemplateTheme[];
      backgrounds?: BackgroundItem[];
      orders?: OrderSession[];
    } = {};

    if (idbThemes && Array.isArray(idbThemes) && idbThemes.length > 0) {
      memoryThemes = idbThemes;
      result.themes = idbThemes;
    }

    if (idbBackgrounds && Array.isArray(idbBackgrounds) && idbBackgrounds.length > 0) {
      memoryBackgrounds = idbBackgrounds;
      result.backgrounds = idbBackgrounds;
    }

    if (idbOrders && Array.isArray(idbOrders) && idbOrders.length > 0) {
      memoryOrders = idbOrders;
      result.orders = idbOrders;
    }

    return result;
  } catch (err) {
    console.warn('[Storage] Hydration from IndexedDB failed:', err);
    return {};
  }
}
