import { useState } from 'react';
import InlineInput from './InlineInput';
import { useEffect } from 'react';
import AlertModal from '@/components/common/AlertModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ToggleProps = {
  activeToggle: 'manual' | 'link';
  onToggleChange: (Toggle: 'manual' | 'link') => void;
  onInputStateChange: (state: {
    mode: 'manual' | 'link';
    isValid: boolean;
    itemName: string;
    price: number;
  }) => void;
  canFreeze: boolean;
  resetKey: number;
  onFreeze: () => void;
};

export default function ToggleCard({
  activeToggle,
  onToggleChange,
  onInputStateChange,
  canFreeze,
  resetKey,
  onFreeze,
}: ToggleProps) {
  const activeStyle =
    'w-32 h-9 px-2.5 py-[8px] px-[2px] left-[-2px] top-0 relative bg-white-800 rounded-[20px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.06)]';
  const inactiveStyle =
    'w-32 h-9 px-2.5 py-[8px] px-[2px] left-[-2px] top-0 relative  rounded-[20px]';

  const activeText =
    'flex-1 text-center justify-start text-gray-800 SemiBold_14 font-sans leading-5 tracking-tight line-clamp-1';
  const inactiveText =
    'flex-1 self-stretch text-center justify-center text-white-800 SemiBold_14 font-sans leading-5 tracking-tight';

  //링크 입력 상태
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const getInputColor = () => {
    if (isFocused)
      return 'bg-white-800 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] outline-main-skyblue placeholder:text-gray-800 placeholder:text-transparent';
    if (value)
      return 'bg-white-800 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] outline-main-skyblue placeholder:text-gray-800';
    return 'bg-white-400 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] outline-gray-200 placeholder:text-gray-400 ';
  };

  //링크 모달 상태
  const [linkErrorModal, setLinkErrorModal] = useState(false);

  //수동입력 상태
  const [price, setPrice] = useState(0);
  const [priceString, setPriceString] = useState('');
  const [item, setItem] = useState('');

  useEffect(() => {
    const isManualValid = price > 0 && item.trim() !== '';
    const isLinkValid = value.trim() !== '';

    onInputStateChange({
      mode: activeToggle,
      isValid: activeToggle === 'manual' ? isManualValid : isLinkValid,
      itemName: item,
      price: price, // ← number 값만 전달
    });
  }, [activeToggle, price, item, value]);

  //모달창 연결 버튼 클릭 상태
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (activeToggle === 'manual') {
      setValue('');
    }

    if (activeToggle === 'link') {
      setPrice(0);
      setPriceString('');
      setItem('');
    }
  }, [activeToggle]);

  useEffect(() => {
    setPrice(0);
    setPriceString('');
    setItem('');
    setValue('');
    setIsFocused(false);

    // 부모에 "입력 무효" 다시 알려주기
    onInputStateChange({
      mode: activeToggle,
      isValid: false,
      itemName: '',
      price: 0,
    });
  }, [resetKey]);

  function cleanProductName(name: string): string {
    return (
      name
        // 1. 이모티콘으로 둘러싸인 텍스트 제거 (🧡텍스트🧡)
        .replace(/[\p{Extended_Pictographic}]+.*?[\p{Extended_Pictographic}]+/gu, '')

        // 2. 대괄호 내용 제거
        .replace(/\[.*?\]/g, '')

        // 3. 소괄호 내용 제거
        .replace(/\(.*?\)/g, '')

        // 4. 이모지 단독 제거
        .replace(/[\p{Extended_Pictographic}]/gu, '')

        // 5. 하이픈 뒤 옵션 제거
        .replace(/-.*/g, '')

        // 6. 특수문자 정리
        .replace(/[^\w가-힣 ]+/g, ' ')

        // 7. 다중 공백 → 단일 공백
        .replace(/\s+/g, ' ')

        // 8. 앞뒤 공백 제거
        .trim()
    );
  }

  const handleLinkFreeze = async () => {
    if (!value.trim()) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.warn('No access token. User might not be logged in.');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ url: value.trim() }),
      });

      const data = await res.json();
      console.log(data);
      const { title, price } = data;

      const clean = cleanProductName(title);

      // title 또는 price가 null → 수동 입력 필요
      if (!title || !price) {
        setLinkErrorModal(true); // 🔥 오류 모달 열기
        return;
      }

      onInputStateChange({
        mode: 'link',
        isValid: true,
        itemName: clean,
        price: price,
      });

      // 냉동하시겠습니까 모달
      setConfirmModal(true);
    } catch (e) {
      console.error(e);
      setLinkErrorModal(true); // 🔥 오류 모달 열기
    }
  };

  return (
    <>
      <div
        data-layer="toggel"
        data-property-1="passivity"
        className="Toggel z-1 w-72 h-12 px-4 py-2 left-[20px] top-[266px] absolute bg-sub-skyblue rounded-[100px] inline-flex justify-center items-center overflow-hidden"
      >
        <div
          data-layer="Button 1"
          className="Button1 flex-1 self-stretch relative flex justify-center items-center"
        >
          <div
            data-layer="Button"
            onClick={() => onToggleChange('manual')}
            className={`
          ${activeToggle === 'manual' ? activeStyle : inactiveStyle}`}
          >
            <div
              data-layer="Label"
              className={`
            ${activeToggle === 'manual' ? activeText : inactiveText}`}
            >
              수동 입력
            </div>
          </div>
        </div>

        <div
          data-layer="Button 2"
          onClick={() => onToggleChange('link')}
          className={`
          ${activeToggle === 'link' ? activeStyle : inactiveStyle}`}
        >
          <div
            data-layer="Label"
            className={`
            ${activeToggle === 'link' ? activeText : inactiveText}`}
          >
            링크 등록
          </div>
        </div>
      </div>

      <div
        data-layer="Frame 48096432"
        className="Frame48096432 w-72 h-56 left-[20px] top-[291px] absolute bg-sub-skyblue rounded-bl-[20px] rounded-br-[20px] overflow-hidden"
      >
        {activeToggle === 'manual' && (
          <div>
            <div
              data-layer="Frame 48096433"
              className="Frame48096433 w-72 px-5 left-0 top-[40px] absolute inline-flex justify-start items-center gap-2.5"
            >
              <div
                data-layer="금액 원의 품목 을 결제할지 고민이에요"
                className="flex-1 justify-start"
              >
                <InlineInput
                  placeholder="금액"
                  value={priceString}
                  onChange={(v) => {
                    setPriceString(v);

                    const numeric = Number(v.replace(/,/g, ''));
                    setPrice(numeric);
                  }}
                  type="price"
                />

                <span className="text-gray-800 Medium_20 font-sans leading-8 tracking-tight">
                  {' '}
                  원의
                  <br />
                </span>

                <InlineInput
                  placeholder="품목"
                  value={item}
                  onChange={setItem}
                  type="text"
                  maxLength={10}
                />

                <span className="text-gray-800 Medium_20 font-sans leading-8 tracking-tight">
                  {' '}
                  을<br />
                  결제할지 고민이에요
                </span>
              </div>
            </div>

            <button
              data-layer="button"
              data-property-1="freeze_basic"
              className={[
                'Button w-64 h-10 px-4 py-2 left-[16px] top-[172px] absolute rounded-xl shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] inline-flex justify-center items-center gap-2.5',
                !canFreeze ? 'bg-white-400 text-gray-200 ' : 'bg-main-skyblue text-white-800',
              ].join(' ')}
              disabled={!canFreeze}
              onClick={() => setConfirmModal(true)}
            >
              <div
                data-layer="냉동하기"
                className="flex-1 self-stretch text-center justify-center Bold_16 font-sans leading-6 tracking-tight"
              >
                냉동하기
              </div>
            </button>
          </div>
        )}

        <AlertModal
          isOpen={confirmModal}
          onClose={() => {
            console.log('freeze canceled!');
            setConfirmModal(false);
          }}
          title="냉동하시겠습니까"
          message="24시간 후 알림을 전송해요"
          twoButtons={{
            leftText: '취소',
            rightText: '냉동하기',
            onRight: () => {
              onFreeze();
              setConfirmModal(false);
              setPrice(0);
              setPriceString('');
              setItem('');
              setValue('');
              setIsFocused(false);
            },
          }}
        />

        {activeToggle === 'link' && (
          <div>
            <textarea
              data-layer="Frame 15"
              placeholder="URL을 붙여넣으세요(http://...)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`Frame15 w-64 h-32 px-4 py-2 left-[14px] top-[29px] absolute rounded-xl outline outline-1 outline-offset-[-1px]  inline-flex justify-start items-start gap-2.5 resize-none
                placeholder:Medium_15
                ${getInputColor()}`}
            />

            <button
              data-layer="button"
              data-property-1="freeze_basic"
              className={[
                'Button w-64 h-10 px-4 py-2 left-[16px] top-[172px] absolute rounded-xl shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)] inline-flex justify-center items-center gap-2.5',
                !canFreeze ? 'bg-white-400 text-gray-200 ' : 'bg-main-skyblue text-white-800',
              ].join(' ')}
              disabled={!canFreeze}
              onClick={handleLinkFreeze}
            >
              <div
                data-layer="링크 등록"
                className="flex-1 self-stretch text-center justify-center Bold_16 font-sans leading-6 tracking-tight"
              >
                링크 등록
              </div>
            </button>
          </div>
        )}

        <AlertModal
          isOpen={linkErrorModal}
          onClose={() => setLinkErrorModal(false)}
          title="링크 등록이 어렵습니다"
          message="수동으로 등록해주세요"
          twoButtons={{
            leftText: '취소',
            rightText: '수동 입력',
            onRight: () => {
              setLinkErrorModal(false);
              onToggleChange('manual'); // 🔥 수동입력 모드로 이동
            },
          }}
        />
      </div>
    </>
  );
}
