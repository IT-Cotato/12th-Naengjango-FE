import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import LedgerPage from '@/pages/LedgerPage';
import FreezePage from '@/pages/FreezePage';
import ReportPage from '@/pages/ReportPage';
import MyPage from '@/pages/my/MyPage';
import MemberInfoPage from '@/pages/my/MemberInfoPage';
import NotificationPage from '@/pages/my/NotificationPage';
import UserGuidePage from '@/pages/my/UserGuidePage';
import ServiceTermsPage from '@/pages/my/ServiceTermsPage';
import PrivacyPolicyPage from '@/pages/my/PrivacyPolicyPage';
import SignupPage from '@/pages/signup/SignUpPage';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from '@/pages/login/LoginPage';
import SetupPage from '@/pages/login/SetupPage';
import OnboardingPage from '@/pages/login/OnboardingPage';
import FindIdPage from './pages/login/find/FindIdPage';
import FindPwPage from './pages/login/find/FindPwPage';
import VerifyPhonePage from './pages/login/VerifyPhonePage';
import ChangePwPage from '@/pages/my/ChangePwPage';
import ChangeBudgetPage from '@/pages/my/ChangeBudgetPage';
import InquiryPage from '@/pages/my/InquiryPage';
import FAQPage from '@/pages/my/FAQPage';
import ErrorPage from '@/pages/ErrorPage';
import { useErrorStore } from '@/stores/errorStore';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import LoadingOverlay from '@/components/common/LoadingOverlay';

function RequireAuth({ children }: { children: ReactNode }) {
  const hasToken = !!localStorage.getItem('accessToken');

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ErrorHandler() {
  const { errorType, clearError } = useErrorStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (errorType === 'auth') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      clearError();
      navigate('/login', { replace: true });
    } else if (errorType === 'other' && location.pathname !== '/error') {
      clearError();
      navigate('/error', { replace: true });
    }
  }, [errorType, navigate, location.pathname, clearError]);

  return null;
}

export default function App() {
  const { isLoading } = useLoading();
  return (
    <>
      <ErrorHandler />
      <Routes>
        <Route
          element={
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          }
        >
          <Route path="/error" element={<ErrorPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="/freeze" element={<FreezePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/my/member-info" element={<MemberInfoPage />} />
            <Route path="/my/notifications" element={<NotificationPage />} />
            <Route path="/my/guide" element={<UserGuidePage />} />
            <Route path="/my/service-terms" element={<ServiceTermsPage />} />
            <Route path="/my/privacy" element={<PrivacyPolicyPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/verify-phone" element={<VerifyPhonePage />} />
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

      {/* 전역 로딩 오버레이 */}
      {isLoading && <LoadingOverlay />}
    </>
  );
}
