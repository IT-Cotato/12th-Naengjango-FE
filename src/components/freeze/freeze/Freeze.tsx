import { useState } from 'react';
import FreezeList from './FreezeList';
import ToggleCard from './ToggleCard';

export default function Freeze() {
  const [activeToggle, setActiveToggle] = useState<'manual' | 'link'>('manual');
  return (
    <>
      <div className="justify-center items-center">
        <div
          data-layer="Frame 48096424"
          className="Frame48096424 w-[327px] h-[546px] left-[24px] top-[154px] absolute bg-white-800 rounded-[20px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] overflow-hidden"
        >
          <div
            data-layer="Frame 32"
            className="Frame32 w-80 px-6 left-0 top-[29px] absolute inline-flex justify-center items-center gap-2.5"
          >
            <div
              data-layer="새로운 냉동하기"
              className="flex-1 text-center justify-center text-gray-800 Bold_24 font-sans leading-9"
            >
              새로운 냉동하기
            </div>
          </div>

          <div
            data-layer="초기화"
            className="left-[270px] top-[41px] absolute text-center justify-start text-gray-200 Regular_14 font-sans underline leading-5 tracking-tight"
          >
            초기화
          </div>

          <FreezeList />
          <ToggleCard activeToggle={activeToggle} onToggleChange={setActiveToggle} />
        </div>
      </div>
    </>
  );
}
