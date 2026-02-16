import { useEffect, useState } from 'react';
import { getBudget } from '@/apis/my/mypage';

export function useBudget() {
  const [budget, setBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      setError('로그인이 필요합니다.');
      return;
    }
    getBudget(accessToken)
      .then((res) => {
        setBudget(res.result?.budget ?? 0);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : '예산 조회 실패');
      })
      .finally(() => setLoading(false));
  }, []);

  return { budget, loading, error };
}
