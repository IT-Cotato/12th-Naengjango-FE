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
        'h-14 w-full rounded-[10px] border-0 text-[16px] font-semibold outline-none ring-0 transform-gpu',
        disabled ? 'bg-gray-300 text-white' : 'bg-main-skyblue text-white',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
