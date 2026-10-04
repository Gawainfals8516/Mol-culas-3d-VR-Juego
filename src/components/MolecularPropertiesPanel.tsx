import React, { useState } from 'react';
import { Molecule3D } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';
import { computeMolecularProperties } from '../utils/vsepr';
import { sounds } from '../utils/audio';
import { 
  Activity, 
  Zap, 
  Compass, 
  Weight, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Maximize2,
  Atom,
  Flame
} from 'lucide-react';

interface MolecularPropertiesPanelProps {
  molecule: Molecule3D;
  selectedAtomId?: string | null;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const MolecularPropertiesPanel: React.FC<MolecularPropertiesPanelProps> = ({
  molecule,
  selectedAtomId,
  isOpen,
  onToggleOpen
}) => {
  const [energyUnit, setEnergyUnit] = useState<'kJ' | 'kcal'>('kJ');
  const [showBondBreakdown, setShowBondBreakdown] = useState(false);

  const props = computeMolecularProperties(molecule.atoms, molecule.bonds);
  const selectedAtom = molecule.atoms.find(a => a.id === selectedAtomId);
  const selectedElem = selectedAtom ? ELEMENTS[selectedAtom.symbol] : null;

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
            <span className="text-xs font-bold text-gray-100 tracking-wide">Propiedades Moleculares</span>
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

        {/* Expanded Full Physical Properties Content */}
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
              <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-800/80 pt-1 font-mono tabular-nums">
                <span>{molecule.atoms.length} núcleos atómicos</span>
                <span>{props.totalValenceElectrons} e⁻ de valencia</span>
              </div>
            </div>

            {/* 2. POLARITY & DIPOLE MOMENT CARD */}
            <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Momento Dipolar & Polaridad</span>
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

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-xl font-bold" style={{ color: props.dipoleColor }}>
                    {props.dipoleDebye.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">Debye (D)</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono tabular-nums">
                  {(props.dipoleDebye * 3.33564).toFixed(1)} × 10⁻³⁰ C·m
                </span>
              </div>

              {/* Polarity Spectrum Bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (props.dipoleDebye / 4) * 100)}%`,
                      backgroundColor: props.dipoleColor
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                  <span>0 D (Apolar)</span>
                  <span>1.85 D (Agua)</span>
                  <span>4+ D (Iónico)</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-800/80 pt-1.5">
                {props.dipoleDescription}
              </p>
            </div>

            {/* 3. TOTAL BOND ENERGY / ENTHALPY CARD */}
            <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Energía Total de Enlaces</span>
                </div>
                <div className="flex items-center p-0.5 bg-gray-900 border border-gray-800 rounded-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnergyUnit('kJ');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
                      energyUnit === 'kJ' ? 'bg-amber-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    kJ/mol
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnergyUnit('kcal');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
                      energyUnit === 'kcal' ? 'bg-amber-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    kcal/mol
                  </button>
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
                <span className="text-[10px] text-gray-400">
                  Promedio: {props.averageBondEnergyKJ} kJ/enlace
                </span>
              </div>

              {/* Expandable Breakdown of bond contributions */}
              {props.bondBreakdown.length > 0 && (
                <div className="border-t border-gray-800/80 pt-1.5">
                  <button
                    onClick={() => setShowBondBreakdown(!showBondBreakdown)}
                    className="flex items-center justify-between w-full text-[10px] text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>Desglose por Tipo de Enlace ({props.bondBreakdown.length})</span>
                    {showBondBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showBondBreakdown && (
                    <div className="mt-1.5 space-y-1 max-h-36 overflow-y-auto pr-1">
                      {props.bondBreakdown.map((b, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between text-[10px] p-1 bg-gray-900/60 rounded border border-gray-800/60 font-mono tabular-nums"
                        >
                          <span className="text-gray-200 font-bold">{b.label}</span>
                          <span className="text-gray-400">× {b.count}</span>
                          <span className="text-amber-400">
                            {energyUnit === 'kJ' ? `${b.totalEnergy} kJ` : `${Math.round(b.totalEnergy / 4.184)} kcal`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. BIOPHYSICAL & STRUCTURAL DESCRIPTORS */}
            <div className="p-2.5 bg-gray-950/70 border border-gray-800 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Atom className="w-3.5 h-3.5 text-emerald-400" />
                <span>Descriptores Estructurales & Biofísicos</span>
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
                <div className="p-1.5 bg-gray-900/80 rounded-lg border border-gray-800/80">
                  <div className="text-[9px] text-gray-500 uppercase">Donadores H (HBD)</div>
                  <div className="text-xs font-semibold text-emerald-300">{props.hBondDonors}</div>
                </div>
                <div className="p-1.5 bg-gray-900/80 rounded-lg border border-gray-800/80">
                  <div className="text-[9px] text-gray-500 uppercase">Aceptores H (HBA)</div>
                  <div className="text-xs font-semibold text-indigo-300">{props.hBondAcceptors}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-800/80 pt-1.5 font-mono tabular-nums">
                <span>Enlaces Rotables:</span>
                <span className="font-semibold text-gray-200">{props.rotatableBondsCount}</span>
              </div>
            </div>

            {/* Functional groups summary if detected */}
            {props.functionalGroups.length > 0 && (
              <div className="pt-1">
                <div className="text-[10px] text-gray-400 font-semibold mb-1">Grupos Funcionales Activos:</div>
                <div className="flex flex-wrap gap-1">
                  {props.functionalGroups.map((g, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 bg-sky-950/60 text-sky-300 border border-sky-800/50 rounded-md font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SELECTED ATOM DETAILS (if any) */}
            {selectedAtom && selectedElem && (
              <div className="p-2.5 bg-gray-950/70 border border-sky-900/50 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-sky-400">
                  <span>Átomo Seleccionado en VR:</span>
                  <span className="font-mono font-bold text-gray-100">{selectedElem.name} ({selectedElem.symbol})</span>
                </div>
                <div className="text-[10px] text-gray-400 grid grid-cols-2 gap-1 font-mono tabular-nums">
                  <div>Número Atómico: Z={selectedElem.atomicNumber}</div>
                  <div>Electronegatividad: {selectedElem.electronegativity}</div>
                  <div>Coord: ({selectedAtom.x.toFixed(1)}, {selectedAtom.y.toFixed(1)}, {selectedAtom.z.toFixed(1)})</div>
                  <div>Config: {selectedElem.electronConfig}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
