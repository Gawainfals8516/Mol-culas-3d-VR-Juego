import { Molecule3D } from '../types/chemistry';

export const PRESET_MOLECULES: Molecule3D[] = [
  {
    id: 'water',
    name: 'Agua (H₂O)',
    formula: 'H₂O',
    category: 'Inorgánica Esencial',
    description: 'Molécula polar con geometría angular (104.5°). Base de la vida, puentes de hidrógeno y solvente universal.',
    atoms: [
      { id: 'o1', symbol: 'O', x: 0, y: 0, z: 0 },
      { id: 'h1', symbol: 'H', x: 0.757, y: 0.586, z: 0 },
      { id: 'h2', symbol: 'H', x: -0.757, y: 0.586, z: 0 }
    ],
    bonds: [
      { id: 'b1', atom1Id: 'o1', atom2Id: 'h1', order: 1 },
      { id: 'b2', atom1Id: 'o1', atom2Id: 'h2', order: 1 }
    ]
  },
  {
    id: 'methane',
    name: 'Metano (CH₄)',
    formula: 'CH₄',
    category: 'Hidrocarburos',
    description: 'Hidrocarburo simple con hibridación sp³ y geometría tetraédrica perfecta (ángulos de 109.5°).',
    atoms: [
      { id: 'c1', symbol: 'C', x: 0, y: 0, z: 0 },
      { id: 'h1', symbol: 'H', x: 0.63, y: 0.63, z: 0.63 },
      { id: 'h2', symbol: 'H', x: -0.63, y: -0.63, z: 0.63 },
      { id: 'h3', symbol: 'H', x: -0.63, y: 0.63, z: -0.63 },
      { id: 'h4', symbol: 'H', x: 0.63, y: -0.63, z: -0.63 }
    ],
    bonds: [
      { id: 'b1', atom1Id: 'c1', atom2Id: 'h1', order: 1 },
      { id: 'b2', atom1Id: 'c1', atom2Id: 'h2', order: 1 },
      { id: 'b3', atom1Id: 'c1', atom2Id: 'h3', order: 1 },
      { id: 'b4', atom1Id: 'c1', atom2Id: 'h4', order: 1 }
    ]
  },
  {
    id: 'ethanol',
    name: 'Etanol (C₂H₅OH)',
    formula: 'C₂H₆O',
    category: 'Alcoholes',
    description: 'Alcohol primario con grupo hidroxilo (-OH), capaz de formar puentes de hidrógeno y soluble en agua.',
    atoms: [
      { id: 'c1', symbol: 'C', x: -0.75, y: -0.2, z: 0 },
      { id: 'c2', symbol: 'C', x: 0.75, y: -0.2, z: 0 },
      { id: 'o1', symbol: 'O', x: 1.4, y: 0.95, z: 0 },
      { id: 'h_o', symbol: 'H', x: 2.3, y: 0.8, z: 0 },
      { id: 'h1', symbol: 'H', x: -1.15, y: -0.7, z: 0.88 },
      { id: 'h2', symbol: 'H', x: -1.15, y: -0.7, z: -0.88 },
      { id: 'h3', symbol: 'H', x: -1.15, y: 0.82, z: 0 },
      { id: 'h4', symbol: 'H', x: 1.15, y: -0.7, z: 0.88 },
      { id: 'h5', symbol: 'H', x: 1.15, y: -0.7, z: -0.88 }
    ],
    bonds: [
      { id: 'b1', atom1Id: 'c1', atom2Id: 'c2', order: 1 },
      { id: 'b2', atom1Id: 'c2', atom2Id: 'o1', order: 1 },
      { id: 'b3', atom1Id: 'o1', atom2Id: 'h_o', order: 1 },
      { id: 'b4', atom1Id: 'c1', atom2Id: 'h1', order: 1 },
      { id: 'b5', atom1Id: 'c1', atom2Id: 'h2', order: 1 },
      { id: 'b6', atom1Id: 'c1', atom2Id: 'h3', order: 1 },
      { id: 'b7', atom1Id: 'c2', atom2Id: 'h4', order: 1 },
      { id: 'b8', atom1Id: 'c2', atom2Id: 'h5', order: 1 }
    ]
  },
  {
    id: 'benzene',
    name: 'Benceno (C₆H₆)',
    formula: 'C₆H₆',
    category: 'Aromáticos',
    description: 'Anillo aromático plano con 6 electrones pi deslocalizados por resonancia molecular según la regla de Hückel.',
    atoms: [
      { id: 'c1', symbol: 'C', x: 1.39, y: 0, z: 0 },
      { id: 'c2', symbol: 'C', x: 0.695, y: 1.204, z: 0 },
      { id: 'c3', symbol: 'C', x: -0.695, y: 1.204, z: 0 },
      { id: 'c4', symbol: 'C', x: -1.39, y: 0, z: 0 },
      { id: 'c5', symbol: 'C', x: -0.695, y: -1.204, z: 0 },
      { id: 'c6', symbol: 'C', x: 0.695, y: -1.204, z: 0 },
      { id: 'h1', symbol: 'H', x: 2.47, y: 0, z: 0 },
      { id: 'h2', symbol: 'H', x: 1.235, y: 2.139, z: 0 },
      { id: 'h3', symbol: 'H', x: -1.235, y: 2.139, z: 0 },
      { id: 'h4', symbol: 'H', x: -2.47, y: 0, z: 0 },
      { id: 'h5', symbol: 'H', x: -1.235, y: -2.139, z: 0 },
      { id: 'h6', symbol: 'H', x: 1.235, y: -2.139, z: 0 }
    ],
    bonds: [
      { id: 'b1', atom1Id: 'c1', atom2Id: 'c2', order: 2 },
      { id: 'b2', atom1Id: 'c2', atom2Id: 'c3', order: 1 },
      { id: 'b3', atom1Id: 'c3', atom2Id: 'c4', order: 2 },
      { id: 'b4', atom1Id: 'c4', atom2Id: 'c5', order: 1 },
      { id: 'b5', atom1Id: 'c5', atom2Id: 'c6', order: 2 },
      { id: 'b6', atom1Id: 'c6', atom2Id: 'c1', order: 1 },
      { id: 'bh1', atom1Id: 'c1', atom2Id: 'h1', order: 1 },
      { id: 'bh2', atom1Id: 'c2', atom2Id: 'h2', order: 1 },
      { id: 'bh3', atom1Id: 'c3', atom2Id: 'h3', order: 1 },
      { id: 'bh4', atom1Id: 'c4', atom2Id: 'h4', order: 1 },
      { id: 'bh5', atom1Id: 'c5', atom2Id: 'h5', order: 1 },
      { id: 'bh6', atom1Id: 'c6', atom2Id: 'h6', order: 1 }
    ]
  },
  {
    id: 'caffeine',
    name: 'Cafeína (C₈H₁₀N₄O₂)',
    formula: 'C₈H₁₀N₄O₂',
    category: 'Alcaloides',
    description: 'Alcaloide del grupo de las xantinas, estimulante del sistema nervioso central que bloquea los receptores de adenosina.',
    atoms: [
      { id: 'n1', symbol: 'N', x: -0.74, y: 1.34, z: 0 },
      { id: 'c2', symbol: 'C', x: 0.61, y: 1.58, z: 0 },
      { id: 'o2', symbol: 'O', x: 1.05, y: 2.70, z: 0 },
      { id: 'n3', symbol: 'N', x: 1.44, y: 0.44, z: 0 },
      { id: 'c4', symbol: 'C', x: 0.99, y: -0.88, z: 0 },
      { id: 'c5', symbol: 'C', x: -0.38, y: -1.03, z: 0 },
      { id: 'c6', symbol: 'C', x: -1.25, y: 0.08, z: 0 },
      { id: 'o6', symbol: 'O', x: -2.46, y: -0.05, z: 0 },
      { id: 'n7', symbol: 'N', x: -0.52, y: -2.39, z: 0 },
      { id: 'c8', symbol: 'C', x: 0.73, y: -2.96, z: 0 },
      { id: 'n9', symbol: 'N', x: 1.64, y: -2.09, z: 0 },
      { id: 'cm1', symbol: 'C', x: -1.67, y: 2.45, z: 0 },
      { id: 'cm3', symbol: 'C', x: 2.87, y: 0.69, z: 0 },
      { id: 'cm7', symbol: 'C', x: -1.75, y: -3.14, z: 0 },
      { id: 'h8', symbol: 'H', x: 1.01, y: -4.01, z: 0 }
    ],
    bonds: [
      { id: 'b1', atom1Id: 'n1', atom2Id: 'c2', order: 1 },
      { id: 'b2', atom1Id: 'c2', atom2Id: 'o2', order: 2 },
      { id: 'b3', atom1Id: 'c2', atom2Id: 'n3', order: 1 },
      { id: 'b4', atom1Id: 'n3', atom2Id: 'c4', order: 1 },
      { id: 'b5', atom1Id: 'c4', atom2Id: 'c5', order: 2 },
      { id: 'b6', atom1Id: 'c5', atom2Id: 'c6', order: 1 },
      { id: 'b7', atom1Id: 'c6', atom2Id: 'n1', order: 1 },
      { id: 'b8', atom1Id: 'c6', atom2Id: 'o6', order: 2 },
      { id: 'b9', atom1Id: 'c5', atom2Id: 'n7', order: 1 },
      { id: 'b10', atom1Id: 'n7', atom2Id: 'c8', order: 1 },
      { id: 'b11', atom1Id: 'c8', atom2Id: 'n9', order: 2 },
      { id: 'b12', atom1Id: 'n9', atom2Id: 'c4', order: 1 },
      { id: 'b13', atom1Id: 'n1', atom2Id: 'cm1', order: 1 },
      { id: 'b14', atom1Id: 'n3', atom2Id: 'cm3', order: 1 },
      { id: 'b15', atom1Id: 'n7', atom2Id: 'cm7', order: 1 },
      { id: 'b16', atom1Id: 'c8', atom2Id: 'h8', order: 1 }
    ]
  },
  {
    id: 'aspirin',
    name: 'Aspirina (Ácido Acetilsalicílico)',
    formula: 'C₉H₈O₄',
    category: 'Farmacéuticos',
    description: 'Analgésico y antipirético antiinflamatorio no esteroideo (AINE) derivado del sauce que inhibe las enzimas COX-1 y COX-2.',
    atoms: [
      { id: 'c1', symbol: 'C', x: -1.2, y: 0.5, z: 0 },
      { id: 'c2', symbol: 'C', x: -0.6, y: -0.7, z: 0 },
      { id: 'c3', symbol: 'C', x: 0.8, y: -0.8, z: 0 },
      { id: 'c4', symbol: 'C', x: 1.5, y: 0.4, z: 0 },
      { id: 'c5', symbol: 'C', x: 0.8, y: 1.6, z: 0 },
      { id: 'c6', symbol: 'C', x: -0.5, y: 1.6, z: 0 },
      // Carboxyl group on c2
      { id: 'cc', symbol: 'C', x: -1.4, y: -2.0, z: 0.2 },
      { id: 'o1', symbol: 'O', x: -0.9, y: -3.0, z: 0.5 },
      { id: 'o2', symbol: 'O', x: -2.6, y: -1.7, z: -0.2 },
      { id: 'ho2', symbol: 'H', x: -3.1, y: -2.4, z: -0.1 },
      // Ester group on c3
      { id: 'oe', symbol: 'O', x: 1.5, y: -1.9, z: -0.1 },
      { id: 'ce', symbol: 'C', x: 2.8, y: -1.8, z: 0.2 },
      { id: 'oe2', symbol: 'O', x: 3.4, y: -0.8, z: 0.4 },
      { id: 'cm', symbol: 'C', x: 3.5, y: -3.1, z: 0.2 }
    ],
    bonds: [
      { id: 'b1', atom1Id: 'c1', atom2Id: 'c2', order: 2 },
      { id: 'b2', atom1Id: 'c2', atom2Id: 'c3', order: 1 },
      { id: 'b3', atom1Id: 'c3', atom2Id: 'c4', order: 2 },
      { id: 'b4', atom1Id: 'c4', atom2Id: 'c5', order: 1 },
      { id: 'b5', atom1Id: 'c5', atom2Id: 'c6', order: 2 },
      { id: 'b6', atom1Id: 'c6', atom2Id: 'c1', order: 1 },
      { id: 'b7', atom1Id: 'c2', atom2Id: 'cc', order: 1 },
      { id: 'b8', atom1Id: 'cc', atom2Id: 'o1', order: 2 },
      { id: 'b9', atom1Id: 'cc', atom2Id: 'o2', order: 1 },
      { id: 'b10', atom1Id: 'o2', atom2Id: 'ho2', order: 1 },
      { id: 'b11', atom1Id: 'c3', atom2Id: 'oe', order: 1 },
      { id: 'b12', atom1Id: 'oe', atom2Id: 'ce', order: 1 },
      { id: 'b13', atom1Id: 'ce', atom2Id: 'oe2', order: 2 },
      { id: 'b14', atom1Id: 'ce', atom2Id: 'cm', order: 1 }
    ]
  },
  {
    id: 'glucose',
    name: 'D-Glucosa (C₆H₁₂O₆)',
    formula: 'C₆H₁₂O₆',
    category: 'Biomoléculas / Carbohidratos',
    description: 'Monosacárido principal en el metabolismo celular. Conforma el sustrato primario de la glucólisis y respiración celular.',
    atoms: [
      { id: 'o5', symbol: 'O', x: 0, y: 1.2, z: 0.3 },
      { id: 'c1', symbol: 'C', x: 1.1, y: 0.6, z: -0.3 },
      { id: 'c2', symbol: 'C', x: 1.1, y: -0.8, z: 0.3 },
      { id: 'c3', symbol: 'C', x: -0.1, y: -1.5, z: -0.3 },
      { id: 'c4', symbol: 'C', x: -1.3, y: -0.7, z: 0.3 },
      { id: 'c5', symbol: 'C', x: -1.2, y: 0.7, z: -0.3 },
      // Hydroxils
      { id: 'oh1', symbol: 'O', x: 2.2, y: 1.1, z: 0.2 },
      { id: 'oh2', symbol: 'O', x: 2.1, y: -1.3, z: -0.4 },
      { id: 'oh3', symbol: 'O', x: -0.2, y: -2.7, z: 0.3 },
      { id: 'oh4', symbol: 'O', x: -2.3, y: -1.4, z: -0.3 },
      { id: 'c6', symbol: 'C', x: -2.4, y: 1.5, z: 0.2 },
      { id: 'oh6', symbol: 'O', x: -2.5, y: 2.6, z: -0.5 }
    ],
    bonds: [
      { id: 'b1', atom1Id: 'o5', atom2Id: 'c1', order: 1 },
      { id: 'b2', atom1Id: 'c1', atom2Id: 'c2', order: 1 },
      { id: 'b3', atom1Id: 'c2', atom2Id: 'c3', order: 1 },
      { id: 'b4', atom1Id: 'c3', atom2Id: 'c4', order: 1 },
      { id: 'b5', atom1Id: 'c4', atom2Id: 'c5', order: 1 },
      { id: 'b6', atom1Id: 'c5', atom2Id: 'o5', order: 1 },
      { id: 'b7', atom1Id: 'c1', atom2Id: 'oh1', order: 1 },
      { id: 'b8', atom1Id: 'c2', atom2Id: 'oh2', order: 1 },
      { id: 'b9', atom1Id: 'c3', atom2Id: 'oh3', order: 1 },
      { id: 'b10', atom1Id: 'c4', atom2Id: 'oh4', order: 1 },
      { id: 'b11', atom1Id: 'c5', atom2Id: 'c6', order: 1 },
      { id: 'b12', atom1Id: 'c6', atom2Id: 'oh6', order: 1 }
    ]
  },
  {
    id: 'dna_segment',
    name: 'Segmento Doble Hélice ADN',
    formula: 'Polinucleótido (A-T / G-C)',
    category: 'Genética Molecular',
    description: 'Estructura canónica de Watson y Crick estabilizada por apilamiento de bases y puentes de hidrógeno específicos.',
    atoms: [
      // Adenine
      { id: 'a_n1', symbol: 'N', x: -1.2, y: 0.8, z: -1.0 },
      { id: 'a_c2', symbol: 'C', x: -0.2, y: 1.4, z: -1.0 },
      { id: 'a_n3', symbol: 'N', x: 0.9, y: 0.8, z: -1.0 },
      { id: 'a_c4', symbol: 'C', x: 0.8, y: -0.5, z: -1.0 },
      { id: 'a_c5', symbol: 'C', x: -0.4, y: -1.0, z: -1.0 },
      { id: 'a_c6', symbol: 'C', x: -1.5, y: -0.4, z: -1.0 },
      { id: 'a_n6', symbol: 'N', x: -2.6, y: -1.0, z: -1.0 },
      // Thymine
      { id: 't_n1', symbol: 'N', x: -1.2, y: 0.8, z: 1.5 },
      { id: 't_c2', symbol: 'C', x: -0.1, y: 1.4, z: 1.5 },
      { id: 't_o2', symbol: 'O', x: -0.1, y: 2.6, z: 1.5 },
      { id: 't_n3', symbol: 'N', x: 1.0, y: 0.7, z: 1.5 },
      { id: 't_c4', symbol: 'C', x: 1.0, y: -0.6, z: 1.5 },
      { id: 't_o4', symbol: 'O', x: 2.0, y: -1.2, z: 1.5 },
      { id: 't_c5', symbol: 'C', x: -0.2, y: -1.2, z: 1.5 },
      { id: 't_c6', symbol: 'C', x: -1.2, y: -0.5, z: 1.5 },
      // Phosphate backbone nodes
      { id: 'p1', symbol: 'P', x: -3.4, y: 2.2, z: -1.8 },
      { id: 'p2', symbol: 'P', x: -3.4, y: 2.2, z: 2.2 },
      { id: 'p3', symbol: 'P', x: 3.4, y: -2.5, z: -1.2 },
      { id: 'p4', symbol: 'P', x: 3.4, y: -2.5, z: 1.8 }
    ],
    bonds: [
      { id: 'b_a1', atom1Id: 'a_n1', atom2Id: 'a_c2', order: 1 },
      { id: 'b_a2', atom1Id: 'a_c2', atom2Id: 'a_n3', order: 2 },
      { id: 'b_a3', atom1Id: 'a_n3', atom2Id: 'a_c4', order: 1 },
      { id: 'b_a4', atom1Id: 'a_c4', atom2Id: 'a_c5', order: 2 },
      { id: 'b_a5', atom1Id: 'a_c5', atom2Id: 'a_c6', order: 1 },
      { id: 'b_a6', atom1Id: 'a_c6', atom2Id: 'a_n1', order: 2 },
      { id: 'b_a7', atom1Id: 'a_c6', atom2Id: 'a_n6', order: 1 },
      // Thymine ring
      { id: 'b_t1', atom1Id: 't_n1', atom2Id: 't_c2', order: 1 },
      { id: 'b_t2', atom1Id: 't_c2', atom2Id: 't_o2', order: 2 },
      { id: 'b_t3', atom1Id: 't_c2', atom2Id: 't_n3', order: 1 },
      { id: 'b_t4', atom1Id: 't_n3', atom2Id: 't_c4', order: 1 },
      { id: 'b_t5', atom1Id: 't_c4', atom2Id: 't_o4', order: 2 },
      { id: 'b_t6', atom1Id: 't_c4', atom2Id: 't_c5', order: 1 },
      { id: 'b_t7', atom1Id: 't_c5', atom2Id: 't_c6', order: 2 },
      { id: 'b_t8', atom1Id: 't_c6', atom2Id: 't_n1', order: 1 },
      // Hydrogen bonds (order 0.5)
      { id: 'hb1', atom1Id: 'a_n6', atom2Id: 't_o4', order: 0.5 },
      { id: 'hb2', atom1Id: 'a_n1', atom2Id: 't_n3', order: 0.5 },
      // Backbone bonds
      { id: 'bp1', atom1Id: 'a_n1', atom2Id: 'p1', order: 1 },
      { id: 'bp2', atom1Id: 't_n1', atom2Id: 'p2', order: 1 }
    ]
  },
  {
    id: 'buckyball',
    name: 'Buckyball / Fullereno (C₆₀)',
    formula: 'C₆₀',
    category: 'Nanomateriales',
    description: 'Jaula esférica de 60 átomos de carbono con 12 pentágonos y 20 hexágonos, análoga a un icosaedro truncado.',
    atoms: generateFullereneAtoms(),
    bonds: generateFullereneBonds()
  }
];

// Helper to generate truncated icosahedron (C60 Buckyball) coordinates
function generateFullereneAtoms() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const scale = 1.9;
  const rawCoords: [number, number, number][] = [];

  // Vertex permutations for truncated icosahedron
  const permutations = [
    [0, 1, 3 * phi],
    [2, 1 + 2 * phi, phi],
    [1, 2 + phi, 2 * phi]
  ];

  permutations.forEach(([x, y, z]) => {
    // Generate sign variations and circular shifts
    const signs = [-1, 1];
    for (const sx of signs) {
      for (const sy of signs) {
        for (const sz of signs) {
          rawCoords.push([sx * x, sy * y, sz * z]);
          rawCoords.push([sz * z, sx * x, sy * y]);
          rawCoords.push([sy * y, sz * z, sx * x]);
        }
      }
    }
  });

  // Deduplicate points within tolerance
  const uniquePoints: [number, number, number][] = [];
  rawCoords.forEach(p => {
    const exists = uniquePoints.some(u => 
      Math.hypot(u[0] - p[0], u[1] - p[1], u[2] - p[2]) < 0.1
    );
    if (!exists && uniquePoints.length < 60) {
      uniquePoints.push(p);
    }
  });

  return uniquePoints.map((p, idx) => ({
    id: `c_${idx}`,
    symbol: 'C',
    x: (p[0] / 3.5) * scale,
    y: (p[1] / 3.5) * scale,
    z: (p[2] / 3.5) * scale
  }));
}

function generateFullereneBonds() {
  const atoms = generateFullereneAtoms();
  const bonds: Molecule3D['bonds'] = [];
  let bondId = 1;

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = Math.hypot(
        atoms[i].x - atoms[j].x,
        atoms[i].y - atoms[j].y,
        atoms[i].z - atoms[j].z
      );
      // Bond length for C-C in fullerene is ~1.4 - 1.45 A
      if (dist > 0.8 && dist < 1.3) {
        bonds.push({
          id: `bf_${bondId++}`,
          atom1Id: atoms[i].id,
          atom2Id: atoms[j].id,
          order: 1
        });
      }
    }
  }
  return bonds;
}
