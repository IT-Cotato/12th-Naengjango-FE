import { useState } from 'react';
import chevron_gray_200 from '../../../assets/icons/chevron-gray-200.svg';
import chevron_gray_400 from '../../../assets/icons/chevron-gray-400.svg';
import FreezeApp from './FreezeApp';
import { PRESET_APPS } from '@/data/presetApps';

type AddResult = { type: 'preset'; appId: string } | { type: 'custom'; name: string };

type AddModalProps = {
  onConfirm: (result: AddResult) => void;
  onClose: () => void;
};

export default function AddModal({ onClose, onConfirm }: AddModalProps) {
  const PAGE_SIZE = 12;
  const TOTAL_PAGES = 2;

  const [page, setPage] = useState(0); // 0 | 1

  const startIndex = page * PAGE_SIZE;
  const currentApps = PRESET_APPS.slice(startIndex, startIndex + PAGE_SIZE);
  const isFirstPage = page === 0;
  const isLastPage = page === TOTAL_PAGES - 1;

  const [isFocused, setIsFocused] = useState(false);
  const getInputColor = () => {
    if (isFocused)
      return 'outline-main-skyblue placeholder:text-gray-800 placeholder:SemiBold_16 placeholder:text-transparent';
    return 'outline-gray-400 placeholder:Medium_16 placeholder:text-gray-400 ';
  };

  const [inputValue, setInputValue] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const isActivated = Boolean(inputValue.trim() || selectedAppId);

  // 프리셋 클릭
  const handlePresetClick = (id: string) => {
    setSelectedAppId((prev) => (prev === id ? null : id));
    setInputValue('');
  };

  // 인풋 입력
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSelectedAppId(null);
  };

  const handleConfirm = () => {
    if (selectedAppId) {
      onConfirm({ type: 'preset', appId: selectedAppId });
    } else if (inputValue.trim()) {
      onConfirm({ type: 'custom', name: inputValue.trim() });
    }
  };

  return (
    <>
      <div
        data-layer="Frame 26"
        className="Frame26 fixed inset-0 z-51 bg-gray-800/30 overflow-hidden"
        onClick={onClose}
      >
        <div
          data-layer="Frame 25"
          className="Frame25 w-[375px] h-[488px] absolute bottom-0 bg-white-800 rounded-tl-[30px] rounded-tr-[30px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={[
              'Button w-[327px] h-14 px-4 py-2 left-[24px] top-[398px] absolute rounded-[10px] inline-flex justify-center items-center gap-2.5',
              !isActivated ? 'bg-gray-300' : 'bg-main-skyblue',
            ].join(' ')}
            disabled={!isActivated}
            onClick={() => {
              handleConfirm();
              onClose();
            }}
          >
            <div
              data-layer="로그인"
              className="flex-1  text-center justify-center text-white-800 Bold_16 font-sans"
            >
              추가
            </div>
          </button>

          <div
            data-layer="Resize Indicator"
            className="ResizeIndicator w-[45px] h-1 left-[210px] top-[17px] absolute origin-top-left -rotate-180 bg-gray-200 rounded-xs"
            onClick={onClose}
          />

          <div
            data-layer="entry"
            data-property-1="basic"
            className="Entry w-[375px] left-0 top-[61px] absolute inline-flex flex-col justify-start items-center gap-px "
          >
            <input
              data-layer="Frame 15"
              className={` w-[327px] h-12 px-4 py-2 bg-white-800 rounded-[10px] outline outline-[1.50px] outline-offset-[-1.50px] inline-flex justify-start items-center gap-2.5  placeholder:font-sans ${getInputColor()}`}
              placeholder="추가할 어플을 입력하세요"
              value={inputValue}
              onChange={(e) => {
                handleInputChange(e.target.value);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div
            data-layer="Frame 41"
            className="Frame41 w-[375px] px-6 left-0 top-[34px] absolute inline-flex justify-start items-center gap-2.5"
          >
            <div
              data-layer="추가할 어플을 선택하거나 직접 입력하세요"
              className="flex-1 text-center justify-center text-gray-800 Semibold_15 font-sans leading-[22.50px] tracking-tight"
            >
              추가할 어플을 선택하거나 직접 입력하세요
            </div>
          </div>

          <div className="grid grid-cols-[repeat(4,70px)] gap-x-3 gap-y-2.5  top-[126px] left-[29.5px] absolute">
            {currentApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col items-center gap-1 h-[76px]"
                onClick={() => handlePresetClick(app.id)}
              >
                <FreezeApp src={app.src} alt={app.name} isSelected={app.id === selectedAppId} />
                <div className="text-center text-black Regular_14">{app.name}</div>
              </div>
            ))}
          </div>

          {/* 왼쪽 화살표 */}
          {!isFirstPage && (
            <button
              onClick={() => setPage((p) => p - 1)}
              className="group w-6 h-6 absolute left-[4px] top-[227px]
                     flex items-center justify-center"
            >
              <img src={chevron_gray_200} className="group-hover:hidden" />
              <img src={chevron_gray_400} className="hidden group-hover:block scale-x-[-1]" />
            </button>
          )}

          {/* 오른쪽 화살표 */}
          {!isLastPage && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="group w-6 h-6 absolute right-[4px] top-[227px]
                     flex items-center justify-center"
            >
              <img src={chevron_gray_200} className="group-hover:hidden scale-x-[-1]" />
              <img src={chevron_gray_400} className="hidden group-hover:block" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
