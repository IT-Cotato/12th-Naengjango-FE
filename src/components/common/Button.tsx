type Props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
};

export default function Button({ children, onClick, disabled, type = 'button', className }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'h-12 w-full rounded-[10px] text-sm font-semibold',
        disabled ? 'bg-gray-300 text-white' : 'bg-[#5e97d7] text-white',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
