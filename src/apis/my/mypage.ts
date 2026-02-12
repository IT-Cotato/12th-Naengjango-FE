import { getWithAuth, patchJsonWithAuth } from '../utils/apiClient';
import type {
  GetBudgetResponse,
  UpdateBudgetRequest,
  UpdateBudgetResponse,
  UpdateFixedExpendituresRequest,
  UpdateFixedExpendituresResponse,
  GetFixedExpendituresResponse,
  GetMeResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 마이페이지 내 정보 조회 API
export async function getMe(accessToken: string): Promise<GetMeResponse> {
  return getWithAuth<GetMeResponse>(
    `${API_BASE_URL}/api/mypage/me`,
    '내 정보 조회 실패',
    accessToken,
  );
}

// 예산 조회 API
export async function getBudget(accessToken: string): Promise<GetBudgetResponse> {
  return getWithAuth<GetBudgetResponse>(
    `${API_BASE_URL}/api/mypage/budget`,
    '예산 조회 실패',
    accessToken,
  );
}

// 예산 수정 API
export async function updateBudget(
  data: UpdateBudgetRequest,
  accessToken: string,
): Promise<UpdateBudgetResponse> {
  return patchJsonWithAuth<UpdateBudgetResponse>(
    `${API_BASE_URL}/api/mypage/budget`,
    data,
    '예산 수정 실패',
    accessToken,
  );
}

// 고정지출 조회 API
export async function getFixedExpenditures(
  accessToken: string,
): Promise<GetFixedExpendituresResponse> {
  return getWithAuth<GetFixedExpendituresResponse>(
    `${API_BASE_URL}/api/mypage/fixed-expenditures`,
    '고정지출 조회 실패',
    accessToken,
  );
}

// 고정지출 수정 API
export async function updateFixedExpenditures(
  data: UpdateFixedExpendituresRequest,
  accessToken: string,
): Promise<UpdateFixedExpendituresResponse> {
  return patchJsonWithAuth<UpdateFixedExpendituresResponse>(
    `${API_BASE_URL}/api/mypage/fixed-expenditures`,
    data,
    '고정지출 수정 실패',
    accessToken,
  );
}
