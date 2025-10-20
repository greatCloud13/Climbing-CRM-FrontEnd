// src/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
  branchId: string | null;
  branchName?: string;
}

/**
 * 인증 상태 인터페이스
 */
interface AuthState {
  // 상태
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  // 액션
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
}

/**
 * 인증 상태 관리 Store
 * 
 * localStorage에 자동으로 persist되어
 * 새로고침해도 로그인 상태가 유지됩니다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,
      accessToken: null,

      // 로그인
      login: (token: string, user: User) => {
        localStorage.setItem('accessToken', token);
        set({
          user,
          isAuthenticated: true,
          accessToken: token,
        });
      },

      // 로그아웃
      logout: () => {
        localStorage.removeItem('accessToken');
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
        });
      },

      // 사용자 정보 업데이트
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      // 토큰 설정
      setToken: (token: string) => {
        localStorage.setItem('accessToken', token);
        set({ accessToken: token });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);

/**
 * 편의 함수들
 */

// 현재 사용자 역할 확인
export const useUserRole = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role;
};

// 관리자 권한 확인
export const useIsAdmin = () => {
  const role = useUserRole();
  return role === 'admin';
};

// 현재 지점 ID 가져오기
export const useCurrentBranchId = () => {
  const user = useAuthStore((state) => state.user);
  return user?.branchId;
};