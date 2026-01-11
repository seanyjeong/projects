/**
 * 실기 종목 입력 컴포넌트
 *
 * 기능:
 * - 종목별 기록 입력
 * - 숫자 키패드 표시 (모바일)
 * - 소수점 허용
 */

'use client';

import { EventRecord } from '@/lib/store/silgi-store';
import { useState } from 'react';

interface EventInputProps {
  event: EventRecord;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EventInput({ event, onChange, disabled = false }: EventInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자, 소수점만 허용
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* 종목명 */}
      <label
        htmlFor={event.eventKey}
        className="flex-1 text-sm font-medium text-text-primary"
      >
        {event.eventName}
      </label>

      {/* 입력 필드 */}
      <div className="flex items-center gap-2">
        <input
          id={event.eventKey}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]*"
          placeholder="0"
          value={event.value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-24 h-10
            px-3
            text-center
            font-mono
            text-base
            bg-bg-tertiary
            border rounded-lg
            transition-all duration-150
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              isFocused
                ? 'border-border-focus bg-bg-secondary'
                : 'border-border'
            }
            ${event.value ? 'text-text-primary' : 'text-text-tertiary'}
          `}
        />

        {/* 단위 */}
        <span className="text-sm text-text-secondary w-8">{event.unit}</span>
      </div>
    </div>
  );
}
