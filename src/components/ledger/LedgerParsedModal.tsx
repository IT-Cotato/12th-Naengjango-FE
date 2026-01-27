import { useMemo, useRef, useState } from 'react';

import type { ParsedLedgerData, LedgerDraft } from '@/types/ledger';

type EntryType = 'income' | 'expense';

type Props = {
  open: boolean;
  data: ParsedLedgerData | null;
  onClose: () => void;
  onSave: (payload: ParsedLedgerData, type: EntryType) => void;
};

function formatNumberWithComma(value: number) {
  return value.toLocaleString('ko-KR');
}

function formatYYYYMMDD(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export default function LedgerParsedModal({ open, data, onClose, onSave }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // ✅ ParsedLedgerData는 type이 없으니 여기까지는 그대로
  const initial = useMemo<ParsedLedgerData>(() => {
    return (
      data ?? {
        amount: 0,
        description: '',
        date: '',
        category: '',
        memo: '',
      }
    );
  }, [data]);

  // ✅ type은 Draft에만 존재 (UI state)
  const [type, setType] = useState<EntryType>('expense');

  const [amount, setAmount] = useState<number>(initial.amount);
  const [description, setDescription] = useState<string>(initial.description);
  const [category, setCategory] = useState<string>(initial.category);
  const [memo, setMemo] = useState<string>(initial.memo);

  const [amountInput, setAmountInput] = useState<string>(
    initial.amount ? formatNumberWithComma(initial.amount) : '',
  );

  if (!open) return null;

  const titleDate = formatYYYYMMDD(initial.date);

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  const disabled = !Number.isFinite(amount) || amount <= 0;

  const handleSave = () => {
    onSave({
      date: initial.date,
      type, // ✅ 포함 가능
      amount,
      category: category.trim(),
      description: description.trim(),
      memo: memo ?? '',
    });
  };

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
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-[553px]
                   bg-[color:var(--color-white-800)] rounded-tl-[30px] rounded-tr-[30px]
                   shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-[17px] w-11 h-1 bg-[color:var(--color-gray-200)] rounded-[2px]" />

        <div className="absolute left-0 top-[34px] w-96 px-6 inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
            {titleDate}
          </div>
        </div>

        {/* 분류 */}
        <div className="absolute left-0 top-[181px] w-96 px-6 inline-flex justify-start items-start gap-3">
          <div className="py-2">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold">분류</div>
          </div>

          <div className="flex-1 flex gap-[5px]">
            <button
              type="button"
              onClick={() => setType('income')}
              className={[
                'w-36 px-4 py-2 rounded-lg text-white text-sm font-semibold',
                type === 'income'
                  ? 'bg-[color:var(--color-main-skyblue)]'
                  : 'bg-[color:var(--color-gray-400)]',
              ].join(' ')}
            >
              수입
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={[
                'w-36 px-4 py-2 rounded-lg text-white text-sm font-semibold',
                type === 'expense'
                  ? 'bg-[color:var(--color-error)]'
                  : 'bg-[color:var(--color-gray-400)]',
              ].join(' ')}
            >
              지출
            </button>
          </div>
        </div>

        {/* ✅ 저장 버튼 */}
        <div className="absolute left-6 right-6 bottom-[34px]">
          <button
            type="button"
            onClick={handleSave}
            disabled={disabled}
            className={[
              'w-full h-14 rounded-[10px] flex justify-center items-center',
              disabled
                ? 'bg-[color:var(--color-gray-300)]'
                : 'bg-[color:var(--color-main-skyblue)]',
            ].join(' ')}
          >
            <span className="text-white text-base font-bold">저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
