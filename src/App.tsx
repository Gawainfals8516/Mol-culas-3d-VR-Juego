/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Atom3D, Bond3D, Molecule3D, ViewMode, VRMode, ZoomLevel } from './types/chemistry';
import { PRESET_MOLECULES } from './data/molecules';
import { ELEMENTS } from './data/elements';
import { relaxMoleculeStep, calculateChemicalFormula } from './utils/vsepr';
import { sounds } from './utils/audio';

import { VRCanvas } from './components/VRCanvas';
import { TopBar } from './components/TopBar';
import { ChemDrawToolbar } from './components/ChemDrawToolbar';
import { MatterLabPanel } from './components/MatterLabPanel';
import { VRControlsOverlay } from './components/VRControlsOverlay';
import { MolecularPropertiesPanel } from './components/MolecularPropertiesPanel';
import { PeriodicTableModal } from './components/PeriodicTableModal';
import { VRGuideModal } from './components/VRGuideModal';

export default function App() {
  // 1. Core Molecular State
  const [molecule, setMolecule] = useState<Molecule3D>(PRESET_MOLECULES[2]); // Start with Caffeine
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string>('C');
  const [activeBondOrder, setActiveBondOrder] = useState<1 | 2 | 3 | 0.5>(1);

  // 2. View & VR State
  const [viewMode, setViewMode] = useState<ViewMode>('ball-and-stick');
  const [vrMode, setVRMode] = useState<VRMode>('none');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('molecular');
  const [showDipole, setShowDipole] = useState<boolean>(true);
  const [ipd, setIPD] = useState<number>(64);
  const [gazeProgress, setGazeProgress] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 3. Properties Panel State
  const [showPropertiesPanel, setShowPropertiesPanel] = useState<boolean>(true);
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState<boolean>(true);

  // 4. Quantum Field & Matter Genesis State
  const [quantumParticlesCount, setQuantumParticlesCount] = useState<number>(24);
  const [higgsFieldStrength, setHiggsFieldStrength] = useState<number>(0.65);
  const [activeOrbital, setActiveOrbital] = useState<string>('2p');
  const [matterCreatedCount, setMatterCreatedCount] = useState<number>(0);

  // 5. Modals
  const [isPeriodicTableOpen, setIsPeriodicTableOpen] = useState<boolean>(false);
  const [isVRGuideOpen, setIsVRGuideOpen] = useState<boolean>(false);

  // Real-time VSEPR relaxation loop when modifying structure
  const [isRelaxing, setIsRelaxing] = useState<boolean>(false);

  useEffect(() => {
    if (!isRelaxing) return;
    let frameId: number;
    let count = 0;

    const relaxLoop = () => {
      setMolecule(prev => ({
        ...prev,
        atoms: relaxMoleculeStep(prev.atoms, prev.bonds, null, 0.75)
      }));
      count++;
      if (count < 45) {
        frameId = requestAnimationFrame(relaxLoop);
      } else {
        setIsRelaxing(false);
      }
    };

    frameId = requestAnimationFrame(relaxLoop);
    return () => cancelAnimationFrame(frameId);
  }, [isRelaxing]);

  // Handle atom selection or bonding between 2 atoms (ChemDraw style!)
  const handleSelectAtom = useCallback((clickedId: string | null) => {
    if (!clickedId) {
      setSelectedAtomId(null);
      return;
    }

    if (selectedAtomId && selectedAtomId !== clickedId) {
      // Connect existing selected atom with clicked atom
      setMolecule(prev => {
        const existingBondIndex = prev.bonds.findIndex(b => 
          (b.atom1Id === selectedAtomId && b.atom2Id === clickedId) ||
          (b.atom1Id === clickedId && b.atom2Id === selectedAtomId)
        );

        let newBonds: Bond3D[] = [...prev.bonds];
        if (existingBondIndex >= 0) {
          // If bond exists, cycle bond order or remove if triple
          const curOrder = newBonds[existingBondIndex].order;
          if (curOrder === 1) newBonds[existingBondIndex].order = 2;
          else if (curOrder === 2) newBonds[existingBondIndex].order = 3;
          else {
            // Remove bond
            newBonds = newBonds.filter((_, idx) => idx !== existingBondIndex);
            sounds.playDelete();
            return { ...prev, bonds: newBonds };
          }
          sounds.playBond();
        } else {
          // Add new bond
          newBonds.push({
            id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            atom1Id: selectedAtomId,
            atom2Id: clickedId,
            order: activeBondOrder
          });
          sounds.playBond();
        }
        return { ...prev, bonds: newBonds };
      });
      setIsRelaxing(true);
      setSelectedAtomId(clickedId);
    } else {
      // Select atom
      setSelectedAtomId(clickedId === selectedAtomId ? null : clickedId);
    }
  }, [selectedAtomId, activeBondOrder]);

  // Add new atom to scene
  const handleAddAtom = (symbol: string) => {
    sounds.playClick();
    const newId = `a_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    let newX = (Math.random() - 0.5) * 1.5;
    let newY = (Math.random() - 0.5) * 1.5;
    let newZ = (Math.random() - 0.5) * 1.5;

    // If an atom is currently selected, place new atom nearby and connect them!
    if (selectedAtomId) {
      const parent = molecule.atoms.find(a => a.id === selectedAtomId);
      if (parent) {
        const angle = Math.random() * Math.PI * 2;
        const bondDist = 1.35;
        newX = parent.x + Math.cos(angle) * bondDist;
        newY = parent.y + Math.sin(angle) * bondDist;
        newZ = parent.z + (Math.random() - 0.5) * 0.8;
      }
    }

    const newAtom: Atom3D = {
      id: newId,
      symbol,
      x: newX,
      y: newY,
      z: newZ
    };

    setMolecule(prev => {
      const updatedAtoms = [...prev.atoms, newAtom];
      const updatedBonds = [...prev.bonds];

      if (selectedAtomId) {
        updatedBonds.push({
          id: `b_${Date.now()}`,
          atom1Id: selectedAtomId,
          atom2Id: newId,
          order: activeBondOrder
        });
        sounds.playBond();
      }

      return {
        ...prev,
        atoms: updatedAtoms,
        bonds: updatedBonds
      };
    });

    setSelectedAtomId(newId);
    setIsRelaxing(true);
  };

  // Move atom in 3D during dragging
  const handleAtomMove = (id: string, x: number, y: number, z: number) => {
    setMolecule(prev => ({
      ...prev,
      atoms: prev.atoms.map(a => a.id === id ? { ...a, x, y, z } : a)
    }));
    // Gentle real-time spring relaxation while dragging
    setMolecule(prev => ({
      ...prev,
      atoms: relaxMoleculeStep(prev.atoms, prev.bonds, id, 0.4)
    }));
  };

  // Delete selected atom
  const handleDeleteSelected = () => {
    if (!selectedAtomId) return;
    setMolecule(prev => ({
      ...prev,
      atoms: prev.atoms.filter(a => a.id !== selectedAtomId),
      bonds: prev.bonds.filter(b => b.atom1Id !== selectedAtomId && b.atom2Id !== selectedAtomId)
    }));
    setSelectedAtomId(null);
    setIsRelaxing(true);
  };

  // Auto-saturate with Hydrogens (ChemDraw feature)
  const handleAddHydrogens = () => {
    setMolecule(prev => {
      const newAtoms = [...prev.atoms];
      const newBonds = [...prev.bonds];

      prev.atoms.forEach(atom => {
        const elem = ELEMENTS[atom.symbol];
        if (!elem || atom.symbol === 'H') return;

        // Count current bond orders connected to this atom
        const currentBonds = prev.bonds.filter(b => b.atom1Id === atom.id || b.atom2Id === atom.id);
        const currentValence = currentBonds.reduce((sum, b) => sum + (b.order === 0.5 ? 0 : b.order), 0);
        const needed = Math.max(0, elem.maxBonds - currentValence);

        for (let i = 0; i < needed; i++) {
          const hId = `h_${atom.id}_${i}_${Date.now()}`;
          const angle = (i * (Math.PI * 2 / needed)) + Math.random() * 0.5;
          const dist = 1.05;

          newAtoms.push({
            id: hId,
            symbol: 'H',
            x: atom.x + Math.cos(angle) * dist,
            y: atom.y + Math.sin(angle) * dist,
            z: atom.z + (Math.random() - 0.5) * 0.8
          });

          newBonds.push({
            id: `bh_${atom.id}_${i}`,
            atom1Id: atom.id,
            atom2Id: hId,
            order: 1
          });
        }
      });

      return {
        ...prev,
        atoms: newAtoms,
        bonds: newBonds
      };
    });
    setIsRelaxing(true);
  };

  // Clear Canvas
  const handleClear = () => {
    setMolecule({
      id: 'custom',
      name: 'Nueva Molécula',
      formula: '',
      description: 'Lienzo en blanco para creación de estructuras químicas.',
      category: 'Personalizada',
      atoms: [],
      bonds: []
    });
    setSelectedAtomId(null);
  };

  // Load Preset Molecule
  const handleLoadPreset = (presetId: string) => {
    const found = PRESET_MOLECULES.find(m => m.id === presetId);
    if (found) {
      setMolecule(JSON.parse(JSON.stringify(found)));
      setSelectedAtomId(null);
      setIsRelaxing(true);
    }
  };

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(molecule, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${molecule.formula || 'molecule'}_3d.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Matter Genesis Actions
  const handleInjectEnergy = () => {
    setQuantumParticlesCount(prev => prev + 12);
    setMatterCreatedCount(prev => prev + 2); // 1 electron + 1 positron
  };

  const handleSynthesizeProton = () => {
    setMatterCreatedCount(prev => prev + 1);
  };

  const currentFormula = calculateChemicalFormula(molecule.atoms);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950 font-sans text-gray-100 select-none">
      {/* 1. TOP BAR (Only visible in normal/gyro mode, hidden during Cardboard VR for complete immersion) */}
      {vrMode !== 'cardboard' && (
        <TopBar
          zoomLevel={zoomLevel}
          onChangeZoomLevel={setZoomLevel}
          vrMode={vrMode}
          onToggleVR={() => setVRMode('cardboard')}
          formula={currentFormula}
          onOpenHelp={() => setIsVRGuideOpen(true)}
          showPropertiesPanel={showPropertiesPanel}
          onTogglePropertiesPanel={() => setShowPropertiesPanel(prev => !prev)}
        />
      )}

      {/* 2. THREE.JS 3D / VR CANVAS */}
      <VRCanvas
        molecule={molecule}
        viewMode={viewMode}
        vrMode={vrMode}
        zoomLevel={zoomLevel}
        selectedAtomId={selectedAtomId}
        onSelectAtom={handleSelectAtom}
        onAtomMove={handleAtomMove}
        quantumParticlesCount={quantumParticlesCount}
        higgsFieldStrength={higgsFieldStrength}
        activeOrbital={activeOrbital}
        showDipole={showDipole}
        ipd={ipd}
        onGazeProgress={setGazeProgress}
        onVRAction={() => {
          if (zoomLevel === 'quantum') {
            handleInjectEnergy();
          } else {
            handleAddAtom(selectedElement);
          }
        }}
      />

      {/* 3. CHEMDRAW TOOLBAR & MOLECULAR PROPERTIES (visible when in molecular/macro zoom and not in Cardboard VR) */}
      {vrMode !== 'cardboard' && (zoomLevel === 'molecular' || zoomLevel === 'macro') && (
        <>
          <div className="mt-14">
            <ChemDrawToolbar
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              activeBondOrder={activeBondOrder}
              onChangeBondOrder={setActiveBondOrder}
              onAddAtom={handleAddAtom}
              onDeleteSelected={handleDeleteSelected}
              hasSelection={!!selectedAtomId}
              onOptimizeVSEPR={() => setIsRelaxing(true)}
              onAddHydrogens={handleAddHydrogens}
              onClear={handleClear}
              onLoadPreset={handleLoadPreset}
              onOpenPeriodicTable={() => setIsPeriodicTableOpen(true)}
              onExport={handleExport}
            />
          </div>
          {showPropertiesPanel && (
            <MolecularPropertiesPanel
              molecule={molecule}
              selectedAtomId={selectedAtomId}
              isOpen={isPropertiesExpanded}
              onToggleOpen={() => setIsPropertiesExpanded(prev => !prev)}
            />
          )}
        </>
      )}

      {/* 4. MATTER LAB & QUANTUM CONTROLS (visible in all non-cardboard modes) */}
      {vrMode !== 'cardboard' && (
        <div className="mt-14">
          <MatterLabPanel
            zoomLevel={zoomLevel}
            onChangeZoomLevel={setZoomLevel}
            activeOrbital={activeOrbital}
            onChangeOrbital={setActiveOrbital}
            higgsFieldStrength={higgsFieldStrength}
            onChangeHiggsStrength={setHiggsFieldStrength}
            onInjectEnergy={handleInjectEnergy}
            onSynthesizeProton={handleSynthesizeProton}
            matterCreatedCount={matterCreatedCount}
          />
        </div>
      )}

      {/* 5. VR CONTROLS & CARDBOARD OVERLAY */}
      <VRControlsOverlay
        vrMode={vrMode}
        onChangeVRMode={setVRMode}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        showDipole={showDipole}
        onToggleDipole={() => setShowDipole(!showDipole)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          sounds.enabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
        ipd={ipd}
        onChangeIPD={setIPD}
        gazeProgress={gazeProgress}
      />

      {/* 6. MODALS */}
      <PeriodicTableModal
        isOpen={isPeriodicTableOpen}
        onClose={() => setIsPeriodicTableOpen(false)}
        onSelectElement={(sym) => {
          setSelectedElement(sym);
          handleAddAtom(sym);
        }}
      />

      <VRGuideModal
        isOpen={isVRGuideOpen}
        onClose={() => setIsVRGuideOpen(false)}
        onLaunchCardboard={() => setVRMode('cardboard')}
      />
    </div>
  );
}
