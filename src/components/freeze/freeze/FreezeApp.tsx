type FreezeAppProps = {
  src: string;
  alt?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function FreezeApp({ src, alt = 'app icon', isSelected, onClick }: FreezeAppProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'w-[54px] rounded-lg',
        isSelected
          ? 'shadow-[0px_0px_10px_0px_rgba(94,151,215,1)] outline outline-2 outline-main-skyblue -outline-offset-1'
          : '',
      ].join(' ')}
    >
      <img src={src} alt={alt} />
    </div>
  );
}
