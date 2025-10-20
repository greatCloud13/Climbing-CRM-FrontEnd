// ============================================
// src/api/services/member.service.ts
// 회원 관리 API 서비스
// ============================================

import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { 
  Member, 
  MemberListParams, 
  MemberListResponse,
  CreateMemberDto,
  UpdateMemberDto,
  RegistrationRecord,
} from '@/types/member.types';

// API 응답 공통 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error: string | null;
}

// ============================================
// Mock 데이터
// ============================================

const mockMembers: Member[] = [
  {
    id: 1,
    username: '김철수',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    birth_date: '1990-05-15',
    gender: 'M',
    region_id: 1,
    region_name: '강남점',
    active_ticket_id: 1,
    ticket_type: '3개월 자유이용권',
    start_date: '2025-01-01',
    end_date: '2025-03-31',
    remain_count: undefined,
    attendance: 45,
    last_attendance: '2025-10-19',
    status: 'ACTIVE',
    memo: 'VIP 회원',
    emergency_contact: '010-9999-8888',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2025-10-19T18:30:00Z',
  },
  {
    id: 2,
    username: '이영희',
    phone: '010-2345-6789',
    email: 'lee@example.com',
    birth_date: '1995-08-20',
    gender: 'F',
    region_id: 1,
    region_name: '강남점',
    active_ticket_id: 2,
    ticket_type: '10회 이용권',
    start_date: '2025-10-01',
    end_date: '2025-12-31',
    remain_count: 7,
    attendance: 23,
    last_attendance: '2025-10-18',
    status: 'ACTIVE',
    created_at: '2025-02-15T14:20:00Z',
    updated_at: '2025-10-18T19:45:00Z',
  },
  {
    id: 3,
    username: '박민수',
    phone: '010-3456-7890',
    gender: 'M',
    region_id: 2,
    region_name: '홍대점',
    active_ticket_id: 3,
    ticket_type: '1개월 자유이용권',
    start_date: '2025-09-15',
    end_date: '2025-10-14',
    attendance: 12,
    last_attendance: '2025-10-10',
    status: 'EXPIRED',
    created_at: '2025-09-15T09:00:00Z',
    updated_at: '2025-10-14T23:59:00Z',
  },
  {
    id: 4,
    username: '최지은',
    phone: '010-4567-8901',
    email: 'choi@example.com',
    birth_date: '1988-03-10',
    gender: 'F',
    region_id: 1,
    region_name: '강남점',
    attendance: 156,
    last_attendance: '2025-09-30',
    status: 'PAUSED',
    memo: '일시정지 - 해외출장',
    created_at: '2023-05-20T11:30:00Z',
    updated_at: '2025-09-30T16:20:00Z',
  },
  {
    id: 5,
    username: '정태희',
    phone: '010-5678-9012',
    gender: 'M',
    region_id: 3,
    region_name: '판교점',
    active_ticket_id: 4,
    ticket_type: '20회 이용권',
    start_date: '2025-10-10',
    end_date: '2026-01-09',
    remain_count: 18,
    attendance: 8,
    last_attendance: '2025-10-20',
    status: 'ACTIVE',
    created_at: '2025-10-10T13:00:00Z',
    updated_at: '2025-10-20T10:15:00Z',
  },
  {
    id: 6,
    username: '한소희',
    phone: '010-6789-0123',
    email: 'han@example.com',
    birth_date: '1992-11-25',
    gender: 'F',
    region_id: 2,
    region_name: '홍대점',
    active_ticket_id: 5,
    ticket_type: '6개월 자유이용권',
    start_date: '2025-08-01',
    end_date: '2026-01-31',
    attendance: 67,
    last_attendance: '2025-10-20',
    status: 'ACTIVE',
    emergency_contact: '010-1111-2222',
    created_at: '2025-08-01T09:30:00Z',
    updated_at: '2025-10-20T11:00:00Z',
  },
  {
    id: 7,
    username: '윤서준',
    phone: '010-7890-1234',
    gender: 'M',
    region_id: 3,
    region_name: '판교점',
    attendance: 89,
    last_attendance: '2025-08-15',
    status: 'WITHDRAWN',
    memo: '타 지점 이전',
    created_at: '2024-03-10T14:00:00Z',
    updated_at: '2025-08-15T17:30:00Z',
  },
];

const mockHistory: RegistrationRecord[] = [
  {
    id: 1,
    member_id: 1,
    start_date: '2024-10-01',
    end_date: '2024-12-31',
    ticket_type: '3개월 자유이용권',
  },
  {
    id: 2,
    member_id: 1,
    start_date: '2025-01-01',
    end_date: '2025-03-31',
    ticket_type: '3개월 자유이용권',
  },
];

// ============================================
// API 함수들
// ============================================

/**
 * 회원 목록 조회
 * 검색, 필터링, 정렬, 페이지네이션 지원
 */
export const getMemberList = async (
  params?: MemberListParams
): Promise<MemberListResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    // Mock 데이터 필터링
    let filtered = [...mockMembers];
    
    // 검색 (이름 또는 전화번호)
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        m => m.username.toLowerCase().includes(search) || 
             m.phone.includes(search)
      );
    }
    
    // 지점 필터
    if (params?.region_id) {
      filtered = filtered.filter(m => m.region_id === params.region_id);
    }
    
    // 상태 필터
    if (params?.status) {
      filtered = filtered.filter(m => m.status === params.status);
    }
    
    // 정렬
    if (params?.sort_by) {
      filtered.sort((a, b) => {
        const aVal = a[params.sort_by!] || '';
        const bVal = b[params.sort_by!] || '';
        const order = params.sort_order === 'asc' ? 1 : -1;
        return aVal > bVal ? order : -order;
      });
    }
    
    // 페이지네이션
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return {
      members: paginated,
      total: filtered.length,
      page,
      limit,
      total_pages: Math.ceil(filtered.length / limit),
    };
  }
  
  // 실제 API 호출
  const response = await apiClient.get<ApiResponse<MemberListResponse>>(
    ENDPOINTS.MEMBER.LIST,
    { params }
  );
  return response.data.data;
};

/**
 * 회원 상세 조회
 */
export const getMemberDetail = async (id: number): Promise<Member> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const member = mockMembers.find(m => m.id === id);
    if (!member) {
      throw new Error('회원을 찾을 수 없습니다.');
    }
    return member;
  }
  
  const response = await apiClient.get<ApiResponse<Member>>(
    ENDPOINTS.MEMBER.DETAIL(id)
  );
  return response.data.data;
};

/**
 * 회원 등록
 */
export const createMember = async (data: CreateMemberDto): Promise<Member> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const newMember: Member = {
      id: mockMembers.length + 1,
      ...data,
      attendance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockMembers.push(newMember);
    return newMember;
  }
  
  const response = await apiClient.post<ApiResponse<Member>>(
    ENDPOINTS.MEMBER.CREATE,
    data
  );
  return response.data.data;
};

/**
 * 회원 수정
 */
export const updateMember = async (data: UpdateMemberDto): Promise<Member> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const index = mockMembers.findIndex(m => m.id === data.id);
    if (index === -1) {
      throw new Error('회원을 찾을 수 없습니다.');
    }
    
    mockMembers[index] = {
      ...mockMembers[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockMembers[index];
  }
  
  const response = await apiClient.put<ApiResponse<Member>>(
    ENDPOINTS.MEMBER.UPDATE(data.id),
    data
  );
  return response.data.data;
};

/**
 * 회원 삭제
 */
export const deleteMember = async (id: number): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const index = mockMembers.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('회원을 찾을 수 없습니다.');
    }
    mockMembers.splice(index, 1);
    return;
  }
  
  await apiClient.delete(ENDPOINTS.MEMBER.DELETE(id));
};

/**
 * 회원 이용 이력 조회
 */
export const getMemberHistory = async (
  id: number
): Promise<RegistrationRecord[]> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockHistory.filter(h => h.member_id === id);
  }
  
  const response = await apiClient.get<ApiResponse<RegistrationRecord[]>>(
    ENDPOINTS.MEMBER.HISTORY(id)
  );
  return response.data.data;
};