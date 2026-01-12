import LedgerCalendar from '@/components/ledger/LedgerCalendar';
import LedgerHeader from '@/components/ledger/LedgerHeader';

export default function LedgerPage() {
  return (
    <div className="min-h-dvh bg-white flex flex-col items-center px-4 pb-28 overflow-y-auto">
      {/* 상단 탑바 자리  */}
      <div className="h-[54px] w-full shrink-0" />

      {/* 탑바 아래 헤더 시작 여백*/}
      <div className="w-full">
        <LedgerHeader />
      </div>

      {/* 캘린더 카드 */}
      <div className="w-full max-w-[320px] mt-[30px] bg-white rounded-[20px] shadow-[0_0_8px_rgba(0,0,0,0.20)] overflow-hidden">
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
        className="fixed right-5 bottom-[92px] size-10 p-2 bg-[color:var(--color-sub-skyblue)] rounded-[20px] shadow-md inline-flex justify-center items-center"
      >
        <span className="text-[color:var(--color-main-skyblue)] text-2xl leading-none">＋</span>
      </button>
    </div>
  );
}
