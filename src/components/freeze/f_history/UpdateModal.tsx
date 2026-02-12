import type { FreezeItem } from '@/types/FreezeItem';
import { useState } from 'react';
import FreezeList from '../freeze/FreezeList';
import InlineInput from '../freeze/InlineInput';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type UpdateModalProps = {
  item: FreezeItem;
  onClose: () => void;
  onSave: (updated: FreezeItem) => void;
};

export default function UpdateModal({ item, onClose, onSave }: UpdateModalProps) {
  const [price, setPrice] = useState(item.price.toLocaleString());
  const [product, setProduct] = useState(item.title);
  const [appName, setAppName] = useState<string | null>(item.selectedAppId);
  console.log(item);

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.warn('No access token. User might not be logged in.');
        return;
      }
      const body = {
        appName: appName,
        itemName: product,
        price: Number(price.replace(/,/g, '')),
      };
      const res = await fetch(`${API_BASE_URL}/api/freezes/${item.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(data);
      if (!data.isSuccess) {
        console.error('Freeze 수정 실패', data.message);
        return;
      }

      // 성공 시 부모 컴포넌트(FreezeHistory)에게 업데이트 전달
      onSave({
        ...item,
        title: product,
        price: Number(price.replace(/,/g, '')),
        selectedAppId: appName,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        data-layer="Frame 26"
        className="Frame26 fixed inset-0 z-51 bg-gray-800/30 overflow-hidden"
        onClick={onClose}
      >
        <div
          className=" h-[397px] w-full fixed bottom-0 left-1/2 -translate-x-1/2 bg-white-800 rounded-tl-[30px] rounded-tr-[30px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative left-1/2 -translate-x-1/2 w-[375px]">
            <div
              data-layer="Resize Indicator"
              className="ResizeIndicator w-[45px] h-1 left-[210px] top-[17px] absolute origin-top-left -rotate-180 bg-gray-200 rounded-xs z-1"
              onClick={onClose}
            />

            <button
              data-property-1="action"
              className="w-[327px] h-14 px-4 py-2 left-[24px] top-[307px] absolute bg-main-skyblue rounded-[10px] justify-center items-center"
              onClick={handleSave}
            >
              <span className=" text-white-800 Bold_16 font-pretendard leading-none">
                수정 완료
              </span>
            </button>

            <div className="w-[375px] px-11 left-0 top-[187px] absolute inline-flex justify-start items-center gap-2.5">
              <div className="flex-1 justify-start">
                <InlineInput placeholder="금액" value={price} onChange={setPrice} type="price" />
                <span className="text-gray-800 text-xl font-medium font-sans leading-[30px] tracking-tight">
                  {' '}
                  원의
                  <br />
                </span>

                <InlineInput
                  placeholder="품목"
                  value={product}
                  onChange={setProduct}
                  type="text"
                  maxLength={10}
                />
                <span className="text-gray-800 text-xl font-medium font-sans leading-[30px] tracking-tight">
                  {' '}
                  을<br />
                  결제할지 고민이에요
                </span>
              </div>
            </div>

            <div className="relative mt-2 h-[80px]">
              <div className="absolute -top-[60px] left-[25px]">
                <FreezeList selectedAppId={appName} onSelectApp={setAppName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
