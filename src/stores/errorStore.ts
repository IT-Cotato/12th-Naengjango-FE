import { create } from 'zustand';

/**
 * 전역 에러 타입
 *
 * - auth: 로그인 만료/필요
 *   → setError('auth') 호출 시 앱이 토큰 제거 후 로그인 페이지(/login)로 이동
 *
 * - other: 그 외 오류 (네트워크, 500 에러, 기타 API 실패)
 *   → setError('other') 호출 시 에러 전용 페이지(/error)로 이동
 *
 */
export type ErrorType = 'auth' | 'other' | null;

export interface ErrorState {
  errorType: ErrorType;
  setError: (type: ErrorType) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errorType: null,
  setError: (type) => set({ errorType: type }),
  clearError: () => set({ errorType: null }),
}));
