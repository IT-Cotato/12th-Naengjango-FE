import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import LedgerPage from '@/pages/LedgerPage';
import FreezePage from '@/pages/FreezePage';
import ReportPage from '@/pages/ReportPage';
import MyPage from '@/pages/my/MyPage';
import MemberInfoPage from '@/pages/my/MemberInfoPage';
import SignupPage from '@/pages/signup/SignUpPage';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from '@/pages/login/LoginPage';
import SetupPage from '@/pages/login/SetupPage';
import FindIdPage from './pages/login/find/FindIdPage';
import FindPwPage from './pages/login/find/FindPwPage';
import ChangePwPage from './pages/my/ChangePwPage';
import ChangeBudgetPage from './pages/my/ChangeBudgetPage';
import InquiryPage from './pages/my/InquiryPage';
import FAQPage from './pages/my/FAQPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/freeze" element={<FreezePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/my/member-info" element={<MemberInfoPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/find-pw" element={<FindPwPage />} />
        <Route path="/my/change-pw" element={<ChangePwPage />} />
        <Route path="/my/change-budget" element={<ChangeBudgetPage />} />
        <Route path="/my/inquiry" element={<InquiryPage />} />
        <Route path="/my/faq" element={<FAQPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
