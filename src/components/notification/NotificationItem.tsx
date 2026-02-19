import React from 'react';

export interface NotificationItemProps {
  id: number;
  logoSrc: string;
  title: string; // 상품명
  description: string; // "냉동을 녹여보세요!"
  time: string;
  isRead?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  logoSrc,
  title,
  description,
  time,
  isRead = false,
}) => {
  // 🔹 title이 6글자 이상이면 "6글자 + …"
  const shortTitle = title.length > 5 ? `${title.slice(0, 5)}...` : title;

  return (
    <div
      className={`flex items-start gap-4 px-4 py-3 rounded-[8px] ${
        isRead ? 'bg-white-600' : 'bg-sub-skyblue'
      }`}
    >
      <img src={logoSrc} alt="" className="w-13.5 h-13.5 object-contain rounded-[12px]" />

      <div className="flex-1">
        {/* 🔹 title + 고정 문구(같은 줄) */}
        <p className="Medium_15 text-gray-800 truncate">{shortTitle}의 냉동이 종료되었습니다.</p>

        {/* 🔹 다음 줄: 설명 + 시간 */}
        <p className="Medium_15 text-gray-800 mt-1">
          {description}
          <span className="Regular_12 text-gray-400 ml-2">{time}</span>
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
