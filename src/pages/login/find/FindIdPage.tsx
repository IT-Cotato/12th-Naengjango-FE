import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function FindIdPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundId, setFoundId] = useState<string | null>(null); // 결과 화면 전환용

  const canSubmit = name.trim().length > 0 && phone.length === 11;

  const handlefindId = () => {
    // Id 찾기 API 호출 (나중에)
    // 임시로 아이디 설정
    setFoundId('jan****26');
  };

  // 결과 화면
  if (foundId) {
    return (
      <div className="min-h-dvh bg-white">
        <div className="px-5 pt-6 h-24" />

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
      <div className="px-5 pt-6 h-24" />

      <main className="px-5 pt-17.5 pb-28">
        <h1 className="text-center text-2xl font-bold text-gray-800">아이디 찾기</h1>

        <div className="mt-8 flex flex-col gap-4">
          <Input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Button disabled={!canSubmit} onClick={handlefindId}>
            아이디 찾기
          </Button>
        </div>
      </main>
    </div>
  );
}
