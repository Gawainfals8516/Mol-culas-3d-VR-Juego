import { ChemicalReaction } from '../types/chemistry';

export const CHEMICAL_REACTIONS: ChemicalReaction[] = [
  {
    id: 'ionic_redox_nacl',
    title: 'Transferencia de Electrones y Formación Iónica (Na + Cl ⟶ Na⁺ + Cl⁻)',
    equation: 'Na + Cl ⟶ Na⁺ + Cl⁻ ⟶ NaCl',
    type: 'Formación de Enlace Iónico',
    description: 'Transferencia directa de 1 electrón de valencia desde el átomo de Sodio (Na) hacia el Cloro (Cl), generando los iones Na⁺ (catión) y Cl⁻ (anión) atraídos por fuerza electrostática de Coulomb.',
    activationEnergyKcal: 12.4,
    enthalpyKcal: -98.2,
    isExothermic: true,
    steps: [
      {
        stepName: '1. Neutros Neutro Na (3s¹) + Cl (3p⁵)',
        description: 'Sodio neutro con un electrón de valencia débilmente unido (baja energía de ionización) y Cloro neutro con alta afinidad electrónica.',
        energyKcal: 0,
        activeIons: ['Átomo Sodio Neutro (Naº)', 'Átomo Cloro Neutro (Clº)'],
        electronTransfers: [
          {
            fromAtomId: 'na1',
            toAtomId: 'cl1',
            electronCount: 1,
            description: 'Flujo de electrón 3s¹ hacia el orbital desocupado 3p de Cl'
          }
        ],
        freeElectrons: [
          { id: 'e1', position: [-0.5, 0.2, 0], velocity: [0.8, 0, 0], spin: 'up', energyEv: 5.14 }
        ],
        molecule: {
          id: 'nacl_neutral',
          name: 'Sodio y Cloro Neutros',
          formula: 'Na + Cl',
          category: 'Interacción Iónica',
          description: 'Átomos neutros en curso de colisión.',
          atoms: [
            { id: 'na1', symbol: 'Na', x: -2.2, y: 0, z: 0, formalCharge: 0, partialCharge: 0.05 },
            { id: 'cl1', symbol: 'Cl', x: 2.2, y: 0, z: 0, formalCharge: 0, partialCharge: -0.05 }
          ],
          bonds: []
        }
      },
      {
        stepName: '2. Transferencia de Electrón e⁻ (Ionización)',
        description: 'El electrón de valencia se deslocaliza completamente hacia el Cloro. Formación del par iónico [Na]⁺ y [Cl]⁻.',
        energyKcal: 12.4,
        activeIons: ['Catión Sodio Na⁺', 'Anión Cloruro Cl⁻'],
        freeElectrons: [
          { id: 'e1_moving', position: [0.2, 0.05, 0], velocity: [1.2, 0, 0], spin: 'up', energyEv: 3.61 }
        ],
        electronTransfers: [
          {
            fromAtomId: 'na1',
            toAtomId: 'cl1',
            electronCount: 1,
            description: 'Salto cuántico del electrón'
          }
        ],
        molecule: {
          id: 'nacl_transfer',
          name: 'Par Iónico en Formación',
          formula: 'Na⁺ ··· e⁻ ··· Cl⁻',
          category: 'Iónico',
          description: 'Transferencia electrónica en progreso.',
          atoms: [
            { id: 'na1', symbol: 'Na', x: -1.4, y: 0, z: 0, formalCharge: 1, partialCharge: 0.85 },
            { id: 'cl1', symbol: 'Cl', x: 1.4, y: 0, z: 0, formalCharge: -1, partialCharge: -0.85 }
          ],
          bonds: [
            { id: 'b_ion', atom1Id: 'na1', atom2Id: 'cl1', order: 0.5 }
          ]
        }
      },
      {
        stepName: '3. Red Cristalina Iónica de Cloruro de Sodio (NaCl)',
        description: 'Atracción Coulombiana fuerte $F \propto q_1 q_2 / r^2$. Formación del enlace iónico súper estable.',
        energyKcal: -98.2,
        activeIons: ['Enlace Electroostático Na⁺Cl⁻ (Atracción de Coulomb)'],
        molecule: {
          id: 'nacl_crystal',
          name: 'Cristal Iónico de NaCl',
          formula: 'NaCl (Iónico)',
          category: 'Par Iónico Estabilizado',
          description: 'Sal neutra iónica con octetos completos.',
          atoms: [
            { id: 'na1', symbol: 'Na', x: -1.0, y: 0, z: 0, formalCharge: 1, partialCharge: 1.0 },
            { id: 'cl1', symbol: 'Cl', x: 1.0, y: 0, z: 0, formalCharge: -1, partialCharge: -1.0 }
          ],
          bonds: [
            { id: 'b_ion', atom1Id: 'na1', atom2Id: 'cl1', order: 0.5 }
          ]
        }
      }
    ]
  },
  {
    id: 'acid_base_neutralization',
    title: 'Neutralización Ácido-Base (H₃O⁺ + OH⁻ ⟶ 2 H₂O)',
    equation: 'H₃O⁺ + OH⁻ ⟶ 2 H₂O',
    type: 'Neutralización Ácido-Base',
    description: 'Transferencia ultra rápida de protón (H⁺) mediante el mecanismo de Grotthuss desde el ión hidronio al ión hidróxido.',
    activationEnergyKcal: 2.1,
    enthalpyKcal: -13.3,
    isExothermic: true,
    steps: [
      {
        stepName: '1. Iones Disueltos: Hidronio (H₃O⁺) e Hidróxido (OH⁻)',
        description: 'Catión Hidronio positivo y Anión Hidróxido negativo atraídos electrostáticamente en medio acuoso.',
        energyKcal: 0,
        activeIons: ['Ión Hidronio H₃O⁺', 'Ión Hidróxido OH⁻'],
        electronTransfers: [
          {
            fromAtomId: 'o2',
            toAtomId: 'h3',
            electronCount: 2,
            description: 'Ataque nucleofílico del par solitario del Oxígeno sobre el Protón H⁺'
          }
        ],
        molecule: {
          id: 'h3o_oh_ions',
          name: 'H₃O⁺ + OH⁻',
          formula: 'H₃O⁺ + OH⁻',
          category: 'Ácido-Base',
          description: 'Iones con cargas formales opuestas +1 y -1.',
          atoms: [
            // H3O+
            { id: 'o1', symbol: 'O', x: -1.8, y: 0, z: 0, formalCharge: 1, partialCharge: 0.4 },
            { id: 'h1', symbol: 'H', x: -2.4, y: 0.8, z: 0, partialCharge: 0.2 },
            { id: 'h2', symbol: 'H', x: -2.4, y: -0.8, z: 0, partialCharge: 0.2 },
            { id: 'h3', symbol: 'H', x: -0.7, y: 0, z: 0, partialCharge: 0.2 }, // Transferring H+
            // OH-
            { id: 'o2', symbol: 'O', x: 1.2, y: 0, z: 0, formalCharge: -1, partialCharge: -0.8 },
            { id: 'h4', symbol: 'H', x: 2.0, y: 0.6, z: 0, partialCharge: -0.2 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'o1', atom2Id: 'h1', order: 1 },
            { id: 'b2', atom1Id: 'o1', atom2Id: 'h2', order: 1 },
            { id: 'b3', atom1Id: 'o1', atom2Id: 'h3', order: 1 },
            { id: 'b4', atom1Id: 'o2', atom2Id: 'h4', order: 1 }
          ]
        }
      },
      {
        stepName: '2. Transferencia de Protón H⁺ (Mecanismo Grotthuss)',
        description: 'El par solitario del oxígeno en OH⁻ captura al protón H⁺ formando enlaces de puente transitorios.',
        energyKcal: 2.1,
        activeIons: ['Estado de Transición Ácido-Base [H₂O···H···OH]‡'],
        molecule: {
          id: 'proton_transfer_ts',
          name: 'Transferencia de Protón',
          formula: '[H₂O···H···OH]‡',
          category: 'Transición',
          description: 'El protón se desplaza en el pozo de potencial cuántico simétrico.',
          atoms: [
            { id: 'o1', symbol: 'O', x: -1.4, y: 0, z: 0, partialCharge: -0.1 },
            { id: 'h1', symbol: 'H', x: -2.1, y: 0.8, z: 0 },
            { id: 'h2', symbol: 'H', x: -2.1, y: -0.8, z: 0 },
            { id: 'h3', symbol: 'H', x: 0, y: 0, z: 0, partialCharge: 0.4 }, // Floating Proton
            { id: 'o2', symbol: 'O', x: 1.4, y: 0, z: 0, partialCharge: -0.1 },
            { id: 'h4', symbol: 'H', x: 2.1, y: 0.6, z: 0 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'o1', atom2Id: 'h1', order: 1 },
            { id: 'b2', atom1Id: 'o1', atom2Id: 'h2', order: 1 },
            { id: 'b3', atom1Id: 'o1', atom2Id: 'h3', order: 0.5 },
            { id: 'b4', atom1Id: 'o2', atom2Id: 'h3', order: 0.5 },
            { id: 'b5', atom1Id: 'o2', atom2Id: 'h4', order: 1 }
          ]
        }
      },
      {
        stepName: '3. Dos Moléculas Neutras de Agua (2 H₂O)',
        description: 'Formación de dos moléculas neutras de agua de alta estabilidad termodinámica con ángulo de enlace de 104.5°.',
        energyKcal: -13.3,
        activeIons: ['Moléculas Neutras de H₂O'],
        molecule: {
          id: 'two_water_molecules',
          name: '2 H₂O Neutras',
          formula: '2 H₂O',
          category: 'Agua Neutra',
          description: 'Sistema totalmente neutralizado.',
          atoms: [
            // H2O #1
            { id: 'o1', symbol: 'O', x: -1.6, y: 0, z: 0 },
            { id: 'h1', symbol: 'H', x: -2.2, y: 0.8, z: 0 },
            { id: 'h2', symbol: 'H', x: -2.2, y: -0.8, z: 0 },
            // H2O #2
            { id: 'o2', symbol: 'O', x: 1.6, y: 0, z: 0 },
            { id: 'h3', symbol: 'H', x: 1.0, y: -0.7, z: 0 },
            { id: 'h4', symbol: 'H', x: 2.2, y: 0.6, z: 0 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'o1', atom2Id: 'h1', order: 1 },
            { id: 'b2', atom1Id: 'o1', atom2Id: 'h2', order: 1 },
            { id: 'b3', atom1Id: 'o2', atom2Id: 'h3', order: 1 },
            { id: 'b4', atom1Id: 'o2', atom2Id: 'h4', order: 1 }
          ]
        }
      }
    ]
  },
  {
    id: 'methane_combustion',
    title: 'Combustión del Metano (CH₄ + 2O₂ → CO₂ + 2H₂O)',
    equation: 'CH₄ + 2 O₂ ⟶ CO₂ + 2 H₂O',
    type: 'Combustión',
    description: 'Reacción fuertemente exotérmica donde el metano se oxida con oxígeno para producir dióxido de carbono, agua y liberar energía térmica.',
    activationEnergyKcal: 38.5,
    enthalpyKcal: -213.0,
    isExothermic: true,
    steps: [
      {
        stepName: '1. Reactivos Iniciales (CH₄ + 2 O₂)',
        description: 'Molécula de metano tetraédrica sp³ rodeada por dos moléculas diatómicas de oxígeno (O₂).',
        energyKcal: 0,
        molecule: {
          id: 'reactants_combustion',
          name: 'Reactivos: Metano + Oxígeno',
          formula: 'CH₄ + 2 O₂',
          category: 'Combustión',
          description: 'Reactivos desasociados antes de alcanzar el estado de transición.',
          atoms: [
            // CH4
            { id: 'c1', symbol: 'C', x: -2.0, y: 0, z: 0 },
            { id: 'h1', symbol: 'H', x: -1.37, y: 0.63, z: 0.63 },
            { id: 'h2', symbol: 'H', x: -2.63, y: -0.63, z: 0.63 },
            { id: 'h3', symbol: 'H', x: -2.63, y: 0.63, z: -0.63 },
            { id: 'h4', symbol: 'H', x: -1.37, y: -0.63, z: -0.63 },
            // O2 molecule 1
            { id: 'o1', symbol: 'O', x: 1.5, y: 1.2, z: 0 },
            { id: 'o2', symbol: 'O', x: 2.7, y: 1.2, z: 0 },
            // O2 molecule 2
            { id: 'o3', symbol: 'O', x: 1.5, y: -1.2, z: 0 },
            { id: 'o4', symbol: 'O', x: 2.7, y: -1.2, z: 0 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'c1', atom2Id: 'h1', order: 1 },
            { id: 'b2', atom1Id: 'c1', atom2Id: 'h2', order: 1 },
            { id: 'b3', atom1Id: 'c1', atom2Id: 'h3', order: 1 },
            { id: 'b4', atom1Id: 'c1', atom2Id: 'h4', order: 1 },
            { id: 'bo1', atom1Id: 'o1', atom2Id: 'o2', order: 2 },
            { id: 'bo2', atom1Id: 'o3', atom2Id: 'o4', order: 2 }
          ]
        }
      },
      {
        stepName: '2. Estado de Transición (Complejo Activado ‡)',
        description: 'Ruptura homolítica de enlaces C-H y O=O. Formación de radicales libres en el punto máximo de energía potencial.',
        energyKcal: 38.5,
        molecule: {
          id: 'ts_combustion',
          name: 'Estado de Transición (‡)',
          formula: '[C...H...O]‡',
          category: 'Complejo Activado',
          description: 'Especie transitoria de vida ultra corta con enlaces parcialmente formados y rotos.',
          atoms: [
            { id: 'c1', symbol: 'C', x: 0, y: 0, z: 0 },
            { id: 'o1', symbol: 'O', x: -1.1, y: 0.8, z: 0 },
            { id: 'o2', symbol: 'O', x: 1.1, y: -0.8, z: 0 },
            { id: 'h1', symbol: 'H', x: -0.6, y: 1.2, z: 0.4 },
            { id: 'h2', symbol: 'H', x: 0.6, y: -1.2, z: -0.4 },
            { id: 'h3', symbol: 'H', x: -0.8, y: -0.7, z: 0 },
            { id: 'h4', symbol: 'H', x: 0.8, y: 0.7, z: 0 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'c1', atom2Id: 'o1', order: 0.5 },
            { id: 'b2', atom1Id: 'c1', atom2Id: 'o2', order: 0.5 },
            { id: 'b3', atom1Id: 'o1', atom2Id: 'h1', order: 0.5 },
            { id: 'b4', atom1Id: 'o2', atom2Id: 'h2', order: 0.5 },
            { id: 'b5', atom1Id: 'c1', atom2Id: 'h3', order: 0.5 },
            { id: 'b6', atom1Id: 'c1', atom2Id: 'h4', order: 0.5 }
          ]
        }
      },
      {
        stepName: '3. Productos Finales (CO₂ + 2 H₂O)',
        description: 'Estructuras finales estables: Dióxido de Carbono lineal (C=O doble) y dos moléculas de agua angulares (H₂O).',
        energyKcal: -213.0,
        molecule: {
          id: 'products_combustion',
          name: 'Productos: CO₂ + 2 H₂O',
          formula: 'CO₂ + 2 H₂O',
          category: 'Productos Estables',
          description: 'Productos termodinámicamente estables tras la liberación de calor.',
          atoms: [
            // CO2
            { id: 'c1', symbol: 'C', x: 0, y: 0, z: 0 },
            { id: 'oc1', symbol: 'O', x: -1.2, y: 0, z: 0 },
            { id: 'oc2', symbol: 'O', x: 1.2, y: 0, z: 0 },
            // H2O #1
            { id: 'oh1', symbol: 'O', x: -2.8, y: 1.5, z: 0 },
            { id: 'hh1', symbol: 'H', x: -2.1, y: 2.1, z: 0 },
            { id: 'hh2', symbol: 'H', x: -3.5, y: 2.1, z: 0 },
            // H2O #2
            { id: 'oh2', symbol: 'O', x: 2.8, y: -1.5, z: 0 },
            { id: 'hh3', symbol: 'H', x: 2.1, y: -2.1, z: 0 },
            { id: 'hh4', symbol: 'H', x: 3.5, y: -2.1, z: 0 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'c1', atom2Id: 'oc1', order: 2 },
            { id: 'b2', atom1Id: 'c1', atom2Id: 'oc2', order: 2 },
            { id: 'bw1_1', atom1Id: 'oh1', atom2Id: 'hh1', order: 1 },
            { id: 'bw1_2', atom1Id: 'oh1', atom2Id: 'hh2', order: 1 },
            { id: 'bw2_1', atom1Id: 'oh2', atom2Id: 'hh3', order: 1 },
            { id: 'bw2_2', atom1Id: 'oh2', atom2Id: 'hh4', order: 1 }
          ]
        }
      }
    ]
  },
  {
    id: 'sn2_substitution',
    title: 'Sustitución Nucleofílica S_N2 (OH⁻ + CH₃Br → CH₃OH + Br⁻)',
    equation: 'OH⁻ + CH₃Br ⟶ CH₃OH + Br⁻',
    type: 'S_N2 Sustitución',
    description: 'Mecanismo concertado biomolecular con inversión de configuración de Walden en el centro de carbono.',
    activationEnergyKcal: 22.1,
    enthalpyKcal: -18.4,
    isExothermic: true,
    steps: [
      {
        stepName: '1. Ataque Nucleofílico Posterior (OH⁻ + CH₃Br)',
        description: 'El ión hidróxido (OH⁻) se aproxima por el lado posterior opuesto al grupo saliente Bromo (Br).',
        energyKcal: 0,
        molecule: {
          id: 'sn2_reactants',
          name: 'Reactivos S_N2',
          formula: 'OH⁻ + CH₃Br',
          category: 'Sustitución Nucleofílica',
          description: 'Aproximación nucleofílica posterior.',
          atoms: [
            // CH3Br
            { id: 'c1', symbol: 'C', x: 0, y: 0, z: 0 },
            { id: 'br1', symbol: 'Br', x: 1.9, y: 0, z: 0 },
            { id: 'h1', symbol: 'H', x: -0.3, y: 1.0, z: 0 },
            { id: 'h2', symbol: 'H', x: -0.3, y: -0.5, z: 0.86 },
            { id: 'h3', symbol: 'H', x: -0.3, y: -0.5, z: -0.86 },
            // OH-
            { id: 'o1', symbol: 'O', x: -2.8, y: 0, z: 0 },
            { id: 'ho1', symbol: 'H', x: -3.5, y: 0.6, z: 0 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'c1', atom2Id: 'br1', order: 1 },
            { id: 'b2', atom1Id: 'c1', atom2Id: 'h1', order: 1 },
            { id: 'b3', atom1Id: 'c1', atom2Id: 'h2', order: 1 },
            { id: 'b4', atom1Id: 'c1', atom2Id: 'h3', order: 1 },
            { id: 'b5', atom1Id: 'o1', atom2Id: 'ho1', order: 1 }
          ]
        }
      },
      {
        stepName: '2. Estado de Transición Pentacoordinado [HO···C...Br]‡',
        description: 'Carbono con geometría trigonal planar pentacoordinada. Inversión de Walden de los tres hidrógenos.',
        energyKcal: 22.1,
        molecule: {
          id: 'sn2_ts',
          name: 'Estado de Transición ‡',
          formula: '[HO...CH3...Br]‡',
          category: 'Complejo Pentacoordinado',
          description: 'Complejo activado pentacoordinado en el pico de energía.',
          atoms: [
            { id: 'c1', symbol: 'C', x: 0, y: 0, z: 0 },
            { id: 'o1', symbol: 'O', x: -1.6, y: 0, z: 0 },
            { id: 'br1', symbol: 'Br', x: 2.1, y: 0, z: 0 },
            { id: 'ho1', symbol: 'H', x: -2.2, y: 0.7, z: 0 },
            { id: 'h1', symbol: 'H', x: 0, y: 1.05, z: 0 },
            { id: 'h2', symbol: 'H', x: 0, y: -0.52, z: 0.91 },
            { id: 'h3', symbol: 'H', x: 0, y: -0.52, z: -0.91 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'c1', atom2Id: 'o1', order: 0.5 },
            { id: 'b2', atom1Id: 'c1', atom2Id: 'br1', order: 0.5 },
            { id: 'b3', atom1Id: 'c1', atom2Id: 'h1', order: 1 },
            { id: 'b4', atom1Id: 'c1', atom2Id: 'h2', order: 1 },
            { id: 'b5', atom1Id: 'c1', atom2Id: 'h3', order: 1 },
            { id: 'b6', atom1Id: 'o1', atom2Id: 'ho1', order: 1 }
          ]
        }
      },
      {
        stepName: '3. Productos Invertidos (Metanol CH₃OH + Br⁻)',
        description: 'Salida del anión Bromuro. Metanol formado con inversión estereoquímica completa.',
        energyKcal: -18.4,
        molecule: {
          id: 'sn2_products',
          name: 'Productos: Metanol + Bromuro',
          formula: 'CH₃OH + Br⁻',
          category: 'Productos Finales',
          description: 'Productos estables tras la inversión estereoquímica.',
          atoms: [
            { id: 'c1', symbol: 'C', x: -0.5, y: 0, z: 0 },
            { id: 'o1', symbol: 'O', x: -1.8, y: 0, z: 0 },
            { id: 'ho1', symbol: 'H', x: -2.4, y: 0.7, z: 0 },
            { id: 'h1', symbol: 'H', x: -0.2, y: 1.0, z: 0 },
            { id: 'h2', symbol: 'H', x: -0.2, y: -0.5, z: 0.86 },
            { id: 'h3', symbol: 'H', x: -0.2, y: -0.5, z: -0.86 },
            { id: 'br1', symbol: 'Br', x: 3.0, y: 0, z: 0 }
          ],
          bonds: [
            { id: 'b1', atom1Id: 'c1', atom2Id: 'o1', order: 1 },
            { id: 'b2', atom1Id: 'o1', atom2Id: 'ho1', order: 1 },
            { id: 'b3', atom1Id: 'c1', atom2Id: 'h1', order: 1 },
            { id: 'b4', atom1Id: 'c1', atom2Id: 'h2', order: 1 },
            { id: 'b5', atom1Id: 'c1', atom2Id: 'h3', order: 1 }
          ]
        }
      }
    ]
  }
];
