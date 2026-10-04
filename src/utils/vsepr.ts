import { Atom3D, Bond3D } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';

/**
 * Real-time 3D Molecular Mechanics & VSEPR relaxation engine.
 * Computes:
 * 1. Harmonic bond stretch force (Hooke's law towards covalent bond length)
 * 2. Coulomb / Van der Waals steric repulsion between non-bonded atoms
 * 3. Valence Shell Electron Pair Repulsion (VSEPR) bond-angle spring forces
 *    (e.g., sp³ 109.5°, sp² 120°, sp 180°)
 */
export function relaxMoleculeStep(
  atoms: Atom3D[],
  bonds: Bond3D[],
  draggedAtomId?: string | null,
  damping: number = 0.85
): Atom3D[] {
  if (atoms.length <= 1) return atoms;

  // Build adjacency graph
  const neighbors: Record<string, string[]> = {};
  atoms.forEach(a => { neighbors[a.id] = []; });
  bonds.forEach(b => {
    if (neighbors[b.atom1Id] && neighbors[b.atom2Id]) {
      neighbors[b.atom1Id].push(b.atom2Id);
      neighbors[b.atom2Id].push(b.atom1Id);
    }
  });

  // Calculate forces on each atom
  const forces: Record<string, { fx: number; fy: number; fz: number }> = {};
  atoms.forEach(a => { forces[a.id] = { fx: 0, fy: 0, fz: 0 }; });

  // 1. Bond spring forces
  const kBond = 1.2;
  bonds.forEach(bond => {
    const a1 = atoms.find(a => a.id === bond.atom1Id);
    const a2 = atoms.find(a => a.id === bond.atom2Id);
    if (!a1 || !a2) return;

    const dx = a2.x - a1.x;
    const dy = a2.y - a1.y;
    const dz = a2.z - a1.z;
    const dist = Math.hypot(dx, dy, dz) || 0.001;

    const r1 = ELEMENTS[a1.symbol]?.covalentRadius || 0.7;
    const r2 = ELEMENTS[a2.symbol]?.covalentRadius || 0.7;
    // Ideal bond length based on covalent radii and bond order
    const orderFactor = bond.order === 3 ? 0.85 : bond.order === 2 ? 0.92 : bond.order === 0.5 ? 1.6 : 1.0;
    const targetDist = (r1 + r2) * 1.4 * orderFactor;

    const delta = dist - targetDist;
    const forceMag = kBond * delta;

    const fx = (dx / dist) * forceMag;
    const fy = (dy / dist) * forceMag;
    const fz = (dz / dist) * forceMag;

    forces[a1.id].fx += fx;
    forces[a1.id].fy += fy;
    forces[a1.id].fz += fz;

    forces[a2.id].fx -= fx;
    forces[a2.id].fy -= fy;
    forces[a2.id].fz -= fz;
  });

  // 2. Non-bonded steric repulsion (Van der Waals)
  const kRepel = 0.4;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a1 = atoms[i];
      const a2 = atoms[j];
      const isBonded = neighbors[a1.id].includes(a2.id);

      const dx = a2.x - a1.x;
      const dy = a2.y - a1.y;
      const dz = a2.z - a1.z;
      const dist = Math.hypot(dx, dy, dz) || 0.001;

      const minSafeDist = isBonded ? 0.9 : 1.5;
      if (dist < minSafeDist) {
        const repelMag = kRepel / (dist * dist);
        const fx = (dx / dist) * repelMag;
        const fy = (dy / dist) * repelMag;
        const fz = (dz / dist) * repelMag;

        forces[a1.id].fx -= fx;
        forces[a1.id].fy -= fy;
        forces[a1.id].fz -= fz;

        forces[a2.id].fx += fx;
        forces[a2.id].fy += fy;
        forces[a2.id].fz += fz;
      }
    }
  }

  // 3. VSEPR Angular Repulsion: bonded neighbors of the same central atom repel each other
  const kAngle = 0.6;
  atoms.forEach(central => {
    const adj = neighbors[central.id];
    if (adj.length >= 2) {
      for (let i = 0; i < adj.length; i++) {
        for (let j = i + 1; j < adj.length; j++) {
          const n1 = atoms.find(a => a.id === adj[i]);
          const n2 = atoms.find(a => a.id === adj[j]);
          if (!n1 || !n2) return;

          const v1x = n1.x - central.x;
          const v1y = n1.y - central.y;
          const v1z = n1.z - central.z;
          const d1 = Math.hypot(v1x, v1y, v1z) || 1;

          const v2x = n2.x - central.x;
          const v2y = n2.y - central.y;
          const v2z = n2.z - central.z;
          const d2 = Math.hypot(v2x, v2y, v2z) || 1;

          // Ideal target angle based on steric number
          // 2 neighbors -> 180°, 3 -> 120°, 4 -> 109.5°
          let targetDot = -0.333; // ~109.5°
          if (adj.length === 2) targetDot = -0.99; // ~180°
          else if (adj.length === 3) targetDot = -0.5; // ~120°

          const dot = (v1x * v2x + v1y * v2y + v1z * v2z) / (d1 * d2);
          const angleDelta = dot - targetDot;

          if (Math.abs(angleDelta) > 0.05) {
            // Push n1 and n2 away or towards each other
            const pushX = (v2x / d2 - v1x / d1) * kAngle * angleDelta;
            const pushY = (v2y / d2 - v1y / d1) * kAngle * angleDelta;
            const pushZ = (v2z / d2 - v1z / d1) * kAngle * angleDelta;

            forces[n1.id].fx += pushX;
            forces[n1.id].fy += pushY;
            forces[n1.id].fz += pushZ;

            forces[n2.id].fx -= pushX;
            forces[n2.id].fy -= pushY;
            forces[n2.id].fz -= pushZ;
          }
        }
      }
    }
  });

  // Apply displacements with damping
  return atoms.map(a => {
    if (a.id === draggedAtomId || a.fixed) {
      return a;
    }
    const f = forces[a.id];
    // Clamp max movement per frame to prevent explosions
    const maxStep = 0.25;
    const moveX = Math.max(-maxStep, Math.min(maxStep, f.fx * 0.15 * damping));
    const moveY = Math.max(-maxStep, Math.min(maxStep, f.fy * 0.15 * damping));
    const moveZ = Math.max(-maxStep, Math.min(maxStep, f.fz * 0.15 * damping));

    return {
      ...a,
      x: a.x + moveX,
      y: a.y + moveY,
      z: a.z + moveZ
    };
  });
}

/**
 * Chemical formula calculation (Hill system: C, then H, then alphabetical)
 */
export function calculateChemicalFormula(atoms: Atom3D[]): string {
  if (atoms.length === 0) return 'Vacío';

  const counts: Record<string, number> = {};
  atoms.forEach(a => {
    counts[a.symbol] = (counts[a.symbol] || 0) + 1;
  });

  let formula = '';
  // Carbon first if present
  if (counts['C']) {
    formula += `C${counts['C'] > 1 ? counts['C'] : ''}`;
    delete counts['C'];
    if (counts['H']) {
      formula += `H${counts['H'] > 1 ? counts['H'] : ''}`;
      delete counts['H'];
    }
  }

  // Remaining in alphabetical order
  Object.keys(counts)
    .sort()
    .forEach(sym => {
      const c = counts[sym];
      formula += `${sym}${c > 1 ? c : ''}`;
    });

  return formula;
}

/**
 * Molecular Weight calculation (g/mol)
 */
export function calculateMolecularWeight(atoms: Atom3D[]): number {
  return atoms.reduce((acc, a) => {
    const mass = ELEMENTS[a.symbol]?.atomicMass || 0;
    return acc + mass;
  }, 0);
}

/**
 * Dipole moment vector estimation based on electronegativity differences
 */
export function calculateDipoleVector(atoms: Atom3D[], bonds: Bond3D[]): [number, number, number] {
  let dx = 0;
  let dy = 0;
  let dz = 0;

  bonds.forEach(b => {
    const a1 = atoms.find(a => a.id === b.atom1Id);
    const a2 = atoms.find(a => a.id === b.atom2Id);
    if (!a1 || !a2) return;

    const en1 = ELEMENTS[a1.symbol]?.electronegativity || 2.5;
    const en2 = ELEMENTS[a2.symbol]?.electronegativity || 2.5;
    const enDiff = en2 - en1;

    const vx = a2.x - a1.x;
    const vy = a2.y - a1.y;
    const vz = a2.z - a1.z;
    const dist = Math.hypot(vx, vy, vz) || 1;

    // Vector pointing towards more electronegative atom
    dx += (vx / dist) * enDiff;
    dy += (vy / dist) * enDiff;
    dz += (vz / dist) * enDiff;
  });

  return [dx, dy, dz];
}

/**
 * Detect functional groups in molecule
 */
export function detectFunctionalGroups(atoms: Atom3D[], bonds: Bond3D[]): string[] {
  const groups: string[] = [];

  const neighbors: Record<string, { id: string; symbol: string; order: number }[]> = {};
  atoms.forEach(a => { neighbors[a.id] = []; });
  bonds.forEach(b => {
    const a1 = atoms.find(a => a.id === b.atom1Id);
    const a2 = atoms.find(a => a.id === b.atom2Id);
    if (a1 && a2) {
      neighbors[b.atom1Id].push({ id: a2.id, symbol: a2.symbol, order: b.order });
      neighbors[b.atom2Id].push({ id: a1.id, symbol: a1.symbol, order: b.order });
    }
  });

  let hasOH = false;
  let hasCOOH = false;
  let hasNH2 = false;
  let hasCarbonyl = false;
  let hasEther = false;

  atoms.forEach(a => {
    const adj = neighbors[a.id];
    if (a.symbol === 'O') {
      const hasH = adj.some(n => n.symbol === 'H');
      const hasC = adj.some(n => n.symbol === 'C');
      if (hasH && hasC) hasOH = true;
      if (adj.filter(n => n.symbol === 'C').length === 2) hasEther = true;
    }
    if (a.symbol === 'C') {
      const doubleO = adj.some(n => n.symbol === 'O' && n.order === 2);
      const singleOH = adj.some(n => n.symbol === 'O' && neighbors[n.id]?.some(nn => nn.symbol === 'H'));
      if (doubleO && singleOH) hasCOOH = true;
      else if (doubleO) hasCarbonyl = true;
    }
    if (a.symbol === 'N') {
      const hCount = adj.filter(n => n.symbol === 'H').length;
      if (hCount >= 1) hasNH2 = true;
    }
  });

  if (hasCOOH) groups.push('Ácido Carboxílico (-COOH)');
  if (hasOH && !hasCOOH) groups.push('Hidroxilo / Alcohol (-OH)');
  if (hasCarbonyl && !hasCOOH) groups.push('Carbonilo (C=O)');
  if (hasNH2) groups.push('Amina (-NH₂ / -NH-)');
  if (hasEther) groups.push('Éter (R-O-R)');

  return groups.length > 0 ? groups : ['Cadena Hidrocarbonada'];
}

/**
 * Standard Bond Dissociation Enthalpies (kJ/mol)
 */
const BOND_ENERGIES_KJ: Record<string, number> = {
  // Single bonds
  'H-H_1': 436,
  'C-H_1': 413,
  'O-H_1': 463,
  'N-H_1': 391,
  'S-H_1': 347,
  'P-H_1': 322,
  'C-C_1': 348,
  'C-O_1': 358,
  'C-N_1': 305,
  'C-S_1': 259,
  'C-P_1': 264,
  'C-F_1': 485,
  'C-Cl_1': 328,
  'C-Br_1': 276,
  'C-I_1': 240,
  'O-O_1': 146,
  'N-N_1': 163,
  'N-O_1': 201,
  'P-O_1': 335,
  'S-O_1': 265,

  // Double bonds
  'C-C_2': 614,
  'C-O_2': 799,
  'C-N_2': 615,
  'C-S_2': 577,
  'O-O_2': 498,
  'N-N_2': 418,
  'N-O_2': 607,
  'P-O_2': 544,
  'S-O_2': 522,

  // Triple bonds
  'C-C_3': 839,
  'C-N_3': 891,
  'N-N_3': 945,

  // Hydrogen bonds
  'H-BOND': 21
};

export interface BondEnergyBreakdown {
  label: string;
  order: number;
  count: number;
  energyPerBond: number;
  totalEnergy: number;
}

/**
 * Calculate total molecular bond enthalpy (dissociation energy)
 */
export function calculateTotalBondEnergy(
  atoms: Atom3D[],
  bonds: Bond3D[]
): {
  totalKJ: number;
  totalKcal: number;
  averageBondEnergyKJ: number;
  breakdown: BondEnergyBreakdown[];
} {
  if (bonds.length === 0) {
    return { totalKJ: 0, totalKcal: 0, averageBondEnergyKJ: 0, breakdown: [] };
  }

  const breakdownMap: Record<string, BondEnergyBreakdown> = {};
  let totalKJ = 0;

  bonds.forEach(bond => {
    const a1 = atoms.find(a => a.id === bond.atom1Id);
    const a2 = atoms.find(a => a.id === bond.atom2Id);
    if (!a1 || !a2) return;

    if (bond.order === 0.5) {
      const key = 'Puente de Hidrógeno (···)';
      const e = BOND_ENERGIES_KJ['H-BOND'];
      totalKJ += e;
      if (!breakdownMap[key]) {
        breakdownMap[key] = { label: key, order: 0.5, count: 0, energyPerBond: e, totalEnergy: 0 };
      }
      breakdownMap[key].count += 1;
      breakdownMap[key].totalEnergy += e;
      return;
    }

    const [s1, s2] = [a1.symbol, a2.symbol].sort();
    const lookup1 = `${s1}-${s2}_${bond.order}`;
    const lookup2 = `${s2}-${s1}_${bond.order}`;

    let energy = BOND_ENERGIES_KJ[lookup1] || BOND_ENERGIES_KJ[lookup2];
    if (!energy) {
      // Fallback estimate based on covalent single bond average * order
      const base = 320;
      energy = Math.round(base * (bond.order === 3 ? 2.5 : bond.order === 2 ? 1.8 : 1.0));
    }

    totalKJ += energy;
    const orderSymbol = bond.order === 3 ? '≡' : bond.order === 2 ? '=' : '—';
    const label = `${s1}${orderSymbol}${s2}`;

    if (!breakdownMap[label]) {
      breakdownMap[label] = { label, order: bond.order, count: 0, energyPerBond: energy, totalEnergy: 0 };
    }
    breakdownMap[label].count += 1;
    breakdownMap[label].totalEnergy += energy;
  });

  const breakdown = Object.values(breakdownMap).sort((a, b) => b.totalEnergy - a.totalEnergy);
  const totalKcal = totalKJ / 4.184;
  const averageBondEnergyKJ = totalKJ / bonds.length;

  return { totalKJ, totalKcal, averageBondEnergyKJ, breakdown };
}

/**
 * Calculate dipole moment and detailed polarity classification
 */
export function calculatePolarity(
  atoms: Atom3D[],
  bonds: Bond3D[]
): {
  dipoleDebye: number;
  vector: [number, number, number];
  category: 'Apolar' | 'Ligeramente Polar' | 'Moderadamente Polar' | 'Altamente Polar';
  description: string;
  color: string;
} {
  if (atoms.length <= 1 || bonds.length === 0) {
    return {
      dipoleDebye: 0,
      vector: [0, 0, 0],
      category: 'Apolar',
      description: 'Molécula simétrica o sin distribución de cargas separadas.',
      color: '#94a3b8'
    };
  }

  const rawVec = calculateDipoleVector(atoms, bonds);
  // Conversion factor from normalized EN*angstroms to approximate Debye (1 Debye = 3.33564e-30 C*m)
  const debyeScale = 1.35;
  const mag = Math.hypot(rawVec[0], rawVec[1], rawVec[2]) * debyeScale;

  let category: 'Apolar' | 'Ligeramente Polar' | 'Moderadamente Polar' | 'Altamente Polar' = 'Apolar';
  let description = 'Momento dipolar neto cercano a cero debido a simetría geométrica o baja diferencia de electronegatividad.';
  let color = '#10b981'; // green / nonpolar

  if (mag >= 2.5) {
    category = 'Altamente Polar';
    description = 'Fuerte asimetría de carga eléctrica con enlaces fuertemente polarizados. Gran solubilidad en agua y disolventes próticos.';
    color = '#f43f5e'; // rose
  } else if (mag >= 1.2) {
    category = 'Moderadamente Polar';
    description = 'Separación notable de centros de carga positiva y negativa. Capaz de formar interacciones dipolo-dipolo significativas.';
    color = '#38bdf8'; // sky
  } else if (mag >= 0.4) {
    category = 'Ligeramente Polar';
    description = 'Débil momento dipolar permanente; predominan fuerzas de dispersión de London con ligero carácter dipolar.';
    color = '#eab308'; // amber
  }

  return {
    dipoleDebye: mag,
    vector: rawVec,
    category,
    description,
    color
  };
}

/**
 * Valence electrons map
 */
const VALENCE_ELECTRONS: Record<string, number> = {
  H: 1, He: 2, Li: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Ne: 8,
  Na: 1, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Ar: 8,
  K: 1, Ca: 2, Fe: 8, Cu: 11, Br: 7, I: 7, Au: 11
};

/**
 * Comprehensive Molecular Properties Record
 */
export interface MolecularPropertiesData {
  molecularWeight: number; // g/mol
  formula: string;
  totalValenceElectrons: number;
  totalBondEnergyKJ: number;
  totalBondEnergyKcal: number;
  averageBondEnergyKJ: number;
  dipoleDebye: number;
  dipoleCategory: 'Apolar' | 'Ligeramente Polar' | 'Moderadamente Polar' | 'Altamente Polar';
  dipoleDescription: string;
  dipoleColor: string;
  vanDerWaalsVolume: number; // Å³
  rotatableBondsCount: number;
  hBondDonors: number;
  hBondAcceptors: number;
  polarSurfaceAreaEstimate: number; // Å²
  functionalGroups: string[];
  bondBreakdown: BondEnergyBreakdown[];
}

export function computeMolecularProperties(
  atoms: Atom3D[],
  bonds: Bond3D[]
): MolecularPropertiesData {
  const mw = calculateMolecularWeight(atoms);
  const formula = calculateChemicalFormula(atoms);
  const bondEnergy = calculateTotalBondEnergy(atoms, bonds);
  const polarity = calculatePolarity(atoms, bonds);
  const functionalGroups = detectFunctionalGroups(atoms, bonds);

  // Valence electrons
  const totalValenceElectrons = atoms.reduce((acc, a) => {
    return acc + (VALENCE_ELECTRONS[a.symbol] || 4);
  }, 0);

  // Van der Waals volume estimate: sum(4/3 * pi * r_vdw^3) * 0.7 packing factor
  const vdwVolume = atoms.reduce((acc, a) => {
    const r = ELEMENTS[a.symbol]?.vdwRadius || 1.5;
    return acc + (4 / 3) * Math.PI * Math.pow(r, 3);
  }, 0) * 0.72;

  // H-Bond Donors (N-H, O-H) and Acceptors (N, O)
  let hBondDonors = 0;
  let hBondAcceptors = 0;
  const neighbors: Record<string, string[]> = {};
  atoms.forEach(a => { neighbors[a.id] = []; });
  bonds.forEach(b => {
    neighbors[b.atom1Id]?.push(b.atom2Id);
    neighbors[b.atom2Id]?.push(b.atom1Id);
  });

  atoms.forEach(a => {
    if (a.symbol === 'O' || a.symbol === 'N') {
      hBondAcceptors += 1;
      const isDonor = neighbors[a.id].some(nId => atoms.find(na => na.id === nId)?.symbol === 'H');
      if (isDonor) hBondDonors += 1;
    }
  });

  // Rotatable bonds: single bonds between non-hydrogen, non-terminal heavy atoms
  let rotatableBondsCount = 0;
  bonds.forEach(b => {
    if (b.order === 1) {
      const a1 = atoms.find(a => a.id === b.atom1Id);
      const a2 = atoms.find(a => a.id === b.atom2Id);
      if (a1 && a2 && a1.symbol !== 'H' && a2.symbol !== 'H') {
        const d1 = neighbors[a1.id].filter(id => atoms.find(na => na.id === id)?.symbol !== 'H').length;
        const d2 = neighbors[a2.id].filter(id => atoms.find(na => na.id === id)?.symbol !== 'H').length;
        if (d1 > 1 && d2 > 1) {
          rotatableBondsCount += 1;
        }
      }
    }
  });

  // Topological Polar Surface Area (TPSA) estimate
  let polarSurfaceArea = 0;
  atoms.forEach(a => {
    if (a.symbol === 'O') {
      const hasH = neighbors[a.id].some(nId => atoms.find(na => na.id === nId)?.symbol === 'H');
      polarSurfaceArea += hasH ? 20.2 : 9.2;
    } else if (a.symbol === 'N') {
      const hCount = neighbors[a.id].filter(nId => atoms.find(na => na.id === nId)?.symbol === 'H').length;
      if (hCount === 2) polarSurfaceArea += 26.0;
      else if (hCount === 1) polarSurfaceArea += 12.0;
      else polarSurfaceArea += 3.2;
    }
  });

  return {
    molecularWeight: mw,
    formula,
    totalValenceElectrons,
    totalBondEnergyKJ: Math.round(bondEnergy.totalKJ),
    totalBondEnergyKcal: Math.round(bondEnergy.totalKcal),
    averageBondEnergyKJ: Math.round(bondEnergy.averageBondEnergyKJ),
    dipoleDebye: parseFloat(polarity.dipoleDebye.toFixed(2)),
    dipoleCategory: polarity.category,
    dipoleDescription: polarity.description,
    dipoleColor: polarity.color,
    vanDerWaalsVolume: Math.round(vdwVolume),
    rotatableBondsCount,
    hBondDonors,
    hBondAcceptors,
    polarSurfaceAreaEstimate: Math.round(polarSurfaceArea * 10) / 10,
    functionalGroups,
    bondBreakdown: bondEnergy.breakdown
  };
}

