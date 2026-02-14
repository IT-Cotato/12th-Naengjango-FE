// src/hooks/ledger/useLedgerSave.ts
import type { ParsedLedgerData, LedgerEntry } from '@/types/ledger';

/* -----------------------------
 * Types
 * ----------------------------- */

// 수동 입력 모달에서 넘어오는 draft 타입
type ManualDraft = {
  date: string; // YYYY.MM.DD
  type: LedgerEntry['type']; // 'income' | 'expense'
  amount: number;
  category: string;
  description: string;
  memo?: string;
};

type Params = {
  // id는 이 훅에서 생성하지 않음 (상위에서 관리)
  addEntry: (entry: Omit<LedgerEntry, 'id'>) => void;
  onSaveEdit: (next: LedgerEntry) => void;
};

/* -----------------------------
 * Hook
 * ----------------------------- */

export default function useLedgerSave({ addEntry, onSaveEdit }: Params) {
  /**
   * ✅ 수동 입력 저장
   * - income / expense 모두 지원
   */
  const onSaveManual = (draft: ManualDraft) => {
    addEntry({
      date: draft.date,
      type: draft.type,
      amount: draft.amount,
      category: draft.category.trim(),
      description: draft.description.trim(),
      memo: draft.memo ?? '',
    });
  };

  /**
   * ✅ 파싱 저장
   * - ParsedLedgerData는 type이 없으므로
   * - type은 호출부에서 결정 (기본값: expense)
   */
  const onSaveParsed = (payload: ParsedLedgerData, type: LedgerEntry['type'] = 'expense') => {
    addEntry({
      date: payload.date,
      type,
      amount: payload.amount,
      category: payload.category.trim(),
      description: payload.description.trim(),
      memo: payload.memo ?? '',
    });
  };

  /**
   * ✅ 수정 저장
   * - 그대로 상위 로직에 위임
   */
  const onSaveEditEntry = (next: LedgerEntry) => {
    onSaveEdit({
      ...next,
      category: next.category.trim(),
      description: next.description.trim(),
      memo: next.memo ?? '',
    });
  };

  return {
    onSaveManual,
    onSaveParsed,
    onSaveEditEntry,
  };
}
