import { useMemo, useState } from 'react';

import { blueClose, bluePlus } from '@/assets';

import type { ParsedLedgerData } from '@/types/ledger';

import LedgerCalendar from '@/components/ledger/LedgerCalendar';
import LedgerHeader from '@/components/ledger/LedgerHeader';
import LedgerActionSheet from '@/components/ledger/LedgerActionSheet';
import LedgerPasteModal from '@/components/ledger/LedgerPasteModal';
import LedgerParsedModal from '@/components/ledger/LedgerParsedModal';
import ManualUpdateModal from '@/components/ledger/ManualUpdateModal';

import LedgerEntryList from '@/components/ledger/LedgerEntryList';
import LedgerEditModal from '@/components/ledger/LedgerEditModal';

import { parseLedgerText } from '@/apis/ledger/parseLedgerText';

// ✅ hooks
import useLedgerEntries from '@/hooks/ledger/useLedgerEntries';
import useLedgerModals from '@/hooks/ledger/useLedgerModals';
import useLedgerSave from '@/hooks/ledger/useLedgerSave';

/* ---------------- utils ---------------- */

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatDateYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}.${m}.${day}`;
}

function formatFromUnknownDateString(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return formatDateYYYYMMDD(d);
}

/* ---------------- page ---------------- */

export default function LedgerPage() {
  const [isFabOpen, setIsFabOpen] = useState(false);

  // 캘린더 선택 날짜
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const onToggleFab = () => setIsFabOpen((v) => !v);
  const onCloseFab = () => setIsFabOpen(false);

  const selectedDateLabel = useMemo(() => formatDateYYYYMMDD(selectedDate), [selectedDate]);

  /* ---------- entries ---------- */
  const { visibleEntries, addEntry, onSaveEdit, onDeleteEntry } =
    useLedgerEntries(selectedDateLabel);

  /* ---------- modals ---------- */
  const {
    isPasteOpen,
    pasteText,
    setPasteText,

    isManualOpen,
    setIsManualOpen,

    isParsedOpen,
    parsedData,

    isEditOpen,
    editEntry,

    isParsing,
    pasteError,

    onPaste,
    onManual,
    manualKey,
    onClosePaste,
    onSubmitPaste,
    onCloseParsed,
    openEdit,
    closeEdit,
  } = useLedgerModals({ onCloseFab, parseLedgerText });

  /* ---------- save flow ---------- */
  const { onSaveManual, onSaveParsed, onSaveEditEntry } = useLedgerSave({
    addEntry,
    onSaveEdit,
  });

  /* ---------- save wrappers (모달 닫기 포함) ---------- */

  // ✅ 수동 입력 저장 → 저장 후 닫기
  const handleSaveManual = (draft: Parameters<typeof onSaveManual>[0]) => {
    onSaveManual(draft);
    setIsManualOpen(false);
  };

  // ✅ 파싱 저장 → 날짜 정규화 + 저장 후 닫기
  const handleSaveParsed = (payload: ParsedLedgerData /*, type: 'income' | 'expense' */) => {
    onSaveParsed(
      {
        ...payload,
        date: formatFromUnknownDateString(payload.date),
      },
      'expense', // <- 지금 Parsed에서 type 선택 UI 없으면 기본값
    );
    onCloseParsed();
  };

  // ✅ 수정 저장 → 저장 후 닫기
  const handleSaveEdit = (next: Parameters<typeof onSaveEditEntry>[0]) => {
    onSaveEditEntry(next);
    closeEdit();
  };
  // ✅ 삭제 → 삭제 후 닫기
  const handleDeleteEdit = (id: string) => {
    onDeleteEntry(id);
    closeEdit();
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pb-28 overflow-y-auto">
      {/* 상단 여백 */}
      <div className="h-[54px] w-full shrink-0" />

      {/* 헤더 */}
      <div className="w-full">
        <LedgerHeader />
      </div>

      {/* ===== 캘린더 + 내역 ===== */}
      <div className="w-full max-w-[320px]">
        {/* 캘린더 */}
        <div className="mt-[30px] bg-white rounded-[20px] shadow-[0_0_8px_rgba(0,0,0,0.20)] overflow-hidden">
          <LedgerCalendar selectedDate={selectedDate} onChangeSelectedDate={setSelectedDate} />
        </div>

        {/* 내역 리스트 */}
        <div className="mt-4">
          <LedgerEntryList items={visibleEntries} onItemClick={openEdit} />
        </div>
      </div>

      {/* ===== 문자 붙여넣기 ===== */}
      <LedgerPasteModal
        open={isPasteOpen}
        value={pasteText}
        onChange={setPasteText}
        onClose={onClosePaste}
        onSubmit={onSubmitPaste}
        loading={isParsing}
        error={pasteError}
      />

      {/* ===== 수동 입력 ===== */}
      <ManualUpdateModal
        key={manualKey}
        open={isManualOpen}
        date={selectedDateLabel}
        onClose={() => setIsManualOpen(false)}
        onSaveExpense={handleSaveManual}
      />

      {/* ===== 파싱 결과 ===== */}
      <LedgerParsedModal
        open={isParsedOpen}
        data={parsedData}
        onClose={onCloseParsed}
        onSave={handleSaveParsed}
      />

      {/* ===== 수정 ===== */}
      <LedgerEditModal
        key={`${isEditOpen}-${editEntry?.id ?? 'none'}`}
        open={isEditOpen}
        entry={editEntry}
        onClose={closeEdit}
        onSave={handleSaveEdit}
        onDelete={handleDeleteEdit}
      />

      {/* ===== 액션시트 ===== */}
      {isFabOpen && (
        <div className="fixed inset-0 z-40" onClick={onCloseFab}>
          <div className="fixed right-5 bottom-[160px] z-50" onClick={(e) => e.stopPropagation()}>
            <LedgerActionSheet onPaste={onPaste} onManual={onManual} />
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        type="button"
        aria-label={isFabOpen ? '닫기' : '추가'}
        onClick={onToggleFab}
        className="
          fixed right-5 bottom-[92px] z-50 size-12 rounded-full
          bg-[color:var(--color-sub-skyblue)]
          flex items-center justify-center shadow-md
        "
      >
        {isFabOpen ? (
          <img src={blueClose} alt="닫기" className="h-6 w-6" />
        ) : (
          <img src={bluePlus} alt="열기" />
        )}
      </button>
    </div>
  );
}
