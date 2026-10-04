import { Atom3D, Bond3D } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';

export interface StabilityAnalysis {
  status: 'Altamente Estable' | 'Poco Estable / Reactivo' | 'Muy Inestable' | 'Físicamente Imposible / No Puede Existir';
  color: string; // Hex color for status banner
  badgeBg: string;
  canExist: boolean;
  energyKcal: number;
  reasons: string[];
  valenceViolations: { atomId: string; symbol: string; currentValence: number; maxValence: number }[];
}

/**
 * Checks if forming a bond or adding an atom between atom1 and atom2 is physically allowed by quantum valence rules.
 */
export function canFormBond(
  atom1Id: string,
  atom2Id: string,
  atoms: Atom3D[],
  bonds: Bond3D[],
  orderToAdd: number
): { allowed: boolean; reason?: string } {
  const a1 = atoms.find(a => a.id === atom1Id);
  const a2 = atoms.find(a => a.id === atom2Id);
  if (!a1 || !a2) return { allowed: false, reason: 'Átomo no encontrado.' };

  const elem1 = ELEMENTS[a1.symbol];
  const elem2 = ELEMENTS[a2.symbol];
  if (!elem1 || !elem2) return { allowed: false, reason: 'Elemento desconocido.' };

  // Calculate current valence for atom1 and atom2
  const v1 = bonds
    .filter(b => (b.atom1Id === a1.id || b.atom2Id === a1.id) && !(b.atom1Id === a2.id || b.atom2Id === a2.id))
    .reduce((sum, b) => sum + (b.order === 0.5 ? 0 : b.order), 0);

  const v2 = bonds
    .filter(b => (b.atom1Id === a2.id || b.atom2Id === a2.id) && !(b.atom1Id === a1.id || b.atom2Id === a1.id))
    .reduce((sum, b) => sum + (b.order === 0.5 ? 0 : b.order), 0);

  if (v1 + orderToAdd > elem1.maxBonds) {
    return {
      allowed: false,
      reason: `El ${elem1.name} (${a1.symbol}) excede su regla de valencia máxima (${v1 + orderToAdd}/${elem1.maxBonds} enlaces).`
    };
  }

  if (v2 + orderToAdd > elem2.maxBonds) {
    return {
      allowed: false,
      reason: `El ${elem2.name} (${a2.symbol}) excede su regla de valencia máxima (${v2 + orderToAdd}/${elem2.maxBonds} enlaces).`
    };
  }

  return { allowed: true };
}

/**
 * Checks if adding a new atom of `symbol` attached to `parentAtomId` is physically allowed
 */
export function canAddAtom(
  symbol: string,
  parentAtomId: string | null,
  atoms: Atom3D[],
  bonds: Bond3D[],
  activeBondOrder: number
): { allowed: boolean; reason?: string } {
  if (!parentAtomId) return { allowed: true }; // Standalone atom is always allowed

  const parent = atoms.find(a => a.id === parentAtomId);
  if (!parent) return { allowed: true };

  const elem = ELEMENTS[parent.symbol];
  if (!elem) return { allowed: true };

  const currentValence = bonds
    .filter(b => b.atom1Id === parent.id || b.atom2Id === parent.id)
    .reduce((sum, b) => sum + (b.order === 0.5 ? 0 : b.order), 0);

  if (currentValence + activeBondOrder > elem.maxBonds) {
    return {
      allowed: false,
      reason: `No se puede agregar el átomo: el ${elem.name} (${parent.symbol}) ya alcanzó su capacidad máxima de ${elem.maxBonds} enlaces.`
    };
  }

  return { allowed: true };
}

/**
 * Evaluates real-time chemical physics stability, formal charges, octet compliance, and steric energy
 */
export function evaluateMolecularStability(
  atoms: Atom3D[],
  bonds: Bond3D[]
): StabilityAnalysis {
  if (atoms.length === 0) {
    return {
      status: 'Altamente Estable',
      color: '#94a3b8',
      badgeBg: 'bg-gray-800/80 text-gray-300 border-gray-700',
      canExist: true,
      energyKcal: 0,
      reasons: ['Lienzo molecular vacío.'],
      valenceViolations: []
    };
  }

  if (atoms.length === 1) {
    const el = ELEMENTS[atoms[0].symbol];
    const isNoble = el?.category === 'noble-gas';
    return {
      status: isNoble ? 'Altamente Estable' : 'Poco Estable / Reactivo',
      color: isNoble ? '#10b981' : '#eab308',
      badgeBg: isNoble ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700' : 'bg-amber-950/90 text-amber-300 border-amber-700',
      canExist: true,
      energyKcal: 0,
      reasons: isNoble ? ['Gas noble atómico estable.'] : ['Átomo libre o radical monatómico con electrones desapareados.'],
      valenceViolations: []
    };
  }

  const valenceViolations: StabilityAnalysis['valenceViolations'] = [];
  const reasons: string[] = [];

  let extremeStericOverlap = false;
  let unsatisfiedValences = 0;
  let severeViolations = 0;

  // 1. Valence Violations & Octet Rule Check
  atoms.forEach(a => {
    const el = ELEMENTS[a.symbol];
    if (!el) return;

    const currentValence = bonds
      .filter(b => b.atom1Id === a.id || b.atom2Id === a.id)
      .reduce((sum, b) => sum + (b.order === 0.5 ? 0 : b.order), 0);

    if (currentValence > el.maxBonds) {
      severeViolations++;
      valenceViolations.push({
        atomId: a.id,
        symbol: a.symbol,
        currentValence,
        maxValence: el.maxBonds
      });
      reasons.push(`El átomo de ${el.name} (${a.symbol}) viola la regla de valencia con ${currentValence} enlaces (Máximo permitido: ${el.maxBonds}).`);
    } else if (currentValence < el.maxBonds && a.symbol !== 'H' && el.category !== 'noble-gas') {
      unsatisfiedValences++;
    }
  });

  // 2. Steric Overlap Check (Atoms too close in 3D space)
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a1 = atoms[i];
      const a2 = atoms[j];
      const dist = Math.hypot(a2.x - a1.x, a2.y - a1.y, a2.z - a1.z);
      if (dist < 0.45) {
        extremeStericOverlap = true;
        reasons.push(`Colisión estérica crítica entre ${a1.symbol} y ${a2.symbol} (distancia ${dist.toFixed(2)} Å < límite de repulsión nuclear).`);
      }
    }
  }

  // 3. Isolated / Unbonded Atoms
  const bondedAtomIds = new Set<string>();
  bonds.forEach(b => {
    bondedAtomIds.add(b.atom1Id);
    bondedAtomIds.add(b.atom2Id);
  });
  const unbondedCount = atoms.filter(a => !bondedAtomIds.has(a.id)).length;
  if (unbondedCount > 0) {
    reasons.push(`Hay ${unbondedCount} átomo(s) aislado(s) o desconectado(s) de la estructura molecular.`);
  }

  // Energy estimate
  const totalBondCount = bonds.reduce((sum, b) => sum + (b.order === 0.5 ? 0.5 : b.order), 0);
  const estimatedEnergy = -totalBondCount * 85.0 + severeViolations * 250.0;

  // Determine Overall Stability Status
  let status: StabilityAnalysis['status'] = 'Altamente Estable';
  let color = '#10b981'; // Emerald
  let badgeBg = 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80';
  let canExist = true;

  if (severeViolations > 0 || extremeStericOverlap) {
    status = 'Físicamente Imposible / No Puede Existir';
    color = '#f43f5e'; // Rose / Red
    badgeBg = 'bg-rose-950/90 text-rose-300 border-rose-700/80';
    canExist = false;
  } else if (unsatisfiedValences > 2 || unbondedCount > 0) {
    status = 'Muy Inestable';
    color = '#f59e0b'; // Amber
    badgeBg = 'bg-amber-950/90 text-amber-300 border-amber-700/80';
  } else if (unsatisfiedValences > 0) {
    status = 'Poco Estable / Reactivo';
    color = '#38bdf8'; // Sky / Blue
    badgeBg = 'bg-sky-950/90 text-sky-300 border-sky-700/80';
  } else {
    reasons.push('Geometría molecular balanceada, valencias satisfechas y sin tensión estérica notable.');
  }

  return {
    status,
    color,
    badgeBg,
    canExist,
    energyKcal: Math.round(estimatedEnergy),
    reasons,
    valenceViolations
  };
}
