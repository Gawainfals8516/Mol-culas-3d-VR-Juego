import React, { useState } from 'react';
import { ChemicalReaction, Molecule3D } from '../types/chemistry';
import { CHEMICAL_REACTIONS } from '../data/reactions';
import { evaluateMolecularStability } from '../utils/chemicalPhysics';
import { sounds } from '../utils/audio';
import {
  Play,
  RotateCcw,
  Flame,
  ShieldCheck,
  X,
  ChevronRight,
  ChevronLeft,
  Activity,
  Sparkles,
  Zap
} from 'lucide-react';

interface ChemicalReactionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadReactionMolecule: (molecule: Molecule3D) => void;
}

export const ChemicalReactionsPanel: React.FC<ChemicalReactionsPanelProps> = ({
  isOpen,
  onClose,
  onLoadReactionMolecule
}) => {
  const [selectedReaction, setSelectedReaction] = useState<ChemicalReaction>(CHEMICAL_REACTIONS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentStep = selectedReaction.steps[currentStepIndex];
  const stability = evaluateMolecularStability(currentStep.molecule.atoms, currentStep.molecule.bonds);

  const handleNextStep = () => {
    sounds.playClick();
    const nextIdx = (currentStepIndex + 1) % selectedReaction.steps.length;
    setCurrentStepIndex(nextIdx);
    onLoadReactionMolecule(selectedReaction.steps[nextIdx].molecule);
  };

  const handlePrevStep = () => {
    sounds.playClick();
    const prevIdx = (currentStepIndex - 1 + selectedReaction.steps.length) % selectedReaction.steps.length;
    setCurrentStepIndex(prevIdx);
    onLoadReactionMolecule(selectedReaction.steps[prevIdx].molecule);
  };

  const handlePlayAnimation = () => {
    sounds.playFieldResonance();
    setIsPlaying(true);
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % selectedReaction.steps.length;
      setCurrentStepIndex(idx);
      onLoadReactionMolecule(selectedReaction.steps[idx].molecule);
      sounds.playBond();
      if (idx === selectedReaction.steps.length - 1) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-gray-900 border border-amber-500/40 rounded-2xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-gray-100">Simulador de Reacciones Químicas, Electrones e Iones 3D</h2>
              <p className="text-xs text-gray-400">Observa mecanismos de reacción, transferencia de electrones, atracción iónica y perfiles ΔH</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reaction Selector Tabs */}
        <div className="flex gap-2 my-3 overflow-x-auto pb-1">
          {CHEMICAL_REACTIONS.map(rxn => (
            <button
              key={rxn.id}
              onClick={() => {
                sounds.playClick();
                setSelectedReaction(rxn);
                setCurrentStepIndex(0);
                onLoadReactionMolecule(rxn.steps[0].molecule);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
                selectedReaction.id === rxn.id
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {rxn.title.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Reaction Equation & Kinetic Details */}
        <div className="p-3 bg-gray-950/80 border border-gray-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-amber-300 font-mono tracking-wide">
              {selectedReaction.equation}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-800/50 bg-amber-950/40 text-amber-300">
              {selectedReaction.type}
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {selectedReaction.description}
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
            <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800">
              <div className="text-[9px] text-gray-500 uppercase">Energía de Activación E_a</div>
              <div className="text-xs font-bold text-amber-400">+{selectedReaction.activationEnergyKcal} kcal/mol</div>
            </div>
            <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800">
              <div className="text-[9px] text-gray-500 uppercase">Entalpía ΔH</div>
              <div className="text-xs font-bold text-sky-400">{selectedReaction.enthalpyKcal} kcal/mol</div>
            </div>
            <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800">
              <div className="text-[9px] text-gray-500 uppercase">Termodinámica</div>
              <div className="text-xs font-bold text-emerald-400">
                {selectedReaction.isExothermic ? 'Exotérmica (Libera Calor)' : 'Endotérmica'}
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Reaction Player Card */}
        <div className="my-3 p-3 bg-gray-950/90 border border-amber-900/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              Paso Actual: {currentStep.stepName}
            </span>

            {/* STABILITY BUTTON INSIDE REACTION STEP */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${stability.badgeBg}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Estabilidad: {stability.status}</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-mono">
            {currentStep.description}
          </p>

          {/* Active Ions or Electron Transfer Badges */}
          {(currentStep.activeIons || currentStep.electronTransfers) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {currentStep.activeIons?.map((ionText, idx) => (
                <span key={idx} className="px-2 py-0.5 text-[10px] font-mono font-bold text-sky-300 bg-sky-950/80 border border-sky-700/60 rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3 text-sky-400" />
                  {ionText}
                </span>
              ))}
              {currentStep.electronTransfers?.map((et, idx) => (
                <span key={idx} className="px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-700/60 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {et.description || `Flujo e⁻: ${et.electronCount} e⁻`}
                </span>
              ))}
            </div>
          )}

          {/* Progress Bar of Steps */}
          <div className="flex gap-1.5 pt-1">
            {selectedReaction.steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  setCurrentStepIndex(idx);
                  onLoadReactionMolecule(step.molecule);
                }}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-amber-400 ring-2 ring-amber-300/50'
                    : idx < currentStepIndex
                    ? 'bg-sky-500'
                    : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNextStep}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePlayAnimation}
            disabled={isPlaying}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-lg shadow-amber-400/20 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-amber-950" />
            <span>{isPlaying ? 'Simulando Reacción...' : 'Simular Reacción 3D Animada'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
