import { useState } from 'react';
import FreezeList from './FreezeList';
import ToggleCard from './ToggleCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Freeze() {
  const [activeToggle, setActiveToggle] = useState<'manual' | 'link'>('manual');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [toggleInputValid, setToggleInputValid] = useState(false);
  const canFreeze = Boolean(selectedAppId && toggleInputValid);
  const [resetKey, setResetKey] = useState(0);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState(0);

  const handleToggleChange = (mode: 'manual' | 'link') => {
    setActiveToggle(mode);

    // 탭 바뀔 때 이전 입력은 무효 처리
    setToggleInputValid(false);
  };

  const handleFreeze = async () => {
    if (!selectedAppId || !itemName || !price) return;

    const body = {
      appName: selectedAppId, // appName = 선택된 앱 ID
      itemName: itemName,
      price: price,
    };

    console.log('보내는 body: ', body);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.warn('No access token. User might not be logged in.');
      return;
    }
    const res = await fetch(`${API_BASE_URL}/api/freezes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      //credentials: 'include',
      body: JSON.stringify(body),
    });
    console.log('freeze res:', await res.json());
  };

  return (
    <>
      <div className="Frame 11 justify-center items-center overflow-hidden">
        <div
          data-layer="Frame 48096424"
          className="Frame48096424 w-[327px] h-[546px] left-[28.5px] top-[100px] absolute bg-white-800 rounded-[20px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] overflow-hidden"
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
            onClick={() => {
              setSelectedAppId(null); // 앱 선택 해제
              setActiveToggle('manual'); // 탭 초기화
              setToggleInputValid(false); // 입력 무효화
              setResetKey((k) => k + 1); // 하위 컴포넌트 초기화 트리거
            }}
          >
            초기화
          </div>

          <FreezeList
            selectedAppId={selectedAppId}
            onSelectApp={setSelectedAppId}
            resetKey={resetKey}
          />
          <ToggleCard
            activeToggle={activeToggle}
            onToggleChange={handleToggleChange}
            onInputStateChange={(state) => {
              setToggleInputValid(state.isValid);
              setItemName(state.itemName);
              setPrice(state.price);
            }}
            onFreeze={handleFreeze}
            canFreeze={canFreeze}
            resetKey={resetKey}
          />
        </div>
      </div>
    </>
  );
}
