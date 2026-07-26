import '@/app/globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';

export const metadata: Metadata = {
  title: 'Mascotas 3D — Wasi Wiwakuna 3D',
  description:
    'Plataforma interactiva bilingüe kichwa–castellano para explorar, gestionar y visualizar modelos 3D de mascotas domésticas. / Kichwa, kastilla shimipi panka: wasi wiwakunapak 3D rikchakkunata rikunkapak, kamankapakpash.',
  keywords: 'mascotas, 3D, modelos, animales, kichwa, intercultural, Ecuador',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `lang` arranca en español; el proveedor lo cambia a `qu` en el cliente
  // cuando la persona elige kichwa.
  return (
    <html lang="es">
      <body>
        <LanguageProvider>
          <div className="min-h-screen relative">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
