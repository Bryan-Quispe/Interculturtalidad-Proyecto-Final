'use client';

import { useEffect, useState } from 'react';
import { Animal } from '@/types';
import Canvas3DViewer from './Canvas3DViewer';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { claveRasgo, rasgosValidos } from '@/lib/rasgos';

interface PublicPetModalProps {
  animal: Animal & { distanciaKm?: number | null };
  onClose: () => void;
}

/**
 * Ficha completa de una mascota para quien no ha iniciado sesión.
 *
 * Es la pantalla que ve alguien que cree haber encontrado al animal, así que
 * prioriza lo que sirve para reconocerlo y para avisar: las fotografías, el
 * modelo tridimensional con sus señas pintadas, los rasgos y los teléfonos.
 * No muestra coordenadas: la ubicación se publica siempre como referencia.
 */
export default function PublicPetModal({ animal, onClose }: PublicPetModalProps) {
  const { t, tv, lang } = useLanguage();
  const fotos = Array.isArray(animal.fotos) ? animal.fotos.filter(Boolean) : [];
  const [fotoActiva, setFotoActiva] = useState(0);
  const rasgos = rasgosValidos(animal.rasgos);

  const telefonos = [animal.telefonoContacto, ...(Array.isArray(animal.telefonos) ? animal.telefonos : [])]
    .map((numero) => numero?.trim())
    .filter(Boolean) as string[];

  const descripcion = (lang === 'kw' ? animal.descripcionKw : animal.descripcion)?.trim()
    || animal.descripcion?.trim()
    || '';
  const avistamiento = (lang === 'kw' ? animal.ultimaVezVistoKw : animal.ultimaVezVisto)?.trim()
    || animal.ultimaVezVisto?.trim()
    || '';

  // Cerrar con Escape es lo que espera cualquiera ante una ventana superpuesta.
  useEffect(() => {
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', alPulsar);
    // Se bloquea el desplazamiento del fondo mientras la ficha está abierta.
    const desbordeAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alPulsar);
      document.body.style.overflow = desbordeAnterior;
    };
  }, [onClose]);

  const Dato = ({ etiqueta, valor }: { etiqueta: string; valor?: string | null }) =>
    valor ? (
      <div className="border-b border-white/5 py-2 last:border-b-0">
        <dt className="text-[11px] uppercase tracking-wider text-gray-500">{etiqueta}</dt>
        <dd className="mt-0.5 text-sm text-gray-200">{valor}</dd>
      </div>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={animal.nombre}
      onClick={onClose}
    >
      <div
        className="my-6 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {t('home.lostBadge')}
            </p>
            <h2 className="mt-1 truncate text-2xl font-bold text-white">{animal.nombre}</h2>
            <p className="text-sm text-gray-400">
              {t(`cat.${animal.categoria}` as any)}
              {animal.raza ? ` · ${tv('breed', animal.raza)}` : ''}
              {typeof animal.distanciaKm === 'number'
                ? ` · ${t('home.distance', { km: String(animal.distanciaKm) })}`
                : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('form.close')}
            className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-gray-400 transition hover:border-white/30 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            {fotos.length > 0 && (
              <div>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotos[fotoActiva]}
                    alt={`${animal.nombre} — ${t('dash.photo')} ${fotoActiva + 1}`}
                    className="max-h-[22rem] w-full object-contain"
                  />
                </div>
                {fotos.length > 1 && (
                  <div className="mt-2 flex gap-2">
                    {fotos.map((foto, indice) => (
                      <button
                        key={foto}
                        type="button"
                        onClick={() => setFotoActiva(indice)}
                        aria-label={`${t('dash.photo')} ${indice + 1}`}
                        aria-pressed={indice === fotoActiva}
                        className={`h-14 w-14 overflow-hidden rounded-lg border transition ${
                          indice === fotoActiva
                            ? 'border-emerald-400'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={foto} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {animal.modelo && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-300">{t('home.model3d')}</h3>
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <Canvas3DViewer
                    modelo={animal.modelo}
                    strokes={animal.modelo.pinturas}
                    height="300px"
                    autoRotate
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">{t('home.model3dHint')}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {telefonos.length > 0 && (
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  {t('poster.contact')}
                </p>
                <div className="mt-1 space-y-1">
                  {telefonos.map((numero) => (
                    <a
                      key={numero}
                      href={`tel:${numero.replace(/[^+0-9]/g, '')}`}
                      className="block text-lg font-bold text-white underline-offset-4 hover:underline"
                    >
                      {numero}
                    </a>
                  ))}
                </div>
                <p className="mt-2 text-xs text-emerald-200/70">
                  {t('home.ownerLabel')} {animal.usuario?.name || t('home.unavailable')}
                </p>
              </div>
            )}

            {rasgos.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-300">{t('traits.title')}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {rasgos.map((rasgo) => (
                    <span
                      key={rasgo}
                      className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200"
                    >
                      {t(claveRasgo(rasgo))}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <dl className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-1">
              <Dato etiqueta={t('dash.zone')} valor={animal.zona} />
              <Dato etiqueta={t('dash.address')} valor={animal.direccion} />
              <Dato etiqueta={t('dash.lastSeen')} valor={avistamiento} />
              <Dato
                etiqueta={t('dash.date')}
                valor={animal.fechaVisto ? new Date(animal.fechaVisto).toLocaleDateString('es-EC') : ''}
              />
              <Dato etiqueta={t('dash.size')} valor={tv('size', animal.caracteristicas?.tamano)} />
              <Dato etiqueta={t('dash.color')} valor={tv('color', animal.caracteristicas?.color)} />
            </dl>

            {descripcion && (
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-300">{t('poster.recognize')}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{descripcion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
