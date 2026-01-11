import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 선택된 대학 정보 (university/types.ts의 University와 동일)
export interface SelectedUniversity {
  id: string;
  name: string;
  department: string;
  group: 'ga' | 'na' | 'da';
  region: string;
  quota: number;
  ratio: {
    suneung: number;
    silgi: number;
  };
  requirements?: any; // 실기 종목 정보 등
}

interface UniversityStore {
  selectedUniversities: SelectedUniversity[];
  setSelectedUniversities: (universities: SelectedUniversity[]) => void;
  addUniversity: (university: SelectedUniversity) => void;
  removeUniversity: (id: string) => void;
  clearUniversities: () => void;
  hasSelections: () => boolean;
}

export const useUniversityStore = create<UniversityStore>()(
  persist(
    (set, get) => ({
      selectedUniversities: [],

      setSelectedUniversities: (universities) =>
        set({ selectedUniversities: universities }),

      addUniversity: (university) =>
        set((state) => ({
          selectedUniversities: [...state.selectedUniversities, university]
        })),

      removeUniversity: (id) =>
        set((state) => ({
          selectedUniversities: state.selectedUniversities.filter(u => u.id !== id)
        })),

      clearUniversities: () =>
        set({ selectedUniversities: [] }),

      hasSelections: () => {
        const { selectedUniversities } = get();
        return selectedUniversities.length > 0;
      },
    }),
    {
      name: 'university-storage',
    }
  )
);
