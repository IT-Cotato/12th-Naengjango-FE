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

function toEntryType(t: ApiEntryType): ParsedLedgerData['type'] {
  return t === '수입' ? 'income' : 'expense';
}

export async function parseLedgerText(text: string): Promise<ParsedLedgerData> {
  const res = await api.post<ApiResponse<ApiParsedResult>>('/accounts/parser', { rawText: text });

  const raw = res.data.result;

  return {
    type: toEntryType(raw.type),
    amount: Number(raw.amount ?? 0),
    description: String(raw.description ?? '').trim(),
    date: String(raw.date ?? '').trim(),
    category: String(raw.category ?? '').trim() || '기타',
    memo: String(raw.memo ?? text ?? ''),
  };
}
