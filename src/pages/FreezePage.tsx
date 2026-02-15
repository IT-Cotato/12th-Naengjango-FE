import Menu from '@/components/freeze/Menu';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Freeze from '@/components/freeze/freeze/Freeze';
import FreezeHistory from '@/components/freeze/f_history/FreezeHistory';

export default function FreezePage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'freeze' | 'history'>(
    (location.state?.activeTab as 'freeze' | 'history') || 'freeze',
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // location.state가 변경되면 activeTab 업데이트
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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
