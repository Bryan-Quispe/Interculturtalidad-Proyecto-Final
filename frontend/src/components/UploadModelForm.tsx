'use client';

import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { Modelo3D } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';

interface UploadModelFormProps {
  onSuccess: (modelo: Modelo3D) => void;
  onCancel: () => void;
}

const categoryOptions = ['PERRO', 'GATO', 'CONEJO'] as const;

export default function UploadModelForm({ onSuccess, onCancel }: UploadModelFormProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'PERRO',
    raza: '',
    descripcion: '',
    color: '#3498db',
    isPublico: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError(t('up.needFile'));
      return;
    }
    if (formData.isPublico) {
      const confirmed = window.confirm(t('up.confirmPublic'));
      if (!confirmed) return;
    }

    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('file', selectedFile);
      data.append('nombre', formData.nombre);
      data.append('categoria', formData.categoria);
      data.append('raza', formData.raza);
      data.append('descripcion', formData.descripcion);
      data.append('color', formData.color);
      if (formData.isPublico) {
        data.append('isPublico', 'true');
      }

      const modelo = await api.uploadModelo(data);
      onSuccess(modelo);
    } catch (err: any) {
      setError(err.response?.data?.message || t('up.error'));
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h2 className="heading-secondary">{t('up.title')}</h2>
            <p className="text-gray-400 text-sm mt-1">{t('up.adminOnly')}</p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-300 text-2xl transition">
            x
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-emerald-400 bg-emerald-500/10'
                : selectedFile
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-gray-600 hover:border-emerald-500/40 bg-slate-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,.obj"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile ? (
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 font-bold">
                  3D
                </span>
                <p className="text-emerald-400 font-semibold mt-3">{selectedFile.name}</p>
                <p className="text-gray-500 text-sm mt-1">{formatFileSize(selectedFile.size)}</p>
                <p className="text-gray-600 text-xs mt-2">{t('up.changeFile')}</p>
              </div>
            ) : (
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-emerald-300 text-2xl font-bold">
                  +
                </span>
                <p className="text-gray-300 font-semibold mt-3">{t('up.dropHere')}</p>
                <p className="text-gray-500 text-sm mt-1">{t('up.orClick')}</p>
                <p className="text-gray-600 text-xs mt-2">{t('up.formats')}</p>
              </div>
            )}
          </div>

          <div>
            <label className="input-label">{t('up.modelName')}</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder={t('up.modelNamePlaceholder')}
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="input-label">{t('up.categoryRequired')}</label>
            <div className="grid grid-cols-3 gap-3">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, categoria: option }))}
                  className={`h-12 rounded-xl border text-sm font-semibold transition ${
                    formData.categoria === option
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200 shadow-lg shadow-emerald-500/10'
                      : 'border-white/10 bg-slate-800/60 text-gray-300 hover:border-emerald-400/40 hover:bg-emerald-500/5'
                  }`}
                >
                  {t(`cat.${option}` as TranslationKey)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">{t('up.categoryHint')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">{t('up.breed')}</label>
              <input
                type="text"
                name="raza"
                value={formData.raza}
                onChange={handleChange}
                placeholder={t('up.breedPlaceholder')}
                className="input-base"
              />
            </div>
            <div>
              <label className="input-label">{t('up.refColor')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                  className="input-base flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="input-label">{t('pet.description')}</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder={t('up.descriptionPlaceholder')}
              className="input-base resize-none h-20"
              rows={3}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl p-4 cursor-pointer" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <input
              type="checkbox"
              checked={formData.isPublico}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublico: e.target.checked }))}
              className="mt-1 h-4 w-4 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500"
            />
            <span>
              <span className="block font-semibold text-emerald-300">{t('up.publishTitle')}</span>
              <span className="block text-xs text-gray-400 mt-1">{t('up.publishHint')}</span>
            </span>
          </label>

          <div className="flex gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="submit"
              disabled={loading || !formData.nombre || !selectedFile}
              className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('model.uploading') : t('up.submit')}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 btn-neutral py-3">
              {t('form.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
