import { useMemo, useRef, useState } from 'react';
import type { LedgerEntry } from '@/components/ledger/LedgerEntryList';
import LedgerEditModalSheet from './LedgerEditModalSheet';

type Props = {
  open: boolean;
  entry: LedgerEntry | null;
  onClose: () => void;
  onSave: (next: LedgerEntry) => void;
  onDelete: (id: string) => void;
};

export default function LedgerEditModal({ open, entry, onClose, onSave, onDelete }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // ✅ 카테고리 모달 오픈 상태 (백드랍 닫힘 방지)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // ✅ 삭제 확인 AlertModal 오픈 상태 (백드랍 닫힘 방지 + z-index 조절)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const sheetKey = useMemo(() => {
    if (!entry) return 'empty';
    return `${entry.id}:${entry.type}:${entry.category}:${entry.amount}`;
  }, [entry]);

  if (!open || !entry) return null;

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // ✅ 카테고리 모달/삭제 알럿이 열려있으면 부모 모달 닫히면 안 됨
    if (isCategoryOpen || isDeleteOpen) return;

    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70]" // ✅ 항상 70 유지 (하단 네비/+시트 가림)
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="absolute inset-0 bg-black/25" />

      <LedgerEditModalSheet
        key={sheetKey}
        sheetRef={sheetRef}
        entry={entry}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
        isCategoryOpen={isCategoryOpen}
        setIsCategoryOpen={setIsCategoryOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
    </div>
  );
}
