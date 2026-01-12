import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-dvh w-full bg-zinc-100 overflow-x-hidden">
      <div className="min-h-dvh w-full bg-white overflow-x-hidden">{children}</div>
    </div>
  );
}
