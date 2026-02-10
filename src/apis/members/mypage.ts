import { patchJsonWithAuth } from "../utils/apiClient";
import type { UpdateBudgetRequest, UpdateBudgetResponse, UpdateFixedExpendituresRequest, UpdateFixedExpendituresResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 예산 수정 API
export async function updateBudget(
  data: UpdateBudgetRequest,
  accessToken: string
): Promise<UpdateBudgetResponse> {
  return patchJsonWithAuth<UpdateBudgetResponse>(
    `${API_BASE_URL}/api/mypage/budget`,
    data,
    '예산 수정 실패',
    accessToken
  );
}

// 고정지출 수정 API
export async function updateFixedExpenditures(
  data: UpdateFixedExpendituresRequest,
  accessToken: string
): Promise<UpdateFixedExpendituresResponse> {
  return patchJsonWithAuth<UpdateFixedExpendituresResponse>(
    `${API_BASE_URL}/api/mypage/fixed-expenditures`,
    data,
    '고정지출 수정 실패',
    accessToken
  );
}