import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { University } from '@/app/university/types';

// 성별 타입
export type Gender = 'male' | 'female';

// 실기 종목 기록
export interface EventRecord {
  eventKey: string;
  eventName: string;
  unit: string;
  value: string; // 사용자 입력값 (문자열로 관리, 소수점 허용)
  score?: number; // 환산 점수 (나중에 계산)
}

// 대학별 실기 기록
export interface UniversityRecords {
  universityId: string;
  universityName: string;
  department: string;
  group: 'ga' | 'na' | 'da';
  events: EventRecord[];
}

// 실기 스토어 상태
export interface SilgiData {
  gender: Gender | null;
  universities: UniversityRecords[];
}

interface SilgiStore {
  data: SilgiData;

  // 성별 설정
  setGender: (gender: Gender) => void;

  // 선택된 대학 목록 초기화
  initializeUniversities: (universities: University[]) => void;

  // 특정 대학의 종목 기록 업데이트
  updateEventRecord: (universityId: string, eventKey: string, value: string) => void;

  // 모든 종목이 입력되었는지 확인
  isValid: () => boolean;

  // 초기화
  reset: () => void;
}

const initialData: SilgiData = {
  gender: null,
  universities: [],
};

export const useSilgiStore = create<SilgiStore>()(
  persist(
    (set, get) => ({
      data: initialData,

      setGender: (gender) =>
        set((state) => ({
          data: { ...state.data, gender },
        })),

      initializeUniversities: (universities) => {
        const universityRecords: UniversityRecords[] = universities.map((univ) => {
          // 대학별 실기 종목 추출
          const events: EventRecord[] = Object.entries(univ.requirements.silgi).map(
            ([eventKey, eventData]) => ({
              eventKey,
              eventName: eventData.name,
              unit: eventData.unit,
              value: '',
            })
          );

          return {
            universityId: univ.id,
            universityName: univ.name,
            department: univ.department,
            group: univ.group,
            events,
          };
        });

        set((state) => ({
          data: { ...state.data, universities: universityRecords },
        }));
      },

      updateEventRecord: (universityId, eventKey, value) =>
        set((state) => {
          // 해당 대학의 해당 종목만 업데이트 (대학별로 독립적)
          const updatedUniversities = state.data.universities.map((univ) => {
            if (univ.universityId !== universityId) {
              return univ;
            }
            return {
              ...univ,
              events: univ.events.map((event) => {
                if (event.eventKey === eventKey) {
                  return { ...event, value };
                }
                return event;
              }),
            };
          });

          return {
            data: { ...state.data, universities: updatedUniversities },
          };
        }),

      isValid: () => {
        const { data } = get();

        // 성별 선택 확인
        if (!data.gender) {
          return false;
        }

        // 모든 대학의 모든 종목이 입력되었는지 확인
        return data.universities.every((univ) =>
          univ.events.every((event) => event.value.trim() !== '')
        );
      },

      reset: () => set({ data: initialData }),
    }),
    {
      name: 'silgi-storage',
    }
  )
);
