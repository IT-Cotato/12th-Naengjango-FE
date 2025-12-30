import homeActive from '../../assets/icons/tabs/home-active.svg';
import homeInactive from '../../assets/icons/tabs/home-inactive.svg';

import ledgerActive from '../../assets/icons/tabs/ledger-active.svg';
import ledgerInactive from '../../assets/icons/tabs/ledger-inactive.svg';

import freezeActive from '../../assets/icons/tabs/freeze-active.svg';
import freezeInactive from '../../assets/icons/tabs/freeze-inactive.svg';

import reportActive from '../../assets/icons/tabs/report-active.svg';
import reportInactive from '../../assets/icons/tabs/report-inactive.svg';

import myActive from '../../assets/icons/tabs/my-active.svg';
import myInactive from '../../assets/icons/tabs/my-inactive.svg';

export const TAB_ICONS = {
  home: { active: homeActive, inactive: homeInactive },
  ledger: { active: ledgerActive, inactive: ledgerInactive },
  freeze: { active: freezeActive, inactive: freezeInactive },
  report: { active: reportActive, inactive: reportInactive },
  my: { active: myActive, inactive: myInactive },
} as const;

export type TabKey = keyof typeof TAB_ICONS;
