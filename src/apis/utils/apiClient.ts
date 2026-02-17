import type { LoginResult } from '../members/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 토큰 재발급 중복 요청 방지
let refreshTokenPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;

// 공통 fetch 및 응답 처리
async function fetchAndParseResponse<T>(res: Response, defaultErrorMessage: string): Promise<T> {
  let responseData: any;
  try {
    const text = await res.text();
    responseData = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('서버 응답을 파싱할 수 없습니다.');
  }

  if (!res.ok || !responseData.isSuccess) {
    const message = responseData.message || defaultErrorMessage;
    throw new Error(message);
  }

  return responseData as T;
}

// 공통 post json 요청 함수
export async function postJson<T>(
  url: string,
  data: unknown,
  defaultErrorMessage: string,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return fetchAndParseResponse<T>(res, defaultErrorMessage);
}

// 토큰 재발급
async function refreshTokens(): Promise<{ accessToken: string; refreshToken: string }> {
  // 이미 재발급 요청이 진행 중이면 기존 Promise 반환
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  const refreshToken = localStorage.getItem('refreshToken');

  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  if (!refreshToken) {
    throw new Error('로그인이 필요합니다.');
  }

  // 재발급 Promise 생성 및 저장
  refreshTokenPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      // fetchAndParseResponse를 사용하여 응답 파싱
      interface RefreshTokenResponse {
        isSuccess: boolean;
        result: LoginResult;
        message?: string;
      }

      const data = await fetchAndParseResponse<RefreshTokenResponse>(res, '토큰 재발급 실패');

      if (!data.result) {
        // 재발급 실패 시 저장된 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('토큰 재발급에 실패했습니다.');
      }

      const { accessToken, refreshToken: newRefreshToken } = data.result;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // 재발급 실패 시 저장된 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    } finally {
      // Promise 완료 후 null로 초기화
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
}

// 인증이 필요한 공통 fetch 함수
async function fetchWithAuth<T>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH',
  data: unknown,
  defaultErrorMessage: string,
  accessToken: string,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (method !== 'GET') {
    fetchOptions.body = JSON.stringify(data);
  }

  let res = await fetch(url, fetchOptions);

  // 토큰 만료 시 한 번만 재발급 시도 후 재요청
  if (res.status === 401) {
    try {
      const { accessToken: newAccessToken } = await refreshTokens();

      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      const retryOptions: RequestInit = {
        ...fetchOptions,
        headers: retryHeaders,
      };

      res = await fetch(url, retryOptions);
    } catch (e) {
      // 재발급 실패 시 원래 에러 메시지 그대로
      throw e;
    }
  }

  return fetchAndParseResponse<T>(res, defaultErrorMessage);
}

// 인증이 필요한 GET 요청 함수
export async function getWithAuth<T>(
  url: string,
  defaultErrorMessage: string,
  accessToken: string,
): Promise<T> {
  return fetchWithAuth<T>(url, 'GET', undefined, defaultErrorMessage, accessToken);
}

// 인증이 필요한 post json 요청 함수
export async function postJsonWithAuth<T>(
  url: string,
  data: unknown,
  defaultErrorMessage: string,
  accessToken: string,
): Promise<T> {
  return fetchWithAuth<T>(url, 'POST', data, defaultErrorMessage, accessToken);
}

// patch json 요청 함수
export async function patchJsonWithAuth<T>(
  url: string,
  data: unknown,
  defaultErrorMessage: string,
  accessToken: string,
): Promise<T> {
  return fetchWithAuth<T>(url, 'PATCH', data, defaultErrorMessage, accessToken);
}
