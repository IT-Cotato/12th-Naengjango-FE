import { useState } from 'react';
import {
  house,
  manageFee,
  internet,
  utility,
  ott,
  music,
  cloud,
  delivery,
  transport,
  phone,
  exercise,
  familyoccasion,
  insurance,
  etc,
} from '@/assets';
import Input from '@/components/common/Input';
import Modal from '@/components/setup/SetupModal';

type FixCost = {
  id: string;
  amount: string;
};

type Props = {
  value: FixCost[];
  onChange: (v: FixCost[]) => void;
  budget: string;
};

// 카테고리 데이터
const CATEGORIES = {
  주거: [
    { id: 'rent', label: '월세', icon: house },
    { id: 'manageFee', label: '관리비', icon: manageFee },
    { id: 'internet', label: '인터넷', icon: internet },
    { id: 'utility', label: '공과금', icon: utility },
  ],
  구독: [
    { id: 'ott', label: 'OTT', icon: ott },
    { id: 'music', label: '음악', icon: music },
    { id: 'cloud', label: '클라우드', icon: cloud },
    { id: 'delivery', label: '배달앱', icon: delivery },
  ],
  생활: [
    { id: 'transport', label: '교통비', icon: transport },
    { id: 'phone', label: '통신비', icon: phone },
    { id: 'exercise', label: '운동', icon: exercise },
    { id: 'familyoccasion', label: '경조사', icon: familyoccasion },
    { id: 'insurance', label: '보험료', icon: insurance },
    { id: 'etc', label: '기타', icon: etc },
  ],
};

export default function StepFixCosts({ value, onChange, budget }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; label: string; icon: string } | null>(null);
  const [inputAmount, setInputAmount] = useState('');

  // 모달 열기
  const handleIconClick = (item: { id: string; label: string; icon: string }) => {
    const existing = value.find((v) => v.id === item.id);
    setSelectedItem(item);
    setInputAmount(existing?.amount || '');
    setModalOpen(true);
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    if (!selectedItem || !inputAmount) return;

    const existing = value.find((v) => v.id === selectedItem.id);
    if (existing) {
      // 수정
      onChange(value.map((v) => (v.id === selectedItem.id ? { ...v, amount: inputAmount } : v)));
    } else {
      // 추가
      onChange([...value, { id: selectedItem.id, amount: inputAmount }]);
    }
    setModalOpen(false);
    setSelectedItem(null);
    setInputAmount('');
  };

  // 삭제 버튼 클릭
  const handleRemove = () => {
    if (!selectedItem) return;
    onChange(value.filter((v) => v.id !== selectedItem.id));
    setModalOpen(false);
    setSelectedItem(null);
    setInputAmount('');
  };

  // 천 단위 콤마 포맷
  const formatNumber = (num: string) => {
    if (!num) return '0';
    return Number(num).toLocaleString();
  };

  // 총 고정지출 계산
  const totalFixCosts = value.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // 특정 아이템이 선택되었는지 + 금액
  const getItemData = (id: string) => value.find((v) => v.id === id);

  return (
    <div className="mt-4">
      <div className="text-center text-[20px] leading-8 tracking-tight">
        <span className="text-gray-800 font-semibold">한 달 예산은 </span>
        <span className="text-main-skyblue font-semibold">{formatNumber(budget)}원</span>
      </div>
      <div className="text-center text-[20px] leading-8 tracking-tight">
        <span className="text-gray-800 font-semibold">고정 지출은 </span>
        <span className="text-error font-semibold">{formatNumber(String(totalFixCosts))}원</span>
        <span className="text-gray-800 font-semibold">입니다.</span>
      </div>

      <p className="mt-8 mb-6 text-[18px] font-medium text-gray-800 text-center">
        고정 지출 카테고리를 선택해주세요
      </p>

      {/* 카테고리 목록 */}
      {Object.entries(CATEGORIES).map(([groupName, items]) => (
        <div key={groupName} >
          <p className="mb-2 text-[20px] font-semibold text-[#000000] ml-2">{groupName}</p>
          <div className="grid grid-cols-4 gap-y-4">
            {items.map((item) => {
              const itemData = getItemData(item.id);
              const isSelected = !!itemData;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleIconClick(item)}
                  className="flex h-28 flex-col items-center"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors
                      ${isSelected ? 'bg-main-skyblue' : 'bg-sub-skyblue'}`}
                  >
                    <img src={item.icon} alt={item.label} className="h-7 w-7" />
                  </div>
                  <span className="text-[14px] mt-1 font-medium text-[#000000]">
                    {item.label}
                  </span>
                  <span className={`text-[15px] font-normal ${isSelected ? 'text-error' : 'invisible'}`}>
                    {isSelected ? formatNumber(itemData.amount) : '0'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* 모달 */}
      {selectedItem && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          icon={selectedItem.icon}
          iconAlt={selectedItem.label}
          title={selectedItem.label}
          onSave={handleSave}
          onDelete={getItemData(selectedItem.id) ? handleRemove : undefined}
          saveDisabled={!inputAmount}
        >
          <Input
            placeholder="ex) 60,000"
            value={inputAmount ? formatNumber(inputAmount) : ''}
            onChange={(e) => setInputAmount(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </Modal>
      )}
    </div>
  );
}

