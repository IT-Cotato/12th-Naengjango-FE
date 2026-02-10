import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { back, logout, pw, quit } from '@/assets';
import MenuItem from '@/components/my/MenuItem';
import InfoItem from '@/components/my/InfoItem';
import AlertModal from '@/components/common/AlertModal';
import { logout as logoutApi , withdrawal as withdrawalApi } from '@/apis/members/login';

export default function MemberInfoPage() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const name = '냉잔고';
  const userInfo = {
    name: '냉잔고',
    id: 'jango2026',
    phone: '010-1234-5678',
    joinDate: '2025.02.20',
  };

  const handleAuthAction = async ({
    apiCall,
    errorMsg,
    isWithdrawal,
  }: {
    apiCall: (token: string) => Promise<unknown>;
    errorMsg: string;
    isWithdrawal: boolean;
  }) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      if (accessToken) {
        await apiCall(accessToken);
      }
    } catch (error) {
      console.error(errorMsg, error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (isWithdrawal) {
        localStorage.removeItem('isFirstLogin');
        setIsWithdrawModalOpen(false);
      } else {
        setIsLogoutModalOpen(false);
      }
      navigate('/login');
    }
  };

  const handleLogout = () =>
    handleAuthAction({
      apiCall: logoutApi,
      errorMsg: '로그아웃 실패:',
      isWithdrawal: false,
    });

  const handleWithdrawal = () =>
    handleAuthAction({
      apiCall: withdrawalApi,
      errorMsg: '회원 탈퇴 실패:',
      isWithdrawal: true,
    });

  const menuItems = [
    {
      label: '비밀번호 변경',
      onClick: () => navigate('/my/change-pw'),
      icon: pw,
      showChevron: false,
    },
    {
      label: '로그아웃',
      onClick: () => setIsLogoutModalOpen(true),
      icon: logout,
      showChevron: false,
    },
    {
      label: '회원 탈퇴',
      onClick: () => setIsWithdrawModalOpen(true),
      icon: quit,
      showChevron: false,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh-80px)]">
      <header className="flex h-18 items-center justify-between px-6 pt-2.5 shrink-0">
        <button type="button" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" className="h-6 w-6" />
        </button>
        <h1 className="Bold_24 text-gray-800">회원 정보</h1>
        <div className="w-6" />
      </header>
      <div className="px-6 pt-12 pl-9.5 shrink-0">
        <h2 className="Bold_24 text-gray-800">{name}님</h2>
      </div>
      <div className="mt-[41px] w-[327px] mx-auto shrink-0">
        <InfoItem label="이름" value={userInfo.name} />
        <InfoItem label="아이디" value={userInfo.id} />
        <InfoItem label="전화번호" value={userInfo.phone} />
        <InfoItem label="가입일" value={userInfo.joinDate} />
      </div>
      <div className="flex-1 flex flex-col justify-end shrink-0">
        <div className="w-full border-x-0 border-t border-b border-white-400 rounded-[10px] overflow-hidden">
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              label={item.label}
              onClick={item.onClick}
              icon={item.icon}
              showChevron={item.showChevron}
            />
          ))}
        </div>
      </div>

      {/* 로그아웃 모달 */}
      <AlertModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="정말 로그아웃하시겠습니까?"
        message={`다음 접속에서도 안전하게\n당신의 소비를 지켜드릴게요.`}
        twoButtons={{
          leftText: '취소',
          rightText: '로그아웃',
          onRight: handleLogout,
        }}
        className="h-[157px]"
        buttonClassName="h-[47px]"
      />

      {/* 회원 탈퇴 모달 */}
      <AlertModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="정말 탈퇴하시겠습니까?"
        message={`계정 및 모든 데이터가 영구 삭제됩니다.\n삭제 후에는 복구가 불가능합니다.`}
        twoButtons={{
          leftText: '취소',
          rightText: '회원 탈퇴',
          onRight: handleWithdrawal,
        }}
        className="h-[157px]"
        buttonClassName="h-[47px]"
      />
    </div>
  );
}
