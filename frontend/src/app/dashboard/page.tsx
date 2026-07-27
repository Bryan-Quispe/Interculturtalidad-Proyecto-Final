'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Animal, Modelo3D } from '@/types';
import Canvas3DViewer, { Canvas3DViewerHandle } from '@/components/Canvas3DViewer';
import AddAnimalForm from '@/components/AddAnimalForm';
import UploadModelForm from '@/components/UploadModelForm';
import ModelSelector from '@/components/ModelSelector';
import EditModelForm from '@/components/EditModelForm';
import PetPosterEditor from '@/components/PetPosterEditor';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ConfirmHoldDialog from '@/components/ConfirmHoldDialog';
import { ExportAnimalReportResult } from '@/lib/pet-report';
import { clearSessionKeepingLanguage, useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';
import { claveRasgo, rasgosValidos } from '@/lib/rasgos';

/** Especies del catálogo 3D, en el orden en que se muestran las pestañas. */
const MODEL_CATEGORIES: Animal['categoria'][] = ['PERRO', 'GATO', 'CONEJO'];

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { t, tv, pick } = useLanguage();

  /**
   * Descripcion en el idioma activo. El texto libre no se traduce solo, asi
   * que se muestra la version que su autor escribio en esa lengua; si no la
   * escribio, se cae a la que si existe antes que dejar el hueco vacio.
   */
  const descripcionDe = (animal: { descripcion?: string; descripcionKw?: string }) => {
    const es = animal.descripcion?.trim() ?? '';
    const kw = animal.descripcionKw?.trim() ?? '';
    if (!kw) return es;
    if (!es) return kw;
    return pick(es, kw);
  };
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [modelos, setModelos] = useState<Modelo3D[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<Modelo3D | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectorAnimal, setSelectorAnimal] = useState<Animal | null>(null);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [editingModelo, setEditingModelo] = useState<Modelo3D | null>(null);
  /** Mascota desde la que se abrió el editor 3D, si vino de su ficha. */
  const [modelEditorAnimal, setModelEditorAnimal] = useState<Animal | null>(null);
  const [animalSearch, setAnimalSearch] = useState('');
  const [animalOwnerFilter, setAnimalOwnerFilter] = useState('all');
  /** Especie con la que se filtra el catálogo 3D; 'all' las muestra todas. */
  const [modelCategoryFilter, setModelCategoryFilter] = useState<'all' | Animal['categoria']>('all');
  /** Modelo pendiente de confirmar borrado, o null si no hay diálogo abierto. */
  const [modeloAEliminar, setModeloAEliminar] = useState<Modelo3D | null>(null);
  const [deletingModel, setDeletingModel] = useState(false);
  const [modelMessage, setModelMessage] = useState('');
  const [modelMessageError, setModelMessageError] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  /** El color del aviso ya no puede deducirse del texto: cambia con el idioma. */
  const [exportError, setExportError] = useState(false);
  const [posterAnimal, setPosterAnimal] = useState<Animal | null>(null);
  const [posterModelSnapshot, setPosterModelSnapshot] = useState<string | null>(null);
  const modelViewerRef = useRef<Canvas3DViewerHandle>(null);
  const router = useRouter();

  useEffect(() => {
    hydrateSession();
  }, [router]);

  const clearSessionAndRedirect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    api.clearAuthToken();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    router.replace('/auth/login');
  };

  const hydrateSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      clearSessionAndRedirect();
      return;
    }

    try {
      api.setAuthToken(token);
      const profile = await api.getUserProfile();

      localStorage.setItem('user', JSON.stringify(profile));
      useAuthStore.setState({
        token,
        user: profile,
        isAuthenticated: true,
      });

      await loadData(profile);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        clearSessionAndRedirect();
        return;
      }

      console.error('Error validando sesión:', error);
      setLoading(false);
    }
  };

  const loadData = async (currentUser?: any) => {
    try {
      setLoading(true);
      const animalesData = currentUser?.role === 'ADMIN'
        ? await api.getAnimals()
        : await api.getMyAnimals();
      setAnimales(Array.isArray(animalesData) ? animalesData : []);

      const modelosData = await api.getModelos();
      setModelos(Array.isArray(modelosData) ? modelosData : []);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        clearSessionAndRedirect();
        return;
      }

      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const animalesFiltrados = animalsFilter(animales, animalSearch, animalOwnerFilter, user?.role === 'ADMIN');

  /**
   * Catálogo 3D agrupado por especie. Se cuenta sobre la lista completa para
   * que cada pestaña muestre su total aunque haya un filtro activo.
   */
  const modelosPorEspecie = MODEL_CATEGORIES.map((categoria) => ({
    categoria,
    total: modelos.filter((modelo) => modelo.categoria === categoria).length,
  }));

  const modelosFiltrados = modelCategoryFilter === 'all'
    ? modelos
    : modelos.filter((modelo) => modelo.categoria === modelCategoryFilter);

  function animalsFilter(
    items: Animal[],
    search: string,
    ownerId: string,
    isAdmin: boolean,
  ) {
    const normalizedSearch = search.trim().toLowerCase();
    return items.filter((animal) => {
      const matchesSearch =
        !normalizedSearch ||
        animal.nombre.toLowerCase().includes(normalizedSearch) ||
        (animal.raza || '').toLowerCase().includes(normalizedSearch) ||
        (animal.usuario?.name || '').toLowerCase().includes(normalizedSearch) ||
        (animal.usuario?.email || '').toLowerCase().includes(normalizedSearch);

      const matchesOwner =
        !isAdmin ||
        ownerId === 'all' ||
        animal.usuarioId === ownerId;

      return matchesSearch && matchesOwner;
    });
  }

  const handleAnimalSaved = (savedAnimal: Animal) => {
    setAnimales((current) => {
      const existingIndex = current.findIndex((a) => a.id === savedAnimal.id);
      if (existingIndex === -1) return [savedAnimal, ...current];
      const updated = [...current];
      updated[existingIndex] = savedAnimal;
      return updated;
    });
    if (selectedAnimal?.id === savedAnimal.id) {
      setSelectedAnimal(savedAnimal);
      setSelectedModelo(savedAnimal.modelo ?? null);
    }
    // El propio formulario decide cuándo cerrarse: al crear muestra un paso
    // final con la opción de generar el cartel de búsqueda.
  };

  const handleModelUploaded = (modelo: Modelo3D) => {
    setModelos((current) => [modelo, ...current]);
    setShowUploadForm(false);
  };

  const handleModelUpdated = async (updatedModel: Modelo3D) => {
    // Al pintar desde una mascota se guarda una copia nueva, no se edita el
    // modelo base: en ese caso hay que añadirla y asignarla a la mascota.
    const esVersionNueva = !modelos.some((modelo) => modelo.id === updatedModel.id);
    const animalDestino = modelEditorAnimal;

    setModelos((current) =>
      esVersionNueva
        ? [updatedModel, ...current]
        : current.map((modelo) => (modelo.id === updatedModel.id ? updatedModel : modelo))
    );

    if (esVersionNueva && animalDestino) {
      try {
        const actualizado = await api.assignModelToAnimal(animalDestino.id, updatedModel.id);
        setAnimales((current) =>
          current.map((a) => (a.id === actualizado.id ? actualizado : a))
        );
        if (selectedAnimal?.id === actualizado.id) {
          setSelectedAnimal(actualizado);
          setSelectedModelo(actualizado.modelo ?? updatedModel);
        }
      } catch (error) {
        console.error('Error al asignar la versión personalizada:', error);
        window.alert(t('dash.assignError'));
      } finally {
        setModelEditorAnimal(null);
        setEditingModelo(null);
      }
      return;
    }

    // El mismo modelo puede estar asignado a varias mascotas: se refresca en
    // todas para que la pintura nueva se vea sin recargar la página.
    setAnimales((current) =>
      current.map((a) => (a.modelo?.id === updatedModel.id ? { ...a, modelo: updatedModel } : a))
    );
    setSelectedAnimal((current) =>
      current?.modelo?.id === updatedModel.id ? { ...current, modelo: updatedModel } : current
    );
    setSelectedModelo((current) => (current?.id === updatedModel.id ? updatedModel : current));
    setModelEditorAnimal(null);
    setEditingModelo(null);
  };

  const handleModelAssigned = (updatedAnimal: Animal) => {
    setAnimales((current) =>
      current.map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a))
    );
    // Si es la mascota abierta, el visor pasa al modelo nuevo al instante.
    if (selectedAnimal?.id === updatedAnimal.id) {
      setSelectedAnimal(updatedAnimal);
      setSelectedModelo(updatedAnimal.modelo ?? null);
    }
    setShowModelSelector(false);
    setSelectorAnimal(null);
    loadData(user);
  };

  const handleEditAnimal = (animal: Animal) => {
    setEditingAnimal(animal);
    setShowAnimalForm(true);
  };

  const handleEditModel = (modelo: Modelo3D, animal?: Animal) => {
    setModelEditorAnimal(animal ?? null);
    setEditingModelo(modelo);
  };

  const handleDeleteAnimal = async (animal: Animal) => {
    const confirmed = window.confirm(t('dash.confirmDelete', { name: animal.nombre }));
    if (!confirmed) return;

    try {
      await api.deleteAnimal(animal.id);
      setAnimales((current) => current.filter((a) => a.id !== animal.id));
      if (selectedAnimal?.id === animal.id) {
        setSelectedAnimal(null);
        setSelectedModelo(null);
      }
    } catch (error) {
      console.error('Error deleting animal:', error);
      window.alert(t('dash.deleteError'));
    }
  };

  /** Mascotas que perderán la referencia 3D al borrar el modelo. */
  const contarMascotasConModelo = (modeloId: string) =>
    animales.filter((animal) => animal.modelo?.id === modeloId).length;

  const handleDeleteModel = async () => {
    if (!modeloAEliminar || deletingModel) return;

    const { id } = modeloAEliminar;
    setDeletingModel(true);
    try {
      await api.deleteModelo(id);

      setModelos((current) => current.filter((modelo) => modelo.id !== id));
      // El backend desvincula la mascota; aquí se refleja sin recargar.
      setAnimales((current) =>
        current.map((animal) =>
          animal.modelo?.id === id ? { ...animal, modelo: undefined, modeloId: undefined } : animal,
        ),
      );
      setSelectedAnimal((current) =>
        current?.modelo?.id === id ? { ...current, modelo: undefined, modeloId: undefined } : current,
      );
      setSelectedModelo((current) => (current?.id === id ? null : current));

      setModelMessageError(false);
      setModelMessage(t('confirm.deleteModelOk'));
      setModeloAEliminar(null);
    } catch (error) {
      console.error('Error deleting model:', error);
      setModelMessageError(true);
      setModelMessage(t('confirm.deleteModelError'));
    } finally {
      setDeletingModel(false);
    }
  };

  const openModelSelector = (animal: Animal) => {
    setSelectorAnimal(animal);
    setShowModelSelector(true);
  };

  const openAnimalDetails = (animal: Animal) => {
    setSelectedAnimal(animal);
    setSelectedModelo(animal.modelo ?? null);
    setExportMessage('');
    setExportError(false);
  };

  const handleExportAnimal = async () => {
    if (!selectedAnimal || isExporting) return;

    setIsExporting(true);
    setExportError(false);
    setExportMessage(t('dash.loadingPoster'));

    try {
      const currentAnimal = await api.getAnimal(selectedAnimal.id);
      const modelSnapshot = modelViewerRef.current?.captureImage() ?? null;
      setSelectedAnimal(currentAnimal);
      setSelectedModelo(currentAnimal.modelo ?? null);
      setPosterAnimal(currentAnimal);
      setPosterModelSnapshot(modelSnapshot);
      setExportMessage('');
    } catch (error) {
      console.error('Error preparing animal report:', error);
      setExportError(true);
      setExportMessage(t('dash.posterError'));
    } finally {
      setIsExporting(false);
    }
  };

  const handlePosterExported = (result: ExportAnimalReportResult) => {
    const photoWord = result.includedPhotos === 1 ? t('dash.photoOne') : t('dash.photoMany');
    const details = [`${result.includedPhotos} ${photoWord}`];
    if (posterAnimal?.modelo) {
      details.push(result.includedModelSnapshot ? t('dash.with3d') : t('dash.without3d'));
    }
    if (result.omittedPhotos > 0) {
      details.push(`${result.omittedPhotos} ${t('dash.photoMany')} ${t('dash.omitted')}`);
    }
    setExportError(false);
    setExportMessage(`${t('dash.pdfOk')} ${details.join(', ')}.`);
    setPosterAnimal(null);
    setPosterModelSnapshot(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">{t('dash.redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass-strong sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <h1 className="text-xl font-bold gradient-text">{t('dash.title')}</h1>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Dentro de la sesión también se puede cambiar de lengua. */}
            <LanguageSwitcher />
            <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
              <span className="font-medium text-gray-300">{user?.name}</span>
              {user?.role === 'ADMIN' ? (
                <span className="badge-admin">{t('dash.admin')}</span>
              ) : (
                <span className="badge-user">{t('dash.user')}</span>
              )}
            </div>
            <button
              onClick={() => {
                clearSessionKeepingLanguage();
                api.clearAuthToken();
                useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
                router.push('/');
              }}
              className="btn-danger text-sm"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-10">
        {selectedAnimal ? (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedAnimal(null);
                  setSelectedModelo(null);
                  setExportMessage('');
                  setExportError(false);
                }}
                className="btn-ghost text-sm"
              >
                {t('dash.backToList')}
              </button>
              <button
                type="button"
                onClick={handleExportAnimal}
                disabled={isExporting}
                className="btn-primary min-w-[190px] disabled:cursor-wait disabled:opacity-60"
              >
                {isExporting ? t('dash.preparing') : t('dash.preparePdf')}
              </button>
            </div>

            {exportMessage && (
              <div
                className="rounded-lg px-4 py-3 text-sm text-gray-200"
                style={{
                  background: exportError
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(16, 185, 129, 0.12)',
                  border: exportError
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {exportMessage}
              </div>
            )}

            <div className="grid min-w-0 lg:grid-cols-3 gap-8">
              <div className="min-w-0 lg:col-span-2 space-y-6">
                {selectedModelo ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="heading-secondary text-xl">{t('dash.visual3d')}</h2>
                        <p className="text-sm text-gray-500">{t('dash.visual3dHint')}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEditModel(selectedModelo, selectedAnimal)}
                          className="btn-secondary px-4 py-2 text-sm"
                        >
                          {t('dash.edit3d')}
                        </button>
                        <button
                          onClick={() => openModelSelector(selectedAnimal)}
                          className="btn-neutral px-4 py-2 text-sm"
                        >
                          {t('dash.reassign')}
                        </button>
                      </div>
                    </div>
                    <Canvas3DViewer ref={modelViewerRef} modelo={selectedModelo} strokes={selectedModelo.pinturas} autoRotate={false} />
                  </div>
                ) : (
                  <div className="card min-h-[300px] flex flex-col items-center justify-center text-center">
                    <p className="text-lg font-semibold text-gray-200">{t('dash.noModel')}</p>
                    <p className="mt-2 max-w-md text-sm text-gray-500">{t('dash.noModelHint')}</p>
                    <button onClick={() => openModelSelector(selectedAnimal)} className="btn-secondary mt-5">
                      {t('dash.assignModel')}
                    </button>
                  </div>
                )}

                <section className="space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="heading-secondary text-xl">{t('dash.photos')}</h2>
                      <p className="text-sm text-gray-500">{t('dash.photosHint')}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {selectedAnimal.fotos?.length ?? 0}{' '}
                      {selectedAnimal.fotos?.length === 1 ? t('dash.photoOne') : t('dash.photoMany')}
                    </span>
                  </div>

                  {selectedAnimal.fotos && selectedAnimal.fotos.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {selectedAnimal.fotos.map((photo, index) => (
                        <figure
                          key={`${photo}-${index}`}
                          className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-black/20"
                        >
                          <div className="aspect-[4/3] flex items-center justify-center p-2">
                            <img
                              src={photo}
                              alt={`${selectedAnimal.nombre}, ${t('dash.photo')} ${index + 1}`}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <figcaption className="border-t border-white/10 px-3 py-2 text-xs text-gray-500">
                            {t('dash.photo')} {index + 1}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-white/15 px-5 py-10 text-center text-sm text-gray-500">
                      {t('dash.noPhotos')}
                    </div>
                  )}
                </section>
              </div>

              <div className="card min-w-0 space-y-6">
                <div>
                  <h2 className="heading-secondary mb-1">{selectedAnimal.nombre}</h2>
                  <p className="text-emerald-400 text-sm">{t(`cat.${selectedAnimal.categoria}` as TranslationKey)}</p>
                  {selectedAnimal.raza && <p className="text-emerald-400 italic text-sm">{tv('breed', selectedAnimal.raza)}</p>}
                </div>

                <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <h3 className="font-bold text-emerald-400 mb-3 text-sm uppercase tracking-wider">{t('dash.searchData')}</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-gray-500">{t('dash.owner')}</span> <span className="text-gray-300">{selectedAnimal.usuario?.name || t('dash.notRegisteredM')}</span></p>
                    <p><span className="text-gray-500">{t('dash.contact')}</span> <span className="text-gray-300">{selectedAnimal.telefonoContacto || t('dash.notRegisteredM')}</span></p>
                    <p><span className="text-gray-500">{t('dash.zone')}</span> <span className="text-gray-300">{selectedAnimal.zona || t('dash.notRegisteredF')}</span></p>
                    {selectedAnimal.direccion && (
                      <p><span className="text-gray-500">{t('dash.address')}</span> <span className="text-gray-300">{selectedAnimal.direccion}</span></p>
                    )}
                    <p><span className="text-gray-500">{t('dash.date')}</span> <span className="text-gray-300">{selectedAnimal.fechaVisto ? new Date(selectedAnimal.fechaVisto).toLocaleDateString('es-EC') : t('dash.notRegisteredF')}</span></p>
                    <p><span className="text-gray-500">{t('dash.lastSeen')}</span> <span className="text-gray-300">{selectedAnimal.ultimaVezVisto || t('dash.noReference')}</span></p>
                  </div>
                </div>

                {rasgosValidos(selectedAnimal.rasgos).length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {rasgosValidos(selectedAnimal.rasgos).map((rasgo) => (
                      <span
                        key={rasgo}
                        className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
                      >
                        {t(claveRasgo(rasgo))}
                      </span>
                    ))}
                  </div>
                )}
                {selectedAnimal.descripcion && (
                  <div>
                    <h3 className="font-bold text-gray-300 mb-2 text-sm uppercase tracking-wider">{t('dash.description')}</h3>
                    <p className="text-gray-400 leading-relaxed">{descripcionDe(selectedAnimal)}</p>
                  </div>
                )}

                {selectedAnimal.caracteristicas && (
                  <div className="space-y-3 rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <h3 className="font-bold text-emerald-400 mb-3 text-sm uppercase tracking-wider">{t('dash.features')}</h3>
                    {selectedAnimal.caracteristicas.tamano && (
                      <p className="flex items-center gap-2 text-gray-400 text-sm"><span className="text-gray-500">{t('dash.size')}</span> {tv('size', selectedAnimal.caracteristicas.tamano)}</p>
                    )}
                    {selectedAnimal.caracteristicas.color && (
                      <p className="flex items-center gap-2 text-gray-400 text-sm"><span className="text-gray-500">{t('dash.color')}</span> {tv('color', selectedAnimal.caracteristicas.color)}</p>
                    )}
                    {selectedAnimal.caracteristicas.habitat && (
                      <p className="flex items-center gap-2 text-gray-400 text-sm"><span className="text-gray-500">{t('dash.habitat')}</span> {selectedAnimal.caracteristicas.habitat}</p>
                    )}
                  </div>
                )}

                {selectedModelo && (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <h3 className="font-bold text-amber-400 mb-2 text-sm uppercase tracking-wider">{t('dash.model3d')}</h3>
                    <p className="text-gray-400 text-sm">{selectedModelo.nombre}</p>
                    {/* No se muestra el nombre del archivo: expone la ruta interna. */}
                    {selectedModelo.raza && <p className="text-gray-500 text-xs mt-1">{tv('breed', selectedModelo.raza)}</p>}
                  </div>
                )}

                <button onClick={() => handleEditAnimal(selectedAnimal)} className="btn-neutral w-full">
                  {t('dash.editInfo')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h2 className="heading-primary text-3xl mb-2">{t('dash.myPets')}</h2>
                <p className="text-gray-400">{t('dash.myPetsSubtitle')}</p>
              </div>
              <div className="flex gap-3">
                {user?.role === 'ADMIN' && (
                  <button onClick={() => setShowUploadForm(true)} className="btn-secondary">{t('dash.uploadModel')}</button>
                )}
                <button onClick={() => setShowAnimalForm(true)} className="btn-primary">{t('dash.newPet')}</button>
              </div>
            </div>

            {user?.role === 'ADMIN' && (
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="input-label">{t('dash.searchPet')}</label>
                  <input
                    type="text"
                    value={animalSearch}
                    onChange={(e) => setAnimalSearch(e.target.value)}
                    placeholder={t('dash.searchPetPlaceholder')}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="input-label">{t('dash.filterUser')}</label>
                  <select
                    value={animalOwnerFilter}
                    onChange={(e) => setAnimalOwnerFilter(e.target.value)}
                    className="input-base"
                  >
                    <option value="all">{t('dash.allUsers')}</option>
                    {Array.from(new Map(animales.map((animal) => [animal.usuarioId, animal.usuario])).entries()).map(([usuarioId, usuario]) => (
                      <option key={usuarioId} value={usuarioId}>{usuario.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {user?.role === 'ADMIN' && modelos.length > 0 && (
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-gray-300 font-medium">
                    {modelos.length} {modelos.length === 1 ? t('dash.modelAvailable') : t('dash.modelsAvailable')}
                  </p>
                  <p className="text-gray-500 text-sm">{t('dash.modelsHint')}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">{t('dash.loadingPets')}</p>
              </div>
            ) : animales.length === 0 ? (
              <div className="card text-center py-16" style={{ borderStyle: 'dashed', borderColor: 'rgba(16,185,129,0.3)' }}>
                <span className="text-5xl">🐾</span>
                <p className="text-xl text-gray-300 font-semibold mt-4 mb-2">{t('dash.noPets')}</p>
                <p className="text-gray-500 mb-6">{t('dash.noPetsHint')}</p>
                <button onClick={() => setShowAnimalForm(true)} className="btn-primary">{t('dash.createFirst')}</button>
              </div>
            ) : animalesFiltrados.length === 0 ? (
              <div className="card text-center py-16" style={{ borderStyle: 'dashed', borderColor: 'rgba(16,185,129,0.3)' }}>
                <span className="text-5xl">📍</span>
                <p className="text-xl text-gray-300 font-semibold mt-4 mb-2">{t('dash.noMatches')}</p>
                <p className="text-gray-500">{t('dash.noMatchesHint')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animalesFiltrados.map((animal, index) => (
                  <div key={animal.id} className={`card-animal group animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">{animal.nombre}</h3>
                        {animal.raza && <p className="text-sm text-gray-400 italic">{tv('breed', animal.raza)}</p>}
                        <p className="text-xs text-emerald-400 mt-1">{t(`cat.${animal.categoria}` as TranslationKey)}</p>
                        {animal.zona && <p className="text-xs text-gray-500">{animal.zona}</p>}
                        {user?.role === 'ADMIN' && animal.usuario && <p className="text-xs text-gray-500 mt-1">{t('dash.owner')} {animal.usuario.name}</p>}
                      </div>
                      <span className="text-2xl opacity-60 group-hover:opacity-100 transition">🐾</span>
                    </div>

                    {rasgosValidos(animal.rasgos).length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {rasgosValidos(animal.rasgos).slice(0, 4).map((rasgo) => (
                          <span key={rasgo} className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                            {t(claveRasgo(rasgo))}
                          </span>
                        ))}
                      </div>
                    )}
                    {animal.descripcion && <p className="text-gray-400 mb-4 text-sm line-clamp-2">{descripcionDe(animal)}</p>}

                    {animal.caracteristicas && (
                      <div className="mb-4 space-y-1.5 text-xs text-gray-500">
                        {animal.caracteristicas.tamano && <p>📏 {t('dash.size')} {tv('size', animal.caracteristicas.tamano)}</p>}
                        {animal.caracteristicas.color && <p>🎨 {t('dash.color')} {tv('color', animal.caracteristicas.color)}</p>}
                        {animal.caracteristicas.habitat && <p>🏠 {t('dash.habitat')} {animal.caracteristicas.habitat}</p>}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={() => openAnimalDetails(animal)}
                        className="btn-primary w-full text-sm py-2.5"
                      >
                        {t('dash.viewSheet')}
                      </button>

                      {animal.modelo ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => handleEditModel(animal.modelo!, animal)} className="btn-secondary text-sm py-2.5">
                            {t('dash.edit3dShort')}
                          </button>
                          <button onClick={() => openModelSelector(animal)} className="btn-neutral text-sm py-2.5">
                            {t('dash.reassignShort')}
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => openModelSelector(animal)} className="btn-secondary w-full text-sm py-2.5">
                          {t('dash.assignModel')}
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleEditAnimal(animal)} className="btn-neutral text-sm py-2">{t('dash.edit')}</button>
                        <button onClick={() => handleDeleteAnimal(animal)} className="btn-danger text-sm py-2">{t('dash.delete')}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="heading-secondary text-2xl">{t('dash.models')}</h3>
                  <p className="text-gray-400 text-sm">{t('dash.modelsSubtitle')}</p>
                </div>
                {modelMessage && (
                  <div
                    role="status"
                    className="w-full rounded-lg px-4 py-3 text-sm text-gray-200"
                    style={{
                      background: modelMessageError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      border: modelMessageError
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {modelMessage}
                  </div>
                )}
                <div className="glass rounded-xl px-4 py-2 text-sm text-gray-300">
                  {modelosFiltrados.length}{' '}
                  {modelosFiltrados.length === 1 ? t('dash.model') : t('dash.modelsPlural')}
                </div>
              </div>

              {modelos.length > 0 && (
                <div
                  role="group"
                  aria-label={t('dash.filterSpecies')}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    {t('dash.filterSpecies')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModelCategoryFilter('all')}
                    aria-pressed={modelCategoryFilter === 'all'}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      modelCategoryFilter === 'all'
                        ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/25 hover:text-gray-200'
                    }`}
                  >
                    {t('dash.allSpecies')}
                    <span className="ml-1.5 text-xs opacity-70">{modelos.length}</span>
                  </button>
                  {modelosPorEspecie.map(({ categoria, total }) => (
                    <button
                      key={categoria}
                      type="button"
                      // Una especie sin modelos no se puede elegir: evita llegar a una lista vacía.
                      disabled={total === 0}
                      onClick={() => setModelCategoryFilter(categoria)}
                      aria-pressed={modelCategoryFilter === categoria}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        modelCategoryFilter === categoria
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/25 hover:text-gray-200'
                      }`}
                    >
                      {t(`cat.${categoria}` as TranslationKey)}
                      <span className="ml-1.5 text-xs opacity-70">{total}</span>
                    </button>
                  ))}
                </div>
              )}

              {modelos.length === 0 ? (
                <div className="card text-center py-12" style={{ borderStyle: 'dashed', borderColor: 'rgba(16,185,129,0.3)' }}>
                  <p className="text-gray-500">{t('dash.noModels')}</p>
                </div>
              ) : modelosFiltrados.length === 0 ? (
                <div className="card text-center py-12" style={{ borderStyle: 'dashed', borderColor: 'rgba(16,185,129,0.3)' }}>
                  <p className="text-gray-500">{t('dash.noModelsInSpecies')}</p>
                  <button onClick={() => setModelCategoryFilter('all')} className="btn-neutral mt-4">
                    {t('dash.showAllSpecies')}
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modelosFiltrados.map((modelo) => (
                    <div key={modelo.id} className="card space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{modelo.nombre}</h4>
                          <p className="text-sm text-gray-400">{t(`cat.${modelo.categoria}` as TranslationKey)}</p>
                          {modelo.raza && <p className="text-xs text-gray-500 mt-1">{tv('breed', modelo.raza)}</p>}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${modelo.isPublico ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-300'}`}>{modelo.isPublico ? t('dash.public') : t('dash.private')}</span>
                      </div>

                      <div className="rounded-xl overflow-hidden border border-white/10">
                        <Canvas3DViewer modelo={modelo} strokes={modelo.pinturas} height="220px" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{modelo.usuario?.name}</span>
                        {/* Se muestra la raza, nunca el nombre del archivo en disco. */}
                        {modelo.raza && <span>{tv('breed', modelo.raza)}</span>}
                      </div>

                      <div className={user?.role === 'ADMIN' ? 'grid grid-cols-[2fr_1fr] gap-2' : ''}>
                        <button onClick={() => handleEditModel(modelo)} className="btn-primary w-full">
                          {t('dash.editModel')}
                        </button>
                        {/* Borrar es exclusivo de ADMIN, igual que en el backend. */}
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => {
                              setModelMessage('');
                              setModeloAEliminar(modelo);
                            }}
                            className="btn-danger w-full"
                          >
                            {t('dash.delete')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        {showAnimalForm && (
          <AddAnimalForm
            onSuccess={handleAnimalSaved}
            onCancel={() => {
              setShowAnimalForm(false);
              setEditingAnimal(null);
            }}
            onRequestPoster={(animal) => {
              setPosterAnimal(animal);
              setPosterModelSnapshot(null);
            }}
            animal={editingAnimal}
            mode={editingAnimal ? 'edit' : 'create'}
          />
        )}

        {showUploadForm && (
          <UploadModelForm onSuccess={handleModelUploaded} onCancel={() => setShowUploadForm(false)} />
        )}

        {showModelSelector && selectorAnimal && (
          <ModelSelector
            animal={selectorAnimal}
            modelos={modelos}
            categoria={selectorAnimal.categoria}
            onAssigned={handleModelAssigned}
            onCancel={() => {
              setShowModelSelector(false);
              setSelectorAnimal(null);
            }}
          />
        )}

        {editingModelo && (
          <EditModelForm
            modelo={editingModelo}
            animal={modelEditorAnimal}
            currentUserId={user?.id}
            onSuccess={handleModelUpdated}
            onCancel={() => {
              setEditingModelo(null);
              setModelEditorAnimal(null);
            }}
          />
        )}

        {modeloAEliminar && (
          <ConfirmHoldDialog
            title={t('confirm.deleteModelTitle')}
            message={t('confirm.deleteModelMessage', { name: modeloAEliminar.nombre })}
            warning={
              contarMascotasConModelo(modeloAEliminar.id) > 0
                ? t('confirm.deleteModelWarningPets', {
                    n: contarMascotasConModelo(modeloAEliminar.id),
                  })
                : t('confirm.deleteModelWarningCopies')
            }
            confirmLabel={t('confirm.deleteModelAction')}
            loading={deletingModel}
            onConfirm={handleDeleteModel}
            onCancel={() => setModeloAEliminar(null)}
          />
        )}

        {posterAnimal && (
          <PetPosterEditor
            animal={posterAnimal}
            modelSnapshot={posterModelSnapshot}
            onExported={handlePosterExported}
            onClose={() => {
              setPosterAnimal(null);
              setPosterModelSnapshot(null);
            }}
          />
        )}
      </main>
    </div>
  );
}


