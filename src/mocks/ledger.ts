import type { LedgerItem } from '@/apis/ledger.service';

export const mockLedger: LedgerItem[] = [
  {
    id: '1',
    type: 'expense',
    amount: 13200,
    description: '스타벅스',
    memo: '',
    date: '2026-02-21',
    category: '카페',
  },
  {
    id: '2',
    type: 'income',
    amount: 50000,
    description: '용돈',
    memo: '',
    date: '2026-02-21',
    category: '용돈',
  },
];
