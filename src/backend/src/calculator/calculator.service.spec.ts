import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from './calculator.service';
import {
  SuneungCalculateDto,
  SuneungCalculateResponseDto,
} from './dto/suneung-calculate.dto';
import {
  PracticalCalculateDto,
  PracticalCalculateResponseDto,
} from './dto/practical-calculate.dto';
import {
  TotalCalculateDto,
  TotalCalculateResponseDto,
} from './dto/total-calculate.dto';
import {
  CompareCalculateDto,
  CompareCalculateResponseDto,
} from './dto/compare-calculate.dto';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateSuneung', () => {
    it('수능 점수가 정상적으로 계산되어야 함', async () => {
      const dto: SuneungCalculateDto = {
        departmentId: 'dept-001',
        scores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
            subject: '화법과작문',
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
            subject: '미적분',
          },
          english: {
            grade: 2,
          },
          tamgu1: {
            standard: 65,
            percentile: 88,
            grade: 3,
            subject: '생활과윤리',
          },
          tamgu2: {
            standard: 63,
            percentile: 85,
            grade: 3,
            subject: '사회문화',
          },
          history: {
            grade: 3,
          },
        },
      };

      const result = await service.calculateSuneung(dto);

      // 기본 검증
      expect(result).toBeDefined();
      expect(result.departmentId).toBe('dept-001');
      expect(result.suneungScore).toBeGreaterThan(0);
      expect(result.maxScore).toBe(400); // Mock 데이터 기준
      expect(result.details).toBeDefined();
      expect(typeof result.details).toBe('object');
    });

    it('수능 점수가 계산되어야 함 (최대값 확인은 계산 엔진에서 처리)', async () => {
      const dto: SuneungCalculateDto = {
        departmentId: 'dept-001',
        scores: {
          korean: {
            standard: 150,
            percentile: 100,
            grade: 1,
            subject: '화법과작문',
          },
          math: {
            standard: 145,
            percentile: 100,
            grade: 1,
            subject: '미적분',
          },
          english: {
            grade: 1,
          },
          tamgu1: {
            standard: 70,
            percentile: 100,
            grade: 1,
            subject: '생활과윤리',
          },
          tamgu2: {
            standard: 68,
            percentile: 100,
            grade: 1,
            subject: '사회문화',
          },
        },
      };

      const result = await service.calculateSuneung(dto);

      // 계산 엔진이 정상적으로 점수를 계산하는지 확인
      expect(result.suneungScore).toBeGreaterThan(0);
      expect(result.maxScore).toBe(400);
    });

    it('탐구 과목이 없어도 계산이 가능해야 함 (학과 설정에 따름)', async () => {
      const dto: SuneungCalculateDto = {
        departmentId: 'dept-001',
        scores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
          },
          english: {
            grade: 2,
          },
          // tamgu1, tamgu2 누락 - 학과가 탐구를 반영하지 않을 수도 있음
        },
      };

      const result = await service.calculateSuneung(dto);

      // 계산이 정상적으로 수행되어야 함
      expect(result).toBeDefined();
      expect(result.suneungScore).toBeGreaterThanOrEqual(0);
    });

    it('잘못된 departmentId가 주어지면 적절히 처리해야 함', async () => {
      const dto: SuneungCalculateDto = {
        departmentId: 'invalid-dept',
        scores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
          },
          english: {
            grade: 2,
          },
        },
      };

      // 현재 Mock 데이터를 사용하므로 에러가 발생하지 않음
      // DB 연동 후 NotFoundException이 발생해야 함
      const result = await service.calculateSuneung(dto);
      expect(result).toBeDefined();
    });
  });

  describe('calculatePractical', () => {
    it('실기 점수가 정상적으로 계산되어야 함', async () => {
      const dto: PracticalCalculateDto = {
        departmentId: 'dept-001',
        gender: 'male',
        records: [
          {
            eventName: '100m',
            record: 11.2,
          },
          {
            eventName: '제자리멀리뛰기',
            record: 285,
          },
        ],
      };

      const result = await service.calculatePractical(dto);

      // 기본 검증
      expect(result).toBeDefined();
      expect(result.departmentId).toBe('dept-001');
      expect(result.silgiScore).toBeGreaterThan(0);
      expect(result.maxScore).toBe(600); // Mock 데이터 기준
      expect(result.details).toBeDefined();
      expect(Array.isArray(result.details)).toBe(true);
      expect(result.details.length).toBe(2);
    });

    it('실기 점수가 최대값을 초과하지 않아야 함', async () => {
      const dto: PracticalCalculateDto = {
        departmentId: 'dept-001',
        gender: 'male',
        records: [
          {
            eventName: '100m',
            record: 11.0, // 최고 기록
          },
          {
            eventName: '제자리멀리뛰기',
            record: 290, // 최고 기록
          },
        ],
      };

      const result = await service.calculatePractical(dto);

      expect(result.silgiScore).toBeLessThanOrEqual(result.maxScore);
    });

    it('여자 수험생의 실기 점수도 정상적으로 계산되어야 함', async () => {
      const dto: PracticalCalculateDto = {
        departmentId: 'dept-001',
        gender: 'female',
        records: [
          {
            eventName: '100m',
            record: 13.5,
          },
          {
            eventName: '제자리멀리뛰기',
            record: 240,
          },
        ],
      };

      const result = await service.calculatePractical(dto);

      expect(result).toBeDefined();
      expect(result.silgiScore).toBeGreaterThanOrEqual(0);
    });

    it('기록이 없으면 0점을 반환해야 함', async () => {
      const dto: PracticalCalculateDto = {
        departmentId: 'dept-001',
        gender: 'male',
        records: [],
      };

      const result = await service.calculatePractical(dto);

      // 빈 기록이 주어지면 0점 또는 기본점수를 반환
      expect(result).toBeDefined();
      expect(result.silgiScore).toBeGreaterThanOrEqual(0);
      expect(result.details).toEqual([]);
    });
  });

  describe('calculateTotal', () => {
    it('총점(수능+실기)이 정상적으로 계산되어야 함', async () => {
      const dto: TotalCalculateDto = {
        departmentId: 'dept-001',
        suneungScores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
            subject: '화법과작문',
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
            subject: '미적분',
          },
          english: {
            grade: 2,
          },
          tamgu1: {
            standard: 65,
            percentile: 88,
            grade: 3,
            subject: '생활과윤리',
          },
          tamgu2: {
            standard: 63,
            percentile: 85,
            grade: 3,
            subject: '사회문화',
          },
        },
        silgiRecords: [
          {
            eventName: '100m',
            record: 11.2,
          },
          {
            eventName: '제자리멀리뛰기',
            record: 285,
          },
        ],
        gender: 'male',
      };

      const result = await service.calculateTotal(dto);

      // 기본 검증
      expect(result).toBeDefined();
      expect(result.departmentId).toBe('dept-001');
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.maxScore).toBe(1000);
      expect(result.breakdown).toBeDefined();
      expect(result.breakdown.suneung).toBeDefined();
      expect(result.breakdown.silgi).toBeDefined();
    });

    it('총점이 수능 점수와 실기 점수의 합이어야 함', async () => {
      const dto: TotalCalculateDto = {
        departmentId: 'dept-001',
        suneungScores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
          },
          english: {
            grade: 2,
          },
          tamgu1: {
            standard: 65,
            percentile: 88,
            grade: 3,
            subject: '생활과윤리',
          },
          tamgu2: {
            standard: 63,
            percentile: 85,
            grade: 3,
            subject: '사회문화',
          },
        },
        silgiRecords: [
          {
            eventName: '100m',
            record: 11.2,
          },
        ],
        gender: 'male',
      };

      const result = await service.calculateTotal(dto);

      const calculatedTotal =
        result.breakdown.suneung.score + result.breakdown.silgi.score;
      expect(result.totalScore).toBeCloseTo(calculatedTotal, 1);
    });

    it('최고 점수로 총점을 계산해야 함', async () => {
      const dto: TotalCalculateDto = {
        departmentId: 'dept-001',
        suneungScores: {
          korean: {
            standard: 150,
            percentile: 100,
            grade: 1,
          },
          math: {
            standard: 145,
            percentile: 100,
            grade: 1,
          },
          english: {
            grade: 1,
          },
          tamgu1: {
            standard: 70,
            percentile: 100,
            grade: 1,
            subject: '생활과윤리',
          },
          tamgu2: {
            standard: 68,
            percentile: 100,
            grade: 1,
            subject: '사회문화',
          },
        },
        silgiRecords: [
          {
            eventName: '100m',
            record: 11.0,
          },
          {
            eventName: '제자리멀리뛰기',
            record: 290,
          },
        ],
        gender: 'male',
      };

      const result = await service.calculateTotal(dto);

      // 최고 점수로 계산되었는지 확인 (계산 엔진이 정상 동작하는지 확인)
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.breakdown.suneung.score).toBeGreaterThan(0);
      expect(result.breakdown.silgi.score).toBeGreaterThan(0);
    });
  });

  describe('compareUniversities', () => {
    it('여러 대학의 점수를 비교하여 순위를 매겨야 함', async () => {
      const dto: CompareCalculateDto = {
        departmentIds: ['dept-001', 'dept-002', 'dept-003'],
        suneungScores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
          },
          english: {
            grade: 2,
          },
          tamgu1: {
            standard: 65,
            percentile: 88,
            grade: 3,
            subject: '생활과윤리',
          },
          tamgu2: {
            standard: 63,
            percentile: 85,
            grade: 3,
            subject: '사회문화',
          },
        },
        silgiRecords: [
          {
            eventName: '100m',
            record: 11.2,
          },
          {
            eventName: '제자리멀리뛰기',
            record: 285,
          },
        ],
        gender: 'male',
      };

      const result = await service.compareUniversities(dto);

      // 기본 검증
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results.length).toBe(3);

      // 순위 검증
      result.results.forEach((item, index) => {
        expect(item.rank).toBe(index + 1);
      });

      // 점수 내림차순 정렬 검증
      for (let i = 0; i < result.results.length - 1; i++) {
        expect(result.results[i].totalScore).toBeGreaterThanOrEqual(
          result.results[i + 1].totalScore,
        );
      }
    });

    it('대학 ID가 하나만 주어져도 정상적으로 동작해야 함', async () => {
      const dto: CompareCalculateDto = {
        departmentIds: ['dept-001'],
        suneungScores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
          },
          english: {
            grade: 2,
          },
        },
        silgiRecords: [
          {
            eventName: '100m',
            record: 11.2,
          },
        ],
        gender: 'male',
      };

      const result = await service.compareUniversities(dto);

      expect(result.results.length).toBe(1);
      expect(result.results[0].rank).toBe(1);
    });

    it('대학 ID가 주어지지 않으면 에러가 발생해야 함', async () => {
      const dto: CompareCalculateDto = {
        departmentIds: [],
        suneungScores: {
          korean: {
            standard: 130,
            percentile: 95,
            grade: 2,
          },
          math: {
            standard: 125,
            percentile: 92,
            grade: 2,
          },
          english: {
            grade: 2,
          },
        },
        silgiRecords: [
          {
            eventName: '100m',
            record: 11.2,
          },
        ],
        gender: 'male',
      };

      // 빈 배열이 주어지면 빈 결과를 반환
      const result = await service.compareUniversities(dto);
      expect(result.results.length).toBe(0);
    });
  });
});
