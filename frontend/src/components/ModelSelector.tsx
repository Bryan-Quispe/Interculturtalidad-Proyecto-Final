'use client';

import { useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Modelo3D, Animal } from '@/types';
import Canvas3DViewer from './Canvas3DViewer';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';

interface ModelSelectorProps {
  animal: Animal;
  modelos: Modelo3D[];
  categoria?: string;
  onAssigned: (updatedAnimal: Animal) => void;
  onCancel: () => void;
}

export default function ModelSelector({ animal, modelos, categoria, onAssigned, onCancel }: ModelSelectorProps) {
  // Si ya tiene modelo llega preseleccionado: el mismo modal sirve para
  // asignar por primera vez y para reasignar a otro.
  const yaTieneModelo = Boolean(animal.modeloId);
  const [selectedModeloId, setSelectedModeloId] = useState<string>(animal.modeloId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, tv } = useLanguage();

  const modelosFiltrados = useMemo(() => {
    if (!categoria) return modelos;
    const key = categoria.toLowerCase();
    return modelos.filter((modelo) => modelo.categoria?.toLowerCase() === key);
  }, [categoria, modelos]);

  const modeloSeleccionado = modelosFiltrados.find((m) => m.id === selectedModeloId);

  const handleAssign = async () => {
    if (!selectedModeloId) {
      setError(t('model.selectModel'));
      return;
    }
    setError('');
    setLoading(true);

    try {
      const updated = await api.assignModelToAnimal(animal.id, selectedModeloId);
      onAssigned(updated);
    } catch (err: any) {
      setError(err.response?.data?.message || t('sel.assignError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '56rem' }}>
        <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h2 className="heading-secondary">{yaTieneModelo ? t('sel.reassignTitle') : t('sel.assignTitle')}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {t('sel.for')} <span className="text-emerald-400 font-medium">{animal.nombre}</span>
            </p>
            {categoria && (
              <p className="text-gray-500 text-xs mt-1">
                {t('sel.categoryLabel')} {t(`cat.${categoria.toUpperCase()}` as TranslationKey)}
              </p>
            )}
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-300 text-2xl transition">
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {modelosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">📭</span>
            <p className="text-gray-400 mt-3">{t('sel.emptyTitle')}</p>
            <p className="text-gray-500 text-sm mt-1">{t('sel.emptyHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {modelosFiltrados.map((modelo) => (
                <div
                  key={modelo.id}
                  onClick={() => setSelectedModeloId(modelo.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedModeloId === modelo.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: modelo.color + '20', color: modelo.color }}
                    >
                      🦮
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{modelo.nombre}</p>
                      {modelo.raza && <p className="text-gray-400 text-sm">{tv('breed', modelo.raza)}</p>}
                    </div>
                    {selectedModeloId === modelo.id && (
                      <span className="text-emerald-400 text-lg">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-dark-800/50 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 min-h-[256px]">
              {modeloSeleccionado ? (
                <Canvas3DViewer
                  modelo={modeloSeleccionado}
                  strokes={modeloSeleccionado.pinturas}
                  height="256px"
                />
              ) : (
                <div className="text-center p-6">
                  <span className="text-4xl opacity-50">👀</span>
                  <p className="text-gray-400 mt-2 text-sm">{t('sel.previewHint')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6 mt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleAssign}
            disabled={loading || !selectedModeloId || modelosFiltrados.length === 0 || selectedModeloId === animal.modeloId}
            className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('form.saving') : yaTieneModelo ? t('sel.reassignAction') : t('sel.assignAction')}
          </button>
          <button onClick={onCancel} className="flex-1 btn-neutral py-3">
            {t('form.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
