import { useEffect, useRef, useState } from 'react';

type InlineInputProps = {
  placeholder: string;
  value: string; // UI용 문자열 (3,000)
  onChange: (value: string) => void; // 콤마 포함 문자열 전달
  type?: 'price' | 'text';
  maxLength?: number;
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
      // 숫자만 추출
      const numeric = next.replace(/[^0-9]/g, '');

      if (!numeric) {
        onChange('');
        return;
      }

      // 숫자 → 콤마 문자열 변환
      const formatted = Number(numeric).toLocaleString();
      onChange(formatted);
      return;
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
        inputMode={type === 'price' ? 'numeric' : undefined}
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
