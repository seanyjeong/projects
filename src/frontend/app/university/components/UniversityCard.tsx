/**
 * UniversityCard 컴포넌트
 * 대학/학과 정보 카드
 */

'use client';

import { University } from '../types';
import { Check } from 'lucide-react';

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
        bg-bg-secondary
        border-2
        rounded-xl
        text-left
        transition-all duration-150
        active:scale-[0.98]
        ${
          isSelected
            ? 'border-accent bg-accent-light/10'
            : 'border-border hover:bg-bg-tertiary'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* 좌측: 대학 정보 */}
        <div className="flex-1 min-w-0">
          {/* 대학명 */}
          <h3 className="text-lg font-semibold text-text-primary mb-1 truncate">
            {university.name}
          </h3>

          {/* 학과명 */}
          <p className="text-base text-text-secondary mb-2 truncate">
            {university.department}
          </p>

          {/* 군 + 모집인원 */}
          <div className="flex items-center gap-3 text-sm">
            <span
              className={`
              inline-flex items-center
              px-2 py-1
              rounded-md
              font-medium
              ${
                isSelected
                  ? 'bg-accent text-white'
                  : 'bg-bg-tertiary text-text-secondary'
              }
            `}
            >
              {GROUP_LABELS[university.group]}
            </span>
            <span className="text-text-tertiary">
              모집 {university.quota}명
            </span>
          </div>
        </div>

        {/* 우측: 선택 표시 */}
        {isSelected && (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
