import Input from '@/components/common/Input';
import { useEffect, useMemo } from 'react';
import { errorIcon } from '@/assets';

type Props = {
  password: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onErrorChange?: (error?: string) => void;
};

export default function StepPasswordVerify({
  password,
  value,
  onChange,
  disabled,
  onErrorChange,
}: Props) {
  const verify = value.trim();

  const error =
    verify.length === 0
      ? undefined
      : verify !== password.trim()
        ? '비밀번호가 일치하지 않습니다'
        : undefined;

  useEffect(() => {
    onErrorChange?.(error);
  }, [error, onErrorChange]);

  const errorNode = useMemo(() => {
    if (!error) return undefined;
    return (
      <span className="flex items-center gap-1">
        <img src={errorIcon} alt="error" className="h-3 w-3" />
        {error}
      </span>
    );
  }, [error]);

  return (
    <div className="mt-2">
      <Input
        label="비밀번호 확인"
        placeholder="비밀번호를 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={errorNode}
      />
    </div>
  );
}
