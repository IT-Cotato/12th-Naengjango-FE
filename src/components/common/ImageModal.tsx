type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rewardMessage: string; // 눈덩이 n개 지급 완료
  currentMessage: string; // 현재 보유 눈덩이: n개
  image?: string | React.ReactNode;
  confirmText?: string;
  className?: string; // 모달 높이 조절
  buttonClassName?: string; // 버튼 높이 조절
};

export default function ImageModal({
  isOpen,
  onClose,
  title,
  rewardMessage,
  currentMessage,
  image,
  confirmText = '확인',
  className,
  buttonClassName,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-800/30"
      onClick={onClose}
    >
      <div
        className={`relative w-[270px] rounded-[14px] bg-white text-center overflow-visible flex flex-col ${className ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {image && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
            <div className="w-10 h-10 rounded-full border-2 border-sub-skyblue flex items-center justify-center bg-white">
              {typeof image === 'string' ? (
                <img src={image} alt="" className="w-6 h-6 object-contain" aria-hidden="true" />
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">{image}</div>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center px-4 py-5">
          <p className="SemiBold_16 text-gray-900">{title}</p>
          <p className="mt-1 SemiBold_16 text-gray-900 text-center">{rewardMessage}</p>
          <p className="mt-1.5 Regular_14 text-gray-600 text-center">{currentMessage}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`w-full border-t-[0.33px] border-gray-200 text-[16px] font-medium text-main-skyblue ${buttonClassName ?? 'py-3'}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
