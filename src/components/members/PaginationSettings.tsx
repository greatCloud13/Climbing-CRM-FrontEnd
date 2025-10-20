// ============================================
// src/components/members/PaginationSettings.tsx
// 페이지네이션 설정 컴포넌트
// ============================================

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationSettingsProps {
  limit: number;
  total: number;
  onLimitChange: (limit: number) => void;
}

/**
 * 페이지네이션 설정 컴포넌트
 */
export const PaginationSettings = ({
  limit,
  total,
  onLimitChange,
}: PaginationSettingsProps) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">페이지당</span>
      <Select
        value={String(limit)}
        onValueChange={(value) => onLimitChange(Number(value))}
      >
        <SelectTrigger className="w-[80px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-muted-foreground">개씩 보기</span>
      <span className="text-muted-foreground ml-2">
        (총 <span className="font-semibold text-foreground">{total}</span>명)
      </span>
    </div>
  );
};