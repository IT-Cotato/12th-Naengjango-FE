import { blueClose, bluePlus } from '@/assets';
import LedgerCalendar from '@/components/ledger/LedgerCalendar';
import LedgerHeader from '@/components/ledger/LedgerHeader';
import LedgerActionSheet from '@/components/ledger/LedgerActionSheet';
import { useState } from 'react';

export default function LedgerPage() {
  const [isFabOpen, setIsFabOpen] = useState(false);

  const onToggleFab = () => setIsFabOpen((v) => !v);
  const onCloseFab = () => setIsFabOpen(false);

  const onPaste = () => {
    onCloseFab();
    // TODO: 여기서 "문자 붙여넣기" 모달 띄우기
    console.log('문자 붙여넣기');
  };

  const onManual = () => {
    onCloseFab();
    // TODO: 여기서 "수동 입력" 모달 띄우기
    console.log('수동 입력하기');
  };
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

      {/* 액션시트 열렸을 때만: 바깥 클릭 영역(오버레이) */}
      {isFabOpen && (
        <div className="fixed inset-0 z-40" onClick={onCloseFab}>
          {/* 액션시트(버튼 클릭해도 바깥클릭으로 닫히지 않게 stop) */}
          <div className="fixed right-5 bottom-[160px] z-50" onClick={(e) => e.stopPropagation()}>
            <LedgerActionSheet onPaste={onPaste} onManual={onManual} />
          </div>
        </div>
      )}

      {/* 플로팅 + 버튼 */}
      <button
        type="button"
        aria-label={isFabOpen ? '닫기' : '추가'}
        onClick={onToggleFab}
        className="fixed right-5 bottom-[92px] z-50 size-14 rounded-full bg-[color:var(--color-sub-skyblue)] flex items-center justify-center shadow-md"
      >
        {isFabOpen ? <img src={blueClose} alt="닫기" /> : <img src={bluePlus} alt="열기" />}
      </button>
    </div>
  );
}
