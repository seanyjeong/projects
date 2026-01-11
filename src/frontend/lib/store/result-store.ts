import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 대학별 계산 결과
export interface UniversityResult {
  universityId: string;
  universityName: string;
  departmentName: string;
  group: 'ga' | 'na' | 'da';

  // 총점
  totalScore: number;
  maxScore: number;

  // 점수 breakdown
  breakdown: {
    suneung: {
      score: number;
      max: number;
      ratio: number;
    };
    silgi: {
      score: number;
      max: number;
      ratio: number;
    };
  };

  // 상세 점수
  details?: {
    suneung?: {
      korean?: number;
      math?: number;
      english?: number;
      inquiry?: number;
    };
    silgi?: Array<{
      eventName: string;
      record: number;
      score: number;
    }>;
  };

  // 순위
  rank?: number;
}

// 계산 입력 데이터
export interface CalculationInput {
  // 수능 점수
  suneungScores: any; // SuneungData 타입

  // 실기 기록
  silgiRecords: any; // SilgiData 타입

  // 선택된 대학들
  universities: any[]; // University[] 타입

  // 성별
  gender: 'male' | 'female';
}

interface ResultStore {
  // 계산 결과
  results: UniversityResult[];

  // 계산 입력 데이터 (다시 계산용)
  calculationInput: CalculationInput | null;

  // 결과 저장
  setResults: (results: UniversityResult[], input: CalculationInput) => void;

  // 결과 초기화
  clearResults: () => void;

  // 결과 존재 여부
  hasResults: () => boolean;
}

export const useResultStore = create<ResultStore>()(
  persist(
    (set, get) => ({
      results: [],
      calculationInput: null,

      setResults: (results, input) =>
        set({
          results: results.sort((a, b) => b.totalScore - a.totalScore).map((r, idx) => ({
            ...r,
            rank: idx + 1,
          })),
          calculationInput: input,
        }),

      clearResults: () =>
        set({
          results: [],
          calculationInput: null,
        }),

      hasResults: () => {
        const { results } = get();
        return results.length > 0;
      },
    }),
    {
      name: 'result-storage',
    }
  )
);
