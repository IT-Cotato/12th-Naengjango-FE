type FreezeAppProps = {
  src: string;
  alt?: string;
};

export default function FreezeApp({ src, alt = 'app icon' }: FreezeAppProps) {
  return <img src={src} alt={alt} />;
}
