import {
  // expense
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

  // income
  salary,
  pinMoney,
  adjustment,
  refund,
  allocation,
} from '@/assets';

export type EntryType = 'income' | 'expense';

/* =========================
 * Categories
 * ========================= */
export const INCOME_CATEGORIES = ['급여', '용돈', '정산', '환급', '이자/배당', '기타'] as const;
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const EXPENSE_CATEGORIES = [
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
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

/* =========================
 * ✅ shared normalizer (export)
 * ========================= */
export function normalizeCategory(value: string): string {
  return (value ?? '')
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width chars 제거
    .replace(/[／]/g, '/'); // 전각 슬래시 → 일반 슬래시
}

/* =========================
 * Icon maps
 * ========================= */
const INCOME_ICON_MAP: Record<IncomeCategory, string> = {
  급여: salary,
  용돈: pinMoney,
  정산: adjustment,
  환급: refund,
  '이자/배당': allocation,
  기타: elseIcon, // ✅ 수입 기타는 elseIcon
};

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

/* =========================
 * Type guards
 * ========================= */
function isIncomeCategory(v: string): v is IncomeCategory {
  return (INCOME_CATEGORIES as readonly string[]).includes(v);
}

function isExpenseCategory(v: string): v is ExpenseCategory {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(v);
}

/* =========================
 * Public API
 * ========================= */
export function getCategoryIcon(type: EntryType, category: string): string {
  const c = normalizeCategory(category);

  if (type === 'income') {
    if (isIncomeCategory(c)) return INCOME_ICON_MAP[c];
    return elseIcon; // ✅ fallback도 elseIcon
  }

  if (isExpenseCategory(c)) return EXPENSE_ICON_MAP[c];
  return elseIcon;
}
