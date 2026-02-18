import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { google } from '@/assets';
import { Link } from 'react-router-dom';
import { login, getGoogleLoginUrl } from '@/apis/members/login';
import { getMe } from '@/apis/my/mypage';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // 구글 OAuth 콜백 처리: /login?accessToken=...&refreshToken=...&signupCompleted=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const signupCompleted = params.get('signupCompleted');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      window.history.replaceState({}, '', '/login');

      // signupCompleted가 false면 전화번호 확인 후 /setup 또는 /login/verify-phone으로
      if (signupCompleted === 'false' || signupCompleted === '0') {
        // 전화번호 확인
        getMe(accessToken)
          .then((response) => {
            if (response.isSuccess && response.result) {
              // 전화번호가 없거나 비어있으면 전화번호 인증 페이지로
              if (!response.result.phoneNumber || response.result.phoneNumber.trim() === '') {
                navigate('/login/verify-phone');
              } else {
                // 전화번호가 있으면 바로 /setup으로
                navigate('/setup');
              }
            } else {
              // 사용자 정보 조회 실패 시 일단 /setup으로 (백엔드가 전화번호 없으면 에러 처리)
              navigate('/setup');
            }
          })
          .catch(() => {
            // 에러 발생 시 일단 /setup으로
            navigate('/setup');
          });
      } else {
        navigate('/');
      }
    }
  }, [location.search, navigate]);

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

        // 임시비번으로 로그인한 경우 바로 비밀번호 변경 화면으로
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.trim());
        if (!hasSpecialChar) {
          navigate('/my/change-pw');
          return;
        }

        // 첫 로그인 여부 확인
        const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';

        if (isFirstLogin || !response.result.signupCompleted) {
          navigate('/setup');
        } else {
          navigate('/');
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
    // 현재 접속 주소(로컬이면 localhost, 배포면 배포 주소)를 백엔드에 전달
    // 백엔드가 이 redirect_uri를 사용해서 OAuth 후 해당 주소로 리다이렉트해야 함
    window.location.href = getGoogleLoginUrl(window.location.origin);
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
            hasError={!!error}
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
            error={error}
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
