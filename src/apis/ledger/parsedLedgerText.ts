import { api } from '@/lib/api';
import type { ParsedLedgerData } from '@/types/ledger';

type ApiEntryType = '지출' | '수입';

type ApiParsedResult = {
  type: ApiEntryType;
  amount: number;
  description: string;
  memo?: string;
  date: string;
  category: string;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

function isApiResponse<T>(x: unknown): x is ApiResponse<T> {
  return typeof x === 'object' && x !== null && 'isSuccess' in x && 'result' in x;
}

function toEntryType(t: ApiEntryType): ParsedLedgerData['type'] {
  return t === '수입' ? 'income' : 'expense';
}

function normalizeParsed(resData: unknown, originalText: string): ParsedLedgerData {
  const raw: ApiParsedResult | undefined = isApiResponse<ApiParsedResult>(resData)
    ? resData.result
    : (resData as ApiParsedResult | undefined);

  return {
    type: toEntryType(raw?.type ?? '지출'),
    amount: Number(raw?.amount ?? 0),
    description: String(raw?.description ?? '').trim(),
    date: String(raw?.date ?? '').trim(),
    category: String(raw?.category ?? '').trim() || '기타',
    memo: String(raw?.memo ?? originalText ?? ''),
  };
}

export async function parseLedgerText(text: string): Promise<ParsedLedgerData> {
  const res = await api.post<ApiResponse<ApiParsedResult>>('/accounts/parser', { rawText: text });
  return normalizeParsed(res.data, text);
}
