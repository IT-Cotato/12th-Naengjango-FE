import React from 'react';

interface Props {
  successRates: Record<string, number>; //요일별 성공률 
  description: string;
}

const DailyFreezeSuccessRate: React.FC<Props> = ({ successRates, description }) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  // 성공률 순서대로 정렬
  const sortedDays = [...days].sort((a, b) => (successRates[b] ?? 0) - (successRates[a] ?? 0));

  const getButtonStyle = (day: string) => {
    const rank = sortedDays.indexOf(day);
    if (rank < 1) {
      // 상위 1개: 진한 파란색
      return 'bg-[#034896] text-white-800';
    } else if (rank < 3) {
      // 중간 2개: 중간 파란색
      return 'bg-main-skyblue text-white-800';
    } else if (rank < 5) {
      // 중간 2개: 중간 파란색
      return 'bg-sub-skyblue text-white-800';
    } else {
      // 나머지: 회색
      return 'bg-gray-200 text-white-800';
    }
  };

  return (
    <div className="px-5 py-8 w-82 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
      <p className="Bold_20 text-gray-800">요일별 냉동 성공률</p>
      <p className="SemiBold_15 text-gray-800 mt-1">{description}</p>
      <div className="flex gap-2 mt-4">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            className={`
              flex-1 w-7.5 h-8 flex justify-center items-center rounded-lg transition-colors
              ${getButtonStyle(day)}
            `}
          >
            <span className="SemiBold_14">{day}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DailyFreezeSuccessRate;
