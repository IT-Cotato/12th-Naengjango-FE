import { useMemo, useState } from 'react';
import SignupHeader from '@/components/signup/SignupHeader';
import Button from '@/components/common/Button';

import StepName from './step/StepName';
import StepPhone from './step/StepPhone';
import StepVerify from './step/StepVerify';
import StepId from './step/StepId';
import StepPassword from './step/StepPassword';
import StepPasswordVerify from './step/StepPasswordVerify';

type Step = 'name' | 'phone' | 'verify' | 'id' | 'password' | 'passwordVerify';

const STEP_ORDER: Step[] = ['name', 'phone', 'verify', 'id', 'password', 'passwordVerify'];
const hideBackSteps: Step[] = ['id', 'password', 'passwordVerify'];

export default function SignupPage() {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verify, setVerify] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [passwordVerifyError, setPasswordVerifyError] = useState<string | undefined>(undefined);
  const stepIndex = STEP_ORDER.indexOf(step);
  const showBack = !hideBackSteps.includes(step);
  const isPasswordMatched = passwordVerify.trim().length > 0 && !passwordVerifyError;
  // 인증번호 보냈는지 여부
  const [isVerifySent, setIsVerifySent] = useState(false);
  const [verifyTimerKey, setVerifyTimerKey] = useState(0);
  // 인증번호 인증완료 여부
  const [isVerifyDone, setIsVerifyDone] = useState(false);
  // 아이디 중복확인 여부
  const [isIdChecked, setIsIdChecked] = useState(false);

  const requestSms = () => {
    // 인증번호 발송 API (나중에)
    setIsVerifySent(true);
    setIsVerifyDone(false);
    setVerifyTimerKey((k) => k + 1); // 타이머 리셋
    setStep('verify');
  };

  const goNext = () => {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) setStep(next);
    else {
      // 가입 요청 API (나중에)
    }
  };

  // 첫 화면이면 undefined 반환 → SignupHeader에서 navigate(-1)
  const goBack = stepIndex > 0 ? () => setStep(STEP_ORDER[stepIndex - 1]) : undefined;

  const onClose = () => {};

  // '다음' 버튼 활성화 조건
  const canNext = useMemo(() => {
    switch (step) {
      case 'name':
        return name.trim().length > 0;
      case 'phone':
        return false;
      case 'verify':
        return isVerifyDone;
      case 'id':
        return isIdChecked;
      case 'password':
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/.test(
          password.trim(),
        );
      case 'passwordVerify':
        return !passwordVerifyError && passwordVerify.trim().length > 0;
      default:
        return false;
    }
  }, [
    step,
    name,
    phone,
    verify,
    id,
    password,
    passwordVerify,
    passwordVerifyError,
    isVerifyDone,
    isVerifySent,
    verifyTimerKey,
    isIdChecked,
  ]);

  // 현재 'step'에 맞는 컨텐츠 렌더링
  const content = useMemo(() => {
    if (step === 'name') {
      return (
        <>
          <StepName value={name} onChange={setName} />
        </>
      );
    }

    if (step === 'phone') {
      return (
        <>
          <StepPhone
            value={phone}
            onChange={setPhone}
            onRequestVerify={requestSms}
            isVerifySent={isVerifySent}
          />
          <StepName value={name} onChange={setName} disabled />
        </>
      );
    }

    if (step === 'verify') {
      return (
        <>
          <StepVerify
            value={verify}
            onChange={setVerify}
            timerKey={verifyTimerKey}
            onVerifiedChange={setIsVerifyDone}
          />
          <StepPhone
            value={phone}
            onChange={setPhone}
            onRequestVerify={requestSms}
            isVerifySent={true}
            disabled={true}
            hideActionButton={isVerifyDone}
          />
          <StepName value={name} onChange={setName} disabled />
        </>
      );
    }

    if (step === 'id') {
      return (
        <>
          <StepId value={id} onChange={setId} onValidChange={setIsIdChecked} />
          <StepPhone value={phone} onChange={setPhone} disabled />
          <StepName value={name} onChange={setName} disabled />
        </>
      );
    }

    if (step === 'password') {
      return (
        <>
          <StepPassword value={password} onChange={setPassword} />
          <StepId value={id} onChange={setId} disabled showHelperText={false} />
          <StepPhone value={phone} onChange={setPhone} disabled />
          <StepName value={name} onChange={setName} disabled />
        </>
      );
    }

    // 마지막 단계
    return (
      <>
        <StepPasswordVerify
          password={password}
          value={passwordVerify}
          onChange={setPasswordVerify}
          onErrorChange={setPasswordVerifyError}
        />
        <StepPassword
          value={password}
          onChange={setPassword}
          showHelperText={false}
          isequalError={!!passwordVerifyError}
          success={isPasswordMatched}
        />
        <StepId value={id} onChange={setId} disabled showHelperText={false} />
        <StepPhone value={phone} onChange={setPhone} disabled />
        <StepName value={name} onChange={setName} disabled />
      </>
    );
  }, [
    step,
    name,
    phone,
    verify,
    id,
    password,
    passwordVerify,
    passwordVerifyError,
    verifyTimerKey,
    isVerifySent,
    isVerifyDone,
  ]);

  return (
    <div className="min-h-dvh bg-white">
      <div className="px-5 pt-6">
        <SignupHeader onBack={goBack} onClose={onClose} showBack={showBack} />
      </div>

      {/* 헤더 아래 컨텐츠 영역*/}
      <main className="px-5 pt-17.5 pb-28">
        <h1 className="text-center text-2xl font-bold text-gray-800">회원가입</h1>

        <div className="mt-6">{content}</div>
      </main>

      {/* 다음 버튼 고정 */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-5 pb-6 pt-3">
        <Button disabled={!canNext} onClick={goNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
