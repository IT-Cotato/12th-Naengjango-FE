import { useState } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  success?: boolean;
  hidePlaceholderOnFocus?: boolean;
};

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled,
  error,
  helperText,
  rightSlot,
  className,
  success,
  hidePlaceholderOnFocus = true,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderClass = disabled
    ? 'border-0'
    : error
      ? 'border-red-500'
      : success
        ? 'border-[#5e97d7]'
        : 'border-gray-500 focus-within:border-[#5e97d7]';
  return (
    <div className={className}>
      {label && <p className="pl-2 mb-2 text-[15px] text-gray-400">{label}</p>}

      <div
        className={`flex h-12 items-center gap-2 rounded-[10px] border px-4
          ${borderClass}
          ${disabled ? 'bg-[#F3F3F3] text-[#D6D3D3]' : 'bg-white'}`}
      >
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          placeholder={hidePlaceholderOnFocus && isFocused ? '' : placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={onChange}
          type={type}
          disabled={disabled}
        />

        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>

      {error ? (
        <p className="mt-2 ml-2 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-2 ml-2 text-xs text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
