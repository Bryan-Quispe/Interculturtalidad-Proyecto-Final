import { create } from 'zustand';
import { Modelo3D, Transformaciones } from '@/types';

interface Modelo3DStore {
  selectedModelo: Modelo3D | null;
  transformaciones: Transformaciones | null;
  
  setSelectedModelo: (modelo: Modelo3D | null) => void;
  setTransformaciones: (trans: Transformaciones | null) => void;
  updateTransformacion: (key: string, value: number) => void;
}

export const useModelo3DStore = create<Modelo3DStore>((set) => ({
  selectedModelo: null,
  transformaciones: null,

  setSelectedModelo: (modelo) =>
    set({
      selectedModelo: modelo,
      transformaciones: modelo?.transformaciones || null,
    }),

  setTransformaciones: (trans) => set({ transformaciones: trans }),

  updateTransformacion: (key, value) =>
    set((state) => ({
      transformaciones: state.transformaciones
        ? { ...state.transformaciones, [key]: value }
        : null,
    })),
}));
