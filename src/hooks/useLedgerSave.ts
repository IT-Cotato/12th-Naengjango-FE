import type { LedgerEntry } from '@/components/ledger/LedgerEntryList';

type ExpenseDraft = {
  date: string;
  amount: number;
  category: string;
  description: string;
  memo?: string;
};

type Params = {
  addEntry: (entry: Omit<LedgerEntry, 'id'>) => void;
  onSaveEdit: (next: LedgerEntry) => void;
};

export default function useLedgerSave({ addEntry, onSaveEdit }: Params) {
  // ✅ 신규 지출 저장 (수동 / 파싱 공용)
  const handleSaveExpense = (draft: ExpenseDraft) => {
    addEntry({
      date: draft.date,
      type: 'expense',
      amount: draft.amount,
      category: draft.category,
      description: draft.description,
      memo: draft.memo ?? '',
    });
  };

  // ✅ 파싱 결과 저장 (형식 정규화)
  const onSaveParsedExpenseOnly = (payload: {
    type: string;
    amount: number;
    description: string;
    date: string;
    category: string;
    memo: string;
  }) => {
    handleSaveExpense({
      date: payload.date,
      amount: payload.amount,
      category: payload.category ?? '',
      description: payload.description ?? '',
      memo: payload.memo,
    });
  };

  // ✅ 수동 입력 저장
  const onSaveManualExpenseOnly = (draft: ExpenseDraft) => {
    handleSaveExpense(draft);
  };

  // ✅ 수정 저장
  const onSaveEditExpense = (next: LedgerEntry) => {
    onSaveEdit(next);
  };

  return {
    // 🔴 LedgerPage에서 쓰던 이름 그대로
    handleSaveExpense,
    onSaveParsedExpenseOnly,
    onSaveManualExpenseOnly,
    onSaveEditExpense,
  };
}
