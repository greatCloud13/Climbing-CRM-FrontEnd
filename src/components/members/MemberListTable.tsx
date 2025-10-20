// ============================================
// src/components/members/MemberListTable.tsx
// 회원 목록 테이블 컴포넌트 (UI 개선)
// ============================================

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Member, MemberStatus } from '@/types/member.types';

interface MemberListTableProps {
  members: Member[];
  isLoading: boolean;
  onViewDetail: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

/**
 * 회원 상태 뱃지 렌더링
 */
const StatusBadge = ({ status }: { status: MemberStatus }) => {
  const statusConfig = {
    ACTIVE: { label: '활성', variant: 'default' as const, className: 'bg-green-600 hover:bg-green-700 text-white' },
    PAUSED: { label: '일시정지', variant: 'secondary' as const, className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
    EXPIRED: { label: '만료', variant: 'destructive' as const, className: 'bg-red-600 hover:bg-red-700 text-white' },
    WITHDRAWN: { label: '탈퇴', variant: 'outline' as const, className: 'bg-gray-500 hover:bg-gray-600 text-white' },
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

/**
 * 날짜 포맷 헬퍼
 */
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko });
  } catch {
    return '-';
  }
};

/**
 * 회원권 종료일까지 남은 일수 계산
 */
const getDaysUntilExpiry = (endDate?: string) => {
  if (!endDate) return null;
  const today = new Date();
  const expiry = new Date(endDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 회원 목록 테이블 컴포넌트
 */
export const MemberListTable = ({
  members,
  isLoading,
  onViewDetail,
  onEdit,
  onDelete,
}: MemberListTableProps) => {
  // 로딩 중일 때 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  // 데이터가 없을 때
  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground text-lg font-medium">등록된 회원이 없습니다.</p>
        <p className="text-muted-foreground text-sm mt-2">
          새 회원을 등록해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[70px] font-bold text-foreground px-6">ID</TableHead>
              <TableHead className="font-bold text-foreground px-6 min-w-[140px]">이름</TableHead>
              <TableHead className="font-bold text-foreground px-6 min-w-[130px]">연락처</TableHead>
              <TableHead className="hidden md:table-cell font-bold text-foreground px-6 min-w-[100px]">지점</TableHead>
              <TableHead className="font-bold text-foreground px-6 min-w-[180px]">회원권</TableHead>
              <TableHead className="hidden lg:table-cell font-bold text-foreground px-6 min-w-[130px]">종료일</TableHead>
              <TableHead className="hidden lg:table-cell font-bold text-foreground px-6 min-w-[100px]">남은횟수</TableHead>
              <TableHead className="hidden xl:table-cell font-bold text-foreground px-6 min-w-[140px]">최근출석</TableHead>
              <TableHead className="font-bold text-foreground px-6 min-w-[100px]">상태</TableHead>
              <TableHead className="w-[140px] text-right font-bold text-foreground px-6">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const daysUntilExpiry = getDaysUntilExpiry(member.end_date);
              const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;

              return (
                <TableRow 
                  key={member.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors border-b"
                  onClick={() => onViewDetail(member)}
                >
                  <TableCell className="font-semibold px-6 py-4">{member.id}</TableCell>
                  
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-base">{member.username}</p>
                      {member.email && (
                        <p className="text-xs text-muted-foreground mt-0.5">{member.email}</p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-6 py-4 font-medium">{member.phone}</TableCell>
                  
                  <TableCell className="hidden md:table-cell px-6 py-4">
                    <span className="font-medium">{member.region_name || '-'}</span>
                  </TableCell>
                  
                  <TableCell className="px-6 py-4">
                    <div className="text-sm">
                      {member.ticket_type ? (
                        <span className="font-medium">{member.ticket_type}</span>
                      ) : (
                        <span className="text-muted-foreground">미등록</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden lg:table-cell px-6 py-4">
                    {member.end_date ? (
                      <div>
                        <p className={`font-medium ${isExpiringSoon ? 'text-orange-600' : ''}`}>
                          {formatDate(member.end_date)}
                        </p>
                        {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                          <p className={`text-xs mt-0.5 ${isExpiringSoon ? 'text-orange-600 font-semibold' : 'text-muted-foreground'}`}>
                            D-{daysUntilExpiry}
                          </p>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  
                  <TableCell className="hidden lg:table-cell px-6 py-4">
                    {member.remain_count !== undefined ? (
                      <span className={`font-semibold ${member.remain_count <= 3 ? 'text-orange-600 text-base' : ''}`}>
                        {member.remain_count}회
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  
                  <TableCell className="hidden xl:table-cell px-6 py-4">
                    <div className="text-sm">
                      {member.last_attendance ? (
                        <>
                          <p className="font-medium">{formatDate(member.last_attendance)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            총 {member.attendance}회
                          </p>
                        </>
                      ) : (
                        <span className="text-muted-foreground">출석 없음</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-6 py-4">
                    <StatusBadge status={member.status} />
                  </TableCell>
                  
                  <TableCell className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetail(member);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(member);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(member);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};