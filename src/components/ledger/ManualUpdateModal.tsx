import { useRef, useState } from 'react';
import Button from '@/components/common/Button';

type EntryType = 'income' | 'expense';

type ExpenseDraft = {
  date: string;
  type: EntryType;
  amount: number;
  category: string;
  description: string;
  memo?: string;
};

type Props = {
  open: boolean;
  date: string; // "2025.12.21"
  onClose: () => void;
  onSaveExpense: (draft: ExpenseDraft) => void;
};

function formatNumberWithComma(value: number) {
  return value.toLocaleString('ko-KR');
}

function onlyDigits(str: string) {
  return str.replace(/[^\d]/g, '');
}

const CATEGORIES = [
  '식비',
  '의류',
  '문화생활',
  '생필품',
  '미용',
  '의료',
  '교육',
  '경조사',
  '교통비',
  '기타',
] as const;

export default function ManualUpdateModal({ open, date, onClose, onSaveExpense }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // STEP 1
  const [type, setType] = useState<EntryType>('expense'); // ✅ UI는 유지
  const [amount, setAmount] = useState(0);
  const [amountInput, setAmountInput] = useState('');

  // STEP 2
  const [category, setCategory] = useState('');

  // STEP 3
  const [description, setDescription] = useState('');
  const [memo, setMemo] = useState('');

  if (!open) return null;

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  const handleAmountChange = (v: string) => {
    const raw = onlyDigits(v);
    if (!raw) {
      setAmount(0);
      setAmountInput('');
      return;
    }
    const num = Number(raw);
    setAmount(num);
    setAmountInput(formatNumberWithComma(num));
  };

  const step1Disabled = amount <= 0;
  const step2Disabled = category.trim() === '';
  const step3Disabled = false;

  const handleNextStep = () => {
    if (step === 1) {
      if (step1Disabled) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (step2Disabled) return;
      setStep(3);
      return;
    }
  };

  const handleSaveExpense = () => {
    onSaveExpense({
      date,
      type,
      amount,
      category: category.trim(),
      description: description.trim(),
      memo: memo.trim(),
    });
  };

  const handleBack = () => {
    if (step === 3) return setStep(2);
    if (step === 2) return setStep(1);
    onClose();
  };

  const sheetHeightClass = step === 2 ? 'h-[481px]' : step === 3 ? 'h-[553px]' : 'h-96';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70]"
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div
        ref={sheetRef}
        className={[
          'absolute bottom-0 left-1/2 -translate-x-1/2 w-96',
          sheetHeightClass,
          'bg-[color:var(--color-white-800)] rounded-tl-[30px] rounded-tr-[30px]',
          'shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden',
        ].join(' ')}
      >
        {/* Handle */}
        <div className="w-11 h-1 absolute left-1/2 top-[17px] -translate-x-1/2 bg-[color:var(--color-gray-200)] rounded-xs" />

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <div className="w-96 px-6 absolute left-0 top-[34px] flex items-center justify-center">
              <div className="text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
                {date}
              </div>
            </div>

            <div className="w-96 absolute left-0 top-[94px] flex justify-center">
              <div
                className={[
                  'w-80 h-12 px-4 py-2 rounded-[10px] flex items-center gap-2.5',
                  'bg-[color:var(--color-white-800)]',
                  'outline outline-[1.5px] outline-offset-[-1.5px]',
                  amountInput.length > 0
                    ? 'outline-[color:var(--color-main-skyblue)]'
                    : 'outline-[color:var(--color-gray-400)]',
                ].join(' ')}
              >
                <input
                  inputMode="numeric"
                  value={amountInput}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="금액을 입력하세요"
                  className="flex-1 bg-transparent outline-none text-[color:var(--color-gray-800)] text-base font-medium"
                />
              </div>
            </div>

            <div className="w-96 px-6 absolute left-0 top-[150px]">
              <div className="w-80 mx-auto h-11 flex gap-[5px]">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={[
                    'w-40 h-11 rounded-lg flex justify-center items-center',
                    type === 'income'
                      ? 'bg-[color:var(--color-main-skyblue)]'
                      : 'bg-[color:var(--color-gray-400)]',
                  ].join(' ')}
                >
                  <span className="text-white text-sm font-semibold">수입</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={[
                    'w-40 h-11 rounded-lg flex justify-center items-center',
                    type === 'expense'
                      ? 'bg-[color:var(--color-error)]'
                      : 'bg-[color:var(--color-gray-400)]',
                  ].join(' ')}
                >
                  <span className="text-white text-sm font-semibold">지출</span>
                </button>
              </div>
            </div>

            <div className="absolute left-6 right-6 bottom-[34px]">
              <Button disabled={step1Disabled} onClick={handleNextStep}>
                다음
              </Button>
            </div>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <div className="w-96 px-6 absolute left-0 top-[34px] flex items-center justify-center">
              <button
                type="button"
                onClick={handleBack}
                aria-label="뒤로가기"
                className="absolute left-6 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center"
              >
                <span className="text-[color:var(--color-gray-800)] text-2xl leading-none">
                  {'‹'}
                </span>
              </button>

              <div className="text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
                {date}
              </div>
            </div>

            <div className="absolute left-0 top-[94px] w-96 px-6">
              <div className="w-80 mx-auto grid grid-cols-4 gap-x-4 gap-y-6">
                {CATEGORIES.map((c) => {
                  const selected = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={[
                          'size-12 rounded-full flex items-center justify-center',
                          selected
                            ? 'bg-[color:var(--color-main-skyblue)]'
                            : 'bg-[color:var(--color-sub-skyblue)]',
                        ].join(' ')}
                      >
                        {/* 아이콘 어셋 연결 예정 */}
                      </div>
                      <div className="text-[color:var(--color-gray-800)] text-xs font-medium">
                        {c}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="absolute left-6 right-6 bottom-[34px]">
              <Button disabled={step2Disabled} onClick={handleNextStep}>
                다음
              </Button>
            </div>
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="w-96 h-[553px] relative bg-[color:var(--color-white-800)] overflow-hidden">
            {/* Handle (피그마 유지) */}
            <div className="w-11 h-1 left-[210px] top-[17px] absolute origin-top-left -rotate-180 bg-[color:var(--color-gray-200)] rounded-xs" />

            {/* Header + Back */}
            <div className="w-96 px-6 left-0 top-[34px] absolute flex justify-center items-center">
              <button
                type="button"
                onClick={handleBack}
                aria-label="뒤로가기"
                className="absolute left-6 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center"
              >
                <span className="text-[color:var(--color-gray-800)] text-2xl leading-none">
                  {'‹'}
                </span>
              </button>

              <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
                {date}
              </div>
            </div>

            {/* 카테고리 */}
            <div className="w-96 px-6 left-0 top-[82px] absolute inline-flex flex-col justify-start items-start">
              <div className="self-stretch h-24 inline-flex justify-center items-center gap-6">
                <div className="w-14 h-24 relative">
                  <div className="w-14 left-0 top-[54px] absolute inline-flex flex-col justify-start items-center">
                    <div className="self-stretch h-5 text-center text-black text-base font-medium leading-6 tracking-tight">
                      {category}
                    </div>
                  </div>

                  <div className="size-12 p-3 left-[4px] top-0 absolute bg-[color:var(--color-sub-skyblue)] rounded-3xl inline-flex justify-start items-center gap-2.5">
                    <div className="size-6 relative overflow-hidden">
                      <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-[color:var(--color-gray-800)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 분류 (UI 유지, 저장은 지출로만) */}
            <div className="w-96 h-11 px-6 left-0 top-[181px] absolute inline-flex justify-start items-center gap-3">
              <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
                분류
              </div>

              <div className="flex-1 flex justify-start items-center gap-[5px]">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={[
                    'w-36 px-4 py-2 rounded-lg flex justify-center items-center gap-2.5',
                    type === 'income'
                      ? 'bg-[color:var(--color-main-skyblue)]'
                      : 'bg-[color:var(--color-gray-400)]',
                  ].join(' ')}
                >
                  <div className="text-white text-sm font-semibold leading-5 tracking-tight">
                    수입
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={[
                    'w-36 px-4 py-2 rounded-lg flex justify-center items-center gap-2.5',
                    type === 'expense'
                      ? 'bg-[color:var(--color-error)]'
                      : 'bg-[color:var(--color-gray-400)]',
                  ].join(' ')}
                >
                  <div className="text-white text-sm font-semibold leading-5 tracking-tight">
                    지출
                  </div>
                </button>
              </div>
            </div>

            {/* 금액 */}
            <div className="w-96 px-6 left-0 top-[233px] absolute inline-flex justify-start items-start gap-3">
              <div className="py-2 flex justify-center items-start gap-2.5">
                <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
                  금액
                </div>
              </div>

              <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
                <div className="flex-1 self-stretch text-[color:var(--color-error)] text-base font-medium leading-6 tracking-tight">
                  {amountInput}
                </div>
              </div>
            </div>

            {/* 내역 */}
            <div className="w-96 px-6 left-0 top-[285px] absolute inline-flex justify-start items-start gap-3">
              <div className="py-2 flex justify-center items-start gap-2.5">
                <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
                  내역
                </div>
              </div>

              <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="내역을 입력하세요"
                  className="flex-1 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
                />
              </div>
            </div>

            {/* 메모 */}
            <div className="w-96 px-6 left-0 top-[337px] absolute inline-flex justify-start items-start gap-3">
              <div className="py-2 flex justify-center items-start gap-2.5">
                <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
                  메모
                </div>
              </div>

              <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
                <input
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="메모하기"
                  className="flex-1 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
                />
              </div>
            </div>

            {/* 저장 버튼 (다음 버튼과 동일 규칙) */}
            <div className="absolute left-6 right-6 bottom-[34px]">
              <Button disabled={step3Disabled} onClick={handleSaveExpense}>
                저장
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
