import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupHeader from '@/components/signup/SignupHeader';
import Button from '@/components/common/Button';
import StepBudget from './step/StepBudget';
import StepFixCosts from './step/StepFixCosts';
import { updateBudget, updateFixedExpenditures } from '@/apis/members/mypage';
import { getAllCategoryItems } from '@/constants/categories';

type Step = 'budget' | 'fixcosts';

const STEP_ORDER: Step[] = ['budget', 'fixcosts'];

export default function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('budget');
  const [budget, setBudget] = useState('');
  const [fixCosts, setFixCosts] = useState<{ id: string; amount: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepIndex = STEP_ORDER.indexOf(step);

  const goNext = async () => {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) {
      setStep(next);
    } else {
      // 예산 설정 완료 시 예산 수정 API 호출
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('accessToken이 없습니다.');
        navigate('/login');
        return;
      }

      setIsSubmitting(true);
      try {
        const budgetNumber = parseInt(budget.replace(/,/g, ''), 10);
        if (isNaN(budgetNumber)) {
          throw new Error('유효하지 않은 예산 값입니다.');
        }

        // 고정지출 항목을 API 형식에 맞게 변환
        const fixedExpenditureItems = fixCosts.map((fixCost) => {
          const amount = parseInt(fixCost.amount.replace(/,/g, ''), 10);
          if (isNaN(amount)) {
            throw new Error(`유효하지 않은 고정지출 금액입니다: ${fixCost.id}`);
          }

          // id를 label로 변환
          const allItems = getAllCategoryItems();
          const categoryItem = allItems.find((item) => item.id === fixCost.id);
          const itemLabel = categoryItem?.label || fixCost.id;

          return {
            item: itemLabel,
            amount,
          };
        });

        // 예산 및 고정지출 수정 API를 병렬로 호출
        await Promise.all([
          updateBudget({ budget: budgetNumber }, accessToken),
          updateFixedExpenditures({ items: fixedExpenditureItems }, accessToken),
        ]);

        // 예산 설정 완료 시 첫 로그인 플래그 제거
        localStorage.removeItem('isFirstLogin');
        navigate('/home');
      } catch (error) {
        console.error('예산 설정 실패:', error);
        alert(error instanceof Error ? error.message : '예산 설정에 실패했습니다.');
      } finally {
        setIsSubmitting(false);
      }
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
        <Button disabled={!canNext || isSubmitting} onClick={goNext}>
          {isSubmitting ? '설정 중...' : step === 'fixcosts' ? '예산 설정 완료' : '다음'}
        </Button>
      </div>
    </div>
  );
}
