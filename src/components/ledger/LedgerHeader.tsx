type Props = {
  todayRemaining: number;
  monthRemaining: number;
  loading?: boolean;
};

function formatWon(n: number) {
  return Math.max(0, Math.floor(n)).toLocaleString('ko-KR');
}

export default function LedgerHeader({ todayRemaining, monthRemaining, loading = false }: Props) {
  return (
    <header className="w-full h-28 flex flex-col justify-end pt-[50px]">
      {/* 상단 문구 */}
      <div className="px-6 flex items-center">
        <div className="flex-1 text-xl font-bold leading-8 tracking-tight">
          <span className="text-[color:var(--color-gray-800)]">오늘 </span>

          <span className="text-[color:var(--color-main-skyblue)]">
            {loading ? '—' : `${formatWon(todayRemaining)}원`}
          </span>

          <span className="text-[color:var(--color-gray-800)]"> 남았어요!</span>
        </div>
      </div>

      {/* 하단 보조 문구 */}
      <div className="px-6 mt-1 flex items-center">
        <div className="flex-1 text-base font-bold leading-6 tracking-tight text-[color:var(--color-gray-800)]">
          {loading ? '이달 남은 예산 —' : `이달 남은 예산 ${formatWon(monthRemaining)}원`}
        </div>
      </div>
    </header>
  );
}
