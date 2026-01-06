import left from '../../../assets/icons/left.svg';
import right from '../../../assets/icons/right.svg';
import AddApp from './AddApp';

export default function FreezeList() {
  return (
    <>
      <div
        data-layer="Frame 48096429"
        className="Frame48096429 w-[327px] h-[74px] px-[30px] py-2.5 left-0 top-[88px] absolute inline-flex flex-col justify-center items-center gap-2.5"
      >
        <div
          data-layer="Row1"
          className="Row1 self-stretch inline-flex items-start justify-between"
        >
          <img
            data-layer="image 150"
            className="Image150 w-14 h-14 rounded-lg border border-gray-200"
            src="https://placehold.co/54x54"
          />
          <img
            data-layer="image 151"
            className="Image151 w-14 h-14 rounded-lg"
            src="https://placehold.co/54x54"
          />
          <img
            data-layer="image 152"
            className="Image152 w-14 h-14 rounded-lg"
            src="https://placehold.co/54x54"
          />
          <img
            data-layer="image 153"
            className="Image153 w-14 h-14 rounded-lg border border-gray-200"
            src="https://placehold.co/54x54"
          />
        </div>
      </div>

      <div
        data-layer="Row2"
        className="Row2 w-[327px] px-[30px] py-2.5 left-0 top-[162px] absolute inline-flex flex-col justify-start items-start gap-2.5"
      >
        <div
          data-layer="Frame 48096427"
          className="Frame48096427 self-stretch inline-flex justify-between items-start"
        >
          <div
            data-layer="application"
            data-property-1="plus"
            className="Application w-14 h-14 relative bg-white-400 rounded-lg flex items-center justify-center overflow-hidden"
          >
            <AddApp />
          </div>
        </div>
      </div>

      <div
        data-layer="ic"
        data-property-1="ic_left"
        className="Ic w-6 h-6 left-[4px] top-[150px] absolute flex items-center justify-center"
      >
        <img src={left} alt="왼쪽 화살표" className="w-6 h-6" />
      </div>

      <div
        data-layer="ic"
        data-property-1="ic_right"
        className="Ic w-6 h-6 right-[4px] top-[150px] absolute flex items-center justify-center"
      >
        <img src={right} alt="오른쪽 화살표" className="w-6 h-6" />
      </div>
    </>
  );
}
