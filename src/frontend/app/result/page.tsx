/**
 * 결과 페이지
 *
 * 기능:
 * - 사용자가 선택한 대학별 환산 점수 표시
 * - 수능/실기 점수 breakdown
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSilgiStore } from '@/lib/store/silgi-store';
import { useSuneungStore } from '@/lib/store/suneung-store';
import { useUniversityStore } from '@/lib/store/university-store';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Home,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Dumbbell,
  School,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalculationResult {
  departmentId: string;
  universityName: string;
  departmentName: string;
  totalScore: number;
  suneungScore?: number;
  silgiScore?: number;
  maxScore?: number;
  suneungRatio?: number;
  silgiRatio?: number;
}

const GROUP_LABELS: Record<string, string> = {
  ga: '가군',
  na: '나군',
  da: '다군',
};

const GROUP_COLORS: Record<string, string> = {
  ga: 'bg-blue-50 text-blue-600 border-blue-200',
  na: 'bg-purple-50 text-purple-600 border-purple-200',
  da: 'bg-orange-50 text-orange-600 border-orange-200',
};

export default function ResultPage() {
  const router = useRouter();
  const silgiData = useSilgiStore((state) => state.data);
  const suneungData = useSuneungStore((state) => state.data);
  const selectedUniversities = useUniversityStore((state) => state.selectedUniversities);

  const [results, setResults] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // 계산 API 호출
  useEffect(() => {
    const calculateScores = async () => {
      setLoading(true);
      setError(null);

      try {
        if (silgiData.universities.length === 0) {
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

        // 대학별 실기 기록 변환
        const departments = silgiData.universities.map((univ) => ({
          departmentId: univ.universityId,
          silgiRecords: univ.events
            .filter((event) => event.value.trim() !== '')
            .map((event) => ({
              eventName: event.eventName,
              record: parseFloat(event.value) || 0,
            })),
        }));

        // API 호출
        const response = await api.post<{ results: CalculationResult[] }>('/calculate/compare', {
          departments,
          suneungScores,
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

  // 선택한 대학의 군 정보 가져오기
  const getUniversityGroup = (departmentId: string) => {
    const univ = selectedUniversities.find(u => u.id === departmentId);
    return univ?.group || 'ga';
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-gray-900">내 점수 확인</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-6 pb-32">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">점수를 계산하는 중...</p>
            <p className="text-sm text-gray-400 mt-1">잠시만 기다려주세요</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-700 font-medium mb-2">계산 중 오류가 발생했습니다</p>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <Button
              onClick={() => router.push('/silgi')}
              className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 입력하기
            </Button>
          </div>
        ) : (
          <>
            {/* 안내 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                내 환산 점수
              </h1>
              <p className="text-gray-500">
                선택한 대학별로 계산된 환산 점수입니다.
              </p>
            </div>

            {/* 대학별 점수 카드 */}
            <div className="space-y-4 mb-6">
              {results.map((result) => {
                const group = getUniversityGroup(result.departmentId);
                const groupColor = GROUP_COLORS[group] || GROUP_COLORS.ga;

                return (
                  <div
                    key={result.departmentId}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* 대학 헤더 */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <School className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{result.universityName}</h3>
                              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${groupColor}`}>
                                {GROUP_LABELS[group]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{result.departmentName}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 점수 표시 */}
                    <div className="p-5">
                      {/* 총점 */}
                      <div className="text-center mb-6">
                        <p className="text-sm text-gray-500 mb-1">환산 총점</p>
                        <p className="text-4xl font-bold text-emerald-600">
                          {result.totalScore.toFixed(2)}
                        </p>
                        {result.maxScore && (
                          <p className="text-sm text-gray-400 mt-1">
                            / {result.maxScore} 만점
                          </p>
                        )}
                      </div>

                      {/* 수능/실기 breakdown */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">수능</span>
                            {result.suneungRatio && (
                              <span className="text-xs text-blue-500">({result.suneungRatio}%)</span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-blue-700">
                            {result.suneungScore?.toFixed(2) || '-'}
                          </p>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Dumbbell className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium text-orange-700">실기</span>
                            {result.silgiRatio && (
                              <span className="text-xs text-orange-500">({result.silgiRatio}%)</span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-orange-700">
                            {result.silgiScore?.toFixed(2) || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {results.length === 0 && (
                <div className="py-12 text-center">
                  <School className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">계산 결과가 없습니다.</p>
                </div>
              )}
            </div>

            {/* 입력 데이터 보기 (접기/펼치기) */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700">입력한 정보 확인</span>
                {showDetails ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showDetails && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                  {/* 성별 */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500">성별</span>
                    <span className="font-medium text-gray-900">
                      {silgiData.gender === 'male' ? '남자' : '여자'}
                    </span>
                  </div>

                  {/* 수능 성적 요약 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">수능 성적</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">국어 ({suneungData.korean.subject})</span>
                        <span className="font-mono">{suneungData.korean.standardScore}점 / {suneungData.korean.grade}등급</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">수학 ({suneungData.math.subject})</span>
                        <span className="font-mono">{suneungData.math.standardScore}점 / {suneungData.math.grade}등급</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">영어</span>
                        <span className="font-mono">{suneungData.english.grade}등급</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">한국사</span>
                        <span className="font-mono">{suneungData.history.grade}등급</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">탐구1 ({suneungData.tamgu1.subject})</span>
                        <span className="font-mono">{suneungData.tamgu1.standardScore}점</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">탐구2 ({suneungData.tamgu2.subject})</span>
                        <span className="font-mono">{suneungData.tamgu2.standardScore}점</span>
                      </div>
                    </div>
                  </div>

                  {/* 실기 기록 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">실기 기록</h4>
                    {silgiData.universities.map((univ) => (
                      <div key={univ.universityId} className="text-sm">
                        <p className="text-gray-500 mb-1">{univ.universityName}</p>
                        <div className="flex flex-wrap gap-2">
                          {univ.events.map((event) => (
                            <span
                              key={event.eventKey}
                              className="px-2 py-1 bg-gray-100 rounded text-gray-700"
                            >
                              {event.eventName}: {event.value}{event.unit}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* 하단 고정 버튼 */}
      {!loading && !error && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-5 py-4 safe-bottom flex gap-3">
            <Button
              onClick={() => router.push('/silgi')}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 계산
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 rounded-xl">
                <Home className="w-4 h-4 mr-2" />
                처음으로
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
