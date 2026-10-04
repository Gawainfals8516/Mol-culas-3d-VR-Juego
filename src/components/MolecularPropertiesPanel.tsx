import React, { useState } from 'react';
import { Molecule3D } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';
import { computeMolecularProperties } from '../utils/vsepr';
import { computeExternalFieldEffects } from '../utils/quantumEngine';
import { ExternalFieldsConfig } from '../types/chemistry';
import { sounds } from '../utils/audio';
import { 
  Activity, 
  Compass, 
  Weight, 
  ChevronDown, 
  ChevronUp, 
  Atom,
  Flame,
  Zap,
  Radio
} from 'lucide-react';

interface MolecularPropertiesPanelProps {
  molecule: Molecule3D;
  selectedAtomId?: string | null;
  externalFields?: ExternalFieldsConfig;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const MolecularPropertiesPanel: React.FC<MolecularPropertiesPanelProps> = ({
  molecule,
  selectedAtomId,
  externalFields,
  isOpen,
  onToggleOpen
}) => {
  const [energyUnit, setEnergyUnit] = useState<'kJ' | 'kcal'>('kJ');
  const [showBondBreakdown, setShowBondBreakdown] = useState(false);

  const props = computeMolecularProperties(molecule.atoms, molecule.bonds);
  const selectedAtom = molecule.atoms.find(a => a.id === selectedAtomId);
  const selectedElem = selectedAtom ? ELEMENTS[selectedAtom.symbol] : null;

  const fieldEffects = externalFields
    ? computeExternalFieldEffects(molecule.atoms, molecule.bonds, externalFields)
    : null;

  return (
    <div className="absolute top-16 left-4 md:left-[23rem] z-20 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)] pointer-events-auto transition-all duration-200">
      {/* Main Panel Container */}
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Panel Header */}
        <div 
          onClick={() => {
            sounds.playClick();
            onToggleOpen();
          }}
          className="flex items-center justify-between px-3.5 py-2.5 bg-gray-950/80 border-b border-gray-800/80 cursor-pointer hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-gray-100 tracking-wide">Propiedades Físico-Cuánticas</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Cálculo físico en tiempo real" />
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-[10px] font-mono text-sky-400 mr-1">{props.formula}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {/* Collapsed State Summary Bar */}
        {!isOpen && (
          <div 
            onClick={() => {
              sounds.playClick();
              onToggleOpen();
            }}
            className="px-3.5 py-2 text-[11px] text-gray-300 grid grid-cols-3 gap-2 font-mono tabular-nums cursor-pointer bg-gray-900/70 hover:bg-gray-800/40 transition-colors"
          >
            <div>
              <span className="text-[9px] text-gray-500 block">Masa:</span>
              <span className="font-semibold text-gray-200">{props.molecularWeight.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 block">Dipolo:</span>
              <span className="font-semibold" style={{ color: props.dipoleColor }}>{props.dipoleDebye} D</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 block">Energía:</span>
              <span className="font-semibold text-amber-300">{props.totalBondEnergyKJ} kJ</span>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isOpen && (
          <div className="p-3.5 space-y-3.5 text-xs text-gray-300 max-h-[75vh] overflow-y-auto">
            {/* 1. MOLECULAR WEIGHT & FORMULA CARD */}
            <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Weight className="w-3.5 h-3.5 text-sky-400" />
                  <span>Masa Molecular Estimada</span>
                </div>
                <span className="text-[10px] text-gray-500">Molar</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-xl font-bold text-gray-100">{props.molecularWeight.toFixed(3)}</span>
                  <span className="text-xs text-gray-400">g/mol</span>
                </div>
                <div className="text-right text-[11px] font-mono text-sky-400">
                  {props.formula}
                </div>
              </div>
            </div>

            {/* 2. QUANTUM POLARITY & DIPOLE MOMENT */}
            <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Momento Dipolar Cuántico</span>
                </div>
                <span 
                  className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                  style={{ 
                    color: props.dipoleColor, 
                    borderColor: `${props.dipoleColor}40`,
                    backgroundColor: `${props.dipoleColor}15`
                  }}
                >
                  {props.dipoleCategory}
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono tabular-nums">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold" style={{ color: props.dipoleColor }}>
                    {props.dipoleDebye.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">Debye (D)</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  {(props.dipoleDebye * 3.33564).toFixed(1)} × 10⁻³⁰ C·m
                </span>
              </div>
            </div>

            {/* 3. EXTERNAL FIELD EFFECTS (Stark, Zeeman, Larmor) */}
            {fieldEffects && (
              <div className="p-2.5 bg-gray-950/70 border border-amber-900/40 rounded-xl space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold font-sans">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Efectos de Campo Cuántico
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Desplazamiento Stark:</span>
                  <span className="text-amber-300">{fieldEffects.starkEnergyShiftEv} eV</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Desdoblamiento Zeeman:</span>
                  <span className="text-emerald-400">{fieldEffects.zeemanSplittingEv} eV</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Frecuencia de Larmor:</span>
                  <span className="text-sky-300">{fieldEffects.larmorPrecessionFreq} GHz</span>
                </div>
              </div>
            )}

            {/* 4. BOND ENTHALPY */}
            <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Energía Total de Enlaces</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between font-mono tabular-nums">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-amber-300">
                    {energyUnit === 'kJ' 
                      ? props.totalBondEnergyKJ.toLocaleString() 
                      : props.totalBondEnergyKcal.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {energyUnit === 'kJ' ? 'kJ/mol' : 'kcal/mol'}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. ATOMIC RADII & STRUCTURAL DESCRIPTORS */}
            <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Atom className="w-3.5 h-3.5 text-emerald-400" />
                <span>Descriptores Estructurales</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-center font-mono tabular-nums">
                <div className="p-1.5 bg-gray-900/80 rounded-lg border border-gray-800/80">
                  <div className="text-[9px] text-gray-500 uppercase">Volumen VdW</div>
                  <div className="text-xs font-semibold text-gray-200">{props.vanDerWaalsVolume} Å³</div>
                </div>
                <div className="p-1.5 bg-gray-900/80 rounded-lg border border-gray-800/80">
                  <div className="text-[9px] text-gray-500 uppercase">Área Polar TPSA</div>
                  <div className="text-xs font-semibold text-sky-300">{props.polarSurfaceAreaEstimate} Å²</div>
                </div>
              </div>
            </div>

            {/* Selected Atom Details */}
            {selectedAtom && selectedElem && (
              <div className="p-2.5 bg-gray-950/70 border border-sky-900/50 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-sky-400">
                  <span>Átomo Seleccionado:</span>
                  <span className="font-mono font-bold text-gray-100">{selectedElem.name} ({selectedElem.symbol})</span>
                </div>
                <div className="text-[10px] text-gray-400 grid grid-cols-2 gap-1 font-mono tabular-nums">
                  <div>Radio Atómico: {selectedElem.atomicRadius} Å</div>
                  <div>Radio VdW: {selectedElem.vdwRadius} Å</div>
                  <div>Electronegatividad: {selectedElem.electronegativity}</div>
                  <div>Ionización: {selectedElem.firstIonizationEnergy} eV</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
