import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupHeader from '@/components/signup/SignupHeader';
import Button from '@/components/common/Button';
import StepPhone from '@/pages/signup/step/StepPhone';
import StepVerify from '@/pages/signup/step/StepVerify';
import TermsAgreementModal from '@/components/signup/TermsAgreementModal';
import { sendSms, updatePhone, agreeToTerms } from '@/apis/members/signup';
import { AGREEMENT_ID_MAP, TERMS } from '@/constants/terms';

type Step = 'phone' | 'verify';

export default function VerifyPhonePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [verify, setVerify] = useState('');
  const [isVerifySent, setIsVerifySent] = useState(false);
  const [verifyTimerKey, setVerifyTimerKey] = useState(0);
  const [isVerifyDone, setIsVerifyDone] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState<string>(''); // 인증 완료된 코드 저장
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const requestSms = async () => {
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) return;

    setPhoneError(undefined);

    try {
      const response = await sendSms({ phoneNumber: phoneDigits });

      if (!response.isSuccess) {
        const errorMessage = response.message || response.result || '인증번호 발송에 실패했습니다.';
        throw new Error(errorMessage);
      }

      setIsVerifySent(true);
      setIsVerifyDone(false);
      setVerifiedCode(''); // 재전송 시 인증 코드 초기화
      setVerifyTimerKey((k) => k + 1);
      setPhoneError(undefined);
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

  const handleComplete = async () => {
    if (!isVerifyDone || isSubmitting) {
      if (!verifiedCode) {
        console.error('인증 완료된 코드가 없습니다.');
        alert('인증번호를 다시 확인해주세요.');
      }
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('accessToken이 없습니다.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const phoneDigits = phone.replace(/\D/g, '');

      console.log('전화번호 저장 요청:', { phoneNumber: phoneDigits, verifyCode: verifiedCode });

      // 백엔드에 전화번호 저장 API 호출 (인증 완료된 verifyCode 사용)
      const response = await updatePhone(
        {
          phoneNumber: phoneDigits,
          verifyCode: verifiedCode,
        },
        accessToken,
      );

      if (response.isSuccess) {
        // 전화번호 저장 완료 후 약관 동의 모달 열기
        setIsSubmitting(false);
        setIsTermsModalOpen(true);
      } else {
        throw new Error(response.message || '전화번호 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('전화번호 저장 실패:', error);
      alert(error instanceof Error ? error.message : '전화번호 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 약관 동의 완료 후 처리
  const handleTermsConfirm = async (agreedTerms: {
    terms: boolean;
    privacy: boolean;
    sms: boolean;
  }) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('accessToken이 없습니다.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // 약관 동의 id 배열 생성 (동의한 것만)
      const agreements = (['terms', 'privacy', 'sms'] as const)
        .filter((key) => agreedTerms[key])
        .map((key) => ({
          agreementId: AGREEMENT_ID_MAP[key],
          agreed: true,
        }));

      const response = await agreeToTerms({ agreements }, accessToken);

      if (response.isSuccess) {
        setIsTermsModalOpen(false);
        // 약관 동의 완료 후 /setup으로 이동
        navigate('/setup');
      } else {
        throw new Error(response.message || '약관 동의에 실패했습니다.');
      }
    } catch (error) {
      console.error('약관 동의 실패:', error);
      alert(error instanceof Error ? error.message : '약관 동의에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = step === 'phone' ? undefined : () => setStep('phone');

  const content =
    step === 'phone' ? (
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
    ) : (
      <>
        <StepVerify
          value={verify}
          onChange={setVerify}
          timerKey={verifyTimerKey}
          onVerifiedChange={setIsVerifyDone}
          onVerifiedCode={setVerifiedCode}
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
      </>
    );

  return (
    <div className="min-h-dvh bg-white">
      <div className="px-5 pt-6">
        <SignupHeader onBack={goBack} onClose={() => navigate('/login')} />
      </div>

      {/* 헤더 아래 컨텐츠 영역 */}
      <main className="px-5 pt-17.5 pb-28">
        <h1 className="text-center text-2xl font-bold text-gray-800">전화번호 인증</h1>
        <div className="mt-6">{content}</div>
        {step === 'verify' && (
          <div className="mt-6">
            <Button onClick={handleComplete} disabled={!isVerifyDone || isSubmitting}>
              {isSubmitting ? '저장 중...' : '다음'}
            </Button>
          </div>
        )}
      </main>

      {/* 약관 동의 모달 */}
      <TermsAgreementModal
        isOpen={isTermsModalOpen}
        onClose={() => {
          // 모달 닫기 시 로그인으로 돌아가기
          navigate('/login');
        }}
        onConfirm={handleTermsConfirm}
        terms={TERMS}
      />
    </div>
  );
}
