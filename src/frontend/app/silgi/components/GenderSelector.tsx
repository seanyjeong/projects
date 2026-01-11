/**
 * 성별 선택 컴포넌트
 *
 * 기능:
 * - 남자/여자 선택
 * - 배점표가 성별에 따라 다름
 */

'use client';

import { Gender } from '@/lib/store/silgi-store';

interface GenderSelectorProps {
  value: Gender | null;
  onChange: (gender: Gender) => void;
}

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-secondary">
        성별 선택
      </label>

      <div className="flex gap-3">
        {/* 남자 */}
        <button
          type="button"
          onClick={() => onChange('male')}
          className={`
            flex-1 h-12
            px-6
            rounded-lg
            text-base font-medium
            transition-all duration-150
            active:scale-[0.98]
            ${
              value === 'male'
                ? 'bg-accent text-white border-2 border-accent'
                : 'bg-bg-tertiary text-text-primary border border-border hover:bg-bg-secondary'
            }
          `}
        >
          남자
        </button>

        {/* 여자 */}
        <button
          type="button"
          onClick={() => onChange('female')}
          className={`
            flex-1 h-12
            px-6
            rounded-lg
            text-base font-medium
            transition-all duration-150
            active:scale-[0.98]
            ${
              value === 'female'
                ? 'bg-accent text-white border-2 border-accent'
                : 'bg-bg-tertiary text-text-primary border border-border hover:bg-bg-secondary'
            }
          `}
        >
          여자
        </button>
      </div>

      {value && (
        <p className="text-xs text-text-tertiary">
          선택한 성별에 따라 실기 배점표가 적용됩니다
        </p>
      )}
    </div>
  );
}
