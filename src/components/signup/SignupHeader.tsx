import { back } from '@/assets/index';
import { close } from '@/assets/index';

type Props = {
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
};

export default function SignupHeader({ onBack, onClose, showBack = true }: Props) {
  return (
    <header className="flex h-18 items-center justify-between px-2">
      {showBack ? (
        <button type="button" onClick={onBack}>
          <img src={back} alt="back" className="flex h-6 w-6 items-center justify-center" />
        </button>
      ) : (
        <div className="h-6 w-6" />
      )}
      <button type="button" onClick={onClose}>
        <img src={close} alt="close" className="flex h-6 w-6 items-center justify-center" />
      </button>
    </header>
  );
}
