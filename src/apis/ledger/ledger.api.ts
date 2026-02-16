// src/apis/ledger/ledger.api.ts
import { api } from '@/lib/api';
import { entryTypeToApiType, apiTypeToEntryType } from './mapper';
import type { LedgerDraft, LedgerEntry } from '@/types/ledger';
import type { ApiEntryType } from './types';

const API_PREFIX = '/api'; // ✅ baseURL에서 /api 뺐으니 여기서 붙임

function toApiDate(date: string) {
  return date.replace(/\./g, '-');
}

function toUiDate(date: string) {
  if (!date) return '';
  return date.includes('-') ? date.replace(/-/g, '.') : date;
}

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

type ApiCreateResult = {
  transactionId: number;
};

type ApiTransaction = {
  transaction_id?: number | string;
  transactionId?: number | string;
  id?: number | string;

  type: ApiEntryType;
  amount: number;
  category: string;
  description: string;
  memo?: string;
  date: string;
};

function makeUiId(serverId: string) {
  return `tx-${serverId}`;
}

function normalizeApiTransaction(item: ApiTransaction): LedgerEntry {
  const serverIdRaw = item.transaction_id ?? item.transactionId ?? item.id;
  const serverId = serverIdRaw != null ? String(serverIdRaw) : '';

  return {
    id: serverId ? makeUiId(serverId) : `tmp-${crypto.randomUUID()}`,
    serverId: serverId || undefined,

    type: apiTypeToEntryType(item.type),
    amount: Number(item.amount ?? 0),
    category: String(item.category ?? ''),
    description: String(item.description ?? ''),
    memo: item.memo ?? '',
    date: toUiDate(String(item.date ?? '')),
  };
}

/** 생성: POST /api/accounts/transactions */
export async function createTransaction(draft: LedgerDraft): Promise<LedgerEntry> {
  const res = await api.post<ApiResponse<ApiCreateResult>>(`${API_PREFIX}/accounts/transactions`, {
    type: entryTypeToApiType(draft.type),
    amount: draft.amount,
    category: draft.category,
    description: draft.description,
    memo: draft.memo,
    date: toApiDate(draft.date),
  });

  const txId = res.data?.result?.transactionId;

  if (txId == null) {
    // @ts-expect-error - fallback
    return normalizeApiTransaction(res.data?.result ?? res.data);
  }

  const serverId = String(txId);

  return {
    id: makeUiId(serverId),
    serverId,
    type: draft.type,
    amount: draft.amount,
    category: draft.category,
    description: draft.description,
    memo: draft.memo ?? '',
    date: draft.date,
  };
}

/** 날짜별 조회: GET /api/accounts/transactions?date=YYYY-MM-DD */
export async function getTransactionsByDate(date: string) {
  const res = await api.get<ApiResponse<ApiTransaction[]>>(`${API_PREFIX}/accounts/transactions`, {
    params: { date: toApiDate(date) },
  });

  const list = res.data?.result ?? [];
  return list.map(normalizeApiTransaction);
}

/** 수정: PATCH /api/accounts/transactions/{transactionId} */
export async function updateTransaction(
  transactionId: string,
  patch: Partial<LedgerDraft>,
): Promise<LedgerEntry | null> {
  if (!transactionId) return null;

  const res = await api.patch<ApiResponse<ApiTransaction>>(
    `${API_PREFIX}/accounts/transactions/${transactionId}`,
    {
      ...(patch.type ? { type: entryTypeToApiType(patch.type) } : {}),
      ...(patch.amount != null ? { amount: patch.amount } : {}),
      ...(patch.category != null ? { category: patch.category } : {}),
      ...(patch.description != null ? { description: patch.description } : {}),
      ...(patch.memo != null ? { memo: patch.memo } : {}),
      ...(patch.date ? { date: toApiDate(patch.date) } : {}),
    },
  );

  const item = res.data?.result;
  if (!item) return null;
  return normalizeApiTransaction(item);
}

/** 삭제: DELETE /api/accounts/transactions/{transactionId} */
export async function deleteTransaction(transactionId: string) {
  return api.delete(`${API_PREFIX}/accounts/transactions/${transactionId}`);
}
