import type { Animal } from '@/types';
import { Lang, StoredField, TranslationKey, translate, translateStored } from './i18n/translations';

interface ExportAnimalReportOptions {
  animal: Animal;
  modelSnapshot?: string | null;
  draft?: AnimalReportDraft;
  /** Idioma con el que se rotula el PDF; por defecto castellano. */
  lang?: Lang;
}

/**
 * Idioma activo del PDF que se está dibujando. Es un valor de módulo porque
 * las funciones de dibujo son muchas y se llaman en cadena; `exportAnimalReport`
 * lo fija al empezar y solo se genera un cartel a la vez.
 */
let reportLang: Lang = 'es';

/** Rótulo del PDF en el idioma activo. */
function L(key: TranslationKey): string {
  return translate(key, reportLang);
}

/** Valor guardado (tamaño, color, raza) en el idioma del cartel. */
function V(field: StoredField, value?: string | null): string {
  return translateStored(field, value ?? '', reportLang);
}

/** Estilo del cartel. Cada uno dibuja la portada de forma distinta. */
export type PosterTemplate = 'clasico' | 'foto-grande' | 'mosaico';

export const POSTER_TEMPLATES: Array<{
  id: PosterTemplate;
  nombre: string;
  descripcion: string;
}> = [
  {
    id: 'clasico',
    nombre: 'Clásico',
    descripcion: 'Foto y datos de contacto lado a lado. Equilibrado y fácil de leer.',
  },
  {
    id: 'foto-grande',
    nombre: 'Foto grande',
    descripcion: 'Una foto enorme y el teléfono destacado. Se reconoce de lejos.',
  },
  {
    id: 'mosaico',
    nombre: 'Mosaico',
    descripcion: 'Hasta 3 fotos en la portada, para mostrarla desde varios ángulos.',
  },
];

/** Cuántas fotos usa la portada de cada plantilla. */
export const COVER_PHOTO_COUNT: Record<PosterTemplate, number> = {
  clasico: 1,
  'foto-grande': 1,
  mosaico: 3,
};

/**
 * Distribución de las fotografías que no entran en la portada: cuatro por
 * página, en cuadrícula de 2x2. Era configurable entre tres tamaños, pero la
 * opción no aportaba —el cartel se imprime, no se ajusta a una pantalla— y
 * complicaba el editor, así que se fijó en el formato intermedio.
 */
const GALLERY_LAYOUT = {
  cols: 2,
  rows: 2,
  cardW: 86,
  cardH: 105,
  gapX: 6,
  gapY: 11,
  imgH: 91,
};

export interface AnimalReportDraft {
  headline: string;
  petName: string;
  breed: string;
  owner: string;
  contact: string;
  zone: string;
  lastSeenDate: string;
  lastSeenReference: string;
  recognition: string;
  selectedPhotos: string[];
  mainVisual: string | 'model' | null;
  template: PosterTemplate;
  includeDetailPage: boolean;
  includeModelPage: boolean;
}

export interface ExportAnimalReportResult {
  includedPhotos: number;
  omittedPhotos: number;
  includedModelSnapshot: boolean;
  pages: number;
}

interface PdfImage {
  dataUrl: string;
  width: number;
  height: number;
  format: 'JPEG' | 'PNG';
}

const COLORS = {
  ink: '#10233d',
  muted: '#526174',
  paper: '#f7faf9',
  white: '#ffffff',
  teal: '#087f6d',
  tealSoft: '#e4f4ef',
  coral: '#d64f4f',
  coralSoft: '#fdeaea',
  line: '#d7e0df',
};

const MAX_REPORT_PHOTOS = 8;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

/**
 * Identificador de la captura del visor 3D. Se trata como una imagen más, así
 * la portada puede mezclar fotos reales con la vista 3D.
 */
export const MODEL_VISUAL = 'model';

/** Imágenes seleccionadas en orden, con la principal siempre primero. */
function orderedVisuals(draft: AnimalReportDraft): string[] {
  const ordered = draft.selectedPhotos.filter(Boolean);
  if (draft.mainVisual) {
    const index = ordered.indexOf(draft.mainVisual);
    if (index >= 0) ordered.splice(index, 1);
    ordered.unshift(draft.mainVisual);
  }
  return ordered;
}

/** Imágenes que muestra la portada; no se repiten en la galería. */
export function coverPhotos(draft: AnimalReportDraft): string[] {
  return orderedVisuals(draft).slice(0, COVER_PHOTO_COUNT[draft.template]);
}

/** Imágenes que quedan para las páginas de galería. */
export function galleryPhotos(draft: AnimalReportDraft): string[] {
  return orderedVisuals(draft).slice(COVER_PHOTO_COUNT[draft.template]);
}

/**
 * Páginas que tendrá el PDF. La usa el editor para avisar antes de generarlo:
 * un cartel de búsqueda funciona mejor en una sola hoja.
 */
export function estimateReportPages(draft: AnimalReportDraft, hasModelSnapshot: boolean): number {
  let pages = 1;
  if (draft.includeDetailPage) pages += 1;

  const layout = GALLERY_LAYOUT;
  const restantes = galleryPhotos(draft).length;
  pages += Math.ceil(restantes / (layout.cols * layout.rows));

  if (draft.includeModelPage && hasModelSnapshot) pages += 1;
  return pages;
}

export function createAnimalReportDraft(animal: Animal, lang: Lang = 'es'): AnimalReportDraft {
  reportLang = lang;
  const photos = Array.from(new Set(
    (Array.isArray(animal.fotos) ? animal.fotos : []).map((photo) => photo.trim()).filter(Boolean),
  )).slice(0, MAX_REPORT_PHOTOS);
  // El cartel se rotula en su propio idioma, así que toma la descripción que
  // su autor escribió en esa lengua. Si no la escribió, se usa la otra: más
  // vale un cartel con una línea en castellano que un cartel sin señas.
  const ownDescription = (lang === 'kw' ? animal.descripcionKw : animal.descripcion)?.trim();
  const recognition = [
    ownDescription || animal.descripcion,
    animal.caracteristicas?.color ? `${L('pdf.colorPrefix')} ${V('color', animal.caracteristicas.color)}.` : '',
    animal.caracteristicas?.tamano ? `${L('pdf.sizePrefix')} ${V('size', animal.caracteristicas.tamano)}.` : '',
  ].filter(Boolean).join(' ');

  return {
    headline: L('poster.lost'),
    petName: animal.nombre,
    breed: V('breed', animal.raza) || L('pdf.noBreed'),
    owner: animal.usuario?.name?.trim() || L('pdf.ownerRegistered'),
    contact: animal.telefonoContacto?.trim() || '',
    zone: animal.zona?.trim() || '',
    lastSeenDate: animal.fechaVisto ? animal.fechaVisto.slice(0, 10) : '',
    lastSeenReference: animal.ultimaVezVisto?.trim() || '',
    recognition: recognition || L('pdf.noExtraDesc'),
    selectedPhotos: photos,
    mainVisual: photos[0] || (animal.modelo ? 'model' : null),
    template: 'clasico',
    // Por defecto, una sola hoja: es lo que se imprime y se pega en la calle.
    includeDetailPage: false,
    includeModelPage: false,
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadHtmlImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo decodificar la imagen'));
    image.src = source;
  });
}

async function normalizeImage(source: string, format: 'JPEG' | 'PNG' = 'JPEG'): Promise<PdfImage> {
  if (source.length > MAX_IMAGE_BYTES * 1.4) {
    throw new Error('La imagen supera el tamaño permitido');
  }
  let dataUrl = source;

  if (!source.startsWith('data:')) {
    const absoluteUrl = new URL(source, window.location.origin).toString();
    const protocol = new URL(absoluteUrl).protocol;
    if (protocol !== 'http:' && protocol !== 'https:') {
      throw new Error('La dirección de imagen no es válida');
    }
    const response = await fetch(absoluteUrl, { mode: 'cors', credentials: 'omit' });
    if (!response.ok) {
      throw new Error(`La imagen respondió con estado ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      throw new Error('El recurso seleccionado no es una imagen');
    }
    const blob = await response.blob();
    if (blob.size > MAX_IMAGE_BYTES) {
      throw new Error('La imagen supera 12 MB');
    }
    dataUrl = await blobToDataUrl(blob);
  }

  const image = await loadHtmlImage(dataUrl);
  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('No se pudo preparar la imagen para el PDF');
  }

  if (format === 'JPEG') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL(format === 'PNG' ? 'image/png' : 'image/jpeg', 0.9),
    width,
    height,
    format,
  };
}

function fitImage(
  doc: any,
  image: PdfImage,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  doc.addImage(image.dataUrl, image.format, drawX, drawY, drawWidth, drawHeight, undefined, 'FAST');
}

function roundedCard(doc: any, x: number, y: number, width: number, height: number, fill: string) {
  doc.setFillColor(fill);
  doc.setDrawColor(COLORS.line);
  doc.roundedRect(x, y, width, height, 2.5, 2.5, 'FD');
}

function clippedLines(doc: any, text: string, maxWidth: number, maxLines: number): string[] {
  const lines = doc.splitTextToSize(text || L('pdf.notRegisteredM'), maxWidth) as string[];
  if (lines.length <= maxLines) return lines;

  const visible = lines.slice(0, maxLines);
  const last = visible[maxLines - 1];
  visible[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 3)).trim()}...`;
  return visible;
}

function fitSingleLine(
  doc: any,
  text: string,
  maxWidth: number,
  maxFontSize: number,
  minFontSize: number,
) {
  let fontSize = maxFontSize;
  let visibleText = text;
  doc.setFontSize(fontSize);

  while (fontSize > minFontSize && doc.getTextWidth(visibleText) > maxWidth) {
    fontSize -= 0.5;
    doc.setFontSize(fontSize);
  }

  if (doc.getTextWidth(visibleText) > maxWidth) {
    while (visibleText.length > 4 && doc.getTextWidth(`${visibleText}...`) > maxWidth) {
      visibleText = visibleText.slice(0, -1);
    }
    visibleText = `${visibleText.trim()}...`;
  }

  return { text: visibleText, fontSize };
}

function formatDate(value?: string) {
  if (!value) return L('pdf.notRegisteredF');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // La fecha se sigue formateando con el calendario local de Ecuador.
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function safeFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'mascota';
}

function fileTimestamp(date = new Date()) {
  const two = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}${two(date.getMonth() + 1)}${two(date.getDate())}-${two(date.getHours())}${two(date.getMinutes())}${two(date.getSeconds())}`;
}

function addPageFooter(doc: any, pageNumber: number) {
  doc.setDrawColor(COLORS.line);
  doc.line(14, 283, 196, 283);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.muted);
  doc.text(L('pdf.footer'), 14, 289);
  doc.text(`${L('pdf.page')} ${pageNumber}`, 196, 289, { align: 'right' });
}

function addSectionHeader(doc: any, title: string, subtitle: string, pageNumber: number) {
  doc.setFillColor(COLORS.paper);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(COLORS.ink);
  doc.rect(0, 0, 210, 29, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.white);
  const fittedTitle = fitSingleLine(doc, title, 182, 17, 10.5);
  doc.setFontSize(fittedTitle.fontSize);
  doc.text(fittedTitle.text, 14, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#c8d7df');
  doc.text(subtitle, 14, 21);
  addPageFooter(doc, pageNumber);
}

function drawFlowKeyValue(
  doc: any,
  label: string,
  value: string,
  y: number,
  newPage: () => number,
) {
  const lineHeight = 5.2;
  const lines = doc.splitTextToSize(value || 'No registrado', 182) as string[];
  let remaining = [...lines];
  let continuation = false;

  while (remaining.length > 0) {
    if (y + 12 > 276) y = newPage();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(COLORS.teal);
    doc.text(`${label.toUpperCase()}${continuation ? ` ${L('pdf.continuation')}` : ''}`, 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(COLORS.ink);
    const availableLines = Math.max(1, Math.floor((276 - y) / lineHeight));
    const chunk = remaining.splice(0, availableLines);
    doc.text(chunk, 14, y);
    y += chunk.length * lineHeight + 4;

    if (remaining.length > 0) {
      y = newPage();
      continuation = true;
    }
  }

  return y;
}

interface CoverContext {
  draft: AnimalReportDraft;
  category: string;
  breed: string;
  owner: string;
  contact: string;
  coverImages: PdfImage[];
}

/**
 * Cabecera común a las tres plantillas. La línea pequeña identifica a la
 * mascota ("SE BUSCA - MISHA") en lugar de mostrar la marca de la aplicación:
 * en un cartel de calle lo relevante es el animal, no la plataforma.
 */
function drawHeader(
  doc: any,
  headline: string,
  petName: string,
  height: number,
  bandHeight: number,
  headlineMax: number,
) {
  doc.setFillColor(COLORS.paper);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(COLORS.ink);
  doc.rect(0, 0, 210, height, 'F');
  doc.setFillColor(COLORS.coral);
  doc.rect(0, height, 210, bandHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#bce8dc');
  const kicker = fitSingleLine(doc, `${L('poster.wanted')} - ${petName.toUpperCase()}`, 182, 10, 7);
  doc.setFontSize(kicker.fontSize);
  doc.text(kicker.text, 14, 11);

  doc.setTextColor(COLORS.white);
  const fitted = fitSingleLine(doc, headline.toUpperCase(), 182, headlineMax, 13);
  doc.setFontSize(fitted.fontSize);
  doc.text(fitted.text, 14, height - 7);
}

/** Bloque de contacto a todo el ancho, usado por dos plantillas. */
function drawContactBand(doc: any, ctx: CoverContext, y: number, height: number) {
  doc.setFillColor(COLORS.tealSoft);
  doc.setDrawColor(COLORS.line);
  doc.roundedRect(14, y, 182, height, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.teal);
  doc.text(L('poster.contact'), 20, y + 9);
  doc.setTextColor(COLORS.ink);
  const phone = fitSingleLine(doc, ctx.contact, 92, 24, 12);
  doc.setFontSize(phone.fontSize);
  doc.text(phone.text, 20, y + 23);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.muted);
  doc.text(L('poster.ownerLabel'), 120, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(COLORS.ink);
  doc.text(clippedLines(doc, ctx.owner, 70, 2), 120, y + 16);
}

function drawInfoCard(
  doc: any,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
  maxLines: number,
) {
  roundedCard(doc, x, y, width, height, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.teal);
  doc.text(label, x + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(COLORS.ink);
  doc.text(clippedLines(doc, value, width - 12, maxLines), x + 6, y + 15);
}

function drawEmptyPhoto(doc: any, x: number, y: number, width: number, height: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.muted);
  doc.text(L('pdf.noPhoto'), x + width / 2, y + height / 2, { align: 'center' });
}

// ── Plantilla 1: Clásico ──
function drawCoverClasico(doc: any, ctx: CoverContext) {
  const { draft } = ctx;
  drawHeader(doc, draft.headline, draft.petName, 34, 8, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.white);
  doc.text(L('pdf.helpUs'), 196, 25, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.ink);
  const name = fitSingleLine(doc, draft.petName.toUpperCase(), 182, 22, 11);
  doc.setFontSize(name.fontSize);
  doc.text(name.text, 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.muted);
  doc.text(`${ctx.category} | ${ctx.breed}`, 14, 62);

  roundedCard(doc, 14, 68, 119, 101, COLORS.white);
  if (ctx.coverImages[0]) fitImage(doc, ctx.coverImages[0], 18, 72, 111, 93);
  else drawEmptyPhoto(doc, 14, 68, 119, 101);

  roundedCard(doc, 138, 68, 58, 101, COLORS.tealSoft);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.teal);
  doc.text('CONTACTO', 144, 80);
  doc.setTextColor(COLORS.ink);
  const phone = fitSingleLine(doc, ctx.contact, 46, 18, 10);
  doc.setFontSize(phone.fontSize);
  doc.text(phone.text, 144, 91);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.muted);
  doc.text(L('pdf.owner'), 144, 113);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(COLORS.ink);
  doc.text(clippedLines(doc, ctx.owner, 46, 2), 144, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.muted);
  doc.text(L('pet.category'), 144, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.ink);
  doc.text(ctx.category, 144, 145);
  doc.setFillColor(COLORS.coralSoft);
  doc.roundedRect(144, 151, 46, 11, 2, 2, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.coral);
  doc.text(L('pdf.shareHelps'), 167, 158, { align: 'center' });

  drawInfoCard(doc, 14, 176, 87, 45, L('poster.zoneApprox'), draft.zone || L('pdf.notRegisteredF'), 4);
  drawInfoCard(
    doc,
    106,
    176,
    90,
    45,
    L('poster.lastSeenLong'),
    `${formatDate(draft.lastSeenDate)}. ${draft.lastSeenReference || L('pdf.noReference')}`,
    4,
  );
  drawInfoCard(doc, 14, 228, 182, 45, L('poster.recognize'), draft.recognition, 5);
}

// ── Plantilla 2: Foto grande ──
function drawCoverFotoGrande(doc: any, ctx: CoverContext) {
  const { draft } = ctx;
  drawHeader(doc, draft.headline, draft.petName, 26, 6, 22);

  roundedCard(doc, 14, 38, 182, 130, COLORS.white);
  if (ctx.coverImages[0]) fitImage(doc, ctx.coverImages[0], 18, 42, 174, 122);
  else drawEmptyPhoto(doc, 14, 38, 182, 130);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.ink);
  const name = fitSingleLine(doc, draft.petName.toUpperCase(), 182, 30, 14);
  doc.setFontSize(name.fontSize);
  doc.text(name.text, 14, 182);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.muted);
  doc.text(`${ctx.category} | ${ctx.breed}`, 14, 190);

  drawContactBand(doc, ctx, 196, 30);
  drawInfoCard(doc, 14, 232, 87, 22, L('poster.zone'), draft.zone || L('pdf.notRegisteredF'), 2);
  drawInfoCard(
    doc,
    106,
    232,
    90,
    22,
    L('poster.lastSeen'),
    draft.lastSeenReference || formatDate(draft.lastSeenDate),
    2,
  );
  drawInfoCard(doc, 14, 258, 182, 20, L('poster.recognize'), draft.recognition, 2);
}

// ── Plantilla 3: Mosaico ──
function drawCoverMosaico(doc: any, ctx: CoverContext) {
  const { draft } = ctx;
  drawHeader(doc, draft.headline, draft.petName, 30, 5, 22);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.ink);
  const name = fitSingleLine(doc, draft.petName.toUpperCase(), 182, 24, 12);
  doc.setFontSize(name.fontSize);
  doc.text(name.text, 14, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(COLORS.muted);
  doc.text(`${ctx.category} | ${ctx.breed}`, 14, 57);

  roundedCard(doc, 14, 62, 118, 88, COLORS.white);
  if (ctx.coverImages[0]) fitImage(doc, ctx.coverImages[0], 18, 66, 110, 80);
  else drawEmptyPhoto(doc, 14, 62, 118, 88);

  roundedCard(doc, 136, 62, 60, 42, COLORS.white);
  if (ctx.coverImages[1]) fitImage(doc, ctx.coverImages[1], 139, 65, 54, 36);
  else drawEmptyPhoto(doc, 136, 62, 60, 42);

  roundedCard(doc, 136, 108, 60, 42, COLORS.white);
  if (ctx.coverImages[2]) fitImage(doc, ctx.coverImages[2], 139, 111, 54, 36);
  else drawEmptyPhoto(doc, 136, 108, 60, 42);

  drawContactBand(doc, ctx, 156, 30);
  drawInfoCard(doc, 14, 192, 87, 26, L('poster.zone'), draft.zone || L('pdf.notRegisteredF'), 3);
  drawInfoCard(
    doc,
    106,
    192,
    90,
    26,
    L('poster.lastSeen'),
    `${formatDate(draft.lastSeenDate)}. ${draft.lastSeenReference || ''}`.trim(),
    3,
  );
  drawInfoCard(doc, 14, 224, 182, 40, L('poster.recognize'), draft.recognition, 5);
}

const COVER_RENDERERS: Record<PosterTemplate, (doc: any, ctx: CoverContext) => void> = {
  clasico: drawCoverClasico,
  'foto-grande': drawCoverFotoGrande,
  mosaico: drawCoverMosaico,
};

export async function exportAnimalReport({
  animal,
  modelSnapshot,
  draft: suppliedDraft,
  lang = 'es',
}: ExportAnimalReportOptions): Promise<ExportAnimalReportResult> {
  reportLang = lang;
  const { jsPDF } = await import('jspdf');
  const draft = suppliedDraft ?? createAnimalReportDraft(animal, lang);

  // La vista 3D no se descarga: ya llega como data URL en modelSnapshot.
  const photoSources = Array.from(
    new Set(
      draft.selectedPhotos
        .map((photo) => photo.trim())
        .filter((photo) => Boolean(photo) && photo !== MODEL_VISUAL),
    ),
  ).slice(0, MAX_REPORT_PHOTOS);
  const photoResults = await Promise.allSettled(
    photoSources.map(async (source) => ({ source, image: await normalizeImage(source) })),
  );
  const normalizedPhotos = photoResults
    .filter((result): result is PromiseFulfilledResult<{ source: string; image: PdfImage }> => result.status === 'fulfilled')
    .map((result) => result.value);
  const photoMap = new Map(normalizedPhotos.map((result) => [result.source, result.image]));
  const omittedPhotos = photoResults.length - normalizedPhotos.length;

  let modelImage: PdfImage | null = null;
  if (modelSnapshot) {
    try {
      modelImage = await normalizeImage(modelSnapshot, 'PNG');
    } catch {
      modelImage = null;
    }
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

  // Resuelve cada identificador a su imagen: la vista 3D o una foto real.
  const resolve = (id: string): PdfImage | undefined =>
    id === MODEL_VISUAL ? modelImage ?? undefined : photoMap.get(id);

  const coverImages: PdfImage[] = coverPhotos(draft)
    .map(resolve)
    .filter((item): item is PdfImage => Boolean(item));
  if (coverImages.length === 0 && modelImage) coverImages.push(modelImage);

  const context: CoverContext = {
    draft,
    category: L(`cat.${animal.categoria}` as TranslationKey),
    breed: draft.breed.trim() || L('pdf.noBreed'),
    owner: draft.owner.trim() || L('pdf.ownerRegistered'),
    contact: draft.contact.trim() || L('pdf.notRegisteredM'),
    coverImages,
  };

  COVER_RENDERERS[draft.template](doc, context);
  addPageFooter(doc, 1);

  if (draft.includeDetailPage) {
    doc.addPage();
    addSectionHeader(doc, `${L('pdf.fullSheet')} ${draft.petName}`, L('pdf.fullSheetSub'), 2);
    const addDetailContinuationPage = () => {
      const pageNumber = doc.getNumberOfPages() + 1;
      doc.addPage();
      addSectionHeader(doc, `${L('pdf.fullSheet')} ${draft.petName}`, L('pdf.continuationSub'), pageNumber);
      return 41;
    };
    let y = 41;
    y = drawFlowKeyValue(doc, L('pdf.owner'), context.owner, y, addDetailContinuationPage);
    y = drawFlowKeyValue(doc, L('pdf.phone'), context.contact, y, addDetailContinuationPage);
    y = drawFlowKeyValue(doc, L('pdf.categoryBreed'), `${context.category} - ${context.breed}`, y, addDetailContinuationPage);
    y = drawFlowKeyValue(doc, L('pdf.zoneApprox'), draft.zone || L('pdf.notRegisteredF'), y, addDetailContinuationPage);
    y = drawFlowKeyValue(doc, L('pdf.lastSeenDate'), formatDate(draft.lastSeenDate), y, addDetailContinuationPage);
    y = drawFlowKeyValue(doc, L('pdf.lastSeenRef'), draft.lastSeenReference || L('pdf.notRegisteredF'), y, addDetailContinuationPage);
    y = drawFlowKeyValue(doc, L('pdf.recognition'), draft.recognition || L('pdf.notRegisteredF'), y, addDetailContinuationPage);
    drawFlowKeyValue(
      doc,
      L('pdf.model3d'),
      animal.modelo ? `${animal.modelo.nombre}${animal.modelo.raza ? ` - ${animal.modelo.raza}` : ''}` : L('pdf.noModel'),
      y,
      addDetailContinuationPage,
    );
  }

  // Galería: solo las fotos que no aparecen ya en la portada.
  const gallery = galleryPhotos(draft)
    .map(resolve)
    .filter((item): item is PdfImage => Boolean(item));
  const layout = GALLERY_LAYOUT;
  const perPage = layout.cols * layout.rows;

  for (let start = 0; start < gallery.length; start += perPage) {
    const pagePhotos = gallery.slice(start, start + perPage);
    const pageNumber = doc.getNumberOfPages() + 1;
    doc.addPage();
    addSectionHeader(
      doc,
      `${L('pet.photos')}: ${draft.petName}`,
      `${gallery.length} ${gallery.length === 1 ? L('dash.photoOne') : L('dash.photoMany')}`,
      pageNumber,
    );

    pagePhotos.forEach((photo, index) => {
      const column = index % layout.cols;
      const row = Math.floor(index / layout.cols);
      const x = 14 + column * (layout.cardW + layout.gapX);
      const y = 40 + row * (layout.cardH + layout.gapY);
      roundedCard(doc, x, y, layout.cardW, layout.cardH, COLORS.white);
      fitImage(doc, photo, x + 4, y + 4, layout.cardW - 8, layout.imgH);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(COLORS.muted);
      doc.text(`${L('dash.photo')} ${start + index + 1}`, x + layout.cardW / 2, y + layout.cardH - 5, {
        align: 'center',
      });
    });
  }

  if (animal.modelo && draft.includeModelPage && modelImage) {
    const pageNumber = doc.getNumberOfPages() + 1;
    doc.addPage();
    addSectionHeader(
      doc,
      `${L('dash.visual3d')}: ${draft.petName}`,
      L('pdf.modelSupport'),
      pageNumber,
    );
    roundedCard(doc, 14, 40, 182, 176, COLORS.white);
    fitImage(doc, modelImage, 19, 45, 172, 166);

    roundedCard(doc, 14, 224, 182, 45, COLORS.tealSoft);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.teal);
    doc.text(L('pdf.modelAssociated'), 20, 236);
    doc.setFontSize(12);
    doc.setTextColor(COLORS.ink);
    doc.text(clippedLines(doc, animal.modelo.nombre, 170, 2), 20, 245);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.muted);
    doc.text(L('pdf.modelDisclaimer'), 20, 260);
  }

  doc.save(`se-busca-${safeFileName(draft.petName)}-${fileTimestamp()}.pdf`);

  return {
    includedPhotos: normalizedPhotos.length,
    omittedPhotos,
    includedModelSnapshot: Boolean(modelImage),
    pages: doc.getNumberOfPages(),
  };
}
