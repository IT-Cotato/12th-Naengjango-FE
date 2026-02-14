import { useState, useEffect } from 'react';
import { back, close } from '@/assets';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { getMe, changePassword } from '@/apis/my/mypage';

export default function ChangePwPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'current' | 'new' | 'complete'>('current');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    getMe(accessToken)
      .then((res) => {
        if (res.result?.name) setName(res.result.name);
      })
      .catch((error) => {
        console.error('내 정보 조회에 실패했습니다:', error);
      });
  }, []);

  // 현재 비밀번호 검증 (8자 이상만)
  const currentPasswordTrimmed = currentPassword.trim();
  const isCurrentPasswordValid = currentPasswordTrimmed.length >= 8;

  // 새 비밀번호 검증
  const newPasswordTrimmed = newPassword.trim();
  const isNewPasswordValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/.test(
      newPasswordTrimmed,
    );
  const newPasswordError =
    newPasswordTrimmed.length > 0 && !isNewPasswordValid
      ? '영문, 숫자, 특수문자 포함 8~20자'
      : undefined;

  const newPasswordErrorNode = newPasswordError;

  // 비밀번호 확인 검증
  const confirmPasswordTrimmed = confirmPassword.trim();
  const passwordMatchError =
    confirmPasswordTrimmed.length > 0 && confirmPasswordTrimmed !== newPasswordTrimmed
      ? '비밀번호가 일치하지 않습니다'
      : undefined;

  const passwordMatchErrorNode = passwordMatchError;

  const isPasswordsMatch =
    confirmPasswordTrimmed === newPasswordTrimmed && confirmPasswordTrimmed.length > 0;
  const canChangePassword = isNewPasswordValid && isPasswordsMatch;

  const handleCurrentPasswordConfirm = () => {
    if (isCurrentPasswordValid) {
      setStep('new');
    }
  };

  const handleChangePassword = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    changePassword(
      { currentPassword, newPassword, newPasswordConfirm: confirmPassword },
      accessToken,
    )
      .then(() => {
        setStep('complete');
      })
      .catch((e) => {
        console.error('비밀번호 변경 실패:', e instanceof Error ? e.message : e);
      });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-dvh bg-white">
      <header className="flex h-18 items-center justify-between px-6 pt-4 shrink-0">
        <button type="button" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => navigate('/my/member-info')}>
          <img src={close} alt="close" className="flex h-6 w-6 items-center justify-center" />
        </button>
      </header>
      <div className="flex flex-col items-center justify-center pt-22">
        <h1 className="Bold_24 text-gray-800">
          {step === 'complete' ? '비밀번호 변경 완료' : '비밀번호 변경'}
        </h1>
      </div>
      {step === 'complete' ? (
        <div className="flex flex-col items-center justify-center pt-14 px-7">
          <p className="SemiBold_20 text-gray-400 text-center whitespace-pre-line">
            {`${name}님의 비밀번호가\n변경되었습니다`}
          </p>
          <div className="mt-12 w-full">
            <Button onClick={handleGoHome}>홈으로 이동</Button>
          </div>
        </div>
      ) : (
        <div className="px-7 pt-8 pb-28">
          <div className="flex flex-col">
            {step === 'current' ? (
              <>
                <div className="mb-2">
                  <Input
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type="password"
                    showLastChar
                    success={isCurrentPasswordValid}
                  />
                </div>
                {/* 레이아웃 맞추기용 인풋 (투명 처리, 높이만 동일하게) */}
                <div className="mt-2">
                  <Input
                    className="opacity-0 pointer-events-none select-none"
                    placeholder="새 비밀번호 확인"
                    value=""
                    onChange={() => {}}
                    type="password"
                    showLastChar
                    error={undefined}
                    success={false}
                  />
                  {/* 헬퍼텍스트 공간 확보 */}
                  <p className="mt-2 ml-2 text-xs text-gray-400 invisible">
                    영문, 숫자, 특수문자 포함 8~20자
                  </p>
                </div>
                <div className="mt-8">
                  <Button disabled={!isCurrentPasswordValid} onClick={handleCurrentPasswordConfirm}>
                    확인
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <Input
                    placeholder="새 비밀번호"
                    helperText={!newPasswordError ? '영문, 숫자, 특수문자 포함 8~20자' : undefined}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    showLastChar
                    error={newPasswordErrorNode}
                    success={isNewPasswordValid && newPasswordTrimmed.length > 0}
                  />
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="새 비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    showLastChar
                    error={passwordMatchErrorNode}
                    success={isPasswordsMatch}
                  />
                  {/* 헬퍼텍스트 공간 확보 */}
                  {!passwordMatchError && (
                    <p className="mt-2 ml-2 text-xs text-gray-400 invisible">
                      영문, 숫자, 특수문자 포함 8~20자
                    </p>
                  )}
                </div>
                <div className="mt-8">
                  <Button disabled={!canChangePassword} onClick={handleChangePassword}>
                    비밀번호 변경
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
