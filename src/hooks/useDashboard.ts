// src/hooks/useDashboard.ts

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/api/services/statistics.service';

/**
 * 대시보드 데이터 관리 커스텀 훅
 * 
 * React Query를 사용하여 대시보드 통계 데이터를 페칭하고 관리합니다.
 * 
 * @returns {Object} 대시보드 데이터 및 상태
 * @property {DashboardStats | undefined} data - 대시보드 통계 데이터
 * @property {boolean} isLoading - 초기 로딩 상태
 * @property {boolean} isFetching - 백그라운드 페칭 상태
 * @property {boolean} isError - 에러 발생 여부
 * @property {Error | null} error - 에러 객체
 * @property {Function} refetch - 수동 데이터 새로고침 함수
 * 
 * @example
 * const { data, isLoading, isError, error, refetch } = useDashboard();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (isError) return <ErrorMessage error={error} />;
 * 
 * return <Dashboard data={data} onRefresh={refetch} />;
 */
export const useDashboard = () => {
  const query = useQuery({
    // Query Key: 캐시 식별자
    queryKey: ['dashboard', 'stats'],
    
    // Query Function: 데이터 페칭 함수
    queryFn: getDashboardStats,
    
    // 옵션 설정
    staleTime: 5 * 60 * 1000, // 5분 - 데이터가 신선한 것으로 간주되는 시간
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime) - 캐시 유지 시간
    refetchOnWindowFocus: true, // 윈도우 포커스 시 재요청
    refetchOnMount: true, // 마운트 시 재요청
    retry: 2, // 실패 시 재시도 횟수
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });

  return {
    // 데이터
    data: query.data,
    
    // 로딩 상태
    isLoading: query.isLoading, // 초기 로딩 (데이터가 없고 페칭 중)
    isFetching: query.isFetching, // 백그라운드 페칭 중
    
    // 에러 상태
    isError: query.isError,
    error: query.error,
    
    // 유틸리티 함수
    refetch: query.refetch, // 수동 새로고침
  };
};

/**
 * 대시보드 데이터 프리페치 훅
 * 
 * 페이지 진입 전에 데이터를 미리 로드할 때 사용합니다.
 * 주로 라우팅 시 사용됩니다.
 * 
 * @example
 * // Router loader나 상위 컴포넌트에서 사용
 * const { prefetchDashboard } = useDashboardPrefetch();
 * await prefetchDashboard();
 */
export const useDashboardPrefetch = () => {
  const prefetchDashboard = async () => {
    // QueryClient를 통해 프리페치 구현 가능
    // 현재는 기본 구조만 제공
    return getDashboardStats();
  };

  return { prefetchDashboard };
};

export default useDashboard;