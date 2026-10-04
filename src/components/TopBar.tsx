import React from 'react';
import { ZoomLevel, VRMode } from '../types/chemistry';
import { sounds } from '../utils/audio';
import { Glasses, Activity } from 'lucide-react';

interface TopBarProps {
  zoomLevel: ZoomLevel;
  onChangeZoomLevel: (z: ZoomLevel) => void;
  vrMode: VRMode;
  onToggleVR: () => void;
  formula: string;
  onOpenHelp: () => void;
  showPropertiesPanel: boolean;
  onTogglePropertiesPanel: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  zoomLevel,
  onChangeZoomLevel,
  vrMode,
  onToggleVR,
  formula,
  onOpenHelp,
  showPropertiesPanel,
  onTogglePropertiesPanel
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3.5 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/80 pointer-events-auto">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-tight text-white font-sans">
          QuantumVR <span className="text-sky-400 font-mono font-normal">ChemLab</span>
        </span>
        {formula && formula !== 'Vacío' && (
          <span className="hidden sm:inline-block text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
            {formula}
          </span>
        )}
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
        <button
          onClick={() => {
            sounds.playClick();
            onChangeZoomLevel('molecular');
          }}
          className={`hover:text-white transition-colors ${zoomLevel === 'molecular' ? 'text-sky-400 font-semibold' : ''}`}
        >
          Moléculas 3D
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onChangeZoomLevel('atomic');
          }}
          className={`hover:text-white transition-colors ${zoomLevel === 'atomic' ? 'text-sky-400 font-semibold' : ''}`}
        >
          Orbitales Cuánticos
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onChangeZoomLevel('quantum');
          }}
          className={`hover:text-white transition-colors ${zoomLevel === 'quantum' ? 'text-indigo-400 font-semibold' : ''}`}
        >
          Creador de Materia
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onOpenHelp();
          }}
          className="hover:text-white transition-colors text-gray-400"
        >
          Guía Android VR
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            sounds.playClick();
            onTogglePropertiesPanel();
          }}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            showPropertiesPanel
              ? 'bg-sky-950/80 border-sky-600 text-sky-300 shadow-sm'
              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span>Propiedades Físicas</span>
        </button>

        <button
          onClick={onToggleVR}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm ${
            vrMode === 'cardboard'
              ? 'bg-rose-600 text-white hover:bg-rose-500'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          <Glasses className="w-4 h-4" />
          <span>{vrMode === 'cardboard' ? 'Salir VR' : 'Entrar VR'}</span>
        </button>
      </div>
    </header>
  );
};

