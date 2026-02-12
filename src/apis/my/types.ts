// --- Request Types ---

// 예산 수정 요청
export interface UpdateBudgetRequest {
  budget: number;
}

// 고정지출 수정 요청
export interface UpdateFixedExpendituresRequest {
  items: Array<{ item: string; amount: number }>;
}

// 문의하기 등록 요청
export interface RegisterInquiryRequest {
  title: string;
  content: string;
}

// 남은 예산 조회 요청
export interface GetAccountStatusRequest {
  year: number;
  month: number;
  day: number;
}

// --- Response Types ---

// 공통 API 응답 타입
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code?: string;
  message?: string;
  result?: T;
}

// 예산 조회 응답 결과
export interface GetBudgetResult {
  budget: number;
}

// 예산 조회 응답
export interface GetBudgetResponse extends ApiResponse<GetBudgetResult> {}

// 예산 수정 응답
export interface UpdateBudgetResponse extends ApiResponse<GetBudgetResult> {}

// 고정지출 조회 응답 결과 (result 필드)
export interface GetFixedExpendituresResult {
  items: Array<{ item: string; amount: number }>;
}

// 고정지출 조회 응답
export interface GetFixedExpendituresResponse extends ApiResponse<GetFixedExpendituresResult> {}

// 고정지출 수정 응답 결과
export interface UpdateFixedExpendituresResult {
  items: Array<{ item: string; amount: number }>;
}

// 고정지출 수정 응답
export interface UpdateFixedExpendituresResponse extends ApiResponse<UpdateFixedExpendituresResult> {}

// 마이페이지 내 정보 조회 응답 결과
export interface GetMeResult {
  id: number;
  name: string;
  loginId: string;
  phoneNumber: string;
  budget: number;
  socialType: string;
  role: string;
  createdAt: string;
}

// 마이페이지 내 정보 조회 응답
export interface GetMeResponse extends ApiResponse<GetMeResult> {}

// 문의하기 등록 응답
export interface RegisterInquiryResponse extends ApiResponse {}

// 남은 예산 조회 응답 결과
export interface GetAccountStatusResult {
  todayRemaining: number;
  monthRemaining: number;
}

// 남은 예산 조회 응답
export interface GetAccountStatusResponse extends ApiResponse<GetAccountStatusResult> {}
