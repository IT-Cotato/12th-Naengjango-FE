import deleteIcon from '../../../assets/icons/delete.svg';
import { useAppInteraction } from '../../../hooks/useAppInteractions';

type FreezeAppProps = {
  src: string;
  alt?: string;
  isSelected?: boolean;
  showDelete?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
  onDeleteClick?: () => void;
};

export default function FreezeApp({
  src,
  alt = 'app icon',
  isSelected,
  onClick,
  showDelete,
  onLongPress,
  onDeleteClick,
}: FreezeAppProps) {
  const interactionHandlers = useAppInteraction({
    onClick,
    onLongPress,
  });

  return (
    <div
      {...interactionHandlers}
      className={[
        'relative w-[54px] rounded-lg',
        isSelected
          ? 'shadow-[0px_0px_10px_0px_rgba(94,151,215,1)] outline outline-2 outline-main-skyblue -outline-offset-1'
          : '',
      ].join(' ')}
    >
      <img src={src} alt={alt} onContextMenu={(e) => e.preventDefault()} draggable={false} />

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
