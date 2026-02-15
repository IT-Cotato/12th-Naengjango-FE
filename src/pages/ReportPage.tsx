import { useState, useMemo, useEffect } from 'react';
import DailyBudgetChart from '@/components/report/DailyBudgetChart';
import ReportTab, { type ReportTabKey } from '@/components/report/ReportTab';
import ScenarioChart from '@/components/report/ScenarioChart';
import FreezeEffectCard from '@/components/report/FreezeEffectCard';
import DailyFreezeSuccessRate from '@/components/report/DailyFreezeSuccessRate';
import { useReport } from '@/hooks/report/useReport';
import { useDailyBudgetReport } from '@/hooks/report/useDailyBudgetReport';
import { useAccountStatus } from '@/hooks/my/useAccountStatus';
import { getMe } from '@/apis/my/mypage';

const DAY_LABELS_DAILY = ['7일 전', '6일 전', '5일 전', '4일 전', '3일 전', '2일 전', '1일 전'];
const DAY_LABELS = ['7일 전', '6일 전', '5일 전', '4일 전', '3일 전', '2일 전', '1일 전', '오늘'];

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState<ReportTabKey>('daily');
  const [name, setName] = useState<string>('');
  const { data: reportData } = useReport();
  const { data: dailyBudgetData } = useDailyBudgetReport();
  const { todayRemaining, budgetDiff } = useAccountStatus();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    getMe(accessToken)
      .then((res) => {
        if (res.result?.name) setName(res.result.name);
      })
      .catch(() => {});
  }, []);

  const dailyChartLabels = useMemo(
    () =>
      dailyBudgetData?.dailyTrends?.length
        ? DAY_LABELS_DAILY.slice(-dailyBudgetData.dailyTrends.length)
        : [],
    [dailyBudgetData?.dailyTrends],
  );
  const dailyChartValues = useMemo(
    () => dailyBudgetData?.dailyTrends?.map((t) => t.amount) ?? [],
    [dailyBudgetData?.dailyTrends],
  );
  const todayBudgetText =
    todayRemaining !== null ? `${todayRemaining.toLocaleString()}원` : '';
  const diffText =
    budgetDiff !== null && budgetDiff !== 0
      ? budgetDiff > 0
        ? `${budgetDiff.toLocaleString()}▲`
        : `${Math.abs(budgetDiff).toLocaleString()}▼`
      : '';

  const scenarioItems = useMemo(() => {
    if (!dailyBudgetData?.bankruptcyPrediction?.length) return [];
    const pred = dailyBudgetData.bankruptcyPrediction;
    return pred.map((item, i) => {
      const from = new Date(item.baseDate).getTime();
      const to = new Date(item.expectedDate).getTime();
      const days = Math.max(0, Math.ceil((to - from) / (24 * 60 * 60 * 1000)));
      return { label: DAY_LABELS[i] ?? `${i + 1}일 전`, value: days };
    });
  }, [dailyBudgetData?.bankruptcyPrediction]);

  const bankruptDateLabel = useMemo(() => {
    const last = dailyBudgetData?.bankruptcyPrediction?.slice(-1)[0];
    if (!last?.expectedDate) return '';
    const d = new Date(last.expectedDate);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }, [dailyBudgetData?.bankruptcyPrediction]);

  const scenarioDateLabels = useMemo(() => {
    const pred = dailyBudgetData?.bankruptcyPrediction;
    if (!pred?.length) return [];
    const last = new Date(pred[pred.length - 1].expectedDate);
    const n = pred.length;
    const startDay = Math.max(1, last.getDate() - n + 1);
    return Array.from({ length: n }, (_, i) => `${startDay + i}일`);
  }, [dailyBudgetData?.bankruptcyPrediction]);

  const freezeSuccessRates = useMemo(() => {
    if (!reportData?.successRateByDay) return {} as Record<string, number>;
    return Object.fromEntries(
      Object.entries(reportData.successRateByDay).map(([k, v]) => [k, Math.round((v ?? 0) * 100)]),
    );
  }, [reportData?.successRateByDay]);

  const freezeDescription = reportData?.bestSavingTime
    ? `${reportData.bestSavingTime.day} ${reportData.bestSavingTime.timeSlot} 냉동 상품 성공률이 가장 높아요!`
    : '';

  return (
    <div className="min-h-screen bg-white ">
      <ReportTab activeTab={activeTab} onChange={setActiveTab} />

      <div className="px-4 pt-6 pb-6 space-y-4 flex flex-col items-center">
        {activeTab === 'daily' && dailyBudgetData && (
          <>
            <DailyBudgetChart
              labels={dailyChartLabels}
              values={dailyChartValues}
              userName={name || '...'}
              todayBudgetText={todayBudgetText}
              diffText={diffText}
              isDiffPositive={budgetDiff === null || budgetDiff >= 0}
            />
            <ScenarioChart
              items={scenarioItems}
              bankruptDateLabel={bankruptDateLabel}
              dateLabels={scenarioDateLabels}
            />
          </>
        )}
        {activeTab === 'freeze' && (
          <>
            <FreezeEffectCard reportData={reportData} />
            <DailyFreezeSuccessRate
              successRates={freezeSuccessRates}
              description={freezeDescription}
            />
          </>
        )}
      </div>
    </div>
  );
}
