import { useState } from 'react';
import InlineInput from './InlineInput';
import { useEffect } from 'react';

type ToggleProps = {
  activeToggle: 'manual' | 'link';
  onToggleChange: (Toggle: 'manual' | 'link') => void;
  onInputStateChange: (state: { mode: 'manual' | 'link'; isValid: boolean }) => void;
  canFreeze: boolean;
  resetKey: number;
};

export default function ToggleCard({
  activeToggle,
  onToggleChange,
  onInputStateChange,
  canFreeze,
  resetKey,
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

  //수동입력 상태
  const [price, setPrice] = useState('');
  const [item, setItem] = useState('');

  useEffect(() => {
    //냉동하기 버튼 유효성 검사
    const isManualValid = price.trim() !== '' && item.trim() !== '';
    const isLinkValid = value.trim() !== '';
    onInputStateChange({
      mode: activeToggle,
      isValid: activeToggle === 'manual' ? isManualValid : isLinkValid,
    });
  }, [activeToggle, price, item, value]);

  useEffect(() => {
    if (activeToggle === 'manual') {
      setValue('');
    }

    if (activeToggle === 'link') {
      setPrice('');
      setItem('');
    }
  }, [activeToggle]);
  useEffect(() => {
    setPrice('');
    setItem('');
    setValue('');
    setIsFocused(false);

    // 부모에 "입력 무효" 다시 알려주기
    onInputStateChange({
      mode: activeToggle,
      isValid: false,
    });
  }, [resetKey]);

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
                <InlineInput placeholder="금액" value={price} onChange={setPrice} type="price" />

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

        {activeToggle === 'link' && (
          <div>
            <textarea
              data-layer="Frame 15"
              placeholder="URL을 붙여넣으세요(http://...)"
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
      </div>
    </>
  );
}
