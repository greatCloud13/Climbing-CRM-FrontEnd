// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import { MembersPage } from './pages/MembersPage/MembersPage'; // 경로 수정
import './App.css';

/**
 * 준비중 페이지 컴포넌트
 */
const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground text-lg">준비중입니다</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="memberships" element={<ComingSoon title="회원권 관리" />} />
          <Route path="attendance" element={<ComingSoon title="출석 체크" />} />
          <Route path="statistics" element={<ComingSoon title="통계" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;