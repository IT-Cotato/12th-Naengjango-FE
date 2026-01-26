import { useMemo, useState } from 'react';
import type { LedgerEntry } from '@/components/ledger/LedgerEntryList';

export default function useLedgerEntries(selectedDateLabel: string) {
  // ✅ 기존 LedgerPage의 entries/setEntries 이름 그대로 유지
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  // ✅ 기존 LedgerPage의 visibleEntries 이름 그대로 유지
  const visibleEntries = useMemo(() => {
    return entries.filter((e) => e.date === selectedDateLabel);
  }, [entries, selectedDateLabel]);

  // ✅ 기존 LedgerPage의 addEntry 이름 그대로 유지
  const addEntry = (entry: Omit<LedgerEntry, 'id'>) => {
    setEntries((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...entry,
      },
      ...prev,
    ]);
  };

  // ✅ 기존 LedgerPage의 onSaveEdit 이름 그대로 유지
  const onSaveEdit = (next: LedgerEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === next.id ? next : e)));
  };

  // ✅ 기존 LedgerPage의 onDeleteEntry 이름 그대로 유지
  const onDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    entries,
    setEntries, // 혹시 너가 나중에 직접 만질 수도 있으니 그대로 제공
    visibleEntries,
    addEntry,
    onSaveEdit,
    onDeleteEntry,
  };
}
