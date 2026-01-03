import { verified } from '@/assets';
import Input from '@/components/common/Input';
import InputActionButton from '@/components/signup/InputActionButton';
import { useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onValidChange?: (valid: boolean) => void;
  showHelperText?: boolean;
};

export default function StepId({
  value,
  onChange,
  disabled,
  onValidChange,
  showHelperText = true,
}: Props) {
  const id = value.trim();
  const [isChecked, setIsChecked] = useState(false);
  const isValid = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,16}$/.test(id);
  const error = id.length > 0 && !isValid ? '영문, 숫자 포함 8~16자' : undefined;

  // 입력 바뀌면 중복확인 초기화
  useEffect(() => {
    setIsChecked(false);
    onValidChange?.(false);
  }, [id, onValidChange]);

  // 중복확인 완료되어야 유효
  useEffect(() => {
    onValidChange?.(!disabled && isValid && isChecked);
  }, [disabled, isValid, isChecked, onValidChange]);

  const canCheck = !disabled && isValid;

  const handleCheckDup = () => {
    // 중복확인 api (나중에)
    setIsChecked(true);
  };

  return (
    <div className="mt-2">
      <Input
        label="아이디"
        placeholder="아이디를 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={error}
        helperText={showHelperText ? '영문, 숫자 포함 8~16자' : undefined}
        rightSlot={
          disabled ? null : isChecked ? (
            <img src={verified} alt="verified" className="h-6 w-6" />
          ) : (
            <InputActionButton disabled={!canCheck} onClick={handleCheckDup}>
              중복확인
            </InputActionButton>
          )
        }
      />
    </div>
  );
}
