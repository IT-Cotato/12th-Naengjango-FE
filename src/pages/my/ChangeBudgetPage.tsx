import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepFixCosts from '@/pages/login/step/StepFixCosts';
import { close } from '@/assets';

type FixCost = {
  id: string;
  amount: string;
};

export default function ChangeBudgetPage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState('600000'); // 화면에 표시되는 예산 (나중에 api 연결)
  const [tempBudget, setTempBudget] = useState('600000'); // 임시 예산 (입력 중인 값)
  const [fixCosts, setFixCosts] = useState<FixCost[]>([]); // api 연결 (나중에)

  //api 연결 - 저장 버튼 클릭 시 호출 (나중에)
  const handleSave = () => {
    // 저장 시에만 예산 업데이트
    setBudget(tempBudget);
    console.log('예산 저장:', { budget: tempBudget, fixCosts });
  };

  return (
    <div className="flex h-dvh flex-col bg-white">
      <main className="flex-1 overflow-y-auto px-5 pb-24">
        <header className="flex h-18 items-center justify-between px-6 pt-[54px] relative">
          <div className="w-6" />
          <h1 className="Bold_24 text-gray-800 absolute left-1/2 -translate-x-1/2">예산 수정</h1>
          <button type="button" onClick={() => navigate('/my')}>
            <img src={close} alt="닫기" className="h-6 w-6" />
          </button>
        </header>
        <div className="mt-12">
          <StepFixCosts
            value={fixCosts}
            onChange={setFixCosts}
            budget={budget}
            showBudgetInput={true}
            onBudgetChange={setTempBudget}
            inputBudget={tempBudget}
          />
        </div>
      </main>

      <div className="shrink-0 border-0 bg-white px-5 pb-6">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-lg bg-main-skyblue py-3 text-white font-medium"
        >
          예산 설정 완료
        </button>
      </div>
    </div>
  );
}
