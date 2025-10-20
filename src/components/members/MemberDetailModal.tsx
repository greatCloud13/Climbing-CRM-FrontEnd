// ============================================
// src/components/members/MemberDetailModal.tsx
// 회원 상세 조회 모달
// ============================================

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Edit, Calendar, Phone, Mail, MapPin, User, CreditCard, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMemberDetail, useMemberHistory } from '@/hooks/useMemberList';
import type { Member, MemberStatus } from '@/types/member.types';

interface MemberDetailModalProps {
  memberId: number | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (member: Member) => void;
}

/**
 * 회원 상태 뱃지
 */
const StatusBadge = ({ status }: { status: MemberStatus }) => {
  const statusConfig = {
    ACTIVE: { label: '활성', className: 'bg-green-500' },
    PAUSED: { label: '일시정지', className: 'bg-yellow-500' },
    EXPIRED: { label: '만료', className: 'bg-red-500' },
    WITHDRAWN: { label: '탈퇴', className: 'bg-gray-500' },
  };

  const config = statusConfig[status];
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

/**
 * 날짜 포맷
 */
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko });
  } catch {
    return '-';
  }
};

/**
 * 정보 행 컴포넌트
 */
const InfoRow = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: any; 
  label: string; 
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value || '-'}</p>
    </div>
  </div>
);

/**
 * 회원 상세 조회 모달
 */
export const MemberDetailModal = ({
  memberId,
  open,
  onClose,
  onEdit,
}: MemberDetailModalProps) => {
  const { data: member, isLoading } = useMemberDetail(memberId!, open && !!memberId);
  const { data: history } = useMemberHistory(memberId!, open && !!memberId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">회원 상세 정보</DialogTitle>
              <DialogDescription>
                회원의 상세 정보와 이용 이력을 확인할 수 있습니다.
              </DialogDescription>
            </div>
            {member && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(member);
                  onClose();
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : member ? (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                <StatusBadge status={member.status} />
              </div>
              <div className="space-y-1">
                <InfoRow icon={User} label="이름" value={member.username} />
                <InfoRow icon={Phone} label="연락처" value={member.phone} />
                <InfoRow icon={Mail} label="이메일" value={member.email} />
                <InfoRow icon={MapPin} label="지점" value={member.region_name} />
                {member.birth_date && (
                  <InfoRow icon={Calendar} label="생년월일" value={formatDate(member.birth_date)} />
                )}
                {member.gender && (
                  <InfoRow 
                    icon={User} 
                    label="성별" 
                    value={member.gender === 'M' ? '남성' : member.gender === 'F' ? '여성' : '기타'} 
                  />
                )}
                {member.emergency_contact && (
                  <InfoRow icon={Phone} label="비상연락처" value={member.emergency_contact} />
                )}
              </div>
            </div>

            <Separator />

            {/* 회원권 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                회원권 정보
              </h3>
              {member.ticket_type ? (
                <div className="space-y-1">
                  <InfoRow icon={CreditCard} label="회원권 종류" value={member.ticket_type} />
                  <InfoRow icon={Calendar} label="시작일" value={formatDate(member.start_date)} />
                  <InfoRow icon={Calendar} label="종료일" value={formatDate(member.end_date)} />
                  {member.remain_count !== undefined && (
                    <InfoRow 
                      icon={Activity} 
                      label="남은 횟수" 
                      value={
                        <span className={member.remain_count <= 3 ? 'text-orange-600' : ''}>
                          {member.remain_count}회
                        </span>
                      } 
                    />
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">등록된 회원권이 없습니다.</p>
              )}
            </div>

            <Separator />

            {/* 출석 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                출석 정보
              </h3>
              <div className="space-y-1">
                <InfoRow icon={Activity} label="총 출석 횟수" value={`${member.attendance}회`} />
                <InfoRow icon={Calendar} label="최근 출석일" value={formatDate(member.last_attendance)} />
              </div>
            </div>

            {/* 회원권 이력 */}
            {history && history.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">회원권 이용 이력</h3>
                  <div className="space-y-3">
                    {history.map((record) => (
                      <div 
                        key={record.id} 
                        className="p-3 rounded-lg border bg-muted/50"
                      >
                        <p className="font-medium">{record.ticket_type}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(record.start_date)} ~ {formatDate(record.end_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 메모 */}
            {member.memo && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">메모</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {member.memo}
                  </p>
                </div>
              </>
            )}

            {/* 메타 정보 */}
            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>가입일: {formatDate(member.created_at)}</p>
              <p>최종 수정: {formatDate(member.updated_at)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">회원 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};