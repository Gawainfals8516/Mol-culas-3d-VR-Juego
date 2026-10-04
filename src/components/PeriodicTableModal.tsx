import React, { useState } from 'react';
import { ELEMENTS } from '../data/elements';
import { sounds } from '../utils/audio';
import { X, Search } from 'lucide-react';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (symbol: string) => void;
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  onSelectElement
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const elementsList = Object.values(ELEMENTS).filter(el => 
    el.name.toLowerCase().includes(search.toLowerCase()) ||
    el.symbol.toLowerCase().includes(search.toLowerCase()) ||
    el.atomicNumber.toString().includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h2 className="text-base font-bold text-gray-100">Tabla Periódica de los Elementos</h2>
            <p className="text-xs text-gray-400">Selecciona un elemento para insertarlo en el lienzo molecular 3D</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-3 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, símbolo químico o número atómico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Elements Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {elementsList.map(el => (
            <button
              key={el.symbol}
              onClick={() => {
                sounds.playClick();
                onSelectElement(el.symbol);
                onClose();
              }}
              className="flex flex-col p-2.5 rounded-xl border border-gray-800 hover:border-sky-500 bg-gray-950/70 hover:bg-sky-950/40 text-left transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] text-gray-500 font-mono">Z={el.atomicNumber}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/30"
                  style={{ backgroundColor: el.cpkColor }}
                />
              </div>
              <span className="text-lg font-bold text-gray-100 group-hover:text-sky-400 transition-colors">
                {el.symbol}
              </span>
              <span className="text-xs text-gray-300 font-medium truncate">{el.name}</span>
              <span className="text-[10px] text-gray-400 font-mono mt-0.5">{el.atomicMass.toFixed(2)} u</span>
              <span className="text-[9px] text-sky-400/80 font-mono truncate mt-1">{el.electronConfig}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
