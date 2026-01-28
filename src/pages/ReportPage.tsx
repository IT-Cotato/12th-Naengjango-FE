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

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState<ReportTabKey>('daily');

  return (
    <div className="min-h-screen bg-white ">
      <ReportTab activeTab={activeTab} onChange={setActiveTab} />

      <div className="px-4 pt-6 pb-6 space-y-4 flex flex-col items-center">
        {activeTab === 'daily' && (
          <>
            <DailyBudgetChart labels={dummyLabels} values={dummyValues} />
            <ScenarioChart items={scenarioItems} />
          </>
        )}
        {activeTab === 'freeze' && (
          <>
            <FreezeEffectCard />
            <DailyFreezeSuccessRate />
          </>
        )}
      </div>
    </div>
  );
}
