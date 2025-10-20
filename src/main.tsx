// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'

/**
 * React Query 클라이언트 설정
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 쿼리 실패 시 재시도 횟수
      retry: 1,
      // 윈도우 포커스 시 자동 refetch 비활성화
      refetchOnWindowFocus: false,
      // 데이터가 신선한 것으로 간주되는 시간 (5분)
      staleTime: 5 * 60 * 1000,
      // 캐시 유지 시간 (10분)
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      // 뮤테이션 실패 시 재시도 안 함
      retry: 0,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 개발 환경에서만 React Query Devtools 표시 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)