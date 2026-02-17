import { useEffect, useState } from 'react';
import { getFixedExpenditures } from '@/apis/my/mypage';
import { getAllCategoryItems } from '@/constants/categories';

export type FixCost = {
  id: string;
  amount: string;
};

function mapApiItemsToFixCosts(items: Array<{ item: string; amount: number }>): FixCost[] {
  const allItems = getAllCategoryItems();
  return items.map(({ item: labelOrId, amount }) => {
    const byLabel = allItems.find((c) => c.label === labelOrId);
    const byId = allItems.find((c) => c.id === labelOrId);
    const id = byLabel?.id ?? byId?.id ?? labelOrId;
    return { id, amount: String(amount) };
  });
}

export function useFixedExpenditures() {
  const [items, setItems] = useState<FixCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      setError('로그인이 필요합니다.');
      return;
    }
    getFixedExpenditures(accessToken)
      .then((res) => {
        const list = res.result?.items ?? [];
        setItems(mapApiItemsToFixCosts(list));
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : '고정지출 조회 실패');
      })
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}
