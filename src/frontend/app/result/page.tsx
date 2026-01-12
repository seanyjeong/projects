/**
 * 결과 페이지
 *
 * 기능:
 * - 대학별 환산 점수 표시
 * - 순위 비교
 * - 상세 점수 breakdown
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
  Trophy,
  Medal,
  Award,
  Loader2,
  AlertTriangle,
  Home,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Dumbbell,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalculationResult {
  departmentId: string;
  universityName: string;
  departmentName: string;
  totalScore: number;
  suneungScore?: number;
  silgiScore?: number;
  rank: number;
}

const RANK_ICONS = [Trophy, Medal, Award];
const RANK_COLORS = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
const RANK_BG = ['bg-yellow-50 border-yellow-200', 'bg-gray-50 border-gray-200', 'bg-amber-50 border-amber-200'];

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

  // 공유하기
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '체점 - 점수 계산 결과',
          text: `나의 체대 입시 점수 계산 결과를 확인해보세요!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
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
              <span className="font-semibold text-gray-900">계산 결과</span>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
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
            {/* 결과 요약 헤더 */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6" />
                <h2 className="text-lg font-bold">나의 점수 분석 결과</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-emerald-100 text-sm mb-1">비교 대학</p>
                  <p className="text-2xl font-bold">{results.length}개</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-emerald-100 text-sm mb-1">최고 점수</p>
                  <p className="text-2xl font-bold">
                    {results.length > 0 ? results[0].totalScore.toFixed(1) : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* 순위별 결과 카드 */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900">대학별 환산 점수</h3>

              {results.map((result, index) => {
                const RankIcon = RANK_ICONS[index] || Award;
                const rankColor = RANK_COLORS[index] || 'text-gray-400';
                const rankBg = RANK_BG[index] || 'bg-gray-50 border-gray-200';

                return (
                  <div
                    key={result.departmentId}
                    className={`bg-white border-2 rounded-2xl overflow-hidden ${
                      index === 0 ? 'border-emerald-200' : 'border-gray-100'
                    }`}
                  >
                    {/* 순위 헤더 */}
                    <div className={`px-5 py-3 flex items-center gap-3 ${index === 0 ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rankBg} border-2`}>
                        <RankIcon className={`w-4 h-4 ${rankColor}`} />
                      </div>
                      <span className={`font-bold ${index === 0 ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {index + 1}위
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                          최고 점수
                        </span>
                      )}
                    </div>

                    {/* 대학 정보 + 점수 */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {result.universityName}
                          </h4>
                          <p className="text-gray-500">{result.departmentName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-emerald-600">
                            {result.totalScore.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">환산 총점</p>
                        </div>
                      </div>

                      {/* 점수 breakdown (있는 경우) */}
                      {(result.suneungScore || result.silgiScore) && (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="text-xs text-blue-600">수능</p>
                              <p className="font-bold text-blue-700">
                                {result.suneungScore?.toFixed(2) || '-'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                            <Dumbbell className="w-5 h-5 text-orange-500" />
                            <div>
                              <p className="text-xs text-orange-600">실기</p>
                              <p className="font-bold text-orange-700">
                                {result.silgiScore?.toFixed(2) || '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 입력 데이터 보기 (접기/펼치기) */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700">입력된 데이터 확인</span>
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
                        <span className="text-gray-400">국어</span>
                        <span className="font-mono">{suneungData.korean.standardScore}점 / {suneungData.korean.grade}등급</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">수학</span>
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
                홈으로
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
