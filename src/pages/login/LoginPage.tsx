import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { google } from '@/assets';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
  const isPasswordValid = password.length === 0 || passwordRegex.test(password);

  const handleLogin = () => {
    // 로그인 API 호출 (나중에)
    console.log('로그인 시도:', { id, password });
  };

  const handleGoogleLogin = () => {
    // Google 로그인 (나중에)
    console.log('Google 로그인');
  };

  return (
    <div className="min-h-dvh bg-white">
      <div className="px-5 pt-6 h-24" />

      <main className="px-5 pt-17.5 pb-28">
        <h1 className="text-center text-2xl font-bold text-gray-800">로그인</h1>
        <div className="mt-8 flex flex-col gap-4">
          <Input placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} grayBg />
          <Input
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            grayBg
            error={!isPasswordValid ? '영문, 숫자, 특수문자 포함 8~20자' : undefined}
            helperText={isPasswordValid ? '영문, 숫자, 특수문자 포함 8~20자' : undefined}
          />
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={handleLogin}>로그인</Button>
          <Button
            onClick={handleGoogleLogin}
            className="bg-white-600 text-gray-800  border-gray-400 border-[1.5px] "
          >
            <span className="flex items-center justify-center gap-2">
              <img src={google} alt="Google" className="h-6 w-6" />
              <span className="text-gray-800 text-base font-semibold">Google 로그인</span>
            </span>
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-300">
          <Link to="/signup" className="hover:text-gray-600">
            회원가입
          </Link>
          <span>|</span>
          <Link to="/find-id" className="hover:text-gray-600">
            아이디 찾기
          </Link>
          <span>|</span>
          <Link to="/find-pw" className="hover:text-gray-600">
            비밀번호 찾기
          </Link>
        </div>
      </main>
    </div>
  );
}
