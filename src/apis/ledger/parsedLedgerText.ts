// src/apis/ledger/parsedLedgerText.ts
import { api } from '@/lib/api';
import type { ParsedLedgerData } from '@/types/ledger';

const API_PREFIX = '/api';

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

function toEntryType(t: ApiEntryType | undefined): ParsedLedgerData['type'] {
  return t === '수입' ? 'income' : 'expense';
}

function normalizeParsed(
  resData: ApiResponse<ApiParsedResult>,
  originalText: string,
): ParsedLedgerData {
  const raw = resData.result;

  return {
    type: toEntryType(raw?.type),
    amount: Number(raw?.amount ?? 0),
    description: String(raw?.description ?? '').trim(),
    date: String(raw?.date ?? '').trim(),
    category: String(raw?.category ?? '').trim(),
    memo: String(raw?.memo ?? originalText ?? ''),
  };
}

export async function parseLedgerText(text: string): Promise<ParsedLedgerData> {
  const res = await api.post<ApiResponse<ApiParsedResult>>(`${API_PREFIX}/accounts/parser`, {
    rawText: text,
  });
  return normalizeParsed(res.data, text);
}
