// src/hooks/ledger/useLedgerSave.ts
import type { ParsedLedgerData, LedgerEntry } from '@/types/ledger';

type ManualDraft = {
  date: string;
  type: LedgerEntry['type']; // 'income' | 'expense'
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
  // ✅ 수동 입력 저장 (income/expense 모두 지원)
  const onSaveManual = (draft: ManualDraft) => {
    addEntry({
      date: draft.date,
      type: draft.type,
      amount: draft.amount,
      category: draft.category,
      description: draft.description,
      memo: draft.memo ?? '',
    });
  };

  // ✅ 파싱 저장 (ParsedLedgerData + type을 함께 받아 저장)
  const onSaveParsed = (payload: ParsedLedgerData, type: LedgerEntry['type'] = 'expense') => {
    addEntry({
      date: payload.date,
      type,
      amount: payload.amount,
      category: payload.category,
      description: payload.description,
      memo: payload.memo ?? '',
    });
  };

  // ✅ 수정 저장
  const onSaveEditEntry = (next: LedgerEntry) => {
    onSaveEdit(next);
  };

  return {
    onSaveManual,
    onSaveParsed,
    onSaveEditEntry,
  };
}
