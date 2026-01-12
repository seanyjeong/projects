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
import Link from 'next/link';
import { FilterChips } from './components/FilterChips';
import { SearchBar } from './components/SearchBar';
import { UniversityCard } from './components/UniversityCard';
import { UniversityGroup, Region, SelectedUniversities, University } from './types';
import { universityApi } from '@/lib/api';
import { ArrowRight, ArrowLeft, Loader2, AlertTriangle, School } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/suneung" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-gray-900">대학 선택</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            2 / 3 단계
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="h-1 bg-gray-100">
            <div className="h-full w-2/3 bg-emerald-500 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      {/* Filter Section - Sticky */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-5 py-4 space-y-4">
          {/* 필터 */}
          <FilterChips
            selectedGroup={selectedGroup}
            selectedRegion={selectedRegion}
            onGroupChange={setSelectedGroup}
            onRegionChange={setSelectedRegion}
          />

          {/* 검색바 */}
          <SearchBar value={keyword} onChange={setKeyword} />

          {/* 선택 개수 표시 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              검색 결과 <span className="font-semibold text-gray-900">{filteredUniversities.length}</span>개
            </span>
            {selectedCount > 0 && (
              <span className="text-emerald-600 font-medium">
                {selectedCount}개 선택됨 (가/나/다 각 1개)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 대학 목록 - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-5 py-6 pb-32">
          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">대학 목록을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <School className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-400 mt-2">다른 검색어나 필터를 시도해보세요</p>
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
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 py-4 safe-bottom">
          <Button
            onClick={handleNext}
            disabled={selectedCount === 0}
            className="w-full h-12 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl"
            size="lg"
          >
            다음 단계: 실기 기록 입력
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          {selectedCount === 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              최소 1개 이상의 대학을 선택해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
