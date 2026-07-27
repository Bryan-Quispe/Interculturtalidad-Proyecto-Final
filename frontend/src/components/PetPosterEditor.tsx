'use client';

import { useMemo, useState } from 'react';
import { Animal } from '@/types';
import {
  AnimalReportDraft,
  coverPhotos,
  createAnimalReportDraft,
  estimateReportPages,
  exportAnimalReport,
  ExportAnimalReportResult,
  MODEL_VISUAL,
  POSTER_TEMPLATES,
} from '@/lib/pet-report';
import PosterPreview from './PosterPreview';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Lang, TranslationKey, createTranslator } from '@/lib/i18n/translations';

interface PetPosterEditorProps {
  animal: Animal;
  modelSnapshot?: string | null;
  onClose: () => void;
  onExported: (result: ExportAnimalReportResult) => void;
}

export default function PetPosterEditor({ animal, modelSnapshot, onClose, onExported }: PetPosterEditorProps) {
  const { t, lang } = useLanguage();
  /**
   * Idioma del cartel, independiente del de la interfaz: el PDF se imprime y se
   * pega en la calle, y puede convenir una lengua distinta a la que se está
   * usando para navegar. Arranca en la de la interfaz.
   */
  const [posterLang, setPosterLang] = useState<Lang>(lang);
  const [draft, setDraft] = useState<AnimalReportDraft>(() => createAnimalReportDraft(animal, lang));
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  /**
   * Al cambiar el idioma del cartel se retraducen solo los textos automáticos
   * que la persona no haya tocado. Lo que escribió a mano se respeta siempre.
   */
  const changePosterLang = (next: Lang) => {
    const previousDefaults = createAnimalReportDraft(animal, posterLang);
    const nextDefaults = createAnimalReportDraft(animal, next);
    setPosterLang(next);
    setDraft((current) => {
      const retranslated = { ...current };
      const autoFields = ['headline', 'breed', 'owner', 'recognition'] as const;
      for (const field of autoFields) {
        if (current[field] === previousDefaults[field]) {
          retranslated[field] = nextDefaults[field];
        }
      }
      return retranslated;
    });
  };
  /**
   * Fotos reales y captura 3D en una sola lista: para el cartel son todas
   * imágenes intercambiables y se pueden combinar en la misma portada.
   */
  const visuals = useMemo(() => {
    const items = Array.from(
      new Set((animal.fotos || []).map((photo) => photo.trim()).filter(Boolean)),
    ).map((photo, index) => ({
      id: photo,
      src: photo,
      alt: `${t('dash.photo')} ${index + 1} — ${animal.nombre}`,
    }));

    if (modelSnapshot) {
      items.push({
        id: MODEL_VISUAL,
        src: modelSnapshot,
        alt: `${t('pe.view3d')} — ${animal.nombre}`,
      });
    }
    return items;
  }, [animal.fotos, animal.nombre, modelSnapshot, t]);

  const srcById = useMemo(
    () => new Map(visuals.map((visual) => [visual.id, visual.src])),
    [visuals],
  );

  // Todo lo que sigue se recalcula en cada cambio del borrador, así que la
  // vista previa y el contador de páginas van siempre en tiempo real.
  const previewImages = useMemo(
    () => coverPhotos(draft).map((id) => srcById.get(id)).filter((src): src is string => Boolean(src)),
    [draft, srcById],
  );

  // La página del modelo solo se genera si además existe el modelo asociado.
  const totalPages = useMemo(
    () => estimateReportPages(draft, Boolean(modelSnapshot && animal.modelo)),
    [draft, modelSnapshot, animal.modelo],
  );

  /** Deja el cartel en una sola hoja quitando los añadidos opcionales. */
  const reduceToOnePage = () => {
    setDraft((current) => ({
      ...current,
      includeDetailPage: false,
      includeModelPage: false,
      selectedPhotos: coverPhotos(current),
    }));
  };

  const update = <K extends keyof AnimalReportDraft>(key: K, value: AnimalReportDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const togglePhoto = (id: string) => {
    setDraft((current) => {
      const isSelected = current.selectedPhotos.includes(id);
      const selectedPhotos = isSelected
        ? current.selectedPhotos.filter((item) => item !== id)
        : [...current.selectedPhotos, id].slice(0, 8);
      // Si se quita la que era principal, pasa a serlo la primera que quede.
      const mainVisual = isSelected && current.mainVisual === id
        ? selectedPhotos[0] ?? null
        : current.mainVisual ?? selectedPhotos[0] ?? null;
      return { ...current, selectedPhotos, mainVisual };
    });
  };

  /**
   * Marca o desmarca la imagen principal. Es un botón y no un radio porque un
   * grupo de radios no permite volver atrás una vez elegido.
   */
  const toggleMainVisual = (id: string) => {
    setDraft((current) => {
      if (current.mainVisual === id) {
        const resto = current.selectedPhotos.filter((item) => item !== id);
        return { ...current, mainVisual: resto[0] ?? null };
      }
      // Elegirla como principal la incluye automáticamente en el PDF.
      const selectedPhotos = current.selectedPhotos.includes(id)
        ? current.selectedPhotos
        : [...current.selectedPhotos, id].slice(0, 8);
      return { ...current, selectedPhotos, mainVisual: id };
    });
  };

  const movePhoto = (photo: string, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.selectedPhotos.indexOf(photo);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.selectedPhotos.length) return current;
      const selectedPhotos = [...current.selectedPhotos];
      [selectedPhotos[index], selectedPhotos[nextIndex]] = [selectedPhotos[nextIndex], selectedPhotos[index]];
      return { ...current, selectedPhotos };
    });
  };

  const validate = () => {
    if (!draft.petName.trim()) return t('pe.errNeedName');
    if (!draft.contact.trim()) return t('pe.errNeedContact');
    if (!/^[+0-9()\-\s]{7,20}$/.test(draft.contact.trim())) return t('pe.errBadPhone');
    if (!draft.zone.trim()) return t('pe.errNeedZone');
    if (draft.selectedPhotos.length === 0) {
      return t('pe.errNeedPhoto');
    }
    if (!draft.mainVisual) return t('pe.errNeedMain');
    return '';
  };

  const handleExport = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setIsExporting(true);
    try {
      const result = await exportAnimalReport({ animal, modelSnapshot, draft, lang: posterLang });
      onExported(result);
    } catch (exportError) {
      console.error('Error al generar el cartel:', exportError);
      // Un ChunkLoadError no es culpa de los datos: el navegador guardó una
      // versión antigua de la página y pide un archivo que ya no existe.
      const esChunk =
        exportError instanceof Error &&
        (exportError.name === 'ChunkLoadError' || /Loading chunk/i.test(exportError.message));
      setError(esChunk ? t('pe.errChunk') : t('pe.errPdf'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="modal-overlay z-50">
      <div className="modal-content max-h-[94vh] overflow-y-auto" style={{ maxWidth: '90rem' }}>
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <h2 className="heading-secondary">{t('pe.title')}</h2>
            <p className="mt-1 text-sm text-gray-400">{t('pe.subtitle')}</p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost px-3" aria-label={t('pe.closeEditor')}>✕</button>
        </div>

        {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 space-y-6">
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{t('pe.s1')}</h3>
                <p className="text-xs text-gray-500">{t('pe.s1Hint')}</p>
              </div>

              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-emerald-200">{t('pe.posterLang')}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{t('pe.posterLangHint')}</p>
                  </div>
                  <LanguageSwitcher value={posterLang} onChange={changePosterLang} />
                </div>
                {posterLang !== lang && (
                  <p className="mt-3 text-xs text-amber-300/90">{t('pe.posterLangDiffers')}</p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t('pe.headline')} value={draft.headline} maxLength={36} onChange={(value) => update('headline', value)} />
                <Field label={t('pe.petName')} value={draft.petName} maxLength={50} required onChange={(value) => update('petName', value)} />
                <Field label={t('pet.breed')} value={draft.breed} maxLength={70} onChange={(value) => update('breed', value)} />
                <Field label={t('pe.ownerName')} value={draft.owner} maxLength={70} onChange={(value) => update('owner', value)} />
                <Field label={t('pet.phone')} value={draft.contact} maxLength={20} required onChange={(value) => update('contact', value)} />
                <Field label={t('pe.lastSeenDate')} value={draft.lastSeenDate} type="date" onChange={(value) => update('lastSeenDate', value)} />
              </div>
              <Field label={t('pet.zoneApprox')} value={draft.zone} maxLength={120} required onChange={(value) => update('zone', value)} />
              <Field label={t('pe.lastSeenRef')} value={draft.lastSeenReference} maxLength={180} onChange={(value) => update('lastSeenReference', value)} />
              <div>
                <label className="input-label">{t('pe.recognition')}</label>
                <textarea
                  className="input-base min-h-[110px] resize-y"
                  value={draft.recognition}
                  maxLength={420}
                  onChange={(event) => update('recognition', event.target.value)}
                />
                <p className="mt-1 text-right text-xs text-gray-500">{draft.recognition.length}/420</p>
              </div>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{t('pe.s2')}</h3>
                <p className="text-xs text-gray-500">{t('pe.s2Hint')}</p>
              </div>

              {visuals.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {visuals.map((visual) => {
                    const selected = draft.selectedPhotos.includes(visual.id);
                    const selectedIndex = draft.selectedPhotos.indexOf(visual.id);
                    const isMain = draft.mainVisual === visual.id;
                    const is3D = visual.id === MODEL_VISUAL;
                    return (
                      <div
                        key={visual.id}
                        className={`overflow-hidden rounded-lg border ${
                          selected
                            ? is3D
                              ? 'border-amber-400/60 bg-amber-500/5'
                              : 'border-emerald-400/60 bg-emerald-500/5'
                            : 'border-white/10 bg-white/[0.02]'
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-black/20 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={visual.src} alt={visual.alt} className="h-full w-full object-contain" />
                          {is3D && (
                            <span className="absolute left-3 top-3 rounded bg-amber-400/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                              {t('pe.view3d')}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 border-t border-white/10 p-3 text-sm">
                          <label className="flex cursor-pointer items-center gap-2 text-gray-200">
                            <input type="checkbox" checked={selected} onChange={() => togglePhoto(visual.id)} />
                            {t('pe.includeInPdf')}
                          </label>
                          {/* Botón, no radio: así también se puede desmarcar. */}
                          <button
                            type="button"
                            onClick={() => toggleMainVisual(visual.id)}
                            className={`w-full rounded-lg border px-3 py-1.5 text-left text-xs font-semibold transition ${
                              isMain
                                ? 'border-emerald-300 bg-emerald-500/20 text-emerald-100'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/25'
                            }`}
                          >
                            {isMain ? t('pe.isMain') : t('pe.useAsMain')}
                          </button>
                          {selected && (
                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="text-xs text-gray-500">{t('pe.order')} {selectedIndex + 1}</span>
                              <div className="flex gap-1">
                                <button type="button" className="btn-neutral px-3 py-1 text-sm" disabled={selectedIndex === 0} onClick={() => movePhoto(visual.id, -1)} aria-label={t('pe.moveBefore')}>↑</button>
                                <button type="button" className="btn-neutral px-3 py-1 text-sm" disabled={selectedIndex === draft.selectedPhotos.length - 1} onClick={() => movePhoto(visual.id, 1)} aria-label={t('pe.moveAfter')}>↓</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-white/15 p-6 text-center text-sm text-gray-500">{t('pe.noImages')}</div>
              )}

              {modelSnapshot && (
                <p className="text-xs text-gray-500">
                  {t('pe.mosaicHintA')} {t('pe.mosaicHintB')}{' '}
                  <b className="text-gray-400">{t('tpl.mosaico')}</b> {t('pe.mosaicHintC')}
                </p>
              )}
            </section>

            <section className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{t('pe.s3')}</h3>
                <p className="text-xs text-gray-500">{t('pe.s3Hint')}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {POSTER_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => update('template', template.id)}
                    className={`rounded-xl border p-3 text-left transition ${
                      draft.template === template.id
                        ? 'border-emerald-300 bg-emerald-500/15'
                        : 'border-white/10 bg-white/5 hover:border-white/25'
                    }`}
                  >
                    <TemplateThumb id={template.id} active={draft.template === template.id} />
                    <span
                      className={`mt-2 block text-sm font-semibold ${
                        draft.template === template.id ? 'text-emerald-100' : 'text-gray-200'
                      }`}
                    >
                      {t(`tpl.${template.id}` as TranslationKey)}
                    </span>
                    <span className="mt-1 block text-[11px] leading-tight text-gray-500">
                      {t(`tpl.${template.id}.desc` as TranslationKey)}
                    </span>
                  </button>
                ))}
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 p-4">
                <input type="checkbox" className="mt-1" checked={draft.includeDetailPage} onChange={(event) => update('includeDetailPage', event.target.checked)} />
                <span><span className="block text-sm font-medium text-gray-200">{t('pe.detailPage')}</span><span className="text-xs text-gray-500">{t('pe.detailPageHint')}</span></span>
              </label>
              {animal.modelo && modelSnapshot && (
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 p-4">
                  <input type="checkbox" className="mt-1" checked={draft.includeModelPage} onChange={(event) => update('includeModelPage', event.target.checked)} />
                  <span><span className="block text-sm font-medium text-gray-200">{t('pe.modelPage')}</span><span className="text-xs text-gray-500">{t('pe.modelPageHint')}</span></span>
                </label>
              )}
              <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/5 px-4 py-3 text-xs leading-relaxed text-cyan-100/80">
                {t('pe.privacy')}
              </div>
            </section>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-0 xl:self-start">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{t('pe.preview')}</h3>
              <span className={`text-xs font-semibold ${totalPages > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {totalPages} {totalPages === 1 ? t('pe.page') : t('pe.pages')}
              </span>
            </div>

            {/* La vista previa se rotula en el idioma del cartel, no en el de la interfaz. */}
            <PosterPreview
              draft={draft}
              categoryLabel={createTranslator(posterLang)(`cat.${animal.categoria}` as TranslationKey)}
              coverImages={previewImages}
              lang={posterLang}
            />

            {totalPages > 2 ? (
              <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-100">
                <p className="font-semibold">{t('pe.tooManyPagesA', { n: totalPages })}</p>
                <p className="mt-1 text-amber-100/80">{t('pe.tooManyPagesB')}</p>
                <button
                  type="button"
                  onClick={reduceToOnePage}
                  className="mt-2 rounded-lg border border-amber-300/50 bg-amber-400/15 px-3 py-1.5 font-semibold text-amber-100 transition hover:bg-amber-400/25"
                >
                  {t('pe.reduceToOne')}
                </button>
              </div>
            ) : (
              <p className="mt-3 text-center text-xs text-gray-500">{t('pe.a4Note')}</p>
            )}
          </aside>
        </div>

        <div className="sticky bottom-0 mt-6 flex flex-col-reverse gap-3 border-t border-white/10 bg-slate-950/95 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-neutral sm:min-w-[150px]">{t('form.cancel')}</button>
          <button type="button" onClick={handleExport} disabled={isExporting} className="btn-primary sm:min-w-[230px] disabled:cursor-wait disabled:opacity-60">{isExporting ? t('pe.generating') : t('pe.download')}</button>
        </div>
      </div>
    </div>
  );
}

/** Miniatura esquemática de cada plantilla, para elegir de un vistazo. */
function TemplateThumb({ id, active }: { id: string; active: boolean }) {
  const block = active ? 'bg-emerald-400/70' : 'bg-white/25';
  const photo = active ? 'bg-emerald-300/40' : 'bg-white/15';

  return (
    <div className="aspect-[210/297] w-full rounded border border-white/10 bg-slate-950/60 p-1.5">
      <div className={`h-[14%] w-full rounded-sm ${block}`} />
      {id === 'clasico' && (
        <div className="mt-1 flex h-[76%] flex-col gap-1">
          <div className={`h-[8%] w-2/3 rounded-sm ${block}`} />
          <div className="flex flex-1 gap-1">
            <div className={`flex-[2] rounded-sm ${photo}`} />
            <div className={`flex-1 rounded-sm ${block} opacity-60`} />
          </div>
          <div className={`h-[14%] w-full rounded-sm ${block} opacity-50`} />
        </div>
      )}
      {id === 'foto-grande' && (
        <div className="mt-1 flex h-[76%] flex-col gap-1">
          <div className={`flex-[3] rounded-sm ${photo}`} />
          <div className={`h-[10%] w-3/4 rounded-sm ${block}`} />
          <div className={`h-[16%] w-full rounded-sm ${block} opacity-70`} />
        </div>
      )}
      {id === 'mosaico' && (
        <div className="mt-1 flex h-[76%] flex-col gap-1">
          <div className={`h-[8%] w-2/3 rounded-sm ${block}`} />
          <div className="flex flex-[2] gap-1">
            <div className={`flex-[2] rounded-sm ${photo}`} />
            <div className="flex flex-1 flex-col gap-1">
              <div className={`flex-1 rounded-sm ${photo}`} />
              <div className={`flex-1 rounded-sm ${photo}`} />
            </div>
          </div>
          <div className={`h-[16%] w-full rounded-sm ${block} opacity-70`} />
        </div>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  required?: boolean;
  type?: 'text' | 'date';
}

function Field({ label, value, onChange, maxLength, required, type = 'text' }: FieldProps) {
  return (
    <div className="min-w-0">
      <label className="input-label">{label}{required ? ' *' : ''}</label>
      <input type={type} className="input-base w-full" value={value} maxLength={maxLength} required={required} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
