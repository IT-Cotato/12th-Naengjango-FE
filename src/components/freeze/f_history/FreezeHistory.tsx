import box24 from '../../../assets/icons/box-24.svg';
import snow from '../../../assets/snow.svg';
import checkinbox24 from '../../../assets/icons/checkinbox-24.svg';
import DropDown from '@/components/freeze/f_history/DropDown';
import type { SortOption } from '@/components/freeze/f_history/DropDown';
import { useEffect, useRef, useState } from 'react';
import FreezeHistoryItem from './FreezeHistoryItem';
import AlertModal from '@/components/common/AlertModal';
import ImageModal from '@/components/common/ImageModal';
import * as images from '@/assets/images';
import UpdateModal from './UpdateModal';
import type { FreezeItem } from '@/types/FreezeItem';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIglooStatusData } from '@/apis/home/home';
import { useLoading } from '@/contexts/LoadingContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
type ImageKey = keyof typeof images;

type Props = {
  refreshKey: number;
  onUpdated: () => void;
};

export default function FreezeHistory({ refreshKey, onUpdated }: Props) {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [item, setItem] = useState<FreezeItem[]>([]);
  const { setLoading } = useLoading();

  const isAllChecked = item.length > 0 && item.every((item) => item.checked);
  const sortedItems = useMemo(() => {
    return [...item].sort((a, b) => {
      if (sortOption === '최신순') return b.id - a.id;
      if (sortOption === '가격순') return b.price - a.price;
      if (sortOption === '임박순') return a.remainingSeconds - b.remainingSeconds;
      return 0;
    });
  }, [item, sortOption]);

  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [noFailModalOpen, setNoFailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isSnowBall, setIsSnowBall] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [rewardSnowball, setRewardSnowball] = useState<number | null>(null);
  const [currentSnowball, setCurrentSnowball] = useState<number | null>(null);
  const [isStreak, setIsStreak] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [todaySnowballs, setTodaySnowballs] = useState(0);

  const [freezeFailCount, setFreezeFailCount] = useState(0);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JS month는 0~11
  const day = today.getDate();
  const [monthRemaining, setMonthRemaining] = useState<number | null>(null); //이번달 잔여 예산
  const [todayRemaining, setTodayRemaining] = useState<number | null>(null); //오늘 사용 가능 예산
  const [todayBudget, setTodayBudget] = useState<number | null>(null); //새로 계산한 오늘 사용 가능 예산

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [sortOption]);

  const [selectedItem, setSelectedItem] = useState<FreezeItem | null>(null); //상세 아이템 정보
  const isEmpty = item.length === 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!accessToken) {
          console.warn('No access token. User might not be logged in.');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/freezes?sort=latest`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        if (!data.isSuccess) return;

        // 서버 데이터 → FreezeItem 형태로 변환
        const mapped: FreezeItem[] = data.result.map((i: any) => {
          return {
            id: i.id,
            title: i.itemName,
            price: i.price,
            remainingSeconds: i.remainingSeconds,
            checked: false,
            image: images[i.appName as ImageKey] ?? images.defaultImg,
            selectedAppId: i.appName,
          };
        });

        // 임박순은 프론트에서 sort
        let finalList = mapped;
        if (sortOption === '임박순') {
          finalList = [...mapped].sort((a, b) => a.remainingSeconds - b.remainingSeconds);
        }

        setItem(finalList);
        listRef.current?.scrollTo({ top: 0 });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const handleFail = async () => {
    try {
      if (!accessToken) {
        console.warn('No access token. User might not be logged in.');
        return;
      }
      const selectedIds = item.filter((i) => i.checked).map((i) => i.id);

      const res = await fetch(`${API_BASE_URL}/api/freezes/fail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          freezeIds: selectedIds,
        }),
      });

      const data = await res.json();
      if (!data.isSuccess) {
        console.error('Fail API 실패:', data.message);
        return;
      }

      // 서버에서 성공 처리 → 리스트에서 제거
      setItem((prev) => prev.filter((i) => !i.checked));

      // 실패 처리 후에만 Igloo 데이터 다시 로드
      const iglooData = await getIglooStatusData(accessToken);
      setFreezeFailCount(iglooData.result.freezeFailCount);

      // 모달 닫기
      setIsFailModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuccess = async () => {
    try {
      if (!accessToken) {
        console.warn('No access token. User might not be logged in.');
        return;
      }

      const selectedIds = item.filter((i) => i.checked).map((i) => i.id);
      console.log('freeze success body: ', { selectedIds });

      const res = await fetch(`${API_BASE_URL}/api/freezes/success`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          freezeIds: selectedIds,
        }),
      });

      const data = await res.json();

      if (!data.isSuccess) {
        console.error('Success API 실패:', data.message);
        return;
      }

      // 서버 응답 저장
      setRewardSnowball(data.result.action.snowballsGranted);
      setCurrentSnowball(data.result.status.currentSnowballBalance);
      setIsStreak(data.result.status.isStreak);
      setStreakDays(data.result.status.streakDays);

      // 성공 모달 닫기 → 이미지 모달 열기
      setIsSuccessModalOpen(false);
      setIsSnowBall(true);

      // 선택된 아이템 목록 제거 (프론트에서도 반영)
      setItem((prev) => prev.filter((i) => !i.checked));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtend = async () => {
    try {
      if (!accessToken) {
        console.warn('No access token. User might not be logged in.');
        return;
      }

      const selectedIds = item.filter((i) => i.checked).map((i) => i.id);

      // 1) 연장 API 호출
      const res = await fetch(`${API_BASE_URL}/api/freezes/extend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ freezeIds: selectedIds }),
      });

      const data = await res.json();

      if (!data.isSuccess) {
        console.error('Extend API 실패:', data.message);
        return;
      }

      // 2) 연장된 아이템들 개별 GET 호출로 최신 데이터 가져오기
      const updatedItems: FreezeItem[] = [];

      for (const id of selectedIds) {
        const detailRes = await fetch(`${API_BASE_URL}/api/freezes/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const detailData = await detailRes.json();
        if (!detailData.isSuccess) continue;

        const freeze = detailData.result;

        // 남은 시간 직접 계산
        const expires = new Date(freeze.expiresAt + 'Z');
        const now = new Date();
        const diffMs = expires.getTime() - now.getTime();
        const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

        updatedItems.push({
          id: freeze.id,
          title: freeze.itemName,
          price: freeze.price,
          remainingSeconds: diffSeconds,
          checked: false,
          selectedAppId: freeze.appName,
          image: images[freeze.appName as ImageKey] ?? images.defaultImg,
        });
      }

      // 3) local state 업데이트 (해당 아이템만 대체) + 체크 해제까지 한 번에
      setItem((prev) =>
        prev.map((item) => {
          const updated = updatedItems.find((u) => u.id === item.id);
          return updated ? { ...updated, checked: false } : { ...item, checked: false };
        }),
      );

      setIsExtendModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  //전체 예산, 하루 가용 예산 가져오기
  useEffect(() => {
    const fetchAccountStatus = async () => {
      if (!accessToken) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/accounts/status?year=${year}&month=${month}&day=${day}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await res.json();
        if (data.isSuccess && data.result) {
          setMonthRemaining(data.result.monthRemaining);
          setTodayRemaining(data.result.todayRemaining);
          setTodayBudget(data.result.todayRemaining);
        } else {
          console.error('accounts/status 실패', data.message);
          setMonthRemaining(null);
        }
      } catch (err) {
        console.error(err);
        setMonthRemaining(null);
      }
    };

    fetchAccountStatus();
  }, []);

  //하루 가용 예산 계산
  useEffect(() => {
    const fetchBudgetPreview = async () => {
      if (!accessToken) return;

      const selectedIds = item.filter((i) => i.checked).map((i) => i.id);
      if (selectedIds.length === 0) {
        setTodayBudget(todayRemaining); // 선택 항목 없으면 그냥 오늘 예산만
        return;
      }

      try {
        const requestBody = { freezeIds: selectedIds };
        // console.log('Request body:', requestBody);

        const res = await fetch(`${API_BASE_URL}/api/freezes/budget-preview`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (data.isSuccess && data.result) {
          const { perDayBudget } = data.result;

          const availableToday = (todayRemaining ?? 0) - perDayBudget;
          if (availableToday < 0) {
            setTodayBudget(0);
          } else {
            setTodayBudget(availableToday);
          }
        } else {
          console.error('budget-preview 실패', data.message);
          setTodayBudget(0);
        }
      } catch (err) {
        console.error(err);
        setTodayBudget(0);
      }
    };

    fetchBudgetPreview();
  }, [item, todayRemaining]);

  //눈덩이 조회
  useEffect(() => {
    const handleSnow = async () => {
      try {
        if (!accessToken) {
          console.warn('No access token. User might not be logged in.');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/snowballs/summary`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        setTodaySnowballs(data.result.todayEarned);

        if (!data.isSuccess) {
          console.error('snow API 실패:', data.message);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    };
    handleSnow();
  }, [item]);

  useEffect(() => {
    if (freezeFailCount === 5) {
      navigate('/');
    }
  }, [freezeFailCount]);

  const checkedItems = item.filter((i) => i.checked).map((i) => i.id);

  return (
    <>
      <div
        className="relative left-[28.5px] top-[100px] absolute bg-white-800 rounded-[20px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] 
          w-[327px] h-[546px]"
      >
        {isEmpty ? (
          // 2) 로딩 후 비어있음
          <div className=" w-[375px] absolute top-[243px] left-[-24px] text-center text-neutral-400 Regular_15">
            냉동 기록이 없습니다.
            <br />
            ‘냉동하기’에서 냉동 상품을 추가하세요!
          </div>
        ) : (
          // 3) 정상 목록
          <div>
            <div className="absolute left-[20px] top-[107px] w-[287px] relative">
              <div
                ref={listRef}
                className="
                flex flex-col gap-4 max-h-[305px] overflow-y-scroll freeze-scroll
              "
              >
                {sortedItems.map((item, index) => (
                  <div key={item.id} className="relative overflow-visible">
                    <FreezeHistoryItem
                      image={item.image}
                      title={item.title}
                      price={item.price}
                      remainingSeconds={item.remainingSeconds}
                      checked={item.checked}
                      containerRef={listRef}
                      isFirst={index === 0}
                      isLast={index === sortedItems.length - 1}
                      onToggle={() => {
                        setItem((prev) =>
                          prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
                        );
                      }}
                      onClick={() => setSelectedItem(item)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              data-layer="Frame 48096449"
              className="Frame48096449 w-[287px] left-[20px] top-[73px] absolute inline-flex justify-between items-center"
            >
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  setItem((prev) => prev.map((item) => ({ ...item, checked: !isAllChecked })));
                }}
              >
                <div className="text-main-skyblue Medium_12">전체 선택</div>
                <img src={isAllChecked ? checkinbox24 : box24} className="w-[20px] h-[20px]" />
              </div>

              <DropDown value={sortOption} onChange={(value) => setSortOption(value)} />
            </div>

            <div
              data-layer="Frame 48096448"
              className="Frame48096448 w-[287px] left-[20px] top-[424px] absolute inline-flex flex-col justify-start items-start gap-2.5"
            >
              <div
                data-layer="Frame 48096447"
                className="Frame48096447 self-stretch inline-flex justify-center items-center gap-[9px]"
              >
                <button
                  data-layer="Frame 48096445"
                  className="Frame48096445 w-[89px] px-2 py-1.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                  onClick={() => {
                    // 선택된 아이템이 하나라도 있을 때만 모달 열기
                    if (item.some((i) => i.checked)) {
                      setIsExtendModalOpen(true);
                    }
                  }}
                >
                  <div
                    data-layer="계속 냉동"
                    className="text-center justify-start text-white-800 SemiBold_14 font-sans leading-5 tracking-tight"
                  >
                    계속 냉동
                  </div>
                </button>
                <button
                  data-layer="Frame 48096446"
                  className="Frame48096446 w-[89px] px-2 py-1.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                  onClick={() => {
                    // 선택된 아이템이 하나라도 있을 때만 모달 열기
                    if (item.some((i) => i.checked)) {
                      // 체크된 아이템들의 금액 합계 계산
                      const checkedTotalPrice = item
                        .filter((i) => i.checked)
                        .reduce((sum, i) => sum + i.price, 0);

                      // 합계가 monthRemaining보다 크면 noFailModalOpen, 아니면 isFailModalOpen
                      if (checkedTotalPrice > (monthRemaining ?? 0)) {
                        setNoFailModalOpen(true);
                      } else {
                        setIsFailModalOpen(true);
                      }
                    }
                  }}
                >
                  <div
                    data-layer="냉동 실패"
                    className="text-center justify-start text-white-800 SemiBold_14 font-sans leading-5 tracking-tight"
                  >
                    냉동 실패
                  </div>
                </button>
                <button
                  data-layer="Frame 48096447"
                  className="Frame48096447 w-[89px] px-2 py-1.5 bg-main-skyblue rounded-lg flex justify-center items-center gap-2.5"
                  onClick={() => {
                    // 선택된 아이템이 하나라도 있을 때만 모달 열기
                    if (item.some((i) => i.checked)) {
                      setIsSuccessModalOpen(true);
                    }
                  }}
                >
                  <div
                    data-layer="냉동 성공"
                    className="text-center justify-start text-white-800 SemiBold_14 font-sans leading-5 tracking-tight"
                  >
                    냉동 성공
                  </div>
                </button>
              </div>
            </div>
            {checkedItems.length === 0 ? (
              <div
                data-layer="Frame 48096450"
                className="Frame48096450 w-[375px] left-[-24px] top-[477px] absolute inline-flex flex-col justify-start items-start gap-0"
              >
                <div
                  data-layer="Frame 42"
                  className="Frame42 self-stretch px-6 inline-flex justify-start items-center gap-2.5"
                >
                  <div
                    data-layer="하루 4,000원 쓸 수 있게 돼요!"
                    className="4000 flex-1 text-center justify-center"
                  >
                    <span className="text-gray-800 SemiBold_16 font-sans "> 오늘 하루 </span>
                    <span className="text-error SemiBold_16 font-sans ">
                      {todayBudget?.toLocaleString() ?? 0}원
                    </span>
                    <span className="text-gray-800 SemiBold_16 font-sans "> 쓸 수 있어요!</span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                data-layer="Frame 48096450"
                className="Frame48096450 w-[375px] left-[-24px] top-[477px] absolute inline-flex flex-col justify-start items-start gap-0"
              >
                <div
                  data-layer="Frame 41"
                  className="Frame41 self-stretch px-6 inline-flex justify-start items-center gap-2.5"
                >
                  <div
                    data-layer="선택한 상품을 구매하면"
                    className="flex-1 text-center justify-center text-gray-800 SemiBold_16 font-sans"
                  >
                    선택한 상품을 구매하면
                  </div>
                </div>
                <div
                  data-layer="Frame 42"
                  className="Frame42 self-stretch px-6 inline-flex justify-start items-center gap-2.5"
                >
                  <div
                    data-layer="하루 4,000원 쓸 수 있게 돼요!"
                    className="4000 flex-1 text-center justify-center"
                  >
                    <span className="text-gray-800 SemiBold_16 font-sans ">하루 </span>
                    <span className="text-error SemiBold_16 font-sans ">
                      {todayBudget?.toLocaleString() ?? 0}원
                    </span>
                    <span className="text-gray-800 SemiBold_16 font-sans "> 쓸 수 있게 돼요!</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          data-layer="Frame 32"
          className="Frame32 w-[375px] px-6 left-[-24px] top-[29px] absolute inline-flex justify-center items-center gap-2.5"
        >
          <div
            data-layer="나의 냉동 기록"
            className="flex-1 text-center justify-start text-gray-800 Bold_24 font-sans leading-9"
          >
            나의 냉동 기록
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={isFailModalOpen}
        onClose={() => {
          setIsFailModalOpen(false);
        }}
        title="냉동 상품을 결제하셨습니까?"
        message="지금 환불해도 늦지 않아요"
        twoButtons={{
          leftText: '취소',
          rightText: '냉동 실패',
          onRight: () => {
            handleFail();
          },
        }}
      />

      <AlertModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
        }}
        title="냉동 상품을 녹이시겠습니까?"
        message="충동 소비를 억제했어요"
        twoButtons={{
          leftText: '취소',
          rightText: '냉동 성공',
          onRight: () => {
            handleSuccess();
          },
        }}
      />

      <AlertModal
        isOpen={isExtendModalOpen}
        onClose={() => {
          setIsExtendModalOpen(false);
        }}
        title="냉동을 연장하시겠습니까?"
        message="타이머가 다시 24H로 설정돼요"
        twoButtons={{
          leftText: '취소',
          rightText: '계속 냉동',
          onRight: () => {
            handleExtend();
          },
        }}
      />

      <AlertModal
        isOpen={noFailModalOpen}
        onClose={() => {
          setNoFailModalOpen(false);
        }}
        title="예산을 초과한 소비입니다"
        message="냉동 성공 처리하시겠습니까?"
        twoButtons={{
          leftText: '취소',
          rightText: '확인',
          onRight: () => {
            handleSuccess();
          },
        }}
      />

      <ImageModal
        isOpen={isSnowBall}
        onClose={() => {
          setIsSnowBall(false);
        }}
        title={isStreak ? `연속 ${streakDays}회 냉동 성공!` : '냉동 성공!'}
        rewardMessage={
          todaySnowballs === 2
            ? '오늘 최대 눈덩이 수집 완료'
            : `눈덩이 ${rewardSnowball ?? 0}개 지급 완료`
        }
        currentMessage={`현재 보유 눈덩이: ${currentSnowball ?? 0}개`}
        confirmText="확인"
        image={snow}
      />

      {selectedItem && (
        <UpdateModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={(updated) => {
            setItem((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
            setSelectedItem(null);
            onUpdated();
          }}
        />
      )}
    </>
  );
}
