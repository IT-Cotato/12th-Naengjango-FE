import { chevronLeftIcon, chevronRightIcon, blueCircle, redCircle, grayCircle } from '@/assets';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  selectedDate: Date;
  onChangeSelectedDate: (d: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
  onRowsChange?: (rows: number) => void;

  dayRemainingMap?: Record<string, number>;

  // 가입일 (getMe().result.createdAt)
  createdAt?: Date | null;
};

const DOW = ['Sun', 'Mon', 'Tue', 'Wen', 'Thr', 'Fri', 'Sat'];

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthCells(monthFirst: Date) {
  const y = monthFirst.getFullYear();
  const m = monthFirst.getMonth();

  const first = new Date(y, m, 1);
  const firstDow = first.getDay();

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const totalCells = firstDow + daysInMonth > 35 ? 42 : 35;

  const start = new Date(y, m, 1 - firstDow);

  return Array.from({ length: totalCells }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    return {
      date: d,
      inMonth: d.getMonth() === m,
    };
  });
}

export default function LedgerCalendar({
  selectedDate,
  onChangeSelectedDate,
  onRowsChange,
  dayRemainingMap = {},
  onMonthChange,
  createdAt,
}: Props) {
  const [monthFirst, setMonthFirst] = useState(() => {
    const d = new Date(selectedDate);
    d.setDate(1);
    return d;
  });

  /* ---------------- month sync ---------------- */

  useEffect(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();

    if (monthFirst.getFullYear() !== y || monthFirst.getMonth() !== m) {
      setMonthFirst(new Date(y, m, 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const year = monthFirst.getFullYear();
  const month = monthFirst.getMonth() + 1;
  const label = `${year}.${pad2(month)}`;

  const cells = useMemo(() => buildMonthCells(monthFirst), [monthFirst]);
  const rows = useMemo(() => Math.ceil(cells.length / 7), [cells.length]);

  useEffect(() => {
    onMonthChange?.(year, month);
  }, [year, month, onMonthChange]);

  useEffect(() => {
    onRowsChange?.(rows);
  }, [rows, onRowsChange]);

  const onPrev = () =>
    setMonthFirst((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const onNext = () =>
    setMonthFirst((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const onSelect = (d: Date) => {
    onChangeSelectedDate(d);

    if (d.getFullYear() !== year || d.getMonth() !== monthFirst.getMonth()) {
      setMonthFirst(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  /* ---------------- 기준 날짜 정규화 ---------------- */

  const todayStart = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const createdDateStart = useMemo(() => {
    if (!createdAt) return null;
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, [createdAt]);

  const isFutureMonth = useMemo(() => {
    const thisMonthStart = new Date(year, month - 1, 1);
    return thisMonthStart > todayStart;
  }, [year, month, todayStart]);

  /* ---------------- render ---------------- */

  return (
    <div className="w-full h-full p-[10px]">
      {/* 헤더 */}
      <div className="w-full px-6 py-3">
        <div className="w-full flex items-center justify-center gap-[13px] ">
          <button
            type="button"
            onClick={onPrev}
            className="size-6 flex items-center justify-center"
          >
            <img src={chevronLeftIcon} alt="이전 달" className="w-6 h-6" />
          </button>

          <div className="text-xl font-semibold">{label}</div>

          <button
            type="button"
            onClick={onNext}
            className="size-6 flex items-center justify-center"
          >
            <img src={chevronRightIcon} alt="다음 달" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div>
        {/* 요일 */}
        <div className="h-6 flex items-center">
          {DOW.map((d) => (
            <div key={d} className="flex-1 text-center text-xs">
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 */}
        {Array.from({ length: rows }, (_, row) => {
          const rowCells = cells.slice(row * 7, row * 7 + 7);

          return (
            <div key={row} className="h-12 flex items-start">
              {rowCells.map(({ date, inMonth }, col) => {
                const isSelected = isSameDay(date, selectedDate);
                const key = toKey(date);

                const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                const isFutureDay = dateStart > todayStart;
                const isBeforeSignup = createdDateStart && dateStart < createdDateStart;

                let circleSrc: string | null = null;

                if (!isFutureMonth && !isFutureDay && !isBeforeSignup) {
                  if (!inMonth) {
                    circleSrc = grayCircle;
                  } else if (Object.prototype.hasOwnProperty.call(dayRemainingMap, key)) {
                    circleSrc = (dayRemainingMap[key] ?? 0) > 0 ? blueCircle : redCircle;
                  }
                }

                return (
                  <button
                    key={`${row}-${col}-${date.toISOString()}`}
                    type="button"
                    onClick={() => onSelect(date)}
                    className="flex-1 h-12 flex flex-col items-center"
                  >
                    <div
                      className={[
                        'size-3.5 flex items-center justify-center rounded-full text-xs',
                        isSelected ? 'bg-zinc-200' : '',
                        inMonth ? 'text-gray-800' : 'text-gray-400',
                      ].join(' ')}
                    >
                      {date.getDate()}
                    </div>

                    {circleSrc ? (
                      <img src={circleSrc} alt="" className="size-3" />
                    ) : (
                      <div className="size-3" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
