import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepFixCosts from '@/pages/login/step/StepFixCosts';
import { close } from '@/assets';
import { updateBudget, updateFixedExpenditures } from '@/apis/my/mypage';
import { getAllCategoryItems } from '@/constants/categories';
import { useBudget } from '@/hooks/my/useBudget';
import { useFixedExpenditures, type FixCost } from '@/hooks/my/useFixedExpenditures';

export default function ChangeBudgetPage() {
  const navigate = useNavigate();
  const { budget: fetchedBudget } = useBudget();
  const { items: fetchedFixCosts } = useFixedExpenditures();
  const [tempBudget, setTempBudget] = useState('0');
  const [fixCosts, setFixCosts] = useState<FixCost[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (fetchedBudget !== null) {
      setTempBudget(String(fetchedBudget));
    }
  }, [fetchedBudget]);

  useEffect(() => {
    setFixCosts(fetchedFixCosts);
  }, [fetchedFixCosts]);

  const budgetStr = fetchedBudget !== null ? String(fetchedBudget) : '0';

  const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    const budgetNum = Number(String(tempBudget).replace(/,/g, ''));
    if (Number.isNaN(budgetNum) || budgetNum < 0) return;

    setSaveLoading(true);
    try {
      const allItems = getAllCategoryItems();
      const fixedExpenditureItems = fixCosts.map((fixCost) => {
        const amount = parseInt(String(fixCost.amount).replace(/,/g, ''), 10);
        if (Number.isNaN(amount))
          throw new Error(`유효하지 않은 고정지출 금액입니다: ${fixCost.id}`);
        const categoryItem = allItems.find((item) => item.id === fixCost.id);
        const itemLabel = categoryItem?.label ?? fixCost.id;
        return { item: itemLabel, amount };
      });

      await Promise.all([
        updateBudget({ budget: budgetNum }, accessToken),
        updateFixedExpenditures({ items: fixedExpenditureItems }, accessToken),
      ]);
      navigate('/my');
    } catch (e) {
      alert(e instanceof Error ? e.message : '저장에 실패했습니다.');
    } finally {
      setSaveLoading(false);
    }
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
            budget={budgetStr}
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
          disabled={saveLoading}
          className="w-full rounded-lg bg-main-skyblue py-3 text-white font-medium disabled:opacity-50"
        >
          {saveLoading ? '저장 중...' : '예산 설정 완료'}
        </button>
      </div>
    </div>
  );
}
