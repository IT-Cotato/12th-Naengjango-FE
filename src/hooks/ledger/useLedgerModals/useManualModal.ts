import { useState } from 'react';

export default function useManualModal() {
  const [isManualOpen, setIsManualOpen] = useState(false);

  // 모달 리마운트용 key
  const [manualKey, setManualKey] = useState(0);

  const onManual = (onCloseFab: () => void) => {
    onCloseFab();

    //열 때마다 key 변경 → 완전 초기화
    setManualKey((k) => k + 1);
    setIsManualOpen(true);
  };

  const closeManual = () => {
    setIsManualOpen(false);
  };

  return {
    isManualOpen,
    manualKey, // 추가
    onManual,
    closeManual,
    setIsManualOpen, // 기존 코드 호환용
  };
}
