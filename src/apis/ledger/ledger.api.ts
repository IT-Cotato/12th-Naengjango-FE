import { api } from '@/lib/api';
import { entryTypeToApiType, apiTypeToEntryType } from './mapper';
import type { LedgerDraft, LedgerEntry } from '@/types/ledger';
import type { ApiEntryType } from './types';

const API_PREFIX = '/api';

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
  transactionId: number; // 서버가 주는 PK
};

type ApiTransaction = {
  transaction_id?: number | string;
  transactionId?: number | string;
  id?: number | string;

  type: ApiEntryType; // "지출" | "수입"
  amount: number;
  category: string;
  description: string;
  memo?: string;
  date: string;
};

function makeUiId(serverId: string) {
  return `tx-${serverId}`;
}

/**
 * 핵심: 어떤 형태가 들어와도 서버 PK(숫자)만 뽑아냄
 *  - "33" -> "33"
 *  - 33 -> "33"
 *  - "tx-33" -> "33"
 *  - "" / null -> ""
 */
function toServerId(raw: unknown): string {
  const s = String(raw ?? '').trim();
  if (!s) return '';

  const m = s.match(/(\d+)/);
  return m ? m[1] : '';
}

function normalizeApiTransaction(item: ApiTransaction): LedgerEntry {
  const serverIdRaw = item.transaction_id ?? item.transactionId ?? item.id;
  const serverId = toServerId(serverIdRaw);

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

/** 생성: POST /accounts/transactions */
export async function createTransaction(draft: LedgerDraft): Promise<LedgerEntry> {
  const res = await api.post<ApiResponse<ApiCreateResult>>('/accounts/transactions', {
    type: entryTypeToApiType(draft.type),
    amount: draft.amount,
    category: draft.category,
    description: draft.description,
    memo: draft.memo,
    date: toApiDate(draft.date),
  });

  const txId = res.data?.result?.transactionId;

  if (txId == null) {
    throw new Error('transactionId가 응답에 없습니다.');
  }

  const serverId = String(txId);

  return {
    id: `tx-${serverId}`,
    serverId,
    type: draft.type,
    amount: draft.amount,
    category: draft.category,
    description: draft.description,
    memo: draft.memo ?? '',
    date: draft.date,
  };
}

/** 날짜별 조회: GET /accounts/transactions?date=YYYY-MM-DD */
export async function getTransactionsByDate(date: string) {
  const res = await api.get<ApiResponse<ApiTransaction[]>>('/accounts/transactions', {
    params: { date: toApiDate(date) },
  });

  const list = res.data?.result ?? [];
  return list.map(normalizeApiTransaction);
}

/** 수정: PATCH /accounts/transactions/{transactionId} */
export async function updateTransaction(
  transactionId: string,
  patch: Partial<LedgerDraft>,
): Promise<LedgerEntry | null> {
  const serverId = toServerId(transactionId);
  if (!serverId) return null;

  const res = await api.patch<ApiResponse<ApiTransaction>>(`/accounts/transactions/${serverId}`, {
    ...(patch.type ? { type: entryTypeToApiType(patch.type) } : {}),
    ...(patch.amount != null ? { amount: patch.amount } : {}),
    ...(patch.category != null ? { category: patch.category } : {}),
    ...(patch.description != null ? { description: patch.description } : {}),
    ...(patch.memo != null ? { memo: patch.memo } : {}),
    ...(patch.date ? { date: toApiDate(patch.date) } : {}),
  });

  const item = res.data?.result;
  if (!item) return null;
  return normalizeApiTransaction(item);
}

/** 삭제: DELETE /accounts/transactions/{transactionId} */
export async function deleteTransaction(transactionId: string) {
  const serverId = toServerId(transactionId);
  console.log('[API deleteTransaction param]', { transactionId, serverId });

  if (!serverId) {
    throw new Error('삭제할 transactionId가 올바르지 않습니다.');
  }

  return api.delete(`/accounts/transactions/${serverId}`);
}
