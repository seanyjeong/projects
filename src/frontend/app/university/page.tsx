/**
 * 대학 검색 페이지
 *
 * 기능:
 * - 군별/지역별 필터
 * - 대학명/학과명 검색
 * - 대학 선택 (최대 3개: 가/나/다 각 1개)
 * - 실기 입력 페이지로 이동
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FilterChips } from './components/FilterChips';
import { SearchBar } from './components/SearchBar';
import { UniversityCard } from './components/UniversityCard';
import { UniversityGroup, Region, SelectedUniversities, University } from './types';
import { universityApi } from '@/lib/api';
import { ChevronRight } from 'lucide-react';

export default function UniversitySearchPage() {
  const router = useRouter();

  // 필터 상태
  const [selectedGroup, setSelectedGroup] = useState<UniversityGroup>('all');
  const [selectedRegion, setSelectedRegion] = useState<Region>('all');
  const [keyword, setKeyword] = useState('');

  // API 상태
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 선택된 대학들
  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversities>({});

  // API 호출
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: {
          q?: string;
          recruitGroup?: string;
          region?: string;
          year?: number;
        } = {
          year: 2026,
        };

        if (keyword) params.q = keyword;
        if (selectedGroup !== 'all') params.recruitGroup = selectedGroup;
        if (selectedRegion !== 'all') params.region = selectedRegion;

        const data = await universityApi.searchDepartments(params);
        setUniversities(data);
      } catch (err) {
        console.error('Failed to fetch universities:', err);
        setError('대학 목록을 불러오는데 실패했습니다.');
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [selectedGroup, selectedRegion, keyword]);

  // 필터링된 대학 목록 (API 결과 사용)
  const filteredUniversities = useMemo(() => {
    return universities;
  }, [universities]);

  // 선택된 대학 개수
  const selectedCount = Object.keys(selectedUniversities).length;

  // 대학 선택/해제
  const handleSelectUniversity = (university: University) => {
    const group = university.group;

    setSelectedUniversities((prev) => {
      // 이미 선택된 대학이면 해제
      if (prev[group]?.id === university.id) {
        const { [group]: _, ...rest } = prev;
        return rest;
      }

      // 해당 군에 선택
      return {
        ...prev,
        [group]: university,
      };
    });
  };

  // 다음 단계로
  const handleNext = () => {
    if (selectedCount === 0) {
      alert('최소 1개 이상의 대학을 선택해주세요.');
      return;
    }

    // 선택된 대학 데이터를 university-store에 저장
    const { useUniversityStore } = require('@/lib/store/university-store');
    const setSelectedUniversities = useUniversityStore.getState().setSelectedUniversities;

    const selectedList = Object.values(selectedUniversities).filter(Boolean);
    setSelectedUniversities(selectedList);

    // 실기 입력 페이지로 이동
    router.push('/silgi');
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-bg-primary border-b border-border">
        <div className="p-5">
          <h1 className="text-page-title mb-4">대학 검색</h1>

          {/* 필터 */}
          <FilterChips
            selectedGroup={selectedGroup}
            selectedRegion={selectedRegion}
            onGroupChange={setSelectedGroup}
            onRegionChange={setSelectedRegion}
          />

          {/* 검색바 */}
          <div className="mt-4">
            <SearchBar value={keyword} onChange={setKeyword} />
          </div>

          {/* 선택 개수 표시 */}
          {selectedCount > 0 && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                선택된 대학: <span className="font-semibold text-accent">{selectedCount}</span>개
              </span>
              <span className="text-text-tertiary">
                (최대 3개: 가/나/다 각 1개)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 대학 목록 */}
      <div className="p-5">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-secondary">대학 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-text-secondary mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
            >
              다시 시도
            </button>
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-text-secondary">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredUniversities.map((university) => {
              const isSelected = selectedUniversities[university.group]?.id === university.id;

              return (
                <UniversityCard
                  key={university.id}
                  university={university}
                  isSelected={isSelected}
                  onSelect={handleSelectUniversity}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-bg-primary border-t border-border">
          <button
            onClick={handleNext}
            className="
              w-full h-12
              px-6
              bg-accent hover:bg-accent-hover
              text-white
              text-base font-medium
              rounded-lg
              transition-all duration-150
              active:scale-[0.98]
              flex items-center justify-center gap-2
            "
          >
            다음: 실기 기록 입력
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
