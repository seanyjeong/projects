/**
 * API Client for Project S
 *
 * 백엔드 API와 통신하는 클라이언트
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Singleton 인스턴스
export const api = new ApiClient(API_BASE_URL);

// 타입 정의
export interface SuneungScore {
  korean: {
    standardScore: number;
    percentile: number;
    grade: number;
  };
  math: {
    standardScore: number;
    percentile: number;
    grade: number;
  };
  english: {
    grade: number;
  };
  inquiry1: {
    subject: string;
    standardScore: number;
    percentile: number;
  };
  inquiry2: {
    subject: string;
    standardScore: number;
    percentile: number;
  };
  koreanHistory: {
    grade: number;
  };
}

export interface SilgiRecord {
  gender: 'male' | 'female';
  events: {
    [key: string]: number; // 종목명: 기록
  };
}

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
    suneung: number; // 수능 반영 비율 (%)
    silgi: number;   // 실기 반영 비율 (%)
  };
}

export interface CalculationResult {
  university: University;
  totalScore: number;
  maxScore: number;
  suneungScore: number;
  silgiScore: number;
  rank: number;
}

// API 메서드
export const scoreApi = {
  // 수능 점수 저장
  saveSuneung: (data: SuneungScore) => api.post('/scores/suneung', data),

  // 실기 기록 저장
  saveSilgi: (data: SilgiRecord) => api.post('/scores/silgi', data),

  // 계산하기
  calculate: (suneung: SuneungScore, silgi: SilgiRecord, universityIds: string[]) =>
    api.post<CalculationResult[]>('/calculate', {
      suneung,
      silgi,
      universityIds,
    }),
};

export const universityApi = {
  // 전체 대학 목록
  getAll: () => api.get<University[]>('/universities'),

  // 대학 상세
  getById: (id: string) => api.get<University>(`/universities/${id}`),

  // 학과 검색 (departments/search)
  searchDepartments: (params: {
    q?: string;
    recruitGroup?: string;
    region?: string;
    year?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.recruitGroup) searchParams.append('recruitGroup', params.recruitGroup);
    if (params.region) searchParams.append('region', params.region);
    if (params.year) searchParams.append('year', params.year.toString());

    return api.get<University[]>(`/departments/search?${searchParams.toString()}`);
  },
};
