// src/components/domain/dashboard/BranchOverviewCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, CheckCircle, TrendingUp } from 'lucide-react';

/**
 * 지점 개요 데이터 인터페이스
 */
interface BranchOverview {
  branchId: string;
  branchName: string;
  activeMembers: number;
  todayAttendance: number;
  revenue: number;
}

/**
 * BranchOverviewCard Props 인터페이스
 */
interface BranchOverviewCardProps {
  /** 지점 개요 데이터 */
  data: BranchOverview;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 클릭 이벤트 */
  onClick?: (branchId: string) => void;
  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 지점 현황 카드 컴포넌트
 * 
 * 향후 본부 기능 확장을 위한 지점별 현황 표시 컴포넌트입니다.
 * 현재는 지점장만 사용하지만, 추후 본부에서 여러 지점을 관리할 때 사용됩니다.
 * 
 * @example
 * <BranchOverviewCard
 *   data={branchData}
 *   onClick={(id) => navigate(`/branch/${id}`)}
 * />
 */
export const BranchOverviewCard: React.FC<BranchOverviewCardProps> = ({
  data,
  isLoading = false,
  onClick,
  className = '',
}) => {
  // 금액 포맷팅 (억, 만원 단위)
  const formatRevenue = (amount: number): string => {
    if (amount >= 100_000_000) {
      const eok = Math.floor(amount / 100_000_000);
      const man = Math.floor((amount % 100_000_000) / 10_000);
      return man > 0 ? `${eok}억 ${man}만원` : `${eok}억원`;
    } else if (amount >= 10_000) {
      return `${Math.floor(amount / 10_000)}만원`;
    } else {
      return `${amount.toLocaleString()}원`;
    }
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={() => onClick && onClick(data.branchId)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {data.branchName}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* 활성 회원 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>활성 회원</span>
              </div>
              <span className="text-sm font-semibold">
                {data.activeMembers.toLocaleString()}명
              </span>
            </div>

            {/* 오늘 출석 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>오늘 출석</span>
              </div>
              <span className="text-sm font-semibold">
                {data.todayAttendance.toLocaleString()}명
              </span>
            </div>

            {/* 이번 달 매출 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>이번 달 매출</span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {formatRevenue(data.revenue)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BranchOverviewCard;