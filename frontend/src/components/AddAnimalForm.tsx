'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { Animal } from '@/types';
import MapLocationInput from './MapLocationInput';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';
import { GRUPOS_RASGOS, claveRasgo, rasgosValidos } from '@/lib/rasgos';

interface AddAnimalFormProps {
  onSuccess: (animal: Animal) => void;
  onCancel: () => void;
  /** Abre el editor del cartel de búsqueda al terminar de crear la mascota. */
  onRequestPoster?: (animal: Animal) => void;
  animal?: Animal | null;
  mode?: 'create' | 'edit';
}

const categoryOptions = ['PERRO', 'GATO', 'CONEJO'] as const;

/** Razas frecuentes en Ecuador. Si no está en la lista, se elige "Otra". */
const razasPorCategoria: Record<string, string[]> = {
  PERRO: [
    'Mestizo / Criollo',
    'Labrador Retriever',
    'Golden Retriever',
    'Pastor Alemán',
    'Pitbull',
    'Bulldog Francés',
    'Bulldog Inglés',
    'Chihuahua',
    'Poodle (Caniche)',
    'Schnauzer',
    'Shih Tzu',
    'Yorkshire Terrier',
    'Beagle',
    'Cocker Spaniel',
    'Husky Siberiano',
    'Rottweiler',
    'Dálmata',
    'Border Collie',
    'Pug',
    'Salchicha (Dachshund)',
    'Bóxer',
    'Maltés',
    'Pomerania',
    'San Bernardo',
    'Dóberman',
  ],
  GATO: [
    'Mestizo / Criollo',
    'Siamés',
    'Persa',
    'Angora',
    'Maine Coon',
    'Bengalí',
    'Británico de pelo corto',
    'Ragdoll',
    'Esfinge (Sphynx)',
    'Azul Ruso',
    'Scottish Fold',
    'Abisinio',
    'Bombay',
    'Carey (Calicó)',
  ],
  CONEJO: [
    'Mestizo / Criollo',
    'Enano holandés',
    'Cabeza de león',
    'Belier (orejas caídas)',
    'Angora',
    'Rex',
    'Californiano',
    'Neozelandés',
    'Mini Lop',
    'Gigante de Flandes',
  ],
};

const tamanoOptions = ['Muy pequeño', 'Pequeño', 'Mediano', 'Grande', 'Muy grande'];

const colorOptions = [
  'Negro',
  'Blanco',
  'Café / Marrón',
  'Dorado',
  'Crema / Beige',
  'Gris',
  'Naranja',
  'Atigrado',
  'Negro con blanco',
  'Café con blanco',
  'Manchado (dos colores)',
  'Tricolor',
];

const OTHER_VALUE = '__otro__';

/** Los pasos guardan claves de traducción: el rótulo se resuelve al pintar. */
const STEPS: { titleKey: TranslationKey; hintKey: TranslationKey }[] = [
  { titleKey: 'af.step0', hintKey: 'af.step0Hint' },
  { titleKey: 'af.step1', hintKey: 'af.step1Hint' },
  { titleKey: 'af.step2', hintKey: 'af.step2Hint' },
  { titleKey: 'af.step3', hintKey: 'af.step3Hint' },
  { titleKey: 'af.step4', hintKey: 'af.step4Hint' },
];

/** Tres fotos entran bien en el cartel sin saturarlo. */
const MAX_FOTOS = 3;
/** Tres numeros extra bastan: familia, vecino y directiva del barrio. */
const MAX_TELEFONOS_EXTRA = 3;
const MAX_BYTES_FOTO = 8 * 1024 * 1024;
const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPT_IMAGEN = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

/** Extrae el mensaje real que devuelve el backend en vez del genérico de axios. */
function mensajeDeError(error: unknown, alternativo: string) {
  const respuesta = (error as any)?.response?.data?.message;
  if (Array.isArray(respuesta) && respuesta.length > 0) return String(respuesta[0]);
  if (typeof respuesta === 'string' && respuesta.trim()) return respuesta;
  if (error instanceof Error && error.message) return error.message;
  return alternativo;
}

/** Separador de bloques cuando se edita y todo se muestra en una sola vista. */
function SectionTitle({ index }: { index: number }) {
  const { t } = useLanguage();
  return (
    <div className="border-b border-white/10 pb-2">
      <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
        {t(STEPS[index].titleKey)}
      </h3>
      <p className="text-xs text-gray-500">{t(STEPS[index].hintKey)}</p>
    </div>
  );
}

interface SelectWithOtherProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  otherPlaceholder: string;
  resetKey: string;
  /** Traduce el rótulo mostrado sin cambiar el valor que se guarda. */
  labelFor?: (option: string) => string;
}

/**
 * Select con opción "Otro": si la lista no cubre el caso, despliega un campo
 * de texto libre. El valor guardado siempre es texto plano, sin centinelas.
 */
function SelectWithOther({
  label,
  options,
  value,
  onChange,
  placeholder,
  otherPlaceholder,
  resetKey,
  labelFor,
}: SelectWithOtherProps) {
  const { t } = useLanguage();
  const [isOther, setIsOther] = useState(() => Boolean(value) && !options.includes(value));

  // Solo se recalcula al cambiar de mascota o de categoría, no en cada tecla:
  // si no, escribir en "Otro" cerraría el campo de texto al quedar vacío.
  useEffect(() => {
    setIsOther(Boolean(value) && !options.includes(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return (
    <div>
      <label className="input-label">{label}</label>
      <select
        value={isOther ? OTHER_VALUE : value}
        onChange={(event) => {
          if (event.target.value === OTHER_VALUE) {
            setIsOther(true);
            onChange('');
            return;
          }
          setIsOther(false);
          onChange(event.target.value);
        }}
        className="input-base"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {labelFor ? labelFor(option) : option}
          </option>
        ))}
        <option value={OTHER_VALUE}>{t('af.other')}</option>
      </select>

      {isOther && (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={otherPlaceholder}
          className="input-base mt-2"
          autoFocus
        />
      )}
    </div>
  );
}

export default function AddAnimalForm({
  onSuccess,
  onCancel,
  onRequestPoster,
  animal,
  mode = 'create',
}: AddAnimalFormProps) {
  const { t, tv } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [savedAnimal, setSavedAnimal] = useState<Animal | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [photoUrlDraft, setPhotoUrlDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rasgosSeleccionados, setRasgosSeleccionados] = useState<string[]>([]);
  const [telefonosExtra, setTelefonosExtra] = useState<string[]>([]);

  const cambiarTelefono = (indice: number, valor: string) => {
    setTelefonosExtra((actuales) => actuales.map((item, i) => (i === indice ? valor : item)));
  };
  const anadirTelefono = () => setTelefonosExtra((actuales) => [...actuales, '']);
  const quitarTelefono = (indice: number) => {
    setTelefonosExtra((actuales) => actuales.filter((_, i) => i !== indice));
  };

  /** Marca o desmarca un rasgo de la lista cerrada. */
  const toggleRasgo = (rasgo: string) => {
    setRasgosSeleccionados((actuales) =>
      actuales.includes(rasgo)
        ? actuales.filter((item) => item !== rasgo)
        : [...actuales, rasgo],
    );
  };

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'PERRO',
    descripcion: '',
    descripcionKw: '',
    raza: '',
    zona: '',
    direccion: '',
    googlePlaceId: '',
    latitud: '',
    longitud: '',
    telefonoContacto: '',
    ultimaVezVisto: '',
    fechaVisto: '',
    tamano: '',
    color: '',
  });

  useEffect(() => {
    setRasgosSeleccionados(rasgosValidos(animal?.rasgos));
    setTelefonosExtra(
      Array.isArray(animal?.telefonos)
        ? animal.telefonos.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
        : [],
    );
    setFormData({
      nombre: animal?.nombre ?? '',
      categoria: animal?.categoria ?? 'PERRO',
      descripcion: animal?.descripcion ?? '',
      descripcionKw: animal?.descripcionKw ?? '',
      raza: animal?.raza ?? '',
      zona: animal?.zona ?? '',
      direccion: animal?.direccion ?? '',
      googlePlaceId: animal?.googlePlaceId ?? '',
      latitud: animal?.latitud !== undefined ? String(animal.latitud) : '',
      longitud: animal?.longitud !== undefined ? String(animal.longitud) : '',
      telefonoContacto: animal?.telefonoContacto ?? '',
      ultimaVezVisto: animal?.ultimaVezVisto ?? '',
      fechaVisto: animal?.fechaVisto ? animal.fechaVisto.slice(0, 10) : '',
      tamano: animal?.caracteristicas?.tamano ?? '',
      color: animal?.caracteristicas?.color ?? '',
    });
    setPhotos(
      Array.isArray(animal?.fotos)
        ? animal.fotos.map((item) => String(item).trim()).filter(Boolean).slice(0, MAX_FOTOS)
        : [],
    );
    setPhotoUrlDraft('');
    setStep(0);
    setSavedAnimal(null);
    setError('');
  }, [animal]);

  const setField = (name: string) => (value: string) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const espaciosLibres = MAX_FOTOS - photos.length;

  /** Sube los archivos elegidos, validando formato y peso antes de enviarlos. */
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const seleccionados = Array.from(files);
    if (seleccionados.length > espaciosLibres) {
      setError(t('af.tooManyPhotos', { max: MAX_FOTOS, free: espaciosLibres }));
      return;
    }

    const invalido = seleccionados.find((file) => !TIPOS_IMAGEN.includes(file.type));
    if (invalido) {
      setError(`"${invalido.name}": ${t('af.badFormat')}`);
      return;
    }

    const pesado = seleccionados.find((file) => file.size > MAX_BYTES_FOTO);
    if (pesado) {
      setError(t('af.tooHeavy', { name: pesado.name }));
      return;
    }

    setError('');
    setUploading(true);
    try {
      const subidas: string[] = [];
      for (const file of seleccionados) {
        const resultado = await api.uploadImagenAnimal(file);
        subidas.push(resultado.url);
      }
      setPhotos((current) => [...current, ...subidas].slice(0, MAX_FOTOS));
    } catch (err) {
      setError(mensajeDeError(err, t('af.uploadFail')));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addPhotoUrl = () => {
    const url = photoUrlDraft.trim();
    if (!url) return;
    if (photos.length >= MAX_FOTOS) {
      setError(t('af.maxReached', { max: MAX_FOTOS }));
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      setError(t('af.badUrl'));
      return;
    }
    if (/\.gif(\?|$)/i.test(url)) {
      setError(t('af.badFormat'));
      return;
    }
    if (photos.includes(url)) {
      setError(t('af.duplicatePhoto'));
      return;
    }
    setError('');
    setPhotos((current) => [...current, url]);
    setPhotoUrlDraft('');
  };

  const removePhoto = (url: string) => {
    setPhotos((current) => current.filter((item) => item !== url));
  };

  /** Cada paso se valida por separado para no bloquear con errores lejanos. */
  const validateStep = (index: number): string => {
    if (index === 0 && !formData.nombre.trim()) {
      return t('af.needName');
    }
    if (index === 2 && (!formData.zona || !formData.latitud || !formData.longitud)) {
      return t('af.needZone');
    }
    if (index === 3) {
      const phone = formData.telefonoContacto.trim();
      if (!phone) return t('af.needPhone');
      if (!/^[+0-9()\-\s]{7,20}$/.test(phone)) {
        return t('af.badPhone');
      }
    }
    return '';
  };

  const goNext = () => {
    const stepError = validateStep(step);
    if (stepError) {
      setError(stepError);
      return;
    }
    setError('');
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError('');
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async () => {
    // Al guardar se revalida todo: se puede llegar al último paso por el
    // indicador superior sin haber pasado por los intermedios.
    for (let index = 0; index < STEPS.length; index += 1) {
      const stepError = validateStep(index);
      if (stepError) {
        setStep(index);
        setError(stepError);
        return;
      }
    }

    setError('');
    setLoading(true);

    const payload = {
      nombre: formData.nombre.trim(),
      categoria: formData.categoria,
      descripcion: formData.descripcion.trim(),
      descripcionKw: formData.descripcionKw.trim(),
      rasgos: rasgosSeleccionados,
      direccion: formData.direccion.trim(),
      telefonos: telefonosExtra.map((item) => item.trim()).filter(Boolean),
      raza: formData.raza.trim(),
      zona: formData.zona,
      googlePlaceId: formData.googlePlaceId || undefined,
      latitud: formData.latitud ? Number(formData.latitud) : undefined,
      longitud: formData.longitud ? Number(formData.longitud) : undefined,
      telefonoContacto: formData.telefonoContacto.trim(),
      ultimaVezVisto: formData.ultimaVezVisto.trim(),
      fechaVisto: formData.fechaVisto,
      fotos: photos,
      caracteristicas: {
        tamano: formData.tamano,
        color: formData.color,
        // El hábitat ya no se pide en el formulario, pero no se borra si existía.
        habitat: animal?.caracteristicas?.habitat ?? '',
      },
    };

    try {
      const result = mode === 'edit' && animal
        ? await api.updateAnimal(animal.id, payload)
        : await api.createAnimal(payload);

      onSuccess(result);

      if (mode === 'edit') {
        onCancel();
        return;
      }
      setSavedAnimal(result);
    } catch (err) {
      setError(mensajeDeError(err, t('af.saveError')));
    } finally {
      setLoading(false);
    }
  };

  const resetKey = `${animal?.id ?? 'nuevo'}:${formData.categoria}`;
  const isLastStep = step === STEPS.length - 1;

  /**
   * Al crear se avanza paso a paso para no abrumar. Al editar se muestra todo
   * junto: ya existe la mascota y normalmente solo se quiere corregir un dato
   * suelto, y buscarlo entre cinco pasos sería más lento.
   */
  const isEdit = mode === 'edit';
  const showStep = (index: number) => isEdit || step === index;

  // ── Pantalla final: la mascota ya está guardada ──
  if (savedAnimal) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '34rem' }}>
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl">
              ✓
            </div>
            <h2 className="heading-secondary">{t('af.savedTitle', { name: savedAnimal.nombre })}</h2>
            <p className="mt-2 text-sm text-gray-400">{t('af.savedHint')}</p>

            <div className="mt-6 space-y-3">
              {onRequestPoster && (
                <button
                  type="button"
                  onClick={() => {
                    onRequestPoster(savedAnimal);
                    onCancel();
                  }}
                  className="btn-primary w-full py-3"
                >
                  {t('af.preparePoster')}
                </button>
              )}
              <button type="button" onClick={onCancel} className="btn-neutral w-full py-3">
                {t('form.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div
        className={`modal-content ${isEdit ? 'max-h-[90vh] overflow-y-auto' : ''}`}
        style={{ maxWidth: '46rem' }}
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <h2 className="heading-secondary">
              {isEdit
                ? t('af.editTitle', { name: formData.nombre || t('af.editFallback') })
                : t('af.createTitle')}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isEdit
                ? t('af.editHint')
                : `${t('af.stepOf', { n: step + 1, total: STEPS.length })} ${t(STEPS[step].hintKey)}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-2xl text-gray-500 transition hover:text-gray-300"
            aria-label={t('form.close')}
          >
            ✕
          </button>
        </div>

        {/* Indicador de pasos: solo al crear; al editar se ve todo de una vez */}
        <div className={`mb-6 grid grid-cols-5 gap-1.5 ${isEdit ? 'hidden' : ''}`}>
          {STEPS.map((item, index) => {
            const state = index === step ? 'current' : index < step ? 'done' : 'todo';
            return (
              <button
                key={item.titleKey}
                type="button"
                disabled={index > step}
                onClick={() => {
                  setError('');
                  setStep(index);
                }}
                className={`rounded-lg border px-1 py-2 text-center transition disabled:cursor-not-allowed ${
                  state === 'current'
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                    : state === 'done'
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400/80 hover:border-emerald-400/60'
                      : 'border-white/10 bg-white/5 text-gray-600'
                }`}
              >
                <span className="block text-[11px] font-semibold leading-tight">{t(item.titleKey)}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Al crear, altura estable para que el modal no salte entre pasos. */}
        <div className={isEdit ? 'space-y-8' : 'min-h-[340px]'}>
          {showStep(0) && (
            <div className="space-y-5">
              {isEdit && <SectionTitle index={0} />}
              <div>
                <label className="input-label">{t('af.petName')}</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder={t('af.petNamePlaceholder')}
                  className="input-base"
                  autoFocus={!isEdit}
                />
              </div>

              <div>
                <label className="input-label">{t('af.whichAnimal')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          categoria: option,
                          // Cada categoría tiene su propia lista de razas.
                          raza: prev.categoria === option ? prev.raza : '',
                        }))
                      }
                      className={`h-12 rounded-xl border text-sm font-semibold transition ${
                        formData.categoria === option
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {t(`cat.${option}` as TranslationKey)}
                    </button>
                  ))}
                </div>
              </div>

              <SelectWithOther
                label={t('pet.breed')}
                options={razasPorCategoria[formData.categoria] ?? []}
                value={formData.raza}
                onChange={setField('raza')}
                placeholder={t('af.breedSelect')}
                otherPlaceholder={t('af.breedOther')}
                resetKey={resetKey}
                labelFor={(option) => tv('breed', option)}
              />
            </div>
          )}

          {showStep(1) && (
            <div className="space-y-5">
              {isEdit && <SectionTitle index={1} />}
              <p className="text-sm text-gray-400">{t('af.recognizeHint')}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <SelectWithOther
                  label={t('af.size')}
                  options={tamanoOptions}
                  value={formData.tamano}
                  onChange={setField('tamano')}
                  placeholder={t('af.sizeSelect')}
                  otherPlaceholder={t('af.sizeOther')}
                  resetKey={resetKey}
                  labelFor={(option) => tv('size', option)}
                />
                <SelectWithOther
                  label={t('model.color')}
                  options={colorOptions}
                  value={formData.color}
                  onChange={setField('color')}
                  placeholder={t('af.colorSelect')}
                  otherPlaceholder={t('af.colorOther')}
                  resetKey={resetKey}
                  labelFor={(option) => tv('color', option)}
                />
              </div>

              {/*
                Lista cerrada de rasgos. Es lo que permite que un
                kichwahablante sepa cómo es el animal y qué carácter tiene sin
                depender de que el dueño escriba en kichwa: al guardar la clave
                y no el rótulo, la ficha lo muestra en la lengua que se pida.
              */}
              <div>
                <label className="input-label">{t('traits.title')}</label>
                <p className="mb-3 text-xs text-gray-500">{t('traits.hint')}</p>
                <div className="space-y-3">
                  {GRUPOS_RASGOS.map((grupo) => (
                    <div key={grupo.id}>
                      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        {t(grupo.tituloKey)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {grupo.rasgos.map((rasgo) => {
                          const activo = rasgosSeleccionados.includes(rasgo);
                          return (
                            <button
                              key={rasgo}
                              type="button"
                              aria-pressed={activo}
                              onClick={() => toggleRasgo(rasgo)}
                              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                                activo
                                  ? 'border-emerald-300 bg-emerald-500/15 text-emerald-100'
                                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                              }`}
                            >
                              {t(claveRasgo(rasgo))}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label">{t('af.marks')}</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder={t('af.marksPlaceholder')}
                  className="input-base h-28 resize-none"
                  rows={4}
                />
                <p className="mt-1 text-xs text-gray-500">{t('af.marksHint')}</p>
              </div>

              {/*
                La descripción en kichwa la escribe la propia persona. No se
                traduce automáticamente: no existe un traductor
                castellano-kichwa fiable, y sobreescribir lo que alguien
                escribió sobre su mascota sería hablar por ella.
              */}
              <div>
                <label className="input-label">{t('af.marksKw')}</label>
                <textarea
                  name="descripcionKw"
                  value={formData.descripcionKw}
                  onChange={handleChange}
                  placeholder={t('af.marksKwPlaceholder')}
                  className="input-base h-28 resize-none"
                  rows={4}
                />
                <p className="mt-1 text-xs text-gray-500">{t('af.marksKwHint')}</p>
              </div>
            </div>
          )}

          {showStep(2) && (
            <div className="space-y-5">
              {isEdit && <SectionTitle index={2} />}
              <div>
                <label className="input-label">{t('af.whereLost')}</label>
                <MapLocationInput
                  value={formData.zona}
                  onChange={(location) =>
                    setFormData((prev) => ({
                      ...prev,
                      zona: location.zone,
                      // Se rellena sola al marcar el punto, pero queda
                      // editable: nadie conoce el sitio como quien estuvo.
                      direccion: location.address || prev.direccion,
                      googlePlaceId: location.placeId || '',
                      latitud: location.lat !== undefined ? String(location.lat) : '',
                      longitud: location.lng !== undefined ? String(location.lng) : '',
                    }))
                  }
                  placeholder={t('af.zonePlaceholder')}
                />
              </div>

              {/*
                El nombre del barrio que devuelve la geocodificación inversa es
                el que OpenStreetMap tenga cartografiado más cerca, y en el sur
                de Quito muchos sectores no lo están: marcando en la avenida El
                Beaterio puede responder «San José de Guamaní». La vía sí es
                fiable; el sector es conocimiento local, así que se deja
                corregir a quien perdió al animal, que es quien lo sabe.
              */}
              <div>
                <label className="input-label">{t('af.sector')}</label>
                <input
                  type="text"
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                  placeholder={t('af.sectorPlaceholder')}
                  className="input-base"
                />
                <p className="mt-1 text-xs text-gray-500">{t('af.sectorHint')}</p>
              </div>

              {/*
                La zona nombra el barrio; esto da la calle. Se rellena solo al
                marcar el punto en el mapa y queda editable, porque quien
                estuvo allí puede precisar la intersección mejor que Nominatim.
              */}
              <div>
                <label className="input-label">{t('af.address')}</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder={t('af.addressPlaceholder')}
                  className="input-base"
                />
                <p className="mt-1 text-xs text-gray-500">{t('af.addressHint')}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="input-label">{t('af.whenSeen')}</label>
                  <input
                    type="date"
                    name="fechaVisto"
                    value={formData.fechaVisto}
                    onChange={handleChange}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="input-label">{t('af.placeReference')}</label>
                  <input
                    type="text"
                    name="ultimaVezVisto"
                    value={formData.ultimaVezVisto}
                    onChange={handleChange}
                    placeholder={t('af.placeReferencePlaceholder')}
                    className="input-base"
                  />
                </div>
              </div>

              <p className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-3 text-xs leading-relaxed text-cyan-100/80">
                {t('af.privacyNote')}
              </p>
            </div>
          )}

          {showStep(3) && (
            <div className="space-y-5">
              {isEdit && <SectionTitle index={3} />}
              <div>
                <label className="input-label">{t('af.phone')}</label>
                <input
                  type="tel"
                  name="telefonoContacto"
                  value={formData.telefonoContacto}
                  onChange={handleChange}
                  placeholder={t('af.phonePlaceholder')}
                  className="input-base"
                  autoFocus={!isEdit}
                />
                <p className="mt-1 text-xs text-gray-500">{t('af.phoneHint')}</p>
              </div>

              {/*
                Números adicionales. Buscar una mascota no lo hace una sola
                persona: participan la familia y los vecinos. Con un único
                número, si quien contesta está trabajando, el aviso de alguien
                que vio al animal se pierde.
              */}
              <div>
                <label className="input-label">{t('af.morePhones')}</label>
                <div className="space-y-2">
                  {telefonosExtra.map((telefono, indice) => (
                    <div key={indice} className="flex gap-2">
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(event) => cambiarTelefono(indice, event.target.value)}
                        placeholder={t('af.phonePlaceholder')}
                        className="input-base flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => quitarTelefono(indice)}
                        className="rounded-xl border border-white/10 px-4 text-gray-400 transition hover:border-red-400/40 hover:text-red-300"
                        aria-label={t('af.removePhone')}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {telefonosExtra.length < MAX_TELEFONOS_EXTRA && (
                  <button
                    type="button"
                    onClick={anadirTelefono}
                    className="mt-2 rounded-xl border border-dashed border-white/20 px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-300/50 hover:text-emerald-200"
                  >
                    + {t('af.addPhone')}
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-500">{t('af.morePhonesHint')}</p>
              </div>
            </div>
          )}

          {showStep(4) && (
            <div className="space-y-4">
              {isEdit && <SectionTitle index={4} />}
              <div className="flex items-center justify-between">
                <label className="input-label mb-0">{t('af.petPhotos')}</label>
                <span className={`text-xs ${photos.length >= MAX_FOTOS ? 'text-amber-400' : 'text-gray-500'}`}>
                  {photos.length} {t('af.of')} {MAX_FOTOS}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/30"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={t('af.photoAlt', { n: index + 1 })}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.opacity = '0.2';
                      }}
                    />
                    {index === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                        {t('af.cover')}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo)}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/85 text-sm text-gray-300 transition hover:bg-red-500 hover:text-white"
                      aria-label={t('af.removePhoto', { n: index + 1 })}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {espaciosLibres > 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] text-gray-400 transition hover:border-emerald-400/50 hover:text-emerald-300 disabled:cursor-wait disabled:opacity-50"
                  >
                    <span className="text-2xl leading-none">{uploading ? '⏳' : '+'}</span>
                    <span className="px-2 text-center text-[11px] leading-tight">
                      {uploading ? t('model.uploading') : t('af.uploadPhoto')}
                    </span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_IMAGEN}
                multiple
                className="hidden"
                onChange={(event) => void handleFiles(event.target.files)}
              />

              <p className="text-xs text-gray-500">{t('af.photoRules')}</p>

              <div className="border-t border-white/10 pt-4">
                <label className="input-label">{t('af.pasteLink')}</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoUrlDraft}
                    onChange={(event) => setPhotoUrlDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addPhotoUrl();
                      }
                    }}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="input-base flex-1"
                    disabled={espaciosLibres === 0}
                  />
                  <button
                    type="button"
                    onClick={addPhotoUrl}
                    disabled={espaciosLibres === 0 || !photoUrlDraft.trim()}
                    className="btn-neutral px-5 disabled:opacity-40"
                  >
                    {t('af.add')}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">{t('af.linkHint')}</p>
              </div>
            </div>
          )}
        </div>

        <div
          className={`mt-6 flex gap-3 border-t border-white/10 pt-4 ${
            isEdit ? 'sticky bottom-0 bg-slate-950/95 pb-2' : ''
          }`}
        >
          <button
            type="button"
            onClick={isEdit || step === 0 ? onCancel : goBack}
            className="btn-neutral flex-1 py-3"
            disabled={loading}
          >
            {isEdit || step === 0 ? t('form.cancel') : t('form.back')}
          </button>

          {isEdit || isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-[2] py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t('form.saving') : isEdit ? t('ed.saveChanges') : t('af.create')}
            </button>
          ) : (
            <button type="button" onClick={goNext} className="btn-primary flex-[2] py-3">
              {t('af.continue')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
