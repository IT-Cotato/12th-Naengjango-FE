import chevron_gray_200 from '../../../assets/icons/chevron-gray-200.svg';
import chevron_gray_400 from '../../../assets/icons/chevron-gray-400.svg';
import AddApp from './AddApp';
import FreezeApp from './FreezeApp';
import { useEffect, useState } from 'react';
import AddModal from './AddModal';
import { PRESET_APPS } from '@/data/presetApps';
import AppNew from './AppNew';

const ITEMS_PER_PAGE = 8;

type FreezeAppItem =
  | { type: 'preset'; id: string; src: string }
  | { type: 'custom'; id: string; name: string }
  | { type: 'add' };

type AddResult = { type: 'preset'; appId: string } | { type: 'custom'; name: string };

export default function FreezeList() {
  const [apps, setApps] = useState<FreezeAppItem[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const totalItemCount = apps.length + 1;
  const totalPages = Math.max(1, Math.ceil(totalItemCount / ITEMS_PER_PAGE));

  const [page, setPage] = useState(totalPages - 1);
  const moveToAppPage = (appId: string) => {
    const index = apps.findIndex((app) => app.type !== 'add' && app.id === appId);

    if (index === -1) return;

    const targetPage = Math.floor(index / ITEMS_PER_PAGE);
    setPage(targetPage);
  };

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageApps = apps.slice(startIndex, endIndex);

  const addButtonIndex = apps.length; // Add 버튼의 전체 인덱스
  const isAddInThisPage = addButtonIndex >= startIndex && addButtonIndex < endIndex;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const renderItems: FreezeAppItem[] = [...pageApps];

  if (isAddInThisPage) {
    renderItems.push({ type: 'add' });
  }

  // 앱 추가/삭제로 페이지 수 줄어들었을 때 생기기, 사라지기
  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(totalPages - 1, 0));
    }
  }, [apps.length, totalPages, page]);

  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;
  const isPageFull = pageApps.length === ITEMS_PER_PAGE;

  const handleConfirmAdd = (result: AddResult) => {
    if (result.type === 'preset') {
      const preset = PRESET_APPS.find((a) => a.id === result.appId);
      if (!preset) return;

      const existingIndex = apps.findIndex((app) => app.type === 'preset' && app.id === preset.id);

      // 이미 존재하는 앱을 선택한 경우
      if (existingIndex !== -1) {
        setSelectedAppId(preset.id);
        moveToAppPage(preset.id);
        setIsAddModalOpen(false);
        return;
      }

      // 존재하지 않는 앱을 선택, 새로 추가
      setApps((prev) => [...prev, { type: 'preset', id: preset.id, src: preset.src }]);
      setSelectedAppId(preset.id);
    }

    if (result.type === 'custom') {
      const id = `custom-${Date.now()}`;

      setApps((prev) => [...prev, { type: 'custom', id, name: result.name }]);

      setSelectedAppId(id);
    }

    setIsAddModalOpen(false);
  };

  return (
    <>
      {apps.length === 0 && (
        <div
          data-layer="Frame 48096431"
          className="Frame48096431 w-[327px] top-[166px] left-0 absolute inline-flex justify-center items-center gap-2.5"
        >
          <div
            data-layer="자주 사용하는 어플을 추가하세요!"
            className="flex-1 text-center justify-center text-gray-400 Regular_15 font-sans leading-[22.50px] tracking-tight"
          >
            자주 사용하는 어플을 추가하세요!
          </div>
        </div>
      )}

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
        {renderItems.map((item) => {
          if (item.type === 'add') {
            return <AddApp key="add" onClick={() => setIsAddModalOpen(true)} />;
          }

          if (item.type === 'preset') {
            return (
              <FreezeApp
                key={item.id}
                src={item.src}
                isSelected={item.id === selectedAppId}
                onClick={() => {
                  setSelectedAppId(item.id);
                  moveToAppPage(item.id);
                }}
              />
            );
          }

          // custom
          return (
            <AppNew
              key={item.id}
              name={item.name}
              isSelected={item.id === selectedAppId}
              onClick={() => {
                setSelectedAppId(item.id);
                moveToAppPage(item.id);
              }}
            />
          );
        })}
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

      {isAddModalOpen && (
        <AddModal onClose={() => setIsAddModalOpen(false)} onConfirm={handleConfirmAdd} />
      )}
    </>
  );
}
