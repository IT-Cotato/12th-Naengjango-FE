import type { ApiEntryType } from './types';

/**
 * API → 프론트 도메인
 * "수입" | "지출" → "income" | "expense"
 */
export function apiTypeToEntryType(type: ApiEntryType): 'income' | 'expense' {
  switch (type) {
    case '수입':
      return 'income';
    case '지출':
      return 'expense';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

/**
 * 프론트 도메인 → API
 * "income" | "expense" → "수입" | "지출"
 */
export function entryTypeToApiType(type: 'income' | 'expense'): ApiEntryType {
  switch (type) {
    case 'income':
      return '수입';
    case 'expense':
      return '지출';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
