type AppBlackProps = {
  src: string;
  alt?: string;
};

export default function AppBlack({ src, alt = 'app icon' }: AppBlackProps) {
  return (
    <img data-layer="AppBlack" className="AppBlack size-[54px] rounded-lg" src={src} alt={alt} />
  );
}
