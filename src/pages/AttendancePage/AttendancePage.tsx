// src/pages/AttendancePage/AttendancePage.tsx

import { useState, useEffect } from 'react';
import { CheckSquare, Check, AlertCircle, Ticket, Calendar, Hash, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAttendanceCheck } from '@/hooks/useAttendanceCheck';
import { AttendanceCheckResponse } from '@/types/attendance.types';

export default function AttendancePage() {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<AttendanceCheckResponse | null>(null);
  const [countdown, setCountdown] = useState(5);
  const { mutate, isPending, error, reset, getErrorMessage } = useAttendanceCheck();

  /**
   * 출석 성공 후 5초 카운트다운 및 자동 초기화
   */
  useEffect(() => {
    if (result) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleReset();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [result]);

  /**
   * 터치패널 숫자 버튼 클릭
   */
  const handleNumberClick = (num: string) => {
    if (phone.length >= 13) return;
    const newPhone = phone + num;
    const formatted = formatPhoneNumber(newPhone);
    setPhone(formatted);
    
    if (error) {
      reset();
    }
  };

  /**
   * 터치패널 삭제 버튼
   */
  const handleDelete = () => {
    setPhone((prev) => {
      const newPhone = prev.slice(0, -1);
      return formatPhoneNumber(newPhone.replace(/-/g, ''));
    });
  };

  /**
   * 전화번호 포맷팅 (자동 하이픈 추가)
   */
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  /**
   * 출석 체크 제출
   */
  const handleSubmit = () => {
    if (!phone.trim() || isPending) return;

    mutate(
      { phone: phone.trim() },
      {
        onSuccess: (data) => {
          setResult(data);
          setPhone('');
          setCountdown(5);
        },
      }
    );
  };

  /**
   * 결과 초기화 (새로운 출석 체크)
   */
  const handleReset = () => {
    setResult(null);
    setPhone('');
    setCountdown(5);
    reset();
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* 출석 성공 결과 */}
        {result ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* 성공 메시지 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
              
              <div className="text-center space-y-1">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                  출석 완료
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {countdown}초 후 자동으로 돌아갑니다
                </p>
              </div>
            </div>

            {/* 회원 정보 카드 */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-medium mb-1">{result.memberName}</h2>
                  <p className="text-slate-500 dark:text-slate-400">{result.phone}</p>
                </div>

                {/* 회원권 정보 또는 경고 */}
                {!result.ticketType ? (
                  <Alert className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-900 dark:text-amber-200">
                      활성화된 회원권이 없습니다
                    </AlertDescription>
                  </Alert>
                ) : result.message.includes('만료됨') ? (
                  <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-900 dark:text-red-200">
                      회원권이 만료되었습니다
                    </AlertDescription>
                  </Alert>
                ) : result.message.includes('남은 횟수 없음') ? (
                  <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-900 dark:text-red-200">
                      남은 횟수가 없습니다
                    </AlertDescription>
                  </Alert>
                ) : null}

                {result.ticketType && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-900">
                      <div className="flex items-center gap-3">
                        <Ticket className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">회원권</p>
                          <p className="font-medium">{result.ticketType}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {result.remainCount !== null && (
                        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900">
                          <div className="flex items-center gap-2 mb-2">
                            <Hash className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">남은 횟수</p>
                          </div>
                          <p className="text-2xl font-medium">{result.remainCount}회</p>
                        </div>
                      )}

                      {result.remainDays !== null && (
                        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900 relative">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">남은 기간</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-medium">{result.remainDays}일</p>
                            {result.remainDays <= 7 && result.remainDays > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                만료임박
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {result.endDate && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(result.startDate)} ~ {formatDate(result.endDate)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 총 출석 횟수 */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">총 출석</p>
                    </div>
                    <p className="text-2xl font-medium">{result.attendance}회</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* 출석 체크 폼 */
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* 헤더 */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 dark:bg-slate-100 mb-2">
                <CheckSquare className="h-7 w-7 text-slate-50 dark:text-slate-900" />
              </div>
              <h1 className="text-3xl font-semibold">출석 체크</h1>
              <p className="text-slate-500 dark:text-slate-400">전화번호를 입력해주세요</p>
            </div>

            {/* 메인 카드 */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* 전화번호 디스플레이 */}
                  <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-3xl font-light font-mono text-center tracking-wider min-h-[48px] flex items-center justify-center">
                      {phone || <span className="text-slate-300 dark:text-slate-700">010-0000-0000</span>}
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="border-red-200 dark:border-red-900">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{getErrorMessage(error)}</AlertDescription>
                    </Alert>
                  )}

                  {/* 터치패널 */}
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        className="aspect-square rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all duration-150 text-2xl font-light disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleNumberClick(num.toString())}
                        disabled={isPending}
                      >
                        {num}
                      </button>
                    ))}
                    
                    <button
                      className="aspect-square rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleDelete}
                      disabled={isPending}
                    >
                      <Delete className="h-6 w-6 mx-auto text-slate-600 dark:text-slate-400" />
                    </button>
                    
                    <button
                      className="aspect-square rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all duration-150 text-2xl font-light disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleNumberClick('0')}
                      disabled={isPending}
                    >
                      0
                    </button>
                    
                    <button
                      className="aspect-square rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all duration-150 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setPhone('')}
                      disabled={isPending}
                    >
                      전체삭제
                    </button>
                  </div>

                  {/* 출석 체크 버튼 */}
                  <Button
                    className="w-full h-14 text-base font-medium rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900"
                    onClick={handleSubmit}
                    disabled={phone.length < 13 || isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin mr-2" />
                        처리 중
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-5 w-5 mr-2" />
                        출석 체크
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 테스트용 안내 */}
            {import.meta.env.VITE_USE_MOCK === 'true' && (
              <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 text-sm">테스트용 전화번호</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">정상 출석 (30일권)</span>
                      <code className="px-2 py-1 rounded bg-white dark:bg-slate-900 font-mono">010-1234-5678</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">정상 출석 (10회권)</span>
                      <code className="px-2 py-1 rounded bg-white dark:bg-slate-900 font-mono">010-2345-6789</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">회원권 없음</span>
                      <code className="px-2 py-1 rounded bg-white dark:bg-slate-900 font-mono">010-3456-7890</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}