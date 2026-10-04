import React, { useState } from 'react';
import { COMMON_BUILDER_ELEMENTS, ELEMENTS } from '../data/elements';
import { PRESET_MOLECULES } from '../data/molecules';
import { sounds } from '../utils/audio';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  RotateCcw, 
  FlaskConical, 
  Layers, 
  HelpCircle,
  FileDown,
  ShieldCheck
} from 'lucide-react';

interface ChemDrawToolbarProps {
  selectedElement: string;
  onSelectElement: (sym: string) => void;
  activeBondOrder: 1 | 2 | 3 | 0.5;
  onChangeBondOrder: (order: 1 | 2 | 3 | 0.5) => void;
  onAddAtom: (sym: string) => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  onOptimizeVSEPR: () => void;
  onStabilizeMolecule: () => void;
  onAddHydrogens: () => void;
  onClear: () => void;
  onLoadPreset: (presetId: string) => void;
  onOpenPeriodicTable: () => void;
  onExport: () => void;
}

export const ChemDrawToolbar: React.FC<ChemDrawToolbarProps> = ({
  selectedElement,
  onSelectElement,
  activeBondOrder,
  onChangeBondOrder,
  onAddAtom,
  onDeleteSelected,
  hasSelection,
  onOptimizeVSEPR,
  onStabilizeMolecule,
  onAddHydrogens,
  onClear,
  onLoadPreset,
  onOpenPeriodicTable,
  onExport
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="absolute top-14 left-4 z-20 flex flex-col gap-2 max-w-sm pointer-events-auto">
      {/* Molecule Presets & Quick Loader Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            setShowPresets(!showPresets);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-sky-400 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/60 rounded-lg transition-colors whitespace-nowrap"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Modelos</span>
        </button>

        {/* PROMINENT STABILIZE MOLECULE BUTTON */}
        <button
          onClick={() => {
            sounds.playBond();
            onStabilizeMolecule();
          }}
          title="Estabilizar geometría molecular y corregir violaciones de valencia"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-200 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 rounded-lg transition-all shadow-md shadow-emerald-700/20 whitespace-nowrap animate-pulse"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>Estabilizar Molécula</span>
        </button>

        <button
          onClick={() => {
            sounds.playBond();
            onOptimizeVSEPR();
          }}
          title="Relajar geometría molecular con fuerzas físicas VSEPR"
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-800/50 rounded-lg transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>VSEPR</span>
        </button>

        <button
          onClick={() => {
            sounds.playBond();
            onAddHydrogens();
          }}
          title="Saturar valencias libres con átomos de Hidrógeno"
          className="px-2 py-1.5 text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors"
        >
          +H₂
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onExport();
          }}
          title="Exportar archivo de coordenadas moleculares JSON"
          className="p-1.5 text-gray-400 hover:text-gray-200 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowHelp(!showHelp)}
          title="Ayuda y atajos para crear moléculas"
          className="p-1.5 text-gray-400 hover:text-gray-200 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Preset molecules dropdown */}
      {showPresets && (
        <div className="p-2 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
            Biblioteca de Estructuras
          </div>
          <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1">
            {PRESET_MOLECULES.map(mol => (
              <button
                key={mol.id}
                onClick={() => {
                  sounds.playBond();
                  onLoadPreset(mol.id);
                  setShowPresets(false);
                }}
                className="flex flex-col text-left p-2 rounded-lg hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-200">{mol.name.split('(')[0]}</span>
                <span className="text-[10px] text-sky-400 font-mono">{mol.formula}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ChemDraw Element Palette & Bond Order Selector */}
      <div className="p-2.5 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl space-y-2.5">
        {/* Element Selection */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1.5">
            <span>Paleta de Elementos (ChemDraw)</span>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenPeriodicTable();
              }}
              className="text-[10px] text-sky-400 hover:text-sky-300 font-normal hover:underline flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>Tabla Completa</span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {COMMON_BUILDER_ELEMENTS.map(sym => {
              const el = ELEMENTS[sym];
              const isSelected = selectedElement === sym;
              return (
                <button
                  key={sym}
                  onClick={() => {
                    sounds.playClick();
                    onSelectElement(sym);
                    onAddAtom(sym);
                  }}
                  title={`${el?.name} (Z=${el?.atomicNumber})`}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-950/80 shadow-sm shadow-sky-500/30'
                      : 'border-gray-800 bg-gray-950/60 hover:bg-gray-800/80'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full mb-0.5 border border-black/30"
                    style={{ backgroundColor: el?.cpkColor || '#fff' }}
                  />
                  <span className="text-xs font-bold text-gray-200">{sym}</span>
                  <span className="text-[9px] text-gray-400 font-mono">{el?.atomicNumber}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bond Type / Multiplicity selector */}
        <div>
          <div className="text-[11px] font-semibold text-gray-400 mb-1.5">
            Tipo de Enlace
          </div>
          <div className="grid grid-cols-4 gap-1 p-1 bg-gray-950/80 border border-gray-800 rounded-lg">
            <button
              onClick={() => {
                sounds.playClick();
                onChangeBondOrder(1);
              }}
              className={`py-1 text-xs font-medium rounded transition-colors ${
                activeBondOrder === 1 ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Simple —
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onChangeBondOrder(2);
              }}
              className={`py-1 text-xs font-medium rounded transition-colors ${
                activeBondOrder === 2 ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Doble =
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onChangeBondOrder(3);
              }}
              className={`py-1 text-xs font-medium rounded transition-colors ${
                activeBondOrder === 3 ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Triple ≡
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onChangeBondOrder(0.5);
              }}
              className={`py-1 text-xs font-medium rounded transition-colors ${
                activeBondOrder === 0.5 ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Puente H ··
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-800">
          <button
            onClick={() => {
              sounds.playClick();
              onAddAtom(selectedElement);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-100 bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar {selectedElement}</span>
          </button>

          {hasSelection && (
            <button
              onClick={() => {
                sounds.playDelete();
                onDeleteSelected();
              }}
              title="Borrar átomo seleccionado"
              className="flex items-center justify-center p-2 text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => {
              sounds.playDelete();
              onClear();
            }}
            title="Limpiar lienzo molecular"
            className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-200 bg-gray-800/60 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ChemDraw VR Quick Help card */}
      {showHelp && (
        <div className="p-3 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl text-xs space-y-1.5 text-gray-300">
          <div className="font-semibold text-sky-400">Cómo interactuar y crear:</div>
          <p>• <strong>Estabilizar:</strong> Haz clic en &quot;Estabilizar Molécula&quot; para arreglar la geometría y valencias automáticamente.</p>
          <p>• <strong>Leyes Físicas:</strong> Si intentas agregar enlaces que violan la valencia del elemento, la app aplicará restricciones físicas.</p>
          <p>• <strong>Anuncio de Estabilidad:</strong> Mira la barra superior para saber si la molécula es estable o no puede existir.</p>
        </div>
      )}
    </div>
  );
};
