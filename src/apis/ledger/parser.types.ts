// src/apis/ledger/parser.types.ts
export type ApiEntryType = '지출' | '수입';

// 서버가 result로 주는 파싱 결과(예상)
export type ApiParsedResult = {
  type: ApiEntryType;
  amount: number;
  description: string;
  memo?: string;
  date: string; // "YYYY-MM-DD"
  category: string;
};

// 서버 공통 wrapper(예상)
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};
