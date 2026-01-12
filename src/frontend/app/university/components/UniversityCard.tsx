/**
 * UniversityCard 컴포넌트
 * 대학/학과 정보 카드
 */

'use client';

import { University } from '../types';
import { Check, MapPin, Users } from 'lucide-react';

interface UniversityCardProps {
  university: University;
  isSelected: boolean;
  onSelect: (university: University) => void;
}

const GROUP_LABELS: Record<string, string> = {
  ga: '가군',
  na: '나군',
  da: '다군',
};

const GROUP_COLORS: Record<string, string> = {
  ga: 'bg-blue-50 text-blue-600 border-blue-100',
  na: 'bg-purple-50 text-purple-600 border-purple-100',
  da: 'bg-orange-50 text-orange-600 border-orange-100',
};

export function UniversityCard({
  university,
  isSelected,
  onSelect,
}: UniversityCardProps) {
  const handleClick = () => {
    onSelect(university);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full p-5
        bg-white
        border-2
        rounded-2xl
        text-left
        transition-all duration-200
        hover:shadow-md
        ${
          isSelected
            ? 'border-emerald-500 bg-emerald-50/30 shadow-sm'
            : 'border-gray-100 hover:border-gray-200'
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* 좌측: 대학 정보 */}
        <div className="flex-1 min-w-0">
          {/* 군 배지 */}
          <div className="mb-2">
            <span
              className={`
                inline-flex items-center
                px-2.5 py-1
                rounded-lg
                text-xs font-semibold
                border
                ${isSelected ? 'bg-emerald-500 text-white border-emerald-500' : GROUP_COLORS[university.group]}
              `}
            >
              {GROUP_LABELS[university.group]}
            </span>
          </div>

          {/* 대학명 */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
            {university.name}
          </h3>

          {/* 학과명 */}
          <p className="text-base text-gray-600 mb-3 truncate">
            {university.department}
          </p>

          {/* 부가 정보 */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {university.region && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {university.region}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              모집 {university.quota}명
            </span>
          </div>
        </div>

        {/* 우측: 선택 표시 */}
        <div className="flex-shrink-0">
          <div
            className={`
              w-7 h-7 rounded-full flex items-center justify-center transition-all
              ${isSelected ? 'bg-emerald-500' : 'border-2 border-gray-200'}
            `}
          >
            {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </div>
        </div>
      </div>
    </button>
  );
}
