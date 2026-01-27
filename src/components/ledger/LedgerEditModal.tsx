import { useMemo, useRef, useState } from 'react';
import Button from '@/components/common/Button';
import type { LedgerEntry } from '@/components/ledger/LedgerEntryList';
import LedgerCategoryModal from '@/components/ledger/LedgerCategoryModal';

type EntryType = 'income' | 'expense';

type Props = {
  open: boolean;
  entry: LedgerEntry | null;
  onClose: () => void;
  onSave: (next: LedgerEntry) => void;
  onDelete: (id: string) => void;
};

function onlyDigits(str: string) {
  return str.replace(/[^\d]/g, '');
}

function formatNumberWithComma(value: number) {
  return value.toLocaleString('ko-KR');
}

export default function LedgerEditModal({ open, entry, onClose, onSave, onDelete }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // ✅ entry가 null이어도 hook이 항상 같은 순서로 실행되게 fallback 준비
  const safeEntry = useMemo<LedgerEntry>(() => {
    return (
      entry ?? {
        id: '',
        date: '',
        type: 'expense',
        amount: 0,
        category: '',
        description: '',
        memo: '',
      }
    );
  }, [entry]);

  const [type, setType] = useState<EntryType>(safeEntry.type);
  const [amount, setAmount] = useState<number>(safeEntry.amount);
  const [amountInput, setAmountInput] = useState<string>(
    safeEntry.amount > 0 ? formatNumberWithComma(safeEntry.amount) : '',
  );
  const [category, setCategory] = useState<string>(safeEntry.category ?? '');
  const [description, setDescription] = useState<string>(safeEntry.description ?? '');
  const [memo, setMemo] = useState<string>(safeEntry.memo ?? '');

  // ✅ 카테고리 모달
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // ✅ 이제 hook 호출은 끝났으니 조건부 return 가능
  if (!open || !entry) return null;

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  const disabledSave = !Number.isFinite(amount) || amount <= 0;

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

  const handleSave = () => {
    if (disabledSave) return;

    onSave({
      ...entry,
      type,
      amount,
      category: category.trim(),
      description: description.trim(),
      memo,
    });

    onClose();
  };

  const handleDelete = () => {
    onDelete(entry.id);
    onClose();
  };

  const openCategory = () => setIsCategoryOpen(true);

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
        className="
          absolute bottom-0 left-1/2 -translate-x-1/2
          w-96 h-[553px]
          bg-[color:var(--color-white-800)]
          rounded-tl-[30px] rounded-tr-[30px]
          shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)]
          overflow-hidden
        "
      >
        <div className="w-11 h-1 absolute left-1/2 top-[17px] -translate-x-1/2 bg-[color:var(--color-gray-200)] rounded-xs" />

        {/* title row */}
        <div className="w-96 px-6 absolute left-0 top-[34px] flex items-center justify-center">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
            내역 수정하기
          </div>

          <button
            type="button"
            onClick={handleDelete}
            aria-label="삭제"
            className="absolute right-6 top-1/2 -translate-y-1/2"
          >
            🗑️
          </button>
        </div>

        {/* ✅ category preview (아이콘 원 + 텍스트 둘 다 클릭되면 모달 오픈) */}
        <div className="w-96 px-6 absolute left-0 top-[82px] inline-flex flex-col justify-start items-start">
          <div className="self-stretch h-24 inline-flex justify-center items-center gap-6">
            <div className="w-14 h-24 relative">
              <div className="w-14 left-0 top-[54px] absolute inline-flex flex-col justify-start items-center">
                <button
                  type="button"
                  onClick={openCategory}
                  className="self-stretch h-5 text-center text-black text-base font-medium leading-6 tracking-tight"
                >
                  {category || '카테고리'}
                </button>
              </div>

              <button
                type="button"
                onClick={openCategory}
                aria-label="카테고리 수정"
                className="size-12 p-3 left-[4px] top-0 absolute bg-[color:var(--color-sub-skyblue)] rounded-3xl inline-flex justify-start items-center gap-2.5"
              >
                <div className="size-6 relative overflow-hidden">
                  <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-[color:var(--color-gray-800)]" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* type row */}
        <div className="w-96 h-11 px-6 absolute left-0 top-[181px] inline-flex justify-start items-center gap-3">
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
              <div className="text-white text-sm font-semibold leading-5 tracking-tight">수입</div>
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
              <div className="text-white text-sm font-semibold leading-5 tracking-tight">지출</div>
            </button>
          </div>
        </div>

        {/* amount */}
        <div className="w-96 px-6 absolute left-0 top-[233px] inline-flex justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
              금액
            </div>
          </div>

          <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 self-stretch bg-transparent outline-none text-[color:var(--color-error)] text-base font-medium leading-6 tracking-tight"
              placeholder="0"
            />
          </div>
        </div>

        {/* description */}
        <div className="w-96 px-6 absolute left-0 top-[285px] inline-flex justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
              내역
            </div>
          </div>

          <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
              placeholder="내역을 입력하세요"
            />
          </div>
        </div>

        {/* memo */}
        <div className="w-96 px-6 absolute left-0 top-[337px] inline-flex justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
              메모
            </div>
          </div>

          <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="flex-1 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
              placeholder="메모하기"
            />
          </div>
        </div>

        <div className="absolute left-6 right-6 bottom-[34px]">
          <Button disabled={disabledSave} onClick={handleSave}>
            저장
          </Button>
        </div>

        {/* ✅ 카테고리 수정 모달 */}
        <LedgerCategoryModal
          open={isCategoryOpen}
          value={category}
          onClose={() => setIsCategoryOpen(false)}
          onSave={(nextCategory) => setCategory(nextCategory)}
        />
      </div>
    </div>
  );
}
