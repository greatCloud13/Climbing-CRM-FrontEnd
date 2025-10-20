// src/components/domain/dashboard/RecentActivityList.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  CheckCircle, 
  CreditCard, 
  XCircle, 
  UserPlus, 
  Activity 
} from 'lucide-react';
import type { RecentActivity, ActivityType } from '@/types/dashboard.types';

/**
 * RecentActivityList Props 인터페이스
 */
interface RecentActivityListProps {
  /** 최근 활동 목록 */
  data: RecentActivity[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 표시할 최대 항목 수 */
  maxItems?: number;
  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 활동 타입별 설정
 */
interface ActivityConfig {
  icon: React.FC<{ className?: string }>;
  label: string;
  color: string;
  bgColor: string;
}

/**
 * 최근 활동 목록 컴포넌트
 * 
 * 회원의 최근 활동(체크인, 회원권 발급 등)을 타임라인 형태로 표시합니다.
 * 
 * @example
 * <RecentActivityList
 *   data={recentActivities}
 *   maxItems={10}
 *   isLoading={false}
 * />
 */
export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  data,
  isLoading = false,
  maxItems = 8,
  className = '',
}) => {
  // 활동 타입별 아이콘 및 스타일 설정
  const getActivityConfig = (type: ActivityType): ActivityConfig => {
    const configs: Record<ActivityType, ActivityConfig> = {
      'check-in': {
        icon: CheckCircle,
        label: '출석',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
      },
      'membership-issued': {
        icon: CreditCard,
        label: '회원권 발급',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      },
      'membership-expired': {
        icon: XCircle,
        label: '회원권 만료',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
      },
      'new-member': {
        icon: UserPlus,
        label: '신규 가입',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      },
    };
    return configs[type];
  };

  // 표시할 데이터 제한
  const displayData = data.slice(0, maxItems);

  // 상대 시간 포맷팅
  const formatRelativeTime = (timestamp: string): string => {
    try {
      return formatDistanceToNow(parseISO(timestamp), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return '방금 전';
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          최근 활동
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          // 데이터 없음
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>최근 활동이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.map((activity, index) => {
              const config = getActivityConfig(activity.type);
              const Icon = config.icon;
              const isLast = index === displayData.length - 1;

              return (
                <div key={activity.id} className="relative flex items-start gap-3">
                  {/* 타임라인 선 */}
                  {!isLast && (
                    <div className="absolute left-5 top-10 w-px h-full bg-gray-200 dark:bg-gray-700" />
                  )}

                  {/* 아이콘 */}
                  <div className={`relative z-10 flex-shrink-0 h-10 w-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">
                            {activity.memberName}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.details}
                        </p>
                      </div>
                      
                      {/* 시간 */}
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 더보기 안내 */}
        {!isLoading && data.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-muted-foreground">
              외 {data.length - maxItems}개의 활동이 더 있습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;