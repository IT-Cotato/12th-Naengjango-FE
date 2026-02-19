import { useMemo, useRef, useState } from 'react';
import type { ParsedLedgerData } from '@/types/ledger';

import Button from '@/components/common/Button';
import LedgerCategoryModal from '@/components/ledger/LedgerCategoryModal';

import { getCategoryIcon } from '@/components/ledger/categoryCatalog';
import type { EntryType } from '@/components/ledger/categoryCatalog';

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

function onlyDigits(str: string) {
  return str.replace(/[^\d]/g, '');
}

function safeParsed(data: ParsedLedgerData | null): ParsedLedgerData {
  return (
    data ?? {
      type: 'expense',
      amount: 0,
      date: '',
      description: '',
      category: '기타',
      memo: '',
    }
  );
}

export default function LedgerParsedModal({ open, data, onClose, onSave }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const initial = useMemo(() => {
    const s = safeParsed(data);
    return {
      ...s,
      type: s.type ?? 'expense',
      amount: Number(s.amount ?? 0),
      category: (String(s.category ?? '').trim() || '기타') as string,
      description: String(s.description ?? ''),
      memo: String(s.memo ?? ''),
      date: String(s.date ?? ''),
    };
  }, [data]);

  // data가 바뀔 때마다 리마운트해서 초기값 주입
  const sheetKey = useMemo(() => {
    return [
      open ? 'open' : 'closed',
      initial.date,
      initial.type,
      initial.amount,
      initial.category,
      initial.description,
      initial.memo,
    ].join('|');
  }, [open, initial]);

  if (!open) return null;

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70]"
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="absolute inset-0 bg-black/25" />

      <ParsedSheet key={sheetKey} sheetRef={sheetRef} initial={initial} onSave={onSave} />
    </div>
  );
}

function ParsedSheet({
  sheetRef,
  initial,
  onSave,
}: {
  sheetRef: React.RefObject<HTMLDivElement | null>;
  initial: ParsedLedgerData;
  onSave: (payload: ParsedLedgerData) => void;
}) {
  const [type, setType] = useState<ParsedLedgerData['type']>(initial.type);
  const [amount, setAmount] = useState<number>(initial.amount);
  const [amountInput, setAmountInput] = useState<string>(
    initial.amount ? formatNumberWithComma(initial.amount) : '',
  );

  const [category, setCategory] = useState<string>(initial.category);
  const [description, setDescription] = useState<string>(initial.description);
  const [memo, setMemo] = useState<string>(initial.memo);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const titleDate = formatYYYYMMDD(initial.date);

  const categoryIconSrc = useMemo(() => {
    return getCategoryIcon(type as EntryType, category || '기타');
  }, [type, category]);

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

  const disabled =
    !Number.isFinite(amount) ||
    amount <= 0 ||
    (category?.trim() || '') === '' ||
    (description?.trim() || '') === '';

  const handleSave = () => {
    if (description.trim() === '') return;
    onSave({
      type,
      amount,
      date: initial.date,
      category: (category?.trim() || '기타') as string,
      description: description.trim(),
      memo: String(memo ?? ''),
    });
  };

  return (
    <>
      <div
        ref={sheetRef}
        className="
          absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-[553px]
          bg-[color:var(--color-white-800)] rounded-tl-[30px] rounded-tr-[30px]
          shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden
        "
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-[17px] w-11 h-1 bg-[color:var(--color-gray-200)] rounded-[2px]" />

        <div className="absolute left-0 top-[34px] w-96 px-6 inline-flex justify-center items-center">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
            {titleDate}
          </div>
        </div>

        {/* 카테고리 미리보기 (그리드 제거 / 누르면 모달로 이동) */}
        <div className="absolute left-0 top-[82px] w-96 px-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            aria-label="카테고리 수정"
            className="flex flex-col items-center active:scale-[0.99]"
          >
            <div className="size-12 p-3 bg-[color:var(--color-sub-skyblue)] rounded-3xl flex justify-center items-center">
              <img src={categoryIconSrc} alt="" className="size-6" draggable={false} />
            </div>

            <div className="mt-2 text-[color:var(--color-gray-800)] text-sm font-medium">
              {category?.trim() || '기타'}
            </div>
          </button>
        </div>

        {/* 분류 */}
        <div className="w-96 h-11 px-6 left-0 top-[181px] absolute inline-flex justify-start items-center gap-3">
          <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
            분류
          </div>

          <div className="flex-1 flex justify-start items-center gap-[5px]">
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                setType('income');
                setCategory('기타');
              }}
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
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                setType('expense');
                setCategory('기타'); // ✅ 여기 추가
              }}
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

        {/* 금액 */}
        <div className="w-96 px-6 left-0 top-[233px] absolute inline-flex flex-nowrap justify-start items-start gap-3">
          <div className="py-2">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight whitespace-nowrap shrink-0">
              금액
            </div>
          </div>

          <div className="flex-1 min-w-0 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className={[
                'flex-1 min-w-0 self-stretch bg-transparent outline-none text-base font-medium leading-6 tracking-tight',
                type === 'income'
                  ? 'text-[color:var(--color-main-skyblue)]'
                  : 'text-[color:var(--color-error)]',
              ].join(' ')}
            />
          </div>
        </div>

        {/* 내역 */}
        <div className="w-96 px-6 left-0 top-[285px] absolute inline-flex flex-nowrap justify-start items-start gap-3">
          <div className="py-2">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight whitespace-nowrap shrink-0">
              내역
            </div>
          </div>

          <div className="flex-1 min-w-0 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내역을 입력하세요"
              className="flex-1 min-w-0 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
            />
          </div>
        </div>

        {/* 메모 */}
        <div className="w-96 px-6 left-0 top-[337px] absolute inline-flex flex-nowrap justify-start items-start gap-3">
          <div className="py-2">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight whitespace-nowrap shrink-0">
              메모
            </div>
          </div>

          <div className="flex-1 min-w-0 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모하기"
              className="flex-1 min-w-0 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="absolute left-6 right-6 bottom-[34px]">
          <Button disabled={disabled} onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>

      {/* 카테고리 수정 모달 (이미 있는 컴포넌트 사용) */}
      <LedgerCategoryModal
        open={isCategoryModalOpen}
        mode={type}
        value={category}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={(nextCategory) => {
          setCategory(nextCategory);
          setIsCategoryModalOpen(false);
        }}
      />
    </>
  );
}
