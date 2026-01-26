export type LedgerEntry = {
  id: string;
  date: string; // "2025.12.21"
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  memo?: string;
};

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function LedgerEntryList({
  items,
  emptyText = '내역이 없습니다',
  onItemClick,
}: {
  items: LedgerEntry[];
  emptyText?: string;
  onItemClick?: (item: LedgerEntry) => void;
}) {
  if (items.length === 0) {
    return <div className="text-center text-gray-400 py-6">{emptyText}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onItemClick?.(item)}
          className="
            w-full text-left
            px-2.5 py-3
            bg-[color:var(--color-white-800)]
            rounded-xl
            shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)]
            inline-flex justify-start items-center gap-3.5
            active:scale-[0.99]
          "
        >
          {/* left */}
          <div className="flex justify-start items-center gap-2 shrink-0">
            <div className="size-8 p-3 bg-[color:var(--color-sub-skyblue)] rounded-3xl flex justify-center items-center">
              {/* TODO: category 아이콘 매핑 */}
              <div className="size-6 relative overflow-hidden">
                <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-[color:var(--color-gray-800)]" />
              </div>
            </div>

            <div className="text-center text-[color:var(--color-gray-400)] text-base font-medium leading-6 tracking-tight">
              {item.category || '기타'}
            </div>
          </div>

          {/* middle (굵게 X) */}
          <div className="flex-1 text-[color:var(--color-gray-800)] text-base font-normal leading-6 tracking-tight line-clamp-1">
            {item.description || '(내역 없음)'}
          </div>

          {/* right */}
          <div
            className={[
              'text-center text-[color:var(--color-error)] text-lg font-medium leading-7 tracking-tight shrink-0',
              item.type === 'income' ? 'text-[color:var(--color-main-skyblue)]' : '',
            ].join(' ')}
          >
            {formatWon(item.amount)}
          </div>
        </button>
      ))}
    </div>
  );
}
