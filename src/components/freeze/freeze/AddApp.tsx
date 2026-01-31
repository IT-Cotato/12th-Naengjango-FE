import plus from '../../../assets/icons/plus.svg';

type AddAppProps = {
  onClick?: () => void;
};

export default function AddApp({ onClick }: AddAppProps) {
  return (
    <>
      <div
        data-layer="application"
        data-property-1="plus"
        className="Application w-[54px] h-[54px] relative bg-white-400 rounded-lg flex items-center justify-center overflow-hidden"
        onClick={onClick}
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
