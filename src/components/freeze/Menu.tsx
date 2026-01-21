import { useState } from 'react';

type MenuProps = {
  activeTab: 'freeze' | 'history';
  onTabChange: (tab: 'freeze' | 'history') => void;
};

export default function Menu({ activeTab, onTabChange }: MenuProps) {
  const activeStyle = 'border-b border-b-main-skyblue shadow-[0_5px_10px_-10px_rgba(94,151,215,1)]';
  const inactiveStyle = 'border-b border-b-gray-400';

  const activeText = 'text-main-skyblue';
  const inactiveText = 'text-gray-400';

  return (
    <>
      <div
        data-layer="menu"
        className="Menu w-96 h-[130px] z-1 top-[0px] fixed bg-white-800 inline-flex justify-between items-end"
      >
        <div
          data-layer="냉동하기"
          onClick={() => onTabChange('freeze')}
          className={`flex-1 p-2.5 cursor-pointer flex justify-center items-center
          ${activeTab === 'freeze' ? activeStyle : inactiveStyle}`}
        >
          <div
            data-layer="냉동하기"
            className={`Medium_18 font-sans
            ${activeTab === 'freeze' ? activeText : inactiveText}`}
          >
            냉동하기
          </div>
        </div>

        <div
          data-layer="냉동 기록"
          onClick={() => onTabChange('history')}
          className={`flex-1 p-2.5 cursor-pointer flex justify-center items-center
          ${activeTab === 'history' ? activeStyle : inactiveStyle}`}
        >
          <div
            data-layer="냉동 기록"
            className={`Medium_18 font-sans
            ${activeTab === 'history' ? activeText : inactiveText}`}
          >
            냉동 기록
          </div>
        </div>
      </div>
    </>
  );
}
