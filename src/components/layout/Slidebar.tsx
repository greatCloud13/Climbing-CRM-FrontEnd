// src/components/layout/Sidebar.tsx

import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  CheckSquare, 
  BarChart3,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Sidebar Props
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 네비게이션 메뉴 아이템 타입
 */
interface NavItem {
  title: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

/**
 * 네비게이션 메뉴 목록
 */
const navItems: NavItem[] = [
  {
    title: '대시보드',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: '회원 관리',
    href: '/members',
    icon: Users,
  },
  {
    title: '회원권 관리',
    href: '/tickets', // 변경: /memberships -> /tickets
    icon: Ticket, // 변경: CreditCard -> Ticket
  },
  {
    title: '출석 체크',
    href: '/attendance',
    icon: CheckSquare,
    badge: '준비중',
  },
  {
    title: '통계',
    href: '/statistics',
    icon: BarChart3,
    badge: '준비중',
  },
];

/**
 * 사이드바 컴포넌트
 * 
 * 좌측 네비게이션 메뉴
 * - PC: 항상 표시
 * - 모바일: 햄버거 메뉴로 토글
 */
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 헤더 */}
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-lg">회원관리 시스템</span>
          </div>

          {/* 닫기 버튼 (모바일) */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 font-medium">{item.title}</span>
                {item.badge && (
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    isActive 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            <p>v1.0.0</p>
            <p className="mt-1">© 2025 Climbing CRM</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;