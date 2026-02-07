import type { LoginRequest, LoginResponse } from './types';
import { postJson } from '../utils/apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 로그인 API
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return postJson<LoginResponse>(`${API_BASE_URL}/auth/login`, data, '로그인 실패');
}
