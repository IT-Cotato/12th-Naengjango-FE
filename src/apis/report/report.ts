import { getWithAuth } from '../utils/apiClient';
import type { GetReportRequest, GetReportResponse, GetDailyBudgetResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 냉동 절약 효과 리포트 조회 API
export async function getReport(
  params: GetReportRequest,
  accessToken: string,
): Promise<GetReportResponse> {
  const query = new URLSearchParams({ period: params.period });
  return getWithAuth<GetReportResponse>(
    `${API_BASE_URL}/api/reports/savings-effect?${query}`,
    '리포트 조회 실패',
    accessToken,
  );
}

// 하루 가용 예산 및 파산 시나리오 조회 API
export async function getDailyBudget(accessToken: string): Promise<GetDailyBudgetResponse> {
  return getWithAuth<GetDailyBudgetResponse>(
    `${API_BASE_URL}/api/reports/daily-budget`,
    '예산 조회 실패',
    accessToken,
  );
}
