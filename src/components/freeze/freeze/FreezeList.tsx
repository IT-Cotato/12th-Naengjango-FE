import chevron_gray_200 from '../../../assets/icons/chevron-gray-200.svg';
import chevron_gray_400 from '../../../assets/icons/chevron-gray-400.svg';
import AddApp from './AddApp';
import * as images from '@/assets/images';
import FreezeApp from './FreezeApp';
import { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 8;

type App = {
  id: string;
  src: string;
};

const INITIAL_APPS: App[] = [
  { id: 'ably', src: images.ably },
  { id: 'musinsa', src: images.musinsa },
  { id: 'kream', src: images.kream },
  { id: 'coupang', src: images.coupang },
  { id: 'todayhouse', src: images.todayhouse },
  { id: 'todayhouse1', src: images.todayhouse },
  { id: 'todayhouse2', src: images.todayhouse },
  { id: 'todayhouse3', src: images.todayhouse },
  { id: 'todayhouse4', src: images.todayhouse },
  { id: 'todayhouse5', src: images.todayhouse },
];

export default function FreezeList() {
  const [apps, setApps] = useState<App[]>(INITIAL_APPS);
  const totalPages = Math.ceil(apps.length / ITEMS_PER_PAGE);

  const [page, setPage] = useState(Math.max(totalPages - 1, 0));

  const pageApps = apps.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // 앱 추가/삭제로 페이지 수 줄어들었을 때 생기기, 사라지기
  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(totalPages - 1, 0));
    }
  }, [apps.length, totalPages, page]);

  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;
  const isPageFull = pageApps.length === ITEMS_PER_PAGE;

  const renderItems = isLastPage ? [...pageApps, { id: 'add', src: '' }] : pageApps;

  const handleAddApp = () => {
    setApps((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        src: images.ably, // temp
      },
    ]);
  };

  return (
    <>
      <div
        className="
          w-[327px]
          h-[148px]
          px-[30px]
          py-[10px]
          absolute
          left-0
          top-[88px]
          flex
          flex-wrap
          content-start
          gap-[17px]
        "
      >
        {renderItems.map((item) =>
          item.id === 'add' ? <AddApp key="add" /> : <FreezeApp key={item.id} src={item.src} />,
        )}
      </div>

      {/* 왼쪽 화살표 */}
      {!isFirstPage && (
        <button
          onClick={() => setPage((p) => p - 1)}
          className="group w-6 h-6 absolute left-[4px] top-[150px]
                     flex items-center justify-center"
        >
          <img src={chevron_gray_200} className="group-hover:hidden" />
          <img src={chevron_gray_400} className="hidden group-hover:block scale-x-[-1]" />
        </button>
      )}

      {/* 오른쪽 화살표 */}
      {!isLastPage && isPageFull && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="group w-6 h-6 absolute right-[4px] top-[150px]
                     flex items-center justify-center"
        >
          <img src={chevron_gray_200} className="group-hover:hidden scale-x-[-1]" />
          <img src={chevron_gray_400} className="hidden group-hover:block" />
        </button>
      )}
    </>
  );
}
