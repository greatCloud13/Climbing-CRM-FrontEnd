// src/types/ticket.types.ts

/**
 * 회원권 기본 정보
 */
export interface Ticket {
  ticket_type: string;      // PK: "10회권", "30일권" 등 (한글 이름)
  count: number | null;     // 이용 횟수 (횟수권인 경우)
  duration: number | null;  // 사용 기한 (일)
  price: number;            // 가격
  description: string | null; // 설명
}

/**
 * 회원권 생성 요청 DTO
 */
export interface CreateTicketDto {
  ticket_type: string;
  count: number | null;
  duration: number | null;
  price: number;
  description?: string | null;
}

/**
 * 회원권 수정 요청 DTO
 */
export interface UpdateTicketDto {
  count?: number | null;
  duration?: number | null;
  price?: number;
  description?: string | null;
}

/**
 * 회원권 삭제 시 영향받는 정보
 */
export interface TicketDeleteInfo {
  ticket_type: string;
  affected_member_count: number; // 해당 회원권 사용 중인 회원 수
}

/**
 * 회원권 목록 조회 응답
 */
export interface TicketListResponse {
  tickets: Ticket[];
  total: number;
}