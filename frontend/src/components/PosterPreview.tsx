'use client';

import { createContext, useContext } from 'react';
import { AnimalReportDraft } from '@/lib/pet-report';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Lang, Translator, createTranslator } from '@/lib/i18n/translations';

interface PosterPreviewProps {
  draft: AnimalReportDraft;
  categoryLabel: string;
  /** Imágenes ya resueltas para la portada, en orden. */
  coverImages: string[];
  /**
   * Idioma del cartel. Puede diferir del de la interfaz: el PDF se imprime y
   * se pega en la calle, así que su lengua se decide aparte.
   */
  lang?: Lang;
}

/**
 * El cartel se rotula en su propio idioma, no en el de la interfaz. Se pasa
 * por contexto para que los subcomponentes (`Header`, `Photo`, `InfoCard`) lo
 * reciban sin encadenar props.
 */
const PosterLangContext = createContext<Translator | null>(null);

/** Traductor del cartel; cae al idioma de la interfaz si no se fijó uno. */
function usePosterT(): Translator {
  const override = useContext(PosterLangContext);
  const { t } = useLanguage();
  return override ?? t;
}

/**
 * Réplica en HTML de la portada del PDF. Usa las mismas proporciones A4
 * (210 x 297) y porcentajes equivalentes a los milímetros de pet-report.ts,
 * así que se actualiza en vivo con cada cambio del formulario.
 */
export default function PosterPreview({ draft, categoryLabel, coverImages, lang }: PosterPreviewProps) {
  const { t: uiT } = useLanguage();
  const t = lang ? createTranslator(lang) : uiT;
  const name = draft.petName || t('pet.name');
  const breed = draft.breed || t('pet.breed');
  const contact = draft.contact || t('pet.noPhone');
  const owner = draft.owner || t('dash.notRegisteredM');
  const zone = draft.zone || t('dash.notRegisteredF');
  const lastSeen = draft.lastSeenReference || draft.lastSeenDate || t('dash.notRegisteredF');
  const recognition = draft.recognition || t('pet.noDescription');

  return (
    <PosterLangContext.Provider value={t}>
    <div className="mx-auto aspect-[210/297] w-full max-w-[420px] overflow-hidden rounded-md bg-[#f7faf9] text-[#10233d] shadow-2xl">
      {draft.template === 'clasico' && (
        <>
          <Header headline={draft.headline} petName={name} tall />
          <div className="flex h-[79%] flex-col gap-[2.5%] p-[6.5%]">
            <div className="min-w-0">
              <p className="break-words text-[clamp(17px,3.6vw,26px)] font-black uppercase leading-none">{name}</p>
              <p className="mt-1 truncate text-[10px] text-slate-500">{categoryLabel} | {breed}</p>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(80px,1fr)] gap-2">
              <Photo src={coverImages[0]} />
              <div className="min-w-0 rounded bg-[#e4f4ef] p-2">
                <p className="text-[8px] font-bold text-[#087f6d]">{t('poster.contact')}</p>
                <p className="mt-0.5 break-all text-[13px] font-black leading-tight">{contact}</p>
                <p className="mt-2 text-[8px] text-slate-500">{t('poster.ownerLabel')}</p>
                <p className="break-words text-[10px] font-bold leading-tight">{owner}</p>
                <p className="mt-2 text-[8px] text-slate-500">{t('poster.category')}</p>
                <p className="text-[10px] font-bold">{categoryLabel}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InfoCard label={t('poster.zoneApprox')} value={zone} />
              <InfoCard label={t('poster.lastSeenLong')} value={lastSeen} />
            </div>
            <InfoCard label={t('poster.recognize')} value={recognition} lines={3} />
          </div>
        </>
      )}

      {draft.template === 'foto-grande' && (
        <>
          <Header headline={draft.headline} petName={name} />
          <div className="flex h-[85%] flex-col gap-[2%] p-[6.5%]">
            <div className="min-h-0 flex-[3]">
              <Photo src={coverImages[0]} />
            </div>
            <div className="min-w-0">
              <p className="break-words text-[clamp(19px,4.2vw,32px)] font-black uppercase leading-none">{name}</p>
              <p className="mt-0.5 truncate text-[10px] text-slate-500">{categoryLabel} | {breed}</p>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded bg-[#e4f4ef] p-2">
              <div className="min-w-0">
                <p className="text-[8px] font-bold text-[#087f6d]">{t('poster.contact')}</p>
                <p className="break-all text-[16px] font-black leading-tight">{contact}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-500">{t('poster.ownerLabel')}</p>
                <p className="break-words text-[10px] font-bold leading-tight">{owner}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InfoCard label={t('poster.zone')} value={zone} lines={2} />
              <InfoCard label={t('poster.lastSeen')} value={lastSeen} lines={2} />
            </div>
            <InfoCard label={t('poster.recognize')} value={recognition} lines={2} />
          </div>
        </>
      )}

      {draft.template === 'mosaico' && (
        <>
          <Header headline={draft.headline} petName={name} />
          <div className="flex h-[85%] flex-col gap-[2%] p-[6.5%]">
            <div className="min-w-0">
              <p className="break-words text-[clamp(16px,3.4vw,24px)] font-black uppercase leading-none">{name}</p>
              <p className="mt-0.5 truncate text-[10px] text-slate-500">{categoryLabel} | {breed}</p>
            </div>
            <div className="grid min-h-0 flex-[2] grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-2">
              <Photo src={coverImages[0]} />
              <div className="grid min-h-0 grid-rows-2 gap-2">
                <Photo src={coverImages[1]} />
                <Photo src={coverImages[2]} />
              </div>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded bg-[#e4f4ef] p-2">
              <div className="min-w-0">
                <p className="text-[8px] font-bold text-[#087f6d]">{t('poster.contact')}</p>
                <p className="break-all text-[16px] font-black leading-tight">{contact}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-500">{t('poster.ownerLabel')}</p>
                <p className="break-words text-[10px] font-bold leading-tight">{owner}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InfoCard label={t('poster.zone')} value={zone} lines={2} />
              <InfoCard label={t('poster.lastSeen')} value={lastSeen} lines={2} />
            </div>
            <InfoCard label={t('poster.recognize')} value={recognition} lines={3} />
          </div>
        </>
      )}
    </div>
    </PosterLangContext.Provider>
  );
}

function Header({ headline, petName, tall }: { headline: string; petName: string; tall?: boolean }) {
  const t = usePosterT();
  return (
    <>
      <div className={`bg-[#10233d] px-[6.5%] text-white ${tall ? 'pb-[3%] pt-[4.5%]' : 'pb-[2.5%] pt-[3.5%]'}`}>
        {/* Identifica a la mascota, no a la aplicación. */}
        <p className="truncate text-[9px] font-bold text-emerald-200">
          {t('poster.wanted')} - {petName.toUpperCase()}
        </p>
        <p className="mt-0.5 break-words text-[clamp(16px,3.6vw,26px)] font-black leading-none">
          {headline || t('poster.lost')}
        </p>
      </div>
      <div className="h-[2.5%] bg-[#d64f4f]" />
    </>
  );
}

function Photo({ src }: { src?: string }) {
  const t = usePosterT();
  return (
    // `h-full` es imprescindible: dentro de un contenedor flex la altura sería
    // automática, el `h-full` de la <img> resolvería contra `auto` y la foto se
    // dibujaría a tamaño natural, desbordando sobre el texto siguiente. Como
    // hijo de un grid el efecto es nulo, porque ya se estira solo.
    <div className="flex h-full min-h-0 min-w-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-white p-1">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={t('poster.preview')} className="h-full w-full object-contain" />
      ) : (
        <span className="px-1 text-center text-[9px] leading-tight text-slate-400">{t('pet.noPhoto')}</span>
      )}
    </div>
  );
}

function InfoCard({ label, value, lines = 2 }: { label: string; value: string; lines?: number }) {
  return (
    <div className="min-w-0 rounded border border-slate-200 bg-white p-1.5">
      <b className="text-[8px] text-[#087f6d]">{label}</b>
      <p
        className="mt-0.5 break-words text-[9px] leading-tight"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {value}
      </p>
    </div>
  );
}
