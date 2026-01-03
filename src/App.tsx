import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import LedgerPage from '@/pages/LedgerPage';
import FreezePage from '@/pages/FreezePage';
import ReportPage from '@/pages/ReportPage';
import MyPage from '@/pages/MyPage';
import SignupPage from '@/pages/signup/SignUpPage';
import AuthLayout from './layouts/AuthLayout';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/freeze" element={<FreezePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/my" element={<MyPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
