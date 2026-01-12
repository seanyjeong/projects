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
import { School, CheckCircle2 } from 'lucide-react';

interface UniversitySectionProps {
  university: UniversityRecords;
  index: number;
  onEventChange: (eventKey: string, value: string) => void;
}

const GROUP_LABELS: Record<string, string> = {
  ga: '가군',
  na: '나군',
  da: '다군',
};

const GROUP_COLORS: Record<string, string> = {
  ga: 'bg-blue-50 text-blue-600 border-blue-100',
  na: 'bg-purple-50 text-purple-600 border-purple-100',
  da: 'bg-orange-50 text-orange-600 border-orange-100',
};

export function UniversitySection({ university, index, onEventChange }: UniversitySectionProps) {
  // 입력 완료 여부 확인
  const completedCount = university.events.filter((e) => e.value.trim() !== '').length;
  const totalCount = university.events.length;
  const isCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <div className={`
      bg-white border-2 rounded-2xl overflow-hidden transition-all duration-200
      ${isCompleted ? 'border-emerald-200' : 'border-gray-100'}
    `}>
      {/* 대학 헤더 */}
      <div className={`
        px-5 py-4 flex items-center justify-between
        ${isCompleted ? 'bg-emerald-50' : 'bg-gray-50'}
      `}>
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${isCompleted ? 'bg-emerald-500' : 'bg-white border border-gray-200'}
          `}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-white" />
            ) : (
              <School className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{university.universityName}</h3>
              <span className={`
                px-2 py-0.5 rounded-md text-xs font-semibold border
                ${GROUP_COLORS[university.group]}
              `}>
                {GROUP_LABELS[university.group]}
              </span>
            </div>
            <p className="text-sm text-gray-500">{university.department}</p>
          </div>
        </div>

        {/* 진행 상태 */}
        <div className="text-right">
          <div className={`
            text-lg font-bold
            ${isCompleted ? 'text-emerald-600' : 'text-gray-900'}
          `}>
            {completedCount}/{totalCount}
          </div>
          <div className="text-xs text-gray-500">입력 완료</div>
        </div>
      </div>

      {/* 실기 종목 입력 */}
      <div className="p-5 space-y-4">
        {university.events.length === 0 ? (
          <p className="text-center text-gray-400 py-4">실기 종목 정보가 없습니다</p>
        ) : (
          university.events.map((event) => (
            <EventInput
              key={event.eventKey}
              event={event}
              onChange={(value) => onEventChange(event.eventKey, value)}
            />
          ))
        )}
      </div>
    </div>
  );
}
