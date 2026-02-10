// 고정지출 카테고리 데이터
export const FIXED_EXPENDITURE_CATEGORIES = {
  주거: [
    { id: 'rent', label: '월세' },
    { id: 'manageFee', label: '관리비' },
    { id: 'internet', label: '인터넷' },
    { id: 'utility', label: '공과금' },
  ],
  구독: [
    { id: 'ott', label: 'OTT' },
    { id: 'music', label: '음악' },
    { id: 'cloud', label: '클라우드' },
    { id: 'delivery', label: '배달앱' },
  ],
  생활: [
    { id: 'transport', label: '교통비' },
    { id: 'phone', label: '통신비' },
    { id: 'exercise', label: '운동' },
    { id: 'familyoccasion', label: '경조사' },
    { id: 'insurance', label: '보험료' },
    { id: 'etc', label: '기타' },
  ],
} as const;

// 모든 카테고리 아이템을 하나의 배열로 반환
export const getAllCategoryItems = () => {
  return [
    ...FIXED_EXPENDITURE_CATEGORIES.주거,
    ...FIXED_EXPENDITURE_CATEGORIES.구독,
    ...FIXED_EXPENDITURE_CATEGORIES.생활,
  ];
};
