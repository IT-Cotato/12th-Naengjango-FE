import { useState } from 'react';
import type { LedgerEntry } from '@/components/ledger/LedgerEntryList';

export default function useEditModal() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<LedgerEntry | null>(null);

  const openEdit = (entry: LedgerEntry) => {
    setEditEntry(entry);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditEntry(null);
  };

  return {
    isEditOpen,
    setIsEditOpen,
    editEntry,
    setEditEntry,
    openEdit,
    closeEdit,
  };
}
