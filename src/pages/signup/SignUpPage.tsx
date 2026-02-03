import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupHeader from '@/components/signup/SignupHeader';
import Button from '@/components/common/Button';
import TermsAgreementModal, { type Term } from '@/components/signup/TermsAgreementModal';
import { signup, sendSms } from '@/apis/members/signup';

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
  const navigate = useNavigate();
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
  // 약관 동의 모달 표시 여부
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  // 전화번호 인증 에러
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);

  // 약관 목록
  const terms: Term[] = [
    {
      id: 'all',
      label: '약관 전체 동의',
      required: false,
      content: '',
    },
    {
      id: 'terms',
      label: '이용 약관 동의',
      required: true,
      content: '이용 약관 동의 설명\n\n여기에 실제 이용 약관 내용이 들어갑니다.',
    },
    {
      id: 'privacy',
      label: '개인정보 수집 및 이용 동의',
      required: true,
      content: '개인정보 수집 및 이용 동의 설명\n\n여기에 실제 개인정보 수집 및 이용 동의 내용이 들어갑니다.',
    },
    {
      id: 'sms',
      label: 'SMS 알림 허용',
      required: false,
      content: 'SMS 알림 허용 설명\n\n여기에 실제 SMS 알림 허용 내용이 들어갑니다.',
    },
  ];

  const requestSms = async () => {
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) return;

    setPhoneError(undefined); 

    try {
      const response = await sendSms({ phoneNumber: phoneDigits });
      
      // 응답이 성공이 아니면 에러 처리
      if (!response.isSuccess) {
        const errorMessage = response.message || response.result || '인증번호 발송에 실패했습니다.';
        throw new Error(errorMessage);
      }
      
      setIsVerifySent(true);
      setIsVerifyDone(false);
      setVerifyTimerKey((k) => k + 1); // 타이머 리셋
      setPhoneError(undefined); // 성공 시 에러 제거
      setStep('verify');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '인증번호 발송에 실패했습니다.';
      
      if (
        errorMessage.includes('이미 가입된') ||
        errorMessage.includes('가입된 휴대폰') ||
        errorMessage.includes('휴대폰 번호')
      ) {
        setPhoneError('이미 가입된 전화번호입니다.');
      } else {
        setPhoneError(errorMessage);
      }
    }
  };

  const goNext = () => {
    // 비밀번호 확인 단계에서 다음 버튼을 누르면 약관 동의 모달 표시
    if (step === 'passwordVerify') {
      setIsTermsModalOpen(true);
      return;
    }

    const next = STEP_ORDER[stepIndex + 1];
    if (next) setStep(next);
    else {
      // 가입 요청 API (나중에)
    }
  };

  // 약관 동의 완료 후 처리
  const handleTermsConfirm = async (agreedTerms: {
    terms: boolean;
    privacy: boolean;
    sms: boolean;
  }) => {
    try {
      // 약관 동의 id 배열 생성 
      const agreedAgreementIds: number[] = [];
      if (agreedTerms.terms) agreedAgreementIds.push(1);
      if (agreedTerms.privacy) agreedAgreementIds.push(2);
      if (agreedTerms.sms) agreedAgreementIds.push(3);

      // 회원가입 데이터 저장 
      const signupData = {
        name: name.trim(),
        phoneNumber: phone.replace(/\D/g, ''), // 숫자만 추출
        loginId: id.trim(),
        password: password.trim(),
        agreedAgreementIds,
      };

      // 예산 없이 우선 회원가입
      const response = await signup(signupData);

      if (response.isSuccess) {
        setIsTermsModalOpen(false);
        navigate('/onboarding');
      } else {
        throw new Error(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
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
            onChange={(v) => {
              setPhone(v);
              setPhoneError(undefined); 
            }}
            onRequestVerify={requestSms}
            isVerifySent={isVerifySent}
            error={phoneError}
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
            phoneNumber={phone}
          />
          <StepPhone
            value={phone}
            onChange={(v) => {
              setPhone(v);
              setPhoneError(undefined); 
            }}
            onRequestVerify={requestSms}
            isVerifySent={true}
            disabled={true}
            hideActionButton={isVerifyDone}
            error={phoneError}
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
    phoneError,
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

      {/* 약관 동의 모달 */}
      <TermsAgreementModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onConfirm={handleTermsConfirm}
        terms={terms}
      />
    </div>
  );
}
