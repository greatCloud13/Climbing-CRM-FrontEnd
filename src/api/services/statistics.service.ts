// src/api/services/statistics.service.ts

import apiClient from '../client';
import type { DashboardStats, DashboardStatsResponse } from '@/types/dashboard.types';

/**
 * 통계 관련 API 서비스
 */

// ============================================
// Mock 데이터
// ============================================

/**
 * 대시보드 Mock 데이터
 * API가 준비되기 전까지 사용
 */
const mockDashboardData: DashboardStats = {
  todayAttendance: {
    total: 47,
    newMembers: 3,
    checkIns: 47,
  },
  expiringMemberships: {
    within7Days: 12,
    within3Days: 5,
    within1Day: 2,
    list: [
      {
        id: '1',
        memberName: '김철수',
        membershipType: 'period',
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 1,
        phone: '010-1234-5678',
      },
      {
        id: '2',
        memberName: '이영희',
        membershipType: 'period',
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 1,
        phone: '010-2345-6789',
      },
      {
        id: '3',
        memberName: '박민수',
        membershipType: 'count',
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 2,
        phone: '010-3456-7890',
      },
      {
        id: '4',
        memberName: '정수진',
        membershipType: 'period',
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 3,
        phone: '010-4567-8901',
      },
      {
        id: '5',
        memberName: '최동욱',
        membershipType: 'count',
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 3,
        phone: '010-5678-9012',
      },
      {
        id: '6',
        memberName: '강지원',
        membershipType: 'period',
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 5,
        phone: '010-6789-0123',
      },
      {
        id: '7',
        memberName: '윤서연',
        membershipType: 'custom',
        expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 6,
        phone: '010-7890-1234',
      },
      {
        id: '8',
        memberName: '임태희',
        membershipType: 'period',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 7,
        phone: '010-8901-2345',
      },
    ],
  },
  monthlyStats: {
    newMembers: 28,
    revenue: 8_450_000,
    totalMembers: 342,
    activeMembers: 267,
  },
  attendanceTrend: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), count: 52 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), count: 48 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), count: 45 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), count: 58 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), count: 62 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), count: 55 },
    { date: new Date().toISOString(), count: 47 },
  ],
  recentActivities: [
    {
      id: '1',
      type: 'check-in',
      memberName: '김철수',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      details: '오늘 첫 방문',
    },
    {
      id: '2',
      type: 'membership-issued',
      memberName: '이영희',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      details: '3개월 기간권 등록',
    },
    {
      id: '3',
      type: 'new-member',
      memberName: '박민수',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      details: '신규 회원 가입',
    },
    {
      id: '4',
      type: 'check-in',
      memberName: '정수진',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      details: '이번 주 3번째 방문',
    },
    {
      id: '5',
      type: 'membership-expired',
      memberName: '최동욱',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      details: '10회 횟수권 만료',
    },
    {
      id: '6',
      type: 'check-in',
      memberName: '강지원',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      details: '오전 운동 완료',
    },
    {
      id: '7',
      type: 'membership-issued',
      memberName: '윤서연',
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      details: '6개월 기간권 등록',
    },
    {
      id: '8',
      type: 'check-in',
      memberName: '임태희',
      timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
      details: '주말 첫 방문',
    },
  ],
};

// ============================================
// API 서비스 함수
// ============================================

/**
 * 대시보드 통계 데이터 가져오기
 * 
 * @returns 대시보드 통계 데이터
 * @throws API 요청 실패 시 에러
 * 
 * @example
 * const stats = await getDashboardStats();
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Mock 데이터 사용 여부 확인
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  if (useMock) {
    // Mock 데이터 반환 (개발 단계)
    // 실제 API 응답 시뮬레이션을 위한 지연 추가
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDashboardData;
  }

  // 실제 API 호출
  try {
    const response = await apiClient.get<DashboardStatsResponse>(
      '/statistics/dashboard'
    );

    if (!response.data.success) {
      throw new Error(response.data.error || '데이터를 불러오는데 실패했습니다.');
    }

    return response.data.data;
  } catch (error) {
    console.error('Dashboard stats fetch error:', error);
    throw error;
  }
};

/**
 * 시간대별 출석 데이터 가져오기 (추후 필요시 구현)
 * 
 * @param date - 조회할 날짜
 * @returns 시간대별 출석 데이터
 */
export const getAttendanceByHour = async (date: string): Promise<any> => {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  if (useMock) {
    // 시간대별 Mock 데이터
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 10),
      label: `${i.toString().padStart(2, '0')}:00`,
    }));
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockData;
  }

  const response = await apiClient.get(`/statistics/attendance/hourly`, {
    params: { date },
  });

  return response.data.data;
};

/**
 * Export for external use
 */
export default {
  getDashboardStats,
  getAttendanceByHour,
};