// src/components/tickets/TicketDeleteModal.tsx

import { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTicketMutations } from '@/hooks/useTicketMutations';
import type { Ticket } from '@/types/ticket.types';

interface TicketDeleteModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

/**
 * 회원권 삭제 확인 모달
 * 
 * 삭제 전 해당 회원권을 사용 중인 회원 수를 조회하고
 * 경고 메시지와 함께 삭제 확인을 받습니다.
 * 
 * 삭제 시:
 * - 해당 회원권 사용 중인 회원의 active_ticket_id → null
 * - start_date, end_date, remain_count → 초기화
 */
export const TicketDeleteModal = ({
  open,
  onClose,
  ticket,
}: TicketDeleteModalProps) => {
  const { deleteTicket, getDeleteInfo } = useTicketMutations();

  /**
   * 모달이 열릴 때 영향받는 회원 수 조회
   */
  useEffect(() => {
    if (open && ticket) {
      getDeleteInfo.mutate(ticket.ticket_type);
    }
  }, [open, ticket]);

  /**
   * 삭제 확인 핸들러
   */
  const handleConfirm = async () => {
    if (!ticket) return;

    try {
      await deleteTicket.mutateAsync(ticket.ticket_type);
      onClose();
    } catch (error) {
      console.error('회원권 삭제 실패:', error);
    }
  };

  const affectedMemberCount = getDeleteInfo.data?.affected_member_count ?? 0;
  const isLoadingDeleteInfo = getDeleteInfo.isPending;
  const isDeleting = deleteTicket.isPending;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            회원권 삭제
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              <strong className="text-foreground">{ticket?.ticket_type}</strong>{' '}
              회원권을 삭제하시겠습니까?
            </p>

            {/* 영향받는 회원 수 조회 중 */}
            {isLoadingDeleteInfo && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                영향받는 회원 수를 확인하는 중...
              </div>
            )}

            {/* 영향받는 회원이 있을 때 경고 */}
            {!isLoadingDeleteInfo && affectedMemberCount > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{affectedMemberCount}명</strong>의 회원이 이 회원권을 사용
                  중입니다.
                  <br />
                  삭제 시 해당 회원들의 회원권 정보가 초기화됩니다:
                  <ul className="mt-2 ml-4 list-disc space-y-1">
                    <li>활성 회원권: 없음으로 변경</li>
                    <li>시작일/종료일: 초기화</li>
                    <li>남은 횟수: 초기화</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* 영향받는 회원이 없을 때 */}
            {!isLoadingDeleteInfo && affectedMemberCount === 0 && (
              <p className="text-sm text-muted-foreground">
                현재 이 회원권을 사용 중인 회원이 없습니다.
              </p>
            )}

            <p className="text-sm font-semibold text-destructive">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoadingDeleteInfo || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                삭제 중...
              </>
            ) : (
              '삭제'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};