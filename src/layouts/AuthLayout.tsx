import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="h-dvh overflow-hidden bg-white">
      <Outlet />
    </div>
  );
}
