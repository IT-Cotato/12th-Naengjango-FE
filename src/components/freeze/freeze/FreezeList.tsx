import chevron_gray_200 from '../../../assets/icons/chevron-gray-200.svg';
import chevron_gray_400 from '../../../assets/icons/chevron-gray-400.svg';
import AddApp from './AddApp';
import * as images from '@/assets/images';
import FreezeApp from './FreezeApp';

export default function FreezeList() {
  return (
    <>
      <div
        data-layer="Frame 48096429"
        className="Frame48096429 w-[327px] h-[74px] px-[30px] py-2.5 left-0 top-[88px] absolute inline-flex flex-row justify-start items-start gap-[17px]"
      >
        <FreezeApp src={images.ably} />
        <FreezeApp src={images.musinsa} />
        <FreezeApp src={images.kream} />
        <FreezeApp src={images.coupang} />
      </div>

      <div
        data-layer="Row2"
        className="Row2 w-[327px] h-[74px] px-[30px] py-2.5 left-0 top-[162px] absolute inline-flex flex-row justify-start items-start gap-[17px]"
      >
        <div
          data-layer="application"
          data-property-1="plus"
          className="Application w-[54px] h-[54px] relative bg-white-400 rounded-lg flex items-center justify-center overflow-hidden"
        >
          <AddApp />
        </div>
      </div>

      <div
        data-layer="ic"
        data-property-1="ic_left"
        className="group w-6 h-6 left-[4px] top-[150px] absolute flex items-center justify-center"
      >
        <img src={chevron_gray_200} alt="왼쪽 화살표" className="w-6 h-6 group-hover:hidden" />
        <img
          src={chevron_gray_400}
          alt="왼쪽 화살표 hover"
          className="w-6 h-6 hidden rotate-90 group-hover:block"
        />
      </div>

      <div
        data-layer="ic"
        data-property-1="ic_right"
        className="group w-6 h-6 right-[4px] top-[150px] absolute flex items-center justify-center"
      >
        <img
          src={chevron_gray_200}
          alt="오른쪽 화살표"
          className="w-6 h-6 scale-x-[-1] group-hover:hidden"
        />
        <img
          src={chevron_gray_400}
          alt="오른쪽 화살표 hover"
          className="w-6 h-6 -rotate-90 hidden group-hover:block"
        />
      </div>
    </>
  );
}
