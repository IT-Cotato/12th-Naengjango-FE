import { useEffect, useRef, useState } from 'react';

type InlineInputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'price' | 'text';
  maxLength?: number;
};

const formatPrice = (value: string) => {
  const numeric = value.replace(/[^0-9]/g, '');

  if (!numeric) return '';

  const number = Math.min(Number(numeric), 9_999_999);
  return number.toLocaleString();
};

export default function InlineInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  maxLength,
}: InlineInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth + 2);
    }
  }, [value, placeholder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let next = e.target.value;

    if (type === 'price') {
      next = formatPrice(next);
    }

    if (type === 'text' && maxLength) {
      next = next.slice(0, maxLength);
    }

    onChange(next);
  };

  const getInputColor = () => {
    if (isFocused) return 'text-main-skyblue border-main-skyblue';
    if (value) return 'text-gray-800 border-gray-800';
    return 'text-white-800/40 border-white-800/40';
  };

  return (
    <>
      <span ref={spanRef} className="absolute invisible whitespace-pre Medium_20 font-sans">
        {value || placeholder}
      </span>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        style={{ width }}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
        max-w-[206px]
        truncate
        bg-transparent
        border-b
        outline-none
        Medium_20
        font-sans
        leading-8
        tracking-tight
        placeholder:text-white-800/40
        transition-colors duration-150
        ${getInputColor()}
      `}
      />
    </>
  );
}
