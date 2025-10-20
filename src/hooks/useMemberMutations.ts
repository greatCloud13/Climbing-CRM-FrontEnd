// ============================================
// src/hooks/useMemberMutations.ts
// 회원 CRUD Mutation Custom Hook
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createMember, 
  updateMember, 
  deleteMember 
} from '@/api/services/member.service';
import { queryKeys } from '@/api/queryKeys';
import type { CreateMemberDto, UpdateMemberDto } from '@/types/member.types';

/**
 * 회원 등록 Mutation 훅
 * 
 * @returns useMutation 결과 (mutate, isLoading, error 등)
 * 
 * @example
 * const { mutate: createMemberMutate, isPending } = useCreateMember();
 * 
 * createMemberMutate(
 *   { username: '김철수', phone: '010-1234-5678', ... },
 *   {
 *     onSuccess: (data) => console.log('등록 성공', data),
 *     onError: (error) => console.error('등록 실패', error),
 *   }
 * );
 */
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberDto) => createMember(data),
    onSuccess: () => {
      // 회원 목록 캐시 무효화 (모든 필터/페이지)
      queryClient.invalidateQueries({
        queryKey: queryKeys.member.lists(),
      });
    },
  });
};

/**
 * 회원 수정 Mutation 훅
 * 
 * @returns useMutation 결과
 * 
 * @example
 * const { mutate: updateMemberMutate } = useUpdateMember();
 * 
 * updateMemberMutate(
 *   { id: 1, username: '김철수_수정', ... },
 *   {
 *     onSuccess: () => alert('수정 완료'),
 *   }
 * );
 */
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMemberDto) => updateMember(data),
    onSuccess: (_, variables) => {
      // 해당 회원 상세 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.member.detail(variables.id),
      });
      // 회원 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.member.lists(),
      });
    },
  });
};

/**
 * 회원 삭제 Mutation 훅
 * 
 * @returns useMutation 결과
 * 
 * @example
 * const { mutate: deleteMemberMutate } = useDeleteMember();
 * 
 * deleteMemberMutate(1, {
 *   onSuccess: () => alert('삭제 완료'),
 * });
 */
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMember(id),
    onSuccess: (_, id) => {
      // 해당 회원 관련 모든 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.member.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.member.history(id),
      });
      // 회원 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.member.lists(),
      });
    },
  });
};