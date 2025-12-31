import type { TabKey } from '../icons/tabIcons';

export type TabItem = {
  key: TabKey;
  ariaLabel: string;
  to: string;
};

// 나중에 순서 변경 가능
export const TABS: TabItem[] = [
  { key: 'home', ariaLabel: '홈', to: '/' },
  { key: 'ledger', ariaLabel: '가계부', to: '/ledger' },
  { key: 'freeze', ariaLabel: '냉동', to: '/freeze' },
  { key: 'report', ariaLabel: '리포트', to: '/report' },
  { key: 'my', ariaLabel: '마이페이지', to: '/my' },
];
