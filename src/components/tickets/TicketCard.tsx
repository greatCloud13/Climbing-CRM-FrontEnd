// src/components/tickets/TicketCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Ticket as TicketIcon } from 'lucide-react';
import type { Ticket } from '@/types/ticket.types';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

/**
 * 회원권 카드 컴포넌트
 * 
 * 회원권 정보를 카드 형식으로 표시합니다.
 * - 회원권 이름, 횟수/기간, 가격 표시
 * - 수정/삭제 버튼 제공
 */
export const TicketCard = ({ ticket, onEdit, onDelete }: TicketCardProps) => {
  /**
   * 가격 포맷팅 (천 단위 콤마)
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  /**
   * 회원권 타입 표시 (횟수권/기간권)
   */
  const getTicketTypeLabel = () => {
    if (ticket.count) {
      return '횟수권';
    } else if (ticket.duration) {
      return '기간권';
    }
    return '미분류';
  };

  /**
   * 회원권 타입에 따른 배지 색상
   */
  const getTicketTypeBadgeVariant = (): 'default' | 'secondary' | 'outline' => {
    if (ticket.count) {
      return 'secondary';
    } else if (ticket.duration) {
      return 'outline';
    }
    return 'default';
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="border-b-2 bg-muted/30 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TicketIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{ticket.ticket_type}</CardTitle>
              <Badge variant={getTicketTypeBadgeVariant()} className="mt-1">
                {getTicketTypeLabel()}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(ticket)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(ticket)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* 이용 정보 */}
        <div className="space-y-2">
          {ticket.count !== null && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">이용 횟수</span>
              <span className="font-semibold">{ticket.count}회</span>
            </div>
          )}
          {ticket.duration !== null && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">사용 기한</span>
              <span className="font-semibold">{ticket.duration}일</span>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="border-t" />

        {/* 가격 */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">가격</span>
          <span className="text-2xl font-bold text-primary">
            ₩{formatPrice(ticket.price)}
          </span>
        </div>

        {/* 설명 */}
        {ticket.description && (
          <>
            <div className="border-t" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ticket.description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};