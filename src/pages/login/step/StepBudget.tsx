import Input from '@/components/common/Input';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function StepBudget({ value, onChange }: Props) {
  // 숫자만 입력 가능
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    onChange(v);
  };

  // 천 단위 콤마 
  const formatNumber = (num: string) => {
    if (!num) return '';
    return Number(num).toLocaleString();
  };

  return (
    <div className="mt-4">
      <p className="mt-14 mb-2 text-[18px] text-[#000000]">한 달 예산을 입력하세요</p>
      <Input
        placeholder="ex) 600,000"
        value={formatNumber(value)}
        onChange={handleChange}
        rightSlot={<span className="text-gray-400"></span>}
      />
    </div>
  );
}

