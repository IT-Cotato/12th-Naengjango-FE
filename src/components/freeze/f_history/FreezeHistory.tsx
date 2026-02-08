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

export default function FreezeHistory() {
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [item, setItem] = useState<FreezeItem[]>([]);

  const isAllChecked = item.length > 0 && item.every((item) => item.checked);
  const sortedItems = [...item].sort((a, b) => {
    if (sortOption === '최신순') {
      // id가 클수록 최신
      return b.id - a.id;
    }

    if (sortOption === '가격순') {
      // 가격 높은 순
      return b.price - a.price;
    }

    if (sortOption === '임박순') {
      // 가격 높은 순
      return a.remainingHour - b.remainingHour;
    }

    return 0;
  });

  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isSnowBall, setIsSnowBall] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [rewardSnowball, setRewardSnowball] = useState<number | null>(null);
  const [currentSnowball, setCurrentSnowball] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [sortOption]);

  const [selectedItem, setSelectedItem] = useState<FreezeItem | null>(null);
  const isEmpty = item.length === 0;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const accessToken =
          'eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3NzA1MzAyNTIsImV4cCI6MTc3MDUzMjA1MiwibWVtYmVySWQiOjQsInJvbGUiOiJVU0VSIiwic2lnbnVwQ29tcGxldGVkIjp0cnVlfQ.hFv80yn_xKXLoMLx9zYiJM5jqRo8NOkZlC0XhZhnk6dlYLo4Aahd8OY6QA2nRbKS';
        // const res = await fetch(`/api/freezes?sort=${sortParam}`);
        const res = await fetch('https://15.134.213.116.nip.io/api/freezes?sort=latest', {
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
            remainingHour: Math.floor(i.remainingSeconds / 3600),
            checked: false,
            image: images.ably, // appName→이미지 매핑 필요
            selectedAppId: i.appName,
          };
        });

        // 임박순은 프론트에서 sort
        let finalList = mapped;
        if (sortOption === '임박순') {
          finalList = [...mapped].sort((a, b) => a.remainingHour - b.remainingHour);
        }

        setItem(finalList);
        listRef.current?.scrollTo({ top: 0 });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sortOption]);

  const handleFail = async () => {
    try {
      const accessToken =
        'eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3NzA1MzAyNTIsImV4cCI6MTc3MDUzMjA1MiwibWVtYmVySWQiOjQsInJvbGUiOiJVU0VSIiwic2lnbnVwQ29tcGxldGVkIjp0cnVlfQ.hFv80yn_xKXLoMLx9zYiJM5jqRo8NOkZlC0XhZhnk6dlYLo4Aahd8OY6QA2nRbKS';
      const selectedIds = item.filter((i) => i.checked).map((i) => i.id);

      const res = await fetch('https://15.134.213.116.nip.io/api/freezes/fail', {
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

      // 모달 닫기
      setIsFailModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuccess = async () => {
    try {
      const accessToken =
        'eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3NzA1MzAyNTIsImV4cCI6MTc3MDUzMjA1MiwibWVtYmVySWQiOjQsInJvbGUiOiJVU0VSIiwic2lnbnVwQ29tcGxldGVkIjp0cnVlfQ.hFv80yn_xKXLoMLx9zYiJM5jqRo8NOkZlC0XhZhnk6dlYLo4Aahd8OY6QA2nRbKS'; // 네가 쓰던 그대로

      const selectedIds = item.filter((i) => i.checked).map((i) => i.id);
      console.log('freeze success body: ', { selectedIds });

      const res = await fetch('https://15.134.213.116.nip.io/api/freezes/success', {
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
      setRewardSnowball(data.result.affectedCount);
      setCurrentSnowball(data.result.currentSnowball);

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
      const accessToken =
        'eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3NzA1MzAyNTIsImV4cCI6MTc3MDUzMjA1MiwibWVtYmVySWQiOjQsInJvbGUiOiJVU0VSIiwic2lnbnVwQ29tcGxldGVkIjp0cnVlfQ.hFv80yn_xKXLoMLx9zYiJM5jqRo8NOkZlC0XhZhnk6dlYLo4Aahd8OY6QA2nRbKS'; // 네가 쓰던 그대로

      const selectedIds = item.filter((i) => i.checked).map((i) => i.id);
      console.log('freeze extend body: ', { selectedIds });

      const res = await fetch('https://15.134.213.116.nip.io/api/freezes/extend', {
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
        console.error('Extend API 실패:', data.message);
        return;
      }

      setIsExtendModalOpen(false);
      // 체크박스 전체 해제
      setItem((prev) =>
        prev.map((item) => ({
          ...item,
          checked: false,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className="relative left-[28.5px] top-[100px] absolute bg-white-800 rounded-[20px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] overflow-hidden
          w-[327px] h-[546px]"
      >
        {isLoading ? (
          // 1) 로딩 중
          <div className=" w-[375px] absolute top-[243px] left-[-24px] text-center text-neutral-400 Regular_15">
            냉동 기록을 불러오는 중...
          </div>
        ) : isEmpty ? (
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
                flex flex-col gap-4 max-h-[305px] overflow-y-scroll overflow-x-hidden freeze-scroll
              "
              >
                {sortedItems.map((item, index) => (
                  <FreezeHistoryItem
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    price={item.price}
                    remainingHour={item.remainingHour}
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
                      setIsFailModalOpen(true);
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
                  <span className="text-gray-800 SemiBold_16 font-sans ">하루</span>
                  <span className="text-error SemiBold_16 font-sans "> 4,000원</span>
                  <span className="text-gray-800 SemiBold_16 font-sans "> 쓸 수 있게 돼요!</span>
                </div>
              </div>
            </div>
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

      <ImageModal
        isOpen={isSnowBall}
        onClose={() => {
          setIsSnowBall(false);
        }}
        rewardMessage={`눈덩이 ${rewardSnowball ?? 0}개 지급 완료`}
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
          }}
        />
      )}
    </>
  );
}
