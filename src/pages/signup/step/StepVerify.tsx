import { verified } from '@/assets';
import Input from '@/components/common/Input';
import InputActionButton from '@/components/signup/InputActionButton';
import { useEffect, useMemo, useState } from 'react';
import { verifySms } from '@/apis/members/signup';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  timerKey?: string | number;
  onVerifiedChange?: (verified: boolean) => void;
  onVerifiedCode?: (code: string) => void; // 인증 완료된 코드 전달
  phoneNumber: string; 
};

const TOTAL = 5 * 60;

export default function StepVerify({
  value,
  onChange,
  disabled,
  timerKey,
  onVerifiedChange,
  onVerifiedCode,
  phoneNumber,
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

  // 입력 바꾸면 인증완료 해제 (인증 완료 전에만)
  useEffect(() => {
    if (isVerified) return; // 이미 인증 완료되었으면 무시
    setIsVerified(false);
    onVerifiedChange?.(false);
  }, [digits, isVerified, onVerifiedChange]);

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | undefined>(undefined);

  const placeholder = isExpired ? '인증번호를 재전송하세요' : '문자 발송된 인증번호를 입력하세요';

  const handleVerifyClick = async () => {
    if (!canVerifyClick || isVerifying) return;

    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 11 || digits.length !== 4) return;

    setIsVerifying(true);
    setVerifyError(undefined);

    try {
      const response = await verifySms({
        phoneNumber: phoneDigits,
        verifyCode: digits,
      });

      if (response.isSuccess) {
        setIsVerified(true);
        setVerifyError(undefined);
        onVerifiedChange?.(true);
        console.log('인증 완료, 코드 저장:', digits);
        onVerifiedCode?.(digits); // 인증 완료된 코드 전달
      } else {
        setIsVerified(false);
        setVerifyError('인증번호가 일치하지 않습니다');
        onVerifiedChange?.(false);
      }
    } catch (error) {
      setIsVerified(false);
      const errorMessage = error instanceof Error ? error.message : '인증번호 검증에 실패했습니다.';
      
      if (errorMessage.includes('일치하지 않') || errorMessage.includes('불일치')) {
        setVerifyError('인증번호가 일치하지 않습니다');
      } else {
        setVerifyError(errorMessage);
      }
      onVerifiedChange?.(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between px-2">
        <span className="text-[15px] text-gray-400 mb-1">인증번호</span>
        <span className={`text-[15px] text-gray-400`}>{timeText}</span>
      </div>

      <Input
        placeholder={placeholder}
        inputMode="numeric"
        hidePlaceholderOnFocus={!isExpired}
        value={value}
        onChange={(e) => {
          // 인증 완료되면 입력 변경 불가
          if (isVerified) return;
          onChange(e.target.value);
          // 입력 바뀌면 에러 초기화
          setVerifyError(undefined);
        }}
        disabled={disabled || isVerified}
        error={verifyError}
        rightSlot={
          isVerified ? (
            <img src={verified} alt="verified" className="h-6 w-6" />
          ) : (
            <InputActionButton
              disabled={!canVerifyClick || isVerifying}
              onClick={handleVerifyClick}
            >
              {isVerifying ? '확인 중...' : '인증'}
            </InputActionButton>
          )
        }
      />
    </div>
  );
}
