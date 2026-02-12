import Input from '@/components/common/Input';
import { useEffect } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onValidChange?: (valid: boolean) => void;
  showHelperText?: boolean;
  isequalError?: boolean;
  success?: boolean;
};

export default function StepPassword({
  value,
  onChange,
  disabled,
  onValidChange,
  showHelperText = true,
  isequalError = false,
  success = false,
}: Props) {
  const password = value.trim();

  const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/.test(
    password,
  );
  const error = isequalError
    ? ' '
    : password.length > 0 && !isValid
      ? '영문, 숫자, 특수문자 포함 8~20자'
      : undefined;

  useEffect(() => {
    onValidChange?.(!disabled && isValid);
  }, [disabled, isValid, onValidChange]);

  return (
    <div className="mt-2">
      <Input
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={error}
        helperText={showHelperText ? '영문, 숫자, 특수문자 포함 8~20자' : undefined}
        success={success}
        showErrorIcon={false}
      />
    </div>
  );
}
