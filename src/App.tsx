/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StepServiceSelect } from './components/StepServiceSelect';
import { StepPayment } from './components/StepPayment';
import { StepTemplateSelect } from './components/StepTemplateSelect';
import { StepBackgroundSelect } from './components/StepBackgroundSelect';
import { StepCameraShoot } from './components/StepCameraShoot';
import { StepPhotoSelect } from './components/StepPhotoSelect';
import { StepPrintDownload } from './components/StepPrintDownload';
import { AdminPanel } from './components/AdminPanel';
import { PromptModal } from './components/PromptModal';
import {
  BackgroundItem,
  ChromaSettings,
  OrderSession,
  PaymentMethod,
  PaymentStatus,
  PhotoCapture,
  PhotoCount,
  PricingConfig,
  ServiceType,
  TemplateTheme,
  TemplateType,
} from './types/photobooth';
import {
  getAdminPin,
  getStoredBackgrounds,
  getStoredChromaSettings,
  getStoredOrders,
  getStoredPricing,
  getStoredThemes,
  saveAdminPin,
  saveOrder,
  saveStoredBackgrounds,
  saveStoredChromaSettings,
  saveStoredPricing,
  saveStoredThemes,
  hydrateFromIndexedDB,
} from './utils/storage';
import { KeyRound, ShieldAlert, X } from 'lucide-react';

export default function App() {
  // App-wide configurations persisted in localStorage & IndexedDB
  const [pricing, setPricing] = useState<PricingConfig>(getStoredPricing);
  const [adminPin, setAdminPin] = useState<string>(getAdminPin);
  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>(getStoredBackgrounds);
  const [themes, setThemes] = useState<TemplateTheme[]>(getStoredThemes);
  const [chromaSettings, setChromaSettings] = useState<ChromaSettings>(getStoredChromaSettings);
  const [orderHistory, setOrderHistory] = useState<OrderSession[]>(getStoredOrders);

  // Hydrate large custom assets from IndexedDB on mount
  useEffect(() => {
    hydrateFromIndexedDB().then((data) => {
      if (data.themes && data.themes.length > 0) {
        setThemes(data.themes);
      }
      if (data.backgrounds && data.backgrounds.length > 0) {
        setBackgrounds(data.backgrounds);
      }
      if (data.orders && data.orders.length > 0) {
        setOrderHistory(data.orders);
      }
    });
  }, []);

  // Modals
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showAdminPinAuth, setShowAdminPinAuth] = useState<boolean>(false);
  const [authPinInput, setAuthPinInput] = useState<string>('');
  const [authPinError, setAuthPinError] = useState<string>('');

  // Current Kiosk Flow State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Active Order State
  const [orderId, setOrderId] = useState<string>(() => `ORD-${Date.now()}`);
  const [selectedService, setSelectedService] = useState<ServiceType>('physical_print');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('qris');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  const [selectedTemplateType, setSelectedTemplateType] = useState<TemplateType>('strip_photo');
  const [selectedPhotoCount, setSelectedPhotoCount] = useState<PhotoCount>(4);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => themes[0]?.id || 'strip-classic-noir');

  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>(
    () => backgrounds[0]?.id || 'bg-tokyo-night'
  );

  const [capturedPhotos, setCapturedPhotos] = useState<PhotoCapture[]>([]);
  const [assignedSlots, setAssignedSlots] = useState<(string | null)[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'normal' | 'bw' | 'vintage' | 'warm' | 'cool'>('normal');
  const [customCaption, setCustomCaption] = useState<string>('');

  // Persist pricing updates
  const handleUpdatePricing = (newPricing: PricingConfig) => {
    setPricing(newPricing);
    saveStoredPricing(newPricing);
  };

  // Persist backgrounds updates
  const handleUpdateBackgrounds = (newBgs: BackgroundItem[]) => {
    setBackgrounds(newBgs);
    saveStoredBackgrounds(newBgs);
  };

  // Persist themes updates
  const handleUpdateThemes = (newThemes: TemplateTheme[]) => {
    setThemes(newThemes);
    saveStoredThemes(newThemes);
  };

  // Persist chroma settings
  const handleUpdateChromaSettings = (newChroma: ChromaSettings) => {
    setChromaSettings(newChroma);
    saveStoredChromaSettings(newChroma);
  };

  // Persist admin PIN
  const handleUpdateAdminPin = (newPin: string) => {
    setAdminPin(newPin);
    saveAdminPin(newPin);
  };

  // Synchronized Template Handlers - guarantees templateType, photoCount and selectedThemeId never diverge
  const handleSelectTheme = (themeId: string) => {
    const found = themes.find((t) => t.id === themeId);
    if (found) {
      setSelectedThemeId(found.id);
      setSelectedTemplateType(found.type);
      setSelectedPhotoCount(found.photoCount);
    }
  };

  const handleSelectTemplateType = (type: TemplateType) => {
    setSelectedTemplateType(type);
    const matching =
      themes.find((t) => t.type === type && t.photoCount === selectedPhotoCount) ||
      themes.find((t) => t.type === type);
    if (matching) {
      setSelectedThemeId(matching.id);
      setSelectedPhotoCount(matching.photoCount);
    }
  };

  const handleSelectPhotoCount = (count: PhotoCount) => {
    setSelectedPhotoCount(count);
    const matching =
      themes.find((t) => t.type === selectedTemplateType && t.photoCount === count) ||
      themes.find((t) => t.photoCount === count);
    if (matching) {
      setSelectedThemeId(matching.id);
      setSelectedTemplateType(matching.type);
    }
  };

  // Active Order Object (derives templateType and photoCount directly from currentTheme)
  const currentTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const currentBackground = backgrounds.find((b) => b.id === selectedBackgroundId) || backgrounds[0];

  const currentOrder: OrderSession = {
    id: orderId,
    createdAt: Date.now(),
    serviceType: selectedService,
    paymentMethod: selectedPaymentMethod,
    paymentStatus,
    amount:
      selectedService === 'physical_print'
        ? pricing.physicalPrintPrice
        : pricing.digitalOnlyPrice,
    templateType: currentTheme.type,
    photoCount: currentTheme.photoCount,
    selectedBackgroundId,
    selectedThemeId: currentTheme.id,
    capturedPhotos,
    assignedSlots,
    filter: selectedFilter,
    customCaption,
  };

  // Admin verifies payment
  const handleValidatePayment = () => {
    setPaymentStatus('verified');
    saveOrder({
      ...currentOrder,
      paymentStatus: 'verified',
    });
    setOrderHistory(getStoredOrders());
    // Auto advance to Step 3 (Template Selection)
    setCurrentStep(3);
  };

  // Reset Session
  const handleResetSession = () => {
    setOrderId(`ORD-${Date.now()}`);
    setPaymentStatus('pending');
    setCurrentStep(1);
    setCapturedPhotos([]);
    setAssignedSlots([]);
    setCustomCaption('');
    setSelectedFilter('normal');
  };

  // Admin Pin Auth Form
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPinInput.trim() === adminPin) {
      setIsAdminLoggedIn(true);
      setShowAdminPinAuth(false);
      setIsAdminPanelOpen(true);
      setAuthPinInput('');
      setAuthPinError('');
    } else {
      setAuthPinError('PIN salah! Default: 1234');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        totalSteps={7}
        pricing={pricing}
        selectedService={selectedService}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setIsAdminPanelOpen(true);
          } else {
            setShowAdminPinAuth(true);
          }
        }}
        onOpenPrompt={() => setIsPromptModalOpen(true)}
        onResetSession={handleResetSession}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {/* Step 1: Pilih Layanan (Cetak Fisik vs Digital Saja) */}
        {currentStep === 1 && (
          <StepServiceSelect
            pricing={pricing}
            selectedService={selectedService}
            onSelectService={setSelectedService}
            onProceed={() => setCurrentStep(2)}
            onOpenAdmin={() => {
              if (isAdminLoggedIn) setIsAdminPanelOpen(true);
              else setShowAdminPinAuth(true);
            }}
          />
        )}

        {/* Step 2: Pembayaran & Validasi Kasir/Admin (Cash atau QRIS) */}
        {currentStep === 2 && (
          <StepPayment
            serviceType={selectedService}
            pricing={pricing}
            paymentMethod={selectedPaymentMethod}
            paymentStatus={paymentStatus}
            orderId={orderId}
            onSelectPaymentMethod={setSelectedPaymentMethod}
            onValidatePayment={handleValidatePayment}
            onBack={() => setCurrentStep(1)}
            adminPin={adminPin}
          />
        )}

        {/* Step 3: Pemilihan Template & Jumlah Foto */}
        {currentStep === 3 && (
          <StepTemplateSelect
            selectedType={currentTheme.type}
            selectedCount={currentTheme.photoCount}
            selectedThemeId={currentTheme.id}
            themes={themes}
            onSelectType={handleSelectTemplateType}
            onSelectCount={handleSelectPhotoCount}
            onSelectTheme={handleSelectTheme}
            onProceed={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: Pemilihan Latar Belakang Green Screen */}
        {currentStep === 4 && (
          <StepBackgroundSelect
            backgrounds={backgrounds}
            selectedBackgroundId={selectedBackgroundId}
            onSelectBackground={setSelectedBackgroundId}
            onProceed={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
            onOpenAdmin={() => {
              if (isAdminLoggedIn) setIsAdminPanelOpen(true);
              else setShowAdminPinAuth(true);
            }}
          />
        )}

        {/* Step 5: Sesi Pemotretan Kamera Live & Countdown */}
        {currentStep === 5 && (
          <StepCameraShoot
            photoCount={currentTheme.photoCount}
            background={currentBackground}
            chromaSettings={chromaSettings}
            onUpdateChromaSettings={handleUpdateChromaSettings}
            onCapturesComplete={(captures) => {
              setCapturedPhotos(captures);
              // Pre-assign first photos to slots matching currentTheme.photoCount
              const initSlots = Array.from(
                { length: currentTheme.photoCount },
                (_, i) => captures[i]?.id || captures[0]?.id || null
              );
              setAssignedSlots(initSlots);
              setCurrentStep(6);
            }}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {/* Step 6: Pemilihan Foto ke Slot Desain */}
        {currentStep === 6 && (
          <StepPhotoSelect
            templateType={currentTheme.type}
            photoCount={currentTheme.photoCount}
            selectedTheme={currentTheme}
            captures={capturedPhotos}
            assignedSlots={assignedSlots}
            onUpdateAssignedSlots={setAssignedSlots}
            filter={selectedFilter}
            onUpdateFilter={setSelectedFilter}
            customCaption={customCaption}
            onUpdateCaption={setCustomCaption}
            onProceed={() => {
              saveOrder({
                ...currentOrder,
                templateType: currentTheme.type,
                photoCount: currentTheme.photoCount,
                selectedThemeId: currentTheme.id,
                assignedSlots,
                filter: selectedFilter,
                customCaption,
              });
              setOrderHistory(getStoredOrders());
              setCurrentStep(7);
            }}
            onRetake={() => setCurrentStep(5)}
          />
        )}

        {/* Step 7: Hasil Cetak Printer & QR Unduh Digital */}
        {currentStep === 7 && (
          <StepPrintDownload
            order={{
              ...currentOrder,
              templateType: currentTheme.type,
              photoCount: currentTheme.photoCount,
              selectedThemeId: currentTheme.id,
              assignedSlots,
              filter: selectedFilter,
              customCaption,
            }}
            pricing={pricing}
            selectedTheme={currentTheme}
            captures={capturedPhotos}
            onNewSession={handleResetSession}
          />
        )}
      </main>

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        pricing={pricing}
        onUpdatePricing={handleUpdatePricing}
        backgrounds={backgrounds}
        onUpdateBackgrounds={handleUpdateBackgrounds}
        themes={themes}
        onUpdateThemes={handleUpdateThemes}
        chromaSettings={chromaSettings}
        onUpdateChromaSettings={handleUpdateChromaSettings}
        adminPin={adminPin}
        onUpdateAdminPin={handleUpdateAdminPin}
        currentOrder={currentOrder}
        onValidateActiveOrder={handleValidatePayment}
        orderHistory={orderHistory}
      />

      {/* AI Studio Prompt Modal (Requested by user) */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

      {/* Admin Login PIN Modal */}
      {showAdminPinAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl shadow-stone-400/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-heading">Login Kasir / Admin</h3>
              </div>
              <button
                onClick={() => {
                  setShowAdminPinAuth(false);
                  setAuthPinInput('');
                  setAuthPinError('');
                }}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              Masukkan PIN Admin untuk mengubah tarif, upload template, atau validasi pembayaran.
            </p>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  PIN Akses (Default: 1234)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={authPinInput}
                  onChange={(e) => {
                    setAuthPinInput(e.target.value);
                    setAuthPinError('');
                  }}
                  placeholder="PIN..."
                  autoFocus
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-center font-mono text-xl tracking-widest focus:outline-none focus:border-amber-500 focus:bg-white shadow-inner transition"
                />
                {authPinError && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{authPinError}</p>
                )}
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminPinAuth(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-400/20 transition active:scale-95"
                >
                  Buka Panel Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
