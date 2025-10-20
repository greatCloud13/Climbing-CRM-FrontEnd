// src/api/endpoints.ts

/**
 * API 엔드포인트 상수 관리
 * 
 * 모든 API 엔드포인트를 중앙에서 관리하여
 * 유지보수성과 일관성을 높입니다.
 */

/**
 * 인증 관련 엔드포인트
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

/**
 * 통계 관련 엔드포인트
 */
export const STATISTICS_ENDPOINTS = {
  DASHBOARD: '/statistics/dashboard',
  ATTENDANCE_HOURLY: '/statistics/attendance/hourly',
  MONTHLY: '/statistics/monthly',
  REVENUE: '/statistics/revenue',
} as const;

/**
 * 회원 관련 엔드포인트
 */
export const MEMBER_ENDPOINTS = {
  LIST: '/members',
  DETAIL: (id: string) => `/members/${id}`,
  CREATE: '/members',
  UPDATE: (id: string) => `/members/${id}`,
  DELETE: (id: string) => `/members/${id}`,
  SEARCH: '/members/search',
} as const;

/**
 * 회원권 관련 엔드포인트
 */
export const MEMBERSHIP_ENDPOINTS = {
  LIST: '/memberships',
  DETAIL: (id: string) => `/memberships/${id}`,
  CREATE: '/memberships',
  UPDATE: (id: string) => `/memberships/${id}`,
  DELETE: (id: string) => `/memberships/${id}`,
  EXPIRING: '/memberships/expiring',
  TEMPLATES: '/memberships/templates',
} as const;

/**
 * 출석 관련 엔드포인트
 */
export const ATTENDANCE_ENDPOINTS = {
  LIST: '/attendance',
  CHECK_IN: '/attendance/check-in',
  HISTORY: (memberId: string) => `/attendance/history/${memberId}`,
  TODAY: '/attendance/today',
} as const;

/**
 * 지점 관련 엔드포인트
 */
export const BRANCH_ENDPOINTS = {
  LIST: '/branches',
  DETAIL: (id: string) => `/branches/${id}`,
  CURRENT: '/branches/current',
} as const;

/**
 * 전체 엔드포인트 export
 */
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  STATISTICS: STATISTICS_ENDPOINTS,
  MEMBER: MEMBER_ENDPOINTS,
  MEMBERSHIP: MEMBERSHIP_ENDPOINTS,
  ATTENDANCE: ATTENDANCE_ENDPOINTS,
  BRANCH: BRANCH_ENDPOINTS,
} as const;