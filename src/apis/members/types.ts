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

// 로그인 요청
export interface LoginRequest {
  loginId: string;
  password: string;
}

// Id 찾기 요청
export interface FindIdRequest {
  name: string;
  phoneNumber: string;
}

// 비번 찾기 요청
export interface FindPwRequest {
  name: string;
  phoneNumber: string;
  loginId: string;
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

// 로그인 응답 결과
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  signupCompleted: boolean;
}

// 로그인 응답
export interface LoginResponse extends ApiResponse<LoginResult> {}

// Id 찾기 응답 결과
export interface FindIdResult {
  loginId: string;
}

// Id 찾기 응답
export interface FindIdResponse extends ApiResponse<FindIdResult> {}

// 비번 찾기 응답
export interface FindPwResponse extends ApiResponse<string> {}

// 로그아웃 응답
export interface LogoutResponse extends ApiResponse<string> {}
