import chevron_gray_200 from '../../../assets/icons/chevron-gray-200.svg';
import chevron_gray_400 from '../../../assets/icons/chevron-gray-400.svg';
import AddApp from './AddApp';
import FreezeApp from './FreezeApp';
import { useEffect, useState } from 'react';
import AddModal from './AddModal';
import { PRESET_APPS } from '@/data/presetApps';
import AppNew from './AppNew';
import AlertModal from '@/components/common/AlertModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ITEMS_PER_PAGE = 8;

type FreezeAppItem =
  | { type: 'preset'; id: string; src: string; favId: number }
  | { type: 'custom'; id: string; name: string; favId: number }
  | { type: 'add' };

type AddResult = { type: 'preset'; appId: string } | { type: 'custom'; name: string };

type FreezeListProps = {
  selectedAppId: string | null;
  onSelectApp: (id: string | null) => void;
  resetKey?: number;
};

export default function FreezeList({ selectedAppId, onSelectApp, resetKey }: FreezeListProps) {
  const [apps, setApps] = useState<FreezeAppItem[]>([]);
  //const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const totalItemCount = apps.length + 1;
  const totalPages = Math.max(1, Math.ceil(totalItemCount / ITEMS_PER_PAGE));

  const [page, setPage] = useState(totalPages - 1);
  const moveToAppPage = (appId: string) => {
    const index = apps.filter((app) => app.type !== 'add').findIndex((app) => app.id === appId);

    if (index === -1) return;

    const targetPage = Math.floor(index / ITEMS_PER_PAGE);
    setPage(targetPage);
  };

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageApps = apps.slice(startIndex, endIndex);

  const addButtonIndex = apps.length; // Add 버튼의 전체 인덱스
  const isAddInThisPage = addButtonIndex >= startIndex && addButtonIndex < endIndex;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const renderItems: FreezeAppItem[] = [...pageApps];

  useEffect(() => {
    async function fetchFavoriteApps() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/favorite-apps`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('앱 목록 조회 실패:', res.status);
          return;
        }

        const data = await res.json();

        const mapped: FreezeAppItem[] = data.result.map((item: any) => {
          const isPreset = PRESET_APPS.some((p) => p.id === item.appName);

          if (isPreset) {
            // preset이면 PRESET_APPS에서 src 찾아오기
            const preset = PRESET_APPS.find((p) => p.id === item.appName);

            return {
              type: 'preset',
              id: item.appName,
              src: preset ? preset.src : '', // 이미지 없을 일은 없지만 fallback 포함
              favId: item.id, //삭제용
            };
          }

          // preset에 없는 → custom
          return {
            type: 'custom',
            id: item.appName,
            name: item.appName,
            favId: item.id, //삭제용
          };
        });
        setApps(mapped);
      } catch (error) {
        console.error('앱 목록 조회 중 에러 발생:', error);
      }
    }

    fetchFavoriteApps();
  }, []);

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

  const handleConfirmAdd = async (result: AddResult) => {
    let appName = '';

    if (result.type === 'preset') {
      const preset = PRESET_APPS.find((a) => a.id === result.appId);
      if (!preset) return;

      // 이미 존재하는 preset인지 검사
      const exists = apps.some((app) => app.type === 'preset' && app.id === preset.id);
      if (exists) {
        alert('이미 추가된 앱이에요!');
        return; // → API 호출 막기
      }

      appName = preset.id;
    }

    if (result.type === 'custom') {
      appName = result.name;
    }

    // 1) POST API 호출
    let favId = null;
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/api/favorite-apps`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appName }),
      });

      const data = await response.json();
      console.log('Add favorite app response:', data);

      if (!data.isSuccess) {
        alert('앱 추가에 실패했습니다.');
        return;
      }

      favId = 0; // ← 핵심!
    } catch (e) {
      console.error(e);
      alert('서버 요청에 실패했습니다.');
      return;
    }

    // 2) 성공 후 앱 리스트에 추가
    if (result.type === 'preset') {
      const preset = PRESET_APPS.find((a) => a.id === result.appId);
      if (!preset) return;

      setApps((prev) => [
        ...prev,
        {
          type: 'preset',
          id: preset.id,
          src: preset.src,
          favId, // ← 필수!
        },
      ]);

      onSelectApp(preset.id);
      moveToAppPage(preset.id);
    }

    if (result.type === 'custom') {
      const id = result.name;

      setApps((prev) => [
        ...prev,
        {
          type: 'custom',
          id,
          name: result.name,
          favId, // ← 필수!
        },
      ]);

      onSelectApp(id);
      moveToAppPage(id);
    }

    setIsAddModalOpen(false);
  };

  useEffect(() => {
    if (resetKey !== undefined) {
      onSelectApp(null);
    }
  }, [resetKey]);

  useEffect(() => {
    if (selectedAppId) {
      moveToAppPage(selectedAppId);
    }
  }, [selectedAppId]);

  const handleDeleteApp = async (appId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/favorite-apps/${appId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!data.isSuccess) {
        console.error('삭제 실패:', data.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('삭제 요청 중 오류:', error);
      return false;
    }
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
        onClick={() => {
          if (isDeleteMode) {
            setIsDeleteMode(false);
          }
        }}
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
                showDelete={isDeleteMode}
                onClick={() => {
                  if (!isDeleteMode) {
                    onSelectApp(selectedAppId === item.id ? null : item.id);
                    moveToAppPage(item.id);
                  }
                }}
                onLongPress={() => {
                  setIsDeleteMode(true);
                }}
                onDeleteClick={() => {
                  setDeleteTargetId(item.favId);
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
                if (!isDeleteMode) {
                  onSelectApp(selectedAppId === item.id ? null : item.id);
                  moveToAppPage(item.id);
                }
              }}
              showDelete={isDeleteMode}
              onLongPress={() => {
                setIsDeleteMode(true);
              }}
              onDeleteClick={() => {
                setDeleteTargetId(item.favId);
              }}
            />
          );
        })}

        {/* 왼쪽 화살표 */}
        {!isFirstPage && (
          <button
            onClick={() => setPage((p) => p - 1)}
            className="group w-6 h-6 absolute left-[4px] top-[62px]
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
            className="group w-6 h-6 absolute right-[4px] top-[62px]
                     flex items-center justify-center"
          >
            <img src={chevron_gray_200} className="group-hover:hidden scale-x-[-1]" />
            <img src={chevron_gray_400} className="hidden group-hover:block" />
          </button>
        )}
      </div>

      {isAddModalOpen && (
        <AddModal onClose={() => setIsAddModalOpen(false)} onConfirm={handleConfirmAdd} />
      )}

      <AlertModal
        isOpen={deleteTargetId !== null}
        onClose={() => {
          setDeleteTargetId(null);
          setIsDeleteMode(false);
        }}
        title="어플을 삭제하시겠습니까"
        message="다시 추가할 수 있어요."
        twoButtons={{
          leftText: '취소',
          rightText: '삭제',
          onRight: async () => {
            if (!deleteTargetId) return;
            handleDeleteApp(deleteTargetId);
            setApps((prev) =>
              prev.filter((app) => app.type === 'add' || app.favId !== deleteTargetId),
            );
            setDeleteTargetId(null);
            setIsDeleteMode(false);
          },
        }}
      />
    </>
  );
}
