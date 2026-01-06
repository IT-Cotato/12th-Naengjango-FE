import plus from '../../../assets/icons/plus.svg';

export default function AddApp() {
  return (
    <>
      <div
        data-layer="application"
        data-property-1="plus"
        className="Application w-14 h-14 relative bg-white-400 rounded-lg flex items-center justify-center overflow-hidden"
      >
        <div
          data-layer="ic"
          data-property-1="ic_plus"
          className="Ic w-6 h-6 left-[15px] top-[15px] absolute flex items-center justify-center"
        >
          <img src={plus} alt="추가 아이콘" className="w-6 h-6" />
        </div>
      </div>
    </>
  );
}
