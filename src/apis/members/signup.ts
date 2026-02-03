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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// SMS 인증번호 발송 api
export async function sendSms(data: SendSmsRequest): Promise<SendSmsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/sms/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok || !responseData.isSuccess) {
    const message = responseData.message || responseData.result || '인증번호 발송 실패';
    throw new Error(message);
  }

  return responseData;
}

// SMS 인증번호 검증 api
export async function verifySms(data: VerifySmsRequest): Promise<VerifySmsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/sms/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok || !responseData.isSuccess) {
    const message = responseData.message || responseData.result || '인증번호 검증 실패';
    throw new Error(message);
  }

  return responseData;
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
  const res = await fetch(`${API_BASE_URL}/api/members/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok || !responseData.isSuccess) {
    const message = responseData.message || '회원가입 실패';
    throw new Error(message);
  }

  return responseData;
}

