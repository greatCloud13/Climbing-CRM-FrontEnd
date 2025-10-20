// src/types/dashboard.types.ts

/**
 * 대시보드 관련 TypeScript 타입 정의
 */

// ============================================
// 기본 타입
// ============================================

/**
 * 활동 타입
 */
export type ActivityType = 
  | 'check-in'           // 출석 체크인
  | 'membership-issued'  // 회원권 발급
  | 'membership-expired' // 회원권 만료
  | 'new-member';        // 신규 회원 등록

/**
 * 회원권 타입
 */
export type MembershipType = 
  | 'period'    // 기간권
  | 'count'     // 횟수권
  | 'custom';   // 커스텀

// ============================================
// 오늘의 출석 현황
// ============================================

/**
 * 오늘의 출석 통계
 */
export interface TodayAttendance {
  /** 총 출석 수 */
  total: number;
  /** 신규 회원 출석 */
  newMembers: number;
  /** 체크인 수 (total과 동일하게 사용, API 응답 형식 맞춤) */
  checkIns: number;
}

/**
 * 시간대별 출석 데이터 (차트용)
 */
export interface AttendanceByHour {
  /** 시간 (0-23) */
  hour: number;
  /** 출석 수 */
  count: number;
  /** 차트 표시용 레이블 (예: "09:00") */
  label: string;
}

// ============================================
// 회원권 만료 임박
// ============================================

/**
 * 만료 예정 회원 정보
 */
export interface ExpiringMember {
  /** 회원 ID */
  id: string;
  /** 회원 이름 */
  memberName: string;
  /** 회원권 타입 */
  membershipType: MembershipType;
  /** 만료일 (ISO 8601 형식) */
  expiryDate: string;
  /** 남은 일수 */
  daysRemaining: number;
  /** 회원 전화번호 (선택) */
  phone?: string;
}

/**
 * 만료 예정 회원권 통계
 */
export interface ExpiringMemberships {
  /** 7일 이내 만료 회원 수 */
  within7Days: number;
  /** 3일 이내 만료 회원 수 */
  within3Days: number;
  /** 1일 이내 만료 회원 수 */
  within1Day: number;
  /** 만료 예정 회원 목록 */
  list: ExpiringMember[];
}

// ============================================
// 이번 달 통계
// ============================================

/**
 * 월간 통계
 */
export interface MonthlyStats {
  /** 신규 회원 수 */
  newMembers: number;
  /** 총 매출 (회원권 판매) */
  revenue: number;
  /** 전체 회원 수 */
  totalMembers: number;
  /** 활성 회원 수 (최근 30일 이내 출석) */
  activeMembers: number;
}

// ============================================
// 출석 추이
// ============================================

/**
 * 일별 출석 추이 (차트용)
 */
export interface AttendanceTrend {
  /** 날짜 (ISO 8601 형식 또는 YYYY-MM-DD) */
  date: string;
  /** 출석 수 */
  count: number;
}

// ============================================
// 최근 활동
// ============================================

/**
 * 최근 활동 항목
 */
export interface RecentActivity {
  /** 활동 ID */
  id: string;
  /** 활동 타입 */
  type: ActivityType;
  /** 회원 이름 */
  memberName: string;
  /** 발생 시간 (ISO 8601 형식) */
  timestamp: string;
  /** 상세 설명 */
  details: string;
}

// ============================================
// 대시보드 전체 데이터
// ============================================

/**
 * 대시보드 통계 데이터 (메인)
 */
export interface DashboardStats {
  /** 오늘의 출석 현황 */
  todayAttendance: TodayAttendance;
  /** 회원권 만료 임박 */
  expiringMemberships: ExpiringMemberships;
  /** 이번 달 통계 */
  monthlyStats: MonthlyStats;
  /** 출석 추이 (최근 7일 또는 30일) */
  attendanceTrend: AttendanceTrend[];
  /** 최근 활동 목록 */
  recentActivities: RecentActivity[];
}

// ============================================
// API 응답 타입
// ============================================

/**
 * API 표준 응답 형식
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error: string | null;
}

/**
 * 대시보드 API 응답
 */
export type DashboardStatsResponse = ApiResponse<DashboardStats>;

// ============================================
// UI 상태 타입
// ============================================

/**
 * 통계 카드 타입
 */
export interface StatCardData {
  /** 제목 */
  title: string;
  /** 값 */
  value: number | string;
  /** 아이콘 이름 (lucide-react) */
  icon: string;
  /** 변화율 (선택, 예: +5.2%) */
  change?: number;
  /** 변화 방향 */
  trend?: 'up' | 'down' | 'neutral';
  /** 설명 텍스트 */
  description?: string;
}

/**
 * 시간대별 출석 필터
 */
export type AttendanceTimeRange = 'today' | 'week' | 'month';

/**
 * 만료 예정 필터
 */
export type ExpiringFilter = 'all' | 'within7Days' | 'within3Days' | 'within1Day';