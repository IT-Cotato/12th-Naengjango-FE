// 앱 내부 도메인
export type ParsedLedgerData = {
  amount: number;
  date: string;
  description: string;
  category: string;
  memo: string;
};

export type LedgerEntry = {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  memo?: string;
};

export type LedgerDraft = {
  type: 'income' | 'expense'; // "지출" / "수입" 문자열
  amount: number;
  description: string;
  date: string; // "2025.12.21"
  category: string;
  memo: string; // ✅ 무조건 string (undefined 금지)
};
