/**
 * Mock 점수 계산 로직
 *
 * 실제 API 연동 전에 사용할 임시 계산 함수들
 */

import { UniversityResult } from './store/result-store';
import { SuneungData } from './store/suneung-store';

interface SilgiRecord {
  eventName: string;
  record: number;
}

interface UniversityInfo {
  id: string;
  name: string;
  department: string;
  group: 'ga' | 'na' | 'da';
  ratio: {
    suneung: number;
    silgi: number;
  };
}

/**
 * Mock 수능 점수 계산
 *
 * 실제로는 대학별 환산 공식이 적용되어야 하지만,
 * 여기서는 간단한 가중치 평균으로 계산
 */
function calculateSuneungScore(suneungData: SuneungData, university: UniversityInfo): number {
  // 표준점수를 0~100 범위로 정규화 (간단 버전)
  const koreanScore = parseFloat(suneungData.korean.standardScore) || 0;
  const mathScore = parseFloat(suneungData.math.standardScore) || 0;
  const englishGrade = parseFloat(suneungData.english.grade) || 0;
  const tamgu1Score = parseFloat(suneungData.tamgu1.standardScore) || 0;
  const tamgu2Score = parseFloat(suneungData.tamgu2.standardScore) || 0;

  // 영어 등급을 점수로 변환 (1등급=100, 2등급=95, ...)
  const englishScore = Math.max(0, 100 - (englishGrade - 1) * 5);

  // 탐구 평균
  const tamguAvg = (tamgu1Score + tamgu2Score) / 2;

  // 가중 평균 (임시 비율: 국30%, 수30%, 영20%, 탐20%)
  const weightedScore = (
    koreanScore * 0.3 +
    mathScore * 0.3 +
    englishScore * 0.2 +
    tamguAvg * 0.2
  );

  // 400점 만점으로 환산
  const maxScore = 400;
  const score = (weightedScore / 200) * maxScore; // 표준점수 최대 200 가정

  return Math.min(maxScore, Math.max(0, score));
}

/**
 * Mock 실기 점수 계산
 *
 * 실제로는 종목별 환산표가 적용되어야 하지만,
 * 여기서는 랜덤 점수 생성
 */
function calculateSilgiScore(records: SilgiRecord[], university: UniversityInfo): number {
  // 간단하게 각 종목당 80~95점 랜덤 부여
  const eventCount = records.length || 4;
  const maxScore = 600;
  const scorePerEvent = maxScore / eventCount;

  let totalScore = 0;
  for (let i = 0; i < eventCount; i++) {
    // 80~100% 범위에서 랜덤
    const randomFactor = 0.8 + Math.random() * 0.2;
    totalScore += scorePerEvent * randomFactor;
  }

  return Math.min(maxScore, Math.max(0, totalScore));
}

/**
 * 대학별 총점 계산
 */
export function calculateUniversityScore(
  suneungData: SuneungData,
  silgiRecords: SilgiRecord[],
  university: UniversityInfo
): UniversityResult {
  // 수능 점수 계산
  const suneungScore = calculateSuneungScore(suneungData, university);
  const suneungMax = 400;

  // 실기 점수 계산
  const silgiScore = calculateSilgiScore(silgiRecords, university);
  const silgiMax = 600;

  // 비율 적용하여 총점 계산
  const suneungRatio = university.ratio.suneung;
  const silgiRatio = university.ratio.silgi;

  const suneungWeighted = (suneungScore / suneungMax) * suneungRatio * 10;
  const silgiWeighted = (silgiScore / silgiMax) * silgiRatio * 10;

  const totalScore = suneungWeighted + silgiWeighted;
  const maxScore = 1000; // 1000점 만점

  return {
    universityId: university.id,
    universityName: university.name,
    departmentName: university.department,
    group: university.group,
    totalScore,
    maxScore,
    breakdown: {
      suneung: {
        score: suneungScore,
        max: suneungMax,
        ratio: suneungRatio,
      },
      silgi: {
        score: silgiScore,
        max: silgiMax,
        ratio: silgiRatio,
      },
    },
    details: {
      suneung: {
        korean: parseFloat(suneungData.korean.standardScore) || 0,
        math: parseFloat(suneungData.math.standardScore) || 0,
        english: Math.max(0, 100 - (parseFloat(suneungData.english.grade) - 1) * 5),
        inquiry: (parseFloat(suneungData.tamgu1.standardScore) + parseFloat(suneungData.tamgu2.standardScore)) / 2 || 0,
      },
      silgi: silgiRecords.map(record => ({
        eventName: record.eventName,
        record: record.record,
        score: (silgiScore / silgiRecords.length), // 평균으로 분배
      })),
    },
  };
}

/**
 * 여러 대학 비교 계산
 */
export function calculateMultipleUniversities(
  suneungData: SuneungData,
  silgiRecords: SilgiRecord[],
  universities: UniversityInfo[]
): UniversityResult[] {
  return universities.map(university =>
    calculateUniversityScore(suneungData, silgiRecords, university)
  );
}
