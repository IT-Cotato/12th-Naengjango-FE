import { blueClose, bluePlus } from '@/assets';
import LedgerCalendar from '@/components/ledger/LedgerCalendar';
import LedgerHeader from '@/components/ledger/LedgerHeader';
import LedgerActionSheet from '@/components/ledger/LedgerActionSheet';
import LedgerPasteModal from '@/components/ledger/LedgerPasteModal';
import { useState } from 'react';

export default function LedgerPage() {
  const [isFabOpen, setIsFabOpen] = useState(false);

  //  문자 붙여넣기 모달 상태
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const onToggleFab = () => setIsFabOpen((v) => !v);
  const onCloseFab = () => setIsFabOpen(false);

  const onPaste = () => {
    onCloseFab();
    setPasteText(''); // 열릴 때 초기화
    setIsPasteOpen(true); // 모달 열기
  };

  const onManual = () => {
    onCloseFab();
    console.log('수동 입력하기');
  };

  const onClosePaste = () => setIsPasteOpen(false);

  const onSubmitPaste = () => {
    const text = pasteText.trim();
    if (!text) return;

    console.log('붙여넣기 제출:', text);

    // TODO: 여기서 서버 요청 or 파싱 로직 연결
    setIsPasteOpen(false);
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

      {/* 문자 붙여넣기 모달 */}
      <LedgerPasteModal
        open={isPasteOpen}
        value={pasteText}
        onChange={setPasteText}
        onClose={onClosePaste}
        onSubmit={onSubmitPaste}
      />

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
        className="fixed right-5 bottom-[92px] z-50 size-12 rounded-full bg-[color:var(--color-sub-skyblue)] flex items-center justify-center shadow-md"
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
