import React from 'react';
import { ViewMode, VRMode } from '../types/chemistry';
import { sounds } from '../utils/audio';
import { 
  Glasses, 
  Compass, 
  Maximize, 
  Minimize, 
  Eye, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ArrowRightLeft
} from 'lucide-react';

interface VRControlsOverlayProps {
  vrMode: VRMode;
  onChangeVRMode: (mode: VRMode) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  showDipole: boolean;
  onToggleDipole: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ipd: number;
  onChangeIPD: (val: number) => void;
  gazeProgress: number; // 0 to 1
}

export const VRControlsOverlay: React.FC<VRControlsOverlayProps> = ({
  vrMode,
  onChangeVRMode,
  viewMode,
  onChangeViewMode,
  showDipole,
  onToggleDipole,
  soundEnabled,
  onToggleSound,
  ipd,
  onChangeIPD,
  gazeProgress
}) => {
  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleEnterCardboard = async () => {
    sounds.playFieldResonance();
    // Request gyro permission on devices that require it (e.g. Android 13+ or iOS)
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response !== 'granted') {
          console.warn('Gyroscope permission was denied');
        }
      } catch (err) {
        console.warn('DeviceOrientation permission request error', err);
      }
    }
    // Auto enter fullscreen for true immersive cardboard experience
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    onChangeVRMode(vrMode === 'cardboard' ? 'none' : 'cardboard');
  };

  const handleEnterGyro = () => {
    sounds.playClick();
    onChangeVRMode(vrMode === 'gyro360' ? 'none' : 'gyro360');
  };

  return (
    <>
      {/* 1. CARDBOARD VR RETICLE (Stereoscopic Crosshair in Center of Left & Right Eyes) */}
      {vrMode === 'cardboard' && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-between">
          {/* Left Eye Reticle */}
          <div className="w-1/2 h-full flex items-center justify-center relative">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white/80 rounded-full" />
              {gazeProgress > 0 && (
                <svg className="absolute w-8 h-8 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray={75.4}
                    strokeDashoffset={75.4 * (1 - gazeProgress)}
                    className="transition-all duration-75"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Central Cardboard divider line */}
          <div className="w-[2px] h-full bg-black/90 shadow-2xl relative z-10" />

          {/* Right Eye Reticle */}
          <div className="w-1/2 h-full flex items-center justify-center relative">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white/80 rounded-full" />
              {gazeProgress > 0 && (
                <svg className="absolute w-8 h-8 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray={75.4}
                    strokeDashoffset={75.4 * (1 - gazeProgress)}
                    className="transition-all duration-75"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Top-Right Floating Quick Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Silenciar Efectos' : 'Activar Efectos de Sonido'}
          className="p-2.5 bg-gray-900/90 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl shadow-xl transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
        </button>

        {/* Dipole Vector toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleDipole();
          }}
          title={showDipole ? 'Ocultar Vector Dipolo' : 'Mostrar Vector de Polaridad Dipolar'}
          className={`p-2.5 rounded-xl border shadow-xl transition-colors ${
            showDipole
              ? 'bg-sky-950/80 border-sky-600 text-sky-400'
              : 'bg-gray-900/90 border-gray-800 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          title="Pantalla Completa"
          className="p-2.5 bg-gray-900/90 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl shadow-xl transition-colors"
        >
          {document.fullscreenElement ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* 3. Bottom Central VR & Visualization Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl pointer-events-auto">
        {/* Representation Selector */}
        <div className="flex items-center gap-1 bg-gray-950/80 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => {
              sounds.playClick();
              onChangeViewMode('ball-and-stick');
            }}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              viewMode === 'ball-and-stick'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Varillas
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onChangeViewMode('space-filling');
            }}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              viewMode === 'space-filling'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Esferas CPK
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onChangeViewMode('wireframe');
            }}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              viewMode === 'wireframe'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Esqueleto
          </button>
        </div>

        {/* VR Cardboard Mode (Android Ready) */}
        <button
          onClick={handleEnterCardboard}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-lg whitespace-nowrap ${
            vrMode === 'cardboard'
              ? 'bg-rose-600 text-white shadow-rose-600/30 ring-2 ring-rose-400'
              : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-indigo-600/20'
          }`}
        >
          <Glasses className="w-4 h-4" />
          <span>{vrMode === 'cardboard' ? 'Salir de VR' : 'Modo VR Cardboard / Android'}</span>
        </button>

        {/* 360 Gyroscope Magic Window mode */}
        <button
          onClick={handleEnterGyro}
          title="Modo Giroscopio 360° para Celular"
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors whitespace-nowrap ${
            vrMode === 'gyro360'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-gray-950/80 border-gray-800 text-gray-300 hover:bg-gray-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Giroscopio 360°</span>
        </button>
      </div>

      {/* 4. In Cardboard VR: Exit VR button in corner & IPD calibration */}
      {vrMode === 'cardboard' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-800 text-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-gray-300">Distancia Ocular (IPD):</span>
            <input
              type="range"
              min="54"
              max="74"
              value={ipd}
              onChange={(e) => onChangeIPD(parseInt(e.target.value))}
              className="w-20 h-1 bg-gray-700 rounded appearance-none cursor-pointer accent-sky-500"
            />
            <span className="text-sky-400 font-mono">{ipd}mm</span>
          </div>

          <button
            onClick={() => onChangeVRMode('none')}
            className="px-2.5 py-1 text-xs font-semibold text-rose-300 bg-rose-950 hover:bg-rose-900 border border-rose-800/80 rounded-lg transition-colors"
          >
            Cerrar VR
          </button>
        </div>
      )}
    </>
  );
};
