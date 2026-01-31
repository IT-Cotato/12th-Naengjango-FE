import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { onboarding } from '@/assets';

export default function OnboardingPage() {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className="min-h-dvh flex flex-col justify-end items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${onboarding})` }}
    >
      <div className="w-full px-5 mb-10 text-center">
        <p className="Bold_24 text-accent-darkblue">냉잔고에서</p>
        <p className="Bold_24 text-accent-darkblue">충동 소비를 멈춰보세요!</p>
      </div>

      <div className="w-full px-5 pb-10">
        <Button onClick={handleGoLogin}>로그인</Button>
      </div>
    </div>
  );
}

