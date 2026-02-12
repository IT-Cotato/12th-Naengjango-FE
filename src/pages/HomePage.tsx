import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { alertIcon, snowball, freezeicon, iceledger } from '@/assets';
import { level1_bg, upgrade } from '@/assets/images'; // => 레벨별 배경 어셋에 전부 등록 해놨습니다! ex) level2_bg 임포트 해서 쓰시면 돼요

export default function HomePage() {
  const navigate = useNavigate();

  // 임시 더미 데이터 (추후 API/스토어 값으로 교체)
  const notificationCount = 9;
  const snowballCount = 16;

  // 상단 날짜 텍스트 생성 (예: "2월 12일(목)")
  const todayTitle = useMemo(() => {
    const d = new Date();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return `${m}월 ${day}일(${weekday})`;
  }, []);

  // 예시 텍스트 (추후 계산 값으로 교체)
  const availableTextMain = '13,200원(700▲)';

  // 이미지 소스
  const bgSrc = level1_bg;
  const mascotSrc = upgrade;

  // 라우팅 핸들러
  const handleGoFreeze = () => navigate('/freeze');
  const handleGoLedger = () => navigate('/ledger');

  // 업그레이드 메소드로 교체 필요
  const handleGoUpgrade = () => navigate('/upgrade');

  return (
    <div className="w-96 h-[812px] relative overflow-hidden -mb-24">
      <img
        className="w-96 h-[520px] left-0 top-[54px] absolute object-cover block"
        src={bgSrc}
        alt=""
        draggable={false}
      />

      {/* Header: 타이틀 + 알림 버튼 */}
      <div className="w-96 h-16 px-6 left-0 top-[55px] absolute inline-flex flex-col justify-center items-start gap-2.5">
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-14 h-8 text-white text-2xl font-normal leading-9 tracking-tight font-['Jua']">
              냉잔고
            </div>
          </div>

          {/* 알림 아이콘 + 뱃지 */}
          <button
            type="button"
            onClick={() => navigate('/my/notifications')}
            className="size-6 relative overflow-hidden"
            aria-label="알림"
          >
            <img src={alertIcon} alt="" className="absolute inset-0 block" draggable={false} />

            {notificationCount > 0 && (
              <div className="size-2.5 px-1.5 py-[0.50px] left-[14px] top-0 absolute bg-[color:var(--color-error)] rounded-xl inline-flex justify-center items-center">
                <div className="text-center text-white text-[8px] font-normal leading-3 tracking-tight font-['Pretendard']">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Sheet: 날짜 + 주요 버튼 2개 + 안내 문구 */}
      <div className="w-96 h-56 left-0 top-[493px] absolute bg-[color:var(--color-white-800)] rounded-tl-[30px] rounded-tr-[30px] overflow-hidden">
        {/* 날짜 */}
        <div className="w-96 px-6 left-0 top-[15px] absolute inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-lg font-semibold leading-7 tracking-tight font-['Pretendard']">
            {todayTitle}
          </div>
        </div>

        {/* 냉동하러 가기 버튼 */}
        <button
          type="button"
          onClick={handleGoFreeze}
          className="w-36 pl-3.5 pr-2 pt-3.5 pb-2 left-[27px] top-[56px] absolute bg-[color:var(--color-main-skyblue)] rounded-xl inline-flex flex-col justify-start items-start gap-2.5"
        >
          <div className="self-stretch flex flex-col justify-end items-end">
            <div className="self-stretch text-white text-base font-semibold leading-6 tracking-tight font-['Pretendard']">
              냉동하러 가기
            </div>
            <img className="size-12 block" src={freezeicon} alt="" draggable={false} />
          </div>
        </button>

        {/* 가계부 작성하기 버튼 */}
        <button
          type="button"
          onClick={handleGoLedger}
          className="w-36 pl-3.5 pr-2 pt-3.5 pb-2 left-[195px] top-[56px] absolute bg-[color:var(--color-main-skyblue)] rounded-xl inline-flex flex-col justify-start items-start gap-2.5"
        >
          <div className="self-stretch flex flex-col justify-end items-end">
            <div className="self-stretch text-white text-base font-semibold leading-6 tracking-tight font-['Pretendard']">
              가계부 작성하기
            </div>
            <img className="size-12 block" src={iceledger} alt="" draggable={false} />
          </div>
        </button>

        {/* 안내 문구 */}
        <div className="w-96 px-2.5 left-0 top-[183px] absolute inline-flex justify-center items-center gap-2.5">
          <div className="text-center text-[color:var(--color-gray-600)] text-base font-semibold leading-6 tracking-tight font-['Pretendard']">
            충동 소비를 얼려보세요!
          </div>
        </div>
      </div>

      {/* 오늘 사용 가능 금액 문구 */}
      <div className="w-96 px-6 left-0 top-[115px] absolute inline-flex flex-col justify-start items-start">
        <div className="self-stretch inline-flex justify-start items-start gap-2.5">
          <div className="flex-1">
            <span className="text-white text-2xl font-bold leading-9 font-['Pretendard']">
              오늘{' '}
            </span>
            <span className="text-[color:var(--color-main-skyblue)] text-2xl font-bold leading-9 font-['Pretendard']">
              {availableTextMain}
              <br />
            </span>
            <span className="text-white text-2xl font-bold leading-9 font-['Pretendard']">
              쓸 수 있어요!
            </span>
          </div>
        </div>
      </div>

      {/* 눈덩이 카운트 배지 */}
      <div className="w-14 pl-1 pr-1.5 left-[297px] top-[124px] absolute bg-white/40 rounded-lg inline-flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch inline-flex justify-start items-center">
          <img className="size-6 block" src={snowball} alt="" draggable={false} />
          <div className="flex-1 text-right text-[color:var(--color-gray-400)] text-base font-semibold leading-6 tracking-tight font-['Pretendard']">
            {snowballCount}
          </div>
        </div>
      </div>

      {/* 업그레이드 버튼 (이미지 클릭 영역) */}
      <button
        type="button"
        onClick={handleGoUpgrade}
        className="w-64 h-44 left-[109px] top-[354px] absolute"
        aria-label="업그레이드"
      >
        <img className="w-64 h-44 block" src={mascotSrc} alt="" draggable={false} />
      </button>
    </div>
  );
}
