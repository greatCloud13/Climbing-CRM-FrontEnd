// ============================================
// src/components/members/MemberFilters.tsx
// 회원 검색 및 필터 컴포넌트
// ============================================

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import type { MemberListParams, MemberStatus } from '@/types/member.types';

interface MemberFiltersProps {
  onFilterChange: (filters: MemberListParams) => void;
  regions?: Array<{ id: number; name: string }>;
}

/**
 * 회원 검색 및 필터 컴포넌트
 */
export const MemberFilters = ({ onFilterChange, regions = [] }: MemberFiltersProps) => {
  const [search, setSearch] = useState('');
  const [regionId, setRegionId] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // 필터 적용 함수
  const applyFilters = () => {
    const filters: MemberListParams = {
      search: search || undefined,
      region_id: regionId !== 'all' ? Number(regionId) : undefined,
      status: status !== 'all' ? (status as MemberStatus) : undefined,
      sort_by: sortBy as 'created_at' | 'last_attendance' | 'end_date',
      sort_order: sortOrder as 'asc' | 'desc',
    };
    
    onFilterChange(filters);
  };

  // 필터 초기화
  const handleReset = () => {
    setSearch('');
    setRegionId('all');
    setStatus('all');
    setSortBy('created_at');
    setSortOrder('desc');
    
    // 초기화 후 필터 적용
    onFilterChange({
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  };

  // 검색어 입력 시
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  // 엔터키로 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  // 활성화된 필터 개수
  const activeFilterCount = [
    search,
    regionId !== 'all' ? regionId : '',
    status !== 'all' ? status : ''
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* 검색창 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름 또는 전화번호 검색 후 엔터..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-9 pr-9"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setSearch('');
                applyFilters();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button onClick={applyFilters} className="sm:w-auto">
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>

        {/* 모바일: 필터 개수 표시 */}
        <Button 
          variant="outline" 
          className="sm:hidden"
          onClick={handleReset}
          disabled={activeFilterCount === 0}
        >
          <Filter className="h-4 w-4 mr-2" />
          필터 {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      {/* 필터 옵션 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 지점 필터 */}
        <Select 
          value={regionId} 
          onValueChange={(value) => {
            setRegionId(value);
            // 선택 즉시 필터 적용
            const filters: MemberListParams = {
              search: search || undefined,
              region_id: value !== 'all' ? Number(value) : undefined,
              status: status !== 'all' ? (status as MemberStatus) : undefined,
              sort_by: sortBy as 'created_at' | 'last_attendance' | 'end_date',
              sort_order: sortOrder as 'asc' | 'desc',
            };
            onFilterChange(filters);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="전체 지점" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 지점</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region.id} value={String(region.id)}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 상태 필터 */}
        <Select 
          value={status} 
          onValueChange={(value) => {
            setStatus(value);
            // 선택 즉시 필터 적용
            const filters: MemberListParams = {
              search: search || undefined,
              region_id: regionId !== 'all' ? Number(regionId) : undefined,
              status: value !== 'all' ? (value as MemberStatus) : undefined,
              sort_by: sortBy as 'created_at' | 'last_attendance' | 'end_date',
              sort_order: sortOrder as 'asc' | 'desc',
            };
            onFilterChange(filters);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="전체 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="ACTIVE">활성</SelectItem>
            <SelectItem value="PAUSED">일시정지</SelectItem>
            <SelectItem value="EXPIRED">만료</SelectItem>
            <SelectItem value="WITHDRAWN">탈퇴</SelectItem>
          </SelectContent>
        </Select>

        {/* 정렬 기준 */}
        <Select 
          value={sortBy} 
          onValueChange={(value) => {
            setSortBy(value);
            // 선택 즉시 필터 적용
            const filters: MemberListParams = {
              search: search || undefined,
              region_id: regionId !== 'all' ? Number(regionId) : undefined,
              status: status !== 'all' ? (status as MemberStatus) : undefined,
              sort_by: value as 'created_at' | 'last_attendance' | 'end_date',
              sort_order: sortOrder as 'asc' | 'desc',
            };
            onFilterChange(filters);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">가입일</SelectItem>
            <SelectItem value="last_attendance">최근 출석</SelectItem>
            <SelectItem value="end_date">종료일</SelectItem>
          </SelectContent>
        </Select>

        {/* 정렬 순서 */}
        <Select 
          value={sortOrder} 
          onValueChange={(value) => {
            setSortOrder(value);
            // 선택 즉시 필터 적용
            const filters: MemberListParams = {
              search: search || undefined,
              region_id: regionId !== 'all' ? Number(regionId) : undefined,
              status: status !== 'all' ? (status as MemberStatus) : undefined,
              sort_by: sortBy as 'created_at' | 'last_attendance' | 'end_date',
              sort_order: value as 'asc' | 'desc',
            };
            onFilterChange(filters);
          }}
        >
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">내림차순</SelectItem>
            <SelectItem value="asc">오름차순</SelectItem>
          </SelectContent>
        </Select>

        {/* 필터 초기화 버튼 (데스크탑) */}
        {activeFilterCount > 0 && (
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="hidden sm:flex"
          >
            <X className="h-4 w-4 mr-2" />
            초기화
          </Button>
        )}
      </div>
    </div>
  );
};