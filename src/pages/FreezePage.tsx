import Menu from '@/components/freeze/Menu';
import { useState } from 'react';
import Freeze from '@/components/freeze/freeze/Freeze';
import FreezeHistory from '@/components/freeze/f_history/FreezeHistory';

export default function FreezePage() {
  const [activeTab, setActiveTab] = useState<'freeze' | 'history'>('freeze');
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <div data-layer="냉동 화면" className="w-full h-screen relative bg-white-800 overflow-hidden">
        <Menu activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'freeze' && <Freeze />}

        {activeTab === 'history' && (
          <FreezeHistory
            refreshKey={refreshKey}
            onUpdated={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
      </div>
    </>
  );
}
