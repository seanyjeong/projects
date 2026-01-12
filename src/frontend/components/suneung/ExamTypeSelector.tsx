'use client';

import { ExamType } from '@/lib/store/suneung-store';

interface ExamTypeSelectorProps {
  selected: ExamType;
  onChange: (type: ExamType) => void;
}

const examTypes: { value: ExamType; label: string }[] = [
  { value: '6월', label: '6월 모평' },
  { value: '9월', label: '9월 모평' },
  { value: '수능', label: '수능' },
];

export function ExamTypeSelector({ selected, onChange }: ExamTypeSelectorProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <label className="text-sm font-medium text-gray-600 mb-3 block">시험 종류 선택</label>
      <div className="flex gap-2">
        {examTypes.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`flex-1 h-11 rounded-xl text-sm font-medium transition-all duration-150 ${
              selected === value
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
