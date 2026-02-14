// apis/ledger/types.ts
export type ApiEntryType = '지출' | '수입';

export type ParseLedgerResponse = {
  type: ApiEntryType;
  amount: number;
  description: string;
  date: string;
  category: string;
  memo?: string;
};
