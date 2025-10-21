// src/types/attendance.types.ts

/**
 * 출석 체크 요청 DTO
 */
export interface AttendanceCheckRequest {
  phone: string;
}

/**
 * 출석 체크 응답 데이터
 */
export interface AttendanceCheckResponse {
  memberId: number;
  memberName: string;
  phone: string;
  ticketType: string | null; // "30일권", "10회권" 등
  startDate: string | null; // ISO date string
  endDate: string | null; // ISO date string
  remainCount: number | null; // 횟수권인 경우 남은 횟수
  remainDays: number | null; // 기간권인 경우 남은 일수
  attendance: number; // 총 출석 횟수
  lastAttendance: string; // ISO date string (방금 출석한 날짜)
  message: string; // "출석이 완료되었습니다" 등
}

/**
 * 출석 체크 에러 타입
 */
export enum AttendanceErrorType {
  MEMBER_NOT_FOUND = 'MEMBER_NOT_FOUND', // 회원 없음
  NO_ACTIVE_TICKET = 'NO_ACTIVE_TICKET', // 활성 회원권 없음
  TICKET_EXPIRED = 'TICKET_EXPIRED', // 회원권 만료
  NO_REMAIN_COUNT = 'NO_REMAIN_COUNT', // 남은 횟수 없음
  ALREADY_CHECKED = 'ALREADY_CHECKED', // 이미 오늘 출석함
  NETWORK_ERROR = 'NETWORK_ERROR', // 네트워크 에러
  UNKNOWN_ERROR = 'UNKNOWN_ERROR', // 알 수 없는 에러
}

/**
 * 출석 체크 에러 메시지 매핑
 */
export const ATTENDANCE_ERROR_MESSAGES: Record<AttendanceErrorType, string> = {
  [AttendanceErrorType.MEMBER_NOT_FOUND]: '등록되지 않은 전화번호입니다.',
  [AttendanceErrorType.NO_ACTIVE_TICKET]: '활성화된 회원권이 없습니다.',
  [AttendanceErrorType.TICKET_EXPIRED]: '회원권이 만료되었습니다.',
  [AttendanceErrorType.NO_REMAIN_COUNT]: '남은 횟수가 없습니다.',
  [AttendanceErrorType.ALREADY_CHECKED]: '오늘 이미 출석하셨습니다.',
  [AttendanceErrorType.NETWORK_ERROR]: '네트워크 오류가 발생했습니다.',
  [AttendanceErrorType.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.',
};