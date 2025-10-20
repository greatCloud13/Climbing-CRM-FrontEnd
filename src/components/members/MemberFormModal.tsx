// ============================================
// src/components/members/MemberFormModal.tsx
// 회원 등록/수정 폼 모달
// ============================================

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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCreateMember, useUpdateMember } from '@/hooks/useMemberMutations';
import type { Member, CreateMemberDto, UpdateMemberDto } from '@/types/member.types';

// 폼 검증 스키마
const memberFormSchema = z.object({
  username: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  phone: z.string()
    .regex(/^010-\d{4}-\d{4}$/, '연락처 형식이 올바르지 않습니다. (예: 010-1234-5678)'),
  email: z.string().email('이메일 형식이 올바르지 않습니다.').optional().or(z.literal('')),
  birth_date: z.string().optional().or(z.literal('')),
  gender: z.enum(['M', 'F', 'OTHER', 'none']).optional(),
  region_id: z.string().min(1, '지점을 선택해주세요.'),
  status: z.enum(['ACTIVE', 'PAUSED', 'EXPIRED', 'WITHDRAWN']),
  memo: z.string().optional().or(z.literal('')),
  emergency_contact: z.string().optional().or(z.literal('')),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

interface MemberFormModalProps {
  open: boolean;
  onClose: () => void;
  member?: Member | null;
  regions?: Array<{ id: number; name: string }>;
  onSuccess?: () => void;
}

/**
 * 회원 등록/수정 폼 모달
 */
export const MemberFormModal = ({
  open,
  onClose,
  member,
  regions = [],
  onSuccess,
}: MemberFormModalProps) => {
  const isEdit = !!member;
  
  const { mutate: createMember, isPending: isCreating } = useCreateMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const isPending = isCreating || isUpdating;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      username: '',
      phone: '',
      email: '',
      birth_date: '',
      gender: 'none',
      region_id: '',
      status: 'ACTIVE',
      memo: '',
      emergency_contact: '',
    },
  });

  // 수정 모드일 때 기존 데이터 채우기
  useEffect(() => {
    if (member && open) {
      form.reset({
        username: member.username,
        phone: member.phone,
        email: member.email || '',
        birth_date: member.birth_date || '',
        gender: member.gender || 'none',
        region_id: String(member.region_id),
        status: member.status,
        memo: member.memo || '',
        emergency_contact: member.emergency_contact || '',
      });
    } else if (!open) {
      form.reset();
    }
  }, [member, open, form]);

  // 폼 제출 핸들러
  const onSubmit = (values: MemberFormValues) => {
    if (isEdit && member) {
      const updateData: UpdateMemberDto = {
        id: member.id,
        username: values.username,
        phone: values.phone,
        email: values.email || undefined,
        birth_date: values.birth_date || undefined,
        gender: values.gender !== 'none' ? values.gender : undefined,
        region_id: Number(values.region_id),
        status: values.status,
        memo: values.memo || undefined,
        emergency_contact: values.emergency_contact || undefined,
      };

      updateMember(updateData, {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        },
        onError: (error) => {
          console.error('회원 수정 실패:', error);
          alert('회원 수정에 실패했습니다. 다시 시도해주세요.');
        },
      });
    } else {
      const createData: CreateMemberDto = {
        username: values.username,
        phone: values.phone,
        email: values.email || undefined,
        birth_date: values.birth_date || undefined,
        gender: values.gender !== 'none' ? values.gender : undefined,
        region_id: Number(values.region_id),
        status: values.status,
        memo: values.memo || undefined,
        emergency_contact: values.emergency_contact || undefined,
      };

      createMember(createData, {
        onSuccess: () => {
          onClose();
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          console.error('회원 등록 실패:', error);
          alert('회원 등록에 실패했습니다. 다시 시도해주세요.');
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? '회원 정보 수정' : '새 회원 등록'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? '회원의 정보를 수정합니다. 필수 항목을 모두 입력해주세요.'
              : '새로운 회원을 등록합니다. 필수 항목을 모두 입력해주세요.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름 *</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처 *</FormLabel>
                      <FormControl>
                        <Input placeholder="010-1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>생년월일</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>성별</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">선택 안 함</SelectItem>
                          <SelectItem value="M">남성</SelectItem>
                          <SelectItem value="F">여성</SelectItem>
                          <SelectItem value="OTHER">기타</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비상연락처</FormLabel>
                      <FormControl>
                        <Input placeholder="010-9999-8888" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 지점 및 상태 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">지점 및 상태</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="region_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>지점 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="지점 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.id} value={String(region.id)}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상태 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">활성</SelectItem>
                          <SelectItem value="PAUSED">일시정지</SelectItem>
                          <SelectItem value="EXPIRED">만료</SelectItem>
                          <SelectItem value="WITHDRAWN">탈퇴</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 메모 */}
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메모</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="회원에 대한 특이사항을 입력하세요."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    관리자만 볼 수 있는 메모입니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? '수정' : '등록'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};