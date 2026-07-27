'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { Modelo3D, PaintStroke } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { urlDelBackend } from '@/lib/api';

const EMPTY_STROKES: PaintStroke[] = [];
/**
 * 'view' y 'rotate' se comportan igual (arrastrar rota, la rueda hace zoom);
 * 'view' además permite el giro automático. 'paint' desactiva el arrastre.
 * 'pick' es el cuentagotas: un clic toma el color del punto del modelo y no
 * modifica nada.
 */
export type ViewerInteractionMode = 'view' | 'rotate' | 'paint' | 'pick';

/**
 * El pincel trabaja en espacio 3D (no en UV).
 * Muchos modelos generados por IA reutilizan el mismo texel para zonas opuestas
 * del cuerpo (UV espejados/solapados), por lo que pintar sobre la textura
 * replicaba la mancha en lugares no deseados. Pintamos sobre un atributo de
 * vertice y lo mezclamos encima de la textura original en el shader.
 */
const BRUSH_TO_LOCAL = 2.2; // convierte el tamaño del pincel a unidades del modelo
const STROKE_OPACITY = 0.94;

interface Canvas3DViewerProps {
  modelo: Modelo3D;
  height?: string;
  autoRotate?: boolean;
  interactionMode?: ViewerInteractionMode;
  paintMode?: boolean;
  brushColor?: string;
  brushSize?: number;
  strokes?: PaintStroke[];
  onPaint?: (stroke: PaintStroke) => void;
  /**
   * Se dispara al apoyar el puntero para empezar a pintar. Permite al padre
   * agrupar en un solo paso de deshacer todo lo que produzca ese arrastre.
   */
  onPaintStart?: () => void;
  /** Color en hexadecimal tomado con el cuentagotas, en modo 'pick'. */
  onPickColor?: (hex: string) => void;
}

export interface Canvas3DViewerHandle {
  captureImage: () => string | null;
}

interface PaintTarget {
  geometry: THREE.BufferGeometry;
  position: THREE.BufferAttribute | THREE.InterleavedBufferAttribute;
  normal: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | null;
  paint: THREE.BufferAttribute;
  /** rejilla espacial (CSR) para encontrar vertices cercanos sin recorrer todo */
  gridRes: number;
  gridMin: THREE.Vector3;
  gridCell: number;
  cellStart: Uint32Array;
  cellItems: Uint32Array;
  /** radio en unidades locales = brushUnit * stroke.size */
  brushUnit: number;
}

function hexToRgb(hex: string) {
  const value = hex.trim().replace('#', '');
  const full = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value.padEnd(6, '0').slice(0, 6);
  const int = Number.parseInt(full, 16);
  if (Number.isNaN(int)) return { r: 245, g: 158, b: 11 };
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

const Canvas3DViewer = forwardRef<Canvas3DViewerHandle, Canvas3DViewerProps>(function Canvas3DViewer({
  modelo,
  height = '500px',
  autoRotate = true,
  interactionMode,
  paintMode = false,
  brushColor = '#f59e0b',
  brushSize = 0.014,
  strokes,
  onPaint,
  onPaintStart,
  onPickColor,
}, ref) {
  // La columna `pinturas` llega como null cuando el modelo nunca se ha pintado,
  // y un valor por defecto de parámetro solo cubre `undefined`. Sin esta
  // normalización, `strokes.forEach` lanzaba y el visor caía al cubo de
  // respaldo con el modelo ya cargado, mostrando ambos a la vez.
  const safeStrokes = Array.isArray(strokes) ? strokes : EMPTY_STROKES;
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modeRef = useRef<ViewerInteractionMode>('view');
  const colorRef = useRef(brushColor);
  const sizeRef = useRef(brushSize);
  const onPaintRef = useRef(onPaint);
  const onPaintStartRef = useRef(onPaintStart);
  const onPickColorRef = useRef(onPickColor);
  const autoRotateRef = useRef(autoRotate);
  /**
   * Trazos vigentes, leídos por referencia. Si el efecto que monta la escena
   * dependiera de ellos, deshacer o limpiar reconstruiría todo: se recargaría
   * el .glb y la cámara volvería a su posición inicial. Con la referencia, el
   * efecto de repintado toca solo el atributo de color.
   */
  const strokesRef = useRef<PaintStroke[]>(EMPTY_STROKES);
  /** La instala el efecto de la escena; repinta sin reconstruir nada. */
  const repaintRef = useRef<(() => void) | null>(null);
  const resolvedMode: ViewerInteractionMode = interactionMode ?? (paintMode ? 'paint' : 'view');

  useEffect(() => {
    modeRef.current = resolvedMode;
    colorRef.current = brushColor;
    sizeRef.current = brushSize;
    onPaintRef.current = onPaint;
    onPaintStartRef.current = onPaintStart;
    onPickColorRef.current = onPickColor;
    autoRotateRef.current = autoRotate;
    const canvas = rendererRef.current?.domElement;
    if (canvas) canvas.style.cursor = cursorForMode(resolvedMode);
  }, [resolvedMode, brushColor, brushSize, onPaint, onPaintStart, onPickColor, autoRotate]);

  /**
   * Repinta cuando cambian los trazos (deshacer, limpiar, cargar otra versión)
   * sin reconstruir la escena, de modo que el encuadre no se mueva.
   */
  useEffect(() => {
    strokesRef.current = safeStrokes;
    repaintRef.current?.();
  }, [safeStrokes]);

  useImperativeHandle(ref, () => ({
    captureImage: () => {
      try {
        return rendererRef.current?.domElement.toDataURL('image/png') || null;
      } catch (error) {
        console.error('No se pudo capturar el modelo 3D:', error);
        return null;
      }
    },
  }), []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = cursorForMode(modeRef.current);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    scene.add(new THREE.HemisphereLight(0x87ceeb, 0x362d1e, 0.7));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.05);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    scene.add(new THREE.GridHelper(30, 30, 0x1a3a2a, 0x111827));

    let disposed = false;
    let loadedObject: THREE.Object3D | null = null;
    let dragging = false;
    let painting = false;
    let previous = { x: 0, y: 0 };
    let theta = 0;
    let phi = Math.PI / 4;
    let radius = 15;
    let lastPaintAt = 0;
    let lastPaintStroke: PaintStroke | null = null;
    const target = new THREE.Vector3(0, 2, 0);
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const modelMeshes: THREE.Mesh[] = [];
    const paintTargets = new Map<string, PaintTarget>();
    const disposableMaterials: THREE.Material[] = [];
    const disposableGeometries: THREE.BufferGeometry[] = [];

    const updateCamera = () => {
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.cos(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.sin(theta),
      );
      camera.lookAt(target);
    };
    updateCamera();

    /**
     * Inyecta la capa de pintura en el material original: conserva textura,
     * normales y PBR, y solo mezcla el color pintado donde hay cobertura.
     */
    const makePaintable = (source: THREE.Material) => {
      const material = source.clone();
      material.onBeforeCompile = (shader) => {
        shader.vertexShader = `attribute vec4 aPaint;\nvarying vec4 vPaint;\n${shader.vertexShader}`.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\n  vPaint = aPaint;',
        );
        shader.fragmentShader = `varying vec4 vPaint;\n${shader.fragmentShader}`.replace(
          '#include <map_fragment>',
          '#include <map_fragment>\n  diffuseColor.rgb = mix(diffuseColor.rgb, pow(vPaint.rgb, vec3(2.2)), vPaint.a);',
        );
      };
      material.customProgramCacheKey = () => 'mascotas3d-paint-v1';
      material.needsUpdate = true;
      disposableMaterials.push(material);
      return material;
    };

    /** Rejilla uniforme en formato CSR: O(1) para consultar vecinos de un punto. */
    const buildPaintTarget = (mesh: THREE.Mesh): PaintTarget | null => {
      const geometry = mesh.geometry as THREE.BufferGeometry;
      const position = geometry.getAttribute('position') as THREE.BufferAttribute;
      if (!position || position.count === 0) return null;

      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const box = geometry.boundingBox!;
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      const count = position.count;
      const gridRes = Math.min(64, Math.max(8, Math.round(Math.cbrt(count / 8))));
      const gridCell = maxDim / gridRes;
      const gridMin = box.min.clone();

      const cells = gridRes * gridRes * gridRes;
      const cellStart = new Uint32Array(cells + 1);
      const cellOf = new Uint32Array(count);
      const clampCell = (value: number) => Math.min(gridRes - 1, Math.max(0, Math.floor(value)));

      for (let i = 0; i < count; i += 1) {
        const cx = clampCell((position.getX(i) - gridMin.x) / gridCell);
        const cy = clampCell((position.getY(i) - gridMin.y) / gridCell);
        const cz = clampCell((position.getZ(i) - gridMin.z) / gridCell);
        const cell = (cx * gridRes + cy) * gridRes + cz;
        cellOf[i] = cell;
        cellStart[cell + 1] += 1;
      }
      for (let c = 0; c < cells; c += 1) cellStart[c + 1] += cellStart[c];
      const cursor = Uint32Array.from(cellStart.subarray(0, cells));
      const cellItems = new Uint32Array(count);
      for (let i = 0; i < count; i += 1) {
        cellItems[cursor[cellOf[i]]] = i;
        cursor[cellOf[i]] += 1;
      }

      const paint = new THREE.BufferAttribute(new Uint8Array(count * 4), 4, true);
      paint.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute('aPaint', paint);

      return {
        geometry,
        position,
        normal: (geometry.getAttribute('normal') as THREE.BufferAttribute) || null,
        paint,
        gridRes,
        gridMin,
        gridCell,
        cellStart,
        cellItems,
        brushUnit: maxDim * BRUSH_TO_LOCAL,
      };
    };

    const prepareMeshes = (object: THREE.Object3D) => {
      let meshIndex = 0;
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.castShadow = true;
        child.receiveShadow = true;
        const sourceMaterials = Array.isArray(child.material)
          ? child.material
          : child.material
            ? [child.material]
            : [new THREE.MeshStandardMaterial({ color: '#c8b08a', roughness: 0.65 })];
        const materials = sourceMaterials.map(makePaintable);
        child.material = materials.length === 1 ? materials[0] : materials;

        const surfaceId = `mesh-${meshIndex}`;
        const paintTarget = buildPaintTarget(child);
        if (paintTarget) paintTargets.set(surfaceId, paintTarget);
        child.userData.paintSurfaceId = surfaceId;
        modelMeshes.push(child);
        meshIndex += 1;
      });
    };

    /** Pinta una esfera de vertices alrededor del punto 3D del trazo. */
    const applyStroke = (stroke: PaintStroke) => {
      if (!stroke.position || !stroke.surfaceId) return false;
      const item = paintTargets.get(stroke.surfaceId);
      if (!item) return false;

      const brushRadius = Math.max(item.brushUnit * stroke.size, 1e-6);
      const radiusSq = brushRadius * brushRadius;
      const { r, g, b } = hexToRgb(stroke.color);
      const array = item.paint.array as Uint8Array;

      const cx0 = Math.max(0, Math.floor((stroke.position.x - brushRadius - item.gridMin.x) / item.gridCell));
      const cx1 = Math.min(item.gridRes - 1, Math.floor((stroke.position.x + brushRadius - item.gridMin.x) / item.gridCell));
      const cy0 = Math.max(0, Math.floor((stroke.position.y - brushRadius - item.gridMin.y) / item.gridCell));
      const cy1 = Math.min(item.gridRes - 1, Math.floor((stroke.position.y + brushRadius - item.gridMin.y) / item.gridCell));
      const cz0 = Math.max(0, Math.floor((stroke.position.z - brushRadius - item.gridMin.z) / item.gridCell));
      const cz1 = Math.min(item.gridRes - 1, Math.floor((stroke.position.z + brushRadius - item.gridMin.z) / item.gridCell));
      if (cx0 > cx1 || cy0 > cy1 || cz0 > cz1) return false;

      let touchedMin = Number.MAX_SAFE_INTEGER;
      let touchedMax = -1;

      for (let cx = cx0; cx <= cx1; cx += 1) {
        for (let cy = cy0; cy <= cy1; cy += 1) {
          for (let cz = cz0; cz <= cz1; cz += 1) {
            const cell = (cx * item.gridRes + cy) * item.gridRes + cz;
            const from = item.cellStart[cell];
            const to = item.cellStart[cell + 1];
            for (let slot = from; slot < to; slot += 1) {
              const index = item.cellItems[slot];
              const dx = item.position.getX(index) - stroke.position.x;
              const dy = item.position.getY(index) - stroke.position.y;
              const dz = item.position.getZ(index) - stroke.position.z;
              const distanceSq = dx * dx + dy * dy + dz * dz;
              if (distanceSq > radiusSq) continue;

              // No atravesar partes delgadas (orejas, patas): solo la cara visible.
              if (stroke.normal && item.normal) {
                const dot = item.normal.getX(index) * stroke.normal.x
                  + item.normal.getY(index) * stroke.normal.y
                  + item.normal.getZ(index) * stroke.normal.z;
                if (dot < 0) continue;
              }

              const falloff = 1 - Math.sqrt(distanceSq) / brushRadius;
              const coverage = Math.min(1, falloff * 1.8) * STROKE_OPACITY;
              if (coverage <= 0) continue;

              const offset = index * 4;
              const previousAlpha = array[offset + 3] / 255;
              const outAlpha = coverage + previousAlpha * (1 - coverage);
              if (outAlpha <= 0) continue;
              const keep = (previousAlpha * (1 - coverage)) / outAlpha;
              const take = 1 - keep;

              array[offset] = Math.round(array[offset] * keep + r * take);
              array[offset + 1] = Math.round(array[offset + 1] * keep + g * take);
              array[offset + 2] = Math.round(array[offset + 2] * keep + b * take);
              array[offset + 3] = Math.round(outAlpha * 255);

              if (index < touchedMin) touchedMin = index;
              if (index > touchedMax) touchedMax = index;
            }
          }
        }
      }

      if (touchedMax < 0) return false;
      const attribute = item.paint as THREE.BufferAttribute & {
        addUpdateRange?: (start: number, count: number) => void;
      };
      if (typeof attribute.addUpdateRange === 'function') {
        attribute.addUpdateRange(touchedMin * 4, (touchedMax - touchedMin + 1) * 4);
      }
      attribute.needsUpdate = true;
      return true;
    };

    const replayPaint = () => strokesRef.current.forEach(applyStroke);

    /** Deja todas las superficies sin pintura, conservando la textura original. */
    const resetPaint = () => {
      paintTargets.forEach((item) => {
        (item.paint.array as Uint8Array).fill(0);
        item.paint.needsUpdate = true;
      });
    };

    // Deshacer y limpiar entran por aquí: se borra la capa de pintura y se
    // vuelven a aplicar los trazos que quedan. La cámara ni se toca.
    repaintRef.current = () => {
      if (paintTargets.size === 0) return;
      resetPaint();
      replayPaint();
    };

    const strokeAt = (event: PointerEvent): PaintStroke | null => {
      if (!loadedObject) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(modelMeshes, false)[0];
      if (!hit || !(hit.object instanceof THREE.Mesh)) return null;
      const surfaceId = hit.object.userData.paintSurfaceId as string | undefined;
      if (!surfaceId || !paintTargets.has(surfaceId)) return null;

      // Punto de impacto en coordenadas locales del mesh: estable ante
      // rotaciones, escalas y la transformacion guardada del modelo.
      const local = hit.object.worldToLocal(hit.point.clone());
      const faceNormal = hit.face?.normal;

      return {
        position: {
          x: Number(local.x.toFixed(5)),
          y: Number(local.y.toFixed(5)),
          z: Number(local.z.toFixed(5)),
        },
        normal: faceNormal
          ? {
              x: Number(faceNormal.x.toFixed(3)),
              y: Number(faceNormal.y.toFixed(3)),
              z: Number(faceNormal.z.toFixed(3)),
            }
          : undefined,
        surfaceId,
        color: colorRef.current,
        size: sizeRef.current,
      };
    };

    const paintAt = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastPaintAt < 24) return;
      const stroke = strokeAt(event);
      if (!stroke?.position) return;

      const previousStroke = lastPaintStroke;
      const item = paintTargets.get(stroke.surfaceId!);
      const brushRadius = item ? item.brushUnit * stroke.size : 0;
      const canInterpolate = Boolean(
        previousStroke?.position
        && previousStroke.surfaceId === stroke.surfaceId
        && brushRadius > 0,
      );
      const distance = canInterpolate
        ? Math.hypot(
            stroke.position.x - previousStroke!.position!.x,
            stroke.position.y - previousStroke!.position!.y,
            stroke.position.z - previousStroke!.position!.z,
          )
        : 0;
      const steps = canInterpolate
        ? Math.min(30, Math.max(1, Math.ceil(distance / Math.max(brushRadius * 0.35, 1e-4))))
        : 1;

      for (let index = 1; index <= steps; index += 1) {
        const ratio = index / steps;
        const interpolated: PaintStroke = canInterpolate
          ? {
              ...stroke,
              position: {
                x: previousStroke!.position!.x + (stroke.position.x - previousStroke!.position!.x) * ratio,
                y: previousStroke!.position!.y + (stroke.position.y - previousStroke!.position!.y) * ratio,
                z: previousStroke!.position!.z + (stroke.position.z - previousStroke!.position!.z) * ratio,
              },
            }
          : stroke;
        if (applyStroke(interpolated)) onPaintRef.current?.(interpolated);
      }
      lastPaintAt = now;
      lastPaintStroke = stroke;
    };

    /**
     * Cuentagotas. Lee el píxel bajo el cursor del propio lienzo, así que
     * devuelve exactamente el color que la persona ve, ya con textura,
     * iluminación y la pintura aplicada encima. Solo actúa sobre el modelo:
     * sobre el fondo o la rejilla no hace nada.
     */
    const pickColorAt = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      if (!raycaster.intersectObjects(modelMeshes, false).length) return;

      // El lienzo se dibuja con `preserveDrawingBuffer`, pero hay que renderizar
      // antes de leer para no tomar el color de un fotograma ya descartado.
      renderer.render(scene, camera);
      const sampler = document.createElement('canvas');
      sampler.width = 1;
      sampler.height = 1;
      const context = sampler.getContext('2d');
      if (!context) return;
      const scaleX = renderer.domElement.width / rect.width;
      const scaleY = renderer.domElement.height / rect.height;
      context.drawImage(
        renderer.domElement,
        (event.clientX - rect.left) * scaleX,
        (event.clientY - rect.top) * scaleY,
        1, 1, 0, 0, 1, 1,
      );
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
      onPickColorRef.current?.(hex);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      previous = { x: event.clientX, y: event.clientY };
      if (modeRef.current === 'pick') {
        pickColorAt(event);
        return;
      }
      renderer.domElement.setPointerCapture(event.pointerId);
      if (modeRef.current === 'paint') {
        painting = true;
        lastPaintStroke = null;
        // Un arrastre entero es un solo paso de deshacer, por muchas muestras
        // que genere: el aviso va antes del primer trazo.
        onPaintStartRef.current?.();
        paintAt(event);
      } else {
        dragging = true;
        renderer.domElement.style.cursor = 'grabbing';
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const deltaX = event.clientX - previous.x;
      const deltaY = event.clientY - previous.y;
      if (painting && modeRef.current === 'paint') {
        paintAt(event);
      } else if (dragging) {
        // Fuera del modo pintar, arrastrar siempre rota.
        theta -= deltaX * 0.01;
        phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi - deltaY * 0.01));
        updateCamera();
      }
      previous = { x: event.clientX, y: event.clientY };
    };

    const endAction = (event: PointerEvent) => {
      dragging = false;
      painting = false;
      lastPaintStroke = null;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      renderer.domElement.style.cursor = cursorForMode(modeRef.current);
    };

    // La rueda hace zoom en cualquier modo, incluso pintando: no interfiere
    // con el arrastre del pincel y evita tener que cambiar de herramienta.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      radius = Math.max(2, Math.min(50, radius + event.deltaY * 0.02));
      updateCamera();
    };

    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', endAction);
    renderer.domElement.addEventListener('pointercancel', endAction);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('contextmenu', onContextMenu);

    const addFallbackCube = () => {
      // Solo sustituye al modelo, nunca se suma a él: si ya hay algo en escena
      // el respaldo sobra y superponerlo es peor que no mostrarlo.
      if (loadedObject) return;
      // Segmentado: el pincel trabaja por vertice y necesita densidad de malla.
      const geometry = new THREE.BoxGeometry(3, 3, 3, 60, 60, 60);
      const material = new THREE.MeshStandardMaterial({ color: modelo.color || '#10b981', roughness: 0.45 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 2;
      loadedObject = mesh;
      disposableGeometries.push(geometry);
      prepareMeshes(mesh);
      scene.add(mesh);
      replayPaint();
    };

    const loadModel = async () => {
      if (!modelo.archivo?.path) {
        addFallbackCube();
        return;
      }
      const fileUrl = urlDelBackend(modelo.archivo.path);
      const extension = modelo.archivo.path.split('.').pop()?.toLowerCase();
      try {
        if (extension === 'glb' || extension === 'gltf') {
          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          const loader = new GLTFLoader();
          const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
            loader.load(fileUrl, resolve, undefined, reject);
          });
          loadedObject = gltf.scene;
        } else if (extension === 'obj') {
          const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');
          const loader = new OBJLoader();
          try {
            const { MTLLoader } = await import('three/examples/jsm/loaders/MTLLoader.js');
            const mtlLoader = new MTLLoader();
            const materials = await new Promise<any>((resolve, reject) => {
              mtlLoader.load(fileUrl.replace(/\.obj$/i, '.mtl'), resolve, undefined, reject);
            });
            materials.preload();
            loader.setMaterials(materials);
          } catch {
            console.info('El modelo OBJ no incluye un archivo MTL accesible.');
          }
          loadedObject = await new Promise<THREE.Group>((resolve, reject) => {
            loader.load(fileUrl, resolve, undefined, reject);
          });
          loadedObject.rotation.x = -Math.PI / 2;
          loadedObject.updateMatrixWorld();
        }

        if (!loadedObject || disposed) return;
        prepareMeshes(loadedObject);
        const box = new THREE.Box3().setFromObject(loadedObject);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 8 / (Math.max(size.x, size.y, size.z) || 1);
        loadedObject.scale.setScalar(scale);
        loadedObject.position.sub(center.multiplyScalar(scale));
        loadedObject.position.y = (size.y * scale) / 2;

        const transform = modelo.transformaciones;
        if (transform) {
          loadedObject.scale.set(
            loadedObject.scale.x * transform.escalaX,
            loadedObject.scale.y * transform.escalaY,
            loadedObject.scale.z * transform.escalaZ,
          );
          loadedObject.rotation.set(transform.rotacionX, transform.rotacionY, transform.rotacionZ);
          loadedObject.position.set(
            loadedObject.position.x + transform.posicionX,
            loadedObject.position.y + transform.posicionY,
            loadedObject.position.z + transform.posicionZ,
          );
        }
        scene.add(loadedObject);
        loadedObject.updateMatrixWorld(true);
        radius = 12;
        target.set(0, size.y * scale * 0.3, 0);
        updateCamera();
        replayPaint();
      } catch (error) {
        console.error('Error al cargar el modelo 3D:', error);
        if (!disposed) addFallbackCube();
      }
    };
    void loadModel();

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (autoRotateRef.current && modeRef.current === 'view' && loadedObject && !dragging && !painting) {
        loadedObject.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.003);
      }
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      const width = container.clientWidth;
      const canvasHeight = container.clientHeight;
      camera.aspect = width / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, canvasHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      disposed = true;
      repaintRef.current = null;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', endAction);
      renderer.domElement.removeEventListener('pointercancel', endAction);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('contextmenu', onContextMenu);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      if (rendererRef.current === renderer) rendererRef.current = null;
      paintTargets.forEach((item) => item.geometry.deleteAttribute('aPaint'));
      paintTargets.clear();
      disposableGeometries.forEach((geometry) => geometry.dispose());
      disposableMaterials.forEach((material) => material.dispose());
    };
    // Deliberadamente sin `safeStrokes`: cambiarlos no debe reconstruir la
    // escena ni volver a descargar el modelo. De eso se encarga repaintRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelo]);

  const modeLabel = resolvedMode === 'paint' ? t('viewer.paintHint') : t('viewer.rotateHint');

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-xl"
        style={{ height, border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <div className="pointer-events-none absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-lg border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-gray-300 shadow-lg">
        {modeLabel}
      </div>
    </div>
  );
});

function cursorForMode(mode: ViewerInteractionMode) {
  if (mode === 'paint') return 'crosshair';
  if (mode === 'pick') return 'copy';
  return 'grab';
}

Canvas3DViewer.displayName = 'Canvas3DViewer';
export default Canvas3DViewer;
