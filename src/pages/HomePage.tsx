import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { alertIcon, snowball, freezeicon, iceledger } from '@/assets';
import { level1_bg, upgrade, logo, level2_bg, level3_bg, level4_bg } from '@/assets/images'; // => 레벨별 배경 어셋에 전부 등록 해놨습니다! ex) level2_bg 임포트 해서 쓰시면 돼요
import {
  getHomeData,
  getBudgetData,
  getSnowballData,
  getNotificationData,
  getIglooStatusData,
  postIglooUpgrade,
  postIglooDowngrade,
  postSnowballLoss,
} from '@/apis/home/home';
import AlertModal from '@/components/common/AlertModal';
import ImageModal from '@/components/common/ImageModal';
import { useAccountStatus } from '@/hooks/my/useAccountStatus';

export default function HomePage() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  // useAccountStatus 훅 사용
  const { todayRemaining, budgetDiff } = useAccountStatus();

  // 상단 날짜 텍스트 생성 (예: "2월 12일(목)")
  const todayTitle = useMemo(() => {
    const d = new Date();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return `${m}월 ${day}일(${weekday})`;
  }, []);

  // 오늘 가용 예산
  const [todayBudget, setTodayBudget] = useState(0);
  const [diffAmount, setDiffAmount] = useState(1);
  const [month, setMonth] = useState(0);
  const [date, setDate] = useState(0);
  const [isBankruptAlert, setIsBankruptAlert] = useState(false);

  //눈덩이 수
  const [snowballCount, setSnowBallCount] = useState(0);

  //읽지 않은 알림 수
  const [notiCount, setNotiCount] = useState(0);

  //업데이트 모달
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [denyUpgrade, setDenyUpgrade] = useState(false);

  //이글루 데이터
  const [requiredSnowball, setRequiredSnowball] = useState(0);
  const [freezeFailCount, setFreezeFailCount] = useState(0);
  const [iglooLevel, setIglooLevel] = useState(0);

  //이글루 다운그레이드 & 눈덩이 감소 모달
  const [higherEightModal, setHigherEightModal] = useState(false);
  const [lowerEightModal, setLowerEightModal] = useState(false);

  // 이미지 소스
  const bgSrc = () => {
    switch (iglooLevel) {
      case 1:
        return level1_bg;
      case 2:
        return level2_bg;
      case 3:
        return level3_bg;

      case 4:
        return level4_bg;
      default:
        return level1_bg;
    }
  };
  const mascotSrc = upgrade;

  // 라우팅 핸들러
  const handleGoFreeze = () => navigate('/freeze');
  const handleGoLedger = () => navigate('/ledger');

  useEffect(() => {
    if (budgetDiff !== null) {
      setDiffAmount(budgetDiff);
    }
  }, [budgetDiff]);

  useEffect(() => {
    const loadDifferenceData = async () => {
      try {
        if (!accessToken) return;

        const data = await getHomeData(accessToken);

        //홈화면 문구 예외처리
        const dailyTrends = data.result.dailyTrends;
        if (dailyTrends.length > 0) {
          // 마지막 아이템 제외한 나머지 아이템들
          const previousItems = dailyTrends.slice(0, -1);
          // 이전 아이템들이 모두 amount 0인지 확인
          const allPreviousZero = previousItems.every((item) => item.amount === 0);

          if (allPreviousZero) {
            setIsBankruptAlert(false);
          } else {
            setIsBankruptAlert(true);
          }
        }

        // 오늘 날짜 구하기
        const today = new Date().toISOString().split('T')[0]; // "2026-02-15" 형태

        // 오늘 날짜의 bankruptcyPrediction 찾기
        const todayPrediction = data.result.bankruptcyPrediction.find(
          (item) => item.baseDate === today,
        );

        if (todayPrediction) {
          // expectedDate에서 월과 일 추출 (예: "2026-02-28")
          const [_year, monthStr, dateStr] = todayPrediction.expectedDate.split('-');
          setMonth(parseInt(monthStr, 10)); // "02" -> 2
          setDate(parseInt(dateStr, 10)); // "28" -> 28
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadDifferenceData();
  }, [accessToken]);

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        if (!accessToken) return;

        const data = await getBudgetData(accessToken);
        setTodayBudget(data.result.todayRemaining);
      } catch (error) {
        console.error(error);
      }
    };

    loadBudgetData();
  }, [accessToken]);

  useEffect(() => {
    const loadSnowballData = async () => {
      try {
        if (!accessToken) return;

        const data = await getSnowballData(accessToken);

        setSnowBallCount(data.result.totalSnowballs);
      } catch (error) {
        console.error(error);
      }
    };

    loadSnowballData();
  }, [accessToken]);

  useEffect(() => {
    const loadNotificationData = async () => {
      try {
        if (!accessToken) return;
        const data = await getNotificationData(accessToken);
        setNotiCount(data.result.unreadCount);
      } catch (error) {
        console.error(error);
      }
    };
    loadNotificationData();
  }, [accessToken]);

  useEffect(() => {
    const loadIglooStatusData = async () => {
      try {
        if (!accessToken) return;
        const data = await getIglooStatusData(accessToken);
        setRequiredSnowball(data.result.requiredSnowballsForNextLevel);
        setFreezeFailCount(data.result.freezeFailCount);
        setIglooLevel(data.result.iglooLevel);
      } catch (error) {
        console.error(error);
      }
    };

    loadIglooStatusData();
  }, [accessToken]);

  const isIncrease = diffAmount > 0;
  const formatNumber = (num: number) => num.toLocaleString();
  const formatAbsoluteNumber = (num: number) => Math.abs(num).toLocaleString();

  // 이글루 업그레이드
  const handleUpgrade = async () => {
    try {
      if (!accessToken) return;
      const data = await postIglooUpgrade(accessToken);
      setIglooLevel(data.result.afterLevel);
      setSnowBallCount(data.result.snowballBalanceAfter);
      setIsUpgrade(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvailable = () => {
    if (snowballCount >= requiredSnowball) {
      setIsUpgrade(true);
    } else {
      setDenyUpgrade(true);
    }
  };

  const handleIglooDownGrade = async () => {
    try {
      if (!accessToken) return;
      const data = await postIglooDowngrade(accessToken);
      setSnowBallCount(data.result.snowballBalance);
      setFreezeFailCount(data.result.freezeFailCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSnowballLoss = async () => {
    try {
      if (!accessToken) return;
      const data = await postSnowballLoss(accessToken);
      setSnowBallCount(data.result.snowballBalance);
      setFreezeFailCount(data.result.freezeFailCount);
    } catch (error) {
      console.error(error);
    }
  };

  //냉동 5회 실패 모달 처리
  useEffect(() => {
    if (freezeFailCount === 5) {
      if (snowballCount >= 8) {
        setHigherEightModal(true);
      } else {
        (async () => {
          await handleIglooDownGrade();
          setLowerEightModal(true);
        })();
      }
    }
  }, [freezeFailCount, iglooLevel, snowballCount]);

  return (
    <div className="w-96 h-[812px] relative overflow-hidden -mb-24">
      <img
        className="w-96 h-[520px] left-0 top-0 absolute object-cover block"
        src={bgSrc()}
        alt=""
        draggable={false}
      />

      {/* Header: 타이틀 + 알림 버튼 */}
      <div className="w-96 h-16 px-6 left-0 top-[55px] absolute inline-flex flex-col justify-center items-start gap-2.5">
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex justify-start items-center gap-2.5">
            <img src={logo} />
          </div>

          {/* 알림 아이콘 + 뱃지 */}
          <button
            type="button"
            onClick={() => navigate('/my/notifications')}
            className="size-6 relative"
            aria-label="알림"
          >
            <img src={alertIcon} alt="" className="absolute inset-0 block" draggable={false} />

            {notiCount > 0 && (
              <div className="size-2.5 px-[1.5px] py-[1.5px] left-[13px] top-0 absolute bg-[color:var(--color-error)] rounded-4xl inline-flex justify-center items-center">
                <div className="text-center text-white text-[8px] font-normal leading-3 tracking-tight font-['Pretendard']">
                  {notiCount > 99 ? '99+' : notiCount}
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
          <div className="self-stretch flex flex-col items-end">
            <div className="self-stretch text-white SemiBold_16 font-['Pretendard'] text-left">
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
            <div className="self-stretch text-white SemiBold_16 font-['Pretendard'] text-left">
              가계부 작성하기
            </div>
            <img className="size-12 block" src={iceledger} alt="" draggable={false} />
          </div>
        </button>

        {/* 안내 문구 */}
        {isBankruptAlert ? (
          <div className="w-96 px-2.5 left-0 top-[164px] absolute inline-flex justify-center items-center gap-2.5">
            <div className="text-center justify-start text-[color:var(--color-gray-600)] SemiBold_16 font-['Pretendard'] leading-6 tracking-tight">
              최근 7일처럼 소비하면
              <br />
              {month}월 {date}일 파산 예정이에요...
            </div>
          </div>
        ) : (
          <div className="w-96 px-2.5 left-0 top-[183px] absolute inline-flex justify-center items-center gap-2.5">
            <div className="text-center text-[color:var(--color-gray-600)] SemiBold_16 leading-6 tracking-tight font-['Pretendard']">
              충동 소비를 얼려보세요!
            </div>
          </div>
        )}
      </div>

      {/* 오늘 사용 가능 금액 문구 */}
      <div className="w-96 px-6 left-0 top-[115px] absolute inline-flex flex-col justify-start items-start">
        <div className="self-stretch inline-flex justify-start items-start gap-2.5">
          <div className="flex-1">
            <span className="text-white Bold_24  font-['Pretendard']">오늘 </span>
            <span className="text-[color:var(--color-main-skyblue)] Bold_24 font-['Pretendard']">
              {formatNumber(todayBudget)}원
            </span>
            {isIncrease ? (
              <span className="text-[color:var(--color-main-skyblue)] Bold_24 font-['Pretendard']">
                ({formatAbsoluteNumber(diffAmount)}▲)
              </span>
            ) : (
              <span className="text-[color:var(--color-error)] text-2xl Bold_24 font-['Pretendard']">
                ({formatAbsoluteNumber(diffAmount)}▼)
              </span>
            )}
            <br />

            <span className="text-white Bold_24 font-['Pretendard']">쓸 수 있어요!</span>
          </div>
        </div>
      </div>

      {/* 눈덩이 카운트 배지 */}
      <div className="w-14 pl-1 pr-1.5 left-[297px] top-[124px] absolute bg-white/40 rounded-lg inline-flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch inline-flex justify-start items-center">
          <img className="size-6 block" src={snowball} alt="" draggable={false} />
          <div className="flex-1 text-right text-[color:var(--color-gray-400)] SemiBold_16 font-['Pretendard']">
            {snowballCount}
          </div>
        </div>
      </div>

      {/* 업그레이드 버튼 (이미지 클릭 영역) */}
      <button
        type="button"
        onClick={handleAvailable}
        className="w-[184px] h-[82px] left-[150px] top-[398px] absolute"
        aria-label="업그레이드"
      >
        <img className="w-[184px] h-[82px] block" src={mascotSrc} alt="" draggable={false} />
      </button>

      <AlertModal
        isOpen={isUpgrade}
        onClose={() => {
          setIsUpgrade(false);
        }}
        title="이글루를 업그레이드 하시겠습니까?"
        message={`눈덩이 ${requiredSnowball}개로 이글루를 업그레이드 할 수 있어요`}
        twoButtons={{
          leftText: '취소',
          rightText: '확인',
          onRight: () => {
            handleUpgrade();
          },
        }}
      />

      <AlertModal
        isOpen={denyUpgrade}
        onClose={() => {
          setDenyUpgrade(false);
        }}
        title="아직 눈덩이가 부족해요"
        message={`눈덩이 ${requiredSnowball}개로 이글루를 업그레이드 할 수 있어요`}
        twoButtons={{
          leftText: '취소',
          rightText: '확인',
          onRight: () => {
            setDenyUpgrade(false);
          },
        }}
      />

      <AlertModal
        isOpen={higherEightModal}
        onClose={() => {
          setHigherEightModal(false);
        }}
        title="5회 냉동 실패!"
        message="이글루가 녹을 위기입니다. 눈덩이 8개로 지키시겠습니까?"
        twoButtons={{
          leftText: '취소',
          rightText: '확인',
          onRight: () => {
            handleSnowballLoss();
          },
        }}
      />

      <ImageModal
        isOpen={lowerEightModal}
        onClose={() => {
          setLowerEightModal(false);
        }}
        title="5회 냉동 실패!"
        rewardMessage="이글루가 1단계 하락했습니다."
        currentMessage="눈덩이를 모아 이글루를 지킬 수 있습니다!"
        confirmText="확인"
      />
    </div>
  );
}
