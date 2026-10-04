import React from 'react';
import { X, Smartphone, Glasses, Compass, Hand, Atom } from 'lucide-react';

interface VRGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchCardboard: () => void;
}

export const VRGuideModal: React.FC<VRGuideModalProps> = ({
  isOpen,
  onClose,
  onLaunchCardboard
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sky-400">
            <Glasses className="w-5 h-5" />
            <h2 className="text-base font-bold text-gray-100">Guía de Realidad Virtual para Android</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-3.5 text-xs text-gray-300">
          <div className="flex items-start gap-3 p-3 bg-gray-950/60 rounded-xl border border-gray-800/80">
            <Smartphone className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-200">1. Compatibilidad Total con Android y Móviles</div>
              <p className="text-gray-400 mt-0.5 leading-relaxed">
                Funciona en cualquier navegador Chrome de Android. No requiere instalar apps externas: utiliza la API de Orientación del Giroscopio y pantalla estereoscópica dual.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-950/60 rounded-xl border border-gray-800/80">
            <Glasses className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-200">2. Modo Google Cardboard / VR Box</div>
              <p className="text-gray-400 mt-0.5 leading-relaxed">
                Al activar el modo VR, la pantalla se divide en dos ojos. Coloca el teléfono dentro de tus gafas Cardboard o visor VR. Usa la barra superior para calibrar la distancia interpupilar (IPD).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-950/60 rounded-xl border border-gray-800/80">
            <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-200">3. Control con Mirilla (Gaze Pointer) y Toque</div>
              <p className="text-gray-400 mt-0.5 leading-relaxed">
                Mueve tu cabeza en 360° para apuntar con la mira central hacia los átomos. Al mantener la vista sobre un átomo por 1.1s se seleccionará automáticamente. También puedes presionar el botón de Cardboard o tocar la pantalla.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-950/60 rounded-xl border border-gray-800/80">
            <Atom className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-200">4. Modo Creador ChemDraw & Física VSEPR</div>
              <p className="text-gray-400 mt-0.5 leading-relaxed">
                Crea enlaces simples, dobles o triples entre átomos. Presiona &quot;VSEPR 3D&quot; para que la física repulsiva de electrones organice los orbitales en tetraedros y planos realistas.
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 rounded-xl transition-colors"
          >
            Entendido
          </button>
          <button
            onClick={() => {
              onClose();
              onLaunchCardboard();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors shadow-lg shadow-sky-600/20"
          >
            <Glasses className="w-4 h-4" />
            <span>Probar Modo VR Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
