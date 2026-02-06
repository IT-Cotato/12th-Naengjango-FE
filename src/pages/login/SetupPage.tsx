import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupHeader from '@/components/signup/SignupHeader';
import Button from '@/components/common/Button';
import StepBudget from './step/StepBudget';
import StepFixCosts from './step/StepFixCosts';

type Step = 'budget' | 'fixcosts';

const STEP_ORDER: Step[] = ['budget', 'fixcosts'];

export default function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('budget');
  const [budget, setBudget] = useState('');
  const [fixCosts, setFixCosts] = useState<{ id: string; amount: string }[]>([]);

  const stepIndex = STEP_ORDER.indexOf(step);

  const goNext = () => {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) {
      setStep(next);
    } else {
      // 예산 설정 완료 시 첫 로그인 플래그 제거 
      localStorage.removeItem('isFirstLogin');
      navigate('/home');
    }
  };

  // 첫 화면이면 undefined 반환 → SignupHeader에서 navigate(-1)
  const goBack = stepIndex > 0 ? () => setStep(STEP_ORDER[stepIndex - 1]) : undefined;

  // '다음' 버튼 활성화 조건
  const canNext = step === 'budget' ? budget.trim().length > 0 : fixCosts.length > 0;

  // 현재 step에 맞는 컨텐츠 렌더링
  const content = (() => {
    switch (step) {
      case 'budget':
        return <StepBudget value={budget} onChange={setBudget} />;
      case 'fixcosts':
        return <StepFixCosts value={fixCosts} onChange={setFixCosts} budget={budget} />;
      default:
        return null;
    }
  })();

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="shrink-0 px-5 pt-6">
        <SignupHeader onBack={goBack} />
      </div>

      <main className="flex-1 overflow-y-auto px-5 pt-16 pb-24">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          {step === 'budget' ? '예산 설정' : '고정 지출 설정'}
        </h1>

        <div className="mt-6">{content}</div>
      </main>

      {/* 다음 버튼 고정 */}
      <div className="shrink-0 border-0 bg-white px-5 pb-6">
        <Button disabled={!canNext} onClick={goNext}>
          {step === 'fixcosts' ? '예산 설정 완료' : '다음'}
        </Button>
      </div>
    </div>
  );
}
