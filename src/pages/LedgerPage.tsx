import LedgerCalendar from '@/components/ledger/LedgerCalendar';
import LedgerHeader from '@/components/ledger/LedgerHeader';

export default function LedgerPage() {
  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pt-24 pb-28">
      {/* '오늘 얼마 남았어요' 영역은 일단 제외 */}
      <LedgerHeader />
      {/* <Header /> */}

      {/* 캘린더 카드 */}
      <div className="w-full max-w-[320px] bg-white rounded-[20px] shadow-[0_0_8px_rgba(0,0,0,0.20)] overflow-hidden">
        <LedgerCalendar />
      </div>

      {/* 빈 상태 */}
      <div className="flex-1 flex items-center">
        <div className="text-center text-gray-400">내역이 없습니다</div>
      </div>

      {/* 플로팅 + 버튼 */}
      <button
        type="button"
        aria-label="추가"
        className="fixed right-5 bottom-[92px] size-14 rounded-full bg-[color:var(--color-sub-skyblue)] flex items-center justify-center shadow-md"
      >
        <span className="text-2xl leading-none text-[color:var(--color-main-skyblue)]">＋</span>
      </button>
    </div>
  );
}
