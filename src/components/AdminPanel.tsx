import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Image as ImageIcon,
  Layout,
  Sliders,
  CheckCircle,
  Trash2,
  Upload,
  ShieldCheck,
  Plus,
  RefreshCw,
  Clock,
  Layers,
  Key,
  Palette,
  ExternalLink,
  Download,
  BookOpen,
  Link,
  Save,
} from 'lucide-react';
import {
  BackgroundItem,
  ChromaSettings,
  OrderSession,
  PricingConfig,
  TemplateTheme,
  TemplateType,
  PhotoCount,
} from '../types/photobooth';
import {
  CANVA_PRESETS,
  downloadCanvaGuide,
  downloadTransparentCanvaFrame,
  CanvaTemplatePreset,
} from '../utils/canvaTemplates';
import { soundFx } from '../utils/audio';
import { optimizeImageFile } from '../utils/imageOptimizer';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingConfig;
  onUpdatePricing: (pricing: PricingConfig) => void;
  backgrounds: BackgroundItem[];
  onUpdateBackgrounds: (backgrounds: BackgroundItem[]) => void;
  themes: TemplateTheme[];
  onUpdateThemes: (themes: TemplateTheme[]) => void;
  chromaSettings: ChromaSettings;
  onUpdateChromaSettings: (settings: ChromaSettings) => void;
  adminPin: string;
  onUpdateAdminPin: (pin: string) => void;
  currentOrder: OrderSession | null;
  onValidateActiveOrder: () => void;
  orderHistory: OrderSession[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  pricing,
  onUpdatePricing,
  backgrounds,
  onUpdateBackgrounds,
  themes,
  onUpdateThemes,
  chromaSettings,
  onUpdateChromaSettings,
  adminPin,
  onUpdateAdminPin,
  currentOrder,
  onValidateActiveOrder,
  orderHistory,
}) => {
  const [activeTab, setActiveTab] = useState<
    'payments' | 'pricing' | 'backgrounds' | 'templates' | 'canva' | 'chroma' | 'security'
  >('payments');

  // Canva filter state
  const [canvaFilterType, setCanvaFilterType] = useState<'all' | 'single_frame' | 'strip_photo'>('all');
  const [savedCanvaLinks, setSavedCanvaLinks] = useState<{ [id: string]: string }>(() => {
    try {
      return JSON.parse(localStorage.getItem('fotokiosk_canva_links_v1') || '{}');
    } catch {
      return {};
    }
  });
  const [savedLinkSuccess, setSavedLinkSuccess] = useState<string | null>(null);

  // Form states for pricing
  const [physicalPrice, setPhysicalPrice] = useState<number>(pricing.physicalPrintPrice);
  const [digitalPrice, setDigitalPrice] = useState<number>(pricing.digitalOnlyPrice);
  const [boothName, setBoothName] = useState<string>(pricing.boothName);
  const [pricingSuccess, setPricingSuccess] = useState<boolean>(false);

  // Background upload state
  const [newBgName, setNewBgName] = useState<string>('');
  const [newBgCategory, setNewBgCategory] = useState<string>('Custom');
  const [newBgFileUrl, setNewBgFileUrl] = useState<string>('');
  const [isProcessingBg, setIsProcessingBg] = useState<boolean>(false);

  // Template upload state
  const [newThemeName, setNewThemeName] = useState<string>('');
  const [newThemeType, setNewThemeType] = useState<TemplateType>('strip_photo');
  const [newThemeCount, setNewThemeCount] = useState<PhotoCount>(4);
  const [newThemeBgColor, setNewThemeBgColor] = useState<string>('#ffffff');
  const [newThemeTextColor, setNewThemeTextColor] = useState<string>('#18181b');
  const [newThemeOverlayUrl, setNewThemeOverlayUrl] = useState<string>('');
  const [isProcessingTheme, setIsProcessingTheme] = useState<boolean>(false);

  // PIN state
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle Save Pricing
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePricing({
      ...pricing,
      physicalPrintPrice: Number(physicalPrice),
      digitalOnlyPrice: Number(digitalPrice),
      boothName: boothName.trim() || 'FOTOKIOSK PRO',
    });
    setPricingSuccess(true);
    setTimeout(() => setPricingSuccess(false), 2500);
  };

  // Handle Background Upload with automatic compression
  const handleBgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingBg(true);
      try {
        const compressed = await optimizeImageFile(file, 1600, 1200, false);
        setNewBgFileUrl(compressed);
      } catch (err) {
        console.warn('Image optimization fallback:', err);
        const reader = new FileReader();
        reader.onload = () => setNewBgFileUrl(reader.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsProcessingBg(false);
      }
    }
  };

  const handleAddBackground = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBgFileUrl) return;

    const newItem: BackgroundItem = {
      id: `bg-custom-${Date.now()}`,
      name: newBgName.trim() || 'Custom Background',
      category: newBgCategory.trim() || 'Custom',
      url: newBgFileUrl,
      thumbnailUrl: newBgFileUrl,
      isCustom: true,
    };

    onUpdateBackgrounds([...backgrounds, newItem]);
    setNewBgName('');
    setNewBgFileUrl('');
  };

  const handleDeleteBackground = (id: string) => {
    onUpdateBackgrounds(backgrounds.filter((b) => b.id !== id));
  };

  // Handle Template PNG Overlay Upload with alpha-preserving compression
  const handleThemeOverlayUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingTheme(true);
      try {
        const compressed = await optimizeImageFile(file, 1200, 1800, true);
        setNewThemeOverlayUrl(compressed);
      } catch (err) {
        console.warn('Theme optimization fallback:', err);
        const reader = new FileReader();
        reader.onload = () => setNewThemeOverlayUrl(reader.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsProcessingTheme(false);
      }
    }
  };

  const handleAddTheme = (e: React.FormEvent) => {
    e.preventDefault();
    const newTheme: TemplateTheme = {
      id: `theme-custom-${Date.now()}`,
      name: newThemeName.trim() || 'Custom Theme',
      type: newThemeType,
      photoCount: newThemeCount,
      bgColor: newThemeBgColor,
      textColor: newThemeTextColor,
      accentColor: '#f59e0b',
      borderColor: 'rgba(128,128,128,0.3)',
      overlayUrl: newThemeOverlayUrl || undefined,
      layout: newThemeType === 'strip_photo' ? 'vertical_strip' : 'grid',
    };

    onUpdateThemes([...themes, newTheme]);
    setNewThemeName('');
    setNewThemeOverlayUrl('');
  };

  const handleDeleteTheme = (id: string) => {
    onUpdateThemes(themes.filter((t) => t.id !== id));
  };

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-stone-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
                Panel Kontrol Kasir & Administrator
              </h2>
              <p className="text-xs text-stone-500">
                Kelola tarif, validasi pembayaran, studio template Canva, dan background foto
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-stone-100/60 border-b border-stone-200 overflow-x-auto scrollbar-none">
          {[
            { id: 'payments', label: 'Validasi Pembayaran', icon: CheckCircle },
            { id: 'pricing', label: 'Tarif & Booth', icon: DollarSign },
            { id: 'backgrounds', label: 'Upload Background', icon: ImageIcon },
            { id: 'templates', label: 'Upload Template', icon: Layout },
            { id: 'canva', label: 'Studio Template Canva', icon: Palette },
            { id: 'chroma', label: 'Chroma & AI Cutout', icon: Sliders },
            { id: 'security', label: 'PIN Kasir', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-stone-700 bg-[#faf9f5]">
          {/* TAB 1: VALIDASI PEMBAYARAN */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Active Pending Order */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Customer di Booth Saat Ini</span>
                  </h3>
                  {currentOrder && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        currentOrder.paymentStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                      }`}
                    >
                      {currentOrder.paymentStatus === 'verified'
                        ? 'SUDAH LUNAS'
                        : 'MENUNGGU VALIDASI KASIR'}
                    </span>
                  )}
                </div>

                {currentOrder ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="space-y-1">
                      <div className="text-xs text-stone-500 font-mono">
                        Order ID: #{currentOrder.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="text-base font-bold text-stone-900">
                        {currentOrder.serviceType === 'physical_print'
                          ? 'Cetak Fisik Langsung'
                          : 'Hanya File Digital'}
                      </div>
                      <div className="text-xs text-stone-600">
                        Metode: <span className="font-bold uppercase text-amber-700">{currentOrder.paymentMethod}</span> • Nominal:{' '}
                        <span className="font-extrabold text-stone-900">{formatRupiah(currentOrder.amount)}</span>
                      </div>
                    </div>

                    {currentOrder.paymentStatus !== 'verified' ? (
                      <button
                        onClick={() => {
                          soundFx.playPaymentVerified();
                          onValidateActiveOrder();
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>KONFIRMASI LUNAS & BUKA FOTO</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Sesi telah aktif dibuka</span>
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">
                    Belum ada antrean order aktif di layar kiosk.
                  </p>
                )}
              </div>

              {/* Order History */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 font-heading">
                  Riwayat Transaksi Terakhir ({orderHistory.length})
                </h3>
                {orderHistory.length === 0 ? (
                  <p className="text-xs text-stone-500">Belum ada riwayat transaksi.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {orderHistory.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                      >
                        <div>
                          <span className="font-bold text-stone-900">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>{' '}
                          • {order.serviceType === 'physical_print' ? 'Cetak Fisik' : 'Digital Only'}
                          <span className="text-stone-500 block text-[10px]">
                            {new Date(order.createdAt).toLocaleTimeString('id-ID')} • {order.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-amber-700">
                            {formatRupiah(order.amount)}
                          </span>
                          <span className="block text-[10px] text-emerald-600 font-bold">
                            ✓ Lunas
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TARIF & BOOTH */}
          {activeTab === 'pricing' && (
            <form onSubmit={handleSavePricing} className="max-w-xl space-y-5">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-heading">
                  Pengaturan Tarif Layanan (Rupiah)
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Tarif Cetak Fisik Langsung:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-stone-500 font-bold">
                      Rp
                    </span>
                    <input
                      type="number"
                      step={1000}
                      min={0}
                      value={physicalPrice}
                      onChange={(e) => setPhysicalPrice(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Customer mendapatkan cetak lembar fisik di printer + link QR digital.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Tarif Hanya File Digital:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-stone-500 font-bold">
                      Rp
                    </span>
                    <input
                      type="number"
                      step={1000}
                      min={0}
                      value={digitalPrice}
                      onChange={(e) => setDigitalPrice(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Customer hanya scan QR code untuk mendownload file tanpa cetak printer.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Nama Studio Photobooth:
                  </label>
                  <input
                    type="text"
                    value={boothName}
                    onChange={(e) => setBoothName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {pricingSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Perubahan tarif berhasil disimpan ke sistem Kiosk!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs rounded-xl shadow-md shadow-amber-400/20 transition cursor-pointer"
                >
                  Simpan Tarif Baru
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: UPLOAD BACKGROUND GREEN SCREEN */}
          {activeTab === 'backgrounds' && (
            <div className="space-y-6">
              {/* Form Upload */}
              <form onSubmit={handleAddBackground} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Upload Gambar Background Green Screen Baru</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nama Background:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Studio Neon Pink, Pantai Bali"
                      value={newBgName}
                      onChange={(e) => setNewBgName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Kategori:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Nature, Urban, Aesthetic"
                      value={newBgCategory}
                      onChange={(e) => setNewBgCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pilih File Gambar (JPG / PNG):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBgFileUpload}
                    className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                  />
                </div>

                {isProcessingBg && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold animate-pulse">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>Mengoptimalkan resolusi gambar background...</span>
                  </div>
                )}

                {newBgFileUrl && !isProcessingBg && (
                  <div className="flex items-center gap-3">
                    <img
                      src={newBgFileUrl}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded-lg border border-stone-300 shadow-sm"
                    />
                    <span className="text-xs text-emerald-700 font-bold">
                      ✓ Gambar siap di-upload! (Teroptimasi)
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!newBgFileUrl}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-stone-950 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Tambahkan ke Katalog Background Customer
                </button>
              </form>

              {/* Existing Backgrounds List */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 font-heading">
                  Katalog Background Aktif ({backgrounds.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {backgrounds.map((bg) => (
                    <div
                      key={bg.id}
                      className="group relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 p-2 flex flex-col justify-between aspect-[4/3] shadow-sm"
                    >
                      {bg.url ? (
                        <img
                          src={bg.thumbnailUrl || bg.url}
                          alt={bg.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-stone-100 flex items-center justify-center text-[11px] text-stone-500 font-medium">
                          Original Camera
                        </div>
                      )}
                      <div className="relative z-10 flex justify-between items-start">
                        <span className="text-[10px] font-bold text-stone-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm truncate max-w-[80%]">
                          {bg.name}
                        </span>
                        {bg.isCustom && (
                          <button
                            onClick={() => handleDeleteBackground(bg.id)}
                            className="p-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white shadow-sm cursor-pointer"
                            title="Hapus background"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UPLOAD TEMPLATE FRAME */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <form onSubmit={handleAddTheme} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Layout className="w-4 h-4 text-amber-600" />
                  <span>Tambah Desain Template / Frame Kustom</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nama Tema Frame:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Wedding Gold, Neon Party"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Format Template:
                    </label>
                    <select
                      value={newThemeType}
                      onChange={(e) => setNewThemeType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    >
                      <option value="strip_photo">Strip Photo (2x6 Inch)</option>
                      <option value="single_frame">Single Frame (4x6 Inch / 4R)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Jumlah Foto:
                    </label>
                    <select
                      value={newThemeCount}
                      onChange={(e) => setNewThemeCount(Number(e.target.value) as any)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    >
                      <option value={2}>2 Foto</option>
                      <option value={3}>3 Foto</option>
                      <option value={4}>4 Foto</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Warna Background Frame:
                    </label>
                    <input
                      type="color"
                      value={newThemeBgColor}
                      onChange={(e) => setNewThemeBgColor(e.target.value)}
                      className="w-full h-9 rounded-lg cursor-pointer bg-transparent border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Warna Teks / Caption:
                    </label>
                    <input
                      type="color"
                      value={newThemeTextColor}
                      onChange={(e) => setNewThemeTextColor(e.target.value)}
                      className="w-full h-9 rounded-lg cursor-pointer bg-transparent border border-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Upload Frame / Desain Template dari Canva (PNG / JPG):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThemeOverlayUpload}
                    className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Upload file desain dari Canva. Sistem FotoKiosk otomatis memotong lubang slot foto secara transparan dan meletakkan frame Canva di depan foto customer secara presisi.
                  </span>
                </div>

                {isProcessingTheme && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold animate-pulse">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>Mengoptimalkan frame template Canva...</span>
                  </div>
                )}

                {newThemeOverlayUrl && !isProcessingTheme && (
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <img
                      src={newThemeOverlayUrl}
                      alt="Overlay Preview"
                      className="w-16 h-20 object-contain rounded-lg border border-stone-300 bg-white p-1 shadow-sm"
                    />
                    <div>
                      <span className="text-xs text-emerald-700 font-bold block">
                        ✓ Desain Template Canva Siap Dipakai!
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Foto customer akan otomatis masuk ke dalam slot bingkai template ini.
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Simpan Template Baru
                </button>
              </form>

              {/* Existing Themes */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 font-heading">
                  Daftar Template Aktif ({themes.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {theme.name}
                        </span>
                        {theme.id.startsWith('theme-custom') && (
                          <button
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="text-rose-600 hover:text-rose-500 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {theme.type === 'strip_photo' ? 'Strip Photo' : 'Single Frame'} • {theme.photoCount} Foto
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STUDIO TEMPLATE CANVA (4R & STRIP PHOTO) */}
          {activeTab === 'canva' && (
            <div className="space-y-6">
              {/* Canva Header & Quick Guide */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-amber-50/50 border border-blue-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 font-heading">
                        Studio Desain Template Canva (4R & Strip Photo)
                      </h3>
                      <p className="text-xs text-stone-600">
                        Siapkan dan edit frame kustom menggunakan Canva dengan ukuran standar 300 DPI siap cetak printer.
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://www.canva.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition shrink-0 cursor-pointer"
                  >
                    <span>Buka Canva.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 4-Step Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
                    <span className="font-bold text-amber-700 block mb-1">1. Unduh Frame PNG</span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Klik "Unduh Frame Jadi" untuk mendapatkan template dengan lubang transparan presisi.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
                    <span className="font-bold text-amber-700 block mb-1">2. Buat Kanvas di Canva</span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Klik "Buka di Canva". Masukkan file Frame PNG ke layer paling atas kanvas Canva Anda.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
                    <span className="font-bold text-amber-700 block mb-1">3. Hias Background</span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Tambahkan ornamen, logo event, atau doodle di belakang frame. Lubang foto sudah pas!
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
                    <span className="font-bold text-amber-700 block mb-1">4. Upload ke FotoKiosk</span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Download dari Canva format <strong>PNG Transparan</strong>, lalu upload di menu "Upload Template".
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Tabs (All, 4R, Strip) */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
                  <button
                    onClick={() => setCanvaFilterType('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      canvaFilterType === 'all'
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Semua Template ({CANVA_PRESETS.length})
                  </button>
                  <button
                    onClick={() => setCanvaFilterType('single_frame')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      canvaFilterType === 'single_frame'
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Format 4R (4x6 Inci)
                  </button>
                  <button
                    onClick={() => setCanvaFilterType('strip_photo')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      canvaFilterType === 'strip_photo'
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Format Strip Photo (2x6 Inci)
                  </button>
                </div>

                <span className="text-xs text-stone-500 hidden sm:inline font-medium">
                  Standar Cetak Foto Studio: <strong className="text-stone-800">300 DPI High-Res</strong>
                </span>
              </div>

              {/* Presets Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CANVA_PRESETS.filter(
                  (p) => canvaFilterType === 'all' || p.type === canvaFilterType
                ).map((preset) => {
                  const savedLink = savedCanvaLinks[preset.id] || '';

                  return (
                    <div
                      key={preset.id}
                      className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between hover:border-stone-300 transition space-y-4"
                    >
                      <div>
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                              preset.type === 'single_frame'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {preset.type === 'single_frame' ? '4R Frame' : 'Strip Photo'}
                          </span>
                          <span className="text-xs font-mono text-stone-500">
                            {preset.width} x {preset.height} px
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-stone-900 mb-1 font-heading">
                          {preset.name}
                        </h4>
                        
                        <div className="mb-2">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md inline-block">
                            ✓ {preset.ratioLabel}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                          {preset.description}
                        </p>

                        {/* Miniature layout diagram */}
                        <div className="w-full h-36 rounded-xl bg-stone-50 border border-stone-200 p-2.5 flex flex-col justify-between mb-3 shadow-inner">
                          <div className="text-[9px] font-bold text-center text-amber-800 uppercase tracking-widest">
                            Header Logo
                          </div>
                          <div
                            className={`w-full flex-1 my-1.5 gap-1.5 flex ${
                              preset.type === 'strip_photo'
                                ? 'flex-col'
                                : preset.photoCount === 4
                                ? 'grid grid-cols-2'
                                : 'flex flex-col'
                            }`}
                          >
                            {preset.slots.map((s, i) => (
                              <div
                                key={i}
                                className="bg-blue-50 border border-blue-300 rounded flex flex-col items-center justify-center p-1 text-[9px] font-bold text-blue-800"
                              >
                                <span>Slot {i + 1} (Fix)</span>
                                <span className="text-[8px] text-stone-500 font-mono">
                                  {s.width}x{s.height} px
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="text-[9px] text-center text-stone-500 uppercase tracking-wider font-medium">
                            Footer Caption • {preset.inchSize}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-stone-200">
                        {/* 1. Primary Button: Ready-to-use Transparent Cutout Frame */}
                        <button
                          onClick={() => downloadTransparentCanvaFrame(preset)}
                          className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                          title="Unduh file PNG dengan lubang foto transparan. Tinggal selipkan background di Canva!"
                        >
                          <Download className="w-4 h-4 stroke-[2.5]" />
                          <span>Unduh Frame Jadi (PNG Lubang Transparan)</span>
                        </button>
                        <span className="text-[10px] text-stone-500 block text-center leading-normal">
                          Posisi slot foto sudah terkunci pas, Anda tinggal mendesain dekorasi frame di Canva!
                        </span>

                        {/* 2. Secondary Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={savedLink || preset.canvaTemplateUrl || preset.canvaCustomSizeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95 text-center cursor-pointer"
                            title="Buka Canva dengan template yang sesuai"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span>Buka di Canva</span>
                          </a>

                          <button
                            onClick={() => downloadCanvaGuide(preset)}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold rounded-xl border border-stone-200 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                            title="Unduh garis blueprint panduan ukuran pixel"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Blueprint</span>
                          </button>
                        </div>

                        {/* Custom Team Canva Link input */}
                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] text-stone-600 flex items-center gap-1 font-medium">
                            <Link className="w-3 h-3 text-stone-500" />
                            <span>Tautan Canva Tim Studio Anda (Opsional):</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="url"
                              placeholder="https://www.canva.com/design/..."
                              value={savedLink}
                              onChange={(e) => {
                                const updated = { ...savedCanvaLinks, [preset.id]: e.target.value };
                                setSavedCanvaLinks(updated);
                              }}
                              className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-[11px] text-stone-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                            />
                            <button
                              onClick={() => {
                                localStorage.setItem('fotokiosk_canva_links_v1', JSON.stringify(savedCanvaLinks));
                                setSavedLinkSuccess(preset.id);
                                setTimeout(() => setSavedLinkSuccess(null), 2000);
                              }}
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs border border-stone-300 cursor-pointer"
                              title="Simpan Link Canva"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {savedLinkSuccess === preset.id && (
                            <span className="text-[10px] text-emerald-700 font-bold block">
                              ✓ Link Canva tersimpan!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: CHROMA KEY & AI SMART CUTOUT */}
          {activeTab === 'chroma' && (
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm max-w-xl space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>Pengaturan Penghapus Background (AI vs Kain Hijau)</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Metode Default Penghapus Latar Belakang:
                  </label>
                  <select
                    value={chromaSettings.mode || 'ai_virtual'}
                    onChange={(e) =>
                      onUpdateChromaSettings({
                        ...chromaSettings,
                        mode: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="ai_virtual">
                      ✨ AI Smart Cutout (Tanpa Kain Hijau / Otomatis Deteksi Manusia)
                    </option>
                    <option value="green_screen">
                      🟩 Kain Hijau Fisik (Chroma Key Studio)
                    </option>
                    <option value="none">
                      📷 Kamera Asli (Tanpa Efek Latar)
                    </option>
                  </select>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                    <strong>Mode AI:</strong> Sangat cocok jika Anda tidak memiliki kain hijau, AI otomatis memisahkan subjek di ruangan apa pun.
                  </p>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Warna Default Green Screen:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={chromaSettings.keyColor}
                      onChange={(e) =>
                        onUpdateChromaSettings({
                          ...chromaSettings,
                          keyColor: e.target.value,
                        })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-200"
                    />
                    <span className="font-mono text-stone-600 font-bold">{chromaSettings.keyColor}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 font-semibold mb-1">
                    <span>Default Toleransi Warna:</span>
                    <span className="font-mono text-amber-700">{chromaSettings.tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={chromaSettings.tolerance}
                    onChange={(e) =>
                      onUpdateChromaSettings({
                        ...chromaSettings,
                        tolerance: Number(e.target.value),
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 font-semibold mb-1">
                    <span>Default Kehalusan Pinggiran:</span>
                    <span className="font-mono text-amber-700">{chromaSettings.smoothness}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={chromaSettings.smoothness}
                    onChange={(e) =>
                      onUpdateChromaSettings({
                        ...chromaSettings,
                        smoothness: Number(e.target.value),
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 font-semibold mb-1">
                    <span>Default Spill Suppression:</span>
                    <span className="font-mono text-amber-700">{chromaSettings.spillSuppression}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={chromaSettings.spillSuppression}
                    onChange={(e) =>
                      onUpdateChromaSettings({
                        ...chromaSettings,
                        spillSuppression: Number(e.target.value),
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PIN KASIR */}
          {activeTab === 'security' && (
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm max-w-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Ubah PIN Akses Kasir / Admin</span>
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                PIN ini digunakan untuk membuka kunci sesi foto saat validasi pembayaran tunai dan mengakses panel admin ini.
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  PIN Saat Ini: <span className="font-mono font-bold text-amber-700">{adminPin}</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Masukkan PIN baru (4-6 digit)..."
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono text-center tracking-widest text-lg focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              {pinChangeSuccess && (
                <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>PIN berhasil diperbarui!</span>
                </div>
              )}

              <button
                onClick={() => {
                  if (newPin.trim().length >= 4) {
                    onUpdateAdminPin(newPin.trim());
                    setPinChangeSuccess(true);
                    setNewPin('');
                    setTimeout(() => setPinChangeSuccess(false), 2000);
                  }
                }}
                disabled={newPin.trim().length < 4}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-stone-950 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Simpan PIN Baru
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
          >
            Tutup Panel Admin
          </button>
        </div>
      </div>
    </div>
  );
};
