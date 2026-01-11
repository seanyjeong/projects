'use client';

import { ExamType } from '@/lib/store/suneung-store';

interface ExamTypeSelectorProps {
  selected: ExamType;
  onChange: (type: ExamType) => void;
}

const examTypes: ExamType[] = ['6월', '9월', '수능'];

export function ExamTypeSelector({ selected, onChange }: ExamTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">시험 종류</label>
      <div className="flex gap-2">
        {examTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex-1 h-12 rounded-lg text-base font-medium transition-all duration-150 touch-target ${
              selected === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
            }`}
          >
            {type} 모의고사
          </button>
        ))}
      </div>
    </div>
  );
}
