import box from '../../../assets/icons/box.svg';
import checkinbox from '../../../assets/icons/checkinbox.svg';

type Props = {
  image: string;
  title: string;
  price: number;
  remainingHour: number;
  checked: boolean;
  onToggle: () => void;
  onClick: () => void;
};

export default function FreezeHistoryItem({
  image,
  title,
  price,
  remainingHour,
  checked,
  onToggle,
  onClick,
}: Props) {
  return (
    <div
      className="w-full px-4 py-3 bg-sub-skyblue rounded-xl inline-flex justify-between items-start cursor-pointer"
      onClick={onClick}
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
        src={checked ? checkinbox : box}
        className="w-[16px] h-[16px] cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      />
    </div>
  );
}
