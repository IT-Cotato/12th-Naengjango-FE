import { Outlet } from 'react-router-dom';
import BottomTab from '@/components/BottomTab';

const BOTTOM_TAB_HEIGHT = 80;

export default function MainLayout() {
  return (
    <div className="min-h-dvh bg-zinc-100">
      <main className="min-h-dvh bg-white" style={{ paddingBottom: `${BOTTOM_TAB_HEIGHT}px` }}>
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomTab />
      </div>
    </div>
  );
}
