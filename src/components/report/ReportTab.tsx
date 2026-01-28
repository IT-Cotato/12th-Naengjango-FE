import React from 'react';

type ReportTabKey = 'daily' | 'freeze';

interface ReportTabProps {
  activeTab: ReportTabKey;
  onChange: (tab: ReportTabKey) => void;
}

const ReportTab: React.FC<ReportTabProps> = ({ activeTab, onChange }) => {
  const activeStyle = 'border-b border-b-main-skyblue shadow-[0_5px_10px_-10px_rgba(94,151,215,1)]';
  const inactiveStyle = 'border-b border-b-gray-400';

  const activeText = 'text-main-skyblue';
  const inactiveText = 'text-gray-400';

  return (
    <div className="bg-white mt-8">
      <div className="flex">
        <button
          type="button"
          className={`flex-1 p-2.5 cursor-pointer flex justify-center items-center ${
            activeTab === 'daily' ? activeStyle : inactiveStyle
          }`}
          onClick={() => onChange('daily')}
        >
          <div
            className={`Medium_18 font-sans ${activeTab === 'daily' ? activeText : inactiveText}`}
          >
            하루 가용 예산
          </div>
        </button>
        <button
          type="button"
          className={`flex-1 p-2.5 cursor-pointer flex justify-center items-center ${
            activeTab === 'freeze' ? activeStyle : inactiveStyle
          }`}
          onClick={() => onChange('freeze')}
        >
          <div
            className={`Medium_18 font-sans ${activeTab === 'freeze' ? activeText : inactiveText}`}
          >
            냉동 성공 효과
          </div>
        </button>
      </div>
    </div>
  );
};

export type { ReportTabKey };
export default ReportTab;
