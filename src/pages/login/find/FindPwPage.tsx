import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import AlertModal from '@/components/common/AlertModal';

export default function FindPwPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canSubmit = name.trim().length > 0 && id.trim().length > 0 && phone.length === 11;

  const handlefindPw = () => {
    // Pw 찾기 API 호출 (나중에)
    // 성공 시 모달 열기
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-dvh bg-white">
      <div className="px-5 pt-6 h-24" />

      <main className="px-5 pt-17.5 pb-28">
        <h1 className="text-center text-2xl font-bold text-gray-800">비밀번호 찾기</h1>

        <div className="mt-8 flex flex-col gap-4">
          <Input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            keepBlueBorder
          />
          <Input
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            keepBlueBorder
          />
          <Input
            placeholder="전화번호"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
            helperText="'-'를 제외한 전화번호만 입력"
            keepBlueBorder
          />
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <Button disabled={!canSubmit} onClick={handlefindPw}>
            비밀번호 찾기
          </Button>
        </div>
      </main>

      {/* 모달 */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="임시 비밀번호를 발송했습니다"
        message="메세지함을 확인하세요."
        className="h-[134px]"
        buttonClassName="h-[44px]"
      />
    </div>
  );
}
