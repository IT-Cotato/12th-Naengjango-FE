import box_24 from '../../../assets/icons/box-24.svg';
import checkinbox_24 from '../../../assets/icons/checkinbox-24.svg';
import { useEffect, useRef, useState } from 'react';

type Props = {
  image: string;
  title: string;
  price: number;
  remainingHour: number;
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
  remainingHour,
  checked,
  onToggle,
  onClick,
  containerRef,
  isFirst,
  isLast,
}: Props) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(1); // 얼마나 화면에 보이는지
  const shouldApplyEffect = !isFirst && !isLast && ratio < 1;

  useEffect(() => {
    if (!itemRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRatio(entry.intersectionRatio);
      },
      {
        root: containerRef.current,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      },
    );

    observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  return (
    <div
      ref={itemRef}
      onClick={onClick}
      style={{
        opacity: shouldApplyEffect ? Math.max(0.8, ratio) : 1,
        filter: shouldApplyEffect ? `blur(${(1 - ratio) * 3}px)` : 'none',
        transition: 'opacity 0.2s ease, filter 0.2s ease',
      }}
      className="w-full px-4 py-3 bg-sub-skyblue rounded-xl inline-flex justify-between items-start cursor-pointer"
    >
      <div className="flex gap-3">
        <img src={image} className="size-[54px] rounded-lg" />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="px-1.5 py-0.5 bg-main-skyblue rounded-lg text-white-800 Medium_12">
              {remainingHour}H
            </div>
            <div className="SemiBold_14">{title}</div>
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
  );
}
