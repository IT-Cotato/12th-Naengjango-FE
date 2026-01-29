import { useMemo } from 'react';

import type { EntryType } from '@/components/ledger/categoryCatalog';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryIcon,
} from '@/components/ledger/categoryCatalog';

type Props = {
  mode: EntryType;
  value: string;
  onChange: (next: string) => void;
};

function normalizeCategory(v: string) {
  return v
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[／]/g, '/');
}

/** T[number] 유니온에 포함되는지 안전하게 체크 (any 없음) */
function isOneOf<T extends readonly string[]>(value: string, list: T): value is T[number] {
  return list.includes(value);
}

export default function LedgerCategoryGrid({ mode, value, onChange }: Props) {
  const categories = mode === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // ✅ value가 "의료/건강 " 같이 들어오는 케이스 방지
  const normalizedValue = useMemo(() => normalizeCategory(value ?? ''), [value]);

  // ✅ value가 categories에 있으면 그걸로 active 판단, 아니면 active 없음
  // (원하는 경우: 기본 선택 강제하려면 여기서 categories[0]로 보정 가능)
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
              {/* 아이콘이 작아지는 문제 방지:
                 - 부모가 flex center라서 img에 w/h 주면 OK
                 - SVG가 viewBox/width-height 따라 작게 보이면 w-6 h-6로 올리면 됨 */}
              <img src={iconSrc} alt="" className="w-6 h-6" draggable={false} />
            </div>

            <div className="mt-1 text-[color:var(--color-gray-800)] text-xs font-medium">{c}</div>
          </button>
        );
      })}
    </div>
  );
}
