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
import { CheckCircle2 } from 'lucide-react';

interface EventInputProps {
  event: EventRecord;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EventInput({ event, onChange, disabled = false }: EventInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = event.value.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자, 소수점만 허용
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className={`
      flex items-center gap-4 p-4 rounded-xl transition-all duration-200
      ${hasValue ? 'bg-emerald-50/50' : 'bg-gray-50'}
      ${isFocused ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}
    `}>
      {/* 완료 표시 */}
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
        ${hasValue ? 'bg-emerald-500' : 'border-2 border-gray-200'}
      `}>
        {hasValue && <CheckCircle2 className="w-4 h-4 text-white" />}
      </div>

      {/* 종목명 */}
      <label
        htmlFor={event.eventKey}
        className={`
          flex-1 font-medium
          ${hasValue ? 'text-emerald-700' : 'text-gray-700'}
        `}
      >
        {event.eventName}
      </label>

      {/* 입력 필드 + 단위 */}
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
            w-24 h-12
            px-3
            text-center
            font-mono
            text-lg font-semibold
            bg-white
            border-2 rounded-xl
            transition-all duration-200
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              hasValue
                ? 'border-emerald-300 text-emerald-700'
                : 'border-gray-200 text-gray-900'
            }
            ${isFocused ? 'border-emerald-500' : ''}
          `}
        />

        {/* 단위 */}
        <span className={`
          text-sm font-medium w-10
          ${hasValue ? 'text-emerald-600' : 'text-gray-400'}
        `}>
          {event.unit}
        </span>
      </div>
    </div>
  );
}
