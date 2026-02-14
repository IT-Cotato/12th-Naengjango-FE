import { useMemo, useRef, useState } from 'react';
import Button from '@/components/common/Button';
import {
  food,
  cafe,
  fashion,
  beauty,
  health,
  education,
  necessities,
  traffic,
  pet,
  hobby,
  else as elseIcon,
  salary,
  pinMoney,
  adjustment,
  refund,
  allocation,
} from '@/assets';

type EntryType = 'income' | 'expense';

type Props = {
  open: boolean;
  mode: EntryType;
  value: string;
  onClose: () => void;
  onSave: (nextCategory: string) => void;
};

const EXPENSE_CATEGORIES = [
  '식비',
  '카페',
  '패션',
  '미용',
  '의료/건강',
  '교육',
  '생필품',
  '교통',
  '반려동물',
  '취미',
  '기타',
] as const;

const INCOME_CATEGORIES = ['급여', '용돈', '정산', '환급', '이자/배당', '기타'] as const;

type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

const EXPENSE_ICON_MAP: Record<ExpenseCategory, string> = {
  식비: food,
  카페: cafe,
  패션: fashion,
  미용: beauty,
  '의료/건강': health,
  교육: education,
  생필품: necessities,
  교통: traffic,
  반려동물: pet,
  취미: hobby,
  기타: elseIcon,
};

const INCOME_ICON_MAP: Record<IncomeCategory, string> = {
  급여: salary,
  용돈: pinMoney,
  정산: adjustment,
  환급: refund,
  '이자/배당': allocation,
  기타: elseIcon,
};

function isExpenseCategory(v: string): v is ExpenseCategory {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(v);
}

function isIncomeCategory(v: string): v is IncomeCategory {
  return (INCOME_CATEGORIES as readonly string[]).includes(v);
}

export default function LedgerCategoryModal({ open, mode, value, onClose, onSave }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const categories = mode === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const sheetHeightClass = mode === 'income' ? 'h-[430px]' : 'h-[553px]';

  const initial = useMemo(() => {
    const v = value.trim();
    if (mode === 'income' && isIncomeCategory(v)) return v;
    if (mode === 'expense' && isExpenseCategory(v)) return v;
    return categories[0] ?? '기타';
  }, [value, mode, categories]);

  const [selected, setSelected] = useState<string>(initial);

  if (!open) return null;

  // 겹모달에서 onMouseDown은 뒤 모달까지 닫히는 케이스가 많아서 onClick이 더 안전함
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(selected);
    onClose();
  };

  const getIcon = (category: string): string => {
    if (mode === 'income' && isIncomeCategory(category)) return INCOME_ICON_MAP[category];
    if (mode === 'expense' && isExpenseCategory(category)) return EXPENSE_ICON_MAP[category];
    return elseIcon;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80]"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div
        ref={sheetRef}
        // 여기 2개가 핵심: 내부 클릭/마우스다운이 뒤 모달로 전파되는 걸 막음
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={[
          'absolute bottom-0 left-1/2 -translate-x-1/2 w-96',
          sheetHeightClass,
          'bg-[color:var(--color-white-800)]',
          'rounded-tl-[30px] rounded-tr-[30px]',
          'shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)]',
          'overflow-hidden',
        ].join(' ')}
      >
        <div className="w-11 h-1 absolute left-1/2 top-[17px] -translate-x-1/2 bg-[color:var(--color-gray-200)] rounded-xs" />

        <div className="w-96 px-6 absolute left-0 top-[34px] flex justify-center">
          <div className="text-[color:var(--color-gray-800)] text-2xl font-bold">카테고리 수정</div>
        </div>

        <div className="absolute left-0 top-[82px] w-96 px-6 flex flex-col items-center">
          <div className="size-12 rounded-full bg-[color:var(--color-sub-skyblue)] flex items-center justify-center">
            <img src={getIcon(selected)} alt="" className="w-7 h-7" draggable={false} />
          </div>

          <div className="mt-2 text-[color:var(--color-gray-800)] text-sm font-medium">
            {selected}
          </div>
        </div>

        <div className="absolute left-0 top-[170px] w-96 px-6">
          <div className="grid grid-cols-4 gap-x-5 gap-y-6">
            {categories.map((c) => {
              const active = selected === c;

              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelected(c)}
                  className="flex flex-col items-center"
                >
                  <div
                    className={[
                      'w-11 h-11 rounded-full flex items-center justify-center',
                      active
                        ? 'bg-[var(--error_red_40,rgba(255,0,0,0.40))]'
                        : 'bg-[color:var(--color-sub-skyblue)]',
                    ].join(' ')}
                  >
                    <img src={getIcon(c)} alt="" className="w-5 h-5" draggable={false} />
                  </div>

                  <div className="mt-1 text-[color:var(--color-gray-800)] text-xs font-medium">
                    {c}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute left-6 right-6 bottom-[34px]">
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>
    </div>
  );
}
