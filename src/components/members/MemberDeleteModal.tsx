// ============================================
// src/components/members/MemberDeleteModal.tsx
// 회원 삭제 확인 모달
// ============================================

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
import { Loader2, AlertTriangle } from 'lucide-react';
import { useDeleteMember } from '@/hooks/useMemberMutations';
import type { Member } from '@/types/member.types';

interface MemberDeleteModalProps {
  open: boolean;
  onClose: () => void;
  member: Member | null;
  onSuccess?: () => void;
}

/**
 * 회원 삭제 확인 모달
 */
export const MemberDeleteModal = ({
  open,
  onClose,
  member,
  onSuccess,
}: MemberDeleteModalProps) => {
  const { mutate: deleteMember, isPending } = useDeleteMember();

  const handleDelete = () => {
    if (!member) return;

    deleteMember(member.id, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        console.error('회원 삭제 실패:', error);
        alert('회원 삭제에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl">회원 삭제</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-3">
            <p>
              <span className="font-semibold text-foreground">{member?.username}</span>
              님의 정보를 삭제하시겠습니까?
            </p>
            <p className="text-destructive font-medium">
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-4 p-3 rounded-md bg-muted">
              <p className="text-sm text-muted-foreground">삭제될 정보:</p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• 회원 기본 정보</li>
                <li>• 회원권 이용 이력</li>
                <li>• 출석 기록</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};