/**
 * FilterChips 컴포넌트
 * 군별/지역별 필터 칩
 */

'use client';

import { UniversityGroup, Region } from '../types';

interface FilterChipsProps {
  selectedGroup: UniversityGroup;
  selectedRegion: Region;
  onGroupChange: (group: UniversityGroup) => void;
  onRegionChange: (region: Region) => void;
}

const GROUP_OPTIONS: { value: UniversityGroup; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ga', label: '가군' },
  { value: 'na', label: '나군' },
  { value: 'da', label: '다군' },
];

const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'seoul', label: '서울' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'local', label: '지방' },
];

export function FilterChips({
  selectedGroup,
  selectedRegion,
  onGroupChange,
  onRegionChange,
}: FilterChipsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 군 선택 */}
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          모집 군
        </label>
        <div className="flex gap-2 flex-wrap">
          {GROUP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onGroupChange(option.value)}
              className={`
                px-4 py-2
                text-sm font-medium
                rounded-xl
                transition-all duration-150
                ${
                  selectedGroup === option.value
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 지역 선택 */}
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          지역
        </label>
        <div className="flex gap-2 flex-wrap">
          {REGION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onRegionChange(option.value)}
              className={`
                px-4 py-2
                text-sm font-medium
                rounded-xl
                transition-all duration-150
                ${
                  selectedRegion === option.value
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
