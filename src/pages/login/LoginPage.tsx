import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { google } from '@/assets';
import { Link } from 'react-router-dom';
import { login } from '@/apis/members/login';

export default function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
  const isPasswordValid = password.length === 0 || passwordRegex.test(password);

  const handleLogin = async () => {
    if (!id.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await login({
        loginId: id.trim(),
        password: password.trim(),
      });

      if (response.isSuccess && response.result) {
        // 토큰 저장
        localStorage.setItem('accessToken', response.result.accessToken);
        localStorage.setItem('refreshToken', response.result.refreshToken);

        // 첫 로그인 여부 확인 
        const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
        
        // signupCompleted와 isFirstLogin 모두 확인
        // isFirstLogin이 true이거나 signupCompleted가 false이면 예산 설정 페이지로
        // TODO: signupCompleted 확인 필요
        if (isFirstLogin || !response.result.signupCompleted) {
          navigate('/setup');
        } else {
          navigate('/home');
        }
      } else {
        throw new Error(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google 로그인 (나중에)
    console.log('Google 로그인');
  };

  return (
    <div className="min-h-dvh bg-white">

      <main className="px-5 pt-35 pb-28">
        <h1 className="text-center text-2xl font-bold text-gray-800">로그인</h1>
        <div className="mt-8 flex flex-col gap-4">
          <Input
            placeholder="아이디"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setError(undefined);
            }}
            grayBg
            error={error}
          />
          <Input
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(undefined);
            }}
            grayBg
            error={!isPasswordValid ? '영문, 숫자, 특수문자 포함 8~20자' : undefined}
            helperText={isPasswordValid ? '영문, 숫자, 특수문자 포함 8~20자' : undefined}
          />
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
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
