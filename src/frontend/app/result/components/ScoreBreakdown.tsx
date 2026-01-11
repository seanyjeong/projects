/**
 * ScoreBreakdown - 점수 상세 breakdown
 *
 * 기능:
 * - 수능 과목별 점수 표시
 * - 실기 종목별 기록 및 점수 표시
 * - 펼치기/접기 기능
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { UniversityResult } from '@/lib/store/result-store';

interface ScoreBreakdownProps {
  result: UniversityResult;
}

export function ScoreBreakdown({ result }: ScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails = result.details && (result.details.suneung || result.details.silgi);

  if (!hasDetails) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* 헤더 (클릭 가능) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="
          w-full px-4 py-3
          flex items-center justify-between
          bg-muted hover:bg-muted/80
          transition-colors
        "
      >
        <span className="text-sm font-medium text-foreground">상세 점수 보기</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* 상세 내용 */}
      {isExpanded && (
        <div className="p-4 bg-card space-y-4">
          {/* 수능 상세 */}
          {result.details?.suneung && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">수능 점수</h4>
              <div className="space-y-1.5 text-sm">
                {result.details.suneung.korean !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">국어</span>
                    <span className="font-mono">{result.details.suneung.korean.toFixed(1)}</span>
                  </div>
                )}
                {result.details.suneung.math !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">수학</span>
                    <span className="font-mono">{result.details.suneung.math.toFixed(1)}</span>
                  </div>
                )}
                {result.details.suneung.english !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">영어</span>
                    <span className="font-mono">{result.details.suneung.english.toFixed(1)}</span>
                  </div>
                )}
                {result.details.suneung.inquiry !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">탐구</span>
                    <span className="font-mono">{result.details.suneung.inquiry.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 실기 상세 */}
          {result.details?.silgi && result.details.silgi.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">실기 기록</h4>
              <div className="space-y-1.5 text-sm">
                {result.details.silgi.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{item.eventName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.record}
                      </span>
                      <span className="font-mono font-medium">{item.score.toFixed(1)}점</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
