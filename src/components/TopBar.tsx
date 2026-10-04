import React from 'react';
import { ZoomLevel, VRMode } from '../types/chemistry';
import { sounds } from '../utils/audio';
import { Glasses, Activity, BrainCircuit, Flame, ShieldAlert, AlertTriangle, CheckCircle2, AlertOctagon, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  zoomLevel: ZoomLevel;
  onChangeZoomLevel: (z: ZoomLevel) => void;
  vrMode: VRMode;
  onToggleVR: () => void;
  formula: string;
  onOpenHelp: () => void;
  showPropertiesPanel: boolean;
  onTogglePropertiesPanel: () => void;
  showAIPanel: boolean;
  onToggleAIPanel: () => void;
  onOpenReactionsModal: () => void;
  stability: {
    status: string;
    canExist: boolean;
    badgeBg: string;
    reasons: string[];
  };
  onStabilizeMolecule: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  zoomLevel,
  onChangeZoomLevel,
  vrMode,
  onToggleVR,
  formula,
  onOpenHelp,
  showPropertiesPanel,
  onTogglePropertiesPanel,
  showAIPanel,
  onToggleAIPanel,
  onOpenReactionsModal,
  stability,
  onStabilizeMolecule
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/80 pointer-events-auto gap-2">
      {/* Zone 1: Title & Chemical Formula */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-base font-bold tracking-tight text-white font-sans">
          QuantumVR <span className="text-sky-400 font-mono font-normal text-xs">ChemLab</span>
        </span>
        {formula && formula !== 'Vacío' && (
          <span className="hidden sm:inline-block text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
            {formula}
          </span>
        )}
      </div>

      {/* Zone 2: Unified Central Minimalist Stability & Mode Control */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-semibold ${stability.badgeBg}`}>
          {!stability.canExist && <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
          {stability.status === 'Muy Inestable' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          {stability.status === 'Poco Estable / Reactivo' && <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />}
          {stability.status === 'Altamente Estable' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="font-bold tracking-tight">{stability.status}</span>
        </div>

        <button
          onClick={onStabilizeMolecule}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-100 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          title="Estabilizar geometría y romper enlaces imposibles"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Estabilizar</span>
        </button>
      </div>

      {/* Zone 3: Navigation & Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenReactionsModal();
          }}
          className="hover:text-amber-300 transition-colors text-amber-400 font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-800/50 text-xs shadow-sm"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">Reacciones e Iones</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onToggleAIPanel();
          }}
          className={`hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            showAIPanel
              ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300 shadow-sm'
              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
          <span>IA Cuántica</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onTogglePropertiesPanel();
          }}
          className={`hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            showPropertiesPanel
              ? 'bg-sky-950/80 border-sky-600 text-sky-300 shadow-sm'
              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span>Propiedades</span>
        </button>

        <button
          onClick={onToggleVR}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm ${
            vrMode === 'cardboard'
              ? 'bg-rose-600 text-white hover:bg-rose-500'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          <Glasses className="w-3.5 h-3.5" />
          <span>{vrMode === 'cardboard' ? 'Salir' : 'VR'}</span>
        </button>
      </div>
    </header>
  );
};
