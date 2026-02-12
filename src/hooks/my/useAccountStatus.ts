import { useEffect, useState } from 'react';
import { getAccountStatus } from '@/apis/my/mypage';

export function useAccountStatus() {
  const [todayRemaining, setTodayRemaining] = useState<number | null>(null);
  const [budgetDiff, setBudgetDiff] = useState<number | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayParams = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    const yesterdayParams = {
      year: yesterday.getFullYear(),
      month: yesterday.getMonth() + 1,
      day: yesterday.getDate(),
    };

    Promise.all([
      getAccountStatus(todayParams, accessToken),
      getAccountStatus(yesterdayParams, accessToken),
    ])
      .then(([todayRes, yesterdayRes]) => {
        const todayBudget = todayRes.result?.todayRemaining ?? 0;
        const yesterdayBudget = yesterdayRes.result?.todayRemaining ?? 0;
        setTodayRemaining(todayBudget);
        setBudgetDiff(todayBudget - yesterdayBudget);
      })
      .catch((e) => {
        console.error('남은 예산 조회 실패:', e);
      });
  }, []);

  return { todayRemaining, budgetDiff };
}
