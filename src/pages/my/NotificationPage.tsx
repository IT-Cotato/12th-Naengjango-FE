import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationItem, {
  type NotificationItemProps,
} from '@/components/notification/NotificationItem';
import { none } from '@/assets/index';
import { back } from '@/assets/index';
import ablyLogo from '@/assets/images/ably.svg';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NotificationResponseItem {
  id: number;
  type: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const [groupedNotifications, setGroupedNotifications] = useState<
    { group: string; items: NotificationItemProps[] }[]
  >([]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}분 전`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;

    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const groupNotifications = (notifications: NotificationResponseItem[]) => {
    const now = new Date();

    const groups: Record<string, NotificationItemProps[]> = {
      오늘: [],
      어제: [],
      '최근 7일': [],
      '최근 14일': [],
    };

    notifications.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const diffTime = now.getTime() - createdAt.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const timeString = formatTimeAgo(createdAt);

      const mapped: NotificationItemProps = {
        id: item.id,
        logoSrc: ablyLogo,
        title: item.message,
        description: item.link,
        time: timeString,
        isRead: item.isRead,
      };

      if (diffDays === 0) groups['오늘'].push(mapped);
      else if (diffDays === 1) groups['어제'].push(mapped);
      else if (diffDays <= 7) groups['최근 7일'].push(mapped);
      else if (diffDays <= 14) groups['최근 14일'].push(mapped);
    });

    return Object.entries(groups).map(([group, items]) => ({
      group,
      items,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.warn('No access token. User might not be logged in.');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        console.log(data);
        if (!data.isSuccess) return;
        const notifications: NotificationResponseItem[] = data.result.content;

        const grouped = groupNotifications(notifications);
        setGroupedNotifications(grouped);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const hasNotifications = groupedNotifications.some((group) => group.items.length > 0);

  const handleClick = async (group: string, id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.isSuccess) {
        // 읽음 처리 후 해당 알림의 isRead를 true로 업데이트
        setGroupedNotifications((prev) =>
          prev.map((g) => ({
            ...g,
            items: g.items.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
          })),
        );
        // 그룹에 따라 페이지 이동
        if (group === '오늘' || group === '어제') {
          navigate('/freeze', { state: { activeTab: 'history' } });
        } else {
          navigate('/report');
        }
      } else {
        console.error('notifications/read 실패', data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          {groupedNotifications.map(
            (group) =>
              // group.items.length가 0보다 클 때만 렌더링
              group.items.length > 0 && (
                <section key={group.group} className="space-y-3">
                  <p className="Medium_15 text-gray-800 ">{group.group}</p>
                  <div className="space-y-3">
                    {group.items.map((item, idx) => (
                      <div
                        key={`${group.group}-${idx}`}
                        onClick={() => handleClick(group.group, item.id)}
                      >
                        <NotificationItem {...item} />
                      </div>
                    ))}
                  </div>
                </section>
              ),
          )}
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
