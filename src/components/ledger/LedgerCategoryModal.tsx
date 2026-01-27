import { useMemo, useRef, useState } from 'react';
import Button from '@/components/common/Button';

type Props = {
  open: boolean;
  value: string;
  onClose: () => void;
  onSave: (nextCategory: string) => void;
};

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

export default function LedgerCategoryModal({ open, value, onClose, onSave }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const initial = useMemo(() => value?.trim() || '식비', [value]);
  const [selected, setSelected] = useState<string>(initial);

  if (!open) return null;

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80]"
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

        <div className="w-96 px-6 absolute left-0 top-[34px] flex items-center justify-center">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
            카테고리 수정
          </div>
        </div>

        <div className="absolute left-0 top-[82px] w-96 px-6 flex flex-col items-center">
          <div className="size-16 rounded-full bg-[color:var(--color-sub-skyblue)] flex items-center justify-center" />
          <div className="mt-2 text-[color:var(--color-gray-800)] text-sm font-medium">
            {selected}
          </div>
        </div>

        <div className="absolute left-0 top-[170px] w-96 px-6">
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {CATEGORIES.map((c) => {
              const active = selected === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelected(c)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={[
                      'size-12 rounded-full flex items-center justify-center',
                      active
                        ? 'bg-[color:var(--color-error)]'
                        : 'bg-[color:var(--color-sub-skyblue)]',
                    ].join(' ')}
                  />
                  <div className="text-[color:var(--color-gray-800)] text-xs font-medium">{c}</div>
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
