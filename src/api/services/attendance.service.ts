// src/api/services/attendance.service.ts

import apiClient from '../client';
import {
  AttendanceCheckRequest,
  AttendanceCheckResponse,
} from '@/types/attendance.types';

/**
 * API 응답 타입
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error: string | null;
}

/**
 * Mock 데이터 - 회원 데이터베이스 시뮬레이션
 */
const mockMembers = [
  {
    id: 1,
    name: '홍길동',
    phone: '010-1234-5678',
    ticketType: '30일권',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    remainCount: null,
    attendance: 15,
    lastAttendance: '2025-10-20',
  },
  {
    id: 2,
    name: '김철수',
    phone: '010-2345-6789',
    ticketType: '10회권',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    remainCount: 7,
    attendance: 3,
    lastAttendance: '2025-10-18',
  },
  {
    id: 3,
    name: '이영희',
    phone: '010-3456-7890',
    ticketType: null,
    startDate: null,
    endDate: null,
    remainCount: null,
    attendance: 0,
    lastAttendance: null,
  },
  {
    id: 4,
    name: '박민수',
    phone: '010-4567-8901',
    ticketType: '30일권',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    remainCount: null,
    attendance: 20,
    lastAttendance: '2025-09-30',
  },
];

/**
 * 남은 일수 계산
 */
const calculateRemainDays = (endDate: string | null): number | null => {
  if (!endDate) return null;
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

/**
 * 출석 체크 API
 * POST /api/attendance/check
 * 
 * @param request - 전화번호 포함
 * @returns 출석 결과 데이터
 */
export const checkAttendance = async (
  request: AttendanceCheckRequest
): Promise<AttendanceCheckResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    // Mock 데이터 처리
    await new Promise((resolve) => setTimeout(resolve, 800)); // 네트워크 지연 시뮬레이션

    // 전화번호 포맷 정규화 (하이픈 제거)
    const normalizedPhone = request.phone.replace(/-/g, '');
    
    // 회원 찾기
    const member = mockMembers.find(
      (m) => m.phone.replace(/-/g, '') === normalizedPhone
    );

    // 1. 회원 없음
    if (!member) {
      throw new Error('MEMBER_NOT_FOUND');
    }

    // 출석 처리 (회원권 유무와 관계없이 처리)
    const today = new Date().toISOString().split('T')[0];
    const newAttendance = member.attendance + 1;
    
    // 회원권이 있는 경우에만 횟수 차감 및 유효성 검사
    let newRemainCount = member.remainCount;
    let hasValidTicket = false;
    let ticketWarning = null;

    if (member.ticketType) {
      // 기간권 만료 확인
      if (member.endDate) {
        const remainDays = calculateRemainDays(member.endDate);
        if (remainDays !== null && remainDays <= 0) {
          ticketWarning = 'TICKET_EXPIRED';
        } else {
          hasValidTicket = true;
        }
      }

      // 횟수권 확인 및 차감
      if (member.remainCount !== null) {
        if (member.remainCount <= 0) {
          ticketWarning = 'NO_REMAIN_COUNT';
        } else {
          newRemainCount = member.remainCount - 1;
          hasValidTicket = true;
        }
      }

      // 기간권만 있고 횟수 제한이 없는 경우
      if (member.remainCount === null && !ticketWarning) {
        hasValidTicket = true;
      }
    }

    const remainDays = calculateRemainDays(member.endDate);

    // Mock 데이터 업데이트 (실제로는 서버에서 처리)
    member.attendance = newAttendance;
    if (hasValidTicket && newRemainCount !== null) {
      member.remainCount = newRemainCount;
    }
    member.lastAttendance = today;

    return {
      memberId: member.id,
      memberName: member.name,
      phone: member.phone,
      ticketType: member.ticketType,
      startDate: member.startDate,
      endDate: member.endDate,
      remainCount: newRemainCount,
      remainDays: remainDays,
      attendance: newAttendance,
      lastAttendance: today,
      message: !member.ticketType 
        ? '출석이 완료되었습니다. (활성 회원권 없음)'
        : ticketWarning === 'TICKET_EXPIRED'
        ? '출석이 완료되었습니다. (회원권 만료됨)'
        : ticketWarning === 'NO_REMAIN_COUNT'
        ? '출석이 완료되었습니다. (남은 횟수 없음)'
        : '출석이 완료되었습니다.',
    };
  }

  // 실제 API 호출
  const response = await apiClient.post<ApiResponse<AttendanceCheckResponse>>(
    '/attendance/check',
    request
  );
  return response.data.data;
};