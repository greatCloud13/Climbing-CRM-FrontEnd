// src/api/queryKeys.ts

/**
 * React Query 키 관리
 * 
 * 모든 React Query의 queryKey를 중앙에서 관리합니다.
 * - 타입 안정성 확보
 * - 키 충돌 방지
 * - 캐시 무효화 용이
 */

import type { MemberListParams } from '@/types/member.types';

/**
 * 대시보드 관련 Query Keys
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  attendance: (date?: string) => 
    [...dashboardKeys.all, 'attendance', date] as const,
} as const;

/**
 * 회원 관련 Query Keys
 */
export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (filters?: MemberListParams) => 
    [...memberKeys.lists(), filters] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...memberKeys.details(), id] as const,
  search: (query: string) => [...memberKeys.all, 'search', query] as const,
  history: (id: string | number) => [...memberKeys.all, 'history', id] as const,
} as const;

/**
 * 회원권 관련 Query Keys
 */
export const membershipKeys = {
  all: ['memberships'] as const,
  lists: () => [...membershipKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => 
    [...membershipKeys.lists(), filters] as const,
  details: () => [...membershipKeys.all, 'detail'] as const,
  detail: (id: string) => [...membershipKeys.details(), id] as const,
  expiring: (days?: number) => 
    [...membershipKeys.all, 'expiring', days] as const,
  templates: () => [...membershipKeys.all, 'templates'] as const,
} as const;

/**
 * 출석 관련 Query Keys
 */
export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => 
    [...attendanceKeys.lists(), filters] as const,
  history: (memberId: string) => 
    [...attendanceKeys.all, 'history', memberId] as const,
  today: () => [...attendanceKeys.all, 'today'] as const,
} as const;

/**
 * 통계 관련 Query Keys
 */
export const statisticsKeys = {
  all: ['statistics'] as const,
  monthly: (year: number, month: number) => 
    [...statisticsKeys.all, 'monthly', year, month] as const,
  revenue: (startDate: string, endDate: string) => 
    [...statisticsKeys.all, 'revenue', startDate, endDate] as const,
} as const;

/**
 * 지점 관련 Query Keys
 */
export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  details: () => [...branchKeys.all, 'detail'] as const,
  detail: (id: string) => [...branchKeys.details(), id] as const,
  current: () => [...branchKeys.all, 'current'] as const,
} as const;

/**
 * 회원권 타입(Ticket) 관련 Query Keys
 * Ticket: 회원권 종류 (10회권, 30일권 등)
 */
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: () => [...ticketKeys.lists()] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (ticketType: string) => [...ticketKeys.details(), ticketType] as const,
  deleteInfo: (ticketType: string) => [...ticketKeys.all, 'delete-info', ticketType] as const,
} as const;

/**
 * 전체 Query Keys Export
 */
export const queryKeys = {
  dashboard: dashboardKeys,
  member: memberKeys,
  membership: membershipKeys,
  attendance: attendanceKeys,
  statistics: statisticsKeys,
  branch: branchKeys,
  ticket: ticketKeys,
} as const;