import Input from '@/components/common/Input';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export default function StepName({ value, onChange, disabled }: Props) {
  return (
    <div className="mt-2">
      <Input
        label="이름"
        placeholder="이름을 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
