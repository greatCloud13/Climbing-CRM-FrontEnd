// src/hooks/useTicketList.ts

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getTicketList } from '@/api/services/ticket.service';

/**
 * 회원권 목록 조회 Hook
 * 
 * 회원권 종류 목록을 조회합니다.
 * 필터링/검색 기능 없이 전체 목록만 조회합니다.
 */
export const useTicketList = () => {
  const {
    data: tickets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.ticket.list(),
    queryFn: getTicketList,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });

  return {
    tickets,
    isLoading,
    isError,
    error,
    refetch,
  };
};