// src/api/client.ts

import axios from 'axios';

/**
 * Axios 인스턴스 생성
 * 
 * 모든 API 요청에 사용되는 기본 설정을 포함합니다.
 * - 기본 URL
 * - 타임아웃
 * - 헤더 설정
 * - JWT 토큰 자동 추가 (interceptor)
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * 모든 요청에 JWT 토큰을 자동으로 추가합니다.
 */
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * 응답 에러를 처리합니다.
 * - 401: 토큰 만료 시 로그인 페이지로 리다이렉트
 * - 기타 에러: 에러 메시지 반환
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 401 Unauthorized - 토큰 만료
    if (error.response?.status === 401) {
      // 토큰 제거
      localStorage.removeItem('accessToken');
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    
    // 에러 메시지 추출
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      '알 수 없는 오류가 발생했습니다.';
    
    // 에러 객체에 메시지 추가
    error.message = errorMessage;
    
    return Promise.reject(error);
  }
);

export default apiClient;