import type {
  CheckIdRequest,
  CheckIdResponse,
  SignupRequest,
  SignupResponse,
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  VerifySmsResponse,
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
