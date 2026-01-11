/**
 * SearchBar 컴포넌트
 * 대학명/학과명 검색 입력
 */

'use client';

import { Search } from 'lucide-react';
import { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = '대학명 또는 학과명 입력...',
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary"
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full h-12
          pl-11 pr-4
          bg-bg-tertiary
          border border-border
          rounded-lg
          text-base text-text-primary
          placeholder:text-text-tertiary
          transition-all duration-150
          focus:outline-none
          focus:border-border-focus
          focus:bg-bg-secondary
        "
      />
    </div>
  );
}
