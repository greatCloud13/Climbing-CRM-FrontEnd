// src/components/domain/dashboard/AttendanceChart.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { AttendanceTrend } from '@/types/dashboard.types';

/**
 * AttendanceChart Props 인터페이스
 */
interface AttendanceChartProps {
  /** 출석 추이 데이터 */
  data: AttendanceTrend[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 차트 제목 */
  title?: string;
  /** 차트 높이 (px) */
  height?: number;
  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 출석 추이 차트 컴포넌트
 * 
 * 일별 출석 데이터를 선 그래프로 표시합니다.
 * recharts 라이브러리를 사용하여 반응형 차트를 구현합니다.
 * 
 * @example
 * <AttendanceChart
 *   data={attendanceTrend}
 *   title="최근 7일 출석 추이"
 *   isLoading={false}
 * />
 */
export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  data,
  isLoading = false,
  title = '출석 추이',
  height = 300,
  className = '',
}) => {
  // 차트용 데이터 포맷팅
  const chartData = data.map((item) => ({
    date: format(parseISO(item.date), 'MM/dd', { locale: ko }),
    fullDate: format(parseISO(item.date), 'yyyy년 MM월 dd일', { locale: ko }),
    count: item.count,
  }));

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {payload[0].payload.fullDate}
          </p>
          <p className="text-sm text-primary font-semibold mt-1">
            출석: {payload[0].value}명
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          // 로딩 스켈레톤
          <div 
            className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ height: `${height}px` }}
          />
        ) : data.length === 0 ? (
          // 데이터 없음
          <div 
            className="flex items-center justify-center text-muted-foreground"
            style={{ height: `${height}px` }}
          >
            <p>출석 데이터가 없습니다.</p>
          </div>
        ) : (
          // 차트
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              {/* 그리드 */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#d1d5db" 
                strokeWidth={1.5}
                className="dark:stroke-gray-600"
              />
              
              {/* X축 (날짜) */}
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-gray-600 dark:text-gray-400"
              />
              
              {/* Y축 (출석 수) */}
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-gray-600 dark:text-gray-400"
                allowDecimals={false}
              />
              
              {/* 툴팁 */}
              <Tooltip content={<CustomTooltip />} />
              
              {/* 선 그래프 */}
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ea580c' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* 통계 요약 (차트 아래) */}
        {!isLoading && data.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">평균</p>
                <p className="text-sm font-semibold mt-1">
                  {Math.round(
                    data.reduce((sum, item) => sum + item.count, 0) / data.length
                  )}명
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">최대</p>
                <p className="text-sm font-semibold mt-1">
                  {Math.max(...data.map(item => item.count))}명
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">최소</p>
                <p className="text-sm font-semibold mt-1">
                  {Math.min(...data.map(item => item.count))}명
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;