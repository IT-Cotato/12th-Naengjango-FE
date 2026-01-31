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
  const [item, setItem] = useState<FreezeItem[]>([
    {
      id: 1,
      title: '바지',
      price: 57000,
      remainingHour: 24,
      checked: false,
      image: images.ably,
      selectedAppId: 'ably',
    },
    {
      id: 2,
      image: images.kream,
      title: '맨투맨',
      price: 115000,
      remainingHour: 22,
      checked: false,
      selectedAppId: 'kream',
    },
    {
      id: 3,
      image: images.zigzag,
      title: '후드티',
      price: 165000,
      remainingHour: 22,
      checked: false,
      selectedAppId: 'zigzag',
    },
    {
      id: 4,
      image: images.brandi,
      title: '에어포스',
      price: 122000,
      remainingHour: 3,
      checked: false,
      selectedAppId: 'brandi',
    },
    {
      id: 5,
      image: images.twentyninecm,
      title: '코트',
      price: 222000,
      remainingHour: 7,
      checked: false,
      selectedAppId: 'twentyninecm',
    },
  ]);

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
  const [isSnowBall, setIsSnowBall] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [sortOption]);

  const [selectedItem, setSelectedItem] = useState<FreezeItem | null>(null);
  const isEmpty = item.length === 0;

  return (
    <>
      <div
        className="relative left-[24px] top-[100px] absolute bg-white-800 rounded-[20px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] overflow-hidden
          w-[327px] h-[546px]"
      >
        {!isEmpty && (
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

        {isEmpty && (
          <div className=" w-[375px] absolute top-[243px] left-[-24px] text-center justify-start text-neutral-400 Regular_15">
            냉동 기록이 없습니다.
            <br />
            ‘냉동하기’에서 냉동 상품을 추가하세요!
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
            setItem((prev) => prev.filter((item) => !item.checked));
            setIsFailModalOpen(false);
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
            setItem((prev) => prev.filter((item) => !item.checked));
            setIsSuccessModalOpen(false);
            setIsSnowBall(true);
          },
        }}
      />

      <ImageModal
        isOpen={isSnowBall}
        onClose={() => {
          setIsSnowBall(false);
        }}
        rewardMessage="눈덩이 2개 지급 완료"
        currentMessage="현재 보유 눈덩이: 4개"
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
