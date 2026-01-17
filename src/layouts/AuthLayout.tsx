import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

export default function AuthLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
