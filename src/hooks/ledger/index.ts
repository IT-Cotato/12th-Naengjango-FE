// src/hooks/ledger/index.ts
import useLedgerEntries from '@/hooks/ledger/useLedgerEntries';
import useLedgerModals from '@/hooks/ledger/useLedgerModals';
import useLedgerSave from '@/hooks/ledger/useLedgerSave';

import type { ParsedLedgerData } from '@/types/ledger';

type Params = {
  selectedDateLabel: string;
  onCloseFab: () => void;

  // ✅ 도메인 타입으로 통일
  parseLedgerText: (text: string) => Promise<ParsedLedgerData>;

  formatFromUnknownDateString: (dateStr: string) => string; // 지금 save 훅에는 안 씀(남겨도 OK)
};

export default function useLedger({ selectedDateLabel, onCloseFab, parseLedgerText }: Params) {
  const entriesBag = useLedgerEntries(selectedDateLabel);
  const modalsBag = useLedgerModals({ onCloseFab, parseLedgerText });

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
