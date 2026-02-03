import { useState, useEffect, useRef } from 'react';
import { errorIcon } from '@/assets';

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  type?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  disabled?: boolean;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  success?: boolean;
  hidePlaceholderOnFocus?: boolean;
  inputClassName?: string;
  grayBg?: boolean; // 클릭 전 회색 배경, 클릭 시 흰색 배경
  showLastChar?: boolean; // 비밀번호 마지막 글자만 보이게
  keepBlueBorder?: boolean; // 값이 있으면 파란 테두리 유지
  showErrorIcon?: boolean; // 에러 아이콘 표시 여부 (기본값: true)
};

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  type = 'text',
  inputMode,
  disabled,
  error,
  helperText,
  rightSlot,
  className,
  success,
  hidePlaceholderOnFocus = true,
  inputClassName,
  grayBg = false,
  showLastChar = false,
  keepBlueBorder = false,
  showErrorIcon = true,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [maskedValue, setMaskedValue] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // showLastChar가 true이고 type이 password일 때 *로 마스킹 처리
  useEffect(() => {
    if (showLastChar && type === 'password') {
      // 이전 타이머 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!value || value.length === 0) {
        setMaskedValue('');
      } else {
        // 마지막 글자만 보이고 나머지는 *
        const masked = '*'.repeat(Math.max(0, value.length - 1)) + (value.slice(-1) || '');
        setMaskedValue(masked);

        // 5초 후에 전체 *로 마스킹
        timeoutRef.current = setTimeout(() => {
          setMaskedValue('*'.repeat(value.length));
        }, 5000);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, showLastChar, type]);

  // 비밀번호 마스킹 상태에서 onChange 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showLastChar && type === 'password' && onChange) {
      const inputValue = e.target.value;
      const currentLength = value?.length || 0;

      if (inputValue.length > currentLength) {
        // 마지막에 추가된 실제 문자를 value에 붙임
        const newChar = inputValue.slice(-1);
        const newValue = (value || '') + newChar;
        onChange({ ...e, target: { ...e.target, value: newValue } });
      } else if (inputValue.length < currentLength) {
        // 글자 삭제: value에서 마지막 문자 제거
        const newValue = (value || '').slice(0, -1);
        onChange({ ...e, target: { ...e.target, value: newValue } });
      }
    } else {
      onChange?.(e);
    }
  };

  const hasValue = value && value.length > 0;

  const borderClass = disabled
    ? 'border-0'
    : error
      ? 'border-red-500 border-[1.5px]'
      : success
        ? 'border-[#5e97d7] border-[1.5px]'
        : keepBlueBorder && hasValue
          ? 'border-main-skyblue border-[1.5px]'
          : 'border-gray-300 focus-within:border-main-skyblue border-[1.5px]';

  // 로그인 페이지 배경색: 값이 있거나 포커스 중이면 흰색, 아니면 회색
  const bgClass = disabled
    ? 'bg-white-400 text-gray-200'
    : grayBg
      ? !isFocused && !hasValue
        ? 'bg-white-400'
        : 'bg-white-800 border-main-skyblue'
      : 'bg-white-800';

  return (
    <div className={className}>
      {label && <p className="pl-2 mb-2 text-[15px] text-gray-400">{label}</p>}

      <div
        className={`flex h-12 items-center gap-2 rounded-[10px] border px-4
          ${borderClass}
          ${bgClass}
          ${inputClassName ?? ''}`}
      >
        <input
          className="w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          placeholder={hidePlaceholderOnFocus && isFocused ? '' : placeholder}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            // 모바일에서 입력 완료 후 확대된 화면을 원래대로 복원
            if (window.visualViewport) {
              window.scrollTo(0, 0);
            }
            onBlur?.(e);
          }}
          value={showLastChar && type === 'password' ? maskedValue : value}
          onChange={handleChange}
          type={showLastChar && type === 'password' ? 'text' : type}
          inputMode={inputMode}
          disabled={disabled}
        />

        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>

      {error ? (
        <div className="mt-2 ml-2 flex items-center gap-1">
          {showErrorIcon && <img src={errorIcon} alt="error" className="w-3 h-3" />}
          <p className="text-xs text-red-500">{error}</p>
        </div>
      ) : helperText ? (
        <p className="mt-2 ml-2 text-xs text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
