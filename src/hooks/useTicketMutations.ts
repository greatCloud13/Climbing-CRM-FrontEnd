// src/hooks/useTicketMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import {
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketDeleteInfo,
} from '@/api/services/ticket.service';
import type { CreateTicketDto, UpdateTicketDto } from '@/types/ticket.types';

/**
 * 회원권 생성/수정/삭제 Mutations Hook
 * 
 * 회원권 종류의 CRUD 작업을 처리합니다.
 */
export const useTicketMutations = () => {
  const queryClient = useQueryClient();

  /**
   * 회원권 생성
   */
  const createMutation = useMutation({
    mutationFn: (data: CreateTicketDto) => createTicket(data),
    onSuccess: () => {
      // 목록 쿼리 무효화하여 재조회
      queryClient.invalidateQueries({ queryKey: queryKeys.ticket.lists() });
    },
  });

  /**
   * 회원권 수정
   */
  const updateMutation = useMutation({
    mutationFn: ({ ticketType, data }: { ticketType: string; data: UpdateTicketDto }) =>
      updateTicket(ticketType, data),
    onSuccess: (_, variables) => {
      // 해당 회원권 상세 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.ticket.detail(variables.ticketType) 
      });
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.ticket.lists() });
    },
  });

  /**
   * 회원권 삭제
   */
  const deleteMutation = useMutation({
    mutationFn: (ticketType: string) => deleteTicket(ticketType),
    onSuccess: () => {
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.ticket.lists() });
      // 회원 목록도 무효화 (active_ticket_id가 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: queryKeys.member.lists() });
    },
  });

  /**
   * 회원권 삭제 정보 조회 (삭제 전 영향받는 회원 수 확인)
   */
  const deleteInfoMutation = useMutation({
    mutationFn: (ticketType: string) => getTicketDeleteInfo(ticketType),
  });

  return {
    createTicket: createMutation,
    updateTicket: updateMutation,
    deleteTicket: deleteMutation,
    getDeleteInfo: deleteInfoMutation,
  };
};