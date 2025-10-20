// src/components/domain/dashboard/ExpiringMembershipsTable.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AlertCircle, Clock } from 'lucide-react';
import type { ExpiringMember, MembershipType } from '@/types/dashboard.types';

/**
 * ExpiringMembershipsTable Props 인터페이스
 */
interface ExpiringMembershipsTableProps {
  /** 만료 예정 회원 목록 */
  data: ExpiringMember[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 표시할 최대 행 수 */
  maxRows?: number;
  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 만료 예정 회원권 테이블 컴포넌트
 * 
 * 회원권 만료가 임박한 회원 목록을 테이블로 표시합니다.
 * 남은 일수에 따라 경고 수준을 다르게 표시합니다.
 * 
 * @example
 * <ExpiringMembershipsTable
 *   data={expiringMembers}
 *   maxRows={10}
 *   isLoading={false}
 * />
 */
export const ExpiringMembershipsTable: React.FC<ExpiringMembershipsTableProps> = ({
  data,
  isLoading = false,
  maxRows = 8,
  className = '',
}) => {
  // 회원권 타입 한글 변환
  const getMembershipTypeLabel = (type: MembershipType): string => {
    const labels: Record<MembershipType, string> = {
      period: '기간권',
      count: '횟수권',
      custom: '커스텀',
    };
    return labels[type];
  };

  // 남은 일수에 따른 경고 배지 스타일
  const getDaysRemainingBadge = (days: number) => {
    if (days <= 1) {
      return { variant: 'destructive' as const, icon: AlertCircle };
    } else if (days <= 3) {
      return { variant: 'default' as const, icon: AlertCircle };
    } else {
      return { variant: 'secondary' as const, icon: Clock };
    }
  };

  // 표시할 데이터 제한
  const displayData = data.slice(0, maxRows);

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          회원권 만료 임박
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ) : data.length === 0 ? (
          // 데이터 없음
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>만료 예정인 회원권이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 테이블 */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">회원명</TableHead>
                    <TableHead className="w-[100px] hidden sm:table-cell">회원권 종류</TableHead>
                    <TableHead className="w-[120px] hidden md:table-cell">만료일</TableHead>
                    <TableHead className="text-right">남은 기간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((member) => {
                    const badgeInfo = getDaysRemainingBadge(member.daysRemaining);
                    const BadgeIcon = badgeInfo.icon;

                    return (
                      <TableRow key={member.id} className="hover:bg-muted/50">
                        {/* 회원명 */}
                        <TableCell className="font-medium">
                          {member.memberName}
                          {member.phone && (
                            <div className="text-xs text-muted-foreground mt-1 sm:hidden">
                              {member.phone}
                            </div>
                          )}
                        </TableCell>

                        {/* 회원권 종류 (모바일에서 숨김) */}
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">
                            {getMembershipTypeLabel(member.membershipType)}
                          </Badge>
                        </TableCell>

                        {/* 만료일 (태블릿 이하에서 숨김) */}
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {format(parseISO(member.expiryDate), 'yyyy.MM.dd (EEE)', { locale: ko })}
                        </TableCell>

                        {/* 남은 기간 */}
                        <TableCell className="text-right">
                          <Badge variant={badgeInfo.variant} className="gap-1">
                            <BadgeIcon className="h-3 w-3" />
                            <span>
                              {member.daysRemaining === 0 
                                ? '오늘' 
                                : `${member.daysRemaining}일`}
                            </span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* 더보기 안내 */}
            {data.length > maxRows && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  외 {data.length - maxRows}명의 회원권이 곧 만료됩니다.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringMembershipsTable;