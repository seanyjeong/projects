'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ScoreInputProps {
  subjectName: string;
  standardScore: string;
  percentile: string;
  grade: string;
  onStandardScoreChange: (value: string) => void;
  onPercentileChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  standardScoreRange?: { min: number; max: number };
  percentileRange?: { min: number; max: number };
  gradeRange?: { min: number; max: number };
}

export function ScoreInput({
  subjectName,
  standardScore,
  percentile,
  grade,
  onStandardScoreChange,
  onPercentileChange,
  onGradeChange,
  standardScoreRange = { min: 1, max: 200 },
  percentileRange = { min: 1, max: 100 },
  gradeRange = { min: 1, max: 9 },
}: ScoreInputProps) {
  const [errors, setErrors] = useState<{
    standardScore?: string;
    percentile?: string;
    grade?: string;
  }>({});

  const validateNumber = (
    value: string,
    range: { min: number; max: number },
    fieldName: string
  ): string | undefined => {
    if (!value) return undefined;

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      return '숫자만 입력 가능합니다';
    }
    if (num < range.min || num > range.max) {
      return `${range.min}~${range.max} 사이 값을 입력하세요`;
    }
    return undefined;
  };

  const handleStandardScoreChange = (value: string) => {
    // 숫자만 입력 허용
    const numericValue = value.replace(/[^0-9]/g, '');
    onStandardScoreChange(numericValue);

    const error = validateNumber(numericValue, standardScoreRange, '표준점수');
    setErrors((prev) => ({ ...prev, standardScore: error }));
  };

  const handlePercentileChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    onPercentileChange(numericValue);

    const error = validateNumber(numericValue, percentileRange, '백분위');
    setErrors((prev) => ({ ...prev, percentile: error }));
  };

  const handleGradeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    onGradeChange(numericValue);

    const error = validateNumber(numericValue, gradeRange, '등급');
    setErrors((prev) => ({ ...prev, grade: error }));
  };

  return (
    <div className="p-5 bg-card border border-border rounded-xl space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{subjectName}</h3>

      <div className="flex gap-3">
        {/* 표준점수 */}
        <div className="flex-1">
          <Label htmlFor={`${subjectName}-std`} className="text-sm mb-2 block text-muted-foreground">
            표준점수
          </Label>
          <Input
            id={`${subjectName}-std`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="130"
            value={standardScore}
            onChange={(e) => handleStandardScoreChange(e.target.value)}
            className={`text-center font-mono h-12 ${
              errors.standardScore ? 'border-destructive animate-shake' : ''
            }`}
          />
          {errors.standardScore && (
            <p className="text-xs text-destructive mt-1">{errors.standardScore}</p>
          )}
        </div>

        {/* 백분위 */}
        <div className="flex-1">
          <Label htmlFor={`${subjectName}-per`} className="text-sm mb-2 block text-muted-foreground">
            백분위
          </Label>
          <Input
            id={`${subjectName}-per`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="95"
            value={percentile}
            onChange={(e) => handlePercentileChange(e.target.value)}
            className={`text-center font-mono h-12 ${
              errors.percentile ? 'border-destructive animate-shake' : ''
            }`}
          />
          {errors.percentile && (
            <p className="text-xs text-destructive mt-1">{errors.percentile}</p>
          )}
        </div>

        {/* 등급 */}
        <div className="w-20">
          <Label htmlFor={`${subjectName}-grade`} className="text-sm mb-2 block text-muted-foreground">
            등급
          </Label>
          <Input
            id={`${subjectName}-grade`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="2"
            value={grade}
            onChange={(e) => handleGradeChange(e.target.value)}
            className={`text-center font-mono h-12 ${
              errors.grade ? 'border-destructive animate-shake' : ''
            }`}
          />
          {errors.grade && (
            <p className="text-xs text-destructive mt-1">{errors.grade}</p>
          )}
        </div>
      </div>
    </div>
  );
}
