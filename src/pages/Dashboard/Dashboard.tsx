// src/pages/Dashboard/Dashboard.tsx

import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/domain/dashboard/StatCard';
import { AttendanceChart } from '@/components/domain/dashboard/AttendanceChart';
import { ExpiringMembershipsTable } from '@/components/domain/dashboard/ExpiringMembershipsTable';
import { RecentActivityList } from '@/components/domain/dashboard/RecentActivityList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

/**
 * 대시보드 메인 페이지 컴포넌트
 */
export const Dashboard: React.FC = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard();

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            데이터를 불러오는 중 오류가 발생했습니다.
            <br />
            {error?.message || '알 수 없는 오류가 발생했습니다.'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            클라이밍 센터 주요 현황
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* 메인 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 왼쪽 영역: 통계 카드들 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 오늘의 출석 */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              title="총 출석"
              value={data?.todayAttendance.total ?? 0}
              icon="Users"
              description="오늘"
              isLoading={isLoading}
            />
            <StatCard
              title="신규 회원"
              value={data?.todayAttendance.newMembers ?? 0}
              icon="UserPlus"
              description="첫 방문"
              isLoading={isLoading}
            />
            <StatCard
              title="체크인"
              value={data?.todayAttendance.checkIns ?? 0}
              icon="CheckCircle"
              description="누적"
              isLoading={isLoading}
            />
          </div>

          {/* 이번 달 통계 */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard
              title="신규"
              value={data?.monthlyStats.newMembers ?? 0}
              icon="UserCheck"
              description="이달"
              isLoading={isLoading}
            />
            <StatCard
              title="전체"
              value={data?.monthlyStats.totalMembers ?? 0}
              icon="Users"
              description="총 회원"
              isLoading={isLoading}
            />
            <StatCard
              title="활성"
              value={data?.monthlyStats.activeMembers ?? 0}
              icon="Activity"
              description="30일"
              isLoading={isLoading}
            />
            <StatCard
              title="매출"
              value={`${((data?.monthlyStats.revenue ?? 0) / 10000).toFixed(0)}만`}
              icon="TrendingUp"
              description="이달"
              isLoading={isLoading}
            />
          </div>

          {/* 출석 추이 차트 */}
          <AttendanceChart
            data={data?.attendanceTrend ?? []}
            title="최근 7일 출석 추이"
            isLoading={isLoading}
            height={280}
          />

          {/* 만료 예정 회원 테이블 */}
          <ExpiringMembershipsTable
            data={data?.expiringMemberships.list ?? []}
            maxRows={6}
            isLoading={isLoading}
          />
        </div>

        {/* 오른쪽 영역: 알림 & 활동 */}
        <div className="space-y-4">
          {/* 만료 알림 */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              회원권 만료 알림
            </h3>
            <div className="space-y-2">
              <StatCard
                title="7일 이내"
                value={data?.expiringMemberships.within7Days ?? 0}
                icon="Clock"
                description="일주일"
                isLoading={isLoading}
              />
              <StatCard
                title="3일 이내"
                value={data?.expiringMemberships.within3Days ?? 0}
                icon="AlertTriangle"
                description="긴급"
                isLoading={isLoading}
              />
              <StatCard
                title="1일 이내"
                value={data?.expiringMemberships.within1Day ?? 0}
                icon="AlertCircle"
                description="즉시"
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* 최근 활동 */}
          <RecentActivityList
            data={data?.recentActivities ?? []}
            maxItems={10}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;