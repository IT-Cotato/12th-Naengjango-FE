import Button from '../common/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  icon?: string;
  iconAlt?: string;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  onDelete?: () => void;
  saveDisabled?: boolean;
  saveText?: string;
  deleteText?: string;
};

export default function Modal({
  isOpen,
  onClose,
  icon,
  iconAlt,
  title,
  children,
  onSave,
  onDelete,
  saveDisabled = false,
  saveText = '저장',
  deleteText = '삭제',
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full h-[359px] rounded-t-[30px] bg-white-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-11 h-1 rounded-full bg-gray-200" />
        </div>
        {/* 아이콘 */}
        {icon && (
          <div className="flex justify-center mb-1">
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-sub-skyblue">
              <img src={icon} alt={iconAlt || title} className="h-6 w-6" />
            </div>
          </div>
        )}

        {/* 카테고리명 */}
        <p className="text-center text-[15px] font-medium text-[#000000] mb-5">{title}</p>

        <p className="text-[18px] font-weight-500 text-[#000000] mb-2">금액을 입력하세요</p>

        {/* 금액 입력 칸 */}
        <div className="mb-18">{children}</div>
      
        {/* 버튼 */}
        <div className="flex gap-2 mt-8">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 h-14 rounded-[10px] border border-gray-300 text-gray-400 text-[16px] font-semibold"
            >
              {deleteText}
            </button>
          )}
          <Button onClick={onSave} disabled={saveDisabled} className="flex-1">
            {saveText}
          </Button>
        </div>
      </div>
    </div>
  );
}
