// src/stores/themeStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 테마 타입
 */
export type Theme = 'light' | 'dark';

/**
 * 테마 상태 인터페이스
 */
interface ThemeState {
  // 상태
  theme: Theme;

  // 액션
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * 테마 상태 관리 Store
 * 
 * 라이트/다크 모드를 관리하고,
 * HTML 루트 요소의 class를 자동으로 업데이트합니다.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // 초기 상태 (시스템 설정 우선)
      theme: 
        (localStorage.getItem('theme') as Theme) ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),

      // 테마 설정
      setTheme: (theme: Theme) => {
        // HTML root에 dark 클래스 추가/제거
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        
        set({ theme });
      },

      // 테마 토글
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
        
        // HTML root에 dark 클래스 추가/제거
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage', // localStorage 키 이름
      onRehydrateStorage: () => (state) => {
        // 스토어가 복원될 때 HTML class 적용
        if (state) {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(state.theme);
        }
      },
    }
  )
);

/**
 * 편의 함수들
 */

// 다크 모드 여부 확인
export const useIsDarkMode = () => {
  const theme = useThemeStore((state) => state.theme);
  return theme === 'dark';
};