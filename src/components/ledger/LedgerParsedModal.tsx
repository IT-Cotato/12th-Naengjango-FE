import type { ParsedLedgerData } from '@/types/ledger';
import { useMemo, useRef, useState } from 'react';

type Props = {
  open: boolean;
  data: ParsedLedgerData | null;
  onClose: () => void;
  onSave: (payload: ParsedLedgerData) => void;
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

  // data가 null이어도 안전한 초기값
  const initial = useMemo<ParsedLedgerData>(() => {
    return (
      data ?? {
        type: '',
        amount: 0,
        description: '',
        date: '',
        category: '',
        memo: '',
      }
    );
  }, [data]);

  const [type, setType] = useState<string>(initial.type);
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
      type: type.trim(),
      amount,
      description: description.trim(),
      date: initial.date,
      category: category.trim(),
      memo,
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
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-[553px] bg-[color:var(--color-white-800)] rounded-tl-[30px] rounded-tr-[30px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-[17px] w-11 h-1 bg-[color:var(--color-gray-200)] rounded-[2px]" />

        <div className="absolute left-0 top-[34px] w-96 px-6 inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
            {titleDate}
          </div>
        </div>

        <div className="absolute left-0 top-[82px] w-96 px-6 inline-flex flex-col justify-start items-start">
          <div className="self-stretch h-24 inline-flex justify-center items-center gap-6">
            <button type="button" className="w-14 h-24 relative">
              <div className="absolute left-0 top-[54px] w-14 inline-flex flex-col justify-start items-center">
                <div className="self-stretch h-5 text-center text-black text-base font-medium leading-6 tracking-tight">
                  {category || '카테고리'}
                </div>
              </div>

              <div className="absolute left-[4px] top-0 size-12 p-3 bg-[color:var(--color-sub-skyblue)] rounded-3xl inline-flex justify-start items-center gap-2.5">
                <div className="size-6 relative overflow-hidden">
                  <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-[color:var(--color-gray-800)]" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="absolute left-0 top-[181px] w-96 px-6 inline-flex justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
              분류
            </div>
          </div>

          <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex-1 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
              placeholder="지출/수입"
            />
          </div>
        </div>

        <div className="absolute left-0 top-[233px] w-96 px-6 inline-flex justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
              금액
            </div>
          </div>

          <div className="flex-1 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');

                if (raw === '') {
                  setAmount(0);
                  setAmountInput('');
                  return;
                }

                if (!/^\d+$/.test(raw)) return;

                const num = Number(raw);
                setAmount(num);
                setAmountInput(formatNumberWithComma(num));
              }}
              className="flex-1 self-stretch bg-transparent outline-none
             text-[color:var(--color-error)] text-base font-medium"
              placeholder="0"
            />
          </div>
        </div>

        <div className="absolute left-0 top-[285px] w-96 px-6 inline-flex justify-start items-start gap-3">
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
              placeholder="결제처"
            />
          </div>
        </div>

        <div className="absolute left-0 top-[337px] w-96 px-6">
          <div className="flex gap-3">
            <div className="py-2">
              <div className="text-[color:var(--color-gray-600)] text-lg font-semibold">메모</div>
            </div>

            <div
              className="flex-1 h-[110px] px-4 py-2.5 bg-[color:var(--color-white-800)]
      rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px]
      outline-[color:var(--color-gray-400)]"
            >
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full h-full bg-transparent outline-none resize-none"
                placeholder="원문/메모"
              />
            </div>
          </div>

          {/* ✅ 저장 버튼을 여기서 바로 24px 아래 */}
          <button
            type="button"
            onClick={handleSave}
            disabled={disabled}
            className={[
              'mt-6 w-full h-14 rounded-[10px] flex justify-center items-center',
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
