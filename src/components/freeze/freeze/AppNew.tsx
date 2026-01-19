type AppNewProps = {
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function AppNew({ name, isSelected, onClick }: AppNewProps) {
  return (
    <div
      data-layer="application"
      className={[
        'size-[54px] px-3.5 py-[7px] bg-sub-skyblue rounded-lg inline-flex flex-col items-center justify-center overflow-hidden',
        isSelected
          ? 'shadow-[0px_0px_10px_0px_rgba(94,151,215,1)] outline outline-2 outline-main-skyblue -outline-offset-1'
          : '',
      ].join(' ')}
      title={name}
    >
      <div
        data-layer="name"
        className="w-full text-center text-gray-800 Bold_14 font-sans leading-5 tracking-tight line-clamp-2 word-break: break-all"
      >
        {name}
      </div>
    </div>
  );
}
