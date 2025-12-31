import { Outlet } from 'react-router-dom';
import BottomTab from '../shared/BottomTab';

const TAB_H = 80; // BottomTab 높이(h-20 = 80px)

export default function AppShell() {
  return (
    <div className="min-h-dvh w-full bg-zinc-100 flex justify-center items-start py-4">
      {/* 프레임 375 x 812 고정 */}
      <div className="relative w-[375px] h-[812px] bg-white overflow-hidden rounded-2xl shadow-sm">
        {/* 스크롤은 콘텐츠 영역에서만 발생 */}
        <main
          className="h-full overflow-y-auto"
          style={{
            paddingBottom: `calc(${TAB_H}px + env(safe-area-inset-bottom))`,
          }}
        >
          <Outlet />
        </main>

        {/* 하단 탭 고정 */}
        <div className="absolute bottom-0 left-0 right-0">
          <BottomTab />
          <div className="h-[env(safe-area-inset-bottom)] bg-white" />
        </div>
      </div>
    </div>
  );
}
