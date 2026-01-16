import { useEffect, useRef, useState } from 'react';

type InlineInputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function InlineInput({ placeholder, value, onChange }: InlineInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth + 2);
    }
  }, [value, placeholder]);

  const getInputColor = () => {
    if (isFocused) return 'text-main-skyblue border-main-skyblue';
    if (value) return 'text-gray-800 border-gray-800';
    return 'text-white-800/40 border-white-800/40';
  };

  return (
    <>
      <span
        ref={spanRef}
        className="absolute invisible whitespace-pre text-xl font-medium font-sans"
      >
        {value || placeholder}
      </span>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        style={{ width }}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
        max-w-[206px]
        truncate
        bg-transparent
        border-b
        outline-none
        text-xl
        font-medium
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
