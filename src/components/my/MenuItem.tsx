import { go } from '@/assets';

type Props = {
  label: string;
  onClick?: () => void;
  icon?: string | React.ReactNode;
  showChevron?: boolean;
};

export default function MenuItem({ label, onClick, icon, showChevron = true }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[60px] flex items-center justify-between px-6 py-4 bg-white border-b border-white-400 last:border-b-0 active:bg-gray-50"
    >
      <div className="flex items-center flex-1">
        {icon && (
          <span className="mr-5 flex items-center justify-center w-6 h-6">
            {typeof icon === 'string' ? (
              <img src={icon} alt="" className="w-6 h-6" aria-hidden="true" />
            ) : (
              icon
            )}
          </span>
        )}
        <span className="Medium_18 text-gray-800">{label}</span>
      </div>
      {showChevron && <img src={go} alt="이동" className="w-6 h-6 ml-3" aria-hidden="true" />}
    </button>
  );
}
