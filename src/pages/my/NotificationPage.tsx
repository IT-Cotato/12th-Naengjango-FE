import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationItem, { type NotificationItemProps } from '@/components/notification/NotificationItem';
import { none } from '@/assets/index';
import { back } from '@/assets/index';
import  ablyLogo from '@/assets/images/ably.svg';

const mockNotifications: { group: string; items: NotificationItemProps[] }[] = [
  {
    group: '오늘',
    items: [
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '2시간 전',
      },
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '2시간 전',
      },
    ],
  },
  {
    group: '어제',
    items: [
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '1일 전',
      },
    ],
  },
  {
    group: '최근 7일',
    items: [
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '2일 전',
      },
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '2일 전',
      },
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '2일 전',
      },
    ],
  },
  {
    group: '최근 14일',
    items: [
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '9일 전',
      },
      {
        logoSrc: ablyLogo,
        title: '바지바지바지... 냉동이 종료되었습니다.',
        description: '냉동을 녹여보세요!',
        time: '13일 전',
      },
    ],
  },
];

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();

  const hasNotifications = mockNotifications.some((group) => group.items.length > 0);

  return (
    <div className="px-6 pt-6 pb-6 ">
      <div className="flex items-center mb-6">
        <button type="button" onClick={() => navigate(-1)} className="">
          <img src={back} alt="back" className="w-6 h-6" />
        </button>
        <div className="w-full flex justify-center">
        <h1 className="Bold_24 text-gray-800 ">알림 내역</h1>
        </div>
      </div>

      {hasNotifications ? (
        <div className="space-y-2">
          {mockNotifications.map((group) => (
            <section key={group.group} className="space-y-3">
              <p className="Medium_15 text-gray-800 ">{group.group}</p>
              <div className="space-y-3">
                {group.items.map((item, idx) => (
                  <NotificationItem key={`${group.group}-${idx}`} {...item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-70 text-gray-400">
          <div className="w-11 h-8 flex items-center justify-center mb-4">
            <img src={none} alt="none" className="w-10 h-10" />
          </div>
          <p className="Medium_20 mb-1">알림 내역이 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
