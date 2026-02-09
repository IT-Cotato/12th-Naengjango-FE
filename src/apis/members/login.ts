import type { LoginRequest, LoginResponse, LogoutResponse, } from './types';
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
    accessToken
  );
}
