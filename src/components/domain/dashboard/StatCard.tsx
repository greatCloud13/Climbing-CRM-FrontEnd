// src/components/domain/dashboard/StatCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

/**
 * StatCard Props 인터페이스
 */
interface StatCardProps {
  /** 카드 제목 */
  title: string;
  /** 표시할 값 */
  value: number | string;
  /** Lucide 아이콘 이름 */
  icon: keyof typeof LucideIcons;
  /** 변화율 (예: 5.2 = +5.2%, -3.1 = -3.1%) */
  change?: number;
  /** 변화 방향 (자동 계산되지만 수동 지정 가능) */
  trend?: 'up' | 'down' | 'neutral';
  /** 부가 설명 */
  description?: string;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 통계 카드 컴포넌트
 * 
 * 대시보드에서 주요 지표를 표시하는 카드 컴포넌트입니다.
 * 아이콘, 값, 변화율을 함께 표시합니다.
 * 
 * @example
 * <StatCard
 *   title="총 회원 수"
 *   value={342}
 *   icon="Users"
 *   change={5.2}
 *   description="전월 대비"
 * />
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  description,
  isLoading = false,
  className = '',
}) => {
  // 아이콘 동적 로드
  const IconComponent = LucideIcons[icon] as React.FC<{ className?: string }>;

  // 변화 방향 자동 계산
  const calculatedTrend = trend || (
    change === undefined ? 'neutral' :
    change > 0 ? 'up' :
    change < 0 ? 'down' : 'neutral'
  );

  // 변화율 표시 색상
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  // 변화율 아이콘
  const TrendIcon = calculatedTrend === 'up' ? ArrowUp : 
                    calculatedTrend === 'down' ? ArrowDown : Minus;

  // 숫자 포맷팅 (천 단위 구분)
  const formatValue = (val: number | string): string => {
    if (typeof val === 'number') {
      return val.toLocaleString('ko-KR');
    }
    return val;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
          </div>
        ) : (
          <>
            {/* 메인 값 */}
            <div className="text-2xl font-bold">
              {formatValue(value)}
            </div>

            {/* 변화율 및 설명 */}
            <div className="flex items-center gap-2 mt-1">
              {change !== undefined && (
                <div className={`flex items-center text-xs font-medium ${trendColors[calculatedTrend]}`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              )}
              
              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;