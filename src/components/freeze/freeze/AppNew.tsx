import deleteIcon from '../../../assets/icons/delete.svg';
import { useAppInteraction } from '../../../hooks/useAppInteractions';
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
  const interactionHandlers = useAppInteraction({
    onClick,
    onLongPress,
  });
  return (
    <div
      {...interactionHandlers}
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
        className="
    max-w-[46px]
    text-center
    text-gray-800
    Regular_10
    font-sans
    leading-4
    tracking-tight
    whitespace-nowrap
    overflow-hidden
    text-ellipsis
  "
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
