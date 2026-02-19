import { useMemo, useState } from 'react';
import Button from '@/components/common/Button';
import LedgerCategoryModal from '@/components/ledger/LedgerCategoryModal';
import AlertModal from '@/components/common/AlertModal';
import type { LedgerEntry } from '@/types/ledger';

import type { EntryType } from '@/components/ledger/categoryCatalog';
import { getCategoryIcon } from '@/components/ledger/categoryCatalog';

import trash from '@/assets/icons/ic-trash.svg';

type Props = {
  sheetRef: React.RefObject<HTMLDivElement | null>;
  entry: LedgerEntry;
  onClose: () => void;
  onSave: (next: LedgerEntry) => void;
  onDelete: (id: string) => void;

  isCategoryOpen: boolean;
  setIsCategoryOpen: (next: boolean) => void;

  isDeleteOpen: boolean;
  setIsDeleteOpen: (next: boolean) => void;
};

function onlyDigits(str: string) {
  return str.replace(/[^\d]/g, '');
}

function formatNumberWithComma(value: number) {
  return value.toLocaleString('ko-KR');
}

function normalizeCategory(v: string) {
  return v
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[／]/g, '/');
}

export default function LedgerEditModalSheet({
  sheetRef,
  entry,
  onClose,
  onSave,
  onDelete,
  isCategoryOpen,
  setIsCategoryOpen,
  isDeleteOpen,
  setIsDeleteOpen,
}: Props) {
  const [type, setType] = useState<EntryType>(entry.type);
  const [amount, setAmount] = useState<number>(entry.amount);
  const [amountInput, setAmountInput] = useState<string>(
    entry.amount > 0 ? formatNumberWithComma(entry.amount) : '',
  );

  const [category, setCategory] = useState<string>(normalizeCategory(entry.category ?? ''));
  const [description, setDescription] = useState<string>(entry.description ?? '');
  const [memo, setMemo] = useState<string>(entry.memo ?? '');

  const disabledSave = !Number.isFinite(amount) || amount <= 0;

  const categoryIconSrc = useMemo(() => {
    const c = normalizeCategory(category);
    return getCategoryIcon(type, c);
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

  const handleSave = () => {
    if (disabledSave) return;

    onSave({
      ...entry,
      type,
      amount,
      category: normalizeCategory(category || '기타'),
      description: description.trim(),
      memo: memo.trim(),
    });

    onClose();
  };

  const handleTrashClick = () => {
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(entry.id);
    setIsDeleteOpen(false);
    onClose();
  };

  const openCategory = () => setIsCategoryOpen(true);

  const handleCategorySave = (nextCategory: string) => {
    setCategory(normalizeCategory(nextCategory));
  };

  // ✅ 여기서만 type 변경 + category를 기타로 동기화
  const switchType = (nextType: EntryType) => {
    setType(nextType);
    setCategory('기타');
  };

  return (
    <>
      <div
        ref={sheetRef}
        className="
        absolute bottom-0 left-1/2 -translate-x-1/2
        w-96 h-[553px]
        z-[10]
        bg-[color:var(--color-white-800)]
        rounded-tl-[30px] rounded-tr-[30px]
        shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)]
        overflow-hidden
        "
      >
        <div className="w-11 h-1 absolute left-1/2 top-[17px] -translate-x-1/2 bg-[color:var(--color-gray-200)] rounded-xs" />

        <div className="w-96 px-6 absolute left-0 top-[34px] flex items-center justify-center">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
            내역 수정하기
          </div>

          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleTrashClick}
            aria-label="삭제"
            className="absolute right-6 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center"
          >
            <img src={trash} alt="" className="size-6" draggable={false} />
          </button>
        </div>

        <div className="w-96 px-6 absolute left-0 top-[82px] inline-flex flex-col justify-start items-start">
          <div className="self-stretch h-24 inline-flex justify-center items-center gap-6">
            <div className="w-14 h-24 relative">
              <div className="w-14 left-0 top-[54px] absolute inline-flex flex-col justify-start items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={openCategory}
                  className="self-stretch h-5 text-center text-black text-base font-medium leading-6 tracking-tight"
                >
                  {category || '카테고리'}
                </button>
              </div>

              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={openCategory}
                aria-label="카테고리 수정"
                className="size-12 p-3 left-[4px] top-0 absolute bg-[color:var(--color-sub-skyblue)] rounded-3xl inline-flex justify-center items-center"
              >
                <img src={categoryIconSrc} alt="" className="size-6" draggable={false} />
              </button>
            </div>
          </div>
        </div>

        <div className="w-96 h-11 px-6 absolute left-0 top-[181px] inline-flex justify-start items-center gap-3">
          <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight">
            분류
          </div>
          <div className="flex-1 flex justify-start items-center gap-[5px]">
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => switchType('income')}
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
              onClick={() => switchType('expense')}
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
        <div className="w-96 px-6 absolute left-0 top-[233px] inline-flex flex-nowrap justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight whitespace-nowrap shrink-0">
              금액
            </div>
          </div>

          <div className="flex-1 min-w-0 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 min-w-0 self-stretch bg-transparent outline-none text-[color:var(--color-error)] text-base font-medium leading-6 tracking-tight"
              placeholder="0"
            />
          </div>
        </div>

        {/* 내역 */}
        <div className="w-96 px-6 absolute left-0 top-[285px] inline-flex flex-nowrap justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight whitespace-nowrap shrink-0">
              내역
            </div>
          </div>

          <div className="flex-1 min-w-0 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 min-w-0 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
              placeholder="내역을 입력하세요"
            />
          </div>
        </div>

        {/* 메모 */}
        <div className="w-96 px-6 absolute left-0 top-[337px] inline-flex flex-nowrap justify-start items-start gap-3">
          <div className="py-2 flex justify-center items-start gap-2.5">
            <div className="text-[color:var(--color-gray-600)] text-lg font-semibold leading-7 tracking-tight whitespace-nowrap shrink-0">
              메모
            </div>
          </div>

          <div className="flex-1 min-w-0 px-4 py-2.5 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)] flex justify-start items-center gap-2.5">
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="flex-1 min-w-0 self-stretch bg-transparent outline-none text-[color:var(--color-gray-600)] text-base font-medium leading-6 tracking-tight"
              placeholder="메모하기"
            />
          </div>
        </div>

        <div className="absolute left-6 right-6 bottom-[34px]">
          <Button disabled={disabledSave} onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>

      <LedgerCategoryModal
        open={isCategoryOpen}
        mode={type}
        value={category}
        onClose={() => setIsCategoryOpen(false)}
        onSave={handleCategorySave}
      />

      <AlertModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="내역을 삭제하시겠습니까?"
        message="복구할 수 없어요"
        twoButtons={{
          leftText: '취소',
          rightText: '삭제',
          onRight: handleConfirmDelete,
        }}
      />
    </>
  );
}
