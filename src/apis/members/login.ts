import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  WithdrawalResponse,
  RefreshTokenResponse,
} from './types';
import { postJson, postJsonWithAuth } from '../utils/apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 로그인 API
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return postJson<LoginResponse>(`${API_BASE_URL}/auth/login`, data, '로그인 실패');
}

// 로그아웃 API
export async function logout(accessToken: string): Promise<LogoutResponse> {
  return postJsonWithAuth<LogoutResponse>(
    `${API_BASE_URL}/auth/logout`,
    {},
    '로그아웃 실패',
    accessToken,
  );
}

// 탈퇴 API
export async function withdrawal(accessToken: string): Promise<WithdrawalResponse> {
  return postJsonWithAuth<WithdrawalResponse>(
    `${API_BASE_URL}/api/mypage/withdrawal`,
    {},
    '탈퇴 실패',
    accessToken,
  );
}

// 구글 로그인 리다이렉트
// redirectUri: OAuth 성공 후 돌아올 프론트 주소
export function getGoogleLoginUrl(redirectUri?: string): string {
  const url = `${API_BASE_URL}/auth/login/google`;
  if (redirectUri) {
    return `${url}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }
  return url;
}

// 토큰 재발급 API
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  return postJson<RefreshTokenResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    '토큰 재발급 실패',
  );
}
