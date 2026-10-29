import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  Sparkles,
  Sliders,
  Pipette,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Video,
  CheckCircle2,
  Wand2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { BackgroundItem, ChromaSettings, PhotoCapture, PhotoCount, BackgroundRemovalMode } from '../types/photobooth';
import { compositeChromaFrame } from '../utils/chromaKey';
import { compositeAiSegmentation, sendFrameToAi, isAiModelLoaded } from '../utils/aiSegmentation';
import { soundFx } from '../utils/audio';

interface StepCameraShootProps {
  photoCount: PhotoCount;
  background: BackgroundItem;
  chromaSettings: ChromaSettings;
  onUpdateChromaSettings: (settings: ChromaSettings) => void;
  onCapturesComplete: (captures: PhotoCapture[]) => void;
  onBack: () => void;
}

export const StepCameraShoot: React.FC<StepCameraShootProps> = ({
  photoCount,
  background,
  chromaSettings,
  onUpdateChromaSettings,
  onCapturesComplete,
  onBack,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isAiProcessingRef = useRef<boolean>(false);

  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useSimulated, setUseSimulated] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Calibration panel
  const [showTuning, setShowTuning] = useState<boolean>(false);
  const [isPickingColor, setIsPickingColor] = useState<boolean>(false);

  // Shoot session states
  const totalShots = Math.max(photoCount + 2, 4); // Always give 4-6 shots so customer has pose choices
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0);
  const [sessionState, setSessionState] = useState<'idle' | 'countdown' | 'flash' | 'review' | 'done'>('idle');
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [capturedList, setCapturedList] = useState<PhotoCapture[]>([]);
  const [flashVisible, setFlashVisible] = useState<boolean>(false);

  // Preload Background Image
  useEffect(() => {
    if (background.url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = background.url;
      img.onload = () => {
        bgImgRef.current = img;
      };
    } else {
      bgImgRef.current = null;
    }
  }, [background]);

  // Start Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Webcam API tidak didukung pada browser ini.');
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setHasCamera(true);
            setCameraError(null);
          };
        }
      } catch (err: unknown) {
        console.warn('Camera access issue:', err);
        setHasCamera(false);
        setCameraError(
          err instanceof Error
            ? err.message
            : 'Kamera tidak terdeteksi atau izin belum diberikan. Mode simulasi photobooth diaktifkan.'
        );
        setUseSimulated(true);
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Main Render Loop (Draws Webcam + Background Replacement to Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMounted = true;
    let simAngle = 0;

    const render = async () => {
      if (!isMounted) return;

      const video = videoRef.current;
      const currentMode = chromaSettings.mode || 'ai_virtual';

      if (!useSimulated && video && video.readyState >= 2) {
        // Set canvas dimensions matching video feed
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
        }

        if (currentMode === 'ai_virtual') {
          // 1. Send frame to AI model periodically if not already busy
          if (!isAiProcessingRef.current) {
            isAiProcessingRef.current = true;
            sendFrameToAi(video)
              .catch(() => {})
              .finally(() => {
                isAiProcessingRef.current = false;
              });
          }

          // 2. Try drawing composite AI segmentation
          const rendered = compositeAiSegmentation({
            destCanvas: canvas,
            backgroundImage: bgImgRef.current,
            mirror: true,
          });

          // If AI model is still spinning up on first frames, fallback to drawing video directly
          if (!rendered) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.save();
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              ctx.restore();
            }
          }
        } else if (currentMode === 'green_screen') {
          // Physical green screen chroma key
          compositeChromaFrame({
            sourceVideo: video,
            destCanvas: canvas,
            backgroundImage: bgImgRef.current,
            options: chromaSettings,
            mirror: true,
          });
        } else {
          // Original Camera (No background change)
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();
          }
        }
      } else {
        // Fallback / Simulated mode (Creates an animated virtual scene with mannequin)
        if (canvas.width !== 1280 || canvas.height !== 720) {
          canvas.width = 1280;
          canvas.height = 720;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          simAngle += 0.02;

          // 1. Draw background
          if (bgImgRef.current && bgImgRef.current.complete) {
            const bgW = bgImgRef.current.naturalWidth || 1280;
            const bgH = bgImgRef.current.naturalHeight || 720;
            const scale = Math.max(1280 / bgW, 720 / bgH);
            ctx.drawImage(
              bgImgRef.current,
              (1280 - bgW * scale) / 2,
              (720 - bgH * scale) / 2,
              bgW * scale,
              bgH * scale
            );
          } else {
            const grad = ctx.createLinearGradient(0, 0, 1280, 720);
            grad.addColorStop(0, '#18181b');
            grad.addColorStop(1, '#09090b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1280, 720);
          }

          // 2. Draw Simulated Subjects (2 happy friends posing for photobooth)
          ctx.save();
          const bounce = Math.sin(simAngle) * 8;
          ctx.translate(640, 520 + bounce);

          // Body 1
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.ellipse(-140, 120, 100, 160, 0, 0, Math.PI * 2);
          ctx.fill();

          // Head 1
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.arc(-140, -10, 75, 0, Math.PI * 2);
          ctx.fill();

          // Smile 1
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(-140, 0, 35, 0.2, Math.PI - 0.2);
          ctx.stroke();

          // Sunglasses 1
          ctx.fillStyle = '#09090b';
          ctx.fillRect(-185, -28, 40, 24);
          ctx.fillRect(-135, -28, 40, 24);
          ctx.fillRect(-145, -20, 20, 4);

          // Body 2
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.ellipse(140, 120, 110, 160, 0, 0, Math.PI * 2);
          ctx.fill();

          // Head 2
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(140, -20, 70, 0, Math.PI * 2);
          ctx.fill();

          // Smile 2
          ctx.beginPath();
          ctx.arc(140, -10, 30, 0.2, Math.PI - 0.2);
          ctx.stroke();

          // Hand Peace sign
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(230, -50, 25, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Watermark badge for simulated mode
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(20, 20, 320, 40);
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('• MODE SIMULASI PHOTOBOOTH AKTIF', 35, 45);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [useSimulated, chromaSettings]);

  // Handle Eyedropper on Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPickingColor || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const p = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1)}`;
      onUpdateChromaSettings({
        ...chromaSettings,
        keyColor: hex,
      });
      setIsPickingColor(false);
    }
  };

  // Perform Snapshot Capture
  const takeSnapshot = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    soundFx.playShutterSound();
    setFlashVisible(true);
    setTimeout(() => setFlashVisible(false), 200);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const newCapture: PhotoCapture = {
      id: `capture-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      dataUrl,
    };

    setCapturedList((prev) => {
      const updated = [...prev, newCapture];

      if (updated.length >= totalShots) {
        setSessionState('done');
        soundFx.playSuccessChime();
        setTimeout(() => {
          onCapturesComplete(updated);
        }, 1200);
      } else {
        setCurrentShotIndex(updated.length);
        setSessionState('review');
        // Brief pause between poses, then begin next countdown
        setTimeout(() => {
          setCountdownNum(3);
          setSessionState('countdown');
        }, 1600);
      }

      return updated;
    });
  }, [totalShots, onCapturesComplete]);

  // Countdown State Machine
  useEffect(() => {
    if (sessionState !== 'countdown') return;

    soundFx.playCountdownTick(countdownNum === 1);

    const timer = setTimeout(() => {
      if (countdownNum > 1) {
        setCountdownNum((prev) => prev - 1);
      } else {
        // SNAP!
        setSessionState('flash');
        takeSnapshot();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionState, countdownNum, takeSnapshot]);

  // Start Session Button
  const handleStartSession = () => {
    setCapturedList([]);
    setCurrentShotIndex(0);
    setCountdownNum(3);
    setSessionState('countdown');
  };

  const currentMode = chromaSettings.mode || 'ai_virtual';

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <button
          onClick={onBack}
          disabled={sessionState === 'countdown' || sessionState === 'flash'}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs disabled:opacity-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ganti Background</span>
        </button>

        {/* MODE SELECTOR: AI Virtual Cutout vs Physical Green Screen vs Original */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <button
            onClick={() =>
              onUpdateChromaSettings({
                ...chromaSettings,
                mode: 'ai_virtual',
                enabled: true,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentMode === 'ai_virtual'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>AI Cutout (Tanpa Kain)</span>
          </button>

          <button
            onClick={() =>
              onUpdateChromaSettings({
                ...chromaSettings,
                mode: 'green_screen',
                enabled: true,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentMode === 'green_screen'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kain Green Screen</span>
          </button>

          <button
            onClick={() =>
              onUpdateChromaSettings({
                ...chromaSettings,
                mode: 'none',
                enabled: false,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentMode === 'none'
                ? 'bg-stone-900 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Kamera Asli</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulated Mode Toggle */}
          <button
            onClick={() => setUseSimulated((prev) => !prev)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition flex items-center gap-1.5 shadow-2xs ${
              useSimulated
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-stone-600 border-stone-200 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{useSimulated ? 'Simulasi Aktif' : 'Webcam Nyata'}</span>
          </button>

          {/* Chroma Tuning (Only for green_screen mode) */}
          {currentMode === 'green_screen' && (
            <button
              onClick={() => setShowTuning((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs transition"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Kalibrasi Hijau</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature Explainer Banner when in AI Cutout mode */}
      {currentMode === 'ai_virtual' && (
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200 shadow-xs flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Fitur AI Smart Cutout Aktif:</strong> Latar belakang ruangan langsung terhapus otomatis secara cerdas <strong>tanpa memerlukan kain hijau (green screen)</strong>!
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-900 font-bold hidden sm:inline border border-amber-300/60">
            MediaPipe Vision AI
          </span>
        </div>
      )}

      {/* Camera Alert if no physical webcam */}
      {cameraError && !useSimulated && (
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{cameraError}</span>
          </div>
          <button
            onClick={() => setUseSimulated(true)}
            className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] shadow-2xs"
          >
            Gunakan Simulasi
          </button>
        </div>
      )}

      {/* Chroma Tuning Accordion (If user is using physical cloth) */}
      {showTuning && currentMode === 'green_screen' && (
        <div className="mb-4 p-5 rounded-3xl bg-white border border-stone-200 shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>Kalibrasi Chroma Key (Kain Hijau)</span>
            </h4>
            <span className="text-[11px] text-stone-500">
              Gunakan jika Anda memiliki kain green screen fisik di studio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            {/* Color Picker / Eyedropper */}
            <div>
              <span className="text-stone-600 font-semibold block mb-1.5">Warna Target Hijau:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={chromaSettings.keyColor}
                  onChange={(e) =>
                    onUpdateChromaSettings({
                      ...chromaSettings,
                      keyColor: e.target.value,
                    })
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <button
                  onClick={() => setIsPickingColor(true)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                    isPickingColor
                      ? 'bg-amber-400 text-stone-950 border-amber-500 animate-pulse'
                      : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <Pipette className="w-3 h-3" />
                  <span>{isPickingColor ? 'Klik Layar...' : 'Pipet Warna'}</span>
                </button>
              </div>
            </div>

            {/* Tolerance */}
            <div>
              <div className="flex justify-between text-stone-600 mb-1 font-semibold">
                <span>Toleransi Hijau:</span>
                <span className="font-mono text-stone-900">{chromaSettings.tolerance}%</span>
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

            {/* Smoothness */}
            <div>
              <div className="flex justify-between text-stone-600 mb-1 font-semibold">
                <span>Kehalusan Tepian:</span>
                <span className="font-mono text-stone-900">{chromaSettings.smoothness}%</span>
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

            {/* Spill Suppression */}
            <div>
              <div className="flex justify-between text-stone-600 mb-1 font-semibold">
                <span>Spill Suppression:</span>
                <span className="font-mono text-stone-900">{chromaSettings.spillSuppression}%</span>
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

      {/* Main Viewport & Canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-zinc-800 shadow-2xl aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
        {/* Hidden video element feeding canvas */}
        <video
          ref={videoRef}
          playsInline
          muted
          className="hidden"
        />

        {/* Live Canvas rendering subject + background */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`w-full h-full object-cover ${
            isPickingColor ? 'cursor-crosshair' : 'cursor-default'
          }`}
        />

        {/* Shutter Flash Animation */}
        {flashVisible && (
          <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />
        )}

        {/* Big Countdown Overlay (3, 2, 1) */}
        {sessionState === 'countdown' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="text-8xl sm:text-9xl font-black text-amber-400 font-heading drop-shadow-2xl animate-bounce">
              {countdownNum}
            </div>
            <p className="text-sm sm:text-base font-bold text-white tracking-widest uppercase mt-4 bg-black/60 px-4 py-1.5 rounded-full border border-white/20">
              Pose {currentShotIndex + 1} dari {totalShots} • Bersiaplah!
            </p>
          </div>
        )}

        {/* Review between shots */}
        {sessionState === 'review' && (
          <div className="absolute top-4 right-4 z-30 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-700 text-xs text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Foto {currentShotIndex} Tersimpan! Pose berikutnya dalam 2 detik...</span>
          </div>
        )}

        {/* Done State */}
        {sessionState === 'done' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white font-heading">
              Sesi Pemotretan Selesai!
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              Menyiapkan galeri foto untuk Anda pilih...
            </p>
          </div>
        )}

        {/* Idle Start Prompt Overlay */}
        {sessionState === 'idle' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-950/25 backdrop-blur-[2px] p-6 text-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-stone-200/90 max-w-md shadow-2xl shadow-stone-900/30">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {currentMode === 'ai_virtual'
                    ? '✨ AI Cutout (Tanpa Kain)'
                    : currentMode === 'green_screen'
                    ? '🟩 Kain Green Screen'
                    : '📷 Kamera Asli'}
                </span>
              </div>

              <h2 className="text-2xl font-black text-stone-900 mt-2 font-heading tracking-tight">
                Siapkan Senyum & Gaya Terbaik Anda!
              </h2>
              <p className="text-xs text-stone-600 mt-2 mb-6 leading-relaxed">
                Kamera akan mengambil <span className="text-amber-700 font-bold">{totalShots} jepretan</span> pose dengan hitungan mundur 3 detik setiap foto.
              </p>

              <button
                onClick={handleStartSession}
                className="w-full py-4 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-lg rounded-2xl shadow-xl shadow-amber-400/30 flex items-center justify-center gap-3 transition transform active:scale-95 cursor-pointer"
              >
                <Camera className="w-6 h-6 stroke-[2.5]" />
                <span>MULAI HITUNGAN MUNDUR (3-2-1)</span>
              </button>
            </div>
          </div>
        )}

        {/* Active Mode Badge Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
          <div className="bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {capturedList.length} / {totalShots} Foto Terambil
            </span>
          </div>

          <div className="hidden sm:flex bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-[11px] text-amber-300 font-medium items-center gap-1.5">
            {currentMode === 'ai_virtual' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Background Removal</span>
              </>
            ) : currentMode === 'green_screen' ? (
              <>
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chroma Key Green Cloth</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5" />
                <span>Original Camera</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails of shots taken */}
      {capturedList.length > 0 && (
        <div className="mt-4 p-3 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3 overflow-x-auto">
          <span className="text-xs font-bold text-stone-600 shrink-0">
            Jepretan:
          </span>
          {capturedList.map((c, i) => (
            <div
              key={c.id}
              className="relative w-16 h-12 rounded-xl overflow-hidden border-2 border-amber-400/80 shrink-0 shadow-xs"
            >
              <img
                src={c.dataUrl}
                alt={`Shot ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-stone-900/80 text-[9px] font-mono text-amber-300 px-1 rounded-tl">
                #{i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
