type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  className?: string; // 모달 높이 조절
  buttonClassName?: string; // 버튼 높이 조절
  twoButtons?: {
    leftText: string;
    rightText: string;
    onRight: () => void; // 오른쪽 버튼 클릭 시 실행
  };
};

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = '확인',
  className,
  buttonClassName,
  twoButtons,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/30"
      onClick={onClose}
    >
      <div
        className={`w-[270px] rounded-[14px] bg-white text-center overflow-hidden flex flex-col ${className ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 flex flex-col justify-center px-5 py-4">
          <p className="text-[16px] font-semibold text-gray-900">{title}</p>
          {message && <p className="mt-1.5 text-[14px] text-regular text-gray-600">{message}</p>}
        </div>

        {twoButtons ? (
          <div className={`flex border-t-[0.33px] border-gray-200 ${buttonClassName ?? 'h-11'}`}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-[16px] font-regular text-main-skyblue border-r-[0.33px] border-gray-200"
            >
              {twoButtons.leftText}
            </button>
            <button
              type="button"
              onClick={twoButtons.onRight}
              className="flex-1 text-[16px] font-semibold text-main-skyblue"
            >
              {twoButtons.rightText}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className={`w-full border-t-[0.33px] border-gray-200 text-[16px] font-medium text-main-skyblue ${buttonClassName ?? 'py-3'}`}
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  );
}
