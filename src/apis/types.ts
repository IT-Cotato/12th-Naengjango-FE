// 공통 API 응답 타입
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code?: string;
  message?: string;
  result?: T;
}
