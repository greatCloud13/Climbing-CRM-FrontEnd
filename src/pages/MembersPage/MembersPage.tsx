// ============================================
// src/pages/MembersPage.tsx
// 회원 관리 페이지 (UI 개선 + 페이지네이션 설정)
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle } from 'lucide-react';
import { MemberListTable } from '@/components/members/MemberListTable';
import { MemberFilters } from '@/components/members/MemberFilters';
import { MemberDetailModal } from '@/components/members/MemberDetailModal';
import { MemberFormModal } from '@/components/members/MemberFormModal';
import { MemberDeleteModal } from '@/components/members/MemberDeleteModal';
import { PaginationSettings } from '@/components/members/PaginationSettings';
import { useMemberList } from '@/hooks/useMemberList';
import type { MemberListParams, Member } from '@/types/member.types';

/**
 * 회원 관리 페이지
 */
export const MembersPage = () => {
  // 필터 및 페이지네이션 상태
  const [filters, setFilters] = useState<MemberListParams>({
    page: 1,
    limit: 10,
  });

  // 모달 상태
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // 회원 목록 조회
  const { data, isLoading, error, refetch } = useMemberList(filters);

  // Mock 지점 데이터 (추후 실제 API로 교체)
  const mockRegions = [
    { id: 1, name: '강남점' },
    { id: 2, name: '홍대점' },
    { id: 3, name: '판교점' },
  ];

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: MemberListParams) => {
    setFilters({
      ...newFilters,
      page: 1, // 필터 변경 시 첫 페이지로
      limit: filters.limit,
    });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  // 페이지당 개수 변경 핸들러
  const handleLimitChange = (limit: number) => {
    setFilters({ ...filters, limit, page: 1 });
  };

  // 회원 상세 보기
  const handleViewDetail = (member: Member) => {
    setSelectedMember(member);
    setDetailModalOpen(true);
  };

  // 회원 등록 모달 열기
  const handleCreateMember = () => {
    setSelectedMember(null);
    setFormModalOpen(true);
  };

  // 회원 수정 모달 열기
  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setFormModalOpen(true);
  };

  // 회원 삭제 모달 열기
  const handleDelete = (member: Member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  // 모달 성공 콜백
  const handleModalSuccess = () => {
    refetch(); // 목록 새로고침
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (!data) return null;

    const { page, total_pages } = data;
    const pages: (number | 'ellipsis')[] = [];

    // 페이지 번호 생성 로직
    if (total_pages <= 7) {
      // 7페이지 이하: 모두 표시
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // 7페이지 초과: 현재 페이지 중심으로 표시
      if (page <= 4) {
        // 처음 부분
        pages.push(1, 2, 3, 4, 5, 'ellipsis', total_pages);
      } else if (page >= total_pages - 3) {
        // 끝 부분
        pages.push(1, 'ellipsis', total_pages - 4, total_pages - 3, total_pages - 2, total_pages - 1, total_pages);
      } else {
        // 중간 부분
        pages.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', total_pages);
      }
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => page > 1 && handlePageChange(page - 1)}
              className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {pages.map((p, idx) => (
            <PaginationItem key={idx}>
              {p === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(p)}
                  isActive={p === page}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => page < total_pages && handlePageChange(page + 1)}
              className={page >= total_pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-[1600px]">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">회원 관리</h1>
            <p className="text-muted-foreground mt-1">
              회원 정보를 조회하고 관리합니다.
            </p>
          </div>
          <Button onClick={handleCreateMember} size="lg" className="font-semibold">
            <Plus className="h-5 w-5 mr-2" />
            회원 등록
          </Button>
        </div>

        {/* 에러 표시 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              회원 목록을 불러오는데 실패했습니다. 다시 시도해주세요.
            </AlertDescription>
          </Alert>
        )}

        {/* 메인 카드 */}
        <Card className="border-2">
          <CardHeader className="border-b-2 bg-muted/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl">회원 목록</CardTitle>
              {data && (
                <PaginationSettings
                  limit={filters.limit || 10}
                  total={data.total}
                  onLimitChange={handleLimitChange}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* 필터 */}
            <MemberFilters 
              onFilterChange={handleFilterChange}
              regions={mockRegions}
            />

            {/* 테이블 */}
            <MemberListTable
              members={data?.members || []}
              isLoading={isLoading}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* 페이지네이션 */}
            {data && data.total_pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2">
                <div className="text-sm text-muted-foreground">
                  {data.members.length > 0 && (
                    <span>
                      {((data.page - 1) * data.limit) + 1} - {Math.min(data.page * data.limit, data.total)}
                      {' '}/ {data.total}명
                    </span>
                  )}
                </div>
                <div className="flex justify-center">
                  {renderPagination()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 모달들 */}
      <MemberDetailModal
        memberId={selectedMember?.id || null}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onEdit={handleEdit}
      />

      <MemberFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        member={selectedMember}
        regions={mockRegions}
        onSuccess={handleModalSuccess}
      />

      <MemberDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        member={selectedMember}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};