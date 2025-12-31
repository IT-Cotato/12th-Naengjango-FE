import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './app/AppShell';

import HomePage from './pages/HomePage';
import LedgerPage from './pages/LedgerPage';
import FreezePage from './pages/FreezePage';
import ReportPage from './pages/ReportPage';
import MyPage from './pages/MyPage';

export default function App() {
  return (
    <Routes>
      {/* AppShell을 사용하는 모바일 앱 영역 */}
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/freeze" element={<FreezePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/my" element={<MyPage />} />
      </Route>

      {/* 그 외 예외 처리 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
