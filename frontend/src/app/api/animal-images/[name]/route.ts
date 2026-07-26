import { NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { Readable } from 'node:stream';

const IMAGES_DIR = join(
  process.cwd(),
  '..',
  'backend',
  'imagenes',
  'animales',
);

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function GET(
  _request: Request,
  { params }: { params: { name: string } },
) {
  const { name } = params;

  // El nombre viene de la URL: se restringe a un archivo plano dentro de
  // IMAGES_DIR para que no se pueda salir del directorio con ".." o rutas.
  if (!name || name.includes('/') || name.includes('\\') || name.includes('\0')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const filePath = join(IMAGES_DIR, basename(name));
  if (dirname(filePath) !== IMAGES_DIR) {
    return new NextResponse('Not found', { status: 404 });
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return new NextResponse('Not found', { status: 404 });
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';
  const nodeStream = createReadStream(filePath);

  return new NextResponse(Readable.toWeb(nodeStream) as ReadableStream, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
