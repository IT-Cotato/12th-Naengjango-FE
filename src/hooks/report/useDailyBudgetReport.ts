import { useEffect, useState } from 'react';
import { getDailyBudget } from '@/apis/report/report';
import type { GetDailyBudgetResult } from '@/apis/report/types';

export function useDailyBudgetReport() {
  const [data, setData] = useState<GetDailyBudgetResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      setError('로그인이 필요합니다.');
      return;
    }
    getDailyBudget(accessToken)
      .then((res) => {
        if (res.result) setData(res.result);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : '예산 조회 실패');
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
