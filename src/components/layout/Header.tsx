// src/components/layout/Header.tsx

import { Menu, Bell, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';

/**
 * Header Props
 */
interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * 헤더 컴포넌트
 * 
 * 상단 네비게이션 바
 * - 햄버거 메뉴 (모바일)
 * - 테마 토글
 * - 알림
 * - 사용자 정보
 */
export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* 왼쪽: 햄버거 메뉴 (모바일) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* 페이지 제목 (모바일에서는 숨김) */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold">클라이밍 CRM</h2>
          </div>
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 테마 토글 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* 알림 */}
          <Button variant="ghost" size="icon" title="알림">
            <Bell className="h-5 w-5" />
          </Button>

          {/* 사용자 정보 */}
          <Button variant="ghost" className="gap-2" title="내 정보">
            <User className="h-5 w-5" />
            <span className="hidden md:inline-block text-sm">
              {user?.name || '사용자'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;