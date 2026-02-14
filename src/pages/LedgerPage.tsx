import { useEffect, useMemo, useState, useCallback } from 'react';

import { blueClose, bluePlus } from '@/assets';

import type { ParsedLedgerData, LedgerEntry, LedgerDraft } from '@/types/ledger';

import LedgerCalendar from '@/components/ledger/LedgerCalendar';
import LedgerHeader from '@/components/ledger/LedgerHeader';
import LedgerActionSheet from '@/components/ledger/LedgerActionSheet';
import LedgerPasteModal from '@/components/ledger/LedgerPasteModal';
import LedgerParsedModal from '@/components/ledger/LedgerParsedModal';
import ManualUpdateModal from '@/components/ledger/ManualUpdateModal';

import LedgerEntryList from '@/components/ledger/LedgerEntryList';
import LedgerEditModal from '@/components/ledger/LedgerEditModal';

import { parseLedgerText } from '@/apis/ledger/parsedLedgerText';

import useLedgerModals from '@/hooks/ledger/useLedgerModals';

import {
  createTransaction,
  getTransactionsByDate,
  updateTransaction,
  deleteTransaction,
} from '@/apis/ledger';

/* ---------------- utils ---------------- */

const isDev = import.meta.env.DEV;

function devLog(...args: unknown[]) {
  if (!isDev) return;
  console.log(...args);
}

type ApiTransaction = {
  transactionId?: number | string;
  id?: number | string;
  serverId?: number | string;
  date?: string;
  type?: string;
  amount?: number;
  category?: string;
  description?: string;
  memo?: string;
};

type ApiListResponse = {
  result?: ApiTransaction[];
};

type EntryType = 'income' | 'expense';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

// UI: YYYY.MM.DD
function formatDateUI(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}.${m}.${day}`;
}

// API: YYYY-MM-DD (조회/저장에 안정적으로 쓰기)
function formatDateAPI(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

// 서버에서 내려오는 date(2026-01-19 / 2026-01-19T14:30:00)를 UI 포맷으로
function normalizeDateToUI(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    // 이미 YYYY.MM.DD일 수도 있으니 그대로 둠
    return dateStr;
  }
  return formatDateUI(d);
}

// 서버에서 내려오는 type(지출/수입 or income/expense)을 앱 도메인으로
function normalizeType(raw: unknown): EntryType {
  if (raw === '지출') return 'expense';
  if (raw === '수입') return 'income';
  if (raw === 'expense' || raw === 'income') return raw;
  return 'expense';
}

// getTransactionsByDate 결과가 어떤 모양이든 LedgerEntry로 안전하게 변환
function normalizeEntries(list: ApiTransaction[]): LedgerEntry[] {
  return list.map((x, idx) => {
    const serverId =
      x.transactionId != null
        ? String(x.transactionId)
        : x.id != null
          ? String(x.id)
          : x.serverId != null
            ? String(x.serverId)
            : '';

    const id = serverId ? `tx-${serverId}` : `tmp_${Date.now()}_${idx}`;

    return {
      id,
      serverId: serverId || undefined,
      date: normalizeDateToUI(String(x.date ?? '')),
      type: normalizeType(x.type),
      amount: Number(x.amount ?? 0),
      category: String(x.category ?? '').trim(),
      description: String(x.description ?? '').trim(),
      memo: String(x.memo ?? ''),
    };
  });
}

// ParsedLedgerData.date(2026-01-19 같은 값)를 LedgerDraft.date(UI 포맷)로
function normalizeParsedDateToUIDraft(dateStr: string) {
  return normalizeDateToUI(dateStr);
}

/* ---------------- page ---------------- */

export default function LedgerPage() {
  const [isFabOpen, setIsFabOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // UI 표시용
  const selectedDateLabelUI = useMemo(() => formatDateUI(selectedDate), [selectedDate]);
  // API 조회용
  const selectedDateLabelAPI = useMemo(() => formatDateAPI(selectedDate), [selectedDate]);

  const onToggleFab = () => setIsFabOpen((v) => !v);
  const onCloseFab = () => setIsFabOpen(false);

  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const refreshSelectedDate = useCallback(async () => {
    const raw = await getTransactionsByDate(selectedDateLabelAPI);

    let list: ApiTransaction[] = [];
    if (Array.isArray(raw)) {
      list = raw;
    } else if (raw && typeof raw === 'object' && 'result' in raw) {
      list = (raw as ApiListResponse).result ?? [];
    }

    devLog('[GET BY DATE] count=', list.length, 'date=', selectedDateLabelAPI);

    setEntries(normalizeEntries(list)); // ✅ 한 번만
  }, [selectedDateLabelAPI]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const raw = await getTransactionsByDate(selectedDateLabelAPI);
        if (!alive) return;

        let list: ApiTransaction[] = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && typeof raw === 'object' && 'result' in raw) {
          list = (raw as ApiListResponse).result ?? [];
        }

        // ✅ 민감 데이터 raw 그대로 로깅 금지
        devLog('[GET BY DATE] count=', list.length, 'date=', selectedDateLabelAPI);

        setEntries(normalizeEntries(list)); // ✅ 한 번만
      } catch (e) {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : '내역 조회 실패';
        setLoadError(msg);
        setEntries([]);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedDateLabelAPI]);

  const visibleEntries = entries; // 조회가 날짜별이면 여기서 필터 걸지 말기

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

  // 수동 입력 저장
  const handleSaveManual = async (draft: {
    date: string;
    type: EntryType;
    amount: number;
    category: string;
    description: string;
    memo?: string;
  }) => {
    const payload: LedgerDraft = {
      date: draft.date, // UI 포맷 유지 (너희 기존대로)
      type: draft.type,
      amount: draft.amount,
      category: draft.category,
      description: draft.description,
      memo: draft.memo ?? '',
    };

    try {
      const res = await createTransaction(payload);
      console.log('[CREATED]', res);
      await refreshSelectedDate();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setIsManualOpen(false);
    }
  };

  // 파싱 저장
  const handleSaveParsed = async (payload: ParsedLedgerData) => {
    const draft: LedgerDraft = {
      type: payload.type,
      amount: payload.amount,
      category: payload.category?.trim() ?? '',
      description: payload.description?.trim() ?? '',
      date: normalizeParsedDateToUIDraft(payload.date), // UI 포맷으로 저장
      memo: payload.memo ?? '',
    };

    try {
      const res = await createTransaction(draft);
      console.log('[CREATED PARSED]', res);
      await refreshSelectedDate();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : '저장 실패');
    } finally {
      onCloseParsed();
    }
  };

  // 수정 저장
  const handleSaveEdit = async (next: LedgerEntry) => {
    try {
      const serverId = next.serverId ?? '';
      if (!serverId) {
        alert('serverId(transactionId)가 없어 수정할 수 없어요.');
        return;
      }

      await updateTransaction(serverId, {
        date: next.date,
        type: next.type,
        amount: next.amount,
        category: next.category,
        description: next.description,
        memo: next.memo ?? '',
      });

      await refreshSelectedDate();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : '수정 실패');
    } finally {
      closeEdit();
    }
  };

  // 삭제
  const handleDeleteEdit = async (uiId: string) => {
    try {
      // uiId: 'tx-33'
      const target = entries.find((e) => e.id === uiId);

      console.log('[DELETE] uiId=', uiId);
      console.log('[DELETE] target=', target);

      if (!target?.serverId) {
        alert('serverId가 없어 삭제할 수 없어요. (서버 PK 필요)');
        return;
      }

      const serverId = String(target.serverId); // '33'
      console.log('[DELETE] serverId=', serverId);

      await deleteTransaction(serverId); // 여기만 serverId로!

      // 화면에서도 제거 (uiId 기준으로)
      setEntries((prev) => prev.filter((e) => e.id !== uiId));
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : '삭제 실패');
    } finally {
      closeEdit();
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pb-28 overflow-y-auto">
      <div className="h-[54px] w-full shrink-0" />

      <div className="w-full">
        <LedgerHeader />
      </div>

      <div className="w-full max-w-[320px]">
        <div className="mt-[30px] bg-white rounded-[20px] shadow-[0_0_8px_rgba(0,0,0,0.20)] overflow-hidden">
          <LedgerCalendar selectedDate={selectedDate} onChangeSelectedDate={setSelectedDate} />
        </div>

        {isLoading && (
          <div className="mt-3 text-center text-sm text-[color:var(--color-gray-600)]">
            불러오는 중...
          </div>
        )}
        {!!loadError && (
          <div className="mt-3 text-center text-sm text-[color:var(--color-error)]">
            {loadError}
          </div>
        )}

        <div className="mt-4">
          <LedgerEntryList items={visibleEntries} onItemClick={openEdit} />
        </div>
      </div>

      <LedgerPasteModal
        open={isPasteOpen}
        value={pasteText}
        onChange={setPasteText}
        onClose={onClosePaste}
        onSubmit={onSubmitPaste}
        loading={isParsing}
        error={pasteError}
      />

      <ManualUpdateModal
        key={manualKey}
        open={isManualOpen}
        date={selectedDateLabelUI} // UI 모달은 UI 포맷
        onClose={() => setIsManualOpen(false)}
        onSaveExpense={handleSaveManual}
      />

      <LedgerParsedModal
        key={`${isParsedOpen}-${parsedData?.date ?? ''}-${parsedData?.amount ?? ''}-${parsedData?.category ?? ''}-${parsedData?.description ?? ''}`}
        open={isParsedOpen}
        data={parsedData}
        onClose={onCloseParsed}
        onSave={handleSaveParsed}
      />

      <LedgerEditModal
        key={`${isEditOpen}-${editEntry?.id ?? 'none'}`}
        open={isEditOpen}
        entry={editEntry}
        onClose={closeEdit}
        onSave={handleSaveEdit}
        onDelete={handleDeleteEdit}
      />

      {isFabOpen && (
        <div className="fixed inset-0 z-40" onClick={onCloseFab}>
          <div className="fixed right-5 bottom-[160px] z-50" onClick={(e) => e.stopPropagation()}>
            <LedgerActionSheet onPaste={onPaste} onManual={onManual} />
          </div>
        </div>
      )}

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
