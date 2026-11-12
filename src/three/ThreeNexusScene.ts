import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { INTEGRATION_CATEGORIES } from '../data/companies';
import { CategoryId, CompanyEntity } from '../types/integration';
import {
  createBadgeTexture,
  createCircuitGridTexture,
  createContactShadowTexture,
  createNodeBadgeTexture
} from './proceduralTextures';

export interface SceneCallbacks {
  onSelectCompany: (company: CompanyEntity) => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  onHoverObject: (name: string | null) => void;
}

export type CameraPreset = 'overview' | 'core' | CategoryId;

interface PulsePacket {
  curve: THREE.QuadraticBezierCurve3;
  mesh: THREE.Mesh;
  progress: number;
  speed: number;
}

export class ThreeNexusScene {
  private container: HTMLElement;
  private callbacks: SceneCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private isDestroyed: boolean = false;

  // Camera targets & damping
  private currentCameraPos = new THREE.Vector3(0, 18, 32);
  private targetCameraPos = new THREE.Vector3(0, 18, 32);
  private currentCameraLookAt = new THREE.Vector3(0, 2, 0);
  private targetCameraLookAt = new THREE.Vector3(0, 2, 0);

  // User manual drag / orbit state
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private sphericalCoords = { radius: 36, theta: Math.PI / 4, phi: Math.PI / 3.2 };

  // Core objects
  private coreGroup!: THREE.Group;
  private outerRing!: THREE.Mesh;
  private middleRing!: THREE.Mesh;
  private crystalCore!: THREE.Mesh;
  private innerGlowCore!: THREE.Mesh;

  // Categories and satellites
  private categoryGroups: Map<CategoryId, THREE.Group> = new Map();
  private companyMeshes: Map<string, { group: THREE.Group; entity: CompanyEntity; glowMesh: THREE.Mesh }> = new Map();
  private interactiveMeshes: THREE.Object3D[] = [];
  private pulsePackets: PulsePacket[] = [];

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-1000, -1000);
  private hoveredObject: THREE.Object3D | null = null;

  // Controls parameters
  private explodedDistance: number = 1.0;
  private dataSpeedMultiplier: number = 1.0;
  private isAutoRotating: boolean = true;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Detect Software WebGL
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Initialize Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 3. Setup Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030714); // Deep space tech navy
    this.scene.fog = new THREE.FogExp2(0x030714, 0.012);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentCameraLookAt);

    // 4. Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(15, 30, 20);
    keyLight.castShadow = !this.isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 5;
    keyLight.shadow.camera.far = 80;
    const d = 25;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x050b1d, 1.4);
    this.scene.add(hemiLight);

    // Point Light for glowing Core
    const corePointLight = new THREE.PointLight(0x38bdf8, 4, 35, 1.2);
    corePointLight.position.set(0, 3, 0);
    this.scene.add(corePointLight);

    // 5. Build Procedural Scene
    this.createFloorGrid();
    this.createClofastQuantumCore();
    this.createCategoryEcosystem();
    this.createConduitsAndPulsePackets();

    // 6. Bind Events
    this.bindEvents();

    // 7. Start Render Loop
    this.animate();
  }

  private createFloorGrid() {
    const gridTexture = createCircuitGridTexture();
    gridTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const planeGeo = new THREE.PlaneGeometry(160, 160);
    const planeMat = new THREE.MeshStandardMaterial({
      map: gridTexture,
      roughness: 0.85,
      metalness: 0.2,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    const floor = new THREE.Mesh(planeGeo, planeMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.receiveShadow = !this.isSoftwareGl;
    this.scene.add(floor);
  }

  /**
   * Composite 3-12 Part Procedural Clofast Quantum Core
   */
  private createClofastQuantumCore() {
    this.coreGroup = new THREE.Group();
    this.coreGroup.position.set(0, 0, 0);

    // 1. Contact shadow disc
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.8
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.05;
    this.coreGroup.add(shadowMesh);

    // 2. Base Quantum Plinth (Beveled multi-tier cylinder)
    const baseGeo = new THREE.CylinderGeometry(4.2, 4.8, 0.6, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.3;
    baseMesh.receiveShadow = !this.isSoftwareGl;
    this.coreGroup.add(baseMesh);

    // 3. Glowing Plinth Ring
    const plinthRingGeo = new THREE.TorusGeometry(4.4, 0.08, 16, 48);
    const plinthRingMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const plinthRing = new THREE.Mesh(plinthRingGeo, plinthRingMat);
    plinthRing.rotation.x = Math.PI / 2;
    plinthRing.position.y = 0.6;
    this.coreGroup.add(plinthRing);

    // 4. Outer Gimbal Torus Ring (Brushed blued steel with accents)
    const outerRingGeo = new THREE.TorusGeometry(3.6, 0.14, 24, 64);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.9,
      roughness: 0.2
    });
    this.outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    this.outerRing.position.y = 3.6;
    this.outerRing.castShadow = !this.isSoftwareGl;
    this.coreGroup.add(this.outerRing);

    // 5. Middle Gyro Ring (Gold / Amber Accent)
    const midRingGeo = new THREE.TorusGeometry(2.8, 0.1, 24, 64);
    const midRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15
    });
    this.middleRing = new THREE.Mesh(midRingGeo, midRingMat);
    this.middleRing.position.y = 3.6;
    this.middleRing.rotation.x = Math.PI / 3;
    this.coreGroup.add(this.middleRing);

    // 6. Floating Crystal Core (Octahedron/Dodecahedron with refractive feel)
    const crystalGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.2,
      roughness: 0.1,
      transmission: this.isSoftwareGl ? 0 : 0.6,
      transparent: true,
      opacity: this.isSoftwareGl ? 0.75 : 0.9,
      ior: 1.6,
      clearcoat: 1.0
    });
    this.crystalCore = new THREE.Mesh(crystalGeo, crystalMat);
    this.crystalCore.position.y = 3.6;
    this.coreGroup.add(this.crystalCore);

    // 7. Inner Emissive Singularity Orb
    const innerGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    this.innerGlowCore = new THREE.Mesh(innerGeo, innerMat);
    this.innerGlowCore.position.y = 3.6;
    this.coreGroup.add(this.innerGlowCore);

    // 8. Vertical Conduits (Top & Bottom Pylon Emitters)
    const emitterGeo = new THREE.CylinderGeometry(0.2, 0.6, 1.4, 16);
    const emitterMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2
    });
    const topEmitter = new THREE.Mesh(emitterGeo, emitterMat);
    topEmitter.position.y = 6.2;
    this.coreGroup.add(topEmitter);

    const bottomEmitter = new THREE.Mesh(emitterGeo, emitterMat);
    bottomEmitter.position.y = 1.3;
    bottomEmitter.rotation.x = Math.PI;
    this.coreGroup.add(bottomEmitter);

    // 9. Central Billboard Label for Clofast Nexus
    const badgeTexture = createBadgeTexture('CLOFAST NEXUS', 'QUANTUM SYNC ENGINE', '#38bdf8', '#071330');
    const badgeGeo = new THREE.PlaneGeometry(3.6, 1.8);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: badgeTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 5.4, 0);
    this.coreGroup.add(badgeMesh);

    // Tag for click/raycasting
    (this.crystalCore as any).userData = { type: 'core', name: 'Clofast Quantum Core' };
    this.interactiveMeshes.push(this.crystalCore);

    this.scene.add(this.coreGroup);
  }

  /**
   * Builds the 6 Category Hub Pedestals and their 3 Orbiting Company Satellites each
   */
  private createCategoryEcosystem() {
    const baseRadius = 15;
    const numCategories = INTEGRATION_CATEGORIES.length;

    INTEGRATION_CATEGORIES.forEach((cat, index) => {
      const angle = (index * 2 * Math.PI) / numCategories - Math.PI / 2;
      const x = Math.cos(angle) * baseRadius;
      const z = Math.sin(angle) * baseRadius;

      const catGroup = new THREE.Group();
      catGroup.position.set(x, 0, z);
      catGroup.userData = { categoryId: cat.id, angle, baseRadius };

      // 1. Pedestal Ground Shadow
      const shadowTex = createContactShadowTexture();
      const catShadowGeo = new THREE.PlaneGeometry(8, 8);
      const catShadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.6
      });
      const catShadow = new THREE.Mesh(catShadowGeo, catShadowMat);
      catShadow.rotation.x = -Math.PI / 2;
      catShadow.position.y = 0.04;
      catGroup.add(catShadow);

      // 2. Multi-part Pedestal Base Plinth
      const plinthGeo = new THREE.CylinderGeometry(2.0, 2.4, 0.5, 24);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0x0b1329,
        metalness: 0.8,
        roughness: 0.25
      });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = 0.25;
      catGroup.add(plinth);

      // Glowing Base Ring
      const ringGeo = new THREE.TorusGeometry(2.1, 0.06, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(cat.color) });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.5;
      catGroup.add(ring);

      // 3. Central Hub Column
      const columnGeo = new THREE.CylinderGeometry(0.8, 1.1, 2.2, 18);
      const columnMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.7,
        roughness: 0.3
      });
      const column = new THREE.Mesh(columnGeo, columnMat);
      column.position.y = 1.6;
      catGroup.add(column);

      // Top holographic projection dish
      const dishGeo = new THREE.CylinderGeometry(1.4, 0.7, 0.3, 24);
      const dishMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2
      });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.position.y = 2.85;
      catGroup.add(dish);

      // Holographic glowing orb on top
      const hubOrbGeo = new THREE.SphereGeometry(0.55, 24, 24);
      const hubOrbMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(cat.color),
        emissive: new THREE.Color(cat.color),
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const hubOrb = new THREE.Mesh(hubOrbGeo, hubOrbMat);
      hubOrb.position.y = 3.4;
      hubOrb.userData = { type: 'category', categoryId: cat.id, name: cat.title };
      this.interactiveMeshes.push(hubOrb);
      catGroup.add(hubOrb);

      // 4. Category Title Badge Billboard
      const catBadgeTex = createBadgeTexture(cat.title, 'CATEGORY HUB', cat.color, '#060f26');
      catBadgeTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      const catBadgeGeo = new THREE.PlaneGeometry(3.2, 1.6);
      const catBadgeMat = new THREE.MeshBasicMaterial({
        map: catBadgeTex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const catBadge = new THREE.Mesh(catBadgeGeo, catBadgeMat);
      catBadge.position.set(0, 4.8, 0);
      catBadge.userData = { isBillboard: true };
      catGroup.add(catBadge);

      // 5. 3 Orbiting Company Satellite Nodes
      const satelliteRadius = 3.6;
      cat.companies.forEach((company, compIdx) => {
        const compAngle = (compIdx * 2 * Math.PI) / 3;
        const compX = Math.cos(compAngle) * satelliteRadius;
        const compZ = Math.sin(compAngle) * satelliteRadius;
        const compY = 2.4 + (compIdx % 2 === 0 ? 0.6 : -0.2);

        const satelliteGroup = new THREE.Group();
        satelliteGroup.position.set(compX, compY, compZ);
        satelliteGroup.userData = {
          orbitAngle: compAngle,
          baseY: compY,
          radius: satelliteRadius,
          companyId: company.id
        };

        // Satellite Core Node (Hexagonal prism / Sphere)
        const satNodeGeo = new THREE.DodecahedronGeometry(0.65, 0);
        const satNodeMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.9,
          roughness: 0.2
        });
        const satNode = new THREE.Mesh(satNodeGeo, satNodeMat);
        satNode.castShadow = !this.isSoftwareGl;
        satelliteGroup.add(satNode);

        // Emissive company color ring
        const satRingGeo = new THREE.TorusGeometry(0.85, 0.05, 12, 32);
        const satRingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(company.color) });
        const satRing = new THREE.Mesh(satRingGeo, satRingMat);
        satRing.rotation.x = Math.PI / 2;
        satelliteGroup.add(satRing);

        // Hover glow sphere (invisible until hover)
        const glowGeo = new THREE.SphereGeometry(0.9, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(company.color),
          transparent: true,
          opacity: 0.15,
          wireframe: true
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        satelliteGroup.add(glowMesh);

        // Company Badge Disc Texture (Shows Company Name crisp and clear in 3D)
        const badgeDiscTex = createNodeBadgeTexture(company.name, company.color);
        badgeDiscTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        const badgeDiscGeo = new THREE.CircleGeometry(0.7, 32);
        const badgeDiscMat = new THREE.MeshBasicMaterial({
          map: badgeDiscTex,
          transparent: true,
          side: THREE.DoubleSide
        });
        const badgeDisc = new THREE.Mesh(badgeDiscGeo, badgeDiscMat);
        badgeDisc.position.set(0, 1.1, 0);
        badgeDisc.userData = { isBillboard: true };
        satelliteGroup.add(badgeDisc);

        // Tether laser line to the category hub orb
        const tetherGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-compX, 3.4 - compY, -compZ)
        ]);
        const tetherMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(company.color),
          transparent: true,
          opacity: 0.45
        });
        const tetherLine = new THREE.Line(tetherGeo, tetherMat);
        satelliteGroup.add(tetherLine);

        // Register interactive target
        satNode.userData = {
          type: 'company',
          companyId: company.id,
          name: company.name,
          category: cat.id
        };
        this.interactiveMeshes.push(satNode);

        catGroup.add(satelliteGroup);

        this.companyMeshes.set(company.id, {
          group: satelliteGroup,
          entity: company,
          glowMesh
        });
      });

      this.categoryGroups.set(cat.id, catGroup);
      this.scene.add(catGroup);
    });
  }

  /**
   * Conduits and dynamic pulse packets flowing between Central Core and Category Hubs
   */
  private createConduitsAndPulsePackets() {
    this.categoryGroups.forEach((catGroup, catId) => {
      const catData = INTEGRATION_CATEGORIES.find((c) => c.id === catId);
      const colorHex = catData ? catData.color : '#38bdf8';

      // Quadratic Bezier Curve from Clofast Core (0, 3.6, 0) arching to Cat Hub (catGroup.x, 3.0, catGroup.z)
      const start = new THREE.Vector3(0, 3.6, 0);
      const end = new THREE.Vector3(catGroup.position.x, 3.2, catGroup.position.z);
      // Midpoint pulled upwards and slightly outward
      const mid = new THREE.Vector3(
        catGroup.position.x * 0.5,
        5.2,
        catGroup.position.z * 0.5
      );

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      // 1. Tube Conduit Geometry
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.7,
        roughness: 0.3
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(tubeMesh);

      // 2. Pulse Packets traveling on each curve
      for (let p = 0; p < 2; p++) {
        const pulseGeo = new THREE.SphereGeometry(0.2, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: 0xffffff
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        this.scene.add(pulseMesh);

        this.pulsePackets.push({
          curve,
          mesh: pulseMesh,
          progress: p * 0.5,
          speed: 0.004 + Math.random() * 0.003
        });
      }
    });
  }

  /**
   * Triggers an animated high-velocity data packet burst between two systems
   */
  public triggerSyncPulse(sourceId: string, targetId: string) {
    const burstCount = 6;
    for (let i = 0; i < burstCount; i++) {
      const burstGeo = new THREE.SphereGeometry(0.28, 12, 12);
      const burstMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const burstMesh = new THREE.Mesh(burstGeo, burstMat);
      this.scene.add(burstMesh);

      const randomCurve = this.pulsePackets[Math.floor(Math.random() * this.pulsePackets.length)].curve;
      this.pulsePackets.push({
        curve: randomCurve,
        mesh: burstMesh,
        progress: (i / burstCount) * 0.2,
        speed: 0.012
      });

      // Cleanup after 3 seconds
      setTimeout(() => {
        this.scene.remove(burstMesh);
        burstMesh.geometry.dispose();
      }, 3200);
    }
  }

  // Camera preset transitions
  public setCameraPreset(preset: CameraPreset) {
    this.isAutoRotating = false;

    if (preset === 'overview') {
      this.targetCameraPos.set(0, 24, 38);
      this.targetCameraLookAt.set(0, 2, 0);
    } else if (preset === 'core') {
      this.targetCameraPos.set(0, 7, 10);
      this.targetCameraLookAt.set(0, 3.6, 0);
    } else {
      const catGroup = this.categoryGroups.get(preset);
      if (catGroup) {
        // Position camera slightly offset from the selected category pedestal
        const catPos = catGroup.position;
        const offsetDir = catPos.clone().normalize();
        this.targetCameraPos.set(
          catPos.x + offsetDir.x * 7,
          catPos.y + 6.5,
          catPos.z + offsetDir.z * 7
        );
        this.targetCameraLookAt.set(catPos.x, catPos.y + 3.2, catPos.z);
      }
    }
  }

  public setExplodedDistance(dist: number) {
    this.explodedDistance = dist;
    // Reposition category groups radially
    this.categoryGroups.forEach((group) => {
      const angle = group.userData.angle;
      const baseRadius = group.userData.baseRadius;
      const newRadius = baseRadius * dist;
      group.position.x = Math.cos(angle) * newRadius;
      group.position.z = Math.sin(angle) * newRadius;
    });
  }

  public setDataSpeed(multiplier: number) {
    this.dataSpeedMultiplier = multiplier;
  }

  public toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
  }

  public resetView() {
    this.setCameraPreset('overview');
    this.isAutoRotating = true;
  }

  private bindEvents() {
    window.addEventListener('resize', this.onResize);
    const canvas = this.renderer.domElement;
    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('wheel', this.onWheel, { passive: true });
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: true });
  }

  private onResize = () => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    this.isDragging = true;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
    this.isAutoRotating = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.sphericalCoords.theta -= deltaX * 0.006;
      this.sphericalCoords.phi = Math.max(
        0.15,
        Math.min(Math.PI / 2 - 0.05, this.sphericalCoords.phi - deltaY * 0.006)
      );

      this.updateCameraFromSpherical();
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  };

  private onMouseUp = () => {
    this.isDragging = false;
  };

  private onWheel = (e: WheelEvent) => {
    this.isAutoRotating = false;
    this.sphericalCoords.radius = Math.max(8, Math.min(65, this.sphericalCoords.radius + e.deltaY * 0.03));
    this.updateCameraFromSpherical();
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      this.isAutoRotating = false;
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (this.isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.sphericalCoords.theta -= deltaX * 0.008;
      this.sphericalCoords.phi = Math.max(
        0.15,
        Math.min(Math.PI / 2 - 0.05, this.sphericalCoords.phi - deltaY * 0.008)
      );

      this.updateCameraFromSpherical();
      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  private updateCameraFromSpherical() {
    const { radius, theta, phi } = this.sphericalCoords;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    this.targetCameraPos.set(
      this.targetCameraLookAt.x + x,
      Math.max(1.5, this.targetCameraLookAt.y + y),
      this.targetCameraLookAt.z + z
    );
  }

  private onClick = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, false);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      const data = obj.userData;

      if (data.type === 'company') {
        const found = this.companyMeshes.get(data.companyId);
        if (found) {
          this.callbacks.onSelectCompany(found.entity);
        }
      } else if (data.type === 'category') {
        this.callbacks.onSelectCategory(data.categoryId);
        this.setCameraPreset(data.categoryId);
      } else if (data.type === 'core') {
        this.setCameraPreset('core');
      }
    }
  };

  /**
   * Continuous 60fps Loop with smooth exponential damping and Software-WebGL pacing
   */
  private animate = () => {
    if (this.isDestroyed) return;

    const clockDelta = 0.016; // 60fps base

    // 1. Auto-rotation if enabled
    if (this.isAutoRotating) {
      this.sphericalCoords.theta += 0.0015;
      this.updateCameraFromSpherical();
    }

    // 2. Exponential Camera Damping (1 - Math.exp(-k * dt))
    const dampK = 5.0;
    const alpha = 1 - Math.exp(-dampK * clockDelta);
    this.currentCameraPos.lerp(this.targetCameraPos, alpha);
    this.currentCameraLookAt.lerp(this.targetCameraLookAt, alpha);

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentCameraLookAt);

    // 3. Clofast Core Procedural Animation
    if (this.outerRing) {
      this.outerRing.rotation.z += 0.008;
      this.outerRing.rotation.y += 0.004;
    }
    if (this.middleRing) {
      this.middleRing.rotation.x += 0.012;
      this.middleRing.rotation.z -= 0.007;
    }
    if (this.crystalCore) {
      this.crystalCore.rotation.y += 0.01;
      this.crystalCore.rotation.x += 0.006;
    }
    if (this.innerGlowCore) {
      const scale = 0.8 + Math.sin(Date.now() * 0.004) * 0.08;
      this.innerGlowCore.scale.set(scale, scale, scale);
    }

    // 4. Orbiting Company Satellites Animation
    const now = Date.now() * 0.001;
    this.companyMeshes.forEach(({ group }, _) => {
      const baseAngle = group.userData.orbitAngle;
      const radius = group.userData.radius;
      const baseY = group.userData.baseY;

      // Gentle floating bob
      const curAngle = baseAngle + now * 0.3 * this.dataSpeedMultiplier;
      group.position.x = Math.cos(curAngle) * radius;
      group.position.z = Math.sin(curAngle) * radius;
      group.position.y = baseY + Math.sin(now * 2 + baseAngle) * 0.15;
    });

    // 5. Billboard Alignment (Make badges face the camera)
    this.scene.traverse((obj) => {
      if (obj.userData?.isBillboard) {
        obj.quaternion.copy(this.camera.quaternion);
      }
    });

    // 6. Pulse Packets Motion
    for (const pulse of this.pulsePackets) {
      pulse.progress = (pulse.progress + pulse.speed * this.dataSpeedMultiplier) % 1.0;
      const pt = pulse.curve.getPoint(pulse.progress);
      pulse.mesh.position.copy(pt);
    }

    // 7. Raycast Hover Feedback
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, false);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      if (this.hoveredObject !== hitObj) {
        this.hoveredObject = hitObj;
        document.body.style.cursor = 'pointer';
        this.callbacks.onHoverObject(hitObj.userData.name || null);

        // Highlight matching company glow mesh
        if (hitObj.userData.type === 'company') {
          const compEntry = this.companyMeshes.get(hitObj.userData.companyId);
          if (compEntry) {
            compEntry.glowMesh.scale.set(1.4, 1.4, 1.4);
            (compEntry.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.45;
          }
        }
      }
    } else {
      if (this.hoveredObject) {
        document.body.style.cursor = 'default';
        this.callbacks.onHoverObject(null);
        // Reset all glow meshes
        this.companyMeshes.forEach((entry) => {
          entry.glowMesh.scale.set(1, 1, 1);
          (entry.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.15;
        });
        this.hoveredObject = null;
      }
    }

    // 8. Render Frame
    this.renderer.render(this.scene, this.camera);

    // Schedule next frame with software-WebGL guard
    if (this.isSoftwareGl) {
      this.afterDraw(this.animate);
    } else {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  /**
   * Software WebGL fenceSync pacing to prevent main-thread starvation
   */
  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (!gl || typeof gl.fenceSync !== 'function') {
      this.frameId = window.setTimeout(cb, 40);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.isDestroyed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 6);
      } else {
        gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 60);
      }
    };
    this.frameId = window.setTimeout(poll, 6);
  }

  public dispose() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
