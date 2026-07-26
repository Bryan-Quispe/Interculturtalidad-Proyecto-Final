'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { Animal, Modelo3D, PaintStroke } from '@/types';
import Canvas3DViewer, { ViewerInteractionMode } from './Canvas3DViewer';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface EditModelFormProps {
  modelo: Modelo3D;
  onSuccess: (modelo: Modelo3D) => void;
  onCancel: () => void;
  /** Mascota desde la que se abrió el editor, si viene de su ficha. */
  animal?: Animal | null;
  currentUserId?: string;
}

type PaintTool = 'pencil' | 'brush' | 'brocha';

const colorPalette = [
  '#111827',
  '#f8fafc',
  '#8b5e3c',
  '#d6a15d',
  '#4b5563',
  '#dc2626',
  '#f59e0b',
  '#10b981',
  '#2563eb',
  '#7c3aed',
  '#f472b6',
  '#22d3ee',
];

const toolSizes: Record<PaintTool, number> = {
  pencil: 0.006,
  brush: 0.014,
  brocha: 0.03,
};

export default function EditModelForm({
  modelo,
  onSuccess,
  onCancel,
  animal,
  currentUserId,
}: EditModelFormProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interactionMode, setInteractionMode] = useState<ViewerInteractionMode>('rotate');
  const [paintTool, setPaintTool] = useState<PaintTool>('pencil');
  const [paintColor, setPaintColor] = useState('#f59e0b');
  const [paintCount, setPaintCount] = useState(0);
  const [displayStrokes, setDisplayStrokes] = useState<PaintStroke[]>([]);
  const strokesRef = useRef<PaintStroke[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    isPublico: false,
  });

  /**
   * El modelo base lo comparte toda la comunidad, así que pintarlo desde una
   * mascota NO lo modifica: se guarda una copia propia. Solo se edita en sitio
   * cuando ya es una versión personalizada del propio usuario, o cuando el
   * dueño lo abre desde el catálogo de modelos.
   */
  const desdeMascota = Boolean(animal);
  const esPropio = Boolean(currentUserId) && modelo.usuarioId === currentUserId;
  const esCopiaPropia = Boolean(modelo.derivadoDeId) && esPropio;
  const modoGuardado: 'update' | 'derive' =
    esCopiaPropia || (!desdeMascota && esPropio) ? 'update' : 'derive';

  useEffect(() => {
    strokesRef.current = Array.isArray(modelo.pinturas)
      ? modelo.pinturas.filter((stroke) => Boolean(stroke.position && stroke.surfaceId))
      : [];
    setDisplayStrokes(strokesRef.current);
    setPaintCount(strokesRef.current.length);
    setFormData({
      nombre:
        modoGuardado === 'derive' && animal
          ? `${modelo.nombre} - ${animal.nombre}`
          : modelo.nombre ?? '',
      descripcion: modelo.descripcion ?? '',
      // Una copia nueva nace privada: compartirla es una decisión explícita.
      isPublico: modoGuardado === 'derive' ? false : modelo.isPublico ?? false,
    });
    setInteractionMode('rotate');
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelo, animal]);

  const handlePaint = useCallback((stroke: PaintStroke) => {
    strokesRef.current = [...strokesRef.current, stroke];
    setPaintCount(strokesRef.current.length);
  }, []);

  const handleUndo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setDisplayStrokes(strokesRef.current);
    setPaintCount(strokesRef.current.length);
    setInteractionMode('paint');
  };

  const handleClear = () => {
    if (strokesRef.current.length === 0) return;
    const shouldClear = window.confirm(t('ed.confirmClear'));
    if (!shouldClear) return;
    strokesRef.current = [];
    setDisplayStrokes([]);
    setPaintCount(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError(t('ed.needName'));
      return;
    }

    setLoading(true);
    try {
      const guardado = modoGuardado === 'derive'
        ? await api.derivarModelo(modelo.id, {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            isPublico: formData.isPublico,
            pinturas: strokesRef.current,
          })
        : await api.updateModeloTransformaciones(modelo.id, {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            isPublico: formData.isPublico,
            pinturas: strokesRef.current,
          });
      onSuccess(guardado);
    } catch (err: any) {
      setError(err.response?.data?.message || t('ed.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '80rem' }}>
        <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h2 className="heading-secondary">
              {modoGuardado === 'derive' ? t('ed.customizeTitle') : t('ed.editTitle')}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {modoGuardado === 'derive'
                ? t('ed.customizeHint', { name: modelo.nombre })
                : t('ed.editHint')}
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-300 text-2xl transition">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="rounded-xl overflow-hidden border border-white/10 min-h-[460px]">
            <Canvas3DViewer
              modelo={modelo}
              height="460px"
              autoRotate={false}
              interactionMode={interactionMode}
              brushColor={paintColor}
              brushSize={toolSizes[paintTool]}
              strokes={displayStrokes}
              onPaint={handlePaint}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">{t('pet.name')}</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(event) => setFormData((prev) => ({ ...prev, nombre: event.target.value }))}
                className="input-base"
                required
              />
            </div>

            <div>
              <label className="input-label">{t('pet.description')}</label>
              <textarea
                value={formData.descripcion}
                onChange={(event) => setFormData((prev) => ({ ...prev, descripcion: event.target.value }))}
                className="input-base resize-none h-24"
                rows={4}
              />
            </div>

            <div>
              <label className="input-label">{t('ed.interactionMode')}</label>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950/40 p-1">
                {[
                  { id: 'rotate', label: t('ed.modeView'), detail: t('ed.modeViewHint') },
                  { id: 'paint', label: t('ed.modePaint'), detail: t('ed.modePaintHint') },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setInteractionMode(mode.id as ViewerInteractionMode)}
                    className={`min-h-[64px] rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                      interactionMode === mode.id
                        ? 'border-emerald-300 bg-emerald-500/15 text-emerald-200'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <span className="block">{mode.label}</span>
                    <span className="mt-1 block text-[11px] font-normal text-gray-400">{mode.detail}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">{t('ed.zoomHint')}</p>
            </div>

            <div className={interactionMode === 'paint' ? '' : 'opacity-50'}>
              <label className="input-label">{t('model.brushSize')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pencil', label: t('ed.toolPencil'), detail: t('ed.toolPencilHint') },
                  { id: 'brush', label: t('ed.toolBrush'), detail: t('ed.toolBrushHint') },
                  { id: 'brocha', label: t('ed.toolBroad'), detail: t('ed.toolBroadHint') },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    disabled={interactionMode !== 'paint'}
                    onClick={() => setPaintTool(tool.id as PaintTool)}
                    className={`rounded-xl border px-2 py-3 text-sm font-semibold transition disabled:cursor-not-allowed ${
                      paintTool === tool.id
                        ? 'border-cyan-300 bg-cyan-500/10 text-cyan-100'
                        : 'border-white/10 bg-white/5 text-gray-300'
                    }`}
                  >
                    <span className="block">{tool.label}</span>
                    <span className="mt-1 block text-[11px] font-normal text-gray-400">{tool.detail}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label">{t('ed.paintColor')}</label>
              <div className="grid grid-cols-6 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setPaintColor(color);
                      setInteractionMode('paint');
                    }}
                    className={`h-10 rounded-xl border transition ${
                      paintColor.toLowerCase() === color.toLowerCase()
                        ? 'border-emerald-300 ring-2 ring-emerald-400/40'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`${t('ed.colorAria')} ${color}`}
                  />
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="color"
                  value={paintColor}
                  onChange={(event) => {
                    setPaintColor(event.target.value);
                    setInteractionMode('paint');
                  }}
                  className="h-12 w-14 rounded-xl border border-white/10 bg-transparent"
                />
                <input
                  type="text"
                  value={paintColor}
                  onChange={(event) => setPaintColor(event.target.value)}
                  className="input-base flex-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={handleUndo} disabled={paintCount === 0} className="flex-1 btn-neutral py-3 disabled:opacity-40">
                {t('ed.undo')} ({paintCount})
              </button>
              <button type="button" onClick={handleClear} disabled={paintCount === 0} className="flex-1 btn-neutral py-3 disabled:opacity-40">
                {t('ed.clearPaint')}
              </button>
            </div>

            <div>
              <label className="input-label">
                {modoGuardado === 'derive' ? t('ed.whereSave') : t('ed.visibility')}
              </label>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isPublico: false }))}
                  className={`rounded-xl border p-3 text-left transition ${
                    !formData.isPublico
                      ? 'border-emerald-300 bg-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <span className={`block text-sm font-semibold ${!formData.isPublico ? 'text-emerald-200' : 'text-gray-300'}`}>
                    {t('ed.onlyMe')}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {desdeMascota ? t('ed.onlyMeFromPet') : t('ed.onlyMeHint')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isPublico: true }))}
                  className={`rounded-xl border p-3 text-left transition ${
                    formData.isPublico
                      ? 'border-cyan-300 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <span className={`block text-sm font-semibold ${formData.isPublico ? 'text-cyan-100' : 'text-gray-300'}`}>
                    {t('ed.shareCommunity')}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500">{t('ed.shareCommunityHint')}</span>
                </button>
              </div>
            </div>

            {modoGuardado === 'derive' && (
              <p className="rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-amber-100/80">
                {t('ed.deriveNoticeA')} <b>&quot;{modelo.nombre}&quot; {t('ed.deriveNoticeB')}</b>,{' '}
                {t('ed.deriveNoticeC')}
              </p>
            )}

            <div className="flex gap-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t('form.saving')
                  : modoGuardado === 'derive'
                    ? t('ed.saveMine')
                    : t('ed.saveChanges')}
              </button>
              <button type="button" onClick={onCancel} className="flex-1 btn-neutral py-3">
                {t('form.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
