/**
 * 대학 검색 페이지 타입 정의
 */

// 군 타입
export type UniversityGroup = 'all' | 'ga' | 'na' | 'da';

// 지역 타입
export type Region = 'all' | 'seoul' | 'gyeonggi' | 'local';

// 필터 상태
export interface FilterState {
  group: UniversityGroup;
  region: Region;
  keyword: string;
}

// 대학 정보 (API에서 가져올 데이터)
export interface University {
  id: string;
  name: string;
  department: string;
  group: 'ga' | 'na' | 'da';
  region: string;
  quota: number;
  requirements: {
    suneung: {
      korean: number;
      math: number;
      english: number;
      inquiry: number;
      koreanHistory: number;
    };
    silgi: {
      [key: string]: {
        name: string;
        unit: string;
        male: { min: number; max: number };
        female: { min: number; max: number };
      };
    };
  };
  ratio: {
    suneung: number;
    silgi: number;
  };
}

// 선택된 대학 (최대 3개 - 가/나/다 각 1개)
export interface SelectedUniversities {
  ga?: University;
  na?: University;
  da?: University;
}
