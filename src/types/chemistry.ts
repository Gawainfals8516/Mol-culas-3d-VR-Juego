export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  cpkColor: string; // Hex color
  covalentRadius: number; // in Angstroms
  vdwRadius: number;
  maxBonds: number;
  electronegativity: number;
  category: 'nonmetal' | 'noble-gas' | 'alkali' | 'alkaline' | 'metalloid' | 'halogen' | 'transition';
  electronConfig: string;
}

export interface Atom3D {
  id: string;
  symbol: string;
  x: number;
  y: number;
  z: number;
  charge?: number;
  formalCharge?: number;
  hybridization?: 'sp' | 'sp2' | 'sp3' | 'dsp3' | 'd2sp3';
  fixed?: boolean;
}

export interface Bond3D {
  id: string;
  atom1Id: string;
  atom2Id: string;
  order: 1 | 2 | 3 | 0.5; // 0.5 for hydrogen bond
}

export interface Molecule3D {
  id: string;
  name: string;
  formula: string;
  description: string;
  category: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
}

export type ViewMode = 'ball-and-stick' | 'space-filling' | 'wireframe' | 'density-surface';

export type VRMode = 'none' | 'cardboard' | 'gyro360' | 'webxr';

export type ZoomLevel = 'macro' | 'molecular' | 'atomic' | 'quantum';

export interface QuantumParticle {
  id: string;
  type: 'electron' | 'positron' | 'up-quark' | 'down-quark' | 'gluon' | 'photon' | 'higgs';
  position: [number, number, number];
  velocity: [number, number, number];
  charge: number;
  color: string;
  life: number;
  maxLife: number;
}
