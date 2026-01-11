/**
 * ResultCard - 대학별 결과 카드
 *
 * 기능:
 * - 순위 배지 (1~3등 특별 표시)
 * - 대학명/학과명 표시
 * - 총점 크게 표시
 * - 점수 breakdown (수능/실기)
 */

import { Card } from '@/components/ui/card';
import { UniversityResult } from '@/lib/store/result-store';

interface ResultCardProps {
  result: UniversityResult;
}

// 순위별 배지 스타일
const getRankBadgeStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        icon: '🥇',
      };
    case 2:
      return {
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-700 dark:text-gray-400',
        icon: '🥈',
      };
    case 3:
      return {
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-700 dark:text-orange-400',
        icon: '🥉',
      };
    default:
      return {
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        icon: null,
      };
  }
};

// 군 표시
const getGroupLabel = (group: 'ga' | 'na' | 'da') => {
  switch (group) {
    case 'ga':
      return '가군';
    case 'na':
      return '나군';
    case 'da':
      return '다군';
  }
};

export function ResultCard({ result }: ResultCardProps) {
  const rankStyle = getRankBadgeStyle(result.rank || 0);
  const groupLabel = getGroupLabel(result.group);

  return (
    <Card className="p-5 border-2">
      {/* 헤더: 순위 + 대학명 */}
      <div className="flex items-center gap-2 mb-3">
        {/* 순위 배지 */}
        {result.rank && result.rank <= 3 && (
          <span
            className={`
              inline-flex items-center gap-1
              px-2 py-1
              text-sm font-semibold
              rounded-md
              ${rankStyle.bgColor} ${rankStyle.textColor}
            `}
          >
            {rankStyle.icon} {result.rank}등
          </span>
        )}

        {/* 군 배지 */}
        <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
          {groupLabel}
        </span>
      </div>

      {/* 대학명 + 학과명 */}
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {result.universityName}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">{result.departmentName}</p>

      {/* 총점 */}
      <div className="font-mono text-3xl font-semibold mb-4">
        {result.totalScore.toFixed(1)}
        <span className="text-base text-muted-foreground ml-1">
          / {result.maxScore}
        </span>
      </div>

      {/* 점수 breakdown */}
      <div className="flex flex-col gap-2 p-4 bg-muted rounded-lg">
        {/* 수능 */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            수능 ({result.breakdown.suneung.ratio}%)
          </span>
          <span className="font-mono font-medium">
            {result.breakdown.suneung.score.toFixed(1)} / {result.breakdown.suneung.max}
          </span>
        </div>

        {/* 실기 */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            실기 ({result.breakdown.silgi.ratio}%)
          </span>
          <span className="font-mono font-medium">
            {result.breakdown.silgi.score.toFixed(1)} / {result.breakdown.silgi.max}
          </span>
        </div>
      </div>
    </Card>
  );
}
