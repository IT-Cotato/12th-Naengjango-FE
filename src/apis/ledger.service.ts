import { api } from '@/lib/api';

export type EntryType = 'income' | 'expense';

export type ParsedLedgerData = {
  amount: number;
  description: string;
  date: string;
  category: string;
  memo?: string;
};

export type LedgerItem = {
  id: string; // 삭제/수정 포함돼있다 했으니 보통 있음
  type: EntryType;
  amount: number;
  description: string;
  memo?: string;
  date: string; // "2026-02-21"
  category: string;
};

export async function getLedgerByDate(date: string) {
  const res = await api.get<LedgerItem[]>('/ledger', { params: { date } });
  return res.data;
}

export type CreateLedgerPayload = {
  date: string;
  type: EntryType;
  amount: number;
  category: string;
  description: string;
  memo?: string;
};

export async function createLedger(payload: CreateLedgerPayload) {
  const res = await api.post('/ledger', payload);
  return res.data;
}

export async function updateLedger(id: string, payload: Partial<CreateLedgerPayload>) {
  const res = await api.patch(`/ledger/${id}`, payload);
  return res.data;
}

export async function deleteLedger(id: string) {
  const res = await api.delete(`/ledger/${id}`);
  return res.data;
}
