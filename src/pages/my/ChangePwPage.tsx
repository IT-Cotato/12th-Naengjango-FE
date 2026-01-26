import { useState, useMemo } from 'react';
import { back, close, errorIcon } from '@/assets';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function ChangePwPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'current' | 'new' | 'complete'>('current');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const name = '냉잔고';

  // 현재 비밀번호 검증
  const currentPasswordTrimmed = currentPassword.trim();
  const isCurrentPasswordValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/.test(
      currentPasswordTrimmed,
    );
  const currentPasswordError =
    currentPasswordTrimmed.length > 0 && !isCurrentPasswordValid
      ? '영문, 숫자, 특수문자 포함 8~20자'
      : undefined;

  const currentPasswordErrorNode = useMemo(() => {
    if (!currentPasswordError) return undefined;
    return (
      <span className="flex items-center gap-1">
        <img src={errorIcon} alt="error" className="h-3 w-3" />
        {currentPasswordError}
      </span>
    );
  }, [currentPasswordError]);

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

  const newPasswordErrorNode = useMemo(() => {
    if (!newPasswordError) return undefined;
    return (
      <span className="flex items-center gap-1">
        <img src={errorIcon} alt="error" className="h-3 w-3" />
        {newPasswordError}
      </span>
    );
  }, [newPasswordError]);

  // 비밀번호 확인 검증
  const confirmPasswordTrimmed = confirmPassword.trim();
  const passwordMatchError =
    confirmPasswordTrimmed.length > 0 && confirmPasswordTrimmed !== newPasswordTrimmed
      ? '비밀번호가 일치하지 않습니다'
      : undefined;

  const passwordMatchErrorNode = useMemo(() => {
    if (!passwordMatchError) return undefined;
    return (
      <span className="flex items-center gap-1">
        <img src={errorIcon} alt="error" className="h-3 w-3" />
        {passwordMatchError}
      </span>
    );
  }, [passwordMatchError]);

  const isPasswordsMatch =
    confirmPasswordTrimmed === newPasswordTrimmed && confirmPasswordTrimmed.length > 0;
  const canChangePassword = isNewPasswordValid && isPasswordsMatch;

  const handleCurrentPasswordConfirm = () => {
    if (isCurrentPasswordValid) {
      setStep('new');
    }
  };

  const handleChangePassword = () => {
    // 비밀번호 변경 API (나중에)
    console.log('비밀번호 변경:', { currentPassword, newPassword, confirmPassword });
    setStep('complete');
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
                    helperText={
                      !currentPasswordError ? '영문, 숫자, 특수문자 포함 8~20자' : undefined
                    }
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type="password"
                    showLastChar
                    error={currentPasswordErrorNode}
                    success={isCurrentPasswordValid && currentPasswordTrimmed.length > 0}
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
