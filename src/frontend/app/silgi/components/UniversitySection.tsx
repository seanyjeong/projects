/**
 * 대학별 실기 입력 섹션
 *
 * 기능:
 * - 대학 정보 표시
 * - 실기 종목 목록 표시
 * - 종목별 기록 입력
 */

'use client';

import { UniversityRecords } from '@/lib/store/silgi-store';
import { EventInput } from './EventInput';

interface UniversitySectionProps {
  university: UniversityRecords;
  onEventChange: (eventKey: string, value: string) => void;
}

export function UniversitySection({ university, onEventChange }: UniversitySectionProps) {
  // 군 한글 변환
  const getGroupLabel = (group: string) => {
    switch (group) {
      case 'ga':
        return '가군';
      case 'na':
        return '나군';
      case 'da':
        return '다군';
      default:
        return '';
    }
  };

  // 입력 완료 여부 확인
  const completedCount = university.events.filter((e) => e.value.trim() !== '').length;
  const totalCount = university.events.length;
  const isCompleted = completedCount === totalCount;

  return (
    <div className="p-5 bg-bg-secondary border border-border rounded-xl space-y-4">
      {/* 대학 정보 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-text-primary">
              {university.universityName}
            </h3>
            <span className="px-2 py-0.5 bg-bg-tertiary text-text-secondary text-xs font-medium rounded">
              {getGroupLabel(university.group)}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{university.department}</p>
        </div>

        {/* 진행 상태 */}
        <div className="text-right">
          <div className="text-xs text-text-tertiary mb-1">입력 진행</div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-lg font-mono font-semibold ${
                isCompleted ? 'text-accent' : 'text-text-primary'
              }`}
            >
              {completedCount}
            </span>
            <span className="text-sm text-text-tertiary">/ {totalCount}</span>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-border" />

      {/* 실기 종목 입력 */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-secondary">실기 종목</h4>

        <div className="space-y-3">
          {university.events.map((event) => (
            <EventInput
              key={event.eventKey}
              event={event}
              onChange={(value) => onEventChange(event.eventKey, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
