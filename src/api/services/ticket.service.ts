// src/api/services/ticket.service.ts

import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { 
  Ticket, 
  CreateTicketDto, 
  UpdateTicketDto,
  TicketDeleteInfo,
  TicketListResponse 
} from '@/types/ticket.types';

// API 응답 공통 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error: string | null;
}

/**
 * Mock 데이터
 */
const MOCK_TICKETS: Ticket[] = [
  {
    ticket_type: '10회권',
    count: 10,
    duration: 90,
    price: 150000,
    description: '3개월 내 10회 이용 가능한 회원권입니다.',
  },
  {
    ticket_type: '20회권',
    count: 20,
    duration: 180,
    price: 280000,
    description: '6개월 내 20회 이용 가능한 회원권입니다.',
  },
  {
    ticket_type: '30일 자유이용권',
    count: null,
    duration: 30,
    price: 200000,
    description: '30일 동안 무제한으로 이용 가능한 회원권입니다.',
  },
  {
    ticket_type: '90일 자유이용권',
    count: null,
    duration: 90,
    price: 500000,
    description: '90일 동안 무제한으로 이용 가능한 회원권입니다.',
  },
  {
    ticket_type: '1일 체험권',
    count: 1,
    duration: 1,
    price: 20000,
    description: '첫 방문 회원을 위한 1일 체험 회원권입니다.',
  },
];

/**
 * 회원권 목록 조회
 */
export const getTicketList = async (): Promise<Ticket[]> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    // Mock 딜레이
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_TICKETS;
  }

  const response = await apiClient.get<ApiResponse<TicketListResponse>>(
    ENDPOINTS.TICKET.LIST
  );
  return response.data.data.tickets;
};

/**
 * 회원권 상세 조회
 */
export const getTicketDetail = async (ticketType: string): Promise<Ticket> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 200));
    const ticket = MOCK_TICKETS.find(t => t.ticket_type === ticketType);
    if (!ticket) {
      throw new Error('회원권을 찾을 수 없습니다.');
    }
    return ticket;
  }

  const response = await apiClient.get<ApiResponse<Ticket>>(
    ENDPOINTS.TICKET.DETAIL(ticketType)
  );
  return response.data.data;
};

/**
 * 회원권 생성
 */
export const createTicket = async (data: CreateTicketDto): Promise<Ticket> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 중복 체크
    if (MOCK_TICKETS.some(t => t.ticket_type === data.ticket_type)) {
      throw new Error('이미 존재하는 회원권 이름입니다.');
    }

    const newTicket: Ticket = {
      ticket_type: data.ticket_type,
      count: data.count,
      duration: data.duration,
      price: data.price,
      description: data.description || null,
    };

    MOCK_TICKETS.push(newTicket);
    return newTicket;
  }

  const response = await apiClient.post<ApiResponse<Ticket>>(
    ENDPOINTS.TICKET.CREATE,
    data
  );
  return response.data.data;
};

/**
 * 회원권 수정
 */
export const updateTicket = async (
  ticketType: string,
  data: UpdateTicketDto
): Promise<Ticket> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = MOCK_TICKETS.findIndex(t => t.ticket_type === ticketType);
    if (index === -1) {
      throw new Error('회원권을 찾을 수 없습니다.');
    }

    MOCK_TICKETS[index] = {
      ...MOCK_TICKETS[index],
      ...data,
    };

    return MOCK_TICKETS[index];
  }

  const response = await apiClient.put<ApiResponse<Ticket>>(
    ENDPOINTS.TICKET.UPDATE(ticketType),
    data
  );
  return response.data.data;
};

/**
 * 회원권 삭제
 */
export const deleteTicket = async (ticketType: string): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = MOCK_TICKETS.findIndex(t => t.ticket_type === ticketType);
    if (index === -1) {
      throw new Error('회원권을 찾을 수 없습니다.');
    }

    MOCK_TICKETS.splice(index, 1);
    return;
  }

  await apiClient.delete(ENDPOINTS.TICKET.DELETE(ticketType));
};

/**
 * 회원권 삭제 전 영향받는 회원 수 조회
 */
export const getTicketDeleteInfo = async (
  ticketType: string
): Promise<TicketDeleteInfo> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock: 랜덤하게 0~5명의 회원이 사용 중이라고 가정
    const affectedCount = Math.floor(Math.random() * 6);
    
    return {
      ticket_type: ticketType,
      affected_member_count: affectedCount,
    };
  }

  const response = await apiClient.get<ApiResponse<TicketDeleteInfo>>(
    ENDPOINTS.TICKET.DELETE_INFO(ticketType)
  );
  return response.data.data;
};