import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 수능 과목 타입 정의
export type ExamType = '6월' | '9월' | '수능';

export type SubjectScore = {
  standardScore: string; // 표준점수
  percentile: string;    // 백분위
  grade: string;         // 등급
};

export type KoreanSubject = '화법과작문' | '언어와매체';

export type MathSubject = '확통' | '미적' | '기하';

export type TamguSubject =
  | '생활과 윤리' | '윤리와 사상'
  | '한국지리' | '세계지리' | '동아시아사' | '세계사'
  | '정치와 법' | '경제' | '사회문화'
  | '물리학I' | '화학I' | '생명과학I' | '지구과학I'
  | '물리학II' | '화학II' | '생명과학II' | '지구과학II';

export type TamguScore = {
  subject: TamguSubject | '';
  standardScore: string;
  percentile: string;
  grade: string;
};

export interface SuneungData {
  examType: ExamType;

  // 국어
  korean: SubjectScore & {
    subject: KoreanSubject;
  };

  // 수학
  math: SubjectScore & {
    subject: MathSubject;
  };

  // 영어 (등급만)
  english: {
    grade: string;
  };

  // 탐구
  tamgu1: TamguScore;
  tamgu2: TamguScore;

  // 한국사 (등급만)
  history: {
    grade: string;
  };
}

interface SuneungStore {
  data: SuneungData;
  updateExamType: (type: ExamType) => void;
  updateKorean: (score: Partial<SubjectScore & { subject: KoreanSubject }>) => void;
  updateMath: (score: Partial<SubjectScore & { subject: MathSubject }>) => void;
  updateEnglish: (grade: string) => void;
  updateTamgu1: (score: Partial<TamguScore>) => void;
  updateTamgu2: (score: Partial<TamguScore>) => void;
  updateHistory: (grade: string) => void;
  reset: () => void;
  isValid: () => boolean;
}

const initialData: SuneungData = {
  examType: '수능',
  korean: { standardScore: '', percentile: '', grade: '', subject: '화법과작문' },
  math: { standardScore: '', percentile: '', grade: '', subject: '확통' },
  english: { grade: '' },
  tamgu1: { subject: '', standardScore: '', percentile: '', grade: '' },
  tamgu2: { subject: '', standardScore: '', percentile: '', grade: '' },
  history: { grade: '' },
};

export const useSuneungStore = create<SuneungStore>()(
  persist(
    (set, get) => ({
      data: initialData,

      updateExamType: (type) =>
        set((state) => ({
          data: { ...state.data, examType: type }
        })),

      updateKorean: (score) =>
        set((state) => ({
          data: {
            ...state.data,
            korean: { ...state.data.korean, ...score }
          }
        })),

      updateMath: (score) =>
        set((state) => ({
          data: {
            ...state.data,
            math: { ...state.data.math, ...score }
          }
        })),

      updateEnglish: (grade) =>
        set((state) => ({
          data: {
            ...state.data,
            english: { grade }
          }
        })),

      updateTamgu1: (score) =>
        set((state) => ({
          data: {
            ...state.data,
            tamgu1: { ...state.data.tamgu1, ...score }
          }
        })),

      updateTamgu2: (score) =>
        set((state) => ({
          data: {
            ...state.data,
            tamgu2: { ...state.data.tamgu2, ...score }
          }
        })),

      updateHistory: (grade) =>
        set((state) => ({
          data: {
            ...state.data,
            history: { grade }
          }
        })),

      reset: () => set({ data: initialData }),

      // 유효성 검사
      isValid: () => {
        const { data } = get();

        // 필수 입력값 검사
        const hasKorean = data.korean.standardScore && data.korean.percentile && data.korean.grade;
        const hasMath = data.math.standardScore && data.math.percentile && data.math.grade;
        const hasEnglish = data.english.grade;
        const hasTamgu1 = data.tamgu1.subject && data.tamgu1.standardScore && data.tamgu1.percentile && data.tamgu1.grade;
        const hasTamgu2 = data.tamgu2.subject && data.tamgu2.standardScore && data.tamgu2.percentile && data.tamgu2.grade;
        const hasHistory = data.history.grade;

        return !!(hasKorean && hasMath && hasEnglish && hasTamgu1 && hasTamgu2 && hasHistory);
      },
    }),
    {
      name: 'suneung-storage',
    }
  )
);
