// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

import BottomTab from '@/components/BottomTab';

import HomePage from '@/pages/HomePage';
import LedgerPage from '@/pages/LedgerPage';
import FreezePage from '@/pages/FreezePage';
import ReportPage from '@/pages/ReportPage';
import MyPage from '@/pages/MyPage';

const BOTTOM_TAB_HEIGHT = 80; // BottomTab 높이 (h-20)

export default function App() {
  return (
    <div className="min-h-dvh bg-zinc-100">
      {/* 페이지 영역 */}
      <main
        className="min-h-dvh bg-white"
        style={{
          paddingBottom: `${BOTTOM_TAB_HEIGHT}px`,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/freeze" element={<FreezePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 하단 네비게이션 고정 */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomTab />
      </div>
    </div>
  );
}
