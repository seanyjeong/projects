/**
 * 실기 기록 입력 페이지
 *
 * 기능:
 * 1. 성별 선택 (남/여) - 배점표가 다름
 * 2. 선택된 대학별 실기 종목 표시
 * 3. 각 종목별 기록 입력
 * 4. 결과 화면으로 이동
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSilgiStore } from '@/lib/store/silgi-store';
import { GenderSelector } from './components/GenderSelector';
import { UniversitySection } from './components/UniversitySection';
import { ArrowRight, ArrowLeft, Calculator, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_UNIVERSITIES } from '../university/mock-data';

export default function SilgiPage() {
  const router = useRouter();
  const { data, setGender, initializeUniversities, updateEventRecord, isValid } = useSilgiStore();

  const [isInitialized, setIsInitialized] = useState(false);

  // 페이지 로드 시 선택된 대학 데이터로 초기화
  useEffect(() => {
    if (!isInitialized) {
      // university-store에서 선택된 대학 데이터 가져오기
      const { useUniversityStore } = require('@/lib/store/university-store');
      const selectedUniversities = useUniversityStore.getState().selectedUniversities;

      if (selectedUniversities.length > 0) {
        initializeUniversities(selectedUniversities);
        setIsInitialized(true);
      } else {
        // 선택된 대학이 없으면 대학 선택 페이지로 리다이렉트
        router.replace('/university');
      }
    }
  }, [isInitialized, initializeUniversities, router]);

  // 성별 선택 핸들러
  const handleGenderChange = (gender: 'male' | 'female') => {
    setGender(gender);
  };

  // 종목 기록 업데이트 핸들러
  const handleEventChange = (universityId: string, eventKey: string, value: string) => {
    updateEventRecord(universityId, eventKey, value);
  };

  // 계산하기 버튼
  const handleCalculate = () => {
    if (!isValid()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // 계산 실행
    const { useSuneungStore } = require('@/lib/store/suneung-store');
    const { useResultStore } = require('@/lib/store/result-store');
    const { calculateMultipleUniversities } = require('@/lib/calculator');

    const suneungData = useSuneungStore.getState().data;
    const setResults = useResultStore.getState().setResults;

    // 대학 정보 변환
    const universitiesForCalc = data.universities.map(univ => {
      const original = MOCK_UNIVERSITIES.find(u => u.id === univ.universityId);
      return {
        id: univ.universityId,
        name: univ.universityName,
        department: univ.department,
        group: univ.group,
        ratio: original?.ratio || { suneung: 40, silgi: 60 },
      };
    });

    // 실기 기록 변환
    const allEvents = data.universities[0]?.events || [];
    const silgiRecords = allEvents.map(event => ({
      eventName: event.eventName,
      record: parseFloat(event.value) || 0,
    }));

    // 계산
    const results = calculateMultipleUniversities(
      suneungData,
      silgiRecords,
      universitiesForCalc
    );

    // 결과 저장
    setResults(results, {
      suneungScores: suneungData,
      silgiRecords,
      universities: universitiesForCalc,
      gender: data.gender || 'male',
    });

    // 결과 페이지로 이동
    router.push('/result');
  };

  // 진행 상황 계산
  const getTotalProgress = () => {
    if (!data.universities.length) return { completed: 0, total: 0 };
    const total = data.universities.reduce((sum, u) => sum + u.events.length, 0);
    const completed = data.universities.reduce(
      (sum, u) => sum + u.events.filter(e => e.value.trim() !== '').length,
      0
    );
    return { completed, total };
  };

  const progress = getTotalProgress();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/university" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-gray-900">실기 기록 입력</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            3 / 3 단계
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="h-1 bg-gray-100">
            <div className="h-full w-full bg-emerald-500 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-6 pb-32">
        {/* 성별 선택 */}
        <div className="mb-6">
          <GenderSelector value={data.gender} onChange={handleGenderChange} />
        </div>

        {/* 안내 메시지 - 성별 미선택 시 */}
        {!data.gender && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">성별을 먼저 선택해주세요</p>
                <p className="text-amber-600">
                  성별에 따라 실기 배점표가 다르게 적용됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 대학별 실기 입력 섹션 */}
        {data.gender && data.universities.length > 0 && (
          <div className="space-y-4">
            {/* 진행 상황 표시 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">입력 진행률</span>
                <span className="text-sm font-bold text-emerald-600">
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                />
              </div>
              {progress.completed === progress.total && progress.total > 0 && (
                <div className="flex items-center gap-2 mt-3 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">모든 종목 입력 완료!</span>
                </div>
              )}
            </div>

            {/* 안내 */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-emerald-800 mb-1">실기 기록을 입력해주세요</p>
                  <p className="text-emerald-600">
                    대학마다 실기 종목과 배점이 다르므로 각 대학별로 입력해주세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 대학별 섹션 */}
            {data.universities.map((university, index) => (
              <UniversitySection
                key={university.universityId}
                university={university}
                index={index + 1}
                onEventChange={(eventKey, value) =>
                  handleEventChange(university.universityId, eventKey, value)
                }
              />
            ))}
          </div>
        )}

        {/* 대학 없음 */}
        {data.gender && data.universities.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">선택된 대학이 없습니다</p>
            <Link
              href="/university"
              className="text-emerald-600 font-medium hover:underline"
            >
              대학 선택하러 가기
            </Link>
          </div>
        )}
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 py-4 safe-bottom">
          <Button
            onClick={handleCalculate}
            disabled={!isValid()}
            className="w-full h-12 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl"
            size="lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            점수 계산하기
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          {!isValid() && data.gender && (
            <p className="text-center text-sm text-gray-500 mt-2">
              모든 종목을 입력하면 계산할 수 있습니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
