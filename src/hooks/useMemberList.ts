// ============================================
// src/hooks/useMemberList.ts
// 회원 목록 조회 Custom Hook
// ============================================

import { useQuery } from '@tanstack/react-query';
import { getMemberList } from '@/api/services/member.service';
import { queryKeys } from '@/api/queryKeys';
import type { MemberListParams } from '@/types/member.types';

/**
 * 회원 목록 조회 훅
 * 
 * @param params - 검색, 필터링, 정렬, 페이지네이션 파라미터
 * @returns React Query 결과 (data, isLoading, error 등)
 * 
 * @example
 * const { data, isLoading } = useMemberList({
 *   page: 1,
 *   limit: 10,
 *   search: '김철수',
 *   status: 'ACTIVE'
 * });
 */
export const useMemberList = (params?: MemberListParams) => {
  return useQuery({
    queryKey: queryKeys.member.list(params),
    queryFn: () => getMemberList(params),
    // 데이터가 5분간 fresh 상태 유지
    staleTime: 5 * 60 * 1000,
    // 에러 발생 시 재시도 1회
    retry: 1,
  });
};

/**
 * 회원 상세 조회 훅
 * 
 * @param id - 회원 ID
 * @param enabled - 쿼리 활성화 여부 (기본: true)
 * @returns React Query 결과
 * 
 * @example
 * const { data: member } = useMemberDetail(1);
 */
export const useMemberDetail = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.member.detail(id),
    queryFn: () => import('@/api/services/member.service').then(m => m.getMemberDetail(id)),
    enabled: enabled && !!id,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * 회원 이력 조회 훅
 * 
 * @param id - 회원 ID
 * @param enabled - 쿼리 활성화 여부 (기본: true)
 * @returns React Query 결과
 * 
 * @example
 * const { data: history } = useMemberHistory(1);
 */
export const useMemberHistory = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.member.history(id),
    queryFn: () => import('@/api/services/member.service').then(m => m.getMemberHistory(id)),
    enabled: enabled && !!id,
    staleTime: 3 * 60 * 1000,
  });
};