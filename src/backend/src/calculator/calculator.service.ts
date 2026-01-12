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
      const suneungRatio = formulaData.수능 / 100; // 비율 (예: 40 → 0.4)
      const practicalRatio = (100 - formulaData.수능) / 100;

      const totalScore = suneungScore + practicalScore;

      return {
        departmentId: dto.departmentId,
        universityName: '서울대학교', // TODO: DB에서 조회
        departmentName: '체육교육과', // TODO: DB에서 조회
        totalScore,
        maxScore: 1000,
        breakdown: {
          suneung: {
            score: suneungScore,
            max: formulaData.수능,
            ratio: formulaData.수능,
          },
          silgi: {
            score: practicalScore,
            max: practicalFormula.실기총점,
            ratio: 100 - formulaData.수능,
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
   * DB에서 FormulaData 조회 (Mock)
   */
  private async getFormulaData(departmentId: string): Promise<FormulaData> {
    // TODO: Prisma로 DB 조회
    // const dept = await this.prisma.department.findUnique({
    //   where: { id: departmentId },
    //   include: { university: true },
    // });

    // Mock 데이터 (서울대 체육교육과 예시)
    return {
      dept_id: 1,
      학년도: 2027,
      총점: 1000,
      수능: 400, // 수능 배점 (40%)
      국어: 30,
      수학: 20,
      영어: 0, // 등급별 환산
      탐구: 50,
      탐구수: 2,
      한국사: 0,
      계산유형: '기본비율',
      score_config: {
        korean_math: {
          type: '표준점수',
          max_score_method: 'highest_of_year',
        },
        inquiry: {
          type: '변환표준점수',
          max_score_method: 'highest_of_year',
        },
      },
      english_scores: {
        '1': 100,
        '2': 98,
        '3': 95,
        '4': 90,
        '5': 85,
        '6': 80,
        '7': 75,
        '8': 70,
        '9': 65,
      },
    };
  }

  /**
   * DB에서 PracticalFormulaData 조회 (Mock)
   */
  private async getPracticalFormulaData(
    departmentId: string,
  ): Promise<PracticalFormulaData> {
    // TODO: Prisma로 DB 조회

    // Mock 데이터 (서울대 체육교육과 예시)
    return {
      dept_id: 1,
      실기모드: 'basic',
      실기총점: 600,
      기본점수: 0,
      미달처리: '0점',
      실기배점: [
        { 종목명: '100m', 성별: '남', 기록: '11.0', 배점: 100 },
        { 종목명: '100m', 성별: '남', 기록: '11.5', 배점: 95 },
        { 종목명: '100m', 성별: '남', 기록: '12.0', 배점: 90 },
        { 종목명: '제자리멀리뛰기', 성별: '남', 기록: '290', 배점: 100 },
        { 종목명: '제자리멀리뛰기', 성별: '남', 기록: '285', 배점: 95 },
        { 종목명: '제자리멀리뛰기', 성별: '남', 기록: '280', 배점: 90 },
      ],
    };
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
