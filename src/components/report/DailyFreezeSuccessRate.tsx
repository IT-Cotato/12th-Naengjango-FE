import React from 'react';

const DailyFreezeSuccessRate: React.FC = () => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  // 요일별 성공률 데이터
  const successRates: Record<string, number> = {
    금: 95,
    목: 78,
    수: 65,
    화: 58,
    월: 52,
    일: 45,
    토: 42,
  };

  // 성공률 순서대로 정렬
  const sortedDays = [...days].sort((a, b) => successRates[b] - successRates[a]);
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
      <p className="SemiBold_15 text-gray-800 mt-1">금요일 오후 냉동 상품 성공률이 가장 높아요!</p>
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
