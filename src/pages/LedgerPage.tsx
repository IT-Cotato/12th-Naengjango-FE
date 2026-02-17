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

import { getBudgetStatus } from '@/apis/ledger/status.api';

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

// API: YYYY-MM-DD
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

/* ---------------- page ---------------- */

export default function LedgerPage() {
  const [isFabOpen, setIsFabOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ✅ 헤더 예산
  const [budget, setBudget] = useState<{ todayRemaining: number; monthRemaining: number }>({
    todayRemaining: 0,
    monthRemaining: 0,
  });
  const [budgetLoading, setBudgetLoading] = useState(false);

  // ✅ 캘린더 점 (YYYY-MM-DD -> todayRemaining)
  const [dayRemainingMap, setDayRemainingMap] = useState<Record<string, number>>({});
  const [monthMapLoading, setMonthMapLoading] = useState(false);

  // UI 표시용
  const selectedDateLabelUI = useMemo(() => formatDateUI(selectedDate), [selectedDate]);
  // API 조회용
  const selectedDateLabelAPI = useMemo(() => formatDateAPI(selectedDate), [selectedDate]);

  // ✅ deps 안정화
  const selectedYear = useMemo(() => selectedDate.getFullYear(), [selectedDate]);
  const selectedMonth = useMemo(() => selectedDate.getMonth() + 1, [selectedDate]); // 1~12
  const selectedDay = useMemo(() => selectedDate.getDate(), [selectedDate]);

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
    setEntries(list as unknown as LedgerEntry[]);
  }, [selectedDateLabelAPI]);

  // ✅ 헤더 예산(선택일 기준) 조회
  const refreshBudget = useCallback(async () => {
    setBudgetLoading(true);
    try {
      const res = await getBudgetStatus({
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
      });
      setBudget(res);
    } catch {
      setBudget({ todayRemaining: 0, monthRemaining: 0 });
    } finally {
      setBudgetLoading(false);
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  // ✅ 월 점맵(월 단위) 만들기: getBudgetStatus를 1일부터 말일까지 호출해서 map 구성
  const refreshMonthMap = useCallback(async (year: number, month: number) => {
    setMonthMapLoading(true);
    try {
      const lastDay = new Date(year, month, 0).getDate();

      const results = await Promise.all(
        Array.from({ length: lastDay }, async (_, i) => {
          const day = i + 1;
          const key = makeKey(year, month, day);
          try {
            const r = await getBudgetStatus({ year, month, day });
            // ✅ 0도 값으로 넣어야 빨간점 뜸
            return [key, Number(r.todayRemaining ?? 0)] as const;
          } catch {
            // 실패한 날은 "표시 안 함" 처리: null 리턴
            return [key, null] as const;
          }
        }),
      );

      const next: Record<string, number> = {};
      for (const [k, v] of results) {
        if (v === null) continue;
        next[k] = v; // 0 포함
      }

      devLog('[MONTH MAP] y=', year, 'm=', month, 'keys=', Object.keys(next).length);
      setDayRemainingMap(next);
    } finally {
      setMonthMapLoading(false);
    }
  }, []);

  // ✅ 선택일 바뀌면: 헤더 예산 갱신
  useEffect(() => {
    refreshBudget();
  }, [refreshBudget]);

  // ✅ 월이 바뀌면: 월 점맵 갱신 (월 API 없으니 여기서 N번 호출)
  useEffect(() => {
    refreshMonthMap(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, refreshMonthMap]);

  // ✅ 날짜별 거래 내역 조회
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

        devLog('[GET BY DATE] count=', list.length, 'date=', selectedDateLabelAPI);
        setEntries(normalizeEntries(list));
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

  const visibleEntries = entries;

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

  // ✅ 저장/수정/삭제 후: 내역 + 헤더 예산 + 월 점맵 모두 갱신
  const afterMutationRefresh = useCallback(async () => {
    await Promise.all([
      refreshSelectedDate(),
      refreshBudget(),
      refreshMonthMap(selectedYear, selectedMonth),
    ]);
  }, [refreshSelectedDate, refreshBudget, refreshMonthMap, selectedYear, selectedMonth]);

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
      date: draft.date,
      type: draft.type,
      amount: draft.amount,
      category: draft.category,
      description: draft.description,
      memo: draft.memo ?? '',
    };

    try {
      await createTransaction(payload);
      await afterMutationRefresh();
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
      date: normalizeParsedDateToUIDraft(payload.date),
      memo: payload.memo ?? '',
    };

    try {
      await createTransaction(draft);
      await afterMutationRefresh();
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

      await afterMutationRefresh();
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
      const target = entries.find((e) => e.id === uiId);

      if (!target?.serverId) {
        alert('serverId가 없어 삭제할 수 없어요. (서버 PK 필요)');
        return;
      }

      const transactionId = String(target.serverId);
      await deleteTransaction(transactionId);

      setEntries((prev) => prev.filter((e) => e.id !== uiId));
      await afterMutationRefresh();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : '삭제 실패');
    } finally {
      closeEdit();
    }
  };

  // useEffect(() => {
  //   devLog('dayRemainingMap keys:', Object.keys(dayRemainingMap).length);
  //   const sample = makeKey(selectedYear, selectedMonth, 3);
  //   devLog('sample key exists?', sample, dayRemainingMap[sample]);
  // }, [dayRemainingMap, selectedYear, selectedMonth]);

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pb-28 overflow-y-auto">
      <div className="h-[54px] w-full shrink-0" />

      <div className="w-full">
        <LedgerHeader
          todayRemaining={budget.todayRemaining}
          monthRemaining={budget.monthRemaining}
          loading={budgetLoading}
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

        {monthMapLoading && (
          <div className="mt-2 text-center text-xs text-[color:var(--color-gray-500)]">
            캘린더 예산 불러오는 중...
          </div>
        )}

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
        date={selectedDateLabelUI}
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
