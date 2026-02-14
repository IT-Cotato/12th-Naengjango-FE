import { useEffect, useState } from 'react';
import { getReport } from '@/apis/report/report';
import type { GetReportResult } from '@/apis/report/types';

const DEFAULT_PERIOD = 'month';

export function useReport() {
  const [data, setData] = useState<GetReportResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      return;
    }
    getReport({ period: DEFAULT_PERIOD }, accessToken)
      .then((res) => {
        if (res.result) setData(res.result);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : '리포트 조회 실패');
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
