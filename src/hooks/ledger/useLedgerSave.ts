// src/hooks/ledger/useLedgerSave.ts
import type { ParsedLedgerData, LedgerDraft, LedgerEntry } from '@/types/ledger';

type ManualExpenseDraft = {
  date: string;
  amount: number;
  category: string;
  description: string;
  memo?: string; // 수동은 optional일 수 있으니 유지
};

type Params = {
  addEntry: (entry: Omit<LedgerEntry, 'id'>) => void;
  onSaveEdit: (next: LedgerEntry) => void;
};

export default function useLedgerSave({ addEntry, onSaveEdit }: Params) {
  // ✅ 공통: LedgerDraft → "지출" 엔트리로 저장
  const saveDraftAsExpense = (draft: LedgerDraft) => {
    addEntry({
      date: draft.date,
      type: 'expense',
      amount: draft.amount,
      category: draft.category,
      description: draft.description,
      memo: draft.memo, // LedgerDraft는 memo가 무조건 string
    });
  };

  // ✅ 수동 입력 저장 (수동용 draft → LedgerDraft로 정규화)
  const onSaveManualExpenseOnly = (draft: ManualExpenseDraft) => {
    const normalized: LedgerDraft = {
      type: '지출',
      amount: draft.amount,
      description: draft.description ?? '',
      date: draft.date,
      category: draft.category ?? '',
      memo: draft.memo ?? '', // ✅ undefined 방지
    };

    saveDraftAsExpense(normalized);
  };

  // ✅ 파싱 결과 저장 (✅ ParsedLedgerData 그대로 받음)
  // ParsedLedgerData는 type이 없으니까 여기서 type을 "지출"로 채워서 Draft로 정규화
  const onSaveParsedExpenseOnly = (payload: ParsedLedgerData) => {
    const normalized: LedgerDraft = {
      type: '지출',
      amount: payload.amount,
      description: payload.description ?? '',
      date: payload.date,
      category: payload.category ?? '',
      memo: payload.memo ?? '', // ParsedLedgerData는 string이지만 안전빵 OK
    };

    saveDraftAsExpense(normalized);
  };

  // ✅ 수정 저장
  const onSaveEditExpense = (next: LedgerEntry) => {
    onSaveEdit(next);
  };

  return {
    // LedgerPage에서 쓰던 이름 그대로
    onSaveManualExpenseOnly,
    onSaveParsedExpenseOnly,
    onSaveEditExpense,
  };
}
