import { getWithAuth, postJsonWithAuth, patchJsonWithAuth } from '../utils/apiClient';
import type {
  GetHomeDataResponse,
  GetBudgetDataResponse,
  GetSnowballDataResponse,
  GetNotificationDataResponse,
  GetIglooStatusDataResponse,
  PostIglooUpgradeResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 예산 오늘 증감액, 파산 플랜 조회 API
export async function getHomeData(accessToken: string): Promise<GetHomeDataResponse> {
  return getWithAuth<GetHomeDataResponse>(
    `${API_BASE_URL}/api/reports/daily-budget`,
    '오늘 증감액 조회 실패',
    accessToken,
  );
}

// 오늘 남은 예산 조회 API
export async function getBudgetData(accessToken: string): Promise<GetBudgetDataResponse> {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JS month는 0~11
  const day = today.getDate();
  return getWithAuth<GetBudgetDataResponse>(
    `${API_BASE_URL}/api/accounts/status?year=${year}&month=${month}&day=${day}`,
    '오늘 증감액 조회 실패',
    accessToken,
  );
}

// 눈덩이 수 조회 API
export async function getSnowballData(accessToken: string): Promise<GetSnowballDataResponse> {
  return getWithAuth<GetSnowballDataResponse>(
    `${API_BASE_URL}/api/snowballs/summary`,
    '눈덩이 수 조회 실패',
    accessToken,
  );
}

// 알림 조회 API
export async function getNotificationData(
  accessToken: string,
): Promise<GetNotificationDataResponse> {
  return getWithAuth<GetNotificationDataResponse>(
    `${API_BASE_URL}/api/notifications/unread-count`,
    '알림 수 조회 실패',
    accessToken,
  );
}

// 이글루 상태 조회 API
export async function getIglooStatusData(accessToken: string): Promise<GetIglooStatusDataResponse> {
  return getWithAuth<GetIglooStatusDataResponse>(
    `${API_BASE_URL}/api/igloo/status`,
    '이글루 상태 정보 조회 실패',
    accessToken,
  );
}

// 이글루 업그레이드 API
export async function postIglooUpgrade(accessToken: string): Promise<PostIglooUpgradeResponse> {
  return postJsonWithAuth<PostIglooUpgradeResponse>(
    `${API_BASE_URL}/api/igloo/upgrade`,
    {},
    '이글루 업그레이드 실패',
    accessToken,
  );
}
