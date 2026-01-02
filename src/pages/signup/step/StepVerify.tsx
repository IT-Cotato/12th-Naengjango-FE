import { verified } from '@/assets';
import Input from '@/components/common/Input';
import InputActionButton from '@/components/signup/InputActionButton';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  timerKey?: string | number;
  onVerifiedChange?: (verified: boolean) => void;
};

const TOTAL = 5 * 60;

export default function StepVerify({
  value,
  onChange,
  disabled,
  timerKey,
  onVerifiedChange,
}: Props) {
  const digits = value.replace(/\D/g, '');
  const [secondsLeft, setSecondsLeft] = useState(TOTAL);
  const [isVerified, setIsVerified] = useState(false);

  const isExpired = secondsLeft <= 0;

  // 재전송되면 타이머 초기화
  useEffect(() => {
    setSecondsLeft(TOTAL);
    setIsVerified(false);
    onVerifiedChange?.(false);
  }, [timerKey, onVerifiedChange]);

  // 입력 바꾸면 인증완료 해제
  useEffect(() => {
    setIsVerified(false);
    onVerifiedChange?.(false);
  }, [digits, onVerifiedChange]);

  // 타이머
  useEffect(() => {
    if (disabled) return;
    if (secondsLeft <= 0) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [secondsLeft, disabled, isVerified]);

  const timeText = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }, [secondsLeft]);

  // 타이머 만료 후 인증 버튼 비활성화
  const canVerifyClick = !disabled && !isExpired && digits.length === 4 && !isVerified;

  const placeholder = isExpired ? '인증번호를 재전송하세요' : '문자 발송된 인증번호를 입력하세요';

  const handleVerifyClick = () => {
    if (!canVerifyClick) return;
    setIsVerified(true);
    onVerifiedChange?.(true);
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between px-2">
        <span className="text-[15px] text-gray-400 mb-1">인증번호</span>
        <span className={`text-[15px] text-gray-400`}>{timeText}</span>
      </div>

      <Input
        placeholder={placeholder}
        hidePlaceholderOnFocus={!isExpired}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rightSlot={
          isVerified ? (
            <img src={verified} alt="verified" className="h-6 w-6" />
          ) : (
            <InputActionButton disabled={!canVerifyClick} onClick={handleVerifyClick}>
              인증
            </InputActionButton>
          )
        }
      />
    </div>
  );
}
