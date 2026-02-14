// src/apis/ledger/index.ts
import * as real from './ledger.api';
import * as mock from './ledger.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_LEDGER === 'true';

// ✅ LedgerPage에서 쓰는 이름 그대로 export
export const createTransaction = USE_MOCK ? mock.createTransaction : real.createTransaction;
export const getTransactionsByDate = USE_MOCK
  ? mock.getTransactionsByDate
  : real.getTransactionsByDate;
export const updateTransaction = USE_MOCK ? mock.updateTransaction : real.updateTransaction;
export const deleteTransaction = USE_MOCK ? mock.deleteTransaction : real.deleteTransaction;
