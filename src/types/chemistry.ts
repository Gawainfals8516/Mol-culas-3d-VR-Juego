export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  cpkColor: string; // Hex color
  atomicRadius: number; // in Angstroms (calculated/empirical atomic radius)
  covalentRadius: number; // in Angstroms
  vdwRadius: number; // Van der Waals radius
  maxBonds: number;
  electronegativity: number; // Pauling scale
  category: 'nonmetal' | 'noble-gas' | 'alkali' | 'alkaline' | 'metalloid' | 'halogen' | 'transition';
  electronConfig: string;
  firstIonizationEnergy: number; // in eV
  electronAffinity: number; // in eV
  polarizability: number; // in Å³ (volume polarizability)
}

export interface Atom3D {
  id: string;
  symbol: string;
  x: number;
  y: number;
  z: number;
  charge?: number; // Net charge
  formalCharge?: number;
  partialCharge?: number; // Quantum partial atomic charge (e.g. Mulliken/ESP)
  hybridization?: 's' | 'sp' | 'sp2' | 'sp3' | 'dsp3' | 'd2sp3';
  fixed?: boolean;
  velocity?: [number, number, number]; // [vx, vy, vz] for dynamics
}

export interface Bond3D {
  id: string;
  atom1Id: string;
  atom2Id: string;
  order: 1 | 2 | 3 | 0.5; // 0.5 for hydrogen bond or aromatic partial bond
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

export type ViewMode = 'ball-and-stick' | 'space-filling' | 'wireframe' | 'density-surface' | 'atomic-radii';

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

// Quantum Molecular Orbital Types
export type MolecularOrbitalType = 'HOMO' | 'LUMO' | 'HOMO-1' | 'LUMO+1' | 'sigma-bonding' | 'sigma-antibonding' | 'pi-bonding' | 'pi-antibonding';

export interface MolecularOrbitalData {
  type: MolecularOrbitalType;
  energyEv: number; // Orbital energy level in eV
  description: string;
  isOccupied: boolean;
  nodesCount: number;
}

// External Physical Field Configuration
export interface ExternalFieldsConfig {
  electricField: [number, number, number]; // Electric field vector E (in kV/cm)
  magneticField: [number, number, number]; // Magnetic field vector B (in Tesla)
  temperatureK: number; // Thermal noise / Brownian motion temperature
}

// Intermolecular force interaction between neighboring molecules / elements
export interface IntermolecularInteraction {
  atom1Id: string;
  atom2Id: string;
  distance: number; // in Angstroms
  type: 'van-der-waals' | 'hydrogen-bond' | 'coulomb-repulsion' | 'coulomb-attraction';
  energyKcal: number;
  forceVector: [number, number, number]; // force on atom1
}

// Quantum AI Model State and Training Statistics
export interface QuantumAIState {
  isTraining: boolean;
  trainingEpochs: number;
  lossHistory: number[];
  accuracy: number;
  predictedHomoLumoGapEv: number; // in eV
  predictedDipole: number; // in Debye
  modelStatus: 'untrained' | 'training' | 'trained';
}

// Chemical Reaction Data Types
export interface ChemicalReactionStep {
  stepName: string;
  description: string;
  molecule: Molecule3D; // 3D Molecular snapshot for this step
  energyKcal: number; // Relative potential energy along reaction coordinate
}

export interface ChemicalReaction {
  id: string;
  title: string;
  equation: string; // e.g. "CH4 + 2 O2 -> CO2 + 2 H2O"
  type: 'Combustión' | 'Síntesis / Adición' | 'S_N2 Sustitución' | 'Neutralización Ácido-Base' | 'Óxido-Reducción';
  description: string;
  activationEnergyKcal: number; // E_a
  enthalpyKcal: number; // Delta H
  isExothermic: boolean;
  steps: ChemicalReactionStep[]; // Reactants -> Transition State -> Products
}
