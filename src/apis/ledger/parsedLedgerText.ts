import { api } from '@/lib/api';
import type { ParsedLedgerData } from '@/types/ledger';

type ApiEntryType = '지출' | '수입';

type ApiParsedResult = {
  type: ApiEntryType;
  amount: number;
  description: string;
  memo?: string;
  date: string; // "2026-01-19"
  category: string;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function isWrapper<T>(x: unknown): x is ApiResponse<T> {
  return isRecord(x) && 'isSuccess' in x && 'result' in x;
}

function toEntryType(t: ApiEntryType | undefined): ParsedLedgerData['type'] {
  if (t === '수입') return 'income';
  return 'expense';
}

function normalizeParsed(resData: unknown, originalText: string): ParsedLedgerData {
  const rawUnknown: unknown = isWrapper<ApiParsedResult>(resData) ? resData.result : resData;

  const raw = isRecord(rawUnknown) ? rawUnknown : {};

  const typeRaw = raw['type'];
  const amountRaw = raw['amount'];
  const descriptionRaw = raw['description'];
  const dateRaw = raw['date'];
  const categoryRaw = raw['category'];
  const memoRaw = raw['memo'];

  const apiType: ApiEntryType | undefined =
    typeRaw === '지출' || typeRaw === '수입' ? typeRaw : undefined;

  return {
    type: toEntryType(apiType),
    amount: typeof amountRaw === 'number' ? amountRaw : Number(amountRaw ?? 0),
    description: String(descriptionRaw ?? '').trim(),
    date: String(dateRaw ?? '').trim(),
    category: String(categoryRaw ?? '').trim(),
    memo: String(memoRaw ?? originalText ?? ''),
  };
}

export async function parseLedgerText(text: string): Promise<ParsedLedgerData> {
  const res = await api.post('/accounts/parser', { rawText: text });
  return normalizeParsed(res.data, text);
}
