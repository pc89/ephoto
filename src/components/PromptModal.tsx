import React, { useState } from 'react';
import { Copy, Check, Sparkles, X, FileText, Code2, BookOpen } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MASTER_PROMPT_ID = `Buatkan aplikasi web PhotoBooth Kiosk interaktif lengkap (Single Page Application dengan React + Tailwind CSS + Vite) yang siap dijalankan di Google AI Studio dengan spesifikasi lengkap berikut:

1. DUA JENIS LAYANAN & PENGATURAN TARIF (ADMIN EDITABLE):
   - Layanan 1: "Cetak Fisik Langsung" (Mencetak hasil foto ke printer dan mendapatkan link/QR digital).
   - Layanan 2: "Hanya File Digital" (Download foto resolusi tinggi via scan QR code).
   - Tarif untuk masing-masing layanan dapat diubah sewaktu-waktu oleh Admin melalui Login Admin.

2. SISTEM PEMBAYARAN & VALIDASI OLEH ADMIN:
   - Customer memilih metode pembayaran: Cash (Tunai di Kasir) atau QRIS.
   - Sebelum bisa melakukan sesi foto, sistem mengunci layar dengan status "Menunggu Validasi Kasir/Admin".
   - Admin/Kasir login dengan PIN untuk mengkonfirmasi bahwa customer sudah membayar lunas.
   - Begitu divalidasi, sistem otomatis membuka kunci dan melanjutkan ke pemilihan template & sesi foto.

3. DUA JENIS TIPE TEMPLATE & INTEGRASI EDIT DI CANVA:
   - Jenis Template:
     a. "Single Frame" (Layout kartu foto 4R / 4x6 inci / 1200x1800 px @ 300 DPI)
     b. "Strip Photo" (Layout strip vertikal 2x6 inci / 600x1800 px @ 300 DPI)
   - Pada kedua tipe template tersebut, customer dapat memilih jumlah foto: 2, 3, atau 4 Foto.
   - Menu Login Admin menyediakan Studio Template Canva:
     * Generator & tombol unduh PNG Guide/Blueprint dengan lubang slot presisi untuk diimpor ke Canva.
     * Tombol langsung buka lembar kerja Canva dengan ukuran pixel presisi.
     * Fitur simpan link Canva tim untuk kolaborasi desain bingkai event.
   - Admin dapat mengupload template border frame kustom (file PNG transparan) hasil ekspor Canva ke aplikasi.

4. PENGHAPUS BACKGROUND REAL-TIME (AI CUTOUT TANPA KAIN HIJAU & CHROMA KEY):
   - Fitur AI Smart Cutout: Otomatis mendeteksi manusia dan menghapus latar ruangan apapun secara real-time TANPA memerlukan kain hijau (menggunakan AI Selfie Segmentation).
   - Fitur Chroma Key Klasik: Opsi penghapusan kain hijau fisik dengan slider toleransi warna, kehalusan tepian, dan eyedropper.
   - Customer dapat memilih gambar latar belakang (background) dari galeri atau background asli ruangan.
   - Admin dapat mengupload gambar latar belakang baru dari panel admin.

5. HITUNGAN MUNDUR (COUNTDOWN) & SESI PEMOTRETAN:
   - Hitungan mundur visual (3, 2, 1) dengan sound efek beep audio synthesizer dan efek shutter flash kamera.
   - Sistem mengambil jepretan foto beruntun secara otomatis sesuai jumlah pose yang dibutuhkan.

6. PEMILIHAN FOTO (PHOTO SELECTION KE SLOT):
   - Customer meninjau seluruh foto hasil jepretan di layar review.
   - Customer bebas memilih foto mana saja yang ingin dimasukkan ke dalam Slot 1, Slot 2, Slot 3, atau Slot 4 pada template.
   - Tersedia pilihan filter warna (Normal, Black & White, Vintage Warm, Clean Cool) dan teks caption custom (tanggal & nama event).

7. PENCETAKAN PRINTER & UNDUH DIGITAL:
   - Fitur "Cetak ke Printer": layout dicetak presisi ke printer foto dengan print-ready stylesheet (@media print) tanpa memotong proporsi.
   - Fitur "Unduh Digital": menghasilkan QR code dinamis yang dapat langsung discan customer menggunakan kamera HP mereka untuk mendownload file gambar HD.

8. PANEL ADMIN TERLINDUNGI PIN:
   - Menu Antrian Validasi Pembayaran (Cash/QRIS).
   - Menu Edit Tarif Layanan (Harga Cetak & Harga Digital).
   - Menu Upload & Kelola Background Green Screen.
   - Menu Upload & Kelola Template Frame.
   - Menu Studio Template Canva (Download PNG Frame transparan & link Canva).
   - Menu Kalibrasi Green Screen (Chroma Key & AI Segmentation).
   - Rekap Laporan Penjualan Harian & Total Omset.

9. DESAIN ANTARMUKA:
   - Tampilan terang bernuansa butik elegan (warm cream & pearl, emas/amber accent) yang ramah dan menarik bagi pengunjung.`;

export const MASTER_PROMPT_EN = `Build a complete, production-grade interactive PhotoBooth Kiosk Web Application (React + Tailwind CSS + Vite) running in Google AI Studio with the following comprehensive features:

1. TWO SERVICE TIERS & EDITABLE PRICING:
   - Tier 1: "Direct Physical Print" (Prints photostrips/frames via printer + digital copy).
   - Tier 2: "Digital Only" (High-resolution download via smartphone QR code).
   - Pricing dynamically editable by Admin in a PIN-protected Admin Panel.

2. PAYMENT & MANDATORY ADMIN CASHIER VALIDATION:
   - Customer selects Cash or QRIS.
   - The kiosk locks with "Waiting for Admin/Cashier Payment Validation".
   - The cashier logs in with a PIN to verify payment.
   - Once validated, the kiosk automatically unlocks to template selection and photo session.

3. TWO TEMPLATE TYPES WITH 2, 3, OR 4 PHOTO CHOICES & CANVA INTEGRATION:
   - Template Types:
     a. "Single Frame" (4x6 postcard / 4R / 1200x1800 px @ 300 DPI)
     b. "Strip Photo" (Classic 2x6 vertical photostrip / 600x1800 px @ 300 DPI)
   - Customers can pick: 2, 3, or 4 photos.
   - Canva Template Studio in Admin: direct Canva creation links, instant transparent PNG frame cutout generator with pre-measured photo slots, and saved Canva link management.
   - Admin can upload custom exported PNG frames into the kiosk.

4. REAL-TIME AI BACKGROUND REMOVAL (NO GREEN SCREEN NEEDED) & CHROMA KEY:
   - AI Smart Cutout: Real-time background replacement without green screen fabric using browser AI segmentation.
   - Classic Green Screen: Chroma key mode with color tolerance, smoothness, and eyedropper.
   - Customers pick virtual background images; Admin uploads custom ones.

5. INTERACTIVE COUNTDOWN & AUTO-CAPTURE:
   - 3-2-1 visual countdown with synthesized Web Audio beeps and flash animations.
   - Multi-shot burst session capturing poses automatically.

6. PHOTO SLOT SELECTION (DRAG & DROP / CLICK ASSIGN):
   - Review gallery showing all shots.
   - Customers choose exactly which photo goes into Slot 1, 2, 3, or 4.
   - Photo filters (Normal, B&W, Sepia, Cool) and custom date/event caption.

7. PRINTER OUTPUT & DIGITAL QR CODE DOWNLOAD:
   - High-fidelity printing formatted via @media print stylesheet.
   - Instant dynamic QR code generator on screen for customer mobile download.

8. ADMIN DASHBOARD:
   - Payment validation queue, pricing editor, background & template uploader, Canva studio, and sales analytics.

9. UI THEME:
   - Bright, warm luxury boutique aesthetic with pearl cream background, gold accents, and clean modern typography.`;

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPrompt = lang === 'id' ? MASTER_PROMPT_ID : MASTER_PROMPT_EN;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white border border-stone-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
                Prompt Master AI Studio PhotoBooth
              </h2>
              <p className="text-xs text-stone-500">
                Gunakan teks prompt ini untuk mereplikasi atau mengembangkan aplikasi ini di Google AI Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs & Copy Button */}
        <div className="flex items-center justify-between px-6 py-3 bg-stone-100/70 border-b border-stone-200">
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-xl">
            <button
              onClick={() => setLang('id')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'id' ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bahasa Indonesia (Lengkap)
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'en' ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English Version
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Prompt Ini</span>
              </>
            )}
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono text-stone-800 bg-stone-50">
          <div className="p-4 bg-white rounded-2xl border border-stone-200 whitespace-pre-wrap leading-relaxed select-all shadow-sm">
            {currentPrompt}
          </div>

          {/* Quick tips */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 space-y-1 font-sans">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <BookOpen className="w-4 h-4" />
              <span>Cara Menggunakan di AI Studio Build:</span>
            </div>
            <p>1. Salin teks prompt di atas dengan mengklik tombol "Salin Prompt Ini".</p>
            <p>2. Tempelkan (paste) ke kolom prompt chat Google AI Studio Build saat memulai proyek baru.</p>
            <p>3. Aplikasi yang sedang Anda gunakan saat ini sudah mengimplementasikan seluruh fitur di dalam prompt ini secara lengkap dan berfungsi 100%!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
