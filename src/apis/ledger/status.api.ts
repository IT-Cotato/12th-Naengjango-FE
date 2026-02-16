import { api } from '@/lib/api';

/* ---------------- 공통 응답 타입 ---------------- */

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

/* ---------------- 일 단위 응답 ---------------- */

export type BudgetStatusResult = {
  todayRemaining: number;
  monthRemaining: number;
};

export async function getBudgetStatus(params: {
  year: number;
  month: number;
  day: number;
}): Promise<BudgetStatusResult> {
  const res = await api.get<ApiResponse<BudgetStatusResult>>('/api/accounts/status', { params });

  const result = res.data?.result;

  return {
    todayRemaining: Number(result?.todayRemaining ?? 0),
    monthRemaining: Number(result?.monthRemaining ?? 0),
  };
}
