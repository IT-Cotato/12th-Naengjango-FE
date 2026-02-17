// src/apis/ledger/index.ts
import * as real from './ledger.api';

// ✅ LedgerPage에서 쓰는 이름 그대로 export
export const createTransaction = real.createTransaction;
export const getTransactionsByDate = real.getTransactionsByDate;
export const updateTransaction = real.updateTransaction;
export const deleteTransaction = real.deleteTransaction;
