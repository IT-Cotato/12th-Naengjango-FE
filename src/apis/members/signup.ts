import type {
  CheckIdRequest,
  CheckIdResponse,
  SignupRequest,
  SignupResponse,
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  VerifySmsResponse,
  FindIdRequest,
  FindIdResponse,
  FindPwRequest,
  FindPwResponse,
} from './types';
import { postJson } from '../utils/apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// SMS 인증번호 발송 api
export async function sendSms(data: SendSmsRequest): Promise<SendSmsResponse> {
  return postJson<SendSmsResponse>(`${API_BASE_URL}/api/sms/send`, data, '인증번호 발송 실패');
}

// SMS 인증번호 검증 api
export async function verifySms(data: VerifySmsRequest): Promise<VerifySmsResponse> {
  return postJson<VerifySmsResponse>(`${API_BASE_URL}/api/sms/verify`, data, '인증번호 검증 실패');
}

// id 중복 확인 api
export async function checkId(data: CheckIdRequest): Promise<CheckIdResponse> {
  const queryParams = new URLSearchParams({ loginId: data.loginId });
  const res = await fetch(`${API_BASE_URL}/api/members/check-id?${queryParams}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const responseData = await res.json();

  if (!res.ok || !responseData.isSuccess) {
    const message = responseData.message || 'ID 중복 확인 실패';
    throw new Error(message);
  }

  return responseData;
}

// 일반 회원가입 api
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return postJson<SignupResponse>(`${API_BASE_URL}/api/members/signup`, data, '회원가입 실패');
}

// 아이디 찾기 api
export async function findLoginId(data: FindIdRequest): Promise<FindIdResponse> {
  return postJson<FindIdResponse>(`${API_BASE_URL}/auth/find-loginId`, data, '아이디 찾기 실패');
}

// 비번 찾기 api
export async function findLoginPw(data: FindPwRequest): Promise<FindPwResponse> {
  return postJson<FindPwResponse>(`${API_BASE_URL}/auth/find-password`, data, '비번 찾기 실패');
}