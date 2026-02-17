import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Toggle from '@/components/my/Toggle';
import MenuItem from '@/components/my/MenuItem';
import { getMe } from '@/apis/my/mypage';
import { useAccountStatus } from '@/hooks/my/useAccountStatus';

export default function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState<string>('');
  const { todayRemaining, budgetDiff } = useAccountStatus();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [showInquiryComplete, setShowInquiryComplete] = useState(false);
  const processedStateKeyRef = useRef<string | null>(null);

  // 내 정보 조회
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    getMe(accessToken)
      .then((res) => {
        if (res.result?.name) {
          setName(res.result.name);
        }
      })
      .catch((e) => {
        console.error('내 정보 조회 실패:', e);
      });
  }, []);

  // location.state에서 완료 메시지 표시
  useEffect(() => {
    const state = location.state as { inquiryCompleted?: boolean } | null;
    const currentKey = location.key;

    // 같은 location.key에서 이미 처리했다면 무시
    if (state?.inquiryCompleted && processedStateKeyRef.current !== currentKey) {
      processedStateKeyRef.current = currentKey;

      // 메시지 표시
      setShowInquiryComplete(true);

      // state 제거 (뒤로가기 시 다시 표시되지 않도록)
      window.history.replaceState({}, '', '/my');
    }
  }, [location.state, location.key]);

  // showInquiryComplete가 true일 때 2초 후 숨기기
  useEffect(() => {
    if (showInquiryComplete) {
      const timer = setTimeout(() => {
        setShowInquiryComplete(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showInquiryComplete]);

  const menuItems = [
    { label: '회원 정보', onClick: () => navigate('/my/member-info') },
    { label: '예산 수정', onClick: () => navigate('/my/change-budget') },
    { label: '이용 설명서', onClick: () => navigate('/my/guide') },
    { label: '서비스 이용 약관', onClick: () => navigate('/my/service-terms') },
    { label: '개인정보 처리 방침', onClick: () => navigate('/my/privacy') },
    { label: 'FAQ', onClick: () => navigate('/my/faq') },
    { label: '문의하기', onClick: () => navigate('/my/inquiry') },
  ];

  return (
    <>
      <h1 className="Bold_24 text-gray-800 pt-15 pl-6">{name || '...'}님</h1>
      <p className="Medium_16 text-gray-800 pl-6">
        오늘{' '}
        <span className="text-main-skyblue">
          {todayRemaining !== null
            ? `${todayRemaining.toLocaleString()}원`
            : '...원'}
          {budgetDiff !== null && budgetDiff !== 0 && (
            <span className={budgetDiff > 0 ? 'text-main-skyblue' : 'text-red-500'}>
              ({Math.abs(budgetDiff).toLocaleString()}
              {budgetDiff > 0 ? '▲' : '▼'})
            </span>
          )}
        </span>{' '}
        쓸 수 있어요!
      </p>
      <div className="flex items-center justify-between border-none rounded-[10px] bg-sub-skyblue w-[327px] h-[60px] mt-6 px-4 py-2 mx-auto">
        <p className="SemiBold_15 text-gray-800">냉동 만료 알림</p>
        <Toggle checked={isNotificationEnabled} onChange={setIsNotificationEnabled} />
      </div>
      <div className="mt-6 w-[327px] h-[420px] mx-auto border border-white-400 rounded-[10px] overflow-hidden">
        {menuItems.map((item) => (
          <MenuItem key={item.label} label={item.label} onClick={item.onClick} />
        ))}
      </div>
      {showInquiryComplete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-20 pointer-events-none">
          <div className="w-[151px] h-[32px] border border-gray-200 bg-[#FFFFFF] rounded-[10px] px-4 py-2">
            <p className="Regular_12 text-gray-800">문의가 완료되었습니다.</p>
          </div>
        </div>
      )}
    </>
  );
}
