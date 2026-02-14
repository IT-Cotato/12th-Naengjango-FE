import usePasteModal from './usePasteModal';
import useManualModal from './useManualModal';
import useEditModal from './useEditModal';

import type { ParsedLedgerData } from '@/types/ledger';

type Params = {
  onCloseFab: () => void;
  // ✅ API 타입 ❌ → 도메인 타입 ✅
  parseLedgerText: (text: string) => Promise<ParsedLedgerData>;
};

export default function useLedgerModals({ onCloseFab, parseLedgerText }: Params) {
  const paste = usePasteModal({ parseLedgerText, onCloseFab });
  const manual = useManualModal();
  const edit = useEditModal();

  return {
    // paste
    isPasteOpen: paste.isPasteOpen,
    setIsPasteOpen: paste.setIsPasteOpen,
    pasteText: paste.pasteText,
    setPasteText: paste.setPasteText,

    // manual
    isManualOpen: manual.isManualOpen,
    setIsManualOpen: manual.setIsManualOpen,
    manualKey: manual.manualKey,

    // parsed
    isParsedOpen: paste.isParsedOpen,
    setIsParsedOpen: paste.setIsParsedOpen,
    parsedData: paste.parsedData,
    setParsedData: paste.setParsedData,

    // edit
    isEditOpen: edit.isEditOpen,
    setIsEditOpen: edit.setIsEditOpen,
    editEntry: edit.editEntry,
    setEditEntry: edit.setEditEntry,

    // api
    isParsing: paste.isParsing,
    setIsParsing: paste.setIsParsing,
    pasteError: paste.pasteError,
    setPasteError: paste.setPasteError,

    // handlers
    onPaste: paste.onPaste,
    onManual: () => manual.onManual(onCloseFab),
    onClosePaste: paste.onClosePaste,
    onSubmitPaste: paste.onSubmitPaste,
    onCloseParsed: paste.onCloseParsed,

    openEdit: edit.openEdit,
    closeEdit: edit.closeEdit,
  };
}
