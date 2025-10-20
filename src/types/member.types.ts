// ============================================
// src/types/member.types.ts
// 회원 관리 관련 타입 정의
// ============================================

export type MemberStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'WITHDRAWN';
export type Gender = 'M' | 'F' | 'OTHER';

/**
 * 지점 정보
 */
export interface Region {
  id: number;
  type: string;
  name: string;
  address: string;
}

/**
 * 회원권 정보
 */
export interface Ticket {
  ticket_type: string;
  count: number; // 이용권별 사용 횟수
  duration: number; // 기간 (일)
}

/**
 * 회원 정보
 */
export interface Member {
  id: number;
  username: string;
  phone: string;
  email?: string;
  birth_date?: string; // YYYY-MM-DD
  gender?: Gender;
  
  // 지점 정보
  region_id: number;
  region_name?: string; // JOIN된 데이터
  
  // 회원권 정보
  active_ticket_id?: number;
  ticket_type?: string; // JOIN된 데이터
  start_date?: string; // 회원권 시작일
  end_date?: string; // 회원권 종료일
  remain_count?: number; // 남은 횟수 (회차권인 경우)
  
  // 출석 정보
  attendance: number; // 총 출석 횟수
  last_attendance?: string; // 마지막 출석일 (YYYY-MM-DD)
  
  // 상태
  status: MemberStatus;
  
  // 메타 정보
  memo?: string;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 회원 등록 이력
 */
export interface RegistrationRecord {
  id: number;
  member_id: number;
  start_date: string;
  end_date: string;
  ticket_type: string;
}

/**
 * 회원 목록 조회 파라미터
 */
export interface MemberListParams {
  page?: number;
  limit?: number;
  search?: string; // 이름 또는 전화번호 검색
  region_id?: number;
  status?: MemberStatus;
  sort_by?: 'created_at' | 'last_attendance' | 'end_date';
  sort_order?: 'asc' | 'desc';
}

/**
 * 회원 목록 조회 응답
 */
export interface MemberListResponse {
  members: Member[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

/**
 * 회원 등록 DTO
 */
export interface CreateMemberDto {
  username: string;
  phone: string;
  email?: string;
  birth_date?: string;
  gender?: Gender;
  region_id: number;
  status: MemberStatus;
  memo?: string;
  emergency_contact?: string;
}

/**
 * 회원 수정 DTO
 */
export interface UpdateMemberDto extends Partial<CreateMemberDto> {
  id: number;
}