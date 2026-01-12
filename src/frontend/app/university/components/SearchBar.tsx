/**
 * SearchBar 컴포넌트
 * 대학명/학과명 검색 입력
 */

'use client';

import { Search, X } from 'lucide-react';
import { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = '대학명 또는 학과명 검색',
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full h-12
          pl-12 pr-10
          bg-white
          border border-gray-200
          rounded-xl
          text-base text-gray-900
          placeholder:text-gray-400
          transition-all duration-150
          focus:outline-none
          focus:border-emerald-500
          focus:ring-1
          focus:ring-emerald-500
        "
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
