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
import { getMe } from '@/apis/my/mypage';

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

/* ---------------- page ---------------- */

export default function LedgerPage() {
  const { setLoading } = useLoading();

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ✅ 달 이동(렌더용) - 다음달 버튼 눌렀을 때 "달만" 바뀌게
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth() + 1);
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

  // ✅ 가입일(createdAt)
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  /* ---------------- 가입일(createdAt) 로딩 ---------------- */

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') ?? '';
        if (!accessToken) {
          if (alive) setCreatedAt(null);
          return;
        }

        const res = await getMe(accessToken);
        if (!alive) return;

        const rawCreatedAt = res?.result?.createdAt;
        if (!rawCreatedAt) {
          setCreatedAt(null);
          return;
        }

        const d = new Date(rawCreatedAt);
        if (Number.isNaN(d.getTime())) {
          setCreatedAt(null);
          return;
        }

        setCreatedAt(d);
      } catch {
        if (!alive) return;
        setCreatedAt(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* ---------------- 월 점맵 로딩 ---------------- */

  const refreshMonthMap = useCallback(
    async (year: number, month: number) => {
      const lastDay = new Date(year, month, 0).getDate();

      const results = await Promise.all(
        Array.from({ length: lastDay }, async (_, i) => {
          const day = i + 1;
          const key = makeKey(year, month, day);
          try {
            const r = await getBudgetStatus({ year, month, day });
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

      setDayRemainingMap(next);
    },
    [setDayRemainingMap],
  );

  /* ---------------- 선택일 데이터 로딩 (내역 + 예산) ---------------- */

  const refreshSelectedDateData = useCallback(async () => {
    // 1) 거래내역
    const raw = await getTransactionsByDate(selectedDateLabelAPI);

    let list: ApiTransaction[] = [];
    if (Array.isArray(raw)) {
      list = raw as unknown as ApiTransaction[];
    } else if (raw && typeof raw === 'object' && 'result' in raw) {
      list = (raw as ApiListResponse).result ?? [];
    }

    setEntries(normalizeEntries(list));

    // 2) 예산 (선택일 기준)
    const budgetRes = await getBudgetStatus({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    });

    setBudget(budgetRes);
  }, [selectedDateLabelAPI, selectedYear, selectedMonth, selectedDay]);

  /* ---------------- 최초/선택일 변경 시 로딩 ---------------- */

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setLoadError('');

      try {
        await refreshSelectedDateData();

        // ✅ 점맵은 "현재 보고 있는 달" 기준으로
        await refreshMonthMap(viewYear, viewMonth);
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
  }, [refreshSelectedDateData, refreshMonthMap, viewYear, viewMonth, setLoading]);

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
  /* ---------------- 저장/수정/삭제 후 즉시 갱신 ---------------- */

  const afterMutationRefresh = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ 내역/예산 즉시 갱신
      await refreshSelectedDateData();

      // ✅ 점맵도 즉시 갱신 (현재 보고 있는 달)
      await refreshMonthMap(viewYear, viewMonth);

      // ✅ "오늘 남은 예산"이 늦게 반영되는 케이스 대비: 한번 더
      await refreshSelectedDateData();
    } finally {
      setLoading(false);
    }
  }, [refreshSelectedDateData, refreshMonthMap, viewYear, viewMonth, setLoading]);

  // ✅ ManualUpdateModal의 onSaveExpense 타입(ExpenseDraft)에 맞추기
  // memo?: string | undefined 인 걸 LedgerDraft.memo: string으로 강제 변환
  type ExpenseDraft = {
    date: string;
    type: EntryType;
    amount: number;
    category: string;
    description: string;
    memo?: string;
  };

  const handleSaveManualExpense = (draft: ExpenseDraft) => {
    void (async () => {
      const payload: LedgerDraft = {
        date: draft.date,
        type: draft.type,
        amount: draft.amount,
        category: draft.category,
        description: draft.description,
        memo: draft.memo ?? '', // ✅ string 고정
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
    })();
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
    try {
      const rawId = next.serverId ?? next.id;
      const transactionId = String(rawId).replace(/^tx-/, ''); // ✅ tx- 제거
      if (!transactionId) {
        alert('serverId(transactionId)가 없어 수정할 수 없어요.');
        return;
      }

      await updateTransaction(transactionId, {
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

  const handleDeleteEdit = async (uiId: string) => {
    try {
      const target = entries.find((e) => e.id === uiId);
      if (!target?.serverId) {
        alert('serverId가 없어 삭제할 수 없어요. (서버 PK 필요)');
        return;
      }

      const transactionId = String(target.serverId).replace(/^tx-/, '');
      await deleteTransaction(transactionId);

      await afterMutationRefresh();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : '삭제 실패');
    } finally {
      closeEdit();
    }
  };

  /* ---------------- 캘린더 월 이동: "렌더만" 변경 ---------------- */
  const handleMonthChange = useCallback(
    (year: number, month: number) => {
      setViewYear(year);
      setViewMonth(month);

      void (async () => {
        setLoading(true);
        try {
          await refreshMonthMap(year, month);
        } finally {
          setLoading(false);
        }
      })();
    },
    [refreshMonthMap, setLoading],
  );

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pb-28 overflow-y-auto">
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
            onMonthChange={handleMonthChange} // ✅ 다음달/이전달 눌러도 렌더만 바뀜
            dayRemainingMap={dayRemainingMap}
            createdAt={createdAt}
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
        onSaveExpense={handleSaveManualExpense} // ✅ 타입 맞춤(ExpenseDraft)
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
        onSave={handleSaveEdit} // ✅ 누락되면 onSave 에러났던 거 해결
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
