/**
 * 실기 기록 입력 페이지
 *
 * 기능:
 * 1. 성별 선택 (남/여) - 배점표가 다름
 * 2. 선택된 대학별 실기 종목 표시
 * 3. 각 종목별 기록 입력
 * 4. 실시간 점수 환산 표시 (가능하면)
 * 5. 결과 화면으로 이동
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSilgiStore } from '@/lib/store/silgi-store';
import { GenderSelector } from './components/GenderSelector';
import { UniversitySection } from './components/UniversitySection';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-bg-primary border-b border-border">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
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
            <h1 className="text-page-title">실기 기록 입력</h1>
          </div>

          <p className="text-sm text-text-secondary">
            각 종목의 기록을 정확히 입력해주세요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="p-5 space-y-6">
        {/* 성별 선택 */}
        <GenderSelector value={data.gender} onChange={handleGenderChange} />

        {/* 대학별 실기 입력 섹션 */}
        {data.gender && data.universities.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                선택된 대학 ({data.universities.length})
              </h2>
              <span className="text-xs text-text-tertiary">
                동일 종목은 자동으로 적용됩니다
              </span>
            </div>

            {data.universities.map((university) => (
              <UniversitySection
                key={university.universityId}
                university={university}
                onEventChange={(eventKey, value) =>
                  handleEventChange(university.universityId, eventKey, value)
                }
              />
            ))}
          </div>
        ) : (
          data.gender && (
            <div className="py-16 text-center">
              <p className="text-text-secondary">선택된 대학이 없습니다</p>
              <button
                onClick={() => router.push('/university')}
                className="mt-4 text-accent text-sm font-medium hover:underline"
              >
                대학 선택하러 가기
              </button>
            </div>
          )
        )}

        {/* 안내 메시지 */}
        {!data.gender && (
          <div className="p-4 bg-accent-light rounded-lg">
            <p className="text-sm text-accent font-medium">
              먼저 성별을 선택해주세요
            </p>
            <p className="text-xs text-accent mt-1">
              성별에 따라 배점표가 달라집니다
            </p>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      {data.gender && data.universities.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-bg-primary border-t border-border">
          <button
            onClick={handleCalculate}
            disabled={!isValid()}
            className={`
              w-full h-12
              px-6
              text-white
              text-base font-medium
              rounded-lg
              transition-all duration-150
              flex items-center justify-center gap-2
              ${
                isValid()
                  ? 'bg-accent hover:bg-accent-hover active:scale-[0.98]'
                  : 'bg-text-tertiary cursor-not-allowed opacity-60'
              }
            `}
          >
            계산하기
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* 진행 상태 표시 */}
          {!isValid() && (
            <p className="text-xs text-text-tertiary text-center mt-2">
              모든 종목을 입력하면 계산할 수 있습니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
