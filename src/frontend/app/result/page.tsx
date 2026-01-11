/**
 * 결과 페이지 (임시)
 *
 * TODO:
 * - 실제 점수 계산 로직 구현
 * - 대학별 비교 결과 표시
 * - 합격 가능성 분석
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSilgiStore } from '@/lib/store/silgi-store';
import { useSuneungStore } from '@/lib/store/suneung-store';
import { useUniversityStore } from '@/lib/store/university-store';
import { api } from '@/lib/api';
import { ChevronLeft } from 'lucide-react';

interface CalculationResult {
  departmentId: string;
  universityName: string;
  departmentName: string;
  totalScore: number;
  rank: number;
}

export default function ResultPage() {
  const router = useRouter();
  const silgiData = useSilgiStore((state) => state.data);
  const suneungData = useSuneungStore((state) => state.data);
  const selectedUniversities = useUniversityStore((state) => state.selectedUniversities);

  const [results, setResults] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 계산 API 호출
  useEffect(() => {
    const calculateScores = async () => {
      setLoading(true);
      setError(null);

      try {
        // Department IDs 추출
        const departmentIds = selectedUniversities.map((u) => u.id);

        if (departmentIds.length === 0) {
          throw new Error('선택된 대학이 없습니다.');
        }

        if (!silgiData.gender) {
          throw new Error('성별 정보가 없습니다.');
        }

        // 수능 점수 변환
        const suneungScores = {
          korean: {
            standard: parseInt(suneungData.korean.standardScore) || 0,
            percentile: parseInt(suneungData.korean.percentile) || 0,
            grade: parseInt(suneungData.korean.grade) || 0,
          },
          math: {
            standard: parseInt(suneungData.math.standardScore) || 0,
            percentile: parseInt(suneungData.math.percentile) || 0,
            grade: parseInt(suneungData.math.grade) || 0,
            subject: suneungData.math.subject,
          },
          english: {
            grade: parseInt(suneungData.english.grade) || 0,
          },
          tamgu1: {
            subject: suneungData.tamgu1.subject,
            standard: parseInt(suneungData.tamgu1.standardScore) || 0,
            percentile: parseInt(suneungData.tamgu1.percentile) || 0,
            grade: parseInt(suneungData.tamgu1.grade) || 0,
          },
          tamgu2: {
            subject: suneungData.tamgu2.subject,
            standard: parseInt(suneungData.tamgu2.standardScore) || 0,
            percentile: parseInt(suneungData.tamgu2.percentile) || 0,
            grade: parseInt(suneungData.tamgu2.grade) || 0,
          },
          history: {
            grade: parseInt(suneungData.history.grade) || 0,
          },
        };

        // 실기 기록 변환 (모든 대학의 실기 종목 수집)
        const silgiRecordsMap = new Map<string, number>();
        silgiData.universities.forEach((univ) => {
          univ.events.forEach((event) => {
            if (event.value) {
              silgiRecordsMap.set(event.eventName, parseFloat(event.value));
            }
          });
        });

        const silgiRecords = Array.from(silgiRecordsMap.entries()).map(([eventName, record]) => ({
          eventName,
          record,
        }));

        // API 호출
        const response = await api.post<{ results: CalculationResult[] }>('/calculate/compare', {
          departmentIds,
          suneungScores,
          silgiRecords,
          gender: silgiData.gender,
        });

        setResults(response.results);
      } catch (err: any) {
        console.error('Failed to calculate scores:', err);
        setError(err.message || '점수 계산에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    calculateScores();
  }, [silgiData, suneungData, selectedUniversities]);

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-bg-primary border-b border-border">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="
                w-10 h-10
                flex items-center justify-center
                rounded-lg
                hover:bg-bg-tertiary
                transition-all duration-150
                active:scale-95
              "
              aria-label="뒤로가기"
            >
              <ChevronLeft className="w-6 h-6 text-text-secondary" strokeWidth={2} />
            </button>
            <h1 className="text-page-title">계산 결과</h1>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="p-5 space-y-6">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-secondary">점수를 계산하는 중...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-text-secondary mb-4">{error}</p>
            <button
              onClick={() => router.push('/silgi')}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
            >
              다시 입력
            </button>
          </div>
        ) : (
          <>
            {/* 계산 결과 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">계산 결과</h3>

              {results.map((result, index) => (
                <div
                  key={result.departmentId}
                  className="p-4 bg-bg-secondary border border-border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-accent bg-accent-light px-2 py-0.5 rounded">
                          {index + 1}위
                        </span>
                      </div>
                      <h4 className="font-semibold text-text-primary">
                        {result.universityName}
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {result.departmentName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-tertiary mb-1">총점</div>
                      <div className="text-2xl font-bold text-accent">
                        {result.totalScore.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 입력된 데이터 확인 (접을 수 있게) */}
            <details className="space-y-4">
              <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary">
                입력된 데이터 보기
              </summary>

              {/* 성별 */}
              <div className="p-4 bg-bg-secondary border border-border rounded-lg mt-4">
                <div className="text-sm text-text-secondary mb-1">성별</div>
                <div className="text-base font-medium text-text-primary">
                  {silgiData.gender === 'male' ? '남자' : '여자'}
                </div>
              </div>

              {/* 대학별 실기 기록 */}
              {silgiData.universities.map((univ) => (
                <div
                  key={univ.universityId}
                  className="p-4 bg-bg-secondary border border-border rounded-lg"
                >
                  <div className="font-semibold text-text-primary mb-3">
                    {univ.universityName} {univ.department}
                  </div>
                  <div className="space-y-2">
                    {univ.events.map((event) => (
                      <div
                        key={event.eventKey}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-text-secondary">{event.eventName}</span>
                        <span className="font-mono text-text-primary">
                          {event.value} {event.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </details>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/silgi')}
                className="
                  flex-1 h-12
                  px-6
                  bg-bg-tertiary
                  text-text-primary
                  text-base font-medium
                  rounded-lg
                  border border-border
                  hover:bg-bg-secondary
                  transition-all duration-150
                  active:scale-[0.98]
                "
              >
                다시 입력
              </button>

              <button
                onClick={() => router.push('/')}
                className="
                  flex-1 h-12
                  px-6
                  bg-accent hover:bg-accent-hover
                  text-white
                  text-base font-medium
                  rounded-lg
                  transition-all duration-150
                  active:scale-[0.98]
                "
              >
                홈으로
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
