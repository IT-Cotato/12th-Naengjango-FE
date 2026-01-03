type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function InputActionButton({ children, onClick, disabled, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-14 h-7 rounded-2xl text-[10px] font-normal',
        'flex items-center justify-center',
        'text-[#FFFFFF]',
        'px-2 pt-1.5 pb-1.5',
        disabled ? 'bg-gray-300' : 'bg-[#5E97D7]',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
