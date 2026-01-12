import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

export default function AuthLayout() {
  return (
    <AppShell>
      <div className="h-dvh overflow-hidden bg-white">
        <Outlet />
      </div>
    </AppShell>
  );
}
