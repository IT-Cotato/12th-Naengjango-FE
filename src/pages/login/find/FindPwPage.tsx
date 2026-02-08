import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import AlertModal from '@/components/common/AlertModal';
import { findLoginPw } from '@/apis/members/signup';

export default function FindPwPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const canSubmit = name.trim().length > 0 && id.trim().length > 0 && phone.length === 11;

  const handlefindPw = async () => {
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await findLoginPw({
        name: name.trim(),
        loginId: id.trim(),
        phoneNumber: phone.replace(/\D/g, ''), // 숫자만 추출
      });

      if (response.isSuccess) {
        setIsModalOpen(true);
      } else {
        throw new Error(response.message || '비밀번호 찾기에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '비밀번호 찾기에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            onChange={(e) => {
              setName(e.target.value);
              setError(undefined);
            }}
            keepBlueBorder
            error={error}
          />
          <Input
            placeholder="아이디"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setError(undefined);
            }}
            keepBlueBorder
            error={error ? '' : undefined}
            showErrorIcon={false}
          />
          <Input
            placeholder="전화번호"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^0-9]/g, ''));
              setError(undefined);
            }}
            helperText="'-'를 제외한 전화번호만 입력"
            keepBlueBorder
            error={error ? '' : undefined}
            showErrorIcon={false}
          />
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <Button disabled={!canSubmit || isLoading} onClick={handlefindPw}>
            {isLoading ? '처리 중...' : '비밀번호 찾기'}
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
