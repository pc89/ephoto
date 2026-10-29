import React from 'react';
import { Printer, Smartphone, CheckCircle2, ArrowRight, Sparkles, Star } from 'lucide-react';
import { PricingConfig, ServiceType } from '../types/photobooth';

interface StepServiceSelectProps {
  pricing: PricingConfig;
  selectedService: ServiceType;
  onSelectService: (service: ServiceType) => void;
  onProceed: () => void;
  onOpenAdmin: () => void;
}

export const StepServiceSelect: React.FC<StepServiceSelectProps> = ({
  pricing,
  selectedService,
  onSelectService,
  onProceed,
  onOpenAdmin,
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest uppercase text-amber-800 bg-amber-100/70 px-3.5 py-1.5 rounded-full border border-amber-300/80 shadow-2xs">
          Langkah 1 dari 7 • Pilih Layanan
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading tracking-tight">
          Pilih Paket Pengalaman Photobooth
        </h1>
        <p className="mt-2 text-stone-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Tentukan apakah Anda ingin mencetak lembar foto fisik glossy langsung di tempat atau hanya menerima file foto digital ke ponsel Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Option 1: Cetak Fisik Langsung */}
        <div
          onClick={() => onSelectService('physical_print')}
          className={`relative p-6 sm:p-8 rounded-3xl cursor-pointer border-2 transition-all duration-200 flex flex-col justify-between ${
            selectedService === 'physical_print'
              ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/40'
              : 'bg-white border-stone-200 hover:border-stone-300 shadow-md hover:shadow-lg'
          }`}
        >
          <div className="absolute top-5 right-5">
            <span className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 rounded-full border border-amber-300 shadow-2xs">
              <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
              <span>Favorit Pengunjung</span>
            </span>
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 border border-amber-200 shadow-inner">
              <Printer className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-heading">
              Cetak Fisik Langsung
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-4 leading-relaxed">
              Cetak lembar foto kertas glossy studio beresolusi tinggi + bonus unduhan file digitalnya.
            </p>

            <div className="my-5 pb-5 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-500">Total Tarif:</span>
              <div className="text-3xl font-black text-amber-600 font-heading tracking-tight">
                {formatRupiah(pricing.physicalPrintPrice)}
              </div>
              <span className="text-[11px] text-stone-500 font-medium">Termasuk 2 cetak lembar foto fisik + link digital</span>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cetak langsung keluar dari printer foto studio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bebas pilih tema Strip Photo atau Single Frame 4R</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fitur AI Background Removal & Green Screen</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Scan QR Code untuk langsung simpan ke HP</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              {selectedService === 'physical_print' ? 'Paket Terpilih' : 'Klik untuk memilih'}
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                selectedService === 'physical_print'
                  ? 'bg-amber-400 border-amber-500 text-stone-950 shadow-xs'
                  : 'border-stone-300 bg-stone-50'
              }`}
            >
              {selectedService === 'physical_print' && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Option 2: Hanya File Digital */}
        <div
          onClick={() => onSelectService('digital_only')}
          className={`relative p-6 sm:p-8 rounded-3xl cursor-pointer border-2 transition-all duration-200 flex flex-col justify-between ${
            selectedService === 'digital_only'
              ? 'bg-gradient-to-b from-blue-50/60 to-white border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-400/40'
              : 'bg-white border-stone-200 hover:border-stone-300 shadow-md hover:shadow-lg'
          }`}
        >
          <div className="absolute top-5 right-5">
            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100 rounded-full border border-blue-200 shadow-2xs">
              Hemat & Praktis
            </span>
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 border border-blue-200 shadow-inner">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-heading">
              Hanya File Digital
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-4 leading-relaxed">
              Simpan langsung foto resolusi tinggi ke galeri ponsel melalui scan QR Code tanpa kertas fisik.
            </p>

            <div className="my-5 pb-5 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-500">Total Tarif:</span>
              <div className="text-3xl font-black text-blue-600 font-heading tracking-tight">
                {formatRupiah(pricing.digitalOnlyPrice)}
              </div>
              <span className="text-[11px] text-stone-500 font-medium">Download HD uncompressed langsung ke HP</span>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant QR Code scan langsung ke HP customer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bebas pilih tema Strip Photo atau Single Frame 4R</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pilihan jumlah foto 2, 3, atau 4 pose</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ramah lingkungan tanpa limbah kertas foto</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              {selectedService === 'digital_only' ? 'Paket Terpilih' : 'Klik untuk memilih'}
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                selectedService === 'digital_only'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'border-stone-300 bg-stone-50'
              }`}
            >
              {selectedService === 'digital_only' && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notice & Proceed Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200/90 shadow-md">
        <div className="flex items-center gap-2.5 text-xs text-stone-600">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Tarif di atas dapat diatur & diubah sewaktu-waktu oleh kasir/pemilik melalui{' '}
            <button
              onClick={onOpenAdmin}
              className="text-amber-700 font-bold underline hover:text-amber-800"
            >
              Login Admin
            </button>
            .
          </span>
        </div>

        <button
          onClick={onProceed}
          className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <span>Lanjut ke Pembayaran</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
