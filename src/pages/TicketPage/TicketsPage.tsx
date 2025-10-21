// src/pages/TicketPage/TicketsPage.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, AlertCircle, Ticket as TicketIcon } from 'lucide-react';
import { useTicketList } from '@/hooks/useTicketList';
import { TicketCard } from '@/components/tickets/TicketCard';
import { TicketFormModal } from '@/components/tickets/TicketFormModal';
import { TicketDeleteModal } from '@/components/tickets/TicketDeleteModal';
import type { Ticket } from '@/types/ticket.types';

/**
 * 회원권 관리 페이지
 * 
 * 회원권 종류를 카드 그리드 형식으로 표시하고
 * 등록/수정/삭제 기능을 제공합니다.
 */
export const TicketsPage = () => {
  const { tickets, isLoading, isError, error } = useTicketList();

  // 모달 상태 관리
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  /**
   * 회원권 등록 모달 열기
   */
  const handleCreateClick = () => {
    setSelectedTicket(null);
    setIsFormModalOpen(true);
  };

  /**
   * 회원권 수정 모달 열기
   */
  const handleEditClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsFormModalOpen(true);
  };

  /**
   * 회원권 삭제 모달 열기
   */
  const handleDeleteClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  /**
   * 폼 모달 닫기
   */
  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setSelectedTicket(null);
  };

  /**
   * 삭제 모달 닫기
   */
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-[1600px]">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TicketIcon className="h-8 w-8" />
              회원권 관리
            </h1>
            <p className="text-muted-foreground mt-1">
              회원권 종류를 등록하고 관리합니다.
            </p>
          </div>
          <Button onClick={handleCreateClick} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            회원권 등록
          </Button>
        </div>
      </div>

      {/* 에러 상태 */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : '회원권 목록을 불러오는데 실패했습니다.'}
          </AlertDescription>
        </Alert>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-2">
              <CardHeader className="border-b-2 bg-muted/30">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 회원권 목록 */}
      {!isLoading && !isError && (
        <>
          {tickets.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-muted">
                      <TicketIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      등록된 회원권이 없습니다
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      새로운 회원권을 등록해보세요.
                    </p>
                  </div>
                  <Button onClick={handleCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    회원권 등록
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 통계 카드 */}
              <Card className="border-2 mb-6">
                <CardHeader className="border-b-2 bg-muted/30">
                  <CardTitle>통계</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        총 회원권 종류
                      </p>
                      <p className="text-3xl font-bold mt-1">
                        {tickets.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        평균 가격
                      </p>
                      <p className="text-3xl font-bold mt-1">
                        ₩
                        {Math.floor(
                          tickets.reduce((sum, t) => sum + t.price, 0) /
                            tickets.length
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        최저/최고 가격
                      </p>
                      <p className="text-xl font-bold mt-1">
                        ₩{Math.min(...tickets.map((t) => t.price)).toLocaleString()}
                        {' / '}
                        ₩{Math.max(...tickets.map((t) => t.price)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 회원권 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.ticket_type}
                    ticket={ticket}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* 회원권 등록/수정 모달 */}
      <TicketFormModal
        open={isFormModalOpen}
        onClose={handleFormModalClose}
        ticket={selectedTicket}
      />

      {/* 회원권 삭제 확인 모달 */}
      <TicketDeleteModal
        open={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        ticket={selectedTicket}
      />
    </div>
  );
};