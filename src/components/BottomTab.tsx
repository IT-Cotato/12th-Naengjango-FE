import { NavLink } from 'react-router-dom';
import { TABS } from '@/constants/tabs';
import { TAB_ICONS } from '@/constants/tabIcons';

export default function BottomTab() {
  return (
    <nav className="w-full h-20 px-4 pt-2 bg-white border-b border-zinc-200 flex justify-between items-center">
      {/* tabs.ts 객체배열 순서에 따라 매핑*/}
      {TABS.map((tab) => (
        <NavLink
          key={tab.key}
          to={tab.to}
          aria-label={tab.ariaLabel}
          className="px-2 py-1 flex items-center justify-center"
        >
          {({ isActive }) => (
            <img
              src={isActive ? TAB_ICONS[tab.key].active : TAB_ICONS[tab.key].inactive}
              alt=""
              aria-hidden
              className={['w-8 h-8', isActive ? 'opacity-100' : 'opacity-70'].join(' ')}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
}
