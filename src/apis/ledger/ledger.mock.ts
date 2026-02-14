import type { LedgerDraft, LedgerEntry } from '@/types/ledger';

let STORE: LedgerEntry[] = [];

export async function createTransaction(draft: LedgerDraft): Promise<LedgerEntry> {
  await delay();

  const item: LedgerEntry = {
    id: crypto.randomUUID(),
    date: draft.date,
    type: draft.type,
    amount: draft.amount,
    category: draft.category,
    description: draft.description,
    memo: draft.memo,
  };

  STORE.unshift(item);
  return item;
}

function delay(ms = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

// 필요하면 조회/수정/삭제도 여기에 같은 방식으로 추가
export async function getTransactionsByDate(date: string): Promise<LedgerEntry[]> {
  await delay();
  return STORE.filter((e) => e.date === date);
}

export async function updateTransaction(id: string, patch: Partial<LedgerDraft>) {
  await delay();
  STORE = STORE.map((e) => (e.id === id ? { ...e, ...patch } : e));
  return STORE.find((e) => e.id === id) ?? null;
}

export async function deleteTransaction(id: string) {
  await delay();
  STORE = STORE.filter((e) => e.id !== id);
  return true;
}
