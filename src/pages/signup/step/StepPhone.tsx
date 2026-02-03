import Input from '@/components/common/Input';
import InputActionButton from '@/components/signup/InputActionButton';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onRequestVerify?: () => void;
  isVerifySent?: boolean;
  hideActionButton?: boolean;
  error?: string; // 에러 메시지
};

export default function StepPhone({
  value,
  onChange,
  disabled,
  onRequestVerify,
  isVerifySent = false,
  hideActionButton = false,
  error,
}: Props & { isVerifySent?: boolean }) {
  const digits = value.replace(/\D/g, '');
  const canRequest = digits.length === 11;

  return (
    <div className="mt-2">
      <Input
        label="전화번호"
        placeholder="'-'를 제외한 숫자만 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={error}
        rightSlot={
          onRequestVerify && !hideActionButton ? (
            <InputActionButton disabled={!canRequest} onClick={onRequestVerify}>
              {isVerifySent ? '재전송' : '인증'}
            </InputActionButton>
          ) : null
        }
      />
    </div>
  );
}
