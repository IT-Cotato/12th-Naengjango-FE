// --- Request Types ---

// SMS 인증번호 발송 요청
export interface SendSmsRequest {
  phoneNumber: string;
}

// SMS 인증번호 검증 요청
export interface VerifySmsRequest {
  phoneNumber: string;
  verifyCode: string;
}

// ID 중복 확인 요청
export interface CheckIdRequest {
  loginId: string; 
}

// 회원가입 요청
export interface SignupRequest {
  name: string;
  phoneNumber: string;
  loginId: string;
  password: string;
  agreedAgreementIds: number[];
  budget?: number;
  fixedExpenditures?: Array<{ item: string; amount: number }>;
}





// --- Response Types ---

// 공통 API 응답 타입
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code?: string;
  message?: string;
  result?: T;
}

// SMS 인증번호 발송 응답
export interface SendSmsResponse extends ApiResponse<string> {}

// SMS 인증번호 검증 응답
export interface VerifySmsResponse extends ApiResponse<string> {}

// ID 중복 확인 응답
export interface CheckIdResponse extends ApiResponse<boolean> {
  // result: false = 사용 가능, true = 중복
}

// 회원가입 응답
export interface SignupResponse extends ApiResponse<string> {}




