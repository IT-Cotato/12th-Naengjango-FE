// src/hooks/ledger/index.ts
import useLedgerEntries from '@/hooks/ledger/useLedgerEntries';
import useLedgerModals from '@/hooks/ledger/useLedgerModals';
import useLedgerSave from '@/hooks/ledger/useLedgerSave';

import type { ParseLedgerResponse } from '@/apis/ledger/types';

type Params = {
  selectedDateLabel: string;
  onCloseFab: () => void;
  parseLedgerText: (text: string) => Promise<ParseLedgerResponse>;
  formatFromUnknownDateString: (dateStr: string) => string; // 지금 save 훅에는 안 씀(남겨도 OK)
};

export default function useLedger({ selectedDateLabel, onCloseFab, parseLedgerText }: Params) {
  const entriesBag = useLedgerEntries(selectedDateLabel);
  const modalsBag = useLedgerModals({ onCloseFab, parseLedgerText });

  // ✅ save 훅은 "저장만"
  const saveBag = useLedgerSave({
    addEntry: entriesBag.addEntry,
    onSaveEdit: entriesBag.onSaveEdit,
  });

  return {
    ...entriesBag,
    ...modalsBag,
    ...saveBag,
  };
}
