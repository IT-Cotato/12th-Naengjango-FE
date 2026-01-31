import { useState } from 'react';
import DailyBudgetChart from '@/components/report/DailyBudgetChart';
import ReportTab, { type ReportTabKey } from '@/components/report/ReportTab';
import ScenarioChart from '@/components/report/ScenarioChart';
import FreezeEffectCard from '@/components/report/FreezeEffectCard';
import DailyFreezeSuccessRate from '@/components/report/DailyFreezeSuccessRate';

const dummyLabels = ['7일 전', '6일 전', '5일 전', '4일 전', '3일 전', '2일 전', '1일 전', '오늘'];
const dummyValues = [32000, 28000, 35000, 30000, 34000, 33000, 13200];

const scenarioItems = [
  { label: '7일 전', value: 100 },
  { label: '6일 전', value: 90 },
  { label: '5일 전', value: 80 },
  { label: '4일 전', value: 70 },
  { label: '3일 전', value: 60 },
  { label: '2일 전', value: 50 },
  { label: '1일 전', value: 40 },
  { label: '오늘', value: 30 },
];

const weeklyFreezeSuccessRates: Record<string, number> = {
  월: 52,
  화: 58,
  수: 65,
  목: 78,
  금: 95,
  토: 42,
  일: 45,
};

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState<ReportTabKey>('daily');

  return (
    <div className="min-h-screen bg-white ">
      <ReportTab activeTab={activeTab} onChange={setActiveTab} />

      <div className="px-4 pt-6 pb-6 space-y-4 flex flex-col items-center">
        {activeTab === 'daily' && (
          <>
            <DailyBudgetChart
              labels={dummyLabels}
              values={dummyValues}
              userName="냉잔고"
              todayBudgetText="13,200원"
              diffText="700▲"
            />
            <ScenarioChart items={scenarioItems} bankruptDateLabel="2월 24일"/>
          </>
        )}
        {activeTab === 'freeze' && (
          <>
            <FreezeEffectCard />
            <DailyFreezeSuccessRate
              successRates={weeklyFreezeSuccessRates}
              description="금요일 오후 냉동 상품 성공률이 가장 높아요!"
            />
          </>
        )}
      </div>
    </div>
  );
}
