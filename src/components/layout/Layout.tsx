// src/components/layout/Layout.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Slidebar';
import Header from './Header';

/**
 * 메인 레이아웃 컴포넌트
 * 
 * 헤더, 사이드바, 메인 콘텐츠 영역을 포함합니다.
 * - PC: 고정된 사이드바 + 헤더
 * - 모바일: 햄버거 메뉴로 접히는 사이드바
 */
export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* 메인 영역 */}
      <div className="lg:pl-64">
        {/* 헤더 */}
        <Header onMenuClick={toggleSidebar} />

        {/* 콘텐츠 */}
        <main className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;