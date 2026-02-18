import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

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

import { getBudgetStatus } from '@/apis/ledger/status.api';

/* ---------------- utils ---------------- */

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

function formatDateUI(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}.${m}.${day}`;
}

function formatDateAPI(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function normalizeDateToUI(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return formatDateUI(d);
}

function normalizeType(raw: unknown): EntryType {
  if (raw === '지출') return 'expense';
  if (raw === '수입') return 'income';
  if (raw === 'expense' || raw === 'income') return raw;
  return 'expense';
}

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

function normalizeParsedDateToUIDraft(dateStr: string) {
  return normalizeDateToUI(dateStr);
}

function makeKey(year: number, month: number, day: number) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/* ---------------- loading overlay ---------------- */

function FullscreenLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <div className="rounded-xl bg-white px-6 py-4 shadow-lg">
        <div className="text-sm text-[color:var(--color-gray-700)]">가계부 불러오는 중...</div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function LedgerPage() {
  const { isLoading: globalLoading, setLoading } = useLoading();

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [budget, setBudget] = useState<{ todayRemaining: number; monthRemaining: number }>({
    todayRemaining: 0,
    monthRemaining: 0,
  });

  const [dayRemainingMap, setDayRemainingMap] = useState<Record<string, number>>({});

  const selectedDateLabelUI = useMemo(() => formatDateUI(selectedDate), [selectedDate]);
  const selectedDateLabelAPI = useMemo(() => formatDateAPI(selectedDate), [selectedDate]);

  const selectedYear = useMemo(() => selectedDate.getFullYear(), [selectedDate]);
  const selectedMonth = useMemo(() => selectedDate.getMonth() + 1, [selectedDate]);
  const selectedDay = useMemo(() => selectedDate.getDate(), [selectedDate]);

  const onToggleFab = () => setIsFabOpen((v) => !v);
  const onCloseFab = () => setIsFabOpen(false);

  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loadError, setLoadError] = useState('');

  /* ---------------- 데이터 로딩 ---------------- */

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setLoadError('');

      try {
        // 1️⃣ 거래내역
        const raw = await getTransactionsByDate(selectedDateLabelAPI);

        let list: ApiTransaction[] = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && typeof raw === 'object' && 'result' in raw) {
          list = (raw as ApiListResponse).result ?? [];
        }

        if (!alive) return;

        setEntries(normalizeEntries(list));

        // 2️⃣ 오늘 예산
        const budgetRes = await getBudgetStatus({
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
        });

        if (!alive) return;
        setBudget(budgetRes);

        // 3️⃣ 월 점맵
        const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();

        const results = await Promise.all(
          Array.from({ length: lastDay }, async (_, i) => {
            const day = i + 1;
            const key = makeKey(selectedYear, selectedMonth, day);
            try {
              const r = await getBudgetStatus({
                year: selectedYear,
                month: selectedMonth,
                day,
              });
              return [key, Number(r.todayRemaining ?? 0)] as const;
            } catch {
              return [key, null] as const;
            }
          }),
        );

        const next: Record<string, number> = {};
        for (const [k, v] of results) {
          if (v === null) continue;
          next[k] = v;
        }

        if (!alive) return;
        setDayRemainingMap(next);
      } catch (e) {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : '내역 조회 실패';
        setLoadError(msg);
        setEntries([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedDateLabelAPI, selectedYear, selectedMonth, selectedDay, setLoading]);

  /* ---------------- 모달 로직 ---------------- */

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

  /* ---------------- 저장/수정/삭제 ---------------- */

  const afterMutationRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await getTransactionsByDate(selectedDateLabelAPI);
      let list: ApiTransaction[] = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && typeof raw === 'object' && 'result' in raw) {
        list = (raw as ApiListResponse).result ?? [];
      }
      setEntries(normalizeEntries(list));
    } finally {
      setLoading(false);
    }
  }, [selectedDateLabelAPI, setLoading]);

  const handleSaveManual = async (draft: {
    date: string;
    type: EntryType;
    amount: number;
    category: string;
    description: string;
    memo?: string;
  }) => {
    try {
      await createTransaction(draft as LedgerDraft);
      await afterMutationRefresh();
    } finally {
      setIsManualOpen(false);
    }
  };

  const handleSaveParsed = async (payload: ParsedLedgerData) => {
    try {
      await createTransaction({
        type: payload.type,
        amount: payload.amount,
        category: payload.category ?? '',
        description: payload.description ?? '',
        date: normalizeParsedDateToUIDraft(payload.date),
        memo: payload.memo ?? '',
      });
      await afterMutationRefresh();
    } finally {
      onCloseParsed();
    }
  };

  const handleSaveEdit = async (next: LedgerEntry) => {
    if (!next.serverId) return;
    await updateTransaction(next.serverId, next);
    await afterMutationRefresh();
    closeEdit();
  };

  const handleDeleteEdit = async (uiId: string) => {
    const target = entries.find((e) => e.id === uiId);
    if (!target?.serverId) return;

    const cleanedId = String(target.serverId).replace(/^tx-/, '');

    await deleteTransaction(cleanedId);
    await afterMutationRefresh();
    closeEdit();
  };

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pb-28 overflow-y-auto">
      {globalLoading && <FullscreenLoading />}

      <div className="h-[54px] w-full shrink-0" />

      <div className="w-full">
        <LedgerHeader
          todayRemaining={budget.todayRemaining}
          monthRemaining={budget.monthRemaining}
          loading={false}
        />
      </div>

      <div className="w-full max-w-[320px]">
        <div className="mt-[30px] bg-white rounded-[20px] shadow-[0_0_8px_rgba(0,0,0,0.20)] overflow-hidden">
          <LedgerCalendar
            selectedDate={selectedDate}
            onChangeSelectedDate={setSelectedDate}
            dayRemainingMap={dayRemainingMap}
          />
        </div>

        {!!loadError && (
          <div className="mt-3 text-center text-sm text-[color:var(--color-error)]">
            {loadError}
          </div>
        )}

        <div className="mt-4">
          <LedgerEntryList items={entries} onItemClick={openEdit} />
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
        date={selectedDateLabelUI}
        onClose={() => setIsManualOpen(false)}
        onSaveExpense={handleSaveManual}
      />

      <LedgerParsedModal
        open={isParsedOpen}
        data={parsedData}
        onClose={onCloseParsed}
        onSave={handleSaveParsed}
      />

      <LedgerEditModal
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
