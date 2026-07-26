'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface ConfirmHoldDialogProps {
  title: string;
  message: string;
  /** Aviso secundario, por ejemplo cuántas fichas quedarán sin modelo. */
  warning?: string;
  confirmLabel: string;
  /** Milisegundos que hay que mantener pulsado el botón. */
  holdMs?: number;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmación para acciones irreversibles.
 *
 * En lugar de un "¿Seguro?" que se acepta por reflejo, el botón destructivo
 * hay que **mantenerlo pulsado** hasta que la barra se llena. Dos segundos de
 * intención deliberada evitan el borrado accidental, y soltar antes cancela
 * sin consecuencias.
 */
export default function ConfirmHoldDialog({
  title,
  message,
  warning,
  confirmLabel,
  holdMs = 2000,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmHoldDialogProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  /** Evita que el rAF dispare la confirmación más de una vez. */
  const firedRef = useRef(false);

  const stopHold = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    startRef.current = null;
    setHolding(false);
    if (!firedRef.current) setProgress(0);
  }, []);

  const startHold = useCallback(() => {
    if (loading || firedRef.current || frameRef.current !== null) return;
    setHolding(true);

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const ratio = Math.min((timestamp - startRef.current) / holdMs, 1);
      setProgress(ratio);

      if (ratio < 1) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      firedRef.current = true;
      frameRef.current = null;
      setHolding(false);
      onConfirm();
    };

    frameRef.current = requestAnimationFrame(step);
  }, [holdMs, loading, onConfirm]);

  // Cancelar con Escape y soltar el botón aunque el puntero salga de la ventana.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerup', stopHold);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerup', stopHold);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [loading, onCancel, stopHold]);

  const percent = Math.round(progress * 100);

  return (
    <div className="modal-overlay z-[60]" role="presentation">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-hold-title"
        aria-describedby="confirm-hold-message"
        className="modal-content"
        style={{ maxWidth: '30rem' }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-2xl">
            🗑️
          </div>
          <h2 id="confirm-hold-title" className="heading-secondary">
            {title}
          </h2>
          <p id="confirm-hold-message" className="mt-2 text-sm text-gray-400">
            {message}
          </p>
          {warning && (
            <p className="mt-3 rounded-lg border border-amber-400/25 bg-amber-500/10 px-4 py-2.5 text-xs leading-relaxed text-amber-100/90">
              {warning}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={loading}
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            // Teclado: mantener Espacio o Enter equivale a mantener pulsado.
            onKeyDown={(event) => {
              if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
                event.preventDefault();
                startHold();
              }
            }}
            onKeyUp={(event) => {
              if (event.key === ' ' || event.key === 'Enter') stopHold();
            }}
            onContextMenu={(event) => event.preventDefault()}
            aria-describedby="confirm-hold-hint"
            className="relative w-full select-none overflow-hidden rounded-xl border border-red-500/40 bg-red-500/10 py-3.5 font-semibold text-red-200 transition hover:border-red-400/70 disabled:cursor-wait disabled:opacity-60"
            style={{ touchAction: 'none' }}
          >
            {/* Relleno que avanza; es el progreso real de la pulsación. */}
            <span
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={confirmLabel}
              className="absolute inset-y-0 left-0 bg-red-500/45"
              style={{ width: `${percent}%`, transition: holding ? 'none' : 'width 150ms ease-out' }}
            />
            <span className="relative">
              {loading
                ? t('confirm.deleting')
                : holding
                  ? t('confirm.keepHolding')
                  : confirmLabel}
            </span>
          </button>

          <p id="confirm-hold-hint" className="text-center text-xs text-gray-500">
            {t('confirm.holdHint')}
          </p>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-neutral w-full py-3 disabled:opacity-50"
            autoFocus
          >
            {t('form.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
