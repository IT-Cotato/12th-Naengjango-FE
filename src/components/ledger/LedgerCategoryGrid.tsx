import { useMemo } from 'react';

import type { EntryType } from '@/components/ledger/categoryCatalog';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryIcon,
  normalizeCategory, // ✅ 여기서 가져다 씀
} from '@/components/ledger/categoryCatalog';

type Props = {
  mode: EntryType;
  value: string;
  onChange: (next: string) => void;
};

/** T[number] 유니온에 포함되는지 안전하게 체크 (any 없음) */
function isOneOf<T extends readonly string[]>(value: string, list: T): value is T[number] {
  return list.includes(value);
}

export default function LedgerCategoryGrid({ mode, value, onChange }: Props) {
  const categories = mode === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const normalizedValue = useMemo(() => normalizeCategory(value ?? ''), [value]);

  const activeValue = useMemo(() => {
    const v = normalizedValue;
    if (!v) return '';
    if (isOneOf(v, categories)) return v;
    return '';
  }, [normalizedValue, categories]);

  return (
    <div className="w-80 mx-auto grid grid-cols-4 gap-x-5 gap-y-6">
      {categories.map((c) => {
        const active = activeValue === c;
        const iconSrc = getCategoryIcon(mode, c);

        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="flex flex-col items-center"
          >
            <div
              className={[
                'w-11 h-11 rounded-full flex items-center justify-center',
                active ? 'bg-[var(--main_skyblue,#5E97D7)]' : 'bg-[color:var(--color-sub-skyblue)]',
              ].join(' ')}
            >
              <img src={iconSrc} alt="" className="w-6 h-6" draggable={false} />
            </div>

            <div className="mt-1 text-[color:var(--color-gray-800)] text-xs font-medium">{c}</div>
          </button>
        );
      })}
    </div>
  );
}
