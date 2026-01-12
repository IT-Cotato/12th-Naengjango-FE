import { Outlet } from 'react-router-dom';
import BottomTab from '@/components/BottomTab';
import AppShell from './AppShell';

const BOTTOM_TAB_HEIGHT = 80;

export default function MainLayout() {
  return (
    <AppShell>
      <div className="min-h-dvh w-full overflow-x-hidden bg-zinc-100">
        <main
          className="min-h-dvh w-full overflow-y-auto overflow-x-hidden bg-white"
          style={{ paddingBottom: `${BOTTOM_TAB_HEIGHT}px` }}
        >
          <Outlet />
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomTab />
        </div>
      </div>
    </AppShell>
  );
}
