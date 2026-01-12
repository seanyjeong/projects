import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

// 계산 엔진 import
import { calculateScore } from './suneung';
import { calculatePracticalScore } from './practical';
import {
  FormulaData,
  StudentScores,
  StudentPracticalData,
  HighestScoreMap,
  PracticalFormulaData,
} from './types';

@Injectable()
export class CalculatorService {
  constructor(private prisma: PrismaService) {}
  /**
   * 수능 점수 계산
   */
  async calculateSuneung(
    dto: SuneungCalculateDto,
  ): Promise<SuneungCalculateResponseDto> {
    try {
      // 1. DB에서 학과 정보 조회 (현재는 Mock)
      const formulaData = await this.getFormulaData(dto.departmentId);

      // 2. DTO → StudentScores 변환
      const studentScores = this.convertToStudentScores(dto.scores);

      // 3. 최고표점 조회 (현재는 Mock)
      const highestMap = await this.getHighestScoreMap(formulaData.학년도);

      // 4. 수능 계산 엔진 호출
      const result = calculateScore(formulaData, studentScores, highestMap);

      // 5. 응답 변환
      return {
        departmentId: dto.departmentId,
        suneungScore: parseFloat(result.totalScore),
        maxScore: formulaData.수능,
        details: result.breakdown as Record<string, number>,
      };
    } catch (error) {
      throw new Error(`수능 계산 실패: ${error.message}`);
    }
  }

  /**
   * 실기 점수 계산
   */
  async calculatePractical(
    dto: PracticalCalculateDto,
  ): Promise<PracticalCalculateResponseDto> {
    try {
      // 1. DB에서 학과 정보 조회 (현재는 Mock)
      const practicalFormula = await this.getPracticalFormulaData(
        dto.departmentId,
      );

      // 2. DTO → StudentPracticalData 변환
      const studentData = this.convertToStudentPracticalData(
        dto.gender,
        dto.records,
      );

      // 3. 실기 계산 엔진 호출
      const result = calculatePracticalScore(practicalFormula, studentData);

      // 4. 응답 변환
      const details = dto.records.map((rec) => {
        const eventBreakdown = (result.breakdown as any).events?.find(
          (e: any) => e.event === rec.eventName,
        );
        return {
          eventName: rec.eventName,
          record: rec.record,
          score: eventBreakdown?.score || 0,
        };
      });

      return {
        departmentId: dto.departmentId,
        silgiScore: parseFloat(result.totalScore),
        maxScore: practicalFormula.실기총점,
        details,
      };
    } catch (error) {
      throw new Error(`실기 계산 실패: ${error.message}`);
    }
  }

  /**
   * 총점 계산 (수능 + 실기)
   */
  async calculateTotal(
    dto: TotalCalculateDto,
  ): Promise<TotalCalculateResponseDto> {
    try {
      // 1. DB에서 학과 정보 조회
      const formulaData = await this.getFormulaData(dto.departmentId);
      const practicalFormula = await this.getPracticalFormulaData(
        dto.departmentId,
      );

      // 2. 수능 계산
      const studentScores = this.convertToStudentScores(dto.suneungScores);
      const highestMap = await this.getHighestScoreMap(formulaData.학년도);
      const suneungResult = calculateScore(
        formulaData,
        studentScores,
        highestMap,
      );

      // 3. 실기 계산
      const studentPracticalData = this.convertToStudentPracticalData(
        dto.gender,
        dto.silgiRecords,
      );
      const practicalResult = calculatePracticalScore(
        practicalFormula,
        studentPracticalData,
      );

      // 4. 총점 계산
      const suneungScore = parseFloat(suneungResult.totalScore);
      const practicalScore = parseFloat(practicalResult.totalScore);

      // 수능 비율 (formulaData.수능은 배점, 예: 400. 비율로 변환: 40%)
      const suneungRatioPercent = formulaData.수능 / 10;
      const silgiRatioPercent = 100 - suneungRatioPercent;

      const totalScore = suneungScore + practicalScore;

      return {
        departmentId: dto.departmentId,
        universityName: '', // compareUniversities에서 설정
        departmentName: '', // compareUniversities에서 설정
        totalScore,
        maxScore: 1000,
        breakdown: {
          suneung: {
            score: suneungScore,
            max: formulaData.수능,
            ratio: suneungRatioPercent,
          },
          silgi: {
            score: practicalScore,
            max: practicalFormula.실기총점,
            ratio: silgiRatioPercent,
          },
        },
      };
    } catch (error) {
      throw new Error(`총점 계산 실패: ${error.message}`);
    }
  }

  /**
   * 여러 대학 비교 계산
   */
  async compareUniversities(
    dto: CompareCalculateDto,
  ): Promise<CompareCalculateResponseDto> {
    try {
      const results = [];

      for (const deptData of dto.departments) {
        // DB에서 학과 정보 조회
        const department = await this.prisma.department.findUnique({
          where: { id: deptData.departmentId },
          include: { university: true },
        });

        if (!department) {
          throw new NotFoundException(
            `학과를 찾을 수 없습니다: ${deptData.departmentId}`,
          );
        }

        const totalDto: TotalCalculateDto = {
          departmentId: deptData.departmentId,
          suneungScores: dto.suneungScores,
          silgiRecords: deptData.silgiRecords, // 해당 대학의 실기 기록만 사용
          gender: dto.gender,
        };

        const totalResult = await this.calculateTotal(totalDto);

        results.push({
          departmentId: deptData.departmentId,
          universityName: department.university.name,
          departmentName: department.name,
          totalScore: totalResult.totalScore,
          suneungScore: totalResult.breakdown?.suneung?.score,
          silgiScore: totalResult.breakdown?.silgi?.score,
          maxScore: totalResult.maxScore,
          suneungRatio: totalResult.breakdown?.suneung?.ratio,
          silgiRatio: totalResult.breakdown?.silgi?.ratio,
        });
      }

      return { results };
    } catch (error) {
      throw new Error(`대학 비교 계산 실패: ${error.message}`);
    }
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  /**
   * DTO → StudentScores 변환
   */
  private convertToStudentScores(scores: any): StudentScores {
    const subjects = [];

    // 국어
    subjects.push({
      name: '국어' as const,
      std: scores.korean.standard,
      percentile: scores.korean.percentile,
      grade: scores.korean.grade,
      subject: scores.korean.subject,
    });

    // 수학
    subjects.push({
      name: '수학' as const,
      std: scores.math.standard,
      percentile: scores.math.percentile,
      grade: scores.math.grade,
      subject: scores.math.subject,
    });

    // 영어
    subjects.push({
      name: '영어' as const,
      grade: scores.english.grade,
    });

    // 탐구
    if (scores.tamgu1) {
      subjects.push({
        name: '탐구' as const,
        subject: scores.tamgu1.subject,
        std: scores.tamgu1.standard,
        percentile: scores.tamgu1.percentile,
        grade: scores.tamgu1.grade,
      });
    }
    if (scores.tamgu2) {
      subjects.push({
        name: '탐구' as const,
        subject: scores.tamgu2.subject,
        std: scores.tamgu2.standard,
        percentile: scores.tamgu2.percentile,
        grade: scores.tamgu2.grade,
      });
    }

    // 한국사
    if (scores.history) {
      subjects.push({
        name: '한국사' as const,
        grade: scores.history.grade,
      });
    }

    return { subjects };
  }

  /**
   * DTO → StudentPracticalData 변환
   */
  private convertToStudentPracticalData(
    gender: 'male' | 'female',
    records: any[],
  ): StudentPracticalData {
    return {
      gender: gender === 'male' ? '남' : '여',
      practicals: records.map((rec) => ({
        event: rec.eventName,
        value: rec.record,
      })),
    };
  }

  /**
   * DB에서 FormulaData 조회
   */
  private async getFormulaData(departmentId: string): Promise<FormulaData> {
    const dept = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!dept || !dept.formula) {
      throw new NotFoundException(`학과 공식 데이터를 찾을 수 없습니다: ${departmentId}`);
    }

    const formula = dept.formula as any;
    const weights = formula.suneungWeights || {};
    const types = formula.suneungTypes || {};

    // DB formula → FormulaData 변환
    return {
      dept_id: 1,
      학년도: dept.year,
      총점: 1000,
      수능: formula.suneungRatio * 10, // 비율 → 배점 (40% → 400)
      국어: weights.korean || 0,
      수학: weights.math || 0,
      영어: weights.english || 0,
      탐구: weights.tamgu || 0,
      탐구수: 2,
      한국사: weights.history || 0,
      계산유형: '기본비율',
      score_config: {
        korean_math: {
          type: types.korean === 'standard' ? '표준점수' : '백분위',
          max_score_method: 'highest_of_year',
        },
        inquiry: {
          type: types.tamgu === 'standard' ? '표준점수' : '백분위',
          max_score_method: 'highest_of_year',
        },
      },
      english_scores: formula.englishGrades || {
        '1': 100, '2': 98, '3': 95, '4': 90, '5': 85,
        '6': 80, '7': 75, '8': 70, '9': 65,
      },
    };
  }

  /**
   * DB에서 PracticalFormulaData 조회
   */
  private async getPracticalFormulaData(
    departmentId: string,
  ): Promise<PracticalFormulaData> {
    const dept = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!dept || !dept.formula) {
      throw new NotFoundException(`학과 공식 데이터를 찾을 수 없습니다: ${departmentId}`);
    }

    const formula = dept.formula as any;
    const silgiEvents = formula.silgiEvents || [];

    // 실기 배점표 생성 (종목별 기본 범위 기반)
    const 실기배점: any[] = [];
    silgiEvents.forEach((event: any) => {
      const eventName = event.name;
      const maxScore = event.maxScore || 100;

      // 종목별 기본 범위 정의 (실제 데이터가 없으므로 합리적인 범위 사용)
      const range = this.getEventDefaultRange(eventName);

      // 10개 등급으로 배점표 생성
      for (let i = 0; i <= 10; i++) {
        const ratio = i / 10;
        let record: number;

        if (range.method === 'lower_is_better') {
          // 낮을수록 좋음 (100m 등): 만점 기록 → 최저 기록
          record = range.best + (range.worst - range.best) * ratio;
        } else {
          // 높을수록 좋음 (멀리뛰기 등): 만점 기록 → 최저 기록
          record = range.best - (range.best - range.worst) * ratio;
        }

        const score = Math.round(maxScore * (1 - ratio));

        실기배점.push({
          종목명: eventName,
          성별: '공통',
          기록: record.toFixed(2),
          배점: score,
        });
      }
    });

    // 실기 총점 계산
    const 실기총점 = silgiEvents.reduce(
      (sum: number, e: any) => sum + (e.maxScore || 0),
      0,
    );

    return {
      dept_id: 1,
      실기모드: 'basic',
      실기총점,
      기본점수: 0,
      미달처리: '최하점',
      실기배점,
    };
  }

  /**
   * 종목별 기본 범위 반환 (실제 데이터 없을 때 사용)
   */
  private getEventDefaultRange(eventName: string): {
    best: number;
    worst: number;
    method: 'lower_is_better' | 'higher_is_better';
  } {
    // 종목명 기반으로 기본 범위 설정
    const lowerName = eventName.toLowerCase();

    // 시간 측정 종목 (낮을수록 좋음)
    if (lowerName.includes('100m') || lowerName.includes('100미터')) {
      return { best: 11.0, worst: 15.0, method: 'lower_is_better' };
    }
    if (lowerName.includes('200m') || lowerName.includes('200미터')) {
      return { best: 23.0, worst: 32.0, method: 'lower_is_better' };
    }
    if (lowerName.includes('왕복') || lowerName.includes('셔틀')) {
      return { best: 10.0, worst: 15.0, method: 'lower_is_better' };
    }
    if (lowerName.includes('1500') || lowerName.includes('장거리')) {
      return { best: 240, worst: 420, method: 'lower_is_better' }; // 초 단위
    }
    if (lowerName.includes('지그재그') || lowerName.includes('사이드스텝')) {
      return { best: 8.0, worst: 15.0, method: 'lower_is_better' };
    }

    // 거리/횟수 측정 종목 (높을수록 좋음)
    if (lowerName.includes('멀리뛰기') || lowerName.includes('제자리멀리')) {
      return { best: 300, worst: 180, method: 'higher_is_better' }; // cm
    }
    if (lowerName.includes('던지기') || lowerName.includes('투척')) {
      return { best: 50, worst: 20, method: 'higher_is_better' }; // m
    }
    if (lowerName.includes('윗몸') || lowerName.includes('싯업')) {
      return { best: 70, worst: 30, method: 'higher_is_better' }; // 개
    }
    if (lowerName.includes('팔굽혀') || lowerName.includes('푸쉬업')) {
      return { best: 60, worst: 20, method: 'higher_is_better' }; // 개
    }
    if (lowerName.includes('턱걸이') || lowerName.includes('철봉')) {
      return { best: 20, worst: 3, method: 'higher_is_better' }; // 개
    }
    if (lowerName.includes('높이뛰기')) {
      return { best: 180, worst: 120, method: 'higher_is_better' }; // cm
    }
    if (lowerName.includes('배근력')) {
      return { best: 200, worst: 80, method: 'higher_is_better' }; // kg
    }
    if (lowerName.includes('악력')) {
      return { best: 60, worst: 25, method: 'higher_is_better' }; // kg
    }

    // 기본값: 점수 직접 입력으로 가정 (높을수록 좋음)
    return { best: 100, worst: 0, method: 'higher_is_better' };
  }

  /**
   * 최고표점 조회 (Mock)
   */
  private async getHighestScoreMap(year: number): Promise<HighestScoreMap> {
    // TODO: DB에서 조회
    return {
      국어: 150,
      수학: 145,
      '생활과윤리': 70,
      사회문화: 68,
    };
  }
}
