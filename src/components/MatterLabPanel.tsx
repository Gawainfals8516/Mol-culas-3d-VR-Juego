import React from 'react';
import { ExternalFieldsConfig, MolecularOrbitalType, ZoomLevel } from '../types/chemistry';
import { sounds } from '../utils/audio';
import { 
  Zap, 
  Orbit, 
  Atom, 
  Waves, 
  Flame, 
  Sparkles,
  Compass,
  Sliders,
  Eye
} from 'lucide-react';

interface MatterLabPanelProps {
  zoomLevel: ZoomLevel;
  onChangeZoomLevel: (zoom: ZoomLevel) => void;
  activeOrbital: string;
  onChangeOrbital: (orbital: string) => void;
  selectedMolecularOrbital: MolecularOrbitalType;
  onChangeMolecularOrbital: (mo: MolecularOrbitalType) => void;
  showMolecularOrbital: boolean;
  onToggleMolecularOrbital: () => void;
  showIntermolecularForces: boolean;
  onToggleIntermolecularForces: () => void;
  externalFields: ExternalFieldsConfig;
  onChangeExternalFields: (fields: ExternalFieldsConfig) => void;
  higgsFieldStrength: number;
  onChangeHiggsStrength: (val: number) => void;
  onInjectEnergy: () => void;
  onSynthesizeProton: () => void;
  matterCreatedCount: number;
}

export const MatterLabPanel: React.FC<MatterLabPanelProps> = ({
  zoomLevel,
  onChangeZoomLevel,
  activeOrbital,
  onChangeOrbital,
  selectedMolecularOrbital,
  onChangeMolecularOrbital,
  showMolecularOrbital,
  onToggleMolecularOrbital,
  showIntermolecularForces,
  onToggleIntermolecularForces,
  externalFields,
  onChangeExternalFields,
  higgsFieldStrength,
  onChangeHiggsStrength,
  onInjectEnergy,
  onSynthesizeProton,
  matterCreatedCount
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 max-w-xs pointer-events-auto">
      {/* Zoom Scale Selector (Macromolecular -> Molecular -> Atómico -> Cuántico) */}
      <div className="p-2.5 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl">
        <div className="text-[11px] font-semibold text-gray-400 mb-2 flex items-center justify-between">
          <span>Escala de Observación</span>
          <span className="text-[10px] text-sky-400 font-mono">
            {zoomLevel === 'macro' && '10⁻⁸ m (Bio)'}
            {zoomLevel === 'molecular' && '10⁻¹⁰ m (Å)'}
            {zoomLevel === 'atomic' && '10⁻¹² m (pm)'}
            {zoomLevel === 'quantum' && '10⁻¹⁵ m (fm)'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 p-1 bg-gray-950/80 border border-gray-800 rounded-lg">
          <button
            onClick={() => onChangeZoomLevel('macro')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              zoomLevel === 'macro' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Macro
          </button>
          <button
            onClick={() => onChangeZoomLevel('molecular')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              zoomLevel === 'molecular' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Molécula
          </button>
          <button
            onClick={() => onChangeZoomLevel('atomic')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              zoomLevel === 'atomic' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Orbitales
          </button>
          <button
            onClick={() => onChangeZoomLevel('quantum')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              zoomLevel === 'quantum' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Campos
          </button>
        </div>
      </div>

      {/* Molecular Orbitals & External Fields (Molecular or Macro scale) */}
      {(zoomLevel === 'molecular' || zoomLevel === 'macro') && (
        <div className="p-3 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-400">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-400" />
              Orbitales Moleculares (LCAO)
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                onToggleMolecularOrbital();
              }}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
                showMolecularOrbital
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-200'
              }`}
            >
              {showMolecularOrbital ? 'Ocultar' : 'Ver MO'}
            </button>
          </div>

          {showMolecularOrbital && (
            <div className="grid grid-cols-2 gap-1 pt-1">
              {[
                { id: 'HOMO', label: 'HOMO' },
                { id: 'LUMO', label: 'LUMO' },
                { id: 'sigma-bonding', label: 'Sigma σ' },
                { id: 'pi-bonding', label: 'Pi π' }
              ].map(mo => (
                <button
                  key={mo.id}
                  onClick={() => {
                    sounds.playBond();
                    onChangeMolecularOrbital(mo.id as MolecularOrbitalType);
                  }}
                  className={`py-1 px-2 text-[10px] font-bold rounded border transition-colors ${
                    selectedMolecularOrbital === mo.id
                      ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                      : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {mo.label}
                </button>
              ))}
            </div>
          )}

          {/* External Electric / Magnetic Field Sliders */}
          <div className="border-t border-gray-800/80 pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Campos Exteriores (Stark / Zeeman)
              </span>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between text-gray-300">
                <span>Campo Eléctrico E_z:</span>
                <span className="font-mono text-amber-300">{externalFields.electricField[2]} kV/cm</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={externalFields.electricField[2]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeExternalFields({
                    ...externalFields,
                    electricField: [0, 0, val]
                  });
                }}
                className="w-full h-1 bg-gray-800 rounded appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between text-gray-300">
                <span>Campo Magnético B_z:</span>
                <span className="font-mono text-emerald-400">{externalFields.magneticField[2]} Tesla</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={externalFields.magneticField[2]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeExternalFields({
                    ...externalFields,
                    magneticField: [0, 0, val]
                  });
                }}
                className="w-full h-1 bg-gray-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Intermolecular Forces Toggle */}
          <div className="border-t border-gray-800/80 pt-2 flex items-center justify-between">
            <span className="text-[11px] text-gray-300">Fuerzas Intermoleculares:</span>
            <button
              onClick={() => {
                sounds.playClick();
                onToggleIntermolecularForces();
              }}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
                showIntermolecularForces
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {showIntermolecularForces ? 'Visibles' : 'Ocultas'}
            </button>
          </div>
        </div>
      )}

      {/* Atomic Orbitals Exploration (when zoom === 'atomic') */}
      {zoomLevel === 'atomic' && (
        <div className="p-3 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <Orbit className="w-4 h-4" />
            <span>Nubes Cuánticas de Probabilidad |ψ|²</span>
          </div>

          <div className="text-[11px] text-gray-400 leading-relaxed">
            Representación 3D de las funciones de onda de Schrödinger. Las partículas cyan representan fase positiva y rojo fase negativa.
          </div>

          <div className="grid grid-cols-4 gap-1">
            {[
              { id: '1s', label: '1s', desc: 'n=1, l=0' },
              { id: '2s', label: '2s', desc: 'n=2, l=0' },
              { id: '2p', label: '2p_z', desc: 'n=2, l=1' },
              { id: '3d', label: '3d_z²', desc: 'n=3, l=2' }
            ].map(orb => (
              <button
                key={orb.id}
                onClick={() => {
                  sounds.playBond();
                  onChangeOrbital(orb.id);
                }}
                className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                  activeOrbital === orb.id
                    ? 'border-sky-500 bg-sky-950/80 text-white font-bold'
                    : 'border-gray-800 bg-gray-950/60 text-gray-300 hover:bg-gray-800/80'
                }`}
              >
                <span className="text-xs">{orb.label}</span>
                <span className="text-[9px] text-gray-400 font-mono">{orb.desc}</span>
              </button>
            ))}
          </div>

          <div className="pt-1 text-[11px] text-gray-400 border-t border-gray-800 flex justify-between">
            <span>Núcleo Central:</span>
            <span className="text-amber-400 font-mono">Protones + Neutrones</span>
          </div>
        </div>
      )}

      {/* Quantum Fields & Matter Genesis (when zoom === 'quantum') */}
      {zoomLevel === 'quantum' && (
        <div className="p-3 bg-gray-900/90 backdrop-blur-md border border-indigo-900/50 rounded-xl shadow-xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
            <div className="flex items-center gap-1.5">
              <Waves className="w-4 h-4" />
              <span>Génesis de la Materia</span>
            </div>
            <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/50">
              E = mc²
            </span>
          </div>

          <div className="text-[11px] text-gray-400 leading-relaxed">
            En el vacío cuántico de Dirac, los campos de energía oscilan. Al concentrar suficiente energía, nacen pares materia-antimateria.
          </div>

          {/* Higgs Field Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-300">Condensado de Higgs (Masa):</span>
              <span className="text-indigo-400 font-mono">{(higgsFieldStrength * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={higgsFieldStrength}
              onChange={(e) => onChangeHiggsStrength(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Creation Actions */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => {
                sounds.playQuantumZap();
                onInjectEnergy();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-amber-100 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-lg shadow-amber-600/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Inyectar Energía (Crear Par e⁻ / e⁺)</span>
            </button>

            <button
              onClick={() => {
                sounds.playBond();
                onSynthesizeProton();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-100 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Sintetizar Protón (Quarks uud)</span>
            </button>
          </div>

          {matterCreatedCount > 0 && (
            <div className="flex items-center justify-between p-2 bg-indigo-950/60 border border-indigo-800/40 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Partículas Creadas:</span>
              </div>
              <span className="font-mono font-bold text-amber-300">{matterCreatedCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
