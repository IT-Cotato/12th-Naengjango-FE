import box_24 from '../../../assets/icons/box-24.svg';
import checkinbox_24 from '../../../assets/icons/checkinbox-24.svg';
import { useEffect, useRef, useState } from 'react';

type Props = {
  image: string;
  title: string;
  price: number;
  remainingSeconds: number;
  checked: boolean;
  onToggle: () => void;
  onClick: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isFirst: boolean;
  isLast: boolean;
};

export default function FreezeHistoryItem({
  image,
  title,
  price,
  remainingSeconds,
  checked,
  onToggle,
  onClick,
  containerRef,
  isFirst,
  isLast,
}: Props) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(1);

  const formatRemainingTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) return `${hours}H`;
    return `${minutes}M`;
  };

  // 스크롤 기반 가시영역 계산
  useEffect(() => {
    const container = containerRef.current;
    const item = itemRef.current;
    if (!container || !item) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const visibleTop = Math.max(containerRect.top, itemRect.top);
      const visibleBottom = Math.min(containerRect.bottom, itemRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      const ratio = visibleHeight / itemRect.height;
      setRatio(Math.min(1, Math.max(0, ratio)));
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const MAX_LENGTH = 9;
  const titleShort = title.length > MAX_LENGTH ? title.slice(0, MAX_LENGTH) + '…' : title;

  const shouldApplyEffect = !isFirst && !isLast && ratio < 1;

  return (
    <div className="relative" onClick={onClick}>
      {/* --- 🔥 Blur Overlay Layer (항상 blur 보이게 하는 핵심) --- */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl z-[1]"
        style={{
          filter: shouldApplyEffect ? `blur(${(1 - ratio) * 3}px)` : 'none',
          opacity: shouldApplyEffect ? 0.7 : 0,
          transition: 'filter 0.2s ease, opacity 0.2s ease',
        }}
      />

      {/* --- 실제 콘텐츠 (blur 없음 / opacity만 적용) --- */}
      <div
        ref={itemRef}
        style={{
          opacity: ratio,
          transition: 'opacity 0.2s ease',
        }}
        className={`relative z-[0] w-full px-4 py-3 rounded-xl inline-flex justify-between items-start cursor-pointer ${
          remainingSeconds === 0 ? 'bg-error/40' : 'bg-sub-skyblue'
        }`}
      >
        <div className="flex gap-3">
          <img src={image} className="size-[54px] rounded-lg" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div
                className={`px-1.5 py-0.5 rounded-lg text-white-800 Medium_12 ${
                  remainingSeconds === 0 ? 'bg-error' : 'bg-main-skyblue'
                }`}
              >
                {formatRemainingTime(remainingSeconds)}
              </div>
              <div className="SemiBold_14 truncate">{titleShort}</div>
            </div>

            <div className="SemiBold_14">{price.toLocaleString()}원</div>
          </div>
        </div>

        <img
          src={checked ? checkinbox_24 : box_24}
          className="w-[24px] h-[24px] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />
      </div>
    </div>
  );
}
