import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ExternalFieldsConfig, MolecularOrbitalType, Molecule3D, ViewMode, VRMode, ZoomLevel } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';
import { calculateQuantumDipole, computeIntermolecularForces, evaluateMolecularOrbital } from '../utils/quantumEngine';
import { sounds } from '../utils/audio';

interface VRCanvasProps {
  molecule: Molecule3D;
  viewMode: ViewMode;
  vrMode: VRMode;
  zoomLevel: ZoomLevel;
  selectedAtomId: string | null;
  onSelectAtom: (id: string | null) => void;
  onAtomMove?: (id: string, x: number, y: number, z: number) => void;
  onVRAction?: () => void;
  quantumParticlesCount: number;
  higgsFieldStrength: number;
  activeOrbital: string; // '1s' | '2s' | '2p' | '3d'
  selectedMolecularOrbital?: MolecularOrbitalType;
  showMolecularOrbital?: boolean;
  showDipole: boolean;
  showIntermolecularForces?: boolean;
  externalFields?: ExternalFieldsConfig;
  ipd: number; // Interpupillary distance in mm
  onGazeProgress?: (progress: number) => void; // 0 to 1
}

export const VRCanvas: React.FC<VRCanvasProps> = ({
  molecule,
  viewMode,
  vrMode,
  zoomLevel,
  selectedAtomId,
  onSelectAtom,
  onAtomMove,
  onVRAction,
  quantumParticlesCount,
  higgsFieldStrength,
  activeOrbital,
  selectedMolecularOrbital = 'HOMO',
  showMolecularOrbital = false,
  showDipole,
  showIntermolecularForces = false,
  externalFields,
  ipd,
  onGazeProgress
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cameraLRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cameraRRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Group references
  const moleculeGroupRef = useRef<THREE.Group>(new THREE.Group());
  const molecularOrbitalGroupRef = useRef<THREE.Group>(new THREE.Group());
  const orbitalsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const quantumFieldGroupRef = useRef<THREE.Group>(new THREE.Group());
  const externalFieldsGroupRef = useRef<THREE.Group>(new THREE.Group());

  // Interactive tracking
  const atomMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const gazeTargetRef = useRef<string | null>(null);
  const gazeStartTimeRef = useRef<number>(0);
  const isDraggingAtomRef = useRef<string | null>(null);

  // Orientation and motion tracking for Android / Mobile
  const orientationRef = useRef<{ alpha: number; beta: number; gamma: number } | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 });
  const orbitRef = useRef({ theta: 0.2, phi: 0.3, radius: 9, target: new THREE.Vector3(0, 0, 0) });

  // 1. Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Deep obsidian
    scene.fog = new THREE.FogExp2(0x030712, 0.015);
    sceneRef.current = scene;

    // Cameras
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);
    cameraRef.current = camera;

    const cameraL = new THREE.PerspectiveCamera(55, (width / 2) / height, 0.1, 1000);
    const cameraR = new THREE.PerspectiveCamera(55, (width / 2) / height, 0.1, 1000);
    cameraLRef.current = cameraL;
    cameraRRef.current = cameraR;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Three-point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.8);
    fillLight.position.set(-10, -6, -8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // Subtle background quantum grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // Attach group layers
    scene.add(moleculeGroupRef.current);
    scene.add(molecularOrbitalGroupRef.current);
    scene.add(orbitalsGroupRef.current);
    scene.add(quantumFieldGroupRef.current);
    scene.add(externalFieldsGroupRef.current);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();

      if (cameraLRef.current && cameraRRef.current) {
        cameraLRef.current.aspect = (w / 2) / h;
        cameraLRef.current.updateProjectionMatrix();
        cameraRRef.current.aspect = (w / 2) / h;
        cameraRRef.current.updateProjectionMatrix();
      }
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Device orientation handler for Android / mobile
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        orientationRef.current = {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        };
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleOrientation);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Camera target adjustment based on Zoom Level
  useEffect(() => {
    sounds.playZoom();
    const targets = {
      macro: { radius: 16, fov: 60 },
      molecular: { radius: 8.5, fov: 55 },
      atomic: { radius: 4.5, fov: 50 },
      quantum: { radius: 3.2, fov: 55 }
    };
    const cfg = targets[zoomLevel];
    orbitRef.current.radius = cfg.radius;
    if (cameraRef.current) {
      cameraRef.current.fov = cfg.fov;
      cameraRef.current.updateProjectionMatrix();
    }
    if (cameraLRef.current && cameraRRef.current) {
      cameraLRef.current.fov = cfg.fov;
      cameraLRef.current.updateProjectionMatrix();
      cameraRRef.current.fov = cfg.fov;
      cameraRRef.current.updateProjectionMatrix();
    }
  }, [zoomLevel]);

  // 3. Build Molecule 3D Meshes & Atomic Radii / Intermolecular Interactions
  useEffect(() => {
    const group = moleculeGroupRef.current;
    // Clear old meshes
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
      group.remove(child);
    }
    atomMeshesRef.current.clear();

    const isVisibleInZoom = zoomLevel === 'macro' || zoomLevel === 'molecular';
    group.visible = isVisibleInZoom;
    if (!isVisibleInZoom) return;

    // Materials cache for atoms
    const materialsCache: Record<string, THREE.MeshPhysicalMaterial> = {};

    molecule.atoms.forEach(atom => {
      const elem = ELEMENTS[atom.symbol] || {
        atomicRadius: 0.8,
        covalentRadius: 0.7,
        vdwRadius: 1.5,
        cpkColor: '#9CA3AF'
      };

      let radius = elem.covalentRadius * 0.7;
      if (viewMode === 'space-filling') {
        radius = elem.vdwRadius * 0.6;
      } else if (viewMode === 'wireframe') {
        radius = 0.15;
      } else if (viewMode === 'atomic-radii') {
        radius = elem.atomicRadius * 0.8;
      }

      const geom = new THREE.SphereGeometry(radius, 32, 32);

      const colorKey = `${atom.symbol}_${atom.id === selectedAtomId ? 'sel' : 'norm'}`;
      if (!materialsCache[colorKey]) {
        materialsCache[colorKey] = new THREE.MeshPhysicalMaterial({
          color: atom.id === selectedAtomId ? 0x38bdf8 : new THREE.Color(elem.cpkColor),
          roughness: 0.25,
          metalness: 0.15,
          clearcoat: 0.4,
          clearcoatRoughness: 0.2,
          emissive: atom.id === selectedAtomId ? 0x0284c7 : 0x000000,
          emissiveIntensity: atom.id === selectedAtomId ? 0.6 : 0
        });
      }

      const mesh = new THREE.Mesh(geom, materialsCache[colorKey]);
      mesh.position.set(atom.x, atom.y, atom.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { atomId: atom.id, symbol: atom.symbol };

      group.add(mesh);
      atomMeshesRef.current.set(atom.id, mesh);

      // Render translucent Van der Waals / Atomic Shell overlay if viewMode === 'atomic-radii'
      if (viewMode === 'atomic-radii') {
        const vdwGeom = new THREE.SphereGeometry(elem.vdwRadius * 0.7, 24, 24);
        const vdwMat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(elem.cpkColor),
          transparent: true,
          opacity: 0.2,
          roughness: 0.1,
          wireframe: true
        });
        const vdwMesh = new THREE.Mesh(vdwGeom, vdwMat);
        vdwMesh.position.set(atom.x, atom.y, atom.z);
        group.add(vdwMesh);
      }
    });

    // Build Bonds
    const cylinderGeomSingle = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
    const bondMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.1
    });

    const hydrogenBondMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      wireframe: true
    });

    molecule.bonds.forEach(bond => {
      const a1 = molecule.atoms.find(a => a.id === bond.atom1Id);
      const a2 = molecule.atoms.find(a => a.id === bond.atom2Id);
      if (!a1 || !a2) return;

      const p1 = new THREE.Vector3(a1.x, a1.y, a1.z);
      const p2 = new THREE.Vector3(a2.x, a2.y, a2.z);
      const dist = p1.distanceTo(p2);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

      if (bond.order === 2) {
        // Double bond: 2 offset cylinders
        const offsetAxis = new THREE.Vector3(0, 0, 1).cross(dir).normalize().multiplyScalar(0.1);
        [-1, 1].forEach(side => {
          const bMesh = new THREE.Mesh(cylinderGeomSingle, bondMat);
          bMesh.scale.set(0.06, dist, 0.06);
          bMesh.position.copy(mid).addScaledVector(offsetAxis, side);
          bMesh.quaternion.copy(quaternion);
          group.add(bMesh);
        });
      } else if (bond.order === 3) {
        // Triple bond
        const offsetAxis = new THREE.Vector3(0, 0, 1).cross(dir).normalize().multiplyScalar(0.12);
        [-1, 0, 1].forEach(side => {
          const bMesh = new THREE.Mesh(cylinderGeomSingle, bondMat);
          bMesh.scale.set(0.05, dist, 0.05);
          bMesh.position.copy(mid).addScaledVector(offsetAxis, side);
          bMesh.quaternion.copy(quaternion);
          group.add(bMesh);
        });
      } else {
        // Single or hydrogen bond
        const bMesh = new THREE.Mesh(cylinderGeomSingle, bond.order === 0.5 ? hydrogenBondMat : bondMat);
        bMesh.scale.set(bond.order === 0.5 ? 0.04 : 0.08, dist, bond.order === 0.5 ? 0.04 : 0.08);
        bMesh.position.copy(mid);
        bMesh.quaternion.copy(quaternion);
        group.add(bMesh);
      }
    });

    // Render Quantum Dipole Moment Arrow
    if (showDipole && molecule.atoms.length > 1) {
      const qDipole = calculateQuantumDipole(molecule.atoms, molecule.bonds, externalFields);
      const dipoleDir = new THREE.Vector3(...qDipole.dipoleVector);
      const dipoleLength = dipoleDir.length();
      if (dipoleLength > 0.1) {
        const arrow = new THREE.ArrowHelper(
          dipoleDir.normalize(),
          new THREE.Vector3(0, 0, 0),
          Math.min(dipoleLength * 0.6, 4.0),
          0x06b6d4,
          0.4,
          0.25
        );
        group.add(arrow);
      }
    }

    // Render Intermolecular Interaction Forces (Lennard-Jones, H-bonds)
    if (showIntermolecularForces && molecule.atoms.length > 1) {
      const interactions = computeIntermolecularForces(molecule.atoms, molecule.bonds);
      interactions.forEach(inter => {
        const a1 = molecule.atoms.find(a => a.id === inter.atom1Id);
        const a2 = molecule.atoms.find(a => a.id === inter.atom2Id);
        if (!a1 || !a2) return;

        const points = [
          new THREE.Vector3(a1.x, a1.y, a1.z),
          new THREE.Vector3(a2.x, a2.y, a2.z)
        ];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
        let lineColor = 0xa855f7; // purple VdW
        if (inter.type === 'hydrogen-bond') lineColor = 0x38bdf8;
        else if (inter.type === 'coulomb-repulsion') lineColor = 0xf43f5e;
        else if (inter.type === 'coulomb-attraction') lineColor = 0x10b981;

        const lineMat = new THREE.LineDashedMaterial({
          color: lineColor,
          dashSize: 0.15,
          gapSize: 0.1
        });
        const line = new THREE.Line(lineGeom, lineMat);
        line.computeLineDistances();
        group.add(line);
      });
    }

  }, [molecule, viewMode, selectedAtomId, zoomLevel, showDipole, showIntermolecularForces, externalFields]);


  // 4. Build Molecular Orbitals (HOMO/LUMO/Sigma/Pi) Cloud Layer
  useEffect(() => {
    const group = molecularOrbitalGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child instanceof THREE.Points) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
      group.remove(child);
    }

    if (!showMolecularOrbital || (zoomLevel !== 'molecular' && zoomLevel !== 'atomic')) return;

    // Grid sampling of LCAO Wavefunction psi_MO(x,y,z)
    const particleCount = 14000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cPos = new THREE.Color(0x38bdf8); // Cyan for +
    const cNeg = new THREE.Color(0xf43f5e); // Rose for -

    let idx = 0;
    const bounds = 4.5;

    for (let i = 0; i < particleCount * 2; i++) {
      if (idx >= particleCount) break;

      const x = (Math.random() - 0.5) * bounds * 2;
      const y = (Math.random() - 0.5) * bounds * 2;
      const z = (Math.random() - 0.5) * bounds * 2;

      const mo = evaluateMolecularOrbital(
        molecule.atoms,
        molecule.bonds,
        selectedMolecularOrbital,
        x,
        y,
        z
      );

      // Rejection sampling based on probability density |psi|^2
      if (Math.random() < mo.probabilityDensity * 12.0) {
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        const col = mo.phase > 0 ? cPos : cNeg;
        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        idx++;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, idx * 3), 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, idx * 3), 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geom, pMat);
    group.add(points);

  }, [molecule, selectedMolecularOrbital, showMolecularOrbital, zoomLevel]);


  // 5. Build External Physical Fields Overlay (Electric & Magnetic Vector Field Lines)
  useEffect(() => {
    const group = externalFieldsGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
      }
      group.remove(child);
    }

    if (!externalFields) return;

    const [Ex, Ey, Ez] = externalFields.electricField;
    const [Bx, By, Bz] = externalFields.magneticField;

    const eMag = Math.hypot(Ex, Ey, Ez);
    const bMag = Math.hypot(Bx, By, Bz);

    // Render Electric Field Arrows
    if (eMag > 0.05) {
      const eDir = new THREE.Vector3(Ex, Ey, Ez).normalize();
      [-3, 0, 3].forEach(offset => {
        const arrow = new THREE.ArrowHelper(
          eDir,
          new THREE.Vector3(offset, -3.5, 0),
          3.0,
          0xf59e0b,
          0.5,
          0.3
        );
        group.add(arrow);
      });
    }

    // Render Magnetic Field Vector Lines
    if (bMag > 0.05) {
      const bDir = new THREE.Vector3(Bx, By, Bz).normalize();
      [-3, 0, 3].forEach(offset => {
        const arrow = new THREE.ArrowHelper(
          bDir,
          new THREE.Vector3(-3.5, offset, 0),
          3.0,
          0x10b981,
          0.5,
          0.3
        );
        group.add(arrow);
      });
    }

  }, [externalFields]);


  // 6. Build Atomic Orbitals 3D Quantum Cloud
  useEffect(() => {
    const group = orbitalsGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child instanceof THREE.Points) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
      group.remove(child);
    }

    const isVisibleInZoom = zoomLevel === 'atomic';
    group.visible = isVisibleInZoom;
    if (!isVisibleInZoom) return;

    // Generate Schrödinger wave function probability density particles
    const particleCount = 18000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cPositive = new THREE.Color(0x38bdf8); // Cyan for + phase
    const cNegative = new THREE.Color(0xf43f5e); // Rose for - phase
    const cNeutral = new THREE.Color(0xa855f7); // Violet

    let idx = 0;
    for (let i = 0; i < particleCount; i++) {
      let r = 0;
      let theta = Math.acos(2 * Math.random() - 1);
      let phi = Math.random() * Math.PI * 2;
      let phaseColor = cNeutral;

      if (activeOrbital === '1s') {
        r = -Math.log(1 - Math.random() * 0.98) * 1.3;
        phaseColor = cPositive;
      } else if (activeOrbital === '2s') {
        r = Math.random() * 5.5;
        const radialPart = (2 - r) * Math.exp(-r / 2);
        if (Math.random() > radialPart * radialPart * 1.5) continue;
        phaseColor = radialPart > 0 ? cPositive : cNegative;
      } else if (activeOrbital === '2p') {
        r = Math.random() * 6.0;
        const prob = Math.cos(theta) * Math.cos(theta) * r * r * Math.exp(-r);
        if (Math.random() > prob * 2.2) continue;
        phaseColor = Math.cos(theta) > 0 ? cPositive : cNegative;
      } else if (activeOrbital === '3d') {
        r = Math.random() * 7.0;
        const angular = 3 * Math.cos(theta) * Math.cos(theta) - 1;
        const prob = angular * angular * r * r * Math.exp(-2 * r / 3);
        if (Math.random() > prob * 1.8) continue;
        phaseColor = angular > 0 ? cPositive : cNegative;
      }

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.cos(theta);
      const z = r * Math.sin(theta) * Math.sin(phi);

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      colors[idx * 3] = phaseColor.r;
      colors[idx * 3 + 1] = phaseColor.g;
      colors[idx * 3 + 2] = phaseColor.b;
      idx++;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, idx * 3), 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, idx * 3), 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geom, pMat);
    group.add(points);

    // Add Central Nucleus
    const nucleusGeom = new THREE.SphereGeometry(0.35, 24, 24);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    group.add(nucleus);

  }, [activeOrbital, zoomLevel]);

  // 7. Build Quantum Vacuum & Matter Field Genesis
  useEffect(() => {
    const group = quantumFieldGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
      group.remove(child);
    }

    const isVisibleInZoom = zoomLevel === 'quantum';
    group.visible = isVisibleInZoom;
    if (!isVisibleInZoom) return;

    const planeGeom = new THREE.PlaneGeometry(16, 16, 64, 64);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      emissive: 0x4338ca,
      emissiveIntensity: 0.4
    });
    const plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.5;
    plane.name = 'quantumGrid';
    group.add(plane);

    const pCount = Math.max(12, quantumParticlesCount * 3);
    const particlesGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 6;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const isElectron = i % 2 === 0;
      pCol[i * 3] = isElectron ? 0.2 : 0.95;
      pCol[i * 3 + 1] = isElectron ? 0.7 : 0.25;
      pCol[i * 3 + 2] = isElectron ? 0.95 : 0.4;
    }

    particlesGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particlesGeom.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeom, particlesMat);
    particles.name = 'vacuumParticles';
    group.add(particles);

    const higgsGeom = new THREE.IcosahedronGeometry(0.8 + higgsFieldStrength * 0.4, 2);
    const higgsMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.9,
      wireframe: true,
      roughness: 0.1
    });
    const higgsCore = new THREE.Mesh(higgsGeom, higgsMat);
    higgsCore.name = 'higgsCore';
    group.add(higgsCore);

  }, [quantumParticlesCount, higgsFieldStrength, zoomLevel]);

  // 8. Animation Loop (60 FPS WebGL / Stereoscopic Dual-Camera VR)
  useEffect(() => {
    let animId: number;
    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate molecular orbital cloud
      if (molecularOrbitalGroupRef.current) {
        molecularOrbitalGroupRef.current.rotation.y += delta * 0.2;
      }

      if (orbitalsGroupRef.current.visible) {
        orbitalsGroupRef.current.rotation.y += delta * 0.25;
      }

      if (quantumFieldGroupRef.current.visible) {
        quantumFieldGroupRef.current.rotation.y += delta * 0.15;
        const gridMesh = quantumFieldGroupRef.current.getObjectByName('quantumGrid') as THREE.Mesh;
        if (gridMesh && gridMesh.geometry) {
          const pos = gridMesh.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const u = pos.getX(i);
            const v = pos.getY(i);
            const wave = Math.sin(u * 1.5 + elapsed * 3) * Math.cos(v * 1.5 + elapsed * 2.5) * 0.25 * (1 + higgsFieldStrength * 0.5);
            pos.setZ(i, wave);
          }
          pos.needsUpdate = true;
        }

        const higgs = quantumFieldGroupRef.current.getObjectByName('higgsCore');
        if (higgs) {
          const s = 1 + Math.sin(elapsed * 4) * 0.08;
          higgs.scale.set(s, s, s);
          higgs.rotation.x += delta * 0.5;
          higgs.rotation.y += delta * 0.8;
        }
      }

      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      if (!camera || !renderer || !scene) return;

      const target = orbitRef.current.target;
      const radius = orbitRef.current.radius;

      if ((vrMode === 'cardboard' || vrMode === 'gyro360') && orientationRef.current) {
        const { alpha, beta, gamma } = orientationRef.current;
        const degToRad = Math.PI / 180;
        const radAlpha = alpha * degToRad;
        const radBeta = (beta - 90) * degToRad;
        const radGamma = gamma * degToRad;

        const euler = new THREE.Euler(radBeta, radAlpha, -radGamma, 'YXZ');
        camera.quaternion.setFromEuler(euler);

        const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        camera.position.copy(target).addScaledVector(lookDir, -radius);
      } else {
        const theta = orbitRef.current.theta;
        const phi = orbitRef.current.phi;

        camera.position.x = target.x + radius * Math.sin(theta) * Math.cos(phi);
        camera.position.y = target.y + radius * Math.sin(phi);
        camera.position.z = target.z + radius * Math.cos(theta) * Math.cos(phi);
        camera.lookAt(target);
      }

      if (vrMode === 'cardboard') {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const meshes = Array.from(atomMeshesRef.current.values());
        const intersects = raycaster.intersectObjects(meshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const atomId = hit.userData.atomId;

          if (gazeTargetRef.current === atomId) {
            const progress = Math.min(1, (performance.now() - gazeStartTimeRef.current) / 1100);
            onGazeProgress?.(progress);
            if (progress >= 1) {
              sounds.playClick();
              onSelectAtom(atomId);
              gazeStartTimeRef.current = performance.now() + 600;
            }
          } else {
            gazeTargetRef.current = atomId;
            gazeStartTimeRef.current = performance.now();
            onGazeProgress?.(0.1);
          }
        } else {
          gazeTargetRef.current = null;
          onGazeProgress?.(0);
        }
      }

      if (vrMode === 'cardboard' && cameraLRef.current && cameraRRef.current) {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;
        const halfW = Math.floor(w / 2);
        const cameraL = cameraLRef.current;
        const cameraR = cameraRRef.current;

        cameraL.quaternion.copy(camera.quaternion);
        cameraR.quaternion.copy(camera.quaternion);

        const ipdMeters = (ipd || 64) * 0.002;
        const rightVec = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

        cameraL.position.copy(camera.position).addScaledVector(rightVec, -ipdMeters / 2);
        cameraR.position.copy(camera.position).addScaledVector(rightVec, ipdMeters / 2);

        renderer.setScissorTest(true);
        renderer.setScissor(0, 0, halfW, h);
        renderer.setViewport(0, 0, halfW, h);
        renderer.render(scene, cameraL);

        renderer.setScissor(halfW, 0, halfW, h);
        renderer.setViewport(halfW, 0, halfW, h);
        renderer.render(scene, cameraR);

        renderer.setScissorTest(false);
      } else {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;
        renderer.setViewport(0, 0, w, h);
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [vrMode, ipd, higgsFieldStrength, onSelectAtom, onGazeProgress]);

  // Mouse & Touch Orbit / Drag Interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const meshes = Array.from(atomMeshesRef.current.values());
    const hits = raycaster.intersectObjects(meshes, false);

    if (hits.length > 0) {
      const atomId = hits[0].object.userData.atomId;
      sounds.playClick();
      onSelectAtom(atomId);
      isDraggingAtomRef.current = atomId;
      return;
    }

    mouseRef.current.isDown = true;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingAtomRef.current && cameraRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
      const dragPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        cameraRef.current.getWorldDirection(new THREE.Vector3()).negate(),
        new THREE.Vector3(0, 0, 0)
      );
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, intersectionPoint);

      if (intersectionPoint) {
        onAtomMove?.(
          isDraggingAtomRef.current,
          intersectionPoint.x,
          intersectionPoint.y,
          intersectionPoint.z
        );
      }
      return;
    }

    if (!mouseRef.current.isDown) return;
    const dx = e.clientX - mouseRef.current.lastX;
    const dy = e.clientY - mouseRef.current.lastY;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;

    orbitRef.current.theta -= dx * 0.008;
    orbitRef.current.phi = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, orbitRef.current.phi + dy * 0.008));
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
    isDraggingAtomRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    orbitRef.current.radius = Math.max(2.5, Math.min(25, orbitRef.current.radius + e.deltaY * 0.015));
  };

  const handleCanvasClick = () => {
    if (vrMode === 'cardboard') {
      if (gazeTargetRef.current) {
        sounds.playClick();
        onSelectAtom(gazeTargetRef.current);
      } else {
        onVRAction?.();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
    />
  );
};
