import React, { useState, useEffect } from 'react';
import { QrCode, Banknote, ShieldAlert, CheckCircle, ArrowLeft, Loader2, KeyRound, Clock, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import { PaymentMethod, PaymentStatus, PricingConfig, ServiceType } from '../types/photobooth';
import { soundFx } from '../utils/audio';

interface StepPaymentProps {
  serviceType: ServiceType;
  pricing: PricingConfig;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderId: string;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onValidatePayment: () => void;
  onBack: () => void;
  adminPin: string;
}

export const StepPayment: React.FC<StepPaymentProps> = ({
  serviceType,
  pricing,
  paymentMethod,
  paymentStatus,
  orderId,
  onSelectPaymentMethod,
  onValidatePayment,
  onBack,
  adminPin,
}) => {
  const [qrisQrDataUrl, setQrisQrDataUrl] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes countdown

  const amount =
    serviceType === 'physical_print'
      ? pricing.physicalPrintPrice
      : pricing.digitalOnlyPrice;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate QRIS standard mockup QR
  useEffect(() => {
    const qrisPayload = `00020101021226600016ID.CO.QRIS.WWW01189360000201123456780215ID102002130303UMI51440014ID.GO.BI.QRIS01189360000201123456780215ID102002130303UMI520458125303360540${amount}5802ID5913${pricing.boothName.replace(/\s+/g, '')}6007JAKARTA62190115ORDER-${orderId.slice(0, 8)}6304`;

    QRCode.toDataURL(qrisPayload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
      .then((url) => setQrisQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [amount, orderId, pricing.boothName]);

  // Countdown timer for payment session
  useEffect(() => {
    if (paymentStatus === 'verified') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStatus]);

  const handleValidateWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin) {
      soundFx.playPaymentVerified();
      setShowPinModal(false);
      setPinError('');
      onValidatePayment();
    } else {
      setPinError('PIN Kasir salah. Default: 1234');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ganti Paket</span>
        </button>

        <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
          Order ID: #{orderId.slice(0, 8).toUpperCase()}
        </span>
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-bold font-mono tracking-widest uppercase text-amber-800 bg-amber-100/70 px-3.5 py-1.5 rounded-full border border-amber-300/80 shadow-2xs">
          Langkah 2 dari 7 • Pembayaran & Validasi Kasir
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-stone-900 font-heading tracking-tight">
          Pilih Metode Pembayaran
        </h1>
        <p className="mt-1.5 text-stone-600 text-sm">
          Total Tagihan:{' '}
          <span className="font-extrabold text-amber-600 text-base">
            {formatRupiah(amount)}
          </span>{' '}
          ({serviceType === 'physical_print' ? 'Cetak Fisik Langsung' : 'Hanya File Digital'})
        </p>
      </div>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => onSelectPaymentMethod('qris')}
          className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition cursor-pointer ${
            paymentMethod === 'qris'
              ? 'bg-amber-50/70 border-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-stone-900">QRIS (GoPay / OVO / BCA / DANA)</span>
          <span className="text-[11px] text-stone-500 font-medium">Scan QR instan dari smartphone Anda</span>
        </button>

        <button
          onClick={() => onSelectPaymentMethod('cash')}
          className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition cursor-pointer ${
            paymentMethod === 'cash'
              ? 'bg-emerald-50/70 border-emerald-500 text-stone-950 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <Banknote className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-stone-900">CASH (Bayar Tunai di Kasir)</span>
          <span className="text-[11px] text-stone-500 font-medium">Bayar uang pas ke operator meja booth</span>
        </button>
      </div>

      {/* Payment Card & Status */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
        {paymentMethod === 'qris' ? (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-white rounded-2xl border-2 border-stone-200/80 shadow-md mb-4">
              {qrisQrDataUrl ? (
                <img
                  src={qrisQrDataUrl}
                  alt="QRIS Code"
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-stone-50 text-stone-600">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">
                Scan QRIS dengan aplikasi mobile banking atau e-wallet apa saja
              </span>
              <p className="text-sm font-bold text-stone-900">
                Merchant: {pricing.boothName}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-mono font-semibold mt-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-flex">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Batas waktu pembayaran:{' '}
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-200 shadow-inner">
              <Banknote className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1 font-heading">
              Pembayaran Tunai di Meja Kasir
            </h3>
            <p className="text-xs text-stone-600 max-w-md mb-5 leading-relaxed">
              Silakan serahkan uang tunai sebesar pas kepada kasir/operator photobooth:{' '}
              <span className="text-amber-700 font-bold text-sm">{formatRupiah(amount)}</span>.
            </p>
            <div className="bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200 text-xs text-stone-600 font-medium">
              Sebutkan nomor antrean ini ke kasir:{' '}
              <span className="text-stone-900 font-black text-base font-mono ml-1">
                #{orderId.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Validation Warning & Status Box */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-stone-800">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-amber-900">
                Sesi Foto Terkunci — Menunggu Validasi Pembayaran
              </div>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                Sesuai ketentuan, admin/kasir harus memverifikasi bahwa pembayaran telah diterima sebelum sesi pemotretan dimulai.
              </p>
            </div>
          </div>

          {/* Quick Cashier Validation Trigger */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>Menunggu konfirmasi admin di sistem kasir...</span>
            </div>

            <button
              onClick={() => setShowPinModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Otorisasi / Validasi Kasir (Input PIN)</span>
            </button>
          </div>
        </div>
      </div>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-heading">
                  Otorisasi Kasir
                </h3>
                <p className="text-xs text-stone-500">
                  Masukkan PIN admin untuk konfirmasi pembayaran
                </p>
              </div>
            </div>

            <form onSubmit={handleValidateWithPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  PIN Admin (Default: 1234)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Masukkan PIN..."
                  autoFocus
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-center font-mono text-xl tracking-widest focus:outline-none focus:border-amber-500 focus:bg-white shadow-inner transition"
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinInput('');
                    setPinError('');
                  }}
                  className="flex-1 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Validasi Lunas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
