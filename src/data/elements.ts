import { ElementData } from '../types/chemistry';

export const ELEMENTS: Record<string, ElementData> = {
  H: {
    symbol: 'H',
    name: 'Hidrógeno',
    atomicNumber: 1,
    atomicMass: 1.008,
    cpkColor: '#FFFFFF',
    covalentRadius: 0.31,
    vdwRadius: 1.2,
    maxBonds: 1,
    electronegativity: 2.2,
    category: 'nonmetal',
    electronConfig: '1s¹'
  },
  He: {
    symbol: 'He',
    name: 'Helio',
    atomicNumber: 2,
    atomicMass: 4.0026,
    cpkColor: '#D9FFFF',
    covalentRadius: 0.28,
    vdwRadius: 1.4,
    maxBonds: 0,
    electronegativity: 0,
    category: 'noble-gas',
    electronConfig: '1s²'
  },
  C: {
    symbol: 'C',
    name: 'Carbono',
    atomicNumber: 6,
    atomicMass: 12.011,
    cpkColor: '#374151', // Dark graphite
    covalentRadius: 0.76,
    vdwRadius: 1.7,
    maxBonds: 4,
    electronegativity: 2.55,
    category: 'nonmetal',
    electronConfig: '[He] 2s² 2p²'
  },
  N: {
    symbol: 'N',
    name: 'Nitrógeno',
    atomicNumber: 7,
    atomicMass: 14.007,
    cpkColor: '#2563EB', // Blue
    covalentRadius: 0.71,
    vdwRadius: 1.55,
    maxBonds: 3,
    electronegativity: 3.04,
    category: 'nonmetal',
    electronConfig: '[He] 2s² 2p³'
  },
  O: {
    symbol: 'O',
    name: 'Oxígeno',
    atomicNumber: 8,
    atomicMass: 15.999,
    cpkColor: '#EF4444', // Red
    covalentRadius: 0.66,
    vdwRadius: 1.52,
    maxBonds: 2,
    electronegativity: 3.44,
    category: 'nonmetal',
    electronConfig: '[He] 2s² 2p⁴'
  },
  F: {
    symbol: 'F',
    name: 'Flúor',
    atomicNumber: 9,
    atomicMass: 18.998,
    cpkColor: '#10B981', // Green
    covalentRadius: 0.57,
    vdwRadius: 1.47,
    maxBonds: 1,
    electronegativity: 3.98,
    category: 'halogen',
    electronConfig: '[He] 2s² 2p⁵'
  },
  Na: {
    symbol: 'Na',
    name: 'Sodio',
    atomicNumber: 11,
    atomicMass: 22.99,
    cpkColor: '#8B5CF6', // Purple
    covalentRadius: 1.66,
    vdwRadius: 2.27,
    maxBonds: 1,
    electronegativity: 0.93,
    category: 'alkali',
    electronConfig: '[Ne] 3s¹'
  },
  Mg: {
    symbol: 'Mg',
    name: 'Magnesio',
    atomicNumber: 12,
    atomicMass: 24.305,
    cpkColor: '#059669',
    covalentRadius: 1.41,
    vdwRadius: 1.73,
    maxBonds: 2,
    electronegativity: 1.31,
    category: 'alkaline',
    electronConfig: '[Ne] 3s²'
  },
  P: {
    symbol: 'P',
    name: 'Fósforo',
    atomicNumber: 15,
    atomicMass: 30.974,
    cpkColor: '#F97316', // Orange
    covalentRadius: 1.07,
    vdwRadius: 1.8,
    maxBonds: 5,
    electronegativity: 2.19,
    category: 'nonmetal',
    electronConfig: '[Ne] 3s² 3p³'
  },
  S: {
    symbol: 'S',
    name: 'Azufre',
    atomicNumber: 16,
    atomicMass: 32.06,
    cpkColor: '#EAB308', // Yellow
    covalentRadius: 1.05,
    vdwRadius: 1.8,
    maxBonds: 6,
    electronegativity: 2.58,
    category: 'nonmetal',
    electronConfig: '[Ne] 3s² 3p⁴'
  },
  Cl: {
    symbol: 'Cl',
    name: 'Cloro',
    atomicNumber: 17,
    atomicMass: 35.45,
    cpkColor: '#22C55E', // Light green
    covalentRadius: 1.02,
    vdwRadius: 1.75,
    maxBonds: 1,
    electronegativity: 3.16,
    category: 'halogen',
    electronConfig: '[Ne] 3s² 3p⁵'
  },
  K: {
    symbol: 'K',
    name: 'Potasio',
    atomicNumber: 19,
    atomicMass: 39.098,
    cpkColor: '#7C3AED',
    covalentRadius: 2.03,
    vdwRadius: 2.75,
    maxBonds: 1,
    electronegativity: 0.82,
    category: 'alkali',
    electronConfig: '[Ar] 4s¹'
  },
  Ca: {
    symbol: 'Ca',
    name: 'Calcio',
    atomicNumber: 20,
    atomicMass: 40.078,
    cpkColor: '#6B7280',
    covalentRadius: 1.76,
    vdwRadius: 2.31,
    maxBonds: 2,
    electronegativity: 1.0,
    category: 'alkaline',
    electronConfig: '[Ar] 4s²'
  },
  Fe: {
    symbol: 'Fe',
    name: 'Hierro',
    atomicNumber: 26,
    atomicMass: 55.845,
    cpkColor: '#D97706', // Rust orange
    covalentRadius: 1.32,
    vdwRadius: 2.0,
    maxBonds: 6,
    electronegativity: 1.83,
    category: 'transition',
    electronConfig: '[Ar] 3d⁶ 4s²'
  },
  Cu: {
    symbol: 'Cu',
    name: 'Cobre',
    atomicNumber: 29,
    atomicMass: 63.546,
    cpkColor: '#C2410C',
    covalentRadius: 1.22,
    vdwRadius: 1.4,
    maxBonds: 2,
    electronegativity: 1.9,
    category: 'transition',
    electronConfig: '[Ar] 3d¹⁰ 4s¹'
  },
  Br: {
    symbol: 'Br',
    name: 'Bromo',
    atomicNumber: 35,
    atomicMass: 79.904,
    cpkColor: '#991B1B', // Deep red
    covalentRadius: 1.2,
    vdwRadius: 1.85,
    maxBonds: 1,
    electronegativity: 2.96,
    category: 'halogen',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵'
  },
  I: {
    symbol: 'I',
    name: 'Yodo',
    atomicNumber: 53,
    atomicMass: 126.90,
    cpkColor: '#6B21A8', // Violet
    covalentRadius: 1.39,
    vdwRadius: 1.98,
    maxBonds: 1,
    electronegativity: 2.66,
    category: 'halogen',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵'
  },
  Au: {
    symbol: 'Au',
    name: 'Oro',
    atomicNumber: 79,
    atomicMass: 196.97,
    cpkColor: '#F59E0B', // Gold
    covalentRadius: 1.36,
    vdwRadius: 1.66,
    maxBonds: 4,
    electronegativity: 2.54,
    category: 'transition',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹'
  }
};

export const COMMON_BUILDER_ELEMENTS = ['C', 'H', 'O', 'N', 'P', 'S', 'F', 'Cl', 'Br', 'Fe'];
