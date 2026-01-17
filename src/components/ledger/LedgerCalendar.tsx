import { chevronLeftIcon, chevronRightIcon } from '@/assets';
import { useMemo, useState } from 'react';

// 하단코드에서 매핑때 깔끔하게 사용하려고 선언 해놨어요
const DOW = ['Sun', 'Mon', 'Tue', 'Wen', 'Thr', 'Fri', 'Sat'];

// 상단 헤더 02월 12월과 같이 표시해주는 함수
function pad2(n: number) {
  return String(n).padStart(2, '0');
}

// 연, 월, 일 비교해서 선택한 날짜인지, 오늘인지 판단하는 함수
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * monthFirst: 해당 월의 1일 (예: 2025-12-01)
 * 일요일 시작 기준 35칸(5주) 달력 그리드 생성
 */
function buildMonthCells(monthFirst: Date) {
  const y = monthFirst.getFullYear();
  const m = monthFirst.getMonth();

  const first = new Date(y, m, 1);
  const firstDow = first.getDay(); // 시작일이 일요일 먼저 나오게
  const start = new Date(y, m, 1 - firstDow);

  // 캘린더 그리드 5행 7열 기준 35칸으로 만들었습니다.
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    return {
      date: d,
      inMonth: d.getMonth() === m, // 해당 날짜가 현재 월에 속하는 날짜인지 체크
    };
  });
}

export default function LedgerCalendar() {
  const [today] = useState(() => new Date());

  // 현재 보고 있는 달(항상 1일로 고정)
  const [monthFirst, setMonthFirst] = useState(() => {
    const d = new Date(today);
    d.setDate(1);
    return d;
  });

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const year = monthFirst.getFullYear();
  const month = monthFirst.getMonth() + 1; // 1~12
  const label = `${year}.${pad2(month)}`;

  // useMemo로 monthFirst가 바뀔 때만 달력 다시 계산
  const cells = useMemo(() => buildMonthCells(monthFirst), [monthFirst]);

  const onPrev = () => {
    setMonthFirst((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const onNext = () => {
    setMonthFirst((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const onSelect = (d: Date) => {
    setSelectedDate(d);

    // 선택한 날짜가 다른 달이면, 그 달로 자동 이동
    if (d.getFullYear() !== year || d.getMonth() !== monthFirst.getMonth()) {
      setMonthFirst(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  return (
    <div className="w-full h-full p-[10px]">
      {/* 헤더 */}
      {/* 캘린더 헤더 (연 / 월 이동) */}
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
            {/* Sun, Mon 부분 매핑*/}
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
            {Array.from({ length: 5 }, (_, row) => {
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
                        {/* 날짜 숫자 */}
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

                        {/* 점 있으면 표시, 없으면 자리 유지 (백이랑 연동 시 수정 예정) */}
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
