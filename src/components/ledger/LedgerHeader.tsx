export default function LedgerHeader() {
  return (
    <header className="w-full h-28 flex flex-col justify-end">
      {/* 상단 문구 */}
      <div className="px-6 flex items-center">
        <div className="flex-1 text-xl font-bold leading-8 tracking-tight">
          <span className="text-[color:var(--color-gray-800)]">오늘 </span>
          <span className="text-[color:var(--color-main-skyblue)]">12,000원</span>
          <span className="text-[color:var(--color-gray-800)]"> 남았어요!</span>
        </div>
      </div>

      {/* 하단 보조 문구 */}
      <div className="px-6 mt-1 flex items-center">
        <div className="flex-1 text-base font-bold leading-6 tracking-tight text-[color:var(--color-gray-800)]">
          2월 남은 예산 245,000원
        </div>
      </div>
    </header>
  );
}
