// src/components/tickets/TicketFormModal.tsx

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTicketMutations } from '@/hooks/useTicketMutations';
import type { Ticket } from '@/types/ticket.types';

/**
 * 폼 유효성 검증 스키마
 */
const ticketFormSchema = z.object({
  ticket_type: z.string().min(1, '회원권 이름을 입력해주세요'),
  count: z.string().optional(),
  duration: z.string().optional(),
  price: z.string().min(1, '가격을 입력해주세요'),
  description: z.string().optional(),
}).refine(
  (data) => {
    const hasCount = data.count && data.count.trim() !== '';
    const hasDuration = data.duration && data.duration.trim() !== '';
    return hasCount || hasDuration;
  },
  {
    message: '이용 횟수 또는 사용 기한 중 최소 하나는 입력해야 합니다',
    path: ['count'],
  }
);

type FormValues = z.infer<typeof ticketFormSchema>;

interface TicketFormModalProps {
  open: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
}

/**
 * 회원권 등록/수정 폼 모달
 * 
 * react-hook-form + zod를 사용한 폼 유효성 검증
 * - 등록 모드: ticket이 없을 때
 * - 수정 모드: ticket이 있을 때 (ticket_type 수정 불가)
 */
export const TicketFormModal = ({ open, onClose, ticket }: TicketFormModalProps) => {
  const { createTicket, updateTicket } = useTicketMutations();
  const isEditMode = !!ticket;

  const form = useForm<FormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      ticket_type: '',
      count: '',
      duration: '',
      price: '',
      description: '',
    },
  });

  /**
   * 수정 모드일 때 폼에 기존 데이터 채우기
   */
  useEffect(() => {
    if (ticket) {
      form.reset({
        ticket_type: ticket.ticket_type,
        count: ticket.count !== null ? String(ticket.count) : '',
        duration: ticket.duration !== null ? String(ticket.duration) : '',
        price: String(ticket.price),
        description: ticket.description || '',
      });
    } else {
      form.reset({
        ticket_type: '',
        count: '',
        duration: '',
        price: '',
        description: '',
      });
    }
  }, [ticket, form]);

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: FormValues) => {
    try {
      const count = data.count && data.count.trim() !== '' ? Number(data.count) : null;
      const duration = data.duration && data.duration.trim() !== '' ? Number(data.duration) : null;
      const price = Number(data.price);

      if (isEditMode) {
        // 수정 모드
        await updateTicket.mutateAsync({
          ticketType: ticket.ticket_type,
          data: {
            count,
            duration,
            price,
            description: data.description || null,
          },
        });
      } else {
        // 등록 모드
        await createTicket.mutateAsync({
          ticket_type: data.ticket_type,
          count,
          duration,
          price,
          description: data.description || null,
        });
      }
      handleClose();
    } catch (error) {
      console.error('회원권 저장 실패:', error);
    }
  };

  /**
   * 모달 닫기 핸들러
   */
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = createTicket.isPending || updateTicket.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? '회원권 수정' : '회원권 등록'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? '회원권 정보를 수정합니다. 회원권 이름은 변경할 수 없습니다.'
              : '새로운 회원권 종류를 등록합니다.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 회원권 이름 */}
            <FormField
              control={form.control}
              name="ticket_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회원권 이름 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 10회권, 30일 자유이용권"
                      disabled={isEditMode || isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditMode
                      ? '회원권 이름은 수정할 수 없습니다.'
                      : '고유한 회원권 이름을 입력하세요.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 이용 횟수 */}
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이용 횟수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="예: 10"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>횟수권인 경우 입력</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 사용 기한 */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용 기한 (일)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="예: 30"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>모든 회원권에 적용</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 가격 */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>가격 (원) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="예: 150000"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>회원권 가격을 입력하세요.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 설명 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="회원권에 대한 설명을 입력하세요."
                      disabled={isLoading}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '저장 중...' : isEditMode ? '수정' : '등록'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};