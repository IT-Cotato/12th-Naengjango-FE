import { useRef } from 'react';
import deleteIcon from '../../../assets/icons/delete.svg';
type AppNewProps = {
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
  showDelete?: boolean;
  onLongPress?: () => void;
  onDeleteClick?: () => void;
};

export default function AppNew({
  name,
  isSelected,
  onClick,
  showDelete,
  onLongPress,
  onDeleteClick,
}: AppNewProps) {
  const pressTimerRef = useRef<number | null>(null);

  const startPress = () => {
    pressTimerRef.current = window.setTimeout(() => {
      onLongPress?.();
    }, 500);
  };

  const cancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };
  return (
    <div
      onClick={onClick}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      data-layer="application"
      className={[
        'relative size-[54px] px-3.5 py-[7px] bg-sub-skyblue rounded-lg inline-flex flex-col items-center justify-center overflow-hidden',
        isSelected
          ? 'shadow-[0px_0px_10px_0px_rgba(94,151,215,1)] outline outline-2 outline-main-skyblue -outline-offset-1'
          : '',
      ].join(' ')}
      title={name}
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    >
      <div
        data-layer="name"
        className="w-full text-center text-gray-800 Bold_14 font-sans leading-5 tracking-tight line-clamp-2 word-break: break-all"
      >
        {name}
      </div>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick?.();
          }}
          className="absolute top-0 right-0"
        >
          <img src={deleteIcon} alt="delete" />
        </button>
      )}
    </div>
  );
}
