import React, { useState } from 'react';
import { Molecule3D, QuantumAIState } from '../types/chemistry';
import { quantumAIModel, AIPredictionResult } from '../utils/quantumAI';
import { sounds } from '../utils/audio';
import {
  Bot,
  Play,
  Sparkles,
  Activity,
  BrainCircuit,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Radio,
  BarChart2
} from 'lucide-react';

interface QuantumAIPanelProps {
  molecule: Molecule3D;
  isOpen: boolean;
  onClose: () => void;
}

export const QuantumAIPanel: React.FC<QuantumAIPanelProps> = ({
  molecule,
  isOpen,
  onClose
}) => {
  const [aiState, setAiState] = useState<QuantumAIState>({
    isTraining: false,
    trainingEpochs: 12,
    lossHistory: [0.38, 0.29, 0.22, 0.16, 0.11, 0.07, 0.04, 0.025],
    accuracy: 94.2,
    predictedHomoLumoGapEv: 3.42,
    predictedDipole: 1.85,
    modelStatus: 'trained'
  });

  const [prediction, setPrediction] = useState<AIPredictionResult>(() =>
    quantumAIModel.predict(molecule)
  );

  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOpen) return null;

  const handleRunInference = () => {
    sounds.playQuantumZap();
    const result = quantumAIModel.predict(molecule);
    setPrediction(result);
  };

  const handleTrainModel = () => {
    sounds.playFieldResonance();
    setAiState(prev => ({ ...prev, isTraining: true, modelStatus: 'training' }));
    quantumAIModel.trainEpoch(aiState, (updated) => {
      setAiState(updated);
      if (!updated.isTraining) {
        sounds.playBond();
        setPrediction(quantumAIModel.predict(molecule));
      }
    });
  };

  return (
    <div className="fixed bottom-16 left-4 z-40 w-96 max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-md border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-950/80 border-b border-indigo-800/60">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-indigo-100 tracking-wide">IA Agente Grafo-Cuántica</h3>
            <p className="text-[10px] text-indigo-300/80">Predicción de Espectros, GAP y Estabilidad</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-indigo-300 hover:text-white rounded hover:bg-indigo-900/50"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-indigo-300 hover:text-white rounded hover:bg-indigo-900/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 text-xs text-gray-200 max-h-[70vh] overflow-y-auto">
          {/* Status Badge & Neural Accuracy */}
          <div className="flex items-center justify-between p-2.5 bg-gray-950/70 border border-indigo-900/40 rounded-xl">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-[10px] text-gray-400">Estado de la IA</div>
                <div className="text-xs font-bold text-indigo-300 capitalize">
                  {aiState.modelStatus === 'training' ? 'Backpropagation Activo...' : 'Red Neuronal Entrenada'}
                </div>
              </div>
            </div>

            <div className="text-right font-mono tabular-nums">
              <div className="text-[10px] text-gray-400">Precisión R²</div>
              <div className="text-xs font-bold text-emerald-400">{aiState.accuracy}%</div>
            </div>
          </div>

          {/* AI Predictions Card */}
          <div className="p-3 bg-gray-950/80 border border-indigo-900/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Predicciones de la Red Neuronal
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Confianza: {prediction.aiConfidence}%</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono tabular-nums">
              <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800">
                <div className="text-[9px] text-gray-400 uppercase">Gap HOMO-LUMO</div>
                <div className="text-sm font-bold text-sky-400">{prediction.predictedHomoLumoGapEv} eV</div>
              </div>

              <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800">
                <div className="text-[9px] text-gray-400 uppercase">Pico UV-Vis</div>
                <div className="text-sm font-bold text-amber-400">{prediction.uvVisPeakNm} nm</div>
              </div>

              <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800">
                <div className="text-[9px] text-gray-400 uppercase">Estiramiento IR</div>
                <div className="text-sm font-bold text-indigo-300">{prediction.vibrationalIRFrequencyCm1} cm⁻¹</div>
              </div>

              <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800">
                <div className="text-[9px] text-gray-400 uppercase">Solubilidad LogS</div>
                <div className="text-sm font-bold text-emerald-400">{prediction.predictedSolubilityLogS}</div>
              </div>
            </div>

            <div className="p-2 bg-indigo-950/40 border border-indigo-800/40 rounded-lg text-[10px] text-indigo-200 leading-relaxed font-mono">
              {prediction.explanation}
            </div>
          </div>

          {/* Training Loss Curve */}
          <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-400" />
                Curva de Pérdida (Loss - Epoc {aiState.trainingEpochs})
              </span>
              <span className="font-mono text-indigo-300">Loss: {aiState.lossHistory[aiState.lossHistory.length - 1]?.toFixed(3) || '0.012'}</span>
            </div>

            <div className="h-8 flex items-end gap-1 pt-1 border-b border-gray-800">
              {aiState.lossHistory.map((val, idx) => {
                const heightPct = Math.max(10, Math.min(100, val * 180));
                return (
                  <div
                    key={idx}
                    style={{ height: `${heightPct}%` }}
                    className="flex-1 bg-gradient-to-t from-indigo-600 to-sky-400 rounded-t transition-all duration-200"
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleRunInference}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Ejecutar Inferencia IA</span>
            </button>

            <button
              onClick={handleTrainModel}
              disabled={aiState.isTraining}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-200 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800/80 rounded-xl transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>{aiState.isTraining ? 'Entrenando...' : 'Re-Entrenar IA'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
