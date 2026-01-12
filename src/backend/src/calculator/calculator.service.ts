import { Injectable, NotFoundException } from '@nestjs/common';
import { UnivjungsiService } from '../univjungsi/univjungsi.service';
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
  constructor(private univjungsi: UnivjungsiService) {}

  /**
   * 수능 점수 계산
   */
  async calculateSuneung(
    dto: SuneungCalculateDto,
  ): Promise<SuneungCalculateResponseDto> {
    try {
      const deptId = this.parseDeptId(dto.departmentId);

      // 1. univjungsi DB에서 학과/공식 정보 조회
      const formulaData = await this.getFormulaData(deptId);

      // 2. DTO → StudentScores 변환
      const studentScores = this.convertToStudentScores(dto.scores);

      // 3. 최고표점 조회
      const highestMap = await this.getHighestScoreMap(formulaData.학년도);

      // 4. 수능 계산 엔진 호출
      const result = calculateScore(formulaData, studentScores, highestMap);

      // 5. 응답 변환
      const suneungMaxScore = (formulaData.총점 || 1000) * (formulaData.수능 / 100);
      return {
        departmentId: dto.departmentId,
        suneungScore: parseFloat(result.totalScore),
        maxScore: suneungMaxScore, // 700 (총점 1000 * 수능비율 70%)
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
      const deptId = this.parseDeptId(dto.departmentId);

      // 1. univjungsi DB에서 실기 공식/배점표 조회
      const practicalFormula = await this.getPracticalFormulaData(deptId);

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
      const deptId = this.parseDeptId(dto.departmentId);

      // 1. univjungsi DB에서 공식 정보 조회
      const formulaData = await this.getFormulaData(deptId);
      const practicalFormula = await this.getPracticalFormulaData(deptId);

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

      // 4. 점수 추출
      const suneungScore = parseFloat(suneungResult.totalScore);
      const practicalScore = parseFloat(practicalResult.totalScore);

      // 5. 비율 계산 (수능 = 70%, 실기 = 30%)
      const suneungRatioPercent = formulaData.수능; // 70
      const silgiRatioPercent = 100 - suneungRatioPercent; // 30

      // 배점 계산 (총점 1000 기준)
      const suneungMaxScore = (formulaData.총점 || 1000) * (suneungRatioPercent / 100); // 700
      const silgiMaxScore = practicalFormula.실기총점; // 300

      const totalScore = suneungScore + practicalScore;

      return {
        departmentId: dto.departmentId,
        universityName: '',
        departmentName: '',
        totalScore,
        maxScore: formulaData.총점 || 1000,
        breakdown: {
          suneung: {
            score: suneungScore,
            max: suneungMaxScore,
            ratio: suneungRatioPercent,
          },
          silgi: {
            score: practicalScore,
            max: silgiMaxScore,
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
        const deptId = this.parseDeptId(deptData.departmentId);

        // univjungsi DB에서 학과 정보 조회
        const department = await this.univjungsi.getDepartmentById(deptId);

        if (!department) {
          throw new NotFoundException(
            `학과를 찾을 수 없습니다: ${deptData.departmentId}`,
          );
        }

        const totalDto: TotalCalculateDto = {
          departmentId: deptData.departmentId,
          suneungScores: dto.suneungScores,
          silgiRecords: deptData.silgiRecords,
          gender: dto.gender,
        };

        const totalResult = await this.calculateTotal(totalDto);

        results.push({
          departmentId: deptData.departmentId,
          universityName: department.univ_name,
          departmentName: department.dept_name,
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
   * departmentId 파싱 (문자열 또는 숫자 지원)
   */
  private parseDeptId(departmentId: string | number): number {
    if (typeof departmentId === 'number') return departmentId;
    const parsed = parseInt(departmentId, 10);
    if (isNaN(parsed)) {
      throw new Error(`유효하지 않은 학과 ID: ${departmentId}`);
    }
    return parsed;
  }

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
   * univjungsi DB에서 FormulaData 조회
   */
  private async getFormulaData(deptId: number): Promise<FormulaData> {
    // 학과 정보 조회
    const dept = await this.univjungsi.getDepartmentById(deptId);
    if (!dept) {
      throw new NotFoundException(`학과를 찾을 수 없습니다: ${deptId}`);
    }

    // 계산식 설정 조회
    const formula = await this.univjungsi.getFormulaConfig(deptId);
    if (!formula) {
      throw new NotFoundException(`계산식 설정을 찾을 수 없습니다: ${deptId}`);
    }

    const subjects = formula.subjects_config || {};
    const displayConfig = formula.display_config || {};

    // formula_configs → FormulaData 변환
    return {
      dept_id: deptId,
      학년도: dept.year_id,
      총점: formula.total_score || 1000,
      수능: formula.suneung_ratio, // 70% (0-100 range)
      국어: subjects.korean?.ratio || 0,
      수학: subjects.math?.ratio || 0,
      영어: subjects.english?.ratio || 0,
      탐구: subjects.inquiry?.ratio || 0,
      탐구수: subjects.inquiry?.count || 2,
      한국사: subjects.history?.ratio || 0,
      계산유형: formula.calculation_mode === 'legacy' ? '특수공식' : '기본비율',
      특수공식: formula.legacy_formula,
      score_config: {
        korean_math: {
          type: this.getScoreType(subjects.korean?.source_type) as '표준점수' | '백분위',
          max_score_method: 'highest_of_year',
        },
        inquiry: {
          type: this.getScoreType(subjects.inquiry?.source_type) as '표준점수' | '백분위' | '변환표준점수',
          max_score_method: 'highest_of_year',
        },
      },
      english_scores: formula.english_scores || {},
      history_scores: formula.history_scores || {},
      U_ID: formula.legacy_uid,
    } as FormulaData;
  }

  /**
   * source_type → 점수 유형 변환
   */
  private getScoreType(sourceType: string | undefined): string {
    switch (sourceType) {
      case 'std':
        return '표준점수';
      case 'pct':
        return '백분위';
      case 'conv_std':
        return '변환표준점수';
      case 'grade_conv':
        return '등급환산';
      default:
        return '백분위';
    }
  }

  /**
   * univjungsi DB에서 PracticalFormulaData 조회
   */
  private async getPracticalFormulaData(
    deptId: number,
  ): Promise<PracticalFormulaData> {
    // 계산식 설정 조회
    const formula = await this.univjungsi.getFormulaConfig(deptId);
    if (!formula) {
      throw new NotFoundException(`계산식 설정을 찾을 수 없습니다: ${deptId}`);
    }

    // 실기 배점표 조회 (실제 데이터!)
    const practicalScores = await this.univjungsi.getPracticalScores(deptId);

    // PracticalScoreRecord → 실기배점 형식 변환
    const 실기배점 = practicalScores.map((score) => ({
      종목명: score.종목명,
      성별: score.성별,
      기록: score.기록,
      배점: score.점수,
    }));

    // display_config에서 실기 설정 추출
    const displayConfig = formula.display_config || {};
    const 실기총점 = displayConfig.실기총점 || 0;
    const 미달처리 = displayConfig.미달처리 || '0점';

    // special-rules.ts에 정의된 U_ID 목록
    const SPECIAL_UIDS = [2, 3, 13, 16, 17, 19, 69, 70, 71, 99, 121, 146, 147, 151, 152, 153, 160, 175, 184, 186, 189, 194, 197, 199];
    const uid = formula.legacy_uid;
    const hasSpecialRule = SPECIAL_UIDS.includes(uid);

    return {
      dept_id: deptId,
      U_ID: uid,
      실기모드: hasSpecialRule ? 'special' : 'basic',
      실기총점,
      기본점수: 0,
      미달처리,
      실기배점,
    };
  }

  /**
   * univjungsi DB에서 최고표점 조회
   */
  private async getHighestScoreMap(year: number): Promise<HighestScoreMap> {
    return await this.univjungsi.getHighestScores(year, '수능');
  }
}
