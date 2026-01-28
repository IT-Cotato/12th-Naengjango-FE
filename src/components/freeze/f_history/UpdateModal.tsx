import type { FreezeItem } from '@/types/FreezeItem';
import { useState } from 'react';
import FreezeList from '../freeze/FreezeList';
import InlineInput from '../freeze/InlineInput';

type UpdateModalProps = {
  item: FreezeItem;
  onClose: () => void;
  onSave: (updated: FreezeItem) => void;
};

export default function UpdateModal({ item, onClose, onSave }: UpdateModalProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(item.selectedAppId);

  const [resetKey, setResetKey] = useState(0); // FreezeList 요구사항 유지용
  const [price, setPrice] = useState(item.price.toLocaleString());
  const [product, setProduct] = useState(item.title);

  return (
    <>
      <div
        data-layer="Frame 26"
        className="Frame26 fixed inset-0 z-51 bg-gray-800/30 overflow-hidden"
        onClick={onClose}
      >
        <div
          className="w-[375px] h-[397px] absolute bottom-0 bg-white-800 rounded-tl-[30px] rounded-tr-[30px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            data-layer="Resize Indicator"
            className="ResizeIndicator w-[45px] h-1 left-[210px] top-[17px] absolute origin-top-left -rotate-180 bg-gray-200 rounded-xs z-1"
            onClick={onClose}
          />

          <button
            data-property-1="action"
            className="w-[327px] h-14 px-4 py-2 left-[24px] top-[307px] absolute bg-main-skyblue rounded-[10px] justify-center items-center"
            onClick={() => {
              onSave({
                ...item,
                selectedAppId,
                title: product,
                price: Number(price.replace(/,/g, '')),
              });
            }}
          >
            <span className=" text-white-800 Bold_16 font-pretendard leading-none">수정 완료</span>
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

          <div className="absolute -top-[40px] left-[25px] w-fill justify-center items-center">
            <FreezeList
              selectedAppId={selectedAppId}
              onSelectApp={setSelectedAppId}
              resetKey={resetKey}
            />
          </div>
        </div>
      </div>
    </>
  );
}
