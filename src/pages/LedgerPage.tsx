import { blueClose, bluePlus } from '@/assets';

import LedgerCalendar from '@/components/ledger/LedgerCalendar';
import LedgerHeader from '@/components/ledger/LedgerHeader';
import LedgerActionSheet from '@/components/ledger/LedgerActionSheet';
import LedgerPasteModal from '@/components/ledger/LedgerPasteModal';
import LedgerParsedModal from '@/components/ledger/LedgerParsedModal';
import ManualUpdateModal from '@/components/ledger/ManualUpdateModal';

// ✅ 리스트 + 타입
import LedgerEntryList, { type LedgerEntry } from '@/components/ledger/LedgerEntryList';

// ✅ 수정 모달
import LedgerEditModal from '@/components/ledger/LedgerEditModal';

import { parseLedgerText } from '@/apis/ledger/parseLedgerText';
import type { ParsedLedgerData } from '@/types/ledger';
import { useMemo, useState } from 'react';

// ✅ entries 훅
import useLedgerEntries from '@/hook/useLedgerEntries';

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

type ExpenseDraft = {
  date: string; // "2025.12.21"
  amount: number;
  category: string;
  description: string;
  memo?: string;
};

export default function LedgerPage() {
  const [isFabOpen, setIsFabOpen] = useState(false);

  // 문자 붙여넣기 모달
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');

  // 캘린더 선택 날짜
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 수동 입력 모달
  const [isManualOpen, setIsManualOpen] = useState(false);

  // 파싱 결과 모달
  const [isParsedOpen, setIsParsedOpen] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedLedgerData | null>(null);

  // ✅ 수정 모달
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<LedgerEntry | null>(null);

  // API 상태
  const [isParsing, setIsParsing] = useState(false);
  const [pasteError, setPasteError] = useState<string>('');

  const onToggleFab = () => setIsFabOpen((v) => !v);
  const onCloseFab = () => setIsFabOpen(false);

  const selectedDateLabel = useMemo(() => formatDateYYYYMMDD(selectedDate), [selectedDate]);

  // ✅ entries 관련은 전부 훅에서 가져옴 (이름 그대로!)
  const { entries, setEntries, visibleEntries, addEntry, onSaveEdit, onDeleteEntry } =
    useLedgerEntries(selectedDateLabel);

  // ✅ 지출 전용 공통 저장(하나만!)
  const handleSaveExpense = (draft: ExpenseDraft) => {
    addEntry({
      date: draft.date,
      type: 'expense',
      amount: draft.amount,
      category: draft.category,
      description: draft.description,
      memo: draft.memo ?? '',
    });
  };

  // ✅ 리스트 아이템 클릭 → 수정 모달 열기
  const openEdit = (entry: LedgerEntry) => {
    setEditEntry(entry);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditEntry(null);
  };

  const onPaste = () => {
    onCloseFab();
    setIsParsedOpen(false);
    setParsedData(null);

    setPasteError('');
    setPasteText('');
    setIsPasteOpen(true);
  };

  const onManual = () => {
    onCloseFab();
    setIsManualOpen(true);
  };

  const onClosePaste = () => setIsPasteOpen(false);

  const onSubmitPaste = async () => {
    const text = pasteText.trim();
    if (!text || isParsing) return;

    setPasteError('');
    setIsParsing(true);

    try {
      const parsed = await parseLedgerText(text);

      setIsPasteOpen(false);
      setParsedData({ ...parsed, memo: text });
      setIsParsedOpen(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '분석 실패';
      setPasteError(msg);
    } finally {
      setIsParsing(false);
    }
  };

  const onCloseParsed = () => {
    setIsParsedOpen(false);
    setParsedData(null);
  };

  // ✅ ParsedModal 저장: payload → ExpenseDraft → handleSaveExpense
  const onSaveParsedExpenseOnly = (payload: {
    type: string;
    amount: number;
    description: string;
    date: string;
    category: string;
    memo: string;
  }) => {
    handleSaveExpense({
      date: formatFromUnknownDateString(payload.date),
      amount: payload.amount,
      category: payload.category ?? '',
      description: payload.description ?? '',
      memo: payload.memo,
    });

    setIsParsedOpen(false);
    setParsedData(null);
  };

  // ✅ ManualModal 저장: draft 그대로 → handleSaveExpense
  const onSaveManualExpenseOnly = (draft: ExpenseDraft) => {
    handleSaveExpense(draft);
    setIsManualOpen(false);
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pb-28 overflow-y-auto">
      {/* 상단 여백 */}
      <div className="h-[54px] w-full shrink-0" />

      {/* 헤더 */}
      <div className="w-full">
        <LedgerHeader />
      </div>

      {/* ===== 캘린더 + 내역 (같은 폭 컨테이너) ===== */}
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

      {/* ===== 문자 붙여넣기 모달 ===== */}
      <LedgerPasteModal
        open={isPasteOpen}
        value={pasteText}
        onChange={setPasteText}
        onClose={onClosePaste}
        onSubmit={onSubmitPaste}
        loading={isParsing}
        error={pasteError}
      />

      {/* ===== 수동 입력 모달 ===== */}
      <ManualUpdateModal
        open={isManualOpen}
        date={selectedDateLabel}
        onClose={() => setIsManualOpen(false)}
        onSaveExpense={onSaveManualExpenseOnly}
      />

      {/* ===== 파싱 결과 모달 ===== */}
      <LedgerParsedModal
        open={isParsedOpen}
        data={parsedData}
        onClose={onCloseParsed}
        onSave={onSaveParsedExpenseOnly}
      />

      {/* ===== 수정 모달 ===== */}
      <LedgerEditModal
        key={editEntry?.id ?? 'edit'}
        open={isEditOpen}
        entry={editEntry}
        onClose={closeEdit}
        onSave={onSaveEdit}
        onDelete={onDeleteEntry}
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
        className="fixed right-5 bottom-[92px] z-50 size-12 rounded-full
                   bg-[color:var(--color-sub-skyblue)]
                   flex items-center justify-center shadow-md"
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
