import { chevronLeftIcon, chevronRightIcon } from '@/assets';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  selectedDate: Date;
  onChangeSelectedDate: (d: Date) => void;

  // ✅ 추가: rows(5 or 6) 전달
  onRowsChange?: (rows: number) => void;
};

const DOW = ['Sun', 'Mon', 'Tue', 'Wen', 'Thr', 'Fri', 'Sat'];

function pad2(n: number) {
  return String(n).padStart(2, '0');
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
}: Props) {
  const [today] = useState(() => new Date());

  const [monthFirst, setMonthFirst] = useState(() => {
    const d = new Date(today);
    d.setDate(1);
    return d;
  });

  const year = monthFirst.getFullYear();
  const month = monthFirst.getMonth() + 1;
  const label = `${year}.${pad2(month)}`;

  const cells = useMemo(() => buildMonthCells(monthFirst), [monthFirst]);
  const rows = useMemo(() => Math.ceil(cells.length / 7), [cells.length]);

  // ✅ rows 변경 시 부모에 알려줌
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

  return (
    <div className="w-full h-full p-[10px]">
      {/* 헤더 */}
      <div className="w-full px-6 py-3">
        <div className="w-full flex items-center justify-center gap-[13px] ">
          <button
            type="button"
            onClick={onPrev}
            aria-label="이전 달"
            className="size-6 flex items-center justify-center"
          >
            <img src={chevronLeftIcon} alt="이전 달" className="w-6 h-6" />
          </button>

          <div className="text-center text-[color:var(--color-gray-800)] text-xl font-semibold leading-8 tracking-tight">
            {label}
          </div>

          <button
            type="button"
            onClick={onNext}
            aria-label="다음 달"
            className="size-6 flex items-center justify-center"
          >
            <img src={chevronRightIcon} alt="다음 달" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="w-full px-0">
        <div>
          <div className="h-6 flex items-center">
            {DOW.map((d) => (
              <div
                key={d}
                className="flex-1 text-center text-[color:var(--color-gray-800)] text-xs font-normal leading-4 tracking-tight"
              >
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 영역 */}
          <div>
            {Array.from({ length: rows }, (_, row) => {
              const rowCells = cells.slice(row * 7, row * 7 + 7);

              return (
                <div key={row} className="h-12 flex items-start">
                  {rowCells.map(({ date, inMonth }, col) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);
                    const showDot = isToday;

                    return (
                      <button
                        key={`${row}-${col}-${date.toISOString()}`}
                        type="button"
                        onClick={() => onSelect(date)}
                        className={[
                          'flex-1 h-12 flex flex-col items-center gap-0.5',
                          'bg-transparent hover:bg-transparent active:bg-transparent',
                          'focus:outline-none focus-visible:ring',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            'size-3.5 flex items-center justify-center rounded-full',
                            'text-xs font-normal leading-4 tracking-tight',
                            'transition-colors',
                            isSelected ? 'bg-zinc-200' : 'hover:bg-zinc-200',
                            inMonth
                              ? 'text-[color:var(--color-gray-800)]'
                              : 'text-[color:var(--color-gray-400)]',
                          ].join(' ')}
                        >
                          {date.getDate()}
                        </div>

                        {showDot ? (
                          <div className="size-3 relative">
                            <div className="size-2 absolute left-[1.5px] top-[1.5px] bg-[color:var(--color-main-skyblue)]" />
                          </div>
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
      </div>
    </div>
  );
}
