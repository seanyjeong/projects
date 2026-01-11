/**
 * Mock 데이터
 * 백엔드 API 연동 전까지 사용할 임시 데이터
 */

import { University } from './types';

export const MOCK_UNIVERSITIES: University[] = [
  // 가군
  {
    id: 'snu-pe',
    name: '서울대학교',
    department: '체육교육과',
    group: 'ga',
    region: 'seoul',
    quota: 30,
    requirements: {
      suneung: {
        korean: 40,
        math: 30,
        english: 15,
        inquiry: 10,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 10.5, max: 13.0 },
          female: { min: 12.0, max: 15.0 },
        },
        jump: {
          name: '제자리멀리뛰기',
          unit: 'cm',
          male: { min: 250, max: 300 },
          female: { min: 200, max: 250 },
        },
        medicine: {
          name: '메디신볼',
          unit: 'm',
          male: { min: 10.0, max: 15.0 },
          female: { min: 8.0, max: 12.0 },
        },
        strength: {
          name: '배근력',
          unit: 'kg',
          male: { min: 150, max: 250 },
          female: { min: 100, max: 180 },
        },
      },
    },
    ratio: {
      suneung: 40,
      silgi: 60,
    },
  },
  {
    id: 'korea-pe',
    name: '고려대학교',
    department: '체육교육과',
    group: 'ga',
    region: 'seoul',
    quota: 25,
    requirements: {
      suneung: {
        korean: 35,
        math: 35,
        english: 15,
        inquiry: 10,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 10.5, max: 13.0 },
          female: { min: 12.0, max: 15.0 },
        },
        jump: {
          name: '제자리멀리뛰기',
          unit: 'cm',
          male: { min: 250, max: 300 },
          female: { min: 200, max: 250 },
        },
        medicine: {
          name: '메디신볼',
          unit: 'm',
          male: { min: 10.5, max: 14.5 },
          female: { min: 8.5, max: 11.5 },
        },
      },
    },
    ratio: {
      suneung: 50,
      silgi: 50,
    },
  },
  {
    id: 'ewha-pe',
    name: '이화여자대학교',
    department: '체육과학부',
    group: 'ga',
    region: 'seoul',
    quota: 20,
    requirements: {
      suneung: {
        korean: 40,
        math: 25,
        english: 20,
        inquiry: 10,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 11.0, max: 13.5 },
          female: { min: 12.5, max: 15.5 },
        },
        jump: {
          name: '제자리멀리뛰기',
          unit: 'cm',
          male: { min: 240, max: 290 },
          female: { min: 190, max: 240 },
        },
      },
    },
    ratio: {
      suneung: 55,
      silgi: 45,
    },
  },

  // 나군
  {
    id: 'yonsei-sports',
    name: '연세대학교',
    department: '스포츠응용산업학과',
    group: 'na',
    region: 'seoul',
    quota: 20,
    requirements: {
      suneung: {
        korean: 40,
        math: 30,
        english: 15,
        inquiry: 10,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 10.8, max: 13.5 },
          female: { min: 12.5, max: 15.5 },
        },
        medicine: {
          name: '메디신볼',
          unit: 'm',
          male: { min: 10.0, max: 15.0 },
          female: { min: 8.0, max: 12.0 },
        },
        strength: {
          name: '배근력',
          unit: 'kg',
          male: { min: 160, max: 240 },
          female: { min: 110, max: 170 },
        },
      },
    },
    ratio: {
      suneung: 45,
      silgi: 55,
    },
  },
  {
    id: 'konkuk-sports',
    name: '건국대학교',
    department: '스포츠과학과',
    group: 'na',
    region: 'seoul',
    quota: 28,
    requirements: {
      suneung: {
        korean: 30,
        math: 30,
        english: 20,
        inquiry: 15,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 11.0, max: 13.8 },
          female: { min: 13.0, max: 16.0 },
        },
        jump: {
          name: '제자리멀리뛰기',
          unit: 'cm',
          male: { min: 240, max: 290 },
          female: { min: 190, max: 240 },
        },
      },
    },
    ratio: {
      suneung: 50,
      silgi: 50,
    },
  },
  {
    id: 'sungkyunkwan-sports',
    name: '성균관대학교',
    department: '스포츠과학과',
    group: 'na',
    region: 'seoul',
    quota: 22,
    requirements: {
      suneung: {
        korean: 35,
        math: 35,
        english: 15,
        inquiry: 10,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 10.8, max: 13.2 },
          female: { min: 12.5, max: 15.0 },
        },
        medicine: {
          name: '메디신볼',
          unit: 'm',
          male: { min: 11.0, max: 14.0 },
          female: { min: 9.0, max: 11.0 },
        },
      },
    },
    ratio: {
      suneung: 45,
      silgi: 55,
    },
  },

  // 다군
  {
    id: 'hanyang-sports',
    name: '한양대학교',
    department: '스포츠산업학과',
    group: 'da',
    region: 'seoul',
    quota: 35,
    requirements: {
      suneung: {
        korean: 35,
        math: 35,
        english: 15,
        inquiry: 10,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 11.0, max: 13.5 },
          female: { min: 12.5, max: 15.5 },
        },
        strength: {
          name: '배근력',
          unit: 'kg',
          male: { min: 150, max: 250 },
          female: { min: 100, max: 180 },
        },
        jump: {
          name: '제자리멀리뛰기',
          unit: 'cm',
          male: { min: 245, max: 295 },
          female: { min: 195, max: 245 },
        },
      },
    },
    ratio: {
      suneung: 40,
      silgi: 60,
    },
  },
  {
    id: 'chungang-sports',
    name: '중앙대학교',
    department: '스포츠과학부',
    group: 'da',
    region: 'seoul',
    quota: 30,
    requirements: {
      suneung: {
        korean: 35,
        math: 30,
        english: 20,
        inquiry: 10,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 11.0, max: 13.8 },
          female: { min: 13.0, max: 16.0 },
        },
        medicine: {
          name: '메디신볼',
          unit: 'm',
          male: { min: 10.0, max: 14.0 },
          female: { min: 8.0, max: 11.0 },
        },
      },
    },
    ratio: {
      suneung: 50,
      silgi: 50,
    },
  },
  {
    id: 'kyunghee-sports',
    name: '경희대학교',
    department: '체육학과',
    group: 'da',
    region: 'seoul',
    quota: 26,
    requirements: {
      suneung: {
        korean: 30,
        math: 30,
        english: 20,
        inquiry: 15,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 11.2, max: 14.0 },
          female: { min: 13.0, max: 16.0 },
        },
        jump: {
          name: '제자리멀리뛰기',
          unit: 'cm',
          male: { min: 240, max: 290 },
          female: { min: 190, max: 240 },
        },
        strength: {
          name: '배근력',
          unit: 'kg',
          male: { min: 145, max: 240 },
          female: { min: 95, max: 175 },
        },
      },
    },
    ratio: {
      suneung: 45,
      silgi: 55,
    },
  },

  // 경기 지역
  {
    id: 'ajou-sports',
    name: '아주대학교',
    department: '스포츠레저학과',
    group: 'ga',
    region: 'gyeonggi',
    quota: 24,
    requirements: {
      suneung: {
        korean: 30,
        math: 30,
        english: 20,
        inquiry: 15,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 11.5, max: 14.0 },
          female: { min: 13.5, max: 16.5 },
        },
        jump: {
          name: '제자리멀리뛰기',
          unit: 'cm',
          male: { min: 235, max: 285 },
          female: { min: 185, max: 235 },
        },
      },
    },
    ratio: {
      suneung: 50,
      silgi: 50,
    },
  },
  {
    id: 'inha-sports',
    name: '인하대학교',
    department: '체육교육과',
    group: 'na',
    region: 'gyeonggi',
    quota: 22,
    requirements: {
      suneung: {
        korean: 30,
        math: 30,
        english: 20,
        inquiry: 15,
        koreanHistory: 5,
      },
      silgi: {
        run100: {
          name: '100m',
          unit: '초',
          male: { min: 11.3, max: 13.8 },
          female: { min: 13.0, max: 16.0 },
        },
        medicine: {
          name: '메디신볼',
          unit: 'm',
          male: { min: 9.5, max: 13.5 },
          female: { min: 7.5, max: 10.5 },
        },
      },
    },
    ratio: {
      suneung: 55,
      silgi: 45,
    },
  },
];
