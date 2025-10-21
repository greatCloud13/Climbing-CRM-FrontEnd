// src/hooks/useAttendanceCheck.ts

import { useMutation } from '@tanstack/react-query';
import { checkAttendance } from '@/api/services/attendance.service';
import {
  AttendanceCheckRequest,
  AttendanceCheckResponse,
  AttendanceErrorType,
  ATTENDANCE_ERROR_MESSAGES,
} from '@/types/attendance.types';

/**
 * 출석 체크 Hook
 * 
 * @returns mutation 객체 및 에러 메시지 변환 함수
 */
export const useAttendanceCheck = () => {
  const mutation = useMutation<
    AttendanceCheckResponse,
    Error,
    AttendanceCheckRequest
  >({
    mutationFn: checkAttendance,
  });

  /**
   * 에러 메시지 변환
   */
  const getErrorMessage = (error: Error | null): string => {
    if (!error) return '';

    const errorType = error.message as AttendanceErrorType;
    
    // 정의된 에러 타입인 경우
    if (errorType in ATTENDANCE_ERROR_MESSAGES) {
      return ATTENDANCE_ERROR_MESSAGES[errorType];
    }

    // 네트워크 에러
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return ATTENDANCE_ERROR_MESSAGES[AttendanceErrorType.NETWORK_ERROR];
    }

    // 기타 에러
    return ATTENDANCE_ERROR_MESSAGES[AttendanceErrorType.UNKNOWN_ERROR];
  };

  return {
    ...mutation,
    getErrorMessage,
  };
};