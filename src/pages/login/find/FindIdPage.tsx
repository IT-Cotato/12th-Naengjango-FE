import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { findLoginId } from '@/apis/members/signup';
import { back } from '@/assets';

export default function FindIdPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundId, setFoundId] = useState<string | null>(null); // 결과 화면 전환용
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const canSubmit = name.trim().length > 0 && phone.length === 11;

  const clearError = () => setError(undefined);

  const handlefindId = async () => {
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await findLoginId({
        name: name.trim(),
        phoneNumber: phone.replace(/\D/g, ''), // 숫자만 추출
      });

      if (!response.result?.loginId) {
        throw new Error(response.message || '아이디를 찾을 수 없습니다.');
      }
      setFoundId(response.result.loginId);
    } catch (error) {
      setError('회원 정보가 일치하지 않습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 결과 화면
  if (foundId) {
    return (
      <div className="min-h-dvh bg-white">
        <header className="flex h-16 items-center px-5 pt-4">
          <button type="button" onClick={() => navigate(-1)}>
            <img src={back} alt="back" className="h-6 w-6" />
          </button>
        </header>

        <main className="px-5 pt-17.5 pb-28">
          <h1 className="text-center text-2xl font-bold text-gray-800">아이디 찾기</h1>

          <div className="mt-8 text-center">
            <p className="text-[20px] text-gray-400 text-semibold">{name}님의 아이디는</p>
            <p className="text-[20px] font-semibold text-gray-800">{foundId}</p>
            <p className="text-[20px] text-gray-400 text-semibold">입니다.</p>
          </div>

          <div className="mt-12 flex flex-col gap-3">
            <Button onClick={() => navigate('/login')}>로그인</Button>
            <Button onClick={() => navigate('/find-pw')}>비밀번호 찾기</Button>
          </div>
        </main>
      </div>
    );
  }

  // 입력 화면
  return (
    <div className="min-h-dvh bg-white">
      <header className="flex h-18 items-center px-5 pt-6">
        <button type="button" onClick={() => navigate(-1)}>
          <img src={back} alt="back" className="h-6 w-6" />
        </button>
      </header>

      <main className="px-5 pt-17.5 pb-28">
        <h1 className="text-center text-2xl font-bold text-gray-800">아이디 찾기</h1>

        <div className="mt-8 flex flex-col gap-4">
          <Input
            placeholder="이름"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError();
            }}
            keepBlueBorder
            hasError={!!error}
          />
          <Input
            placeholder="전화번호"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^0-9]/g, ''));
              clearError();
            }}
            helperText={error ? undefined : "'-'를 제외한 전화번호만 입력"}
            error={error}
            keepBlueBorder
            showErrorIcon={true}
          />
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <Button disabled={!canSubmit || isLoading} onClick={handlefindId}>
            {isLoading ? '찾는 중...' : '아이디 찾기'}
          </Button>
        </div>
      </main>
    </div>
  );
}
