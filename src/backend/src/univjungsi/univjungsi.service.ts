/**
 * Univjungsi DB 서비스
 *
 * 실제 대학/학과/실기배점 데이터를 univjungsi DB에서 조회
 */

import { Injectable, OnModuleDestroy, NotFoundException } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

// 타입 정의
export interface UnivjungsiDepartment {
  dept_id: number;
  univ_id: number;
  univ_name: string;
  dept_name: string;
  모집군: '가' | '나' | '다';
  모집인원: number;
  year_id: number;
}

export interface FormulaConfig {
  config_id: number;
  dept_id: number;
  total_score: number;
  suneung_ratio: number;
  subjects_config: any;
  selection_rules: any;
  bonus_rules: any;
  special_mode: any;
  legacy_formula: string;
  display_config: any;
  english_scores: Record<string, number>;
  history_scores: Record<string, number>;
  calculation_mode: string;
  legacy_uid: number;
}

export interface PracticalScoreRecord {
  id: number;
  dept_id: number;
  종목명: string;
  성별: '남' | '여' | '공통';
  기록: string;
  점수: number;
}

export interface UnivjungsiUniversity {
  univ_id: number;
  univ_name: string;
  short_name: string;
  region: string;
}

@Injectable()
export class UnivjungsiService implements OnModuleDestroy {
  private pool: mysql.Pool;

  constructor() {
    // univjungsi DB 연결 풀 생성
    this.pool = mysql.createPool({
      host: process.env.UNIVJUNGSI_DB_HOST || 'localhost',
      user: process.env.UNIVJUNGSI_DB_USER || 'paca',
      password: process.env.UNIVJUNGSI_DB_PASSWORD || 'q141171616!',
      database: process.env.UNIVJUNGSI_DB_NAME || 'univjungsi',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  /**
   * 대학 목록 조회
   */
  async getUniversities(): Promise<UnivjungsiUniversity[]> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      'SELECT univ_id, univ_name, short_name, region FROM universities ORDER BY univ_name'
    );
    return rows as UnivjungsiUniversity[];
  }

  /**
   * 학과 목록 조회 (대학 정보 포함)
   */
  async getDepartments(year: number = 2026): Promise<UnivjungsiDepartment[]> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT d.dept_id, d.univ_id, u.univ_name, d.dept_name, d.모집군, d.모집인원, d.year_id
       FROM departments d
       JOIN universities u ON d.univ_id = u.univ_id
       WHERE d.year_id = ?
       ORDER BY u.univ_name, d.dept_name`,
      [year]
    );
    return rows as UnivjungsiDepartment[];
  }

  /**
   * 학과 상세 조회 (dept_id로)
   */
  async getDepartmentById(deptId: number): Promise<UnivjungsiDepartment | null> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT d.dept_id, d.univ_id, u.univ_name, d.dept_name, d.모집군, d.모집인원, d.year_id
       FROM departments d
       JOIN universities u ON d.univ_id = u.univ_id
       WHERE d.dept_id = ?`,
      [deptId]
    );
    return (rows[0] as UnivjungsiDepartment) || null;
  }

  /**
   * 대학별 학과 목록 조회
   */
  async getDepartmentsByUniversity(univId: number, year: number = 2026): Promise<UnivjungsiDepartment[]> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT d.dept_id, d.univ_id, u.univ_name, d.dept_name, d.모집군, d.모집인원, d.year_id
       FROM departments d
       JOIN universities u ON d.univ_id = u.univ_id
       WHERE d.univ_id = ? AND d.year_id = ?
       ORDER BY d.모집군, d.dept_name`,
      [univId, year]
    );
    return rows as UnivjungsiDepartment[];
  }

  /**
   * 계산식 설정 조회
   */
  async getFormulaConfig(deptId: number): Promise<FormulaConfig | null> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT * FROM formula_configs WHERE dept_id = ?`,
      [deptId]
    );

    if (rows.length === 0) return null;

    const row = rows[0] as any;
    return {
      ...row,
      subjects_config: typeof row.subjects_config === 'string'
        ? JSON.parse(row.subjects_config)
        : row.subjects_config,
      selection_rules: typeof row.selection_rules === 'string'
        ? JSON.parse(row.selection_rules)
        : row.selection_rules,
      bonus_rules: typeof row.bonus_rules === 'string'
        ? JSON.parse(row.bonus_rules)
        : row.bonus_rules,
      special_mode: typeof row.special_mode === 'string'
        ? JSON.parse(row.special_mode)
        : row.special_mode,
      display_config: typeof row.display_config === 'string'
        ? JSON.parse(row.display_config)
        : row.display_config,
      english_scores: typeof row.english_scores === 'string'
        ? JSON.parse(row.english_scores)
        : row.english_scores,
      history_scores: typeof row.history_scores === 'string'
        ? JSON.parse(row.history_scores)
        : row.history_scores,
    };
  }

  /**
   * 실기 배점표 조회
   */
  async getPracticalScores(deptId: number): Promise<PracticalScoreRecord[]> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT id, dept_id, 종목명, 성별, 기록, 점수
       FROM practical_score_tables
       WHERE dept_id = ?
       ORDER BY 종목명, 성별, 기록`,
      [deptId]
    );
    return rows as PracticalScoreRecord[];
  }

  /**
   * 실기 종목 목록 조회 (학과별)
   */
  async getPracticalEvents(deptId: number): Promise<string[]> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT DISTINCT 종목명 FROM practical_score_tables WHERE dept_id = ?`,
      [deptId]
    );
    return rows.map((r: any) => r.종목명);
  }

  /**
   * 영어 등급표 조회 (별도 테이블에서)
   */
  async getEnglishGradeTable(deptId: number): Promise<Record<string, number> | null> {
    // formula_configs의 english_scores 필드 사용
    const formula = await this.getFormulaConfig(deptId);
    return formula?.english_scores || null;
  }

  /**
   * 한국사 등급표 조회
   */
  async getHistoryGradeTable(deptId: number): Promise<Record<string, number> | null> {
    const formula = await this.getFormulaConfig(deptId);
    return formula?.history_scores || null;
  }

  /**
   * 최고표점 조회
   */
  async getHighestScores(year: number, examType: string = '수능'): Promise<Record<string, number>> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT 과목명, 최고점 FROM highest_scores WHERE year_id = ? AND 모형 = ?`,
      [year, examType]
    );

    const result: Record<string, number> = {};
    for (const row of rows as any[]) {
      result[row.과목명] = parseFloat(row.최고점);
    }
    return result;
  }

  /**
   * 탐구 변환표준점수 테이블 조회
   */
  async getInquiryConvTable(deptId: number): Promise<any[]> {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      `SELECT 계열, 백분위, 변환표준점수 FROM inquiry_conv_tables WHERE dept_id = ? ORDER BY 계열, 백분위 DESC`,
      [deptId]
    );
    return rows as any[];
  }
}
